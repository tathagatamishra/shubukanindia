export function applyPaperPigment(material) {
  // Leave the geometry and vertex colors intact. Grain follows the bind mesh
  // through skinning and softens as it approaches the pixel size.
  material.roughness = Math.max(.86, material.roughness);
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 dragonPigmentPosition;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ndragonPigmentPosition = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", [
        "#include <common>",
        "varying vec3 dragonPigmentPosition;",
        "float dragonGrain(vec3 cell) {",
        "  vec3 p = fract(cell * vec3(0.1031, 0.11369, 0.13787));",
        "  p += dot(p, p.yxz + 19.19);",
        "  return fract((p.x + p.y) * p.z);",
        "}",
      ].join("\n"))
      .replace("#include <opaque_fragment>", [
        "vec3 pigment = dragonPigmentPosition * 31.0;",
        "vec3 footprint = fwidth(pigment);",
        "float grainFade = 1.0 - smoothstep(0.45, 1.4, max(max(footprint.x, footprint.y), footprint.z));",
        "float tooth = (dragonGrain(floor(pigment)) - 0.5) * grainFade;",
        "float wash = sin(pigment.x * 0.21 + sin(pigment.y * 0.31)) * sin(pigment.z * 0.36 + pigment.y * 0.12);",
        "float value = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));",
        "vec3 ink = value * vec3(1.07, 0.99, 0.90);",
        "outgoingLight = mix(outgoingLight, ink, 0.23) * (1.0 + tooth * 0.09 + wash * 0.035);",
        "#include <opaque_fragment>",
      ].join("\n"));
  };
}
