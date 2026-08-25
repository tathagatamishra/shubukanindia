// components/AdminPanel/Layout.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiLogOut } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { shubukan_api } from "@/config";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  // "checking" until we know the token is actually valid — never render admin
  // content on an unauthenticated/expired session, even for a flash.
  const [authState, setAuthState] = useState("checking");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await shubukan_api.post(
          "/admin/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setAuthState("checking");
    shubukan_api
      .post("/admin/validate", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setAuthState("authenticated"))
      .catch(() => {
        // Token missing/invalid/expired, or the admin account no longer
        // exists — never leave the panel accessible in that state.
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      });
  }, [pathname, router]);

  // Don't render layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authState !== "authenticated") return null;

  return (
    <div className="flex h-screen w-full max-w-full bg-gray-100 text-[#334155] overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />
      {open && (
        <div
          className="z-[40] fixed backdrop-blur-[10px] w-screen h-screen"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        {
          <div className="z-[50] flex items-center justify-between bg-white shadow-md p-4">
            <button
              className="lg:hidden text-xl"
              onClick={() => setOpen(!open)}
            >
              <FiMenu />
            </button>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        }

        {/* Page content */}
        <div className="p-4 pb-[32px] overflow-y-auto overflow-x-hidden min-w-0">{children}</div>
      </div>
    </div>
  );
}
