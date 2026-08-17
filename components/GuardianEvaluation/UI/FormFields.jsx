"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiCalendar } from "react-icons/fi";

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

// ---------- date helpers (ISO "yyyy-mm-dd" <-> visible "dd/mm/yyyy") ----------
function isoToDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function displayToIso(display) {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  const [, d, m, y] = match;
  const day = Number(d);
  const month = Number(m);
  const year = Number(y);
  if (month < 1 || month > 12) return "";
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return "";
  return `${y}-${m}-${d}`;
}

// Date field: always displays dd/mm/yyyy regardless of browser/OS locale.
// Keeps the same external contract as before (value/onChange use ISO "yyyy-mm-dd"),
// so no other file needs to change.
function DateField({ value, onChange, className = "", ...rest }) {
  const [text, setText] = useState(() => isoToDisplay(value));
  const hiddenRef = useRef(null);

  useEffect(() => {
    setText(isoToDisplay(value));
  }, [value]);

  const handleTextChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8); // ddmmyyyy
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setText(formatted);

    if (formatted === "") {
      onChange("");
      return;
    }
    const iso = displayToIso(formatted);
    if (iso) onChange(iso);
  };

  const handleHiddenChange = (e) => {
    const iso = e.target.value; // native picker gives yyyy-mm-dd
    setText(isoToDisplay(iso));
    onChange(iso);
  };

  const openPicker = () => {
    const el = hiddenRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        className={`gef-input ${className}`}
        style={{ paddingRight: 36 }}
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/yyyy"
        maxLength={10}
        value={text}
        onChange={handleTextChange}
        {...rest}
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label="Open calendar"
        tabIndex={-1}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "rgba(28,26,23,0.5)",
        }}
      >
        <FiCalendar size={16} />
      </button>
      {/* Hidden native date input: provides the calendar picker while the
          visible text field above always shows dd/mm/yyyy. */}
      <input
        ref={hiddenRef}
        type="date"
        value={value ?? ""}
        onChange={handleHiddenChange}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 1,
          height: 1,
          opacity: 0,
          border: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function TextInput({ value, onChange, type = "text", placeholder = "", className = "", ...rest }) {
  if (type === "date") {
    return <DateField value={value} onChange={onChange} className={className} {...rest} />;
  }
  return (
    <input
      className={`gef-input ${className}`}
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

// A single checkbox row: square box + label, matching the printed marksheet.
export function Checkbox({ checked, onChange, label }) {
  return (
    <button type="button" className={`gef-checkbox-row ${checked ? "checked" : ""}`} onClick={() => onChange(!checked)}>
      <span className="gef-checkbox-box">{checked ? <span className="gef-checkbox-tick" /> : null}</span>
      <span className="gef-checkbox-label">{label}</span>
    </button>
  );
}

// "Or" separator used between mutually-exclusive option groups, mirroring
// the "Or" text printed between choices in the source form.
export function OrDivider() {
  return <span className="gef-or">Or</span>;
}

export function YesNo({ value, onChange, yesLabel = "Yes", noLabel = "No" }) {
  return (
    <div className="gef-yesno-checks">
      <Checkbox checked={value === true} onChange={() => onChange(true)} label={yesLabel} />
      <OrDivider />
      <Checkbox checked={value === false} onChange={() => onChange(false)} label={noLabel} />
    </div>
  );
}

// `options` accepts either a flat array of strings (existing usage, where the
// string is used as both the stored value and the visible label) or an array
// of { value, label } objects (e.g. instructors, where we want to store an id
// but display a name). Both shapes can be mixed freely by callers.
function normalizeOption(opt) {
  if (opt && typeof opt === "object") {
    return { value: opt.value, label: opt.label ?? opt.value };
  }
  return { value: opt, label: opt };
}

export function ChipMultiSelect({ value = [], onChange, options }) {
  const normalized = options.map(normalizeOption);
  const toggle = (optValue) => {
    if (value.includes(optValue)) onChange(value.filter((v) => v !== optValue));
    else onChange([...value, optValue]);
  };
  return (
    <div className="gef-checklist">
      {normalized.map((opt) => (
        <Checkbox key={opt.value} checked={value.includes(opt.value)} onChange={() => toggle(opt.value)} label={opt.label} />
      ))}
    </div>
  );
}

// Combined "Daily / Weekly / Monthly practice OR Only before exam" widget,
// with a single free-text duration field, used 3x in the form.
const PRACTICE_MODES = [
  { value: "daily", label: "Daily practice" },
  { value: "weekly", label: "Weekly practice" },
  { value: "monthly", label: "Monthly practice" },
];

export function DailyOrBeforeExam({ value = {}, onChange }) {
  const mode = value.mode || null;
  const isTimedMode = mode === "daily" || mode === "weekly" || mode === "monthly";
  return (
    <div className="gef-stack" style={{ gap: 10 }}>
      <div className="gef-yesno-checks" style={{ flexWrap: "wrap" }}>
        {PRACTICE_MODES.map((m, i) => (
          <React.Fragment key={m.value}>
            {i > 0 ? <OrDivider /> : null}
            <Checkbox checked={mode === m.value} onChange={() => onChange({ ...value, mode: m.value })} label={m.label} />
          </React.Fragment>
        ))}
        <OrDivider />
        <Checkbox checked={mode === "beforeExam"} onChange={() => onChange({ mode: "beforeExam", duration: "" })} label="Only before exam" />
      </div>
      {isTimedMode ? (
        <TextInput
          placeholder="e.g. 1 hour 30 minutes"
          value={value.duration}
          onChange={(v) => onChange({ ...value, duration: v })}
        />
      ) : null}
    </div>
  );
}