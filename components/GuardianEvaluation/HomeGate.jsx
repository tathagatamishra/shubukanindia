"use client";
import React from "react";
import { useGuardianAuth } from "@/components/GuardianEvaluation/Context/GuardianAuthContext";
import Dashboard from "@/components/GuardianEvaluation/Dashboard";
import Landing from "@/components/GuardianEvaluation/Landing";
import Loader from "@/components/GuardianEvaluation/UI/Loader";

export default function HomeGate() {
  const { guardian, loading } = useGuardianAuth();

  if (loading) return <Loader loading />;
  return guardian ? <Dashboard /> : <Landing />;
}
