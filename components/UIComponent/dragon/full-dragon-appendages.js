import { Euler, MathUtils, Quaternion } from "three";
import { appendageChannel } from "../../../public/dragon/dragon-appendage-keys.mjs";
import { gesture } from "./full-dragon-idle.js";

function adjustment(motion, part, control) {
  return motion.adjustments?.[appendageChannel(part, control)] ?? 0;
}

function grasp(time) {
  const phase = time % 8.7;
  return MathUtils.smootherstep(phase, 0, .58) * (1 - MathUtils.smootherstep(phase, 1.16, 1.98));
}

function motionForLeg(state, motion, turn) {
  const lag = (state.hind ? 1.05 : 0) + (state.side > 0 ? .48 : -.48);
  const phase = motion.travel * 3.45 - lag;
  state.phase = phase;
  state.swing = Math.sin(phase) * motion.air;
  state.follow = Math.sin(phase - .87) * motion.air;
  state.turn = turn * motion.air;
  state.air = motion.air;
  state.reach = gesture(motion.phase, (state.side > 0 ? 1.8 : 6.1) + (state.hind ? 2.8 : 1.2), 13.1, 2.6) * motion.pawWeight;
  state.gripClock = motion.phase + (state.side > 0 ? 5.8 : 2.4) + (state.hind ? 1.55 : 0);
  state.idleWeight = motion.pawWeight;
  state.grip = grasp(state.gripClock) * motion.pawWeight;
  state.elbow = MathUtils.degToRad(adjustment(motion, state.id, "elbow"));
  state.wrist = MathUtils.degToRad(adjustment(motion, state.id, "wrist"));
  state.curl = MathUtils.degToRad(adjustment(motion, state.id, "curl"));
}

function jointAngles(joint, move, euler) {
  const { side, hind, air, turn, reach, swing, follow, phase, grip } = move;
  if (joint.kind === "elbow") {
    return euler.set(-side * .12 * air, side * (.15 * air + .10 * swing),
      (hind ? .38 : .12) * air + .20 * follow + .22 * turn + .15 * reach + .17 * grip + move.elbow);
  }
  if (joint.kind === "wrist") {
    return euler.set(side * (-.09 * follow - .10 * reach), .14 * turn + .09 * follow,
      (hind ? -.20 : -.12) * air + .24 * Math.sin(phase - 1.55) * air - .12 * reach - .23 * grip + move.wrist);
  }
  const thumb = joint.index === 3;
  const spread = thumb ? -.8 : joint.index - 1;
  const close = grasp(move.gripClock - joint.index * .085) * move.idleWeight;
  const flightCurl = (.16 + .14 * Math.sin(phase - 2.05 - joint.index * .24)) * air;
  const curl = MathUtils.clamp(.64 * close + .10 * reach + flightCurl + move.curl, -.78, 1.22);
  const bend = joint.kind === "claw" ? 1.08 : .74;
  return euler.set(0,
    side * (spread * (curl * -.24 + .05 * follow) - (thumb ? .24 * close : 0)),
    (thumb ? 1 : -1) * curl * bend);
}

function tendrilAngles(joint, motion, turn, idleAmount, euler) {
  const u = joint.index / 5;
  const length = joint.chin ? .74 : 1;
  const wind = motion.travel * 4.6 - u * 4.15 + joint.side * .55 + (joint.chin ? .9 : 0);
  const drift = motion.phase * 1.42 - u * 5.2 + joint.side * .67 + (joint.chin ? .88 : 0);
  const amplitude = (.008 + .139 * u ** 1.45) * idleAmount;
  const ripple = .025 * u * Math.sin(motion.phase * 2.11 - u * 7.2 + joint.side) * idleAmount;
  const flutter = (Math.sin(wind) * (.038 + .065 * u) + .02 * Math.sin(wind * 1.72)) * motion.air;
  const wake = motion.air * turn * (.19 - .11 * u);
  const strength = 1 + adjustment(motion, joint.part, "wave") / 100;
  const weight = (.35 + u) / 5.1;
  const bend = MathUtils.degToRad(adjustment(motion, joint.part, "bend")) * weight;
  const lift = MathUtils.degToRad(adjustment(motion, joint.part, "lift")) * weight;
  return euler.set(0,
    joint.side * (length * (.038 * motion.air + strength * (.54 * amplitude * Math.cos(drift) + .65 * flutter)) - bend),
    length * (strength * (amplitude * Math.sin(drift) + ripple + flutter) + wake + .014 * motion.air) - lift);
}

export function createAppendageMotion(model, hasWhiskerWave) {
  const legs = new Map();
  const tendrils = [];
  const localEuler = new Euler();
  const delta = new Quaternion();
  model.traverse((bone) => {
    if (!bone.isBone) return;
    const limb = /^(leg|elbow|wrist|digit|claw)_(\d+)_(left|right)(?:_(\d+))?$/.exec(bone.name);
    const tendril = /^tendril_(lip|chin)_(left|right)_(\d+)$/.exec(bone.name);
    if (!limb && !tendril) return;
    if (limb?.[1] === "leg") {
      const hind = Number(limb[2]) > 4000;
      legs.set(bone.name, { id: (hind ? "hind-" : "front-") + limb[3], side: limb[3] === "left" ? 1 : -1, hind, joints: [] });
      return;
    }
    const bindWorld = bone.getWorldQuaternion(new Quaternion());
    const joint = {
      bone, bindWorld, bindWorldInverse: bindWorld.clone().invert(), bindLocal: bone.quaternion.clone(),
      index: tendril ? Number(tendril[3]) : Number(limb[4] ?? 0),
    };
    if (tendril) {
      joint.chin = tendril[1] === "chin";
      joint.side = tendril[2] === "left" ? 1 : -1;
      joint.part = tendril[1] + "-" + tendril[2];
      tendrils.push(joint);
    } else {
      joint.kind = limb[1];
      legs.get("leg_" + limb[2] + "_" + limb[3]).joints.push(joint);
    }
  });

  function rotate(joint, euler) {
    joint.bone.quaternion.copy(joint.bindLocal).multiply(joint.bindWorldInverse)
      .multiply(delta.setFromEuler(euler)).multiply(joint.bindWorld);
  }

  return {
    shoulder(joint, motion, turn, euler) {
      const state = legs.get(joint.bone.name);
      motionForLeg(state, motion, turn);
      const { side, hind, reach, air, swing } = state;
      const tuck = MathUtils.degToRad(adjustment(motion, state.id, "tuck"));
      const sweep = MathUtils.degToRad(adjustment(motion, state.id, "sweep"));
      return euler.set(side * (.13 * reach - (hind ? .29 : .09) * air - tuck - .07 * state.grip),
        side * (-.09 * reach + .09 * swing) + .21 * state.turn,
        .19 * reach - (hind ? .48 : .76) * air + .20 * swing + .32 * state.turn + sweep);
    },
    pose(motion, headTurn) {
      for (const leg of legs.values()) {
        for (const joint of leg.joints) rotate(joint, jointAngles(joint, leg, localEuler));
      }
      const tendrilIdle = hasWhiskerWave ? 0 : motion.whiskerWeight;
      for (const joint of tendrils) rotate(joint, tendrilAngles(joint, motion, headTurn, tendrilIdle, localEuler));
    },
  };
}
