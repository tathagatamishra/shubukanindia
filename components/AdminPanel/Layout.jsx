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

  const [isLoginPage, setIsLoginPage] = useState(false);
  const [open, setOpen] = useState(false);

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
      localStorage.removeItem("adminToken"); // always clear token
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
      setOpen(false);
    }
  }, [pathname, router]);

  // Don’t render layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />
      {open && (
        <div
          className="fixed backdrop-blur-[10px] w-screen h-screen"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        {
          <div className="flex items-center justify-between bg-white shadow-md p-4">
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
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
