// utils/cloudinary.js
//
// Images uploaded through the admin panel live on Cloudinary and were being
// served as the original upload (e.g. a 3.6 MB PNG for a blog thumbnail).
// Cloudinary can resize + convert on the fly just by adding a transformation
// to the URL:
//   .../image/upload/v123/foo.png
//   .../image/upload/f_auto,q_auto,c_limit,w_800/v123/foo.png
// f_auto -> WebP/AVIF when the browser supports it, q_auto -> smart quality,
// c_limit,w_N -> scale down to at most N px wide (never upscales).

const UPLOAD_MARKER = "/image/upload/";

// A path segment like "c_fill,w_300" or "f_auto" is already a transformation.
const isTransformation = (segment) => /^[a-z]{1,3}_[^/]+$/.test(segment);

export function isCloudinaryUrl(url) {
  return (
    typeof url === "string" &&
    url.includes("res.cloudinary.com") &&
    url.includes(UPLOAD_MARKER)
  );
}

/**
 * Return an optimised Cloudinary URL. Non-Cloudinary URLs (local /public files,
 * other hosts) and URLs that already carry a transformation are returned as-is.
 */
export function cld(url, { width = 800, quality = "auto" } = {}) {
  if (!isCloudinaryUrl(url)) return url;
  const i = url.indexOf(UPLOAD_MARKER) + UPLOAD_MARKER.length;
  const rest = url.slice(i);
  if (isTransformation(rest.split("/")[0])) return url;
  const q = quality === "auto" || quality == null ? "q_auto" : `q_${quality}`;
  return `${url.slice(0, i)}f_auto,${q},c_limit,w_${Math.round(width)}/${rest}`;
}

/**
 * next/image loader: `<Image loader={cloudinaryLoader} ... />`.
 * Lets Cloudinary do the resizing instead of Vercel's image optimiser
 * (which has a monthly quota on the Hobby plan).
 */
export function cloudinaryLoader({ src, width, quality }) {
  return cld(src, { width, quality: quality || "auto" });
}
