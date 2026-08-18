"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminWindowManager from "@/components/GuardianEvaluation/Admin/AdminWindowManager";
import AdminSubmissions from "@/components/GuardianEvaluation/Admin/AdminSubmissions";
import Button from "@/components/GuardianEvaluation/UI/Button";

export default function Page() {
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
      <div className="gef-col" style={{ marginBottom: 18 }}>
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
