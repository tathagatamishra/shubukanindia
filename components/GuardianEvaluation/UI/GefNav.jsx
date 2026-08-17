"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiHome, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function GefNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { guardian, logout } = useGuardianAuth();
  const [adminToken, setAdminToken] = useState(null);

  const isAdminSection = pathname?.startsWith("/guardian-evaluation/admin");
  const isAdminLoginPage = pathname === "/guardian-evaluation/admin/login";

  useEffect(() => {
    if (isAdminSection) {
      setAdminToken(localStorage.getItem("adminToken"));
    }
  }, [isAdminSection, pathname]);

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

  return (
    <div className="gef-nav-bar">
      <div className="gef-nav-bar-links" style={{ alignItems: "center", gap: 6 }}>
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
          onClick={() => router.back()}
          aria-label="Back"
          title="Back"
          className="gef-nav-icon-btn"
        >
          <FiChevronLeft size={17} />
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
      <div className="gef-nav-bar-links" style={{ alignItems: "center" }}>
        {isAdminSection ? (
          !isAdminLoginPage && adminToken ? (
            <button onClick={handleAdminLogout}>Log Out</button>
          ) : null
        ) : guardian ? (
          <>
            <a href="/guardian-evaluation">Dashboard</a>
            <a href="/guardian-evaluation/submissions">Submissions</a>
            <button onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <a href="/guardian-evaluation/login">Log In</a>
            <a href="/guardian-evaluation/signup">Sign Up</a>
          </>
        )}
        <LanguageSwitcher />
      </div>
    </div>
  );
}
