"use client";
import React from "react";
import { useGuardianAuth } from "@/components/GuardianEvaluation/Context/GuardianAuthContext";
import Dashboard from "@/components/GuardianEvaluation/Dashboard";
import Landing from "@/components/GuardianEvaluation/Landing";

export default function Page() {
  const { guardian, loading } = useGuardianAuth();

  if (loading) return <p className="gef-hint gef-container">Loading...</p>;
  return guardian ? <Dashboard /> : <Landing />;
}
