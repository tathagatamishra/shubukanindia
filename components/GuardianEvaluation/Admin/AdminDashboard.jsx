"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminWindowManager from "@/components/GuardianEvaluation/Admin/AdminWindowManager";
import AdminSubmissions from "@/components/GuardianEvaluation/Admin/AdminSubmissions";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("windows");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) {
      router.replace("/guardian-evaluation/admin/login");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) return null;

  return (
    <div className="gef-container">
      <h1 className="gef-title">GEF Admin Panel</h1>
      <p className="gef-subtitle">
        Open evaluation windows to invite guardians to submit the form, and review everything that's been
        submitted so far.
      </p>
      <div className="gef-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "windows"}
          className={`gef-tab ${tab === "windows" ? "active" : ""}`}
          onClick={() => setTab("windows")}
        >
          Evaluation Windows
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "submissions"}
          className={`gef-tab ${tab === "submissions" ? "active" : ""}`}
          onClick={() => setTab("submissions")}
        >
          Submitted Forms
        </button>
      </div>
      <div className="gef-tab-panel" role="tabpanel">
        {tab === "windows" ? <AdminWindowManager /> : <AdminSubmissions />}
      </div>
    </div>
  );
}
