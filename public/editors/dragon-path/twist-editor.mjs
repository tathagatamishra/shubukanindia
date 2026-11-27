import { MAX_TWIST, SEGMENTS } from "../../dragon/dragon-twist.mjs";
import { installKeyframeControls } from "./keyframe-controls.mjs";

export function installTwistEditor({ redrawMarker, activate, ...options }) {
  const panel = document.getElementById("twist-panel");
  const segment = document.getElementById("twist-segment");
  for (const { id, label } of SEGMENTS) segment.add(new Option(label, id));
  segment.value = "midbody";

  const controls = installKeyframeControls("twist", {
    ...options,
    valueField: "angle",
    getChannel: () => ({ id: segment.value, min: -MAX_TWIST, max: MAX_TWIST, unit: "°" }),
  });

  segment.addEventListener("change", () => {
    controls.draw();
    activate();
  });
  panel.addEventListener("focusin", activate);
  panel.addEventListener("toggle", redrawMarker);

  return {
    draw: controls.draw,
    get segment() {
      return panel.open ? SEGMENTS.find(({ id }) => id === segment.value) : null;
    },
  };
}
