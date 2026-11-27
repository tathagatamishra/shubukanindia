"use client";

import { useEffect, useRef, useState } from "react";
import defaults from "../../../public/data/homepage/flight-paths.json";
import { MOBILE_QUERY, TABLET_QUERY } from "../../../public/homepage/device-profiles.mjs";
import {
  FRAME, PREVIEW_EVENT, STORAGE_KEY, isLocal, loadLayout, normalizeDragonSize, normalizeIdleMotion, parsePath,
} from "../../../public/dragon/flight-path.mjs";
import { normalizeTwists } from "../../../public/dragon/dragon-twist.mjs";
import { normalizeAppendageKeys } from "../../../public/dragon/dragon-appendage-keys.mjs";
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
    const mobile = window.matchMedia(MOBILE_QUERY);
    const tablet = window.matchMedia(TABLET_QUERY);
    const local = isLocal(window.location.hostname);
    const preview = local && window.parent !== window &&
      new URLSearchParams(window.location.search).get("dragonPathPreview") === "1";
    let layout = loadLayout(local ? window.localStorage : null, defaults);
    let lastPreview;
    let disposed = false;
    let mount;
    let overviewRuntime;
    let view = "site";
    const previewStatus = { site: "loading", overview: "loading" };

    function report(surface, value) {
      previewStatus[surface] = value;
      if (view === surface) setStatus(value);
    }

    function activeProfile() {
      if (mobile.matches) return "mobile";
      return tablet.matches ? "tablet" : "desktop";
    }

    function applyLayout() {
      const name = activeProfile();
      path.setAttribute("d", layout[name]);
      runtime.current?.setTwists(normalizeTwists(layout.twists?.[name]));
      runtime.current?.setAppendageKeys(normalizeAppendageKeys(layout.appendages?.[name]));
      runtime.current?.setIdleMotion(normalizeIdleMotion(layout.idleMotion?.[name]));
      runtime.current?.setDragonSize(layout.dragonSize[name]);
      runtime.current?.refresh();
    }
    function applyPreview({ detail }) {
      if (!detail || !parsePath(detail.d) || !Number.isFinite(detail.progress)) return;
      lastPreview = detail;
      const { overview, progress, opening, fly, idle } = detail;
      const nextView = overview ? "overview" : "site";
      if (view !== nextView) {
        const previous = view === "site" ? runtime.current : overviewRuntime;
        view = nextView;
        canvas.hidden = Boolean(overview);
        previous?.scrub(progress, opening);
        setStatus(previewStatus[view]);
      }
      if (path.getAttribute("d") !== detail.d) path.setAttribute("d", detail.d);
      const twists = normalizeTwists(detail.twists);
      const appendageKeys = normalizeAppendageKeys(detail.appendages);
      const idleMotion = normalizeIdleMotion(detail.idleMotion);
      const dragonSize = normalizeDragonSize(detail.dragonSize);
      if (overview) {
        if (overview.path.getAttribute("d") !== detail.d) overview.path.setAttribute("d", detail.d);
        if (overviewRuntime === undefined && mount) {
          overviewRuntime = mount({
            canvas: overview.canvas, path: overview.path, preview: true, twists, appendageKeys, idleMotion, dragonSize,
            report: (value) => report("overview", value),
            getViewportWidth: () => lastPreview?.overview?.viewportWidth,
          });
        }
      }
      const active = overview ? overviewRuntime : runtime.current;
      active?.setTwists(twists);
      active?.setAppendageKeys(appendageKeys);
      active?.setIdleMotion(idleMotion);
      active?.setDragonSize(dragonSize);
      if (fly) {
        active?.refresh();
        active?.setFlight(opening === true);
      } else {
        active?.scrub(progress, opening === true, idle === true);
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
      mobile.addEventListener("change", applyLayout);
      tablet.addEventListener("change", applyLayout);
      if (local) window.addEventListener("storage", syncStored);
      window.addEventListener("pointerdown", pointerDown, { passive: true });
      window.addEventListener("pointerup", pointerUp, { passive: true });
      window.addEventListener("pointercancel", pointerCancel, { passive: true });
    }

    import("./full-dragon-scene").then(({ mountDragon }) => {
      if (disposed) return;
      mount = mountDragon;
      const name = activeProfile();
      const twists = normalizeTwists(layout.twists?.[name]);
      const appendageKeys = normalizeAppendageKeys(layout.appendages?.[name]);
      const idleMotion = normalizeIdleMotion(layout.idleMotion?.[name]);
      runtime.current = mountDragon({
        canvas, path, preview, twists, appendageKeys, idleMotion, dragonSize: layout.dragonSize[name],
        report: (value) => report("site", value),
      });
      if (lastPreview) applyPreview({ detail: lastPreview });
    }).catch((error) => {
      if (disposed) return;
      console.error("Could not start the homepage dragon.", error);
      setStatus("unavailable");
    });

    return () => {
      disposed = true;
      canvas.hidden = false;
      delete path.closest(".d-path")?.dataset.dragonEditorReady;
      window.removeEventListener(PREVIEW_EVENT, applyPreview);
      mobile.removeEventListener("change", applyLayout);
      tablet.removeEventListener("change", applyLayout);
      window.removeEventListener("storage", syncStored);
      window.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerCancel);
      runtime.current?.dispose();
      overviewRuntime?.dispose();
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
