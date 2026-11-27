"""Bind leg, claw and whisker chains to the authored swept meshes."""
from bisect import bisect_right
from collections import defaultdict

from mathutils import Vector


LIMB_SIDES = {"Front left": "left", "Front right": "right", "Hind left": "left", "Hind right": "right"}
DIGITS = ("Inner forward", "Middle forward", "Outer forward", "Rear thumb")
WHISKERS = "Two pairs of pale whiskers"


def ease(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)


def islands(mesh):
    parents = list(range(len(mesh.vertices)))

    def root(index):
        while index != parents[index]:
            parents[index] = parents[parents[index]]
            index = parents[index]
        return index

    for edge in mesh.edges:
        a, b = edge.vertices
        parents[root(b)] = root(a)
    groups = defaultdict(list)
    for vert in mesh.vertices:
        groups[root(vert.index)].append(vert.index)
    return groups.values()


def center(mesh, indices):
    return sum((mesh.vertices[i].co for i in indices), Vector()) / len(indices)


def ring_centers(mesh, indices, sides):
    assert len(indices) % sides == 0, f"Unexpected sweep topology in {mesh.name}"
    return [center(mesh, indices[i:i + sides]) for i in range(0, len(indices), sides)]


class Rail:
    def __init__(self, points):
        self.points = points
        self.segments = []
        for i, (a, b) in enumerate(zip(points, points[1:])):
            direction = b - a
            self.segments.append((i, a, direction, 1 / max(direction.length_squared, 1e-9)))

    def at(self, fraction):
        t = fraction * (len(self.points) - 1)
        index = min(len(self.points) - 2, int(t))
        return self.points[index].lerp(self.points[index + 1], t - index)

    def project(self, point):
        closest = float("inf")
        along = 0.
        for i, start, direction, reciprocal in self.segments:
            offset = point - start
            t = max(0, min(1, offset.dot(direction) * reciprocal))
            gap = (offset - direction * t).length_squared
            if gap < closest:
                closest, along = gap, (i + t) / len(self.segments)
        return closest, along


class Limb:
    def __init__(self, name, fraction, side, sources, bones):
        self.name = name
        self.key = f"{round(fraction * 10000):04d}_{side}"
        self.anchor = f"anchor_{round(fraction * 10000):04d}"
        self.shoulder, self.elbow, self.wrist = (kind + "_" + self.key for kind in ("leg", "elbow", "wrist"))
        self.hind = name.startswith("Hind")
        mesh = sources["shoulder to articulated wrist silhouette"].data
        rings = ring_centers(mesh, list(range(len(mesh.vertices))), 57)
        stride = 8
        self.arm = Rail(rings[::stride] + [rings[-1]])
        self.elbow_at = .40 if self.hind else .45
        for bone, position, parent in (
            (self.shoulder, self.arm.at(.08), None),
            (self.elbow, self.arm.at(self.elbow_at), self.shoulder),
            (self.wrist, self.arm.at(.83), self.elbow),
        ):
            bones[bone] = (position, parent)

        self.digits = []
        self.claws = []
        self.rails = []
        for i, digit in enumerate(DIGITS):
            mesh = sources[digit + " · three phalanges"].data
            rings = ring_centers(mesh, list(range(len(mesh.vertices))), 22)
            rail = Rail(rings[::5] + ([rings[-1]] if rings[::5][-1] != rings[-1] else []))
            name = f"digit_{self.key}_{i}"
            claw = f"claw_{self.key}_{i}"
            self.digits.append(name)
            self.claws.append(claw)
            self.rails.append(rail)
            bones[name] = (rail.at(.12), self.wrist)
            bones[claw] = (rail.at(.68), name)

    def arm_weights(self, point):
        _, t = self.arm.project(point)
        shoulder = ease((t - .035) / .20)
        elbow = ease((t - self.elbow_at + .13) / .26)
        wrist = ease((t - .70) / .27)
        return ((self.anchor, 1 - shoulder), (self.shoulder, shoulder * (1 - elbow)),
                (self.elbow, shoulder * elbow * (1 - wrist)), (self.wrist, shoulder * elbow * wrist))

    def digit_weights(self, index, point):
        _, t = self.rails[index].project(point)
        digit = ease((t - .015) / .25)
        claw = ease((t - .53) / .31)
        return ((self.wrist, 1 - digit), (self.digits[index], digit * (1 - claw)),
                (self.claws[index], digit * claw))

    def weights(self, part, mesh):
        if "three phalanges" in part:
            index = DIGITS.index(part.split(" · ")[0])
            return [self.digit_weights(index, v.co) for v in mesh.vertices]
        if "claws" in part or part.startswith(("palm and", "dorsal knuckle")):
            nail = "claws" in part
            result = [None] * len(mesh.vertices)
            for group in islands(mesh):
                position = center(mesh, group)
                if nail:
                    index = min(range(4), key=lambda i: (self.rails[i].points[-1] - position).length_squared)
                else:
                    index = min(range(4), key=lambda i: self.rails[i].project(position)[0])
                for n in group:
                    result[n] = ((self.claws[index], 1),) if nail else self.digit_weights(index, mesh.vertices[n].co)
            return result
        return [self.arm_weights(v.co) for v in mesh.vertices]


class Appendages:
    def __init__(self, sources):
        self.bones = {}
        self.limbs = {}
        self.tendrils = None
        self.whisker_wave = None
        parts, fractions = defaultdict(dict), {}
        for obj, fraction in sources:
            name, _, part = obj.name.partition(" · ")
            if name in LIMB_SIDES:
                parts[name][part] = obj
                fractions[name] = fraction
            elif name.startswith(WHISKERS):
                self.tendrils = self.whisker_weights(obj.data)
        for name, meshes in parts.items():
            self.limbs[name] = Limb(name, fractions[name], LIMB_SIDES[name], meshes, self.bones)

    def whisker_weights(self, mesh):
        result = [None] * len(mesh.vertices)
        self.whisker_wave = [0.] * (3 * len(mesh.vertices))
        for group in islands(mesh):
            rings = ring_centers(mesh, group, 8)
            centerline = [0.]
            for a, b in zip(rings, rings[1:]):
                centerline.append(centerline[-1] + (a - b).length)
            length = centerline[-1]
            fractions = [x / length for x in centerline]
            lip = len(rings) > 65
            side = "left" if rings[0].y > 0 else "right"
            strand = (1 if lip else 3) + (side == "right")
            layer = "lip" if lip else "chin"
            parent = "anchor_0000" if lip else "jaw_0000"
            stations = [0] + [bisect_right(fractions, step) - 1 for step in (.18, .36, .54, .72, .9)]
            names = []
            for i, station in enumerate(stations):
                name = f"tendril_{layer}_{side}_{i}"
                self.bones[name] = (rings[station], parent)
                names.append(name)
                parent = name

            for i, frac in enumerate(fractions):
                a = bisect_right(stations, i) - 1
                if a == len(stations) - 1:
                    weights = ((names[a], 1),)
                else:
                    begin, end = fractions[stations[a]], fractions[stations[a + 1]]
                    mix = (frac - begin) / (end - begin)
                    weights = ((names[a], 1 - mix), (names[a + 1], mix))
                for index in group[8 * i:8 * (i + 1)]:
                    result[index] = weights
                    self.whisker_wave[3 * index:3 * index + 3] = (frac, strand, length)
        return result

    def weights(self, source, mesh):
        if source.startswith(WHISKERS):
            # Give every vertex on a ring the same arc distance, strand ID and length.
            wave = mesh.attributes.new(name="_WHISKER", type="FLOAT_VECTOR", domain="POINT")
            wave.data.foreach_set("vector", self.whisker_wave)
            return self.tendrils
        name, _, part = source.partition(" · ")
        limb = self.limbs.get(name)
        return limb.weights(part, mesh) if limb else None
