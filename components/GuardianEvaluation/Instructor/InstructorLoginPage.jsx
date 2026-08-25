"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InstructorLogin from "./InstructorLogin";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function InstructorLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("instructor_token")) {
      router.replace("/guardian-evaluation/instructor");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) return <Loader loading />;

  return (
    <InstructorLogin onLoggedIn={() => router.push("/guardian-evaluation/instructor")} />
  );
}
