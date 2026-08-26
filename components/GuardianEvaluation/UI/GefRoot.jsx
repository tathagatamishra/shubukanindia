"use client";
import { usePathname } from "next/navigation";

export default function GefRoot({ children }) {
  const pathname = usePathname();
  const isFormRoute = pathname?.startsWith("/guardian-evaluation/form/");

  return (
    <div
      className={`gef-root ${isFormRoute ? "gef-root--form-page" : ""}`}
      style={{ zIndex: 2 }}
    >
      {children}
    </div>
  );
}
