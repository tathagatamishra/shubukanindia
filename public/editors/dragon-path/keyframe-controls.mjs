import { STEPS, sampleTrack, usesRestPose, withKeyframe } from "../../dragon/flight-keyframes.mjs";

export function installKeyframeControls(prefix, { getState, getChannel, update, seek, valueField = "value" }) {
  const byId = (part) => document.getElementById(prefix + "-" + part);
  const slider = byId("slider");
  const input = byId(valueField);
  const unitLabel = byId("unit");
  const add = byId("set");
  const remove = byId("remove");
  const keys = byId("keys");
  const status = byId("position");
  const displayValue = (value) => Math.round(value * 10) / 10;

  function draw() {
    const { profile, flight, step } = getState();
    const { id, min, max, unit } = getChannel();
    const rest = usesRestPose(flight, step);
    const track = profile[flight][id] ?? [];
    const restValue = profile.rest[id];
    const selected = rest ? restValue !== undefined : track.some((key) => key.step === step);
    const value = displayValue(sampleTrack(profile, flight, id, step, valueField));
    for (const control of [slider, input]) {
      control.min = min;
      control.max = max;
      control.value = value;
    }
    if (unitLabel) unitLabel.textContent = unit;
    add.disabled = selected;
    remove.disabled = !selected;
    status.textContent = rest ? "Shared resting pose" : step / 10 + "% of this flight";
    const frames = restValue === undefined ? track : [...track, { step: STEPS, [valueField]: restValue }];
    const signature = JSON.stringify([id, frames]);
    if (keys.dataset.frames !== signature) {
      keys.replaceChildren();
      for (const key of frames) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.step = key.step;
        button.textContent = (key.step === STEPS ? "Rest" : key.step / 10 + "%") + " · " +
          displayValue(key[valueField]) + unit;
        keys.append(button);
      }
      keys.dataset.frames = signature;
    }
    for (const button of keys.children) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.step) === (rest ? STEPS : step)));
    }
  }

  function edit(value) {
    const { profile, flight, step } = getState();
    update(withKeyframe(profile, flight, getChannel().id, step, value, valueField));
    draw();
  }

  slider.addEventListener("input", () => edit(Number(slider.value)));
  input.addEventListener("change", () => {
    if (input.value && input.validity.valid) edit(Number(input.value));
    else draw();
  });
  add.addEventListener("click", () => {
    const { profile, flight, step } = getState();
    edit(sampleTrack(profile, flight, getChannel().id, step, valueField));
  });
  remove.addEventListener("click", () => edit(null));
  keys.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-step]");
    if (button) seek(Number(button.dataset.step));
  });

  return { draw };
}
