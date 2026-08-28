"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { shubukan_api } from "@/config";

const LOGIN_PATH = "/guardian-evaluation/admin/login";

// Gates every /guardian-evaluation/admin route. A missing token redirects
// immediately; a present-but-invalid/expired one is caught by actually
// validating against the backend (same /admin/validate endpoint & adminToken
// used by the main /admin panel) rather than trusting mere presence, so an
// unauthorized session never leaves the panel visible even for a flash.
export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState("checking");

  useEffect(() => {
    if (pathname === LOGIN_PATH) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace(LOGIN_PATH);
      return;
    }

    setAuthState("checking");
    shubukan_api
      .post("/admin/validate", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setAuthState("authenticated"))
      .catch(() => {
        // Missing/invalid/expired token, or the admin account no longer
        // exists - never leave the panel accessible in that state.
        localStorage.removeItem("adminToken");
        router.replace(LOGIN_PATH);
      });
  }, [pathname, router]);

  if (pathname === LOGIN_PATH) return <>{children}</>;

  if (authState !== "authenticated") return null;

  return <>{children}</>;
}
