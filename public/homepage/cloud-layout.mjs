import { DEVICE_WIDTHS } from "./device-profiles.mjs";

export const CLOUD_LAYOUT_FILE = "cloud-position.json";
export const CLOUD_LAYOUT_VERSION = 4;
export const CLOUD_LAYOUT_STORAGE_KEY = "shubukan.cloud-layout.v1";
export const DEFAULT_CLOUD_PLACEMENT = { x: 0, y: 0, size: 100, flipX: false, flipY: false, opacity: null };

export function isLocalCloudPreview(hostname) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
}

export function normalizeCloudLayout(record) {
  if (![1, 2, 3, CLOUD_LAYOUT_VERSION].includes(record?.version)) return null;

  const layouts = {};
  for (const [profile, viewportWidth] of Object.entries(DEVICE_WIDTHS)) {
    const legacyTablet = profile === "tablet" && record.version < CLOUD_LAYOUT_VERSION && record.layouts?.tablet == null;
    const source = record.layouts?.[legacyTablet ? "mobile" : profile]?.offsets;
    if (!source || typeof source !== "object" || Array.isArray(source)) return null;

    // The old mobile offsets were rendered at 1.5× on a 768 px screen.
    const scale = legacyTablet ? 1.5 : 1;
    const offsets = Object.fromEntries(
      Object.keys(source).sort().flatMap((id) => {
        const point = source[id];
        if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return [];
        return [[id, {
          x: point.x * scale,
          y: point.y * scale,
          size: Number.isFinite(point.size) ? Math.min(200, Math.max(25, point.size)) : 100,
          flipX: point.flipX === true,
          flipY: point.flipY === true,
          opacity: Number.isFinite(point.opacity) ? Math.min(100, Math.max(0, Math.round(point.opacity))) : null,
        }]];
      }),
    );
    layouts[profile] = { viewportWidth, offsets };
  }
  return { version: CLOUD_LAYOUT_VERSION, layouts };
}

export function serializeCloudPreview(layout, fileLayout) {
  // A newer file supersedes previews saved against an older version of the file.
  return JSON.stringify({ ...layout, source: JSON.stringify(fileLayout) });
}

export function readCloudPreview(raw, fileLayout, allowOlder = false) {
  try {
    const saved = JSON.parse(raw);
    if (!saved) return null;
    if (allowOlder || saved.source === JSON.stringify(fileLayout)) return normalizeCloudLayout(saved);
    if (saved.version >= CLOUD_LAYOUT_VERSION) return null;
    const { desktop, mobile } = fileLayout.layouts;
    const legacyFile = { version: 3, layouts: { desktop, mobile } };
    if (saved.source !== JSON.stringify(legacyFile)) return null;
    // Retain a preview across the migration until the tablet defaults are edited.
    const { tablet } = normalizeCloudLayout(legacyFile).layouts;
    if (JSON.stringify(tablet) !== JSON.stringify(fileLayout.layouts.tablet)) return null;
    return normalizeCloudLayout(saved);
  } catch {
    return null;
  }
}
