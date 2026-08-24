import React from "react";
import "./Loader.css";

// No "use client" — purely presentational (no hooks, no browser APIs), so it can be
// server-rendered wherever it's used: as a route-level `loading.js`, or as a child of
// a client component that toggles the `loading` prop from its own state.
export default function Loader({
  loading = false,
  text = "Loading, please wait...",
  message = (
    <div className="gef-loader-message">
      <p className="loading">{text}</p>
      <p className="quote">
        The warrior who masters patience conquers battles before they begin.
      </p>
    </div>
  ),
  imageUrl = "/images/loader-elephant.png",
  maxWidth = "12rem",
}) {
  if (!loading) return null;

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
