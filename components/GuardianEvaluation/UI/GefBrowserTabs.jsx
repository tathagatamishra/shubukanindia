"use client";
import React from "react";
import { usePathname } from "next/navigation";

// Same tab styling as /guardian-evaluation/admin's "Evaluation Windows" /
// "Submitted Forms" toggle (.gef-tabs / .gef-tab), except these navigate
// between real routes instead of swapping local state.
const TABS = [
  { key: "dashboard", href: "/guardian-evaluation", label: "Dashboard" },
  { key: "submissions", href: "/guardian-evaluation/submissions", label: "Submissions" },
];

export default function GefBrowserTabs() {
  const pathname = usePathname();
  const activeKey = pathname === "/guardian-evaluation/submissions" ? "submissions" : "dashboard";

  return (
    <div className="gef-tabs" role="tablist">
      {TABS.map((t) => (
        <a
          key={t.key}
          href={t.href}
          role="tab"
          aria-selected={t.key === activeKey}
          className={`gef-tab ${t.key === activeKey ? "active" : ""}`}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}
