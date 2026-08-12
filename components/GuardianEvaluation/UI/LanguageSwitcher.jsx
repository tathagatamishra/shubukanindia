"use client";
import React, { useEffect, useState, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা (Bengali)" },
];

let widgetLoadPromise = null;

function loadGoogleTranslateWidget() {
  if (widgetLoadPromise) return widgetLoadPromise;
  widgetLoadPromise = new Promise((resolve) => {
    if (window.google?.translate?.TranslateElement) {
      resolve();
      return;
    }
    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,bn", autoDisplay: false },
        "gef-google-translate-root"
      );
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  });
  return widgetLoadPromise;
}

export default function LanguageSwitcher({ compact = false }) {
  const [lang, setLang] = useState("en");
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadGoogleTranslateWidget().then(() => setReady(true));
  }, []);

  const applyLanguage = (targetLang) => {
    setLang(targetLang);
    const tryApply = () => {
      const combo = document.querySelector("select.goog-te-combo");
      if (!combo) return false;
      combo.value = targetLang;
      combo.dispatchEvent(new Event("change"));
      return true;
    };
    // The widget can take a moment to inject its <select>; retry briefly.
    if (!tryApply()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        if (tryApply() || attempts > 10) clearInterval(interval);
      }, 300);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="notranslate">
      {/* Google's widget mounts here; visually hidden but functional */}
      <div id="gef-google-translate-root" style={{ display: "none" }} ref={containerRef} />
      <select
        className="gef-select"
        style={{ padding: "6px 10px", fontSize: 12, width: "auto" }}
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="gef-btn gef-btn--outline gef-btn--sm"
        onClick={() => applyLanguage(lang)}
        disabled={!ready}
        title="Translate this page using Google Translate"
      >
        {ready ? "Translate" : "Loading..."}
      </button>
    </div>
  );
}
