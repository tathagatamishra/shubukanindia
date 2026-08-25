"use client";
import React from "react";

export function Card({ title, children, className = "", style }) {
  return (
    <div className={`gef-card ${className}`} style={style}>
      {title ? <h3 className="gef-card-title">{title}</h3> : null}
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="gef-divider" />;
}

// Section title for the evaluation form's marksheet-style pages — an icon
// badge gives each section (Student / Teacher / Training / Signature) its
// own identity at a glance, alternating gold/vermillion so the long form
// doesn't read as one flat, undifferentiated block.
export function SectionHeading({
  title,
  instruction,
  icon: Icon,
  tone = "gold",
}) {
  return (
    <div className="gef-doc-section-heading">
      <div className="gef-doc-section-heading-row">
        {Icon ? (
          <span
            className={`gef-doc-section-icon ${tone === "vermillion" ? "gef-doc-section-icon--vermillion" : ""}`}
            aria-hidden="true"
          >
            <Icon size={17} />
          </span>
        ) : null}
        <h2 className="gef-doc-section-title">{title}</h2>
      </div>
      {instruction ? (
        <p className="gef-doc-instruction">{instruction}</p>
      ) : null}
      {/* <div className="gef-doc-rule" /> */}
      <Divider />
    </div>
  );
}

export function Stamp({ children, color = "vermillion" }) {
  const cls =
    color === "gold"
      ? "gef-stamp--gold"
      : color === "ink"
        ? "gef-stamp--ink"
        : "";
  return <span className={`gef-stamp ${cls}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const cls =
    status === "submitted"
      ? "gef-badge--submitted"
      : status === "draft"
        ? "gef-badge--draft"
        : "gef-badge--pending";
  const label =
    status === "submitted"
      ? "Submitted"
      : status === "draft"
        ? "Draft"
        : "Pending";
  return <span className={`gef-badge ${cls}`}>{label}</span>;
}
