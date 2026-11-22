"use client";

import { useEffect, useReducer } from "react";

// Re-render when the next edit window expires, even if the page stays open.
export function useEditWindowTime(deadlines) {
  const [, refresh] = useReducer((count) => count + 1, 0);
  const now = Date.now();
  const nextDeadline = deadlines.reduce((next, deadline) => {
    const time = Date.parse(deadline);
    return time > now ? Math.min(time, next) : next;
  }, Infinity);

  useEffect(() => {
    if (!Number.isFinite(nextDeadline)) return;
    const timer = setTimeout(refresh, Math.max(1, nextDeadline - Date.now()));
    return () => clearTimeout(timer);
  }, [nextDeadline]);

  return now;
}
