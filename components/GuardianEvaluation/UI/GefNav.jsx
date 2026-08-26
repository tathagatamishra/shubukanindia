"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import Slider from "@mui/material/Slider";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { useFormFontSize, MIN_FONT_SIZE, MAX_FONT_SIZE } from "../Context/FormFontSizeContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function GefNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { guardian, logout } = useGuardianAuth();
  const { fontSize, setFontSize } = useFormFontSize();
  const [adminToken, setAdminToken] = useState(null);
  const [instructorToken, setInstructorToken] = useState(null);
  const [isSliderStuck, setIsSliderStuck] = useState(false);
  const sliderSentinelRef = useRef(null);

  const isFormRoute = pathname?.startsWith("/guardian-evaluation/form/");
  const isAdminSection = pathname?.startsWith("/guardian-evaluation/admin");
  const isAdminLoginPage = pathname === "/guardian-evaluation/admin/login";
  const isInstructorSection = pathname?.startsWith(
    "/guardian-evaluation/instructor",
  );
  const isInstructorLoginPage =
    pathname === "/guardian-evaluation/instructor/login";

  useEffect(() => {
    if (isAdminSection) {
      setAdminToken(localStorage.getItem("adminToken"));
    }
    if (isInstructorSection) {
      setInstructorToken(localStorage.getItem("instructor_token"));
    }
  }, [isAdminSection, isInstructorSection, pathname]);

  // On the evaluation form, the font-size slider lives inside gef-nav-bar by
  // default. A zero-height sentinel sits right before it in normal flow; once
  // scrolling carries the sentinel to the very top of the viewport, we mark
  // the slider "stuck" and gef-theme.css switches it to `position: fixed`, so
  // it stays reachable through the rest of the (long) form instead of being
  // dragged away with the short nav-bar card it lives in. Scrolling back up
  // past the sentinel's position — i.e. once gef-nav-bar is visible again —
  // clears "stuck" and it drops back into the flow.
  useEffect(() => {
    if (!isFormRoute) return;

    const handleScroll = () => {
      if (!sliderSentinelRef.current) return;
      const sentinelTop = sliderSentinelRef.current.getBoundingClientRect().top;
      setIsSliderStuck(sentinelTop <= 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFormRoute]);

  const goForward = () => {
    if (typeof router.forward === "function") {
      router.forward();
    } else if (typeof window !== "undefined") {
      window.history.forward();
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    router.push("/guardian-evaluation/admin/login");
  };

  const handleInstructorLogout = () => {
    localStorage.removeItem("instructor_token");
    setInstructorToken(null);
    router.push("/guardian-evaluation/instructor/login");
  };

  const sectionLabel = isAdminSection
    ? "Admin"
    : isInstructorSection
      ? "Instructor"
      : "Guardian Evaluation";

  const firstName = guardian?.name ? guardian.name.split(" ")[0] : null;

  return (
    <div className="gef-nav-bar">
      <div className="gef-nav-brand">{sectionLabel}</div>
      <div className="gef-nav-row">
        <div className="gef-nav-bar-links">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            title="Back"
            className="gef-nav-icon-btn"
          >
            <FiChevronLeft size={17} />
          </button>{" "}
          <button
            type="button"
            onClick={() => router.push("/guardian-evaluation")}
            aria-label="Home"
            title="Home"
            className="gef-nav-icon-btn"
          >
            <FiHome size={17} />
          </button>
          <button
            type="button"
            onClick={goForward}
            aria-label="Forward"
            title="Forward"
            className="gef-nav-icon-btn"
          >
            <FiChevronRight size={17} />
          </button>
          {isAdminSection ? (
            !isAdminLoginPage && adminToken ? (
              <button
                type="button"
                className="gef-nav-icon-btn gef-nav-link--danger"
                onClick={handleAdminLogout}
              >
                <FiLogOut size={14} />
              </button>
            ) : null
          ) : isInstructorSection ? (
            !isInstructorLoginPage && instructorToken ? (
              <button
                type="button"
                className="gef-nav-icon-btn gef-nav-link--danger"
                onClick={handleInstructorLogout}
              >
                <FiLogOut size={14} />
              </button>
            ) : null
          ) : guardian ? (
            <button
              type="button"
              className="gef-nav-icon-btn gef-nav-link--danger"
              onClick={logout}
            >
              <FiLogOut size={14} />
            </button>
          ) : null}
        </div>

        <div className="gef-nav-bar-links">
          <LanguageSwitcher />
          {/* <span className="gef-nav-divider-v" aria-hidden="true" /> */}
        </div>

        {isFormRoute ? (
          // Only ever shown under 640px (see .gef-form-font-slider-wrap in
          // gef-theme.css) — on the long evaluation form, small mobile text
          // is hardest to read, so this only needs to exist there.
          <>
          <div ref={sliderSentinelRef} aria-hidden="true" style={{ height: 0 }} />
          <div className={`gef-form-font-slider-wrap ${isSliderStuck ? "gef-form-font-slider-wrap--stuck" : ""}`}>
            <span className="gef-form-font-slider-label" aria-hidden="true">
              A
            </span>
            <Slider
              value={fontSize}
              onChange={(_, value) => setFontSize(value)}
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
              step={1}
              aria-label="Form text size"
              size="small"
              sx={{
                color: "var(--gef-vermillion)",
                padding: 0,
                flex: 1,
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                  backgroundColor: "var(--gef-vermillion)",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 8px rgba(166, 27, 27, 0.16)",
                  },
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "var(--gef-line)",
                  opacity: 1,
                },
              }}
            />
            <span className="gef-form-font-slider-label gef-form-font-slider-label--lg" aria-hidden="true">
              A
            </span>
          </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
