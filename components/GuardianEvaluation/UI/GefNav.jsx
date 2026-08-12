"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function GefNav() {
  const router = useRouter();
  const { guardian, logout } = useGuardianAuth();

  return (
    <div className="gef-nav-bar">
      <a href="/guardian-evaluation" style={{ fontFamily: "var(--gef-font-heading)", fontWeight: 700, fontSize: 18, color: "var(--gef-ink)" }}>
        紹 Guardian Evaluation
      </a>
      <div className="gef-nav-bar-links" style={{ alignItems: "center" }}>
        {guardian ? (
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
