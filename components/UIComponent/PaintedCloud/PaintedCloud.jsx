"use client";

import { useEffect, useRef } from "react";
import { cloudArtwork, watchCloud } from "./cloudMotion";
import { cloudPlacementStyle } from "./cloudPlacements";
import "./PaintedCloud.css";

export default function PaintedCloud({ className, layer, small = false }) {
  const cloudRef = useRef(null);
  const canvasRef = useRef(null);
  const artwork = small ? "/assets/painted-cloud-wisp.webp" : cloudArtwork;

  useEffect(() => {
    if (small) return;

    const cloud = cloudRef.current;
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;
    let stopWatching;

    function updateMotion() {
      if (isVisible && !reducedMotion.matches) {
        stopWatching ??= watchCloud(canvas);
      } else {
        stopWatching?.();
        stopWatching = undefined;
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      updateMotion();
    });
    observer.observe(cloud);
    reducedMotion.addEventListener("change", updateMotion);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updateMotion);
      stopWatching?.();
    };
  }, [small]);

  return (
    <span
      ref={cloudRef}
      className={`painted-cloud${small ? " painted-cloud--small" : ""} ${className}`}
      data-cloud-layer={layer}
      style={cloudPlacementStyle(layer)}
      aria-hidden="true"
    >
      <span
        className="painted-cloud__art"
        style={{ "--cloud-art": `url("${artwork}")` }}
      >
        {!small && <canvas ref={canvasRef} width={600} height={200} />}
      </span>
    </span>
  );
}
