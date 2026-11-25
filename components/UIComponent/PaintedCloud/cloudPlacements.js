// Saved in the Cloud Layout Editor at 1440px and 390px.
// Offsets are in CSS pixels. Size and opacity are percentages, and flips are relative.
const desktop = {
  "header-left-rear": { x: 484, y: 4, size: 100, opacity: 20 },
  "header-left-large": { x: 6, y: 39, size: 115, opacity: 50 },
  "header-left-front": { x: 14, y: 61, size: 107, flipX: true, opacity: 20 },
  "header-right-rear": { x: -630, y: 149, size: 100, opacity: 20 },
  "header-right-large": { x: 135, y: 18, size: 117, flipX: true, opacity: 50 },
  "header-right-front": { x: 19, y: 7, size: 147, flipX: true, opacity: 20 },
  "way-rear": { x: -1, y: -39, size: 138, opacity: 20 },
  "way-large": { x: 133, y: -14, size: 115, opacity: 50 },
  "way-front": { x: 0, y: -7, size: 113, opacity: 20 },
  "gallery-rear": { x: 21, y: -21, size: 126, opacity: 20 },
  "gallery-large": { x: -42, y: 12, size: 123, flipX: true, opacity: 50 },
  "gallery-front": { x: 1, y: 15, size: 107, flipX: true, opacity: 20 },
};

const mobile = {
  "header-left-rear": { x: -45, y: 53, size: 115, flipX: true, opacity: 20 },
  "header-left-large": { x: 33, y: 9, size: 122, opacity: 50 },
  "header-left-front": { x: -17, y: 13, size: 115, flipX: true, opacity: 20 },
  "header-right-rear": { x: -2, y: -7, size: 100, flipX: true, opacity: 20 },
  "header-right-large": { x: 7, y: 17, size: 106, flipX: true, opacity: 50 },
  "header-right-front": { x: 8, y: 1, size: 110, flipX: true, opacity: 20 },
  "way-rear": { x: 16, y: -17, size: 106, opacity: 20 },
  "way-large": { x: 17, y: -4, size: 123, opacity: 50 },
  "way-front": { x: 8, y: -16, size: 104, opacity: 20 },
  "gallery-rear": { x: 11, y: 3, size: 100, opacity: 20 },
  "gallery-large": { x: -3, y: 12, size: 121, flipX: true, opacity: 50 },
  "gallery-front": { x: -8, y: -5, size: 100, flipX: true, opacity: 20 },
};

export function cloudPlacementStyle(layer) {
  if (!layer) return undefined;

  const style = {};
  for (const [profile, layers] of Object.entries({ mobile, desktop })) {
    const { x, y, size, flipX, flipY, opacity } = layers[layer];
    style[`--cloud-${profile}-x`] = x;
    style[`--cloud-${profile}-y`] = y;
    style[`--cloud-${profile}-size`] = size / 100;
    style[`--cloud-${profile}-flip-x`] = flipX ? -1 : 1;
    style[`--cloud-${profile}-flip-y`] = flipY ? -1 : 1;
    if (opacity != null) style[`--cloud-${profile}-opacity`] = opacity / 100;
  }
  return style;
}
