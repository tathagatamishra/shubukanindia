"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

// Belt/rank ladder, colored to match the physical belts (brown kyus carry the
// red stripe count used on the real dojo marksheet).
export const BELT_RANKS = [
  { value: "White Belt - 10th Kyu", bg: "#FFFFFF", color: "#1C1A17", border: true, stripes: 0 },
  { value: "Yellow Belt - 9th Kyu", bg: "#F5E23C", color: "#1C1A17", stripes: 0 },
  { value: "Orange Belt - 8th Kyu", bg: "#F2994A", color: "#1C1A17", stripes: 0 },
  { value: "Green Belt - 7th Kyu", bg: "#4CAF50", color: "#1C1A17", stripes: 0 },
  { value: "Blue Belt - 6th Kyu", bg: "#4A9DE0", color: "#FFFFFF", stripes: 0 },
  { value: "Purple Belt - 5th Kyu", bg: "#A64AC9", color: "#FFFFFF", stripes: 0 },
  { value: "Brown Belt - 4th Kyu", bg: "#6B4226", color: "#FFFFFF", stripes: 1 },
  { value: "Brown Belt - 3rd Kyu", bg: "#6B4226", color: "#FFFFFF", stripes: 2 },
  { value: "Brown Belt - 2nd Kyu", bg: "#6B4226", color: "#FFFFFF", stripes: 3 },
  { value: "Brown Belt - 1st Kyu", bg: "#6B4226", color: "#FFFFFF", stripes: 4 },
  { value: "Black Belt - 1st Dan", bg: "#1C1C1C", color: "#FFFFFF", stripes: 0 },
];

function Stripes({ count }) {
  if (!count) return null;
  return (
    <span className="gef-rank-stripes" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="gef-rank-stripe" />
      ))}
    </span>
  );
}

export default function BeltRankSelect({ value, onChange, placeholder = "Select current rank..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const selected = BELT_RANKS.find((r) => r.value === value);

  return (
    <div className="gef-rank-select" ref={ref}>
      <button
        type="button"
        className="gef-rank-select-trigger"
        onClick={() => setOpen((o) => !o)}
        style={
          selected
            ? { background: selected.bg, color: selected.color, borderColor: selected.border ? "var(--gef-line)" : "transparent" }
            : undefined
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="gef-rank-select-trigger-content">
          {selected ? <Stripes count={selected.stripes} /> : null}
          <span>{selected ? selected.value : placeholder}</span>
        </span>
        <FiChevronDown className="gef-rank-select-chevron" />
      </button>

      {open && (
        <div className="gef-rank-select-panel" role="listbox">
          {BELT_RANKS.map((r) => (
            <button
              key={r.value}
              type="button"
              role="option"
              aria-selected={r.value === value}
              className={`gef-rank-option ${r.value === value ? "active" : ""}`}
              style={{ background: r.bg, color: r.color, borderColor: r.border ? "var(--gef-line)" : "transparent" }}
              onClick={() => {
                onChange(r.value);
                setOpen(false);
              }}
            >
              <Stripes count={r.stripes} />
              <span>{r.value}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
