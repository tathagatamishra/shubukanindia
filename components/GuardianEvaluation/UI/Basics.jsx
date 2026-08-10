"use client";
import React from "react";

export function Card({ title, children, className = "" }) {
  return (
    <div className={`gef-card ${className}`}>
      {title ? <h3 className="gef-card-title">{title}</h3> : null}
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="gef-divider" />;
}

export function Stamp({ children, color = "vermillion" }) {
  const cls = color === "gold" ? "gef-stamp--gold" : color === "ink" ? "gef-stamp--ink" : "";
  return <span className={`gef-stamp ${cls}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const cls =
    status === "submitted" ? "gef-badge--submitted" : status === "draft" ? "gef-badge--draft" : "gef-badge--pending";
  const label = status === "submitted" ? "Submitted" : status === "draft" ? "Draft" : "Pending";
  return <span className={`gef-badge ${cls}`}>{label}</span>;
}
