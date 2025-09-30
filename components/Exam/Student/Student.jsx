// Exam/Student/Student.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";

export default function Student() {
  const router = useRouter();
  const [examDetails, setExamDetails] = useState({
    examid: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Exam details:", examDetails);

    // TODO: Call backend to verify exam ID & password
    router.push("/online-exam/<examid>");
  };

  const menuItems = [
    { text: "Demo Exam", action: () => router.push("/online-exam/<examid>") },
    { text: "View Results", action: () => router.push("/online-exam/results") },
    { text: "Edit Profile", action: () => router.push("/online-exam/profile") },
    { text: "Log Out", fontstyle: "text-[#B23A48] font-[600] text-[14px] sm:text-[16px]", action: () => router.push("/online-exam") },
  ];

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-between items-center">
      {/* Exam Form */}
      <div className="w-full">
        <label
          htmlFor="exam"
          className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]"
        >
          Enter Exam Details
        </label>

        <form
          onSubmit={handleSubmit}
          className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
        >
          {/* Exam ID */}
          <label
            htmlFor="examid"
            className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2"
          >
            Exam ID
          </label>
          <input
            required
            type="text"
            name="examid"
            id="examid"
            value={examDetails.examid}
            onChange={handleChange}
            placeholder="Enter your exam id"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          {/* Exam Password */}
          <label
            htmlFor="password"
            className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2"
          >
            Exam Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="password"
            value={examDetails.password}
            onChange={handleChange}
            placeholder="Enter your exam password"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          <ExamBtn text="Start Exam" type="submit" className="self-end" />
        </form>
      </div>

      {/* Student Actions */}
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
