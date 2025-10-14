"use client";
import React from "react";
import "./Loader.scss";

export default function Loader({
  loading = false,
  text="Loading, please wait...",
  message = (
    <div className="loader-message w-full max-w-[720px] mt-4 flex flex-col items-center">
      <p className="loading text-[16px] sm:text-[18px] font-[600] text-[#252b32] mb-[12px] text-center">
        {text}
      </p>
      <p className="quote text-[16px] sm:text-[18px] font-[400] text-[#4d545c] mb-[12px] text-center">
        The warrior who masters patience conquers battles before they begin.
      </p>
    </div>
  ),
  imageUrl = "https://res.cloudinary.com/daspiwjet/image/upload/v1760381402/elephant_480p_feasiv.png",
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
