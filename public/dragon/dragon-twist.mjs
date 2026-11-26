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
export const STEPS = 1000; // Tenths of a percent on the flight scrubber.

const validAngle = (angle) => Number.isFinite(angle) && Math.abs(angle) <= MAX_TWIST;
const smooth = (t) => t ** 3 * (t * (6 * t - 15) + 10);
const blend = (a, b, progress) => a + (b - a) * smooth(progress);

export function usesRestPose(flight, step) {
  return step === STEPS || (flight === "lap" && step === 0);
}

export function normalizeTwists(input) {
  const result = { rest: {}, opening: {}, lap: {} };
  for (const { id } of SEGMENTS) {
    if (validAngle(input?.rest?.[id])) result.rest[id] = input.rest[id];
    for (const flight of ["opening", "lap"]) {
      const source = input?.[flight]?.[id];
      if (!Array.isArray(source)) continue;
      const keys = new Map();
      for (const key of source.slice(0, STEPS)) {
        const { step, angle } = key ?? {};
        if (Number.isInteger(step) && step >= 0 && step < STEPS &&
          !usesRestPose(flight, step) && validAngle(angle)) keys.set(step, angle);
      }
      if (keys.size) {
        result[flight][id] = [...keys].sort(([a], [b]) => a - b).map(([step, angle]) => ({ step, angle }));
      }
    }
  }
  return result;
}

export function twistAt(profile, flight, id, step) {
  const rest = profile.rest[id] ?? 0;
  const keys = profile[flight][id] ?? [];
  let start = { step: 0, angle: flight === "lap" ? rest : 0 };
  for (const key of keys) {
    if (key.step > step) return blend(start.angle, key.angle, (step - start.step) / (key.step - start.step));
    start = key;
  }
  return blend(start.angle, rest, (step - start.step) / (STEPS - start.step));
}

export function withTwist(profile, flight, id, step, angle) {
  if (usesRestPose(flight, step)) {
    const rest = { ...profile.rest };
    if (angle == null) delete rest[id];
    else rest[id] = angle;
    return { ...profile, rest };
  }
  const keys = (profile[flight][id] ?? []).filter((key) => key.step !== step);
  if (angle != null) keys.push({ step, angle });
  keys.sort((a, b) => a.step - b.step);
  const track = { ...profile[flight] };
  if (keys.length) track[id] = keys;
  else delete track[id];
  return { ...profile, [flight]: track };
}

export function blendBodyTwist(angles, fraction) {
  for (let i = 1; i < SEGMENTS.length; i++) {
    if (fraction <= SEGMENTS[i].fraction) {
      const from = SEGMENTS[i - 1].fraction;
      return blend(angles[i - 1], angles[i], (fraction - from) / (SEGMENTS[i].fraction - from));
    }
  }
  return angles.at(-1);
}
