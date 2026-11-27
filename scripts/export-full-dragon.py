"""Export the full Blender study as a lightweight, straight-bind web rig."""
import argparse
from bisect import bisect_right
from pathlib import Path
import sys

import bpy
from mathutils import Vector, noise

sys.path.insert(0, str(Path(__file__).resolve().parent))
from dragon_appendages import Appendages, WHISKERS, islands, center


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


JAW_PIVOT = Vector((-.53, 0, 1.32))
JAW_ATTACHMENTS = ("Lower jaw", "Tongue")
MIXED_MOUTH_PARTS = ("Upper and lower lip", "Ivory teeth", "Palate", "Facial scales")


def gesture_parts(source, anchor, length):
    name = source.name
    if name.startswith(("Amber corneas", "Wrinkled orbital lids")):
        kind = "eye" if name.startswith("Amber") else "lid"
        return [(kind, side, Vector((.774, side * .594, 1.747))) for side in (-1, 1)]
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
    result = [None] * len(mesh.vertices)
    for indices in islands(mesh):
        midpoint = center(mesh, indices)
        for index in indices:
            result[index] = midpoint
    return result

def gesture_influence(name, point, center, kinds):
    side = 1 if point.y > 0 else -1
    if "eye" in kinds:
        return "eye", side, 1
    if "lid" in kinds:
        return "lid", side, .17 + .83 * eased((abs(center.y) - .663) / .045)
    if name.startswith(JAW_ATTACHMENTS):
        return "jaw", 0, 1
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
    if len(obj.data.polygons) > 1200 and not source.name.startswith(WHISKERS):
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


def make_rig(length, meshes, appendages):
    data = bpy.data.armatures.new("Dragon spine")
    rig = bpy.data.objects.new("Dragon rig", data)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    regular = [(i / SPINE_STEPS, f"spine_{i:02d}") for i in range(SPINE_STEPS + 1)]
    anchors = sorted({anchor for _, anchor, _, _ in meshes if anchor is not None})
    rigid = {fraction: f"anchor_{round(fraction * 10000):04d}" for fraction in anchors}
    locations = {name: (-fraction * length, 0, 0) for fraction, name in regular + list(rigid.items())}
    for _, anchor, gestures, _ in meshes:
        for kind, side, pivot in gestures:
            name = gesture_name(kind, anchor, side)
            locations[name] = (pivot.x - ROOT_X, pivot.y, pivot.z - AXIS_Z)
    for name, (point, _) in appendages.bones.items():
        locations[name] = (point.x - ROOT_X, point.y, point.z - AXIS_Z)
    for name, location in locations.items():
        bone = data.edit_bones.new(name)
        bone.head = location
        bone.tail = bone.head + Vector((0, .12, 0))
    for name, (_, parent) in appendages.bones.items():
        if parent:
            data.edit_bones[name].parent = data.edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    return rig, regular, rigid


def skin(meshes, rig, regular, rigid, length):
    bpy.ops.object.select_all(action="DESELECT")
    for obj, anchor, gestures, appendage_weights in meshes:
        groups = {name: obj.vertex_groups.new(name=name) for _, name in regular} if anchor is None else {
            rigid[anchor]: obj.vertex_groups.new(name=rigid[anchor])}
        gesture_groups = {
            (kind, side): obj.vertex_groups.new(name=gesture_name(kind, anchor, side))
            for kind, side, _ in gestures
        }
        appendage_groups = {}
        if appendage_weights:
            for name in sorted({name for weights in appendage_weights for name, weight in weights if weight > 0}):
                appendage_groups[name] = (groups.get(name) or obj.vertex_groups.new(name=name))
        kinds = {kind for kind, _, _ in gestures}
        centers = island_centers(obj.data) if obj.name.startswith(MIXED_MOUTH_PARTS + ("Wrinkled orbital lids",)) else None
        for vertex in obj.data.vertices:
            index = vertex.index
            if appendage_weights:
                for name, weight in appendage_weights[index]:
                    if weight > 0:
                        appendage_groups[name].add([index], weight, 'REPLACE')
            elif anchor is not None:
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

    appendages = Appendages(sources)
    meshes = []
    for source, anchor in sources:
        obj = mesh_part(source, material) if source.type == 'MESH' else groom_part(source, material)
        meshes.append((obj, anchor, gesture_parts(source, anchor, length), appendages.weights(source.name, obj.data)))
    rig, regular, rigid = make_rig(length, meshes, appendages)
    skin(meshes, rig, regular, rigid, length)
    rig["spineLength"] = length
    args.output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(args.output.resolve()), export_format="GLB", use_selection=True,
                              export_extras=True, export_animations=False, export_texcoords=False,
                              export_attributes=True, export_vertex_color="MATERIAL",
                              export_meshopt_compression_enable=True)


if __name__ == "__main__":
    main()
