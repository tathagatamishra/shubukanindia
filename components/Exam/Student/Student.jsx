// Exam/Student/Student.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";
import { shubukan_api } from "@/config";

export default function Student() {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  const [examID, setExamID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!examID) return alert("Enter Exam ID");
    setLoading(true);
    try {
      const res = await shubukan_api.post(
        "/student/exam/start",
        { examID, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "waiting") {
        // Save password for later requests
        localStorage.setItem("exam_password", password);
        router.push(`/online-exam/${examID}`);
      } else if (res.data.status === "ok") {
        // Save password so ExamPage can fetch again
        localStorage.setItem("exam_password", password);
        router.push(`/online-exam/${examID}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid exam details");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      text: "Demo Exam",
      action: () => router.push("/online-exam/student/open-exams"),
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
          // onSubmit={handleSubmit}
          className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
        >
          <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
            Exam ID
          </label>
          <input
            type="text"
            placeholder="Enter your exam id"
            value={examID}
            onChange={(e) => setExamID(e.target.value)}
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />
          <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
            Exam Password
          </label>
          <input
            type="password"
            placeholder="Enter your exam password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-2"
          />

          <p className="text-[12px] sm:text-[14px] text-[#64748B] mb-2">
            ** <br />
            Contact your Sensei to get Exam ID and Password
          </p>

          <ExamBtn
            onClick={handleStart}
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
