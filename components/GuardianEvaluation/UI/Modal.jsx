"use client";
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useUI } from "@/components/Context/UIContext";

export default function Modal({ open, onClose, title, children, wide = false }) {
  const { setIsModalOpen } = useUI();

  // Lock body scroll when open, and hide the site Navbar (same convention as
  // BlogPost.jsx's share modal — Navbar.jsx bails out early on isModalOpen).
  // Since every GEF modal (Add/Edit Learner, Confirm, Edit Window, PdfViewer,
  // ...) is a thin wrapper around this one component, this covers all of them.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "hidden";
      setIsModalOpen?.(true);
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "unset";
      setIsModalOpen?.(false);
    }
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.overflowY = "unset";
      setIsModalOpen?.(false);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <div className="gef-modal-backdrop" onClick={onClose}>
      <div className={`gef-modal ${wide ? "gef-modal--wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gef-modal-close" onClick={onClose} aria-label="Close">
          <FiX size={16} />
        </button>
        {title ? <h3 className="gef-card-title gef-modal-title">{title}</h3> : null}
        {children}
      </div>
    </div>
  );
}
