"use client";
import React from "react";
import { useParams } from "next/navigation";
import AuthGate from "@/components/GuardianEvaluation/AuthGate";
import FullForm from "@/components/GuardianEvaluation/Form/FullForm";

export default function Page() {
  const { learnerId, windowId } = useParams();
  return (
    <AuthGate>
      <FullForm learnerId={learnerId} windowId={windowId} />
    </AuthGate>
  );
}
