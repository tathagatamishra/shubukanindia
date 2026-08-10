"use client";
import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="gef-modal-backdrop" onClick={onClose}>
      <div className="gef-modal" onClick={(e) => e.stopPropagation()}>
        {title ? <h3 className="gef-card-title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}
