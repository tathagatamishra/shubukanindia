"use client";
import React from "react";
import { useParams } from "next/navigation";
import AuthGate from "@/components/GuardianEvaluation/AuthGate";
import FormWizard from "@/components/GuardianEvaluation/Form/FormWizard";

export default function Page() {
  const { learnerId, windowId } = useParams();
  return (
    <AuthGate>
      <FormWizard learnerId={learnerId} windowId={windowId} />
    </AuthGate>
  );
}
