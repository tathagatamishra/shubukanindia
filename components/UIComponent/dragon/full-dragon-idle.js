import { MathUtils } from "three";

export function gesture(time, offset, interval, duration) {
  const phase = (time + offset) % interval / duration;
  return phase < 1 ? Math.sin(phase * Math.PI) ** 2 : 0;
}

export function sampleIdle(pose, time, weight, strengths) {
  const head = weight * strengths.head / 100;
  const look = gesture(time, 1.25, 10.2, 3.4);
  pose.headWeight = head;
  pose.whiskerWeight = weight * strengths.whiskers / 100;
  pose.pawWeight = weight * strengths.paws / 100;
  pose.breath = Math.sin(time * 1.27) * head;
  pose.pitch = (.035 * Math.sin(time * 1.27 - .7) + .19 * look) * head;
  pose.yaw = .20 * look * Math.sin(time * .82 + .6) * head;
  pose.tail = gesture(time, 6.4, 9.7, 4.1) * weight * strengths.tail / 100;
  pose.jawOpen = .13 * gesture(time, 3.2, 11.8, 2.2) * head + .012 * Math.max(0, pose.breath);
  const blink = gesture(time, 4.38, 5.6, .27);
  const secondBlink = gesture(time, 12.80, 16.8, .22);
  pose.blink = Math.max(blink, secondBlink) * head;
  pose.gazeSide = (.13 * look * Math.sin(time * 1.1) + .05 * Math.sin(time * .66)) * head;
  pose.gazeUp = .11 * look * Math.cos(time * .92) * head;
  pose.phase = time;
}

export function bendIdleSpine(position, fraction, length, idle) {
  const tip = MathUtils.smootherstep(fraction, .56, 1);
  const delay = idle.phase * 2.7 - fraction * 12;
  const neck = 1 - MathUtils.smootherstep(fraction, 0, .26);
  position.y += length * (.0017 * neck * idle.breath + .019 * tip * idle.tail * Math.sin(delay));
  position.z += length * (.0012 * (1 - fraction) * idle.breath + .013 * tip * idle.tail * Math.cos(delay));
}

export function idleWhiskerRotation(joint, idle, euler) {
  const side = joint.side;
  const time = idle.phase;
  const flutter = (Math.sin(time * 2.6 + side * .9) * .025 +
    gesture(time, side + 2, 7.4, 2.9) * Math.sin(time * 4.4 + side * .8) * .078) * idle.whiskerWeight;
  return euler.set(0, side * flutter, flutter * -.65);
}
