import { normalizeTracks, sampleTrack } from "./flight-keyframes.mjs";

const legControls = [
  { id: "sweep", label: "Shoulder sweep", min: -65, max: 65, unit: "°" },
  { id: "tuck", label: "Shoulder tuck", min: -45, max: 45, unit: "°" },
  { id: "elbow", label: "Elbow bend", min: -50, max: 65, unit: "°" },
  { id: "wrist", label: "Wrist flex", min: -60, max: 60, unit: "°" },
  { id: "curl", label: "Claw curl", min: -45, max: 70, unit: "°" },
];
const whiskerControls = [
  { id: "bend", label: "Outward bend", min: -60, max: 60, unit: "°" },
  { id: "lift", label: "Lift", min: -60, max: 60, unit: "°" },
  { id: "wave", label: "Wave strength", min: -100, max: 100, unit: "%" },
];

export function appendageChannel(part, control) {
  return part + "." + control;
}

export const APPENDAGE_PARTS = [
  ["front-left", "Front left leg", .245, legControls],
  ["front-right", "Front right leg", .245, legControls],
  ["hind-left", "Rear left leg", .566, legControls],
  ["hind-right", "Rear right leg", .566, legControls],
  ["lip-left", "Left upper whisker", 0, whiskerControls],
  ["lip-right", "Right upper whisker", 0, whiskerControls],
  ["chin-left", "Left chin whisker", 0, whiskerControls],
  ["chin-right", "Right chin whisker", 0, whiskerControls],
].map(([id, label, fraction, controls]) => ({
  id, label, fraction,
  controls: controls.map((control) => ({ ...control, id: appendageChannel(id, control.id) })),
}));

const channels = APPENDAGE_PARTS.flatMap(({ controls }) => controls);

export function normalizeAppendageKeys(value) {
  return normalizeTracks(value, channels);
}

export function sampleAppendageKeys(target, profile, flight, step) {
  for (const { id } of channels) target[id] = sampleTrack(profile, flight, id, step);
}
