// Exam/UI/ExamNav.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import "./ExamNav.css";

export default function ExamNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [studentToken, setStudentToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("student_token");
    setStudentToken(t);
  }, [router]);

  const handleBack = () => {
    // If on public exam list -> go to /online-exam and stop further checks
    if (pathname && pathname.includes("/online-exam/public") && !studentToken) {
      
      return router.push("/online-exam");
    }

    if (pathname && pathname.includes("/online-exam/public") && studentToken) {
      return router.push("/online-exam/student");
    }

    if (pathname && pathname === "/online-exam") {
      return router.push("/");
    }

    // Special case -> always go to /online-exam/student
    if (pathname === "/online-exam/student/results") {
      return router.push("/online-exam/student");
    }

    // Otherwise go back if possible, else fallback to /online-exam
    if (typeof window !== "undefined" && window.history.length > 1) {
      return router.back();
    }

    return router.push("/online-exam");
  };

  return (
    <nav className="NavHolder z-[50] fixed top-0 w-full p-[20px] pb-0">
      <div className="ExamNav corner-shape relative w-full h-[60px] p-[10px] flex flex-row items-center justify-between shadow-md">
        <button
          className="absolute flex items-center gap-[2px] sm:gap-[4px] font-[600] text-[12px] sm:text-[14px] text-[#64748B]"
          onClick={handleBack}
        >
          <FiChevronLeft className="text-[16px] sm:text-[18px]" />
          Go Back
        </button>
        <p></p>
        <p className="title text-[#3C3A36] text-[16px] sm:text-[18px] font-[700]">
          Shubukan India Exam Portal
        </p>
        <p className="hidden sm:block"></p>
      </div>
    </nav>
  );
}
