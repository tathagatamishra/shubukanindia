"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuardianAuth } from "./Context/GuardianAuthContext";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function AuthGate({ children }) {
  const { guardian, loading } = useGuardianAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !guardian) {
      router.push("/guardian-evaluation/login");
    }
  }, [loading, guardian, router]);

  if (loading || !guardian) return <Loader loading />;
  return children;
}
