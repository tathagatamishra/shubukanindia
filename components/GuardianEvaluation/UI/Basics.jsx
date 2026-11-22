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

// Plain section heading for a long, continuous form (no boxed card),
// mirroring the printed marksheet's section titles + instruction line.
export function SectionHeading({ id, title, instruction, missingFields = [] }) {
  const incomplete = missingFields.length > 0;
  return (
    <div className={`gef-doc-section-heading${incomplete ? " gef-doc-section-heading--incomplete" : ""}`}>
      <h2
        id={id}
        tabIndex={id ? -1 : undefined}
        aria-describedby={incomplete ? `${id}-missing` : undefined}
        className="gef-doc-section-title"
      >
        {title}
      </h2>
      {instruction ? <p className="gef-doc-instruction">{instruction}</p> : null}
      <div className="gef-doc-rule" />
      {incomplete && (
        <details className="gef-section-issues">
          <summary id={`${id}-missing`}>
            {missingFields.length} required {missingFields.length === 1 ? "answer" : "answers"} missing
          </summary>
          <ul>
            {missingFields.map((label) => <li key={label}>{label}</li>)}
          </ul>
        </details>
      )}
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
