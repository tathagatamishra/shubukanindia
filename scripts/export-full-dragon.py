"""Export the full Blender study as a lightweight, straight-bind web rig."""
import argparse
from bisect import bisect_right
from pathlib import Path
import sys

import bpy
from mathutils import Vector, noise


ROOT_X = .38
AXIS_Z = 1.32
SPINE_STEPS = 44


def sweep(obj):
    return next((mod for mod in obj.modifiers if mod.type == "NODES" and
                 mod.node_group.name.startswith("Ryū · Editable spine")), None)


def anchor_for(mod):
    sockets = {item.name: item.identifier for item in mod.node_group.interface.items_tree
               if item.item_type == "SOCKET" and item.in_out == "INPUT"}
    inputs = mod.properties.inputs
    if inputs[sockets["Use anchor"]]["value"]:
        return round(inputs[sockets["Spine fraction"]]["value"], 5)
    return None


LIMBS = {
    "Front left": 1, "Front right": -1, "Hind left": 1, "Hind right": -1,
}


JAW_PIVOT = Vector((-.53, 0, 1.32))
JAW_ATTACHMENTS = ("Lower jaw", "Tongue")
MIXED_MOUTH_PARTS = ("Upper and lower lip", "Ivory teeth", "Palate", "Facial scales", "Two pairs of pale whiskers")


def gesture_parts(source, anchor, length):
    name = source.name
    side = LIMBS.get(name.split(" · ")[0])
    if side is not None:
        x = ROOT_X - anchor * length - .19
        return [("leg", side, Vector((x, side * .56, AXIS_Z + .05)))]
    if name.startswith(("Amber corneas", "Wrinkled orbital lids")):
        kind = "eye" if name.startswith("Amber") else "lid"
        return [(kind, side, Vector((.774, side * .594, 1.747))) for side in (-1, 1)]
    if name.startswith("Two pairs of pale whiskers"):
        return [("jaw", 0, JAW_PIVOT)] + [
            ("whisker", side, Vector((2.37, side * .475, 1.486))) for side in (-1, 1)]
    if name.startswith(JAW_ATTACHMENTS + MIXED_MOUTH_PARTS):
        return [("jaw", 0, JAW_PIVOT)]
    return []


def gesture_name(kind, anchor, side):
    joint = f"{kind}_{round(anchor * 10000):04d}"
    return f"{joint}_{'left' if side > 0 else 'right'}" if side else joint


def eased(value):
    value = min(1, max(0, value))
    return value * value * (3 - 2 * value)


def island_centers(mesh):
    # Dental rows, facial plates and orbital folds share objects with adjacent
    # parts. Keep each disconnected piece together when assigning its weight.
    parents = list(range(len(mesh.vertices)))

    def root(index):
        while index != parents[index]:
            parents[index] = parents[parents[index]]
            index = parents[index]
        return index

    for edge in mesh.edges:
        a, b = edge.vertices
        parents[root(b)] = root(a)
    sums, counts = {}, {}
    for vertex in mesh.vertices:
        group = root(vertex.index)
        if group not in sums:
            sums[group] = Vector()
            counts[group] = 0
        sums[group] += vertex.co
        counts[group] += 1
    centers = {group: total / counts[group] for group, total in sums.items()}
    return [centers[root(vertex.index)] for vertex in mesh.vertices]


def gesture_influence(name, point, center, kinds):
    side = 1 if point.y > 0 else -1
    if "leg" in kinds:
        return "leg", side, eased((abs(point.y) - .53) / .65)
    if "eye" in kinds:
        return "eye", side, 1
    if "lid" in kinds:
        return "lid", side, .17 + .83 * eased((abs(center.y) - .663) / .045)
    if name.startswith(JAW_ATTACHMENTS):
        return "jaw", 0, 1
    if "whisker" in kinds and center.z > .45:
        return "whisker", side, eased((2.13 - point.x) / 3.64)
    if name.startswith("Palate") and .8 <= center.z < 1.09:
        return "jaw", 0, eased((1.18 - point.z) / .40)
    return "jaw", 0, 1 if center.z < .96 else 0


def new_mesh(name, vertices, faces, material, colors, domain):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces, shade_flat=False)
    mesh.materials.append(material)
    pigment = mesh.color_attributes.new(name="Pigment", type="BYTE_COLOR", domain=domain)
    pigment.data.foreach_set("color", [channel for color in colors for channel in color])
    mesh.color_attributes.active_color = pigment
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def reduction(obj):
    name = obj.name
    if "flank scales" in name.lower() or "limb and wrist scales" in name:
        return .047
    if "Facial scales" in name or "Rust-copper" in name:
        return .13
    if "Skull" in name:
        return .085
    if "Dorsal fin" in name or "dorsal fin" in name or "scutes" in name.lower():
        return .16
    return .26 if len(obj.data.polygons) > 8000 else .57


def pigment_source(material):
    nodes = list(material.node_tree.nodes) if material.node_tree else []
    ramp = next((node.color_ramp for node in nodes if node.type == "VALTORGB"), None)
    length_tone = any(node.type == "ATTRIBUTE" and node.attribute_name == "length_tone" for node in nodes)
    return ramp, length_tone, tuple(material.diffuse_color)


def mesh_part(source, material):
    obj = bpy.data.objects.new(source.name, source.data.copy())
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    if len(obj.data.polygons) > 1200:
        modifier = obj.modifiers.new("Web geometry reduction", "DECIMATE")
        modifier.ratio = reduction(source)
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    mesh = obj.data
    tones = mesh.attributes.get("length_tone")
    tone_values = [datum.value for datum in tones.data] if tones else None
    materials = [pigment_source(mat) for mat in mesh.materials]

    coordinates = [vertex.co.copy() for vertex in mesh.vertices]
    grain = [.5 + .32 * noise.noise_vector(co * 4.1)[0] +
             .13 * noise.noise_vector(co * 18.0)[1] for co in coordinates]
    colors = {}
    output = [0.] * (4 * len(mesh.loops))
    for face in mesh.polygons:
        ramp, follows_length, solid = materials[face.material_index]
        face.use_smooth = True
        for loop, index in zip(face.loop_indices, face.vertices):
            key = (face.material_index, index)
            if key not in colors:
                value = grain[index]
                if follows_length and tone_values:
                    value = .24 * value + .76 * tone_values[index]
                colors[key] = tuple(ramp.evaluate(value)) if ramp else solid
            face_color = colors[key]
            output[loop * 4:loop * 4 + 4] = (*face_color[:3], 1.)
        face.material_index = 0
    mesh.materials.clear()
    mesh.materials.append(material)
    pigment = mesh.color_attributes.new(name="Pigment", type="BYTE_COLOR", domain="CORNER")
    pigment.data.foreach_set("color", output)
    mesh.color_attributes.active_color = pigment
    return obj


def groom_part(source, material):
    """Convert a sample of the authored hair strands into tapered triangular tubes."""
    data = source.data
    positions = data.attributes["position"].data
    radii = data.attributes.get("radius")
    silver = Vector((.67, .63, .57))
    cool = Vector((.35, .41, .48))
    root = Vector((.26, .22, .18))
    vertices, faces, colors = [], [], []
    for index, strand in enumerate(data.curves):
        if (index * 37 % 101) >= (23 if "crown" in source.name.lower() else 14):
            continue
        start = strand.first_point_index
        indices = list(range(start, start + strand.points_length, 4))
        if indices[-1] != start + strand.points_length - 1:
            indices.append(start + strand.points_length - 1)
        points = [positions[i].vector.copy() for i in indices]
        for step, center in enumerate(points):
            t = step / (len(points) - 1)
            radius = max(.003, min(.033, (radii.data[indices[step]].value if radii else .012) * 1.55))
            direction = (points[min(step + 1, len(points) - 1)] - points[max(0, step - 1)]).normalized()
            normal = direction.cross(Vector((0, 1, .4))).normalized() * radius
            material_color = root.lerp(silver, min(1, t * 2.2))
            if "Tail" in source.name and t > .65:
                material_color = material_color.lerp(cool, (t - .65) / .35)
            offset = len(vertices)
            for side in range(3):
                rim = normal if side == 0 else direction.cross(normal) * (.866 if side == 1 else -.866) - normal * .5
                vertices.append(center + rim)
                colors.append((*material_color, 1.))
                if step:
                    before = (side - 1) % 3
                    faces.append((offset - 3 + before, offset - 3 + side, offset + side, offset + before))
    obj = new_mesh(source.name, vertices, faces, material, colors, "POINT")
    pigment = obj.data.color_attributes["Pigment"]
    bpy.context.view_layer.objects.active = obj
    bpy.ops.geometry.color_attribute_convert(domain="CORNER", data_type=pigment.data_type)
    return obj


def make_rig(length, meshes):
    data = bpy.data.armatures.new("Dragon spine")
    rig = bpy.data.objects.new("Dragon rig", data)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    regular = [(i / SPINE_STEPS, f"spine_{i:02d}") for i in range(SPINE_STEPS + 1)]
    anchors = sorted({anchor for _, anchor, _ in meshes if anchor is not None})
    rigid = {fraction: f"anchor_{round(fraction * 10000):04d}" for fraction in anchors}
    locations = {name: (-fraction * length, 0, 0) for fraction, name in regular + list(rigid.items())}
    for _, anchor, gestures in meshes:
        for kind, side, pivot in gestures:
            name = gesture_name(kind, anchor, side)
            locations[name] = (pivot.x - ROOT_X, pivot.y, pivot.z - AXIS_Z)
    for name, location in locations.items():
        bone = data.edit_bones.new(name)
        bone.head = location
        bone.tail = bone.head + Vector((0, .12, 0))
    bpy.ops.object.mode_set(mode="OBJECT")
    return rig, regular, rigid


def skin(meshes, rig, regular, rigid, length):
    bpy.ops.object.select_all(action="DESELECT")
    for obj, anchor, gestures in meshes:
        groups = {name: obj.vertex_groups.new(name=name) for _, name in regular} if anchor is None else {
            rigid[anchor]: obj.vertex_groups.new(name=rigid[anchor])}
        gesture_groups = {
            (kind, side): obj.vertex_groups.new(name=gesture_name(kind, anchor, side))
            for kind, side, _ in gestures
        }
        kinds = {kind for kind, _, _ in gestures}
        centers = island_centers(obj.data) if obj.name.startswith(MIXED_MOUTH_PARTS + ("Wrinkled orbital lids",)) else None
        for vertex in obj.data.vertices:
            index = vertex.index
            if anchor is not None:
                weight = 0.
                if kinds:
                    center = centers[index] if centers is not None else vertex.co
                    kind, side, weight = gesture_influence(obj.name, vertex.co, center, kinds)
                    if weight > 0:
                        gesture_groups[kind, side].add([index], weight, "REPLACE")
                if weight < 1:
                    groups[rigid[anchor]].add([index], 1 - weight, "REPLACE")
            vertex.co.x -= ROOT_X
            vertex.co.z -= AXIS_Z
            if anchor is not None:
                continue
            fraction = min(1., max(0., -vertex.co.x / length))
            index = min(SPINE_STEPS - 1, bisect_right(regular, (fraction, chr(255))) - 1)
            start, first = regular[index]
            end, second = regular[index + 1]
            mix = (fraction - start) / (end - start)
            if mix < 1:
                groups[first].add([vertex.index], 1 - mix, "REPLACE")
            if mix > 0:
                groups[second].add([vertex.index], mix, "REPLACE")
        obj.select_set(True)
    merged = meshes[0][0]
    bpy.context.view_layer.objects.active = merged
    bpy.ops.object.join()
    merged.data.validate(clean_customdata=False)
    merged.name = "Full dragon · web mesh"
    merged.parent = rig
    modifier = merged.modifiers.new("Web spine skin", "ARMATURE")
    modifier.object = rig
    rig.select_set(True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:])
    bpy.ops.wm.open_mainfile(filepath=str(args.source.resolve()))
    length = bpy.context.scene["body_axis_length"]
    sources = [(obj, anchor_for(mod)) for obj in bpy.context.scene.objects if (mod := sweep(obj))]
    assert any(obj.type == "CURVES" for obj, _ in sources) and len(sources) >= 60
    bpy.ops.object.select_all(action="DESELECT")
    material = bpy.data.materials.new("Dragon · painted pigments")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Roughness"].default_value = .64
    color = nodes.new("ShaderNodeVertexColor")
    color.layer_name = "Pigment"
    material.node_tree.links.new(color.outputs["Color"], bsdf.inputs["Base Color"])

    meshes = [(mesh_part(obj, material) if obj.type == "MESH" else groom_part(obj, material),
               anchor, gesture_parts(obj, anchor, length)) for obj, anchor in sources]
    rig, regular, rigid = make_rig(length, meshes)
    skin(meshes, rig, regular, rigid, length)
    rig["spineLength"] = length
    args.output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(args.output.resolve()), export_format="GLB", use_selection=True,
                              export_extras=True, export_animations=False, export_texcoords=False,
                              export_vertex_color="MATERIAL", export_meshopt_compression_enable=True)


if __name__ == "__main__":
    main()
