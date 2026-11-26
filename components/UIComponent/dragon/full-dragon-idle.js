import { MathUtils } from "three";

function gesture(time, offset, interval, duration) {
  const phase = (time + offset) % interval / duration;
  return phase < 1 ? Math.sin(phase * Math.PI) ** 2 : 0;
}

export function sampleIdle(pose, time, amount) {
  const look = gesture(time, 1.25, 10.2, 3.4);
  pose.amount = amount;
  pose.breath = Math.sin(time * 1.27) * amount;
  pose.pitch = (.035 * Math.sin(time * 1.27 - .7) + .19 * look) * amount;
  pose.yaw = .20 * look * Math.sin(time * .82 + .6) * amount;
  pose.tail = gesture(time, 6.4, 9.7, 4.1) * amount;
  pose.jawOpen = .13 * gesture(time, 3.2, 11.8, 2.2) * amount + .012 * Math.max(0, pose.breath);
  const blink = gesture(time, 4.38, 5.6, .27);
  const secondBlink = gesture(time, 12.80, 16.8, .22);
  pose.blink = Math.max(blink, secondBlink) * amount;
  pose.gazeSide = (.13 * look * Math.sin(time * 1.1) + .05 * Math.sin(time * .66)) * amount;
  pose.gazeUp = .11 * look * Math.cos(time * .92) * amount;
  pose.phase = time;
}

export function bendIdleSpine(position, fraction, length, idle) {
  const tip = MathUtils.smootherstep(fraction, .56, 1);
  const delay = idle.phase * 2.7 - fraction * 12;
  const neck = 1 - MathUtils.smootherstep(fraction, 0, .26);
  position.y += length * (.0017 * neck * idle.breath + .019 * tip * idle.tail * Math.sin(delay));
  position.z += length * (.0012 * (1 - fraction) * idle.breath + .013 * tip * idle.tail * Math.cos(delay));
}

export function idleJointRotation(joint, idle, euler) {
  const side = joint.side;
  const time = idle.phase;
  if (joint.kind === "leg") {
    const reach = gesture(time, (side > 0 ? 1.8 : 6.1) + joint.fraction * 5, 13.1, 2.6) * idle.amount;
    return euler.set(.13 * side * reach, -.09 * side * reach, (.18 + .05 * Math.sin(time * 2.6)) * reach);
  }
  const flutter = (Math.sin(time * 2.6 + side * .9) * .025 +
    gesture(time, side + 2, 7.4, 2.9) * Math.sin(time * 4.4 + side * .8) * .078) * idle.amount;
  return euler.set(0, side * flutter, flutter * -.65);
}
