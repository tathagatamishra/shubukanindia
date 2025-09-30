// Exam/Instructor/Instructor.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";

export default function Instructor() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching student:", name);

    // TODO: API call to fetch student result
    router.push(
      `/online-exam/instructor/result?student=${encodeURIComponent(name)}`
    );
  };

  // Instructor menu actions
  const menuItems = [
    {
      text: "Upcoming Exam",
      action: () => router.push("/online-exam/instructor/upcoming"),
    },
    {
      text: "View All Students",
      action: () => router.push("/online-exam/instructor/students"),
    },
    {
      text: "All Student Results",
      action: () => router.push("/online-exam/instructor/results"),
    },
    {
      text: "Question Papers",
      action: () => router.push("/online-exam/instructor/papers"),
    },
    {
      text: "Edit Profile",
      action: () => router.push("/online-exam/instructor/profile"),
    },
    { text: "Log Out", fontstyle: "text-[#B23A48] font-[600] text-[14px] sm:text-[16px]", action: () => router.push("/online-exam") },
  ];

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-between items-center">
      {/* Search Student */}
      <div className="w-full">
        <label
          htmlFor="name"
          className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]"
        >
          Search Student by Name
        </label>

        <form
          onSubmit={handleSubmit}
          className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
        >
          <label
            htmlFor="name"
            className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2"
          >
            Student Name
          </label>
          <input
            required
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          <ExamBtn text="View Result" type="submit" className="self-end" />
        </form>
      </div>

      {/* Instructor Actions */}
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
