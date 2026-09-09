"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Collage.scss";

// Click-to-open gallery collage. The lightbox image is FLIP-animated with
// the Web Animations API: on open it starts inverted (translated + scaled)
// to sit exactly over the thumbnail that was clicked, then animates to its
// full centered size — so it visibly grows from that spot toward the
// viewer instead of just fading/popping in centered. Closing plays the
// same transform in reverse before unmounting. No animation library
// needed — this is the same "FLIP" idea the linked GSAP thread uses, done
// with native getBoundingClientRect() + Element.animate().
export default function Collage({ photos }) {
  const columns = [
    photos.slice(0, 3), // column 1: p1, p2, p3
    photos.slice(3, 5), // column 2: p4, p5
    photos.slice(5, 7), // column 3: p6, p7
  ];

  const [active, setActive] = useState(null); // { src, alt } | null
  const [closing, setClosing] = useState(false);
  const originRectRef = useRef(null);
  const overlayImgRef = useRef(null);
  const animRef = useRef(null);

  const flipDelta = (imgEl) => {
    const origin = originRectRef.current;
    const final = imgEl.getBoundingClientRect();
    const dx = origin.left + origin.width / 2 - (final.left + final.width / 2);
    const dy = origin.top + origin.height / 2 - (final.top + final.height / 2);
    const sx = origin.width / final.width;
    const sy = origin.height / final.height;
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
  };

  const openPhoto = useCallback((photo, e) => {
    originRectRef.current = e.currentTarget.getBoundingClientRect();
    setClosing(false);
    setActive(photo);
  }, []);

  const closePhoto = useCallback(() => {
    const el = overlayImgRef.current;
    if (!el || !originRectRef.current) {
      setActive(null);
      return;
    }
    if (animRef.current) animRef.current.cancel();
    setClosing(true);
    const anim = el.animate(
      [{ transform: "translate(0, 0) scale(1, 1)" }, { transform: flipDelta(el) }],
      { duration: 420, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
    );
    animRef.current = anim;
    anim.onfinish = () => {
      setActive(null);
      setClosing(false);
    };
  }, []);

  // Play the "grow from thumbnail" entrance the moment the overlay image
  // mounts. Cancelling any prior animation before starting a new one makes
  // this safe even if React Strict Mode runs the effect twice in dev.
  useEffect(() => {
    if (!active) return;
    const el = overlayImgRef.current;
    if (!el || !originRectRef.current) return;
    let cancelled = false;

    // Wait until the full-size image is actually decoded before measuring
    // its box — before that, width/height (via width/height:auto +
    // max-width/max-height) can't be resolved yet, so getBoundingClientRect()
    // would return a bogus/degenerate size and the entrance animation would
    // start from (and stay stuck at) the wrong transform.
    const start = () => {
      if (cancelled) return;
      if (animRef.current) animRef.current.cancel();
      const anim = el.animate(
        [{ transform: flipDelta(el) }, { transform: "translate(0, 0) scale(1, 1)" }],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
      );
      animRef.current = anim;
    };

    if (el.complete && el.naturalWidth > 0) {
      start();
    } else if (el.decode) {
      el.decode().then(start).catch(start);
    } else {
      el.onload = start;
    }

    return () => {
      cancelled = true;
    };
  }, [active]);

  // Esc to close + lock background scroll while the lightbox is up.
  // The page's actual scroll container is <html> here (document.scrollingElement
  // is HTML, not BODY — body itself has overflow:visible), so that's the
  // element that needs locking; body is included too for safety since some
  // browsers/layouts scroll there instead.
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const prevRootOverflow = root.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") closePhoto();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevRootOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, closePhoto]);

  return (
    <>
      <div className="collage">
        {columns.map((col, i) => (
          <div className="collage-col" key={i}>
            {col.map((p) => (
              <div
                className={`collage-photo ${p.cls}`}
                key={p.src}
                onClick={(e) => openPhoto(p, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault(); // stop Space from also scrolling the page
                    openPhoto(p, e);
                  }
                }}
              >
                <img src={p.src} alt="" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {active && (
        <div className={`collage-lightbox ${closing ? "" : "is-open"}`}>
          <div className="collage-lightbox-backdrop" onClick={closePhoto} />
          <button
            type="button"
            className="collage-lightbox-close"
            onClick={closePhoto}
            aria-label="Close"
          >
            ×
          </button>
          <img ref={overlayImgRef} src={active.src} alt="" className="collage-lightbox-img" />
        </div>
      )}
    </>
  );
}
