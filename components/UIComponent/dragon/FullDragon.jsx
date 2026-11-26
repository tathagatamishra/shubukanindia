"use client";

import { useEffect, useRef, useState } from "react";
import defaults from "../../../public/dragon/flight-paths.json";
import {
  FRAME, MOBILE_QUERY, PREVIEW_EVENT, STORAGE_KEY, isLocal, loadLayout, parsePath,
} from "../../../public/dragon/flight-path.mjs";
import { normalizeTwists } from "../../../public/dragon/dragon-twist.mjs";
import "./full-dragon.css";

export default function FullDragon() {
  const canvasRef = useRef(null);
  const pathRef = useRef(null);
  const runtime = useRef(null);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    const canvas = canvasRef.current;
    const profile = window.matchMedia(MOBILE_QUERY);
    const local = isLocal(window.location.hostname);
    const preview = local && window.parent !== window &&
      new URLSearchParams(window.location.search).get("dragonPathPreview") === "1";
    let layout = local ? loadLayout(window.localStorage, defaults) : defaults;
    let lastPreview;
    let disposed = false;

    function activeProfile() { return profile.matches ? "mobile" : "desktop"; }

    function applyLayout() {
      path.setAttribute("d", layout[activeProfile()]);
      runtime.current?.setTwists(normalizeTwists(layout.twists?.[activeProfile()]));
      runtime.current?.refresh();
    }
    function applyPreview({ detail }) {
      if (!detail || !parsePath(detail.d) || !Number.isFinite(detail.progress)) return;
      lastPreview = detail;
      if (path.getAttribute("d") !== detail.d) path.setAttribute("d", detail.d);
      runtime.current?.setTwists(normalizeTwists(detail.twists));
      if (detail.fly) {
        runtime.current?.refresh();
        runtime.current?.setFlight(detail.opening === true);
      } else {
        runtime.current?.scrub(detail.progress, detail.opening === true);
      }
    }
    function syncStored(event) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      layout = loadLayout(window.localStorage, defaults);
      applyLayout();
    }
    function pointerDown(event) {
      if (!event.isPrimary || event.button !== 0 || event.target.closest?.("a, button, input, select, textarea, summary, [role='button']")) return;
      down = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
    function pointerUp(event) {
      const start = down;
      down = undefined;
      if (start?.id !== event.pointerId || window.getSelection()?.toString()) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) < (event.pointerType === "touch" ? 10 : 6) &&
        runtime.current?.hit(event.clientX, event.clientY)) runtime.current.setFlight();
    }
    function pointerCancel() { down = undefined; }
    let down;

    applyLayout();
    if (preview) {
      setEditing(true);
      window.addEventListener(PREVIEW_EVENT, applyPreview);
      path.closest(".d-path").dataset.dragonEditorReady = "true";
    } else {
      profile.addEventListener("change", applyLayout);
      if (local) window.addEventListener("storage", syncStored);
      window.addEventListener("pointerdown", pointerDown, { passive: true });
      window.addEventListener("pointerup", pointerUp, { passive: true });
      window.addEventListener("pointercancel", pointerCancel, { passive: true });
    }

    import("./full-dragon-scene").then(({ mountDragon }) => {
      if (disposed) return;
      const twists = normalizeTwists(layout.twists?.[activeProfile()]);
      runtime.current = mountDragon({ canvas, path, report: setStatus, preview, twists });
      if (lastPreview) applyPreview({ detail: lastPreview });
    }).catch((error) => {
      if (disposed) return;
      console.error("Could not start the homepage dragon.", error);
      setStatus("unavailable");
    });

    return () => {
      disposed = true;
      delete path.closest(".d-path")?.dataset.dragonEditorReady;
      window.removeEventListener(PREVIEW_EVENT, applyPreview);
      profile.removeEventListener("change", applyLayout);
      window.removeEventListener("storage", syncStored);
      window.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerCancel);
      runtime.current?.dispose();
      runtime.current = null;
    };
  }, []);

  return (
    <>
      <section className="d-path" data-dragon-status={status} aria-hidden={editing ? undefined : true}>
        <svg viewBox={`0 0 ${FRAME.join(" ")}`} fill="none" aria-label={editing ? "Dragon flight path" : undefined}>
          <path ref={pathRef} data-dragon-track d={defaults.desktop} />
        </svg>
      </section>
      <canvas ref={canvasRef} className="home-dragon-canvas" aria-hidden="true" />
      {/* {!editing && status !== "loading" && status !== "unavailable" && (
        <div className="home-dragon-actions" aria-label="Dragon motion">
          <button type="button" onClick={() => runtime.current?.setFlight()} disabled={status !== "ready"}>
            Fly the dragon
          </button>
          {status !== "ready" && (
            <button type="button" onClick={() => runtime.current?.togglePause()}>
              {status === "paused" ? "Resume" : "Pause"}
            </button>
          )}
        </div>
      )} */}
    </>
  );
}
