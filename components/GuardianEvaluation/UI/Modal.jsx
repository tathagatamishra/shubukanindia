"use client";
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, title, children }) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "unset";
    }
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="gef-modal-backdrop" onClick={onClose}>
      <div className="gef-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gef-modal-close" onClick={onClose} aria-label="Close">
          <FiX size={16} />
        </button>
        {title ? <h3 className="gef-card-title gef-modal-title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}
