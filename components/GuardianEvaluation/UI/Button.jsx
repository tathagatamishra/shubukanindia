"use client";
import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) {
  const variantClass =
    variant === "primary"
      ? "gef-btn--primary"
      : variant === "outline"
      ? "gef-btn--outline"
      : variant === "gold"
      ? "gef-btn--gold"
      : variant === "danger"
      ? "gef-btn--danger"
      : "";
  const sizeClass = size === "sm" ? "gef-btn--sm" : "";
  const blockClass = block ? "gef-btn--block" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`gef-btn ${variantClass} ${sizeClass} ${blockClass} ${className}`}
    >
      {children}
    </button>
  );
}
