export const STEPS = 1000; // Tenths of a percent on the flight scrubber.

export function easeBetween(a, b, t) {
  return a + (b - a) * (t ** 3 * (t * (6 * t - 15) + 10));
}

export function usesRestPose(flight, step) {
  return step === STEPS || (flight === "lap" && step === 0);
}

export function normalizeTracks(input, channels, field = "value") {
  const result = { rest: {}, opening: {}, lap: {} };
  for (const { id, min, max } of channels) {
    const valid = (value) => Number.isFinite(value) && value >= min && value <= max;
    if (valid(input?.rest?.[id])) result.rest[id] = input.rest[id];
    for (const flight of ["opening", "lap"]) {
      const source = input?.[flight]?.[id];
      if (!Array.isArray(source)) continue;
      const keys = new Map();
      for (const key of source.slice(0, STEPS)) {
        if (Number.isInteger(key?.step) && key.step >= 0 && key.step < STEPS &&
          !usesRestPose(flight, key.step) && valid(key[field])) keys.set(key.step, key[field]);
      }
      if (keys.size) result[flight][id] = [...keys].sort(([a], [b]) => a - b).map(([step, value]) => ({ step, [field]: value }));
    }
  }
  return result;
}

export function sampleTrack(profile, flight, id, step, field = "value") {
  const rest = profile.rest[id] ?? 0;
  const keys = profile[flight][id] ?? [];
  let fromStep = 0;
  let fromValue = flight === "lap" ? rest : 0;
  for (const key of keys) {
    if (key.step > step) {
      return easeBetween(fromValue, key[field], (step - fromStep) / (key.step - fromStep));
    }
    fromStep = key.step;
    fromValue = key[field];
  }
  return easeBetween(fromValue, rest, (step - fromStep) / (STEPS - fromStep));
}

export function withKeyframe(profile, flight, id, step, value, field = "value") {
  if (usesRestPose(flight, step)) {
    const rest = { ...profile.rest };
    if (value == null) delete rest[id];
    else rest[id] = value;
    return { ...profile, rest };
  }
  const keys = (profile[flight][id] ?? []).filter((key) => key.step !== step);
  if (value != null) keys.push({ step, [field]: value });
  keys.sort((a, b) => a.step - b.step);
  const track = { ...profile[flight] };
  if (keys.length) track[id] = keys;
  else delete track[id];
  return { ...profile, [flight]: track };
}
