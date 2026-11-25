// Exam/Student/Student.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";

export default function Student() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [examID, setExamID] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("student_token");
    setToken(t);
    setLoading(false);

    if (!t) {
      router.push("/online-exam");
    }
  }, [router]);

  const handleStart = (event) => {
    event.preventDefault();
    if (!token || loading) return;
    const code = examID.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) return alert("Enter the six-character exam ID.");
    setLoading(true);
    localStorage.removeItem("exam_password");
    router.push(`/online-exam/${code}`);
  };

  const menuItems = [
    { text: "Available Exams", action: () => router.push("/online-exam/student/open-exams") },
    {
      text: "Demo Exam",
      action: () => router.push("/online-exam/public"),
    },
    {
      text: "View Results",
      action: () => router.push("/online-exam/student/results"),
    },
    {
      text: "Edit Profile",
      action: () => router.push("/online-exam/student/profile"),
    },
    {
      text: "Log Out",
      fontstyle: "text-[#B23A48] font-[600] text-[14px] sm:text-[16px]",
      action: () => {
        localStorage.removeItem("student_token");
        localStorage.removeItem("exam_password");
        router.push("/online-exam");
      },
    },
  ];

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-between items-center">
      <div className="w-full">
        <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
          Enter Exam Details
        </label>

        <form
          onSubmit={handleStart}
          className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
        >
          <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
            Exam ID
          </label>
          <input
            type="text"
            placeholder="Enter your exam id"
            value={examID}
            required
            onChange={(e) => {
              const val = e.target.value;
              if (isComposing) {
                // while IME is composing, keep raw value
                setExamID(val);
              } else {
                // once not composing, enforce uppercase
                setExamID(val.toUpperCase());
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              // apply uppercase to final composed value
              setExamID(e.currentTarget.value.toUpperCase());
            }}
            // helpful mobile attributes:
            autoCapitalize="characters"
            spellCheck={false}
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />
          <p className="text-[14px] sm:text-[14px] text-[#64748B] mb-[12px]">
            ** Contact your Sensei to get Exam ID
          </p>

          <ExamBtn
            disabled={loading}
            text={loading ? "Checking..." : "Start Exam"}
            type="submit"
            className="self-end"
          />
        </form>
      </div>

      <div className="flex flex-col self-start gap-[16px]">
        {menuItems.map((btn, index) => (
          <ExamBtn
            key={index}
            text={btn.text}
            type="button"
            size="w-full"
            fontstyle={btn.fontstyle}
            onClick={btn.action}
          />
        ))}
      </div>
    </div>
  );
}
