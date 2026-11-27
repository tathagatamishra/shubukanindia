import { APPENDAGE_PARTS } from "../../dragon/dragon-appendage-keys.mjs";
import { installKeyframeControls } from "./keyframe-controls.mjs";

export function installAppendageEditor({ redrawMarker, activate, ...options }) {
  const panel = document.getElementById("appendage-panel");
  const part = document.getElementById("appendage-part");
  const adjustment = document.getElementById("appendage-control");
  const byId = new Map(APPENDAGE_PARTS.map((item) => [item.id, item]));
  for (const { id, label } of APPENDAGE_PARTS) part.add(new Option(label, id));

  function setOptions() {
    const previous = adjustment.value.split(".").at(-1);
    const channels = byId.get(part.value).controls;
    adjustment.replaceChildren(...channels.map(({ id, label }) => new Option(label, id)));
    const same = channels.find(({ id }) => id.endsWith("." + previous));
    if (same) adjustment.value = same.id;
  }

  setOptions();
  const controls = installKeyframeControls("appendage", {
    ...options,
    getChannel: () => byId.get(part.value).controls.find(({ id }) => id === adjustment.value),
  });

  part.addEventListener("change", () => {
    setOptions();
    controls.draw();
    activate();
  });
  adjustment.addEventListener("change", controls.draw);
  panel.addEventListener("focusin", activate);
  panel.addEventListener("toggle", () => {
    if (panel.open) activate();
    else redrawMarker();
  });

  return {
    draw: controls.draw,
    get segment() { return panel.open ? byId.get(part.value) : null; },
  };
}
