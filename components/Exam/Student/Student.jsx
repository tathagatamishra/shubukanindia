// Exam/Student/Student.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";
import { shubukan_api } from "@/config";

export default function Student() {
  const router = useRouter();
  const [examDetails, setExamDetails] = useState({ examid: "", password: "" });
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  const handleChange = (e) => {
    setExamDetails({ ...examDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await shubukan_api.post(
        "/student/exam/start",
        {
          examID: examDetails.examid,
          examSet: "A", // adjust if multiple sets exist
          password: examDetails.password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Exam started successfully!");
      router.push(`/online-exam/${examDetails.examid}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start exam");
    }
  };

  const menuItems = [
    { text: "Demo Exam", action: () => router.push("/online-exam/student/open-exams") },
    { text: "View Results", action: () => router.push("/online-exam/student/results") },
    { text: "Edit Profile", action: () => router.push("/online-exam/student/profile") },
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
            required
            type="text"
            name="examid"
            value={examDetails.examid}
            onChange={handleChange}
            placeholder="Enter your exam id"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
            Exam Password
          </label>
          <input
            required
            type="password"
            name="password"
            value={examDetails.password}
            onChange={handleChange}
            placeholder="Enter your exam password"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-2"
          />

          <p className="text-[12px] sm:text-[14px] text-[#64748B] mb-2">
            ** <br />
            Contact with your Sensei to get Exam ID and Password
          </p>

          <ExamBtn
            text="Start Exam"
            type="submit"
            className="self-end"
            onClick={handleSubmit}
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
