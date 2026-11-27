import { easeBetween, normalizeTracks, sampleTrack, withKeyframe } from "./flight-keyframes.mjs";
export { STEPS, usesRestPose } from "./flight-keyframes.mjs";

export const SEGMENTS = [
  { id: "head", label: "Head", fraction: 0 },
  { id: "neck", label: "Neck", fraction: .14 },
  { id: "shoulders", label: "Shoulders", fraction: .245 },
  { id: "midbody", label: "Midbody", fraction: .415 },
  { id: "hips", label: "Hips", fraction: .566 },
  { id: "tail", label: "Tail", fraction: .8 },
  { id: "tip", label: "Tail tip", fraction: 1 },
];

export const MAX_TWIST = 180;
const channels = SEGMENTS.map(({ id }) => ({ id, min: -MAX_TWIST, max: MAX_TWIST }));

export function normalizeTwists(input) {
  return normalizeTracks(input, channels, "angle");
}

export function twistAt(profile, flight, id, step) {
  return sampleTrack(profile, flight, id, step, "angle");
}

export function withTwist(profile, flight, id, step, angle) {
  return withKeyframe(profile, flight, id, step, angle, "angle");
}

export function blendBodyTwist(angles, fraction) {
  for (let i = 1; i < SEGMENTS.length; i++) {
    if (fraction <= SEGMENTS[i].fraction) {
      const from = SEGMENTS[i - 1].fraction;
      return easeBetween(angles[i - 1], angles[i], (fraction - from) / (SEGMENTS[i].fraction - from));
    }
  }
  return angles.at(-1);
}
