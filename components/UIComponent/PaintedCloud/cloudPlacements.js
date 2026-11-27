import file from "../../../public/data/homepage/cloud-position.json";
import { DEVICE_PROFILES } from "../../../public/homepage/device-profiles.mjs";
import {
  CLOUD_LAYOUT_STORAGE_KEY,
  DEFAULT_CLOUD_PLACEMENT,
  isLocalCloudPreview,
  normalizeCloudLayout,
  readCloudPreview,
} from "../../../public/homepage/cloud-layout.mjs";

const defaults = normalizeCloudLayout(file);
let currentLayout = defaults;
const subscribers = new Set();

function updatePreview(event) {
  if (event && event.key !== null && event.key !== CLOUD_LAYOUT_STORAGE_KEY) return;

  try {
    const saved = window.localStorage.getItem(CLOUD_LAYOUT_STORAGE_KEY);
    currentLayout = readCloudPreview(saved, defaults) ?? defaults;
  } catch {
    currentLayout = defaults;
  }
  subscribers.forEach((notify) => notify());
}

export function subscribeCloudLayout(notify) {
  if (!isLocalCloudPreview(window.location.hostname)) return () => {};

  if (subscribers.size === 0) {
    updatePreview();
    window.addEventListener("storage", updatePreview);
  }
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
    if (subscribers.size === 0) window.removeEventListener("storage", updatePreview);
  };
}

export const getCloudLayout = () => currentLayout;
export const getDefaultCloudLayout = () => defaults;

export function cloudPlacementStyle(layer, layout) {
  if (!layer) return undefined;

  const style = {};
  for (const profile of DEVICE_PROFILES) {
    const { x, y, size, flipX, flipY, opacity } = layout?.layouts[profile].offsets[layer]
      ?? defaults?.layouts[profile].offsets[layer]
      ?? DEFAULT_CLOUD_PLACEMENT;
    style[`--cloud-${profile}-x`] = x;
    style[`--cloud-${profile}-y`] = y;
    style[`--cloud-${profile}-size`] = size / 100;
    style[`--cloud-${profile}-flip-x`] = flipX ? -1 : 1;
    style[`--cloud-${profile}-flip-y`] = flipY ? -1 : 1;
    if (opacity != null) style[`--cloud-${profile}-opacity`] = opacity / 100;
  }
  return style;
}
