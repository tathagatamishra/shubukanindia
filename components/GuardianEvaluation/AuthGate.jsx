"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuardianAuth } from "./Context/GuardianAuthContext";

export default function AuthGate({ children }) {
  const { guardian, loading } = useGuardianAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !guardian) {
      router.push("/guardian-evaluation/login");
    }
  }, [loading, guardian, router]);

  if (loading || !guardian) return <p className="gef-hint gef-container">Loading...</p>;
  return children;
}
