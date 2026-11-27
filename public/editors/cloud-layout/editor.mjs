import {
  CLOUD_LAYOUT_FILE, CLOUD_LAYOUT_STORAGE_KEY, CLOUD_LAYOUT_VERSION,
  DEFAULT_CLOUD_PLACEMENT, isLocalCloudPreview, normalizeCloudLayout,
  readCloudPreview, serializeCloudPreview,
} from "../../homepage/cloud-layout.mjs";
import { DEVICE_PROFILES, DEVICE_WIDTHS } from "../../homepage/device-profiles.mjs";
import { loadEditorLayout } from "../layout-source.mjs";

(async () => {
  const byId = (id) => document.getElementById(id);
  if (!isLocalCloudPreview(location.hostname)) {
    byId("editor-controls").hidden = true;
    byId("access-error").hidden = false;
    return;
  }

  let fileLayout;
  try {
    const response = await fetch(`/data/homepage/${CLOUD_LAYOUT_FILE}`, { cache: "no-store" });
    if (response.ok) fileLayout = normalizeCloudLayout(await response.json());
    if (!fileLayout) throw new Error("Invalid cloud layout file");
  } catch {
    byId("loading").textContent = "Could not load cloud-position.json. Check the file and refresh.";
    return;
  }

  const profiles = {
    desktop: { width: DEVICE_WIDTHS.desktop, height: 2020, left: 218, top: 120, bottom: 55 },
    tablet: { width: DEVICE_WIDTHS.tablet, height: 1780, left: 168, top: 96, bottom: 50 },
    mobile: { width: DEVICE_WIDTHS.mobile, height: 1470, left: 126, top: 76, bottom: 45 },
  };
  const layerGroups = [
    { id: "header-left", label: "Header left", selector: ".navbar-cloud--left", prefix: "navbar" },
    { id: "header-right", label: "Header right", selector: ".navbar-cloud--right", prefix: "navbar" },
    { id: "way", label: "The Shubukan Way", selector: ".home-cloud--way", prefix: "home" },
    { id: "gallery", label: "Gallery", selector: ".home-cloud--gallery", prefix: "home" },
  ];
  const variants = [
    { id: "rear", label: "Upper" },
    { id: "large", label: "Large" },
    { id: "front", label: "Lower" },
  ];
  const layerDefinitions = new Map();
  const geometry = new Map();
  const workspace = byId("workspace");
  const stage = byId("stage");
  const sizer = byId("sizer");
  const frame = byId("site-preview");
  const offsetX = byId("offset-x");
  const offsetY = byId("offset-y");
  const cloudSize = byId("cloud-size");
  const minSize = Number(cloudSize.min);
  const maxSize = Number(cloudSize.max);
  const cloudOpacity = byId("cloud-opacity");
  const opacitySlider = byId("cloud-opacity-slider");
  const flipX = byId("flip-x");
  const flipY = byId("flip-y");
  const resizeHandle = byId("resize-handle");
  const layoutData = byId("layout-data");
  const zoomControl = byId("zoom");
  let profile = "desktop";
  let selected = "header-left-large";
  let frameDocument;
  let zoom = 1;
  let drag;
  const positions = Object.fromEntries(DEVICE_PROFILES.map((name) => [name, {}]));
  const source = loadEditorLayout({
    fileLayout, filename: CLOUD_LAYOUT_FILE, storageKey: CLOUD_LAYOUT_STORAGE_KEY, readPreview: readCloudPreview,
  });

  function loadPositions() {
    for (const view of Object.keys(profiles)) {
      for (const id of layerDefinitions.keys()) {
        positions[view][id] = source.layout.layouts[view].offsets[id]
          ?? fileLayout.layouts[view].offsets[id]
          ?? DEFAULT_CLOUD_PLACEMENT;
      }
    }
    byId("status").textContent = source.message;
  }

  function placement(id, view = profile) {
    return positions[view][id] ?? DEFAULT_CLOUD_PLACEMENT;
  }

  function renderedOpacity(id) {
    const { opacity } = placement(id);
    return opacity === null ? geometry.get(id)?.baseOpacity ?? 1 : opacity / 100;
  }

  function exportLayout() {
    const layouts = Object.fromEntries(Object.entries(profiles).map(([name, view]) => [
      name,
      {
        viewportWidth: view.width,
        offsets: Object.fromEntries([...layerDefinitions.keys()].map((id) => [
          id, placement(id, name),
        ])),
      },
    ]));
    return { version: CLOUD_LAYOUT_VERSION, layouts };
  }

  function saveLayout() {
    const layout = exportLayout();
    const json = JSON.stringify(layout, null, 2);
    layoutData.value = json;
    try {
      localStorage.setItem(CLOUD_LAYOUT_STORAGE_KEY, serializeCloudPreview(layout, fileLayout));
      source.showJsonLink();
      byId("status").textContent = "Saved for this browser’s local homepage.";
    } catch {
      byId("layout-details").open = true;
      byId("status").textContent = "Browser storage is unavailable. Download the layout file to keep your edits.";
    }
    return json;
  }

  function syncSelection() {
    for (const [id, { button, target }] of layerDefinitions) {
      button.setAttribute("aria-pressed", String(id === selected));
      target.setAttribute("aria-pressed", String(id === selected));
    }
    const point = placement(selected);
    byId("selection-label").textContent = layerDefinitions.get(selected).name;
    offsetX.value = point.x;
    offsetY.value = point.y;
    cloudSize.value = point.size;
    const opacity = Math.round(renderedOpacity(selected) * 100);
    cloudOpacity.value = opacity;
    opacitySlider.value = opacity;
    flipX.setAttribute("aria-pressed", String(point.flipX));
    flipY.setAttribute("aria-pressed", String(point.flipY));
    positionResizeHandle();
  }

  function selectLayer(id, reveal = false) {
    selected = id;
    syncSelection();
    if (!reveal || !geometry.has(id)) return;
    const { left, top, width, height } = layerDefinitions.get(id).target.getBoundingClientRect();
    const viewport = workspace.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    if (centerX < viewport.left || centerX > viewport.right || centerY < viewport.top || centerY > viewport.bottom) {
      workspace.scrollBy({
        left: centerX - viewport.left - workspace.clientWidth / 2,
        top: centerY - viewport.top - workspace.clientHeight / 2,
        behavior: "instant",
      });
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function positionLayer(id) {
    const { element, art, x, y, width: baseWidth, height: baseHeight } = geometry.get(id);
    const { target, outside, outsideArt } = layerDefinitions.get(id);
    const view = profiles[profile];
    const point = placement(id);
    const scale = point.size / 100;
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    const left = x + point.x + (baseWidth - width) / 2;
    const top = y + point.y + (baseHeight - height) / 2;
    const flip = `scale(${point.flipX ? -1 : 1}, ${point.flipY ? -1 : 1})`;
    element.style.transform = `translate(${point.x}px, ${point.y}px) scale(${scale})`;
    element.style.opacity = point.opacity === null ? "" : point.opacity / 100;
    art.style.transform = flip;
    outsideArt.style.transform = flip;
    outsideArt.style.opacity = renderedOpacity(id) * .82;
    target.style.left = `${view.left + left}px`;
    target.style.top = `${view.top + top}px`;
    target.style.width = `${width}px`;
    target.style.height = `${height}px`;

    // The ghost shows only the portion outside the live page.
    const x1 = clamp(-left, 0, width);
    const y1 = clamp(-top, 0, height);
    const x2 = clamp(view.width - left, 0, width);
    const y2 = clamp(view.height - top, 0, height);
    outside.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px ${y1}px, 0 0)`;
  }

  function positionResizeHandle() {
    resizeHandle.hidden = !geometry.has(selected);
    if (resizeHandle.hidden) return;
    const { target } = layerDefinitions.get(selected);
    const view = profiles[profile];
    const inset = 9 / zoom;
    resizeHandle.style.left = `${clamp(target.offsetLeft + target.offsetWidth, inset, view.width + view.left * 2 - inset)}px`;
    resizeHandle.style.top = `${clamp(target.offsetTop + target.offsetHeight, inset, view.height + view.top + view.bottom - inset)}px`;
  }

  function updateLayer(id, change) {
    if (!geometry.has(id)) return;
    positions[profile][id] = { ...placement(id), ...change };
    positionLayer(id);
    syncSelection();
    byId("status").textContent = "Unsaved changes";
  }

  function moveLayer(id, x, y) {
    const box = geometry.get(id);
    if (!box || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const view = profiles[profile];
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    updateLayer(id, {
      x: clamp(Math.round(x), Math.ceil(-view.left - centerX), Math.floor(view.width + view.left - centerX)),
      y: clamp(Math.round(y), Math.ceil(-view.top - centerY), Math.floor(view.height + view.bottom - centerY)),
    });
  }

  function resizeLayer(id, size) {
    if (!Number.isFinite(size)) {
      syncSelection();
      return;
    }
    const nextSize = clamp(Math.round(size), minSize, maxSize);
    if (nextSize === placement(id).size) {
      syncSelection();
      return;
    }
    updateLayer(id, { size: nextSize });
  }

  function setOpacity(value) {
    if (!Number.isFinite(value)) {
      syncSelection();
      return;
    }
    const opacity = clamp(Math.round(value), 0, 100);
    if (opacity === placement(selected).opacity) return;
    updateLayer(selected, { opacity });
  }

  function dragStart(event, id, isResize = false) {
    if (event.button !== 0 || drag || !geometry.has(id)) return;
    selectLayer(id);
    drag = { id, isResize, pointer: event.pointerId, startX: event.clientX, startY: event.clientY, ...placement(id) };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragMove(event) {
    if (!drag || event.pointerId !== drag.pointer) return;
    const dx = (event.clientX - drag.startX) / zoom;
    const dy = (event.clientY - drag.startY) / zoom;
    if (drag.isResize) {
      const { width, height } = geometry.get(drag.id);
      const sizeDelta = 200 * (dx * width + dy * height) / (width * width + height * height);
      resizeLayer(drag.id, drag.size + sizeDelta);
    } else {
      moveLayer(drag.id, drag.x + dx, drag.y + dy);
    }
  }

  function endDrag() {
    drag = undefined;
  }

  function makeLayers() {
    for (const group of layerGroups) {
      const section = document.createElement("section");
      section.className = "layer-group";
      const title = document.createElement("p");
      title.textContent = group.label;
      const buttons = document.createElement("div");
      buttons.className = "layer-buttons";
      section.append(title, buttons);
      byId("layers").append(section);

      for (const variant of variants) {
        const id = `${group.id}-${variant.id}`;
        const name = `${group.label} · ${variant.label}`;
        const selector = variant.id === "large"
          ? `${group.selector}:not(.painted-cloud--small)`
          : `${group.selector}.${group.prefix}-cloud--${variant.id}`;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = variant.label;
        button.setAttribute("aria-label", `Select ${name}`);
        button.addEventListener("click", () => selectLayer(id, true));
        buttons.append(button);

        const target = document.createElement("button");
        target.type = "button";
        target.className = "cloud-target";
        target.setAttribute("aria-label", `Move ${name} cloud`);
        target.addEventListener("focus", () => selectLayer(id));
        target.addEventListener("pointerdown", (event) => dragStart(event, id));
        target.addEventListener("pointermove", dragMove);
        target.addEventListener("lostpointercapture", endDrag);
        target.addEventListener("keydown", (event) => {
          const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
          if (!direction) return;
          event.preventDefault();
          const point = placement(id);
          const step = event.shiftKey ? 10 : 1;
          moveLayer(id, point.x + direction[0] * step, point.y + direction[1] * step);
        });
        const outside = document.createElement("span");
        outside.className = "outside";
        outside.setAttribute("aria-hidden", "true");
        const outsideArt = document.createElement("span");
        outsideArt.className = "outside-art";
        outside.append(outsideArt);
        target.append(outside);
        stage.append(target);
        layerDefinitions.set(id, { name, selector, button, target, outside, outsideArt });
      }
    }
  }

  function fitStage() {
    const view = profiles[profile];
    const stageWidth = view.width + view.left * 2;
    const stageHeight = view.height + view.top + view.bottom;
    zoom = zoomControl.value === "fit" ? Math.min(1, (workspace.clientWidth - 24) / stageWidth) : Number(zoomControl.value);
    stage.style.width = `${stageWidth}px`;
    stage.style.height = `${stageHeight}px`;
    stage.style.transform = `scale(${zoom})`;
    stage.style.setProperty("--outline-size", `${1.5 / zoom}px`);
    stage.style.setProperty("--handle-size", `${16 / zoom}px`);
    sizer.style.width = `${Math.ceil(stageWidth * zoom)}px`;
    sizer.style.height = `${Math.ceil(stageHeight * zoom)}px`;
    positionResizeHandle();
  }

  function measureLayers() {
    if (!frameDocument) return;
    for (const { element } of geometry.values()) {
      element.style.transform = "";
      element.style.opacity = "";
    }
    geometry.clear();
    for (const [id, definition] of layerDefinitions) {
      const element = frameDocument.querySelector(definition.selector);
      if (!element) throw new Error(`Missing cloud layer ${id}`);
      const { x, y, width, height } = element.getBoundingClientRect();
      const art = element.firstElementChild;
      const style = frame.contentWindow.getComputedStyle(art);
      const baseOpacity = Number(frame.contentWindow.getComputedStyle(element).opacity);
      geometry.set(id, { element, art, x, y, width, height, baseOpacity });
      definition.outsideArt.style.backgroundImage = style.backgroundImage;
      definition.outsideArt.style.scale = style.scale;
      definition.outsideArt.style.filter = style.filter;
      positionLayer(id);
    }
    positionResizeHandle();
  }

  function setProfile(name) {
    profile = name;
    const view = profiles[name];
    for (const target of [frame, byId("frame-outline")]) {
      Object.assign(target.style, {
        left: `${view.left}px`, top: `${view.top}px`, width: `${view.width}px`, height: `${view.height}px`,
      });
    }
    document.querySelectorAll("[data-profile]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.profile === name));
    });
    measureLayers();
    fitStage();
    syncSelection();
    workspace.scrollTo(0, 0);
  }

  makeLayers();
  loadPositions();
  layoutData.value = JSON.stringify(exportLayout(), null, 2);
  setProfile("desktop");
  frame.addEventListener("load", async () => {
    try {
      frameDocument = frame.contentDocument;
      const style = frameDocument.createElement("style");
      style.textContent = `
        html, body { overflow: hidden !important; scrollbar-width: none !important; }
        #Navbar { position: absolute !important; top: 0 !important; }
        #Navbar .navbar-clouds { overflow: visible !important; }
        #Navbar .logo img, .painted-cloud__art { animation: none !important; }
        .painted-cloud { transform-origin: center; }
        /* Apply the editable offsets to the original positions. */
        .painted-cloud[data-cloud-layer] {
          --cloud-layout-x: 0;
          --cloud-layout-y: 0;
          --cloud-layout-size: 1;
          --cloud-layout-flip-x: 1;
          --cloud-layout-flip-y: 1;
          --cloud-layout-opacity: initial;
        }
        .banner { display: none !important; }
      `;
      frameDocument.head.append(style);
      await frameDocument.fonts.ready;
      sizer.hidden = false;
      setProfile(profile);
      byId("loading").hidden = true;
      for (const id of ["save", "copy", "download", "reset", "offset-x", "offset-y", "cloud-size", "cloud-opacity", "cloud-opacity-slider", "flip-x", "flip-y"]) {
        byId(id).disabled = false;
      }
      new ResizeObserver(fitStage).observe(workspace);
      new ResizeObserver(measureLayers).observe(frameDocument.querySelector(".Home"));
    } catch {
      sizer.hidden = true;
      byId("loading").textContent = "Could not load the cloud layers. Refresh this editor with the homepage preview running.";
    }
  });
  frame.src = "/";

  document.querySelectorAll("[data-profile]").forEach((button) => {
    button.addEventListener("click", () => setProfile(button.dataset.profile));
  });
  zoomControl.addEventListener("change", () => {
    fitStage();
    selectLayer(selected, true);
  });
  byId("preview-only").addEventListener("change", (event) => stage.classList.toggle("preview-only", event.target.checked));
  byId("reset").addEventListener("click", () => updateLayer(selected, DEFAULT_CLOUD_PLACEMENT));
  offsetX.addEventListener("change", () => moveLayer(selected, offsetX.valueAsNumber, placement(selected).y));
  offsetY.addEventListener("change", () => moveLayer(selected, placement(selected).x, offsetY.valueAsNumber));
  cloudSize.addEventListener("input", () => {
    const size = cloudSize.valueAsNumber;
    if (Number.isInteger(size) && size >= minSize && size <= maxSize) resizeLayer(selected, size);
  });
  cloudSize.addEventListener("change", () => resizeLayer(selected, cloudSize.valueAsNumber));
  opacitySlider.addEventListener("input", () => setOpacity(opacitySlider.valueAsNumber));
  cloudOpacity.addEventListener("input", () => {
    const opacity = cloudOpacity.valueAsNumber;
    if (Number.isInteger(opacity) && opacity >= 0 && opacity <= 100) setOpacity(opacity);
  });
  cloudOpacity.addEventListener("change", () => setOpacity(cloudOpacity.valueAsNumber));
  flipX.addEventListener("click", () => updateLayer(selected, { flipX: !placement(selected).flipX }));
  flipY.addEventListener("click", () => updateLayer(selected, { flipY: !placement(selected).flipY }));
  resizeHandle.addEventListener("pointerdown", (event) => dragStart(event, selected, true));
  resizeHandle.addEventListener("pointermove", dragMove);
  resizeHandle.addEventListener("lostpointercapture", endDrag);
  resizeHandle.addEventListener("keydown", (event) => {
    const direction = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[event.key];
    if (!direction) return;
    event.preventDefault();
    resizeLayer(selected, placement(selected).size + direction * (event.shiftKey ? 10 : 1));
  });
  byId("save").addEventListener("click", saveLayout);
  byId("download").addEventListener("click", () => {
    const json = JSON.stringify(exportLayout(), null, 2) + "\n";
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = CLOUD_LAYOUT_FILE;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    byId("status").textContent = "Downloaded cloud-position.json with all three layouts.";
  });
  byId("copy").addEventListener("click", async () => {
    const json = saveLayout();
    try {
      await navigator.clipboard.writeText(json);
      byId("status").textContent = "Layout copied.";
    } catch {
      byId("layout-details").open = true;
      layoutData.select();
      byId("status").textContent = "Copy the selected layout data.";
    }
  });
})();
