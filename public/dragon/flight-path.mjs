import { normalizeTwists } from "./dragon-twist.mjs";

export const FRAME = [752, 1449];
export const MOBILE_QUERY = "(max-width: 500px)";
export const STORAGE_KEY = "shubukan-dragon-path-v1";
export const PREVIEW_EVENT = "shubukan:dragon-preview";
export const PROFILES = ["desktop", "mobile"];
export const START_VERTEX = 9;
export const REST_VERTEX = 1;

export function isLocal(hostname) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
}

export function parsePath(d) {
  if (typeof d !== "string" || d.length > 7000) return null;
  const tokens = d.match(/[MCZ]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?/gi);
  if (!tokens || d.replace(/[MCZ]|[-+]?(?:\d*\.?\d+)(?:e[-+]?\d+)?|[\s,]/g, "")) return null;
  let cursor = 0;
  function points(command, count) {
    if (tokens[cursor++] !== command) throw new Error("Unexpected path command");
    return Array.from({ length: count }, () => {
      const x = Number(tokens[cursor++]);
      const y = Number(tokens[cursor++]);
      if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 10000 || Math.abs(y) > 10000) {
        throw new Error("Invalid path coordinate");
      }
      return { x, y };
    });
  }
  try {
    const [start] = points("M", 1);
    const curves = Array.from({ length: 11 }, () => points("C", 3));
    const end = curves.at(-1)[2];
    if (tokens[cursor++] !== "Z" || cursor !== tokens.length || end.x !== start.x || end.y !== start.y) return null;
    const hasLength = curves.some((curve) => curve.some(({ x, y }) => x !== start.x || y !== start.y));
    return hasLength ? [start, ...curves] : null;
  } catch {
    return null;
  }
}

export function pathString([start, ...curves], close = true) {
  const pair = ({ x, y }) => [x, y].map((coordinate) => Math.round(coordinate * 1000) / 1000).join(" ");
  return ["M" + pair(start), ...curves.map((curve) => "C" + curve.map(pair).join(" ")), close ? "Z" : ""].join("");
}

export function loadLayout(storage, defaults) {
  let saved;
  try {
    saved = JSON.parse(storage.getItem(STORAGE_KEY));
  } catch {
    saved = null;
  }
  const layout = { twists: {} };
  for (const profile of PROFILES) {
    layout[profile] = parsePath(saved?.[profile]) ? saved[profile] : defaults[profile];
    layout.twists[profile] = normalizeTwists(saved?.twists?.[profile] ?? defaults.twists?.[profile]);
  }
  return layout;
}

export const LAP_BODY_FRACTION = .145;
const SAMPLE_COUNT = 1200;
const lerp = (a, b, t) => a + (b - a) * t;

export function flightEase(progress) {
  return progress * progress * (3 - 2 * progress);
}

export function flightDistance(track, flight, traveled) {
  return flight === "opening"
    ? lerp(track.start, track.rest, traveled)
    : track.rest - track.length * traveled;
}

export function sampleRoute(track, distance, point) {
  const wrapped = ((distance % track.length) + track.length) % track.length;
  const index = wrapped / track.length * SAMPLE_COUNT;
  const i = Math.min(SAMPLE_COUNT - 1, Math.floor(index));
  const a = track.samples[i];
  const b = track.samples[i + 1];
  point.x = lerp(a.x, b.x, index - i);
  point.y = lerp(a.y, b.y, index - i);
  return point;
}

export function progressAtPoint(track, flight, point) {
  let closest = Infinity;
  let traveled = 0;
  let a = sampleRoute(track, flightDistance(track, flight, 0), {});
  let b = {};
  for (let i = 1; i <= SAMPLE_COUNT; i++) {
    sampleRoute(track, flightDistance(track, flight, i / SAMPLE_COUNT), b);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;
    const projected = lengthSquared > 0 ? ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared : 0;
    const t = Math.max(0, Math.min(1, projected));
    const gap = Math.hypot(point.x - a.x - t * dx, point.y - a.y - t * dy);
    if (gap + 1e-6 < closest) {
      closest = gap;
      traveled = (i - 1 + t) / SAMPLE_COUNT;
    }
    [a, b] = [b, a];
  }
  let low = 0;
  let high = 1;
  for (let i = 0; i < 18; i++) {
    const mid = (low + high) / 2;
    if (flightEase(mid) < traveled) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

export function compileTrack(commands) {
  if (!commands) return null;
  let [start] = commands;
  let previous = start;
  let length = 0;
  const measured = [{ ...start, distance: 0 }];
  const vertices = [0];
  for (const [a, b, end] of commands.slice(1)) {
    for (let step = 1; step <= 80; step++) {
      const t = step / 80;
      const u = 1 - t;
      const x = u ** 3 * start.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t ** 3 * end.x;
      const y = u ** 3 * start.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t ** 3 * end.y;
      const increment = Math.hypot(x - previous.x, y - previous.y);
      if (increment > 0) {
        length += increment;
        previous = { x, y, distance: length };
        measured.push(previous);
      }
    }
    vertices.push(length);
    start = end;
  }
  if (length < 1) return null;
  let cursor = 0;
  const samples = Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
    const distance = length * index / SAMPLE_COUNT;
    while (cursor + 2 < measured.length && measured[cursor + 1].distance < distance) cursor++;
    const a = measured[cursor];
    const b = measured[cursor + 1];
    const mix = (distance - a.distance) / (b.distance - a.distance);
    return { x: lerp(a.x, b.x, mix), y: lerp(a.y, b.y, mix) };
  });
  return { length, samples, start: vertices[START_VERTEX], rest: vertices[REST_VERTEX] };
}
