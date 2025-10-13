"use client";
import React from "react";
import "./Loader.scss";

export default function Loader({
  loading = false,
  message = <p>Loading</p>,
  imageUrl = "https://res.cloudinary.com/daspiwjet/image/upload/v1760355315/elephant_tdfum0.png",
  maxWidth = "12rem",
}) {
  // If not loading, render nothing
  if (!loading) return null;

  // We pass the image url as a CSS variable so the SCSS can use it for the three pieces
  // The value must be `url('...')` so we wrap it accordingly
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
      <div className="shubukan-elephant-box p-[32px]">
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
