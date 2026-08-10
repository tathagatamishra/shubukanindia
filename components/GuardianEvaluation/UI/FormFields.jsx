"use client";
import React from "react";

export function Field({ label, required, hint, error, children }) {
  return (
    <div className="gef-field">
      {label ? (
        <label className="gef-label">
          {label}
          {required ? <span className="gef-required">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint ? <span className="gef-hint">{hint}</span> : null}
      {error ? <span className="gef-error">{error}</span> : null}
    </div>
  );
}

export function TextInput({ value, onChange, type = "text", placeholder = "", ...rest }) {
  return (
    <input
      className="gef-input"
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
      {...rest}
    />
  );
}

export function TextArea({ value, onChange, placeholder = "", rows = 4 }) {
  return (
    <textarea
      className="gef-textarea"
      rows={rows}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Select({ value, onChange, options, placeholder = "Select..." }) {
  return (
    <select className="gef-select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function YesNo({ value, onChange, yesLabel = "Yes", noLabel = "No" }) {
  return (
    <div className="gef-yesno">
      <button type="button" className={`gef-yesno-btn ${value === true ? "active" : ""}`} onClick={() => onChange(true)}>
        {yesLabel}
      </button>
      <button type="button" className={`gef-yesno-btn ${value === false ? "active" : ""}`} onClick={() => onChange(false)}>
        {noLabel}
      </button>
    </div>
  );
}

export function ChipMultiSelect({ value = [], onChange, options }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="gef-chips">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`gef-chip ${value.includes(opt) ? "active" : ""}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Combined "daily hour/min OR only before exam" widget used 3x in the PDF
export function DailyOrBeforeExam({ value = {}, onChange }) {
  const mode = value.mode || null;
  return (
    <div className="gef-stack" style={{ gap: 10 }}>
      <div className="gef-yesno">
        <button
          type="button"
          className={`gef-yesno-btn ${mode === "daily" ? "active" : ""}`}
          onClick={() => onChange({ ...value, mode: "daily" })}
        >
          Daily practice
        </button>
        <button
          type="button"
          className={`gef-yesno-btn ${mode === "beforeExam" ? "active" : ""}`}
          onClick={() => onChange({ mode: "beforeExam" })}
        >
          Only before exam
        </button>
      </div>
      {mode === "daily" ? (
        <div className="gef-row">
          <TextInput
            type="number"
            placeholder="Hours"
            value={value.hour}
            onChange={(v) => onChange({ ...value, hour: v })}
          />
          <TextInput
            type="number"
            placeholder="Minutes"
            value={value.minute}
            onChange={(v) => onChange({ ...value, minute: v })}
          />
        </div>
      ) : null}
    </div>
  );
}
