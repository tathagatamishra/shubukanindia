"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft } from "react-icons/fi";
import "./ExamNav.css";

export default function ExamNav() {
  const router = useRouter();

  return (
    <nav className="NavHolder z-[50] fixed top-0 left-0 w-full p-[20px] pb-0">
      <div className="ExamNav corner-shape relative w-full h-[60px] p-[10px] flex flex-row items-center justify-between shadow-md">
        <button
          className="absolute flex items-center gap-[2px] sm:gap-[4px] font-[600] text-[12px] sm:text-[14px] text-[#64748B]"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/"); // fallback to home if no history
            }
          }}
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
