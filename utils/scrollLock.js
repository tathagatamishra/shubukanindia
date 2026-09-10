// utils/scrollLock.js
//
// Reference-counted background-scroll lock for full-screen overlays
// (gallery lightbox, nav menu, modals).
//
// The hard part is the layout shift. Locking scroll hides the scrollbar;
// on desktop that frees its width and the page jumps right. The usual
// `scrollbar-gutter: stable` "fix" is static — it can't tell a scrollbar
// that takes layout space (desktop / custom `::-webkit-scrollbar`) from an
// overlay one that doesn't (mobile), so it over-reserves on mobile and
// causes a shift *there* instead.
//
// So we don't guess: we measure how much width hiding the scrollbar
// actually frees, then pad <html> by exactly that. Mobile → 0px freed →
// no padding → no shift. Desktop → real scrollbar width → matching pad →
// no shift. No device detection.

let lockCount = 0;
let saved = null;

export function lockScroll() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount > 1) return; // already locked by another overlay

  const root = document.documentElement;
  const body = document.body;

  saved = {
    rootOverflow: root.style.overflow,
    bodyOverflow: body.style.overflow,
    rootPaddingRight: root.style.paddingRight,
  };

  const widthBefore = root.clientWidth;
  root.style.overflow = "hidden";
  body.style.overflow = "hidden";
  const freed = root.clientWidth - widthBefore; // forces one reflow; that's fine

  if (freed > 0) {
    root.style.paddingRight = `${freed}px`;
  }
}

export function unlockScroll() {
  if (typeof document === "undefined" || lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return; // still held by another overlay

  const root = document.documentElement;
  root.style.overflow = saved.rootOverflow;
  document.body.style.overflow = saved.bodyOverflow;
  root.style.paddingRight = saved.rootPaddingRight;
  saved = null;
}
