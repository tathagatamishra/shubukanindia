const whiskerUniforms = `
attribute vec3 _whisker;
uniform float whiskerTime;
uniform float whiskerIdleAmount;
uniform float whiskerFlightAmount;
uniform float whiskerMobileBoost;
uniform vec4 whiskerWaveStrength;
varying float whiskerInk;

float whiskerRandom(float index, float seed) {
  return fract(sin(index * 127.1 + seed * 311.7) * 43758.5453);
}

float whiskerCrest(float index, float seed) {
  return index + 0.55 * whiskerRandom(index, seed);
}

// Travel through alternating crests and dips with different spacing and heights.
float whiskerRipple(float flow, float seed) {
  float index = floor(flow);
  if (flow < whiskerCrest(index, seed)) index -= 1.0;
  float blend = smoothstep(whiskerCrest(index, seed), whiskerCrest(index + 1.0, seed), flow);
  float crest = mix(0.24, 1.0, whiskerRandom(index, seed + 23.0));
  float dip = mix(0.24, 1.0, whiskerRandom(index + 1.0, seed + 23.0));
  return (1.0 - 2.0 * mod(index, 2.0)) * mix(crest, -dip, blend);
}
`;

const whiskerDisplacement = `
whiskerInk = 0.0;
float whiskerMotion = whiskerIdleAmount + whiskerFlightAmount;
if (_whisker.y > 0.5 && whiskerMotion > 0.0) {
  float distanceAlong = _whisker.x;
  float strength = whiskerWaveStrength[int(_whisker.y - 0.5)];
  float rootEase = smoothstep(0.0, 0.16, distanceAlong);
  float tipEase = smoothstep(0.72, 1.0, distanceAlong);
  float envelope = rootEase * (1.0 - 0.44 * tipEase);
  float seed = _whisker.y;
  float flow = 3.05 * distanceAlong - 0.68 * whiskerTime + 0.63 * seed;
  float idleHeight = mix(0.085, 0.13, whiskerMobileBoost) * whiskerIdleAmount;
  float flightHeight = mix(0.046, 0.075, whiskerMobileBoost) * whiskerFlightAmount;
  float amplitude = _whisker.z * envelope * strength * (idleHeight + flightHeight);
  transformed.y += amplitude * whiskerRipple(flow, seed);
  transformed.z += 0.27 * amplitude * whiskerRipple(flow + 0.48, seed + 17.0);

  // The original strands are subpixel-thin on phones. Keep a tapered silhouette.
  float contour = rootEase * (1.0 - 0.88 * tipEase) * whiskerMotion;
  transformed += normal * contour * mix(0.025, 0.07, whiskerMobileBoost);
  whiskerInk = contour * mix(0.18, 0.40, whiskerMobileBoost);
}
`;

export function applyPaperPigment(material, whiskerWave) {
  // Grain follows the bind mesh through skinning and softens near the pixel size.
  material.roughness = Math.max(.86, material.roughness);
  material.customProgramCacheKey = () => whiskerWave ? "dragon-paper-whisker-wave" : "dragon-paper";
  material.onBeforeCompile = (shader) => {
    if (whiskerWave) Object.assign(shader.uniforms, whiskerWave);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", [
        "#include <common>",
        "varying vec3 dragonPigmentPosition;",
        whiskerWave ? whiskerUniforms : "",
      ].join("\n"))
      .replace("#include <begin_vertex>", [
        "#include <begin_vertex>",
        "dragonPigmentPosition = position;",
        // Deform in bind space so the wave follows the posed head and jaw.
        whiskerWave ? whiskerDisplacement : "",
      ].join("\n"));
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", [
        "#include <common>",
        "varying vec3 dragonPigmentPosition;",
        whiskerWave ? "varying float whiskerInk;" : "",
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
        whiskerWave ? "outgoingLight *= 1.0 - whiskerInk;" : "",
        "#include <opaque_fragment>",
      ].join("\n"));
  };
}
