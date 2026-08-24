"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function GefNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { guardian, logout } = useGuardianAuth();
  const [adminToken, setAdminToken] = useState(null);
  const [instructorToken, setInstructorToken] = useState(null);

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
        </div>

        <div className="gef-nav-bar-links">
          {isAdminSection ? (
            !isAdminLoginPage && adminToken ? (
              <button
                type="button"
                className="gef-nav-link gef-nav-link--danger"
                onClick={handleAdminLogout}
              >
                <FiLogOut size={14} /> Log Out
              </button>
            ) : null
          ) : isInstructorSection ? (
            !isInstructorLoginPage && instructorToken ? (
              <button
                type="button"
                className="gef-nav-link gef-nav-link--danger"
                onClick={handleInstructorLogout}
              >
                <FiLogOut size={14} /> Log Out
              </button>
            ) : null
          ) : guardian ? (
            <>
              {/* {firstName ? (
                <span className="gef-nav-greeting">Hi, {firstName}</span>
              ) : null} */}
              {/* <a
                href="/guardian-evaluation"
                className={`gef-nav-link ${pathname === "/guardian-evaluation" ? "active" : ""}`}
              >
                Dashboard
              </a>
              <a
                href="/guardian-evaluation/submissions"
                className={`gef-nav-link ${pathname === "/guardian-evaluation/submissions" ? "active" : ""}`}
              >
                Submissions
              </a> */}
              {/* <button
                type="button"
                className="gef-nav-link gef-nav-link--danger"
                onClick={logout}
              >
                <FiLogOut size={14} /> Log Out
              </button> */}
            </>
          ) : (
            <>
              <a
                href="/guardian-evaluation/login"
                className={`gef-nav-link ${pathname === "/guardian-evaluation/login" ? "active" : ""}`}
              >
                Log In
              </a>
              <a
                href="/guardian-evaluation/signup"
                className={`gef-nav-link ${pathname === "/guardian-evaluation/signup" ? "active" : ""}`}
              >
                Sign Up
              </a>
            </>
          )}
          {/* <span className="gef-nav-divider-v" aria-hidden="true" /> */}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
