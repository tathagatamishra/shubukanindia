import { MAX_TWIST, SEGMENTS, STEPS, twistAt, usesRestPose, withTwist } from "./dragon-twist.mjs";

export function installTwistEditor({ getState, update, seek, redrawMarker }) {
  const byId = (id) => document.getElementById(id);
  const panel = byId("twist-panel");
  const segment = byId("twist-segment");
  const slider = byId("twist-slider");
  const field = byId("twist-angle");
  const set = byId("twist-set");
  const remove = byId("twist-remove");
  const keys = byId("twist-keys");
  const hint = byId("twist-position");

  const displayAngle = (angle) => Math.round(angle * 10) / 10;
  for (const { id, label } of SEGMENTS) segment.add(new Option(label, id));
  segment.value = "midbody";
  for (const control of [slider, field]) {
    control.min = -MAX_TWIST;
    control.max = MAX_TWIST;
  }

  function draw() {
    const { profile, flight, step } = getState();
    const id = segment.value;
    const rest = usesRestPose(flight, step);
    const track = profile[flight][id] ?? [];
    const selected = rest ? profile.rest[id] !== undefined : track.some((key) => key.step === step);
    const angle = displayAngle(twistAt(profile, flight, id, step));
    slider.value = angle;
    field.value = angle;
    set.disabled = selected;
    remove.disabled = !selected;
    hint.textContent = rest ? "Shared resting pose" : step / 10 + "% of this flight";
    const frames = profile.rest[id] === undefined ? track : [...track, { step: STEPS, angle: profile.rest[id] }];
    const signature = JSON.stringify([id, frames]);
    if (keys.dataset.frames !== signature) {
      keys.replaceChildren();
      for (const key of frames) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.step = key.step;
        button.textContent = (key.step === STEPS ? "Rest" : key.step / 10 + "%") + " · " + displayAngle(key.angle) + "°";
        keys.append(button);
      }
      keys.dataset.frames = signature;
    }
    for (const button of keys.children) {
      button.setAttribute("aria-pressed", String(Number(button.dataset.step) === (rest ? STEPS : step)));
    }
  }

  function edit(angle) {
    const { profile, flight, step } = getState();
    update(withTwist(profile, flight, segment.value, step, angle));
    draw();
  }

  segment.addEventListener("change", () => {
    draw();
    redrawMarker();
  });
  panel.addEventListener("toggle", redrawMarker);
  slider.addEventListener("input", () => edit(Number(slider.value)));
  field.addEventListener("change", () => {
    if (!field.value || !field.validity.valid) {
      draw();
      return;
    }
    edit(Number(field.value));
  });
  set.addEventListener("click", () => {
    const { profile, flight, step } = getState();
    edit(twistAt(profile, flight, segment.value, step));
  });
  remove.addEventListener("click", () => edit(null));
  keys.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-step]");
    if (button) seek(Number(button.dataset.step));
  });

  return {
    draw,
    get segment() {
      return panel.open ? SEGMENTS.find(({ id }) => id === segment.value) : null;
    },
  };
}
