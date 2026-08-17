"use client";
import React, { useEffect, useState, useRef } from "react";

// All Indian languages currently supported by the Google Translate website widget.
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "bn", label: "বাংলা (Bengali)" },
  { code: "as", label: "অসমীয়া (Assamese)" },
  { code: "bho", label: "भोजपुरी (Bhojpuri)" },
  { code: "doi", label: "डोगरी (Dogri)" },
  { code: "gu", label: "ગુજરાતી (Gujarati)" },
  { code: "gom", label: "कोंकणी (Konkani)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "mai", label: "मैथिली (Maithili)" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "mni-Mtei", label: "মৈতৈলোন্ (Manipuri)" },
  { code: "mr", label: "मराठी (Marathi)" },
  { code: "lus", label: "Mizo ṭawng (Mizo)" },
  { code: "ne", label: "नेपाली (Nepali)" },
  { code: "or", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "sa", label: "संस्कृतम् (Sanskrit)" },
  { code: "sd", label: "سنڌي (Sindhi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "te", label: "తెలుగు (Telugu)" },
  { code: "ur", label: "اردو (Urdu)" },
];

const INCLUDED_LANGUAGES = LANGUAGES.map((l) => l.code).join(",");

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
        { pageLanguage: "en", includedLanguages: INCLUDED_LANGUAGES, autoDisplay: false },
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "center" }} className="notranslate">
      {/* Google's widget mounts here; visually hidden but functional */}
      <div id="gef-google-translate-root" style={{ display: "none" }} ref={containerRef} />
      <select
        className="gef-select"
        style={{
          padding: "6px 10px",
          fontSize: 12,
          width: "auto",
          maxWidth: 140,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
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
