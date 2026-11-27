import {
  DRAGON_SIZE_MAX, DRAGON_SIZE_MIN, FRAME, IDLE_PARTS, PREVIEW_EVENT, REST_VERTEX, START_VERTEX, STORAGE_KEY,
  compileTrack, dragonBodyFraction, flightDistance, flightEase, isLocal,
  loadLayout, parsePath, pathString, progressAtPoint, readFlightPreview, sampleRoute, serializeFlightPreview,
} from "../../dragon/flight-path.mjs";
import { STEPS, usesRestPose } from "../../dragon/flight-keyframes.mjs";
import { DEVICE_PROFILES, DEVICE_WIDTHS } from "../../homepage/device-profiles.mjs";
import { loadEditorLayout } from "../layout-source.mjs";
import { installAppendageEditor } from "./appendage-editor.mjs";
import { installTwistEditor } from "./twist-editor.mjs";

const byId = (id) => document.getElementById(id);
if (isLocal(location.hostname)) {
  try {
    const response = await fetch("/data/homepage/flight-paths.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Missing flight paths");
    const file = await response.json();
    const defaults = loadLayout(null, file);
    if (!DEVICE_PROFILES.every((name) => parsePath(defaults[name]))) throw new Error("Invalid flight paths");
    startEditor(defaults);
  } catch (error) {
    console.error(error);
    byId("access-error").textContent = "The dragon paths could not be loaded. Refresh after checking flight-paths.json.";
    byId("access-error").hidden = false;
  }
} else {
  byId("access-error").hidden = false;
}

function startEditor(defaults) {
  const heights = { desktop: 870, tablet: 1024, mobile: 790 };
  const workspace = byId("workspace");
  const sizer = byId("sizer");
  const iframe = byId("preview");
  const overview = byId("overview");
  const fullRoute = byId("full-route");
  const routeCanvas = byId("route-dragon");
  const routePath = byId("route-path");
  const deviceFrame = byId("device-frame");
  const selection = byId("point");
  const xField = byId("x");
  const yField = byId("y");
  const pathData = byId("path-data");
  const guideToggle = byId("show-guide");
  const progress = byId("position");
  const sizeInput = byId("dragon-size");
  const sizeValue = byId("dragon-size-value");
  sizeInput.min = DRAGON_SIZE_MIN;
  sizeInput.max = DRAGON_SIZE_MAX;
  const idleMotion = byId("idle-motion");
  const idleControls = IDLE_PARTS.map((part) => ({
    part, input: byId("idle-" + part), output: byId("idle-" + part + "-value"),
  }));
  const flight = byId("flight");
  const status = byId("status");
  const source = loadEditorLayout({
    fileLayout: defaults, filename: "flight-paths.json", storageKey: STORAGE_KEY, readPreview: readFlightPreview,
  });
  let saved = source.layout;
  let cleanStatus = source.message;
  const layout = { ...saved };
  const history = Object.fromEntries(DEVICE_PROFILES.map((name) => [name, []]));
  let profile = "desktop";
  let view = "site";
  let chosen = "1-end";
  let commands = parsePath(layout[profile]);
  let siteGuide;
  let siteStage;
  let observer;
  let stopMeasuringSite;
  let loadingTimeout;
  let pendingPreview = 0;
  let track, trackSource;
  let picking = false;
  let playing = false;
  let previewIdle = false;
  let lastPreviewStatus;

  let activePanel = "twists";
  function keyframeOptions(section) {
    return {
      getState: () => ({
        profile: layout[section][profile], flight: flight.value, step: Math.round(Number(progress.value) * 10),
      }),
      update(keys) {
        layout[section] = { ...layout[section], [profile]: keys };
        updateStatus();
        schedulePreview();
      },
      seek,
      activate() {
        activePanel = section;
        drawMarkers();
      },
      redrawMarker: drawMarkers,
    };
  }
  const twistEditor = installTwistEditor(keyframeOptions("twists"));
  const appendageEditor = installAppendageEditor(keyframeOptions("appendages"));

  function seek(step, sendPreview = true) {
    progress.value = step / 10;
    byId("position-value").textContent = progress.value + "%";
    if (!atRest()) previewIdle = false;
    updateIdleButton();
    twistEditor.draw();
    appendageEditor.draw();
    if (sendPreview) dispatchPreview();
    drawMarkers();
  }

  function drawMarkers() {
    fullGuide.drawMarker();
    siteGuide?.drawMarker();
  }

  function setPicking(enabled) {
    picking = enabled;
    byId("pick-position").setAttribute("aria-pressed", String(enabled));
    byId("pick-help").hidden = !enabled;
    if (picking) {
      guideToggle.checked = true;
      if (view === "site" && !siteGuide) switchView("route");
    }
    fullGuide.draw();
    siteGuide?.draw();
  }

  function schedulePreview() {
    cancelAnimationFrame(pendingPreview);
    pendingPreview = requestAnimationFrame(() => {
      dispatchPreview();
      drawMarkers();
    });
  }


  const descriptors = [{ key: "start", type: "anchor", label: "Anchor 1 · Loop seam" }];
  for (let segment = 1; segment <= 11; segment++) {
    descriptors.push({ key: segment + "-out", type: "handle", label: "Curve " + segment + " · Outgoing handle" });
    descriptors.push({ key: segment + "-in", type: "handle", label: "Curve " + segment + " · Incoming handle" });
    if (segment < 11) {
      const label = segment === START_VERTEX ? " · Opening start" : segment === REST_VERTEX ? " · Resting head" : "";
      descriptors.push({ key: segment + "-end", type: "anchor", label: "Anchor " + (segment + 1) + label });
    }
  }
  const pointByKey = new Map(descriptors.map((item) => [item.key, item]));
  for (const { key, label } of descriptors) selection.add(new Option(label, key));

  function point(key) {
    if (key === "start") return commands[0];
    const [segment, kind] = key.split("-");
    return commands[Number(segment)][{ out: 0, in: 1, end: 2 }[kind]];
  }

  function changePoint(key, position) {
    const current = point(key);
    const dx = position.x - current.x;
    const dy = position.y - current.y;
    const moved = [current];
    if (pointByKey.get(key).type === "anchor") {
      const next = key === "start" ? 1 : Number(key.split("-")[0]) + 1;
      moved.push(commands[next][0], next === 1 ? commands[11][1] : commands[next - 1][1]);
      if (next === 1) moved.push(commands[11][2]);
    }
    if (moved.some(({ x, y }) => Math.abs(x + dx) > 10000 || Math.abs(y + dy) > 10000)) return;
    for (const coordinate of moved) {
      coordinate.x = Math.round((coordinate.x + dx) * 1000) / 1000;
      coordinate.y = Math.round((coordinate.y + dy) * 1000) / 1000;
    }
    layout[profile] = pathString(commands);
    redraw();
  }

  function remember(before) {
    if (layout[profile] === before) return;
    history[profile].push(before);
    if (history[profile].length > 80) history[profile].shift();
    if (view === "route") fitRoute();
    updateStatus();
  }

  function updateStatus(message) {
    const dirty = DEVICE_PROFILES.some((name) => layout[name] !== saved[name] ||
      layout.twists[name] !== saved.twists[name] || layout.appendages[name] !== saved.appendages[name] ||
      layout.dragonSize[name] !== saved.dragonSize[name] ||
      IDLE_PARTS.some((part) => layout.idleMotion[name][part] !== saved.idleMotion[name][part]));
    status.textContent = message ?? (dirty ? "Unsaved changes." : cleanStatus);
    byId("undo").disabled = history[profile].length === 0;
  }

  function setPath(d) {
    const parsed = parsePath(d);
    if (!parsed) return false;
    commands = parsed;
    layout[profile] = d;
    redraw();
    return true;
  }

  function dispatchPreview(fly = false) {
    if (!siteStage || !iframe.contentWindow) return;
    playing = fly;
    updateIdleButton();
    const detail = {
      d: layout[profile], twists: layout.twists[profile], appendages: layout.appendages[profile],
      progress: Number(progress.value) / 100, opening: flight.value === "opening", fly,
      idle: previewIdle && atRest(),
      idleMotion: layout.idleMotion[profile],
      dragonSize: layout.dragonSize[profile],
      overview: view === "route" ? { canvas: routeCanvas, path: routePath, viewportWidth: DEVICE_WIDTHS[profile] } : null,
    };
    iframe.contentWindow.dispatchEvent(new iframe.contentWindow.CustomEvent(PREVIEW_EVENT, { detail }));
  }

  function redraw() {
    if (trackSource !== layout[profile]) {
      track = compileTrack(commands);
      trackSource = layout[profile];
    }
    fullGuide.draw();
    siteGuide?.draw();
    selection.value = chosen;
    const { x, y } = point(chosen);
    xField.value = x;
    yField.value = y;
    pathData.value = layout[profile];
    sizeInput.value = layout.dragonSize[profile];
    sizeValue.value = sizeInput.value + "%";
    for (const { part, input, output } of idleControls) {
      input.value = layout.idleMotion[profile][part];
      output.value = input.value + "%";
    }
    twistEditor.draw();
    appendageEditor.draw();
    updateStatus();
    schedulePreview();
  }

  function svgElement(svg, name, attrs, parent) {
    const element = svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
    parent.append(element);
    return element;
  }

  function installGuide(svg) {
    const group = svgElement(svg, "g", { "data-editor-guide": "", fill: "none" }, svg);
    const outline = svgElement(svg, "path", {
      stroke: "#fffdf6", "stroke-width": "5", opacity: ".85", "vector-effect": "non-scaling-stroke",
    }, group);
    const guide = svgElement(svg, "path", {
      stroke: "#007993", "stroke-width": "2.5", "vector-effect": "non-scaling-stroke",
    }, group);
    const links = [];
    for (let i = 1; i <= 11; i++) {
      const endpoints = [i === 1 ? "start" : (i - 1) + "-end", i === 11 ? "start" : i + "-end"];
      for (const [index, kind] of ["out", "in"].entries()) {
        const from = endpoints[index];
        const to = i + "-" + kind;
        const node = svgElement(svg, "line", {
          stroke: "#297486", "stroke-width": "1.5", "stroke-dasharray": "4 3", "vector-effect": "non-scaling-stroke",
        }, group);
        links.push({ node, from, to });
      }
    }
    const handles = descriptors.map(({ key, type, label }) => {
      const node = svgElement(svg, type === "anchor" ? "rect" : "circle", {
        "data-point": key, "aria-label": label, role: "button", tabindex: "0",
        stroke: "#fffdfa", "stroke-width": "1.5", "vector-effect": "non-scaling-stroke",
        style: "pointer-events: all; cursor: grab; touch-action: none;",
      }, group);
      svgElement(svg, "title", {}, node).textContent = label;
      return { key, type, node };
    });
    let drag;
    function localPoint(event) {
      const matrix = svg.getScreenCTM();
      if (!matrix) return null;
      return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    }
    group.addEventListener("pointerdown", (event) => {
      const key = event.target.dataset.point;
      if (!key || event.button !== 0 || drag) return;
      const local = localPoint(event);
      if (!local) return;
      event.preventDefault();
      chosen = key;
      const coordinate = point(key);
      drag = { id: event.pointerId, key, before: layout[profile], x: coordinate.x - local.x, y: coordinate.y - local.y };
      event.target.setPointerCapture(event.pointerId);
      event.target.focus({ preventScroll: true });
      redraw();
    });
    group.addEventListener("pointermove", (event) => {
      if (drag?.id !== event.pointerId) return;
      const local = localPoint(event);
      if (local) changePoint(drag.key, { x: local.x + drag.x, y: local.y + drag.y });
    });
    group.addEventListener("lostpointercapture", ({ pointerId }) => {
      if (drag?.id !== pointerId) return;
      remember(drag.before);
      drag = undefined;
    });
    group.addEventListener("focusin", (event) => {
      if (!event.target.dataset.point) return;
      chosen = event.target.dataset.point;
      redraw();
    });
    group.addEventListener("keydown", (event) => {
      const key = event.target.dataset.point;
      const movement = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
      if (!key || !movement) return;
      event.preventDefault();
      const multiplier = event.shiftKey ? 10 : 1;
      const before = layout[profile];
      const { x, y } = point(key);
      changePoint(key, { x: x + multiplier * movement[0], y: y + multiplier * movement[1] });
      remember(before);
    });
    const picker = svgElement(svg, "path", {
      "data-flight-picker": "", stroke: "#ae681f", "stroke-width": "15", "stroke-opacity": ".32",
      "vector-effect": "non-scaling-stroke", style: "pointer-events: stroke; cursor: crosshair;",
    }, group);
    picker.addEventListener("click", (event) => {
      const pointOnGuide = localPoint(event);
      if (!picking || !pointOnGuide || !track) return;
      setPicking(false);
      seek(Math.round(progressAtPoint(track, flight.value, pointOnGuide) * STEPS));
    });

    const marker = svgElement(svg, "circle", {
      "data-twist-marker": "", fill: "#a14727", stroke: "#fffdfa", "stroke-width": "2",
      "vector-effect": "non-scaling-stroke", "pointer-events": "none", "aria-hidden": "true",
    }, svg);
    const visible = () => guideToggle.checked && (svg === fullRoute ? view === "route" : view === "site");
    function drawMarker() {
      const selected = activePanel === "appendages" ? appendageEditor.segment ?? twistEditor.segment : twistEditor.segment ?? appendageEditor.segment;
      const segment = visible() ? selected : null;
      marker.style.display = segment && track && !playing ? "" : "none";
      if (!segment || !track || playing) return;
      const distance = flightDistance(track, flight.value, flightEase(Number(progress.value) / 100));
      const bodyLength = track.length * dragonBodyFraction(layout.dragonSize[profile]);
      const target = sampleRoute(track, distance + bodyLength * segment.fraction, {});
      const matrix = svg.getScreenCTM();
      const scale = svg === fullRoute ? 1 : iframe.getBoundingClientRect().width / iframe.offsetWidth;
      marker.setAttribute("cx", target.x);
      marker.setAttribute("cy", target.y);
      marker.setAttribute("r", 6 / (Math.abs(matrix?.a) * scale || 1));
    }

    return {
      drawMarker,
      draw() {
        drawMarker();
        const show = visible();
        group.style.display = show ? "" : "none";
        if (!show) return;
        const matrix = svg.getScreenCTM();
        const iframeScale = svg === fullRoute ? 1 : iframe.getBoundingClientRect().width / iframe.offsetWidth;
        const pixelsPerUnit = Math.abs(matrix?.a) * iframeScale || 1;
        const radius = 6 / pixelsPerUnit;
        picker.setAttribute("stroke-width", 16 / (iframeScale || 1));
        const d = layout[profile];
        outline.setAttribute("d", d);
        guide.setAttribute("d", d);
        picker.style.display = picking ? "" : "none";
        if (picking) {
          const opening = pathString([commands[REST_VERTEX][2], ...commands.slice(REST_VERTEX + 1, START_VERTEX + 1)], false);
          picker.setAttribute("d", flight.value === "opening" ? opening : d);
        }
        for (const { node, from, to } of links) {
          const a = point(from);
          const b = point(to);
          node.setAttribute("x1", a.x);
          node.setAttribute("y1", a.y);
          node.setAttribute("x2", b.x);
          node.setAttribute("y2", b.y);
        }
        for (const { key, type, node } of handles) {
          const { x, y } = point(key);
          node.setAttribute("fill", key === chosen ? "#ad6121" : type === "anchor" ? "#245a68" : "#4792a1");
          node.setAttribute("aria-pressed", String(key === chosen));
          if (type === "anchor") {
            node.setAttribute("x", x - radius);
            node.setAttribute("y", y - radius);
            node.setAttribute("width", radius * 2);
            node.setAttribute("height", radius * 2);
            node.setAttribute("rx", radius * .23);
          } else {
            node.setAttribute("cx", x);
            node.setAttribute("cy", y);
            node.setAttribute("r", radius * .79);
          }
        }
      },
    };
  }

  function fitRoute() {
    const points = commands.flat();
    const xs = points.map(({ x }) => x);
    const ys = points.map(({ y }) => y);
    const matrix = siteStage?.querySelector("svg").getScreenCTM();
    const showFrame = Boolean(matrix?.a && matrix.d);
    sizer.toggleAttribute("data-aligned", showFrame);
    deviceFrame.setAttribute("visibility", showFrame ? "visible" : "hidden");
    byId("overview-help").hidden = view !== "route" || !showFrame;
    if (showFrame) {
      const inverse = matrix.inverse();
      const start = new DOMPoint(0, 0).matrixTransform(inverse);
      const end = new DOMPoint(iframe.contentWindow.innerWidth, iframe.contentWindow.innerHeight).matrixTransform(inverse);
      for (const [name, value] of Object.entries({
        x: start.x, y: start.y, width: end.x - start.x, height: end.y - start.y,
      })) deviceFrame.setAttribute(name, value);
      xs.push(start.x, end.x);
      ys.push(start.y, end.y);
    }
    const padding = 80;
    const x = Math.min(0, ...xs) - padding;
    const y = Math.min(0, ...ys) - padding;
    const viewBox = [x, y, Math.max(FRAME[0], ...xs) - x + padding, Math.max(FRAME[1], ...ys) - y + padding].join(" ");
    if (fullRoute.getAttribute("viewBox") !== viewBox) fullRoute.setAttribute("viewBox", viewBox);
    if (showFrame) {
      const frame = deviceFrame.getBoundingClientRect();
      const surface = fullRoute.getBoundingClientRect();
      const scale = frame.width / iframe.contentWindow.innerWidth;
      iframe.style.transform = `translate(${frame.left - surface.left}px, ${frame.top - surface.top}px) scale(${scale})`;
    }
    fullGuide.draw();
  }

  function syncViewport() {
    const width = DEVICE_WIDTHS[profile];
    const height = heights[profile];
    iframe.style.width = width + "px";
    iframe.style.height = height + "px";
    if (view === "route") {
      sizer.style.marginInline = "";
      fitRoute();
    } else {
      const fit = Math.min(1, Math.max(0.05, (workspace.clientWidth - 24) / width));
      const scale = byId("zoom").value === "fit" ? fit : Number(byId("zoom").value);
      iframe.style.transform = "scale(" + scale + ")";
      sizer.style.width = width * scale + "px";
      sizer.style.height = height * scale + "px";
      workspace.style.setProperty("--preview-height", height * scale + 26 + "px");
      sizer.style.marginInline = width * scale > workspace.clientWidth ? "12px" : "auto";
    }
    siteGuide?.draw();
  }

  function atRest() {
    return usesRestPose(flight.value, Math.round(Number(progress.value) * 10));
  }

  function updateIdleButton() {
    const button = byId("preview-idle");
    button.disabled = playing || !atRest() || siteStage?.dataset.dragonStatus !== "ready";
    button.setAttribute("aria-pressed", String(previewIdle));
    idleMotion.disabled = playing;
    sizeInput.disabled = playing;
  }

  function updatePreviewStatus() {
    const current = siteStage?.dataset.dragonStatus;
    if (playing && lastPreviewStatus === "flying" && current === "ready") {
      playing = false;
      seek(STEPS, false);
    }
    lastPreviewStatus = current;
    updateIdleButton();
    byId("fly").disabled = current !== "ready";
    byId("fly").textContent = current === "flying" ? "In flight" : "Play flight";
    byId("loading").hidden = Boolean(siteStage && current !== "unavailable" && current !== "loading");
    if (current === "loading") byId("loading").textContent = "Loading the 3D dragon…";
    if (current === "unavailable") byId("loading").textContent = "3D preview unavailable. You can still edit the path.";
  }

  function connectPreview() {
    siteGuide = undefined;
    siteStage = undefined;
    observer?.disconnect();
    stopMeasuringSite?.();
    sizer.removeAttribute("data-aligned");
    const doc = iframe.contentDocument;
    if (!doc?.body) return;
    function findStage() {
      const stage = doc.querySelector(".d-path[data-dragon-editor-ready]");
      if (!stage) return;
      clearTimeout(loadingTimeout);
      siteStage = stage;
      observer.disconnect();
      observer.observe(stage, { attributes: true, attributeFilter: ["data-dragon-status"] });
      const svg = stage.querySelector("svg");
      siteGuide = installGuide(svg);
      svg.style.userSelect = "none";
      const win = doc.defaultView;
      const measure = () => { if (view === "route") fitRoute(); };
      const resize = new ResizeObserver(measure);
      resize.observe(svg);
      resize.observe(doc.body);
      win.addEventListener("scroll", measure, { passive: true });
      stopMeasuringSite = () => {
        resize.disconnect();
        win.removeEventListener("scroll", measure);
      };
      dispatchPreview();
      syncViewport();
      updatePreviewStatus();
    }
    observer = new MutationObserver(() => siteStage ? updatePreviewStatus() : findStage());
    observer.observe(doc.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-dragon-editor-ready"] });
    findStage();
  }

  function switchView(next) {
    if (view === next) return;
    view = next;
    document.querySelectorAll("[data-view]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.view === view)));
    overview.hidden = view !== "route";
    iframe.inert = view !== "site";
    workspace.dataset.view = view;
    byId("zoom").disabled = view !== "site";
    if (view === "site") byId("overview-help").hidden = true;
    syncViewport();
    dispatchPreview();
    updatePreviewStatus();
  }

  const fullGuide = installGuide(fullRoute);
  byId("editor").hidden = false;
  byId("save-actions").hidden = false;
  new ResizeObserver(syncViewport).observe(workspace);
  iframe.addEventListener("load", connectPreview);
  iframe.src = "/?dragonPathPreview=1";
  loadingTimeout = setTimeout(() => {
    if (!siteStage) byId("loading").textContent = "Homepage preview unavailable. Use Full route to keep editing.";
  }, 18000);

  document.querySelectorAll("[data-profile]").forEach((button) => button.addEventListener("click", () => {
    profile = button.dataset.profile;
    document.querySelectorAll("[data-profile]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    syncViewport();
    setPath(layout[profile]);
    if (view === "route") fitRoute();
  }));
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  byId("zoom").addEventListener("change", syncViewport);
  guideToggle.addEventListener("change", () => {
    if (!guideToggle.checked && picking) setPicking(false);
    fullGuide.draw();
    siteGuide?.draw();
  });
  selection.addEventListener("change", () => { chosen = selection.value; redraw(); });
  for (const field of [xField, yField]) {
    field.addEventListener("change", () => {
      if (!field.validity.valid || !field.value) return;
      const before = layout[profile];
      changePoint(chosen, { x: Number(xField.value), y: Number(yField.value) });
      remember(before);
    });
  }
  byId("find").addEventListener("click", () => {
    const svg = siteStage?.querySelector("svg");
    const matrix = view === "site" && svg?.getScreenCTM();
    if (matrix) {
      const { x, y } = point(chosen);
      const target = new DOMPoint(x, y).matrixTransform(matrix);
      if (target.x >= 0 && target.x < iframe.contentWindow.innerWidth) {
        guideToggle.checked = true;
        siteGuide.draw();
        iframe.contentWindow.scrollBy(0, target.y - iframe.contentWindow.innerHeight * .5);
        return;
      }
    }
    switchView("route");
    guideToggle.checked = true;
    fullGuide.draw();
    fullRoute.querySelector('[data-point="' + chosen + '"]')?.focus();
  });
  byId("undo").addEventListener("click", () => {
    const previous = history[profile].pop();
    if (previous && setPath(previous) && view === "route") fitRoute();
  });
  byId("reset").addEventListener("click", () => {
    const before = layout[profile];
    setPath(defaults[profile]);
    remember(before);
  });
  byId("apply").addEventListener("click", () => {
    const before = layout[profile];
    if (setPath(pathData.value.trim())) {
      remember(before);
    } else updateStatus("Use one absolute M, eleven C commands and Z. The final curve must end at the starting point.");
  });
  progress.addEventListener("input", () => seek(Math.round(Number(progress.value) * 10)));
  flight.addEventListener("change", () => {
    seek(Math.round(Number(progress.value) * 10));
    fullGuide.draw();
    siteGuide?.draw();
  });
  byId("pick-position").addEventListener("click", () => setPicking(!picking));
  byId("preview-idle").addEventListener("click", () => {
    previewIdle = !previewIdle;
    dispatchPreview();
  });
  sizeInput.addEventListener("input", () => {
    layout.dragonSize = { ...layout.dragonSize, [profile]: sizeInput.valueAsNumber };
    sizeValue.value = sizeInput.value + "%";
    updateStatus();
    schedulePreview();
  });
  for (const { part, input, output } of idleControls) {
    input.addEventListener("input", () => {
      layout.idleMotion = {
        ...layout.idleMotion,
        [profile]: { ...layout.idleMotion[profile], [part]: input.valueAsNumber },
      };
      output.value = input.value + "%";
      updateStatus();
      schedulePreview();
    });
  }
  byId("fly").addEventListener("click", () => {
    cancelAnimationFrame(pendingPreview);
    setPicking(false);
    dispatchPreview(true);
    drawMarkers();
  });
  byId("save").addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeFlightPreview(layout, defaults));
      saved = { ...layout };
      cleanStatus = "Saved for this browser’s local homepage.";
      source.showJsonLink();
      updateStatus();
    } catch {
      updateStatus("Browser storage is unavailable. Download the path file to keep your edits.");
    }
  });
  const exportJson = () => JSON.stringify(layout, null, 2) + "\n";
  const copy = byId("copy");
  let copyTimeout;
  copy.addEventListener("click", async () => {
    const json = exportJson();
    const output = byId("json-output");
    const text = byId("json-data");
    text.value = json;
    try {
      await navigator.clipboard.writeText(json);
      updateStatus("Flight paths JSON copied.");
      copy.textContent = "Copied";
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => { copy.textContent = "Copy JSON"; }, 1500);
    } catch {
      output.hidden = false;
      output.open = true;
      text.focus();
      text.select();
      updateStatus("Copy the selected flight paths JSON.");
    }
  });
  byId("download").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([exportJson()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "flight-paths.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    updateStatus("Downloaded flight-paths.json with all three profiles.");
  });
  syncViewport();
  redraw();
}
