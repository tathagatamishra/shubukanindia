"use client";
import React, { useState } from "react";
import AdminWindowManager from "@/components/GuardianEvaluation/Admin/AdminWindowManager";
import AdminSubmissions from "@/components/GuardianEvaluation/Admin/AdminSubmissions";
import Button from "@/components/GuardianEvaluation/UI/Button";

export default function Page() {
  const [tab, setTab] = useState("windows");
  return (
    <div className="gef-container">
      <div className="gef-row" style={{ marginBottom: 18 }}>
        <Button variant={tab === "windows" ? "primary" : "outline"} onClick={() => setTab("windows")}>
          Evaluation Windows
        </Button>
        <Button variant={tab === "submissions" ? "primary" : "outline"} onClick={() => setTab("submissions")}>
          Submitted Forms
        </Button>
      </div>
      {tab === "windows" ? <AdminWindowManager /> : <AdminSubmissions />}
    </div>
  );
}
