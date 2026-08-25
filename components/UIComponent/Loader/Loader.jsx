import React from "react";
import "./Loader.scss";

// No "use client" — purely presentational (no hooks, no browser APIs), so it can be
// server-rendered wherever it's used (a route-level `loading.js`, or as a child of
// any client component that toggles the `loading` prop from its own state).
export default function Loader({
  loading = false,
  text = "Loading, please wait...",
  message = (
    <div className="loader-message">
      <p className="loading">{text}</p>
      <p className="quote">
        The warrior who masters patience conquers battles before they begin.
      </p>
    </div>
  ),
  imageUrl = "/images/loader-elephant.png",
  maxWidth = "12rem",
}) {
  // If not loading, render nothing
  if (!loading) return null;

  // We pass the image url as a CSS variable so the CSS can use it for the three pieces.
  // The value must be `url('...')` so we wrap it accordingly.
  const cssVar = {
    "--elephant-url": `url('${imageUrl}')`,
    "--elephant-max-width": maxWidth,
  };

  return (
    <div
      className="shubukan-elephant-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={cssVar}
    >
      <div className="shubukan-elephant-box">
        <div className="elephant" aria-hidden="true">
          <div className="elephant__body" />
          <div className="elephant__body" />
          <div className="elephant__tail" />
          <div className="elephant__head" />
        </div>

        {message}
      </div>
    </div>
  );
}
