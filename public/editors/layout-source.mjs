export function loadEditorLayout({ fileLayout, filename, storageKey, readPreview }) {
  const alternate = document.getElementById("alternate-layout");
  const source = new URLSearchParams(location.search).get("layout");
  let raw = null;
  try {
    raw = localStorage.getItem(storageKey);
  } catch {
    // The editor can still work from the JSON when browser storage is unavailable.
  }
  const saved = source === "file" ? null : readPreview(raw, fileLayout, source === "browser");

  function showAlternate(useFile) {
    const label = useFile ? "Open JSON layout" : "Open saved layout";
    alternate.textContent = label;
    alternate.setAttribute("aria-label", label + " in a new tab");
    alternate.href = useFile ? "?layout=file" : "?layout=browser";
    alternate.hidden = false;
  }

  if (saved || readPreview(raw, fileLayout, true)) showAlternate(Boolean(saved));

  return {
    layout: saved ?? fileLayout,
    message: saved ? "Loaded saved browser layout." : `Loaded ${filename}.`,
    showJsonLink() { showAlternate(true); },
  };
}
