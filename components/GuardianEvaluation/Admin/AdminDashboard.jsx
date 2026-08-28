"use client";
import React, { useState } from "react";
import AdminWindowManager from "@/components/GuardianEvaluation/Admin/AdminWindowManager";
import AdminSubmissions from "@/components/GuardianEvaluation/Admin/AdminSubmissions";

// Auth (unauthenticated + unauthorized) is gated one level up by
// app/guardian-evaluation/admin/layout.js - this never mounts otherwise.
export default function AdminDashboard() {
  const [tab, setTab] = useState("windows");

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
