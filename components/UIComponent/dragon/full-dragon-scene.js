import {
  ACESFilmicToneMapping, DirectionalLight, Euler, HemisphereLight, Matrix4,
  MathUtils, OrthographicCamera, Quaternion, Scene, Vector3, Vector4, WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import {
  compileTrack, dragonBodyFraction, DRAGON_SIZE_DEFAULT, flightDistance, flightEase,
  IDLE_PARTS, normalizeIdleMotion, parsePath, sampleRoute,
} from "../../../public/dragon/flight-path.mjs";
import { blendBodyTwist, SEGMENTS, STEPS, twistAt } from "../../../public/dragon/dragon-twist.mjs";
import { bendIdleSpine, idleWhiskerRotation, sampleIdle } from "./full-dragon-idle";
import { sampleAppendageKeys } from "../../../public/dragon/dragon-appendage-keys.mjs";
import { createAppendageMotion } from "./full-dragon-appendages";
import { applyPaperPigment } from "./full-dragon-material";

function sample(track, distance, target) {
  sampleRoute(track, distance, target);
  target.y = -target.y;
  target.z = 0;
}

function createRig(model) {
  model.updateMatrixWorld(true);
  const spine = [];
  const anchors = [];
  const skins = [];
  const materials = new Set();
  model.traverse((object) => {
    if (object.isSkinnedMesh) {
      object.frustumCulled = false;
      skins.push(object);
      for (const material of [].concat(object.material)) materials.add(material);
    }
    if (!object.isBone) return;
    const match = /^(spine|anchor|leg|whisker|jaw|eye|lid)_(\d+)(?:_(left|right))?$/.exec(object.name);
    if (!match) return;
    const parentInverse = object.parent.matrixWorld.clone().invert();
    const parentRotation = object.parent.getWorldQuaternion(new Quaternion()).invert();
    const joint = {
      bone: object,
      parentInverse,
      parentRotation,
      bindRotation: object.getWorldQuaternion(new Quaternion()),
      center: new Vector3(),
      forward: new Vector3(),
      kind: match[1],
      side: match[3] === "left" ? 1 : -1,
      pivot: match[1] !== "spine" && match[1] !== "anchor" ? object.getWorldPosition(new Vector3()) : null,
      index: Number(match[2]),
    };
    (match[1] === "spine" ? spine : anchors).push(joint);
  });
  spine.sort((a, b) => a.index - b.index);
  if (spine.length < 2 || !anchors.some(({ index }) => index === 0) || !skins.length) {
    throw new Error("The dragon model is missing its spine rig.");
  }
  spine.forEach((joint, index) => { joint.fraction = index / (spine.length - 1); });
  anchors.forEach((joint) => { joint.fraction = joint.index / 10000; });
  const length = spine[0].bone.getWorldPosition(new Vector3()).distanceTo(spine.at(-1).bone.getWorldPosition(new Vector3()));
  if (!Number.isFinite(length) || length < 1) throw new Error("Invalid dragon bind pose.");
  const joints = [...spine, ...anchors];
  for (const joint of joints) {
    if (joint.pivot) joint.pivot.x += joint.fraction * length;
  }
  const whiskerWave = skins.some((mesh) => mesh.geometry.hasAttribute("_whisker")) ? {
    whiskerTime: { value: 0 },
    whiskerIdleAmount: { value: 0 },
    whiskerFlightAmount: { value: 0 },
    whiskerMobileBoost: { value: 0 },
    whiskerWaveStrength: { value: new Vector4(1, 1, 1, 1) },
  } : undefined;
  for (const material of materials) {
    if (material.isMeshStandardMaterial) applyPaperPigment(material, whiskerWave);
  }
  const appendages = createAppendageMotion(model, Boolean(whiskerWave));
  const following = new Vector3();
  const a = new Vector3();
  const b = new Vector3();
  const up = new Vector3();
  const side = new Vector3();
  const basis = new Matrix4();
  const rotation = new Quaternion();
  const root = new Vector3();
  const pivot = new Vector3();
  const euler = new Euler();
  const secondary = new Quaternion();

  function trailAngle(track, distance, joint, reach) {
    sample(track, distance + reach, following);
    following.subVectors(joint.center, following);
    const tangent = joint.forward;
    const cross = tangent.x * following.y - tangent.y * following.x;
    const dot = tangent.x * following.x + tangent.y * following.y;
    return MathUtils.clamp(Math.atan2(cross, dot), -.8, .8);
  }

  return {
    spine,
    pose(track, headDistance, bodyLength, bank, twistAngles, idle, viewWidth) {
      const scale = bodyLength / length;
      const bending = idle.breath !== 0 || idle.tail !== 0;
      let headTurn = 0;
      for (const joint of joints) {
        const distance = headDistance + bodyLength * joint.fraction;
        sample(track, distance, joint.center);
        sample(track, distance - 4, a);
        sample(track, distance + 4, b);
        if (bending) {
          const span = 4 / bodyLength;
          bendIdleSpine(joint.center, joint.fraction, bodyLength, idle);
          bendIdleSpine(a, Math.max(0, joint.fraction - span), bodyLength, idle);
          bendIdleSpine(b, Math.min(1, joint.fraction + span), bodyLength, idle);
        }
        joint.forward.subVectors(a, b);
        if (joint.forward.lengthSq() < .0001) joint.forward.set(1, 0, 0);
        joint.forward.normalize();
        if (idle.air > 0 && joint === spine[0]) headTurn = trailAngle(track, distance, joint, bodyLength * .19);
        up.set(-joint.forward.y, joint.forward.x, 0);
        const twist = MathUtils.degToRad(blendBodyTwist(twistAngles, joint.fraction));
        up.applyAxisAngle(joint.forward, bank + .14 * Math.sin(distance / track.length * Math.PI * 10) + twist);
        side.crossVectors(joint.forward, up);
        rotation.setFromRotationMatrix(basis.makeBasis(joint.forward, up, side));
        if (idle.headWeight > 0 && joint.fraction < .22) {
          const neck = 1 - MathUtils.smootherstep(joint.fraction, 0, .22);
          euler.set(0, idle.yaw * neck, idle.pitch * neck);
          rotation.multiply(secondary.setFromEuler(euler));
          joint.forward.set(1, 0, 0).applyQuaternion(rotation);
        }
        root.copy(joint.center).divideScalar(scale);
        if (joint.pivot) {
          root.add(pivot.copy(joint.pivot).applyQuaternion(rotation));
          if (joint.kind === "leg") {
            const reach = bodyLength * (joint.fraction > .4 ? .12 : .15);
            const turn = idle.air > 0 ? trailAngle(track, distance, joint, reach) : 0;
            rotation.multiply(secondary.setFromEuler(appendages.shoulder(joint, idle, turn, euler)));
          } else if (joint.kind === "jaw") {
            const close = .361 - idle.jawOpen - idle.flightGape;
            rotation.multiply(secondary.setFromEuler(euler.set(0, 0, close)));
          } else if (joint.kind === "eye" || joint.kind === "lid") {
            // The export's bone-local Z points up through the orbit.
            const eye = joint.kind === "eye";
            joint.bone.scale.z = 1 - (eye ? .96 : .88) * idle.blink;
            if (eye) {
              const gaze = 1 - idle.blink;
              euler.set(-joint.side * idle.gazeUp * gaze, idle.gazeSide * gaze, 0);
              rotation.multiply(secondary.setFromEuler(euler));
            }
          } else if (joint.kind === "whisker" && idle.whiskerWeight > 0) {
            rotation.multiply(secondary.setFromEuler(idleWhiskerRotation(joint, idle, euler)));
          }
        }
        joint.bone.position.copy(root).applyMatrix4(joint.parentInverse);
        joint.bone.quaternion.copy(joint.parentRotation).multiply(rotation).multiply(joint.bindRotation);
      }
      if (whiskerWave) {
        const adjustments = idle.adjustments;
        whiskerWave.whiskerTime.value = idle.whiskerTime;
        whiskerWave.whiskerIdleAmount.value = idle.whiskerWeight;
        whiskerWave.whiskerFlightAmount.value = idle.whiskerFlight;
        whiskerWave.whiskerMobileBoost.value = 1 - MathUtils.smoothstep(viewWidth, 450, 800);
        whiskerWave.whiskerWaveStrength.value.set(
          1 + (adjustments["lip-left.wave"] ?? 0) / 100,
          1 + (adjustments["lip-right.wave"] ?? 0) / 100,
          1 + (adjustments["chin-left.wave"] ?? 0) / 100,
          1 + (adjustments["chin-right.wave"] ?? 0) / 100,
        );
      }
      appendages.pose(idle, headTurn);
      return scale;
    },
    dispose() {
      const geometries = new Set();
      const skeletons = new Set();
      model.traverse((object) => {
        if (!object.isMesh) return;
        geometries.add(object.geometry);
        if (object.isSkinnedMesh) skeletons.add(object.skeleton);
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      for (const skeleton of skeletons) skeleton.dispose();
    },
  };
}

export function mountDragon({
  canvas, path, report, preview, twists, appendageKeys, idleMotion = normalizeIdleMotion(),
  dragonSize = DRAGON_SIZE_DEFAULT, getViewportWidth,
}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    report("unavailable");
    return null;
  }
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 1, 0, 1, 3000);
  camera.position.z = 1500;
  scene.add(new HemisphereLight(0xfff4e6, 0xbb9d83, 2.15));
  const key = new DirectionalLight(0xffead1, 1.9);
  key.position.set(-350, 500, 650);
  scene.add(key);
  const rim = new DirectionalLight(0xe9e2da, .85);
  rim.position.set(250, 360, -350);
  scene.add(rim);

  const doc = canvas.ownerDocument;
  const win = doc.defaultView;
  const reducedMotion = win.matchMedia("(prefers-reduced-motion: reduce)");
  const stage = path.ownerSVGElement;
  let model, rig, track, transform, trackSource;
  const twistAngles = SEGMENTS.map(() => 0);
  const idle = { adjustments: {} };
  let idleTime = 0;
  let idleMix = 0;
  let flightMix = 0;
  let whiskerTime = 0;
  let idleTimer = 0;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 0;
  let shown = false;
  let disposed = false;
  let canRender = true;
  let initial = true;
  let moving = false;
  let paused = false;
  let previewIdle = false;
  let progress = 1;
  let firstFlight = false;
  let forceFrame = true;

  function schedule() {
    clearTimeout(idleTimer);
    if (!frame && !disposed && canRender) frame = win.requestAnimationFrame(draw);
  }

  function setFlight(opening = false) {
    if (!rig || !track || paused || moving) return;
    initial = false;
    firstFlight = opening;
    moving = true;
    elapsed = 0;
    progress = 0;
    lastTime = 0;
    report("flying");
    schedule();
  }

  function draw(time) {
    frame = 0;
    if (!rig || !track || doc.hidden) return;
    const matrix = stage.getScreenCTM();
    if (!matrix?.a || !matrix.d) return;
    const canvasBounds = canvas.getBoundingClientRect();
    transform = { a: matrix.a, d: matrix.d, e: matrix.e - canvasBounds.left, f: matrix.f - canvasBounds.top };
    const bounds = stage.getBoundingClientRect();
    const viewWidth = canvas.clientWidth;
    const viewHeight = canvas.clientHeight;
    const visible = viewWidth > 0 && viewHeight > 0 &&
      bounds.bottom > canvasBounds.top - 120 && bounds.top < canvasBounds.bottom + 120;
    if (!visible) {
      if (shown) renderer.clear();
      shown = false;
      lastTime = 0;
      return;
    }

    if (initial && !preview) {
      initial = false;
      if (!reducedMotion.matches) {
        firstFlight = true;
        moving = true;
        progress = 0;
        report("flying");
      }
    }
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .08) : 0;
    const previousProgress = progress;
    if (moving && !paused) {
      elapsed += delta;
      const duration = firstFlight ? 5.2 : 8.4;
      progress = Math.min(1, elapsed / duration);
      if (progress === 1) {
        moving = false;
        report("ready");
      }
    }
    const couldIdle = (!preview || previewIdle) && !reducedMotion.matches;
    const previousIdleMix = idleMix;
    const previousFlightMix = flightMix;
    if (reducedMotion.matches) {
      idleMix = 0;
      flightMix = 0;
    } else if (!paused) {
      idleMix = MathUtils.clamp(idleMix + (couldIdle ? delta / .85 : -delta / .55), 0, 1);
      flightMix = MathUtils.clamp(flightMix + (moving ? delta / 1.15 : -delta / 1.45), 0, 1);
    }
    // Keep both layers running across the handoff at takeoff and landing.
    const flightWeight = MathUtils.smootherstep(flightMix, 0, 1);
    const idleWeight = MathUtils.smootherstep(idleMix, 0, 1) * (1 - flightWeight);
    const hasIdleMotion = IDLE_PARTS.some((part) => idleMotion[part] > 0);
    if (!paused) {
      if (idleWeight > 0 && hasIdleMotion) idleTime += delta;
      if (idleWeight * idleMotion.whiskers > 0 || flightWeight > 0) whiskerTime += delta * (1 + .55 * flightWeight);
    }
    const animatingRest = !moving && (flightMix > 0 || (hasIdleMotion && (couldIdle || idleMix > 0)));

    const nativeRatio = win.devicePixelRatio || 1;
    const nextRatio = viewWidth <= 650
      ? Math.min(MathUtils.clamp(nativeRatio, 2.25, 3), Math.sqrt(4_200_000 / (viewWidth * viewHeight)))
      : Math.min(nativeRatio, 1.5);
    if (width !== viewWidth || height !== viewHeight || pixelRatio !== nextRatio) {
      pixelRatio = nextRatio;
      renderer.setPixelRatio(pixelRatio);
      width = viewWidth;
      height = viewHeight;
      renderer.setSize(width, height, false);
    }
    camera.left = -transform.e / transform.a;
    camera.right = (width - transform.e) / transform.a;
    camera.top = transform.f / transform.d;
    camera.bottom = (transform.f - height) / transform.d;
    camera.updateProjectionMatrix();

    if (progress !== previousProgress || moving || animatingRest || previousIdleMix !== idleMix ||
        previousFlightMix !== flightMix || forceFrame || !shown) {
      const flight = firstFlight ? "opening" : "lap";
      const eased = flightEase(progress);
      const headDistance = flightDistance(track, flight, eased);
      for (const [i, { id }] of SEGMENTS.entries()) {
        twistAngles[i] = twistAt(twists, flight, id, progress * STEPS);
      }
      sampleIdle(idle, idleTime, idleWeight, idleMotion);
      idle.whiskerTime = whiskerTime;
      idle.whiskerFlight = flightWeight;
      sampleAppendageKeys(idle.adjustments, appendageKeys, flight, progress * STEPS);
      idle.air = MathUtils.smootherstep(progress, 0, .22) * (1 - MathUtils.smootherstep(progress, .77, 1));
      const bodyFraction = dragonBodyFraction(dragonSize);
      const bodyLength = track.length * bodyFraction;
      idle.travel = (flight === "opening" ? (track.start - track.rest) / track.length : 1) * eased / bodyFraction;
      idle.flightGape = .09 * Math.sin(Math.PI * progress) ** 2;
      const bank = .25 + .23 * Math.sin(eased * Math.PI * 2);
      model.scale.setScalar(rig.pose(track, headDistance, bodyLength, bank, twistAngles, idle, getViewportWidth?.() ?? viewWidth));
      forceFrame = false;
    }
    renderer.render(scene, camera);
    shown = true;
    if (moving && !paused) {
      lastTime = time;
      schedule();
    } else if (animatingRest && spineInView()) {
      lastTime = time;
      idleTimer = setTimeout(schedule, 25);
    } else {
      lastTime = 0;
    }
  }

  function spineInView() {
    const margin = 80;
    return rig.spine.some(({ center }) => {
      const x = transform.e + center.x * transform.a;
      const y = transform.f - center.y * transform.d;
      return x > -margin && x < width + margin && y > -margin && y < height + margin;
    });
  }

  function refresh() {
    const source = path.getAttribute("d");
    if (source !== trackSource) {
      track = compileTrack(parsePath(source));
      trackSource = source;
    }
    forceFrame = true;
    schedule();
  }
  function scrub(value, opening, animateIdle = false) {
    const next = MathUtils.clamp(value, 0, 1);
    const rest = next === 1 || (!opening && next === 0);
    if (moving || progress !== next || firstFlight !== opening) flightMix = 0;
    if (!rest) idleMix = 0;
    moving = false;
    paused = false;
    progress = next;
    firstFlight = opening;
    previewIdle = preview && animateIdle && rest;
    if (rig) report("ready");
    refresh();
  }
  function togglePause() {
    if (!moving) return;
    paused = !paused;
    lastTime = 0;
    report(paused ? "paused" : "flying");
    schedule();
  }
  function motionChanged() {
    if (reducedMotion.matches && moving && !paused) togglePause();
    forceFrame = true;
    schedule();
  }
  function visibilityChanged() {
    lastTime = 0;
    clearTimeout(idleTimer);
    if (!doc.hidden) schedule();
  }
  function hit(x, y) {
    if (!shown || !track || !transform || !rig) return false;
    const bounds = canvas.getBoundingClientRect();
    const worldX = (x - bounds.left - transform.e) / transform.a;
    const worldY = (transform.f - y + bounds.top) / transform.d;
    const head = rig.spine[0];
    const headReach = model.scale.x * 1.1;
    if (Math.hypot(head.center.x + head.forward.x * headReach - worldX,
      head.center.y + head.forward.y * headReach - worldY) < 2.3 * model.scale.x) return true;
    return rig.spine.some(({ center, fraction }) =>
      Math.hypot(center.x - worldX, center.y - worldY) < (1.03 - .58 * fraction) * model.scale.x);
  }
  function contextLost(event) {
    event.preventDefault();
    canRender = false;
    lastTime = 0;
    clearTimeout(idleTimer);
    win.cancelAnimationFrame(frame);
    frame = 0;
    report("unavailable");
  }
  function contextRestored() {
    canRender = true;
    forceFrame = true;
    width = height = 0;
    report(rig ? (moving ? (paused ? "paused" : "flying") : "ready") : "loading");
    schedule();
  }

  const observer = new win.ResizeObserver(schedule);
  observer.observe(stage);
  observer.observe(canvas);
  const homepage = stage.closest(".Home");
  if (homepage) observer.observe(homepage);
  const viewBoxObserver = new win.MutationObserver(schedule);
  viewBoxObserver.observe(stage, { attributes: true, attributeFilter: ["viewBox"] });
  win.addEventListener("resize", schedule, { passive: true });
  win.addEventListener("scroll", schedule, { passive: true });
  doc.addEventListener("visibilitychange", visibilityChanged);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  reducedMotion.addEventListener("change", motionChanged);
  refresh();

  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync("/dragon/dragon-full.glb").then(({ scene: asset }) => {
    const loaded = createRig(asset);
    if (disposed) {
      loaded.dispose();
      return;
    }
    model = asset;
    rig = loaded;
    scene.add(model);
    if (canRender) report("ready");
    schedule();
  }).catch((error) => {
    if (!disposed) {
      console.error("Could not load the homepage dragon.", error);
      report("unavailable");
    }
  });

  return {
    refresh, scrub, setFlight, togglePause, hit,
    setTwists(value) {
      twists = value;
      forceFrame = true;
      schedule();
    },
    setAppendageKeys(keys) {
      appendageKeys = keys;
      forceFrame = true;
      schedule();
    },
    setIdleMotion(value) {
      idleMotion = value;
      forceFrame = true;
      schedule();
    },
    setDragonSize(value) {
      if (dragonSize === value) return;
      dragonSize = value;
      forceFrame = true;
      schedule();
    },
    dispose() {
      disposed = true;
      clearTimeout(idleTimer);
      win.cancelAnimationFrame(frame);
      observer.disconnect();
      viewBoxObserver.disconnect();
      win.removeEventListener("resize", schedule);
      win.removeEventListener("scroll", schedule);
      doc.removeEventListener("visibilitychange", visibilityChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      reducedMotion.removeEventListener("change", motionChanged);
      rig?.dispose();
      renderer.dispose();
    },
  };
}
