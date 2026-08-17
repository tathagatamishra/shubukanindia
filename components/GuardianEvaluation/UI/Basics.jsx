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

// Plain section heading for a long, continuous form (no boxed card),
// mirroring the printed marksheet's section titles + instruction line.
export function SectionHeading({ title, instruction }) {
  return (
    <div className="gef-doc-section-heading">
      <h2 className="gef-doc-section-title">{title}</h2>
      {instruction ? <p className="gef-doc-instruction">{instruction}</p> : null}
      <div className="gef-doc-rule" />
    </div>
  );
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
