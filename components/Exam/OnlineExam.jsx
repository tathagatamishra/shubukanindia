// Exam/OnlineExam.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./OnlineExam.css";
import ExamBtn from "./UI/ExamBtn";

export default function OnlineExam() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const [userType, setUserType] = useState(null);

  return (
    <div className="ExamChild OnlineExam corner-shape w-full h-[calc(100%-120px)] flex flex-col justify-center items-center gap-4 p-[20px] border !rounded-[40px] shadow-md">
      <ExamBtn text="Student" onClick={() => navigate("/online-exam/student/login-signup")} />

      <p className="font-[600] text-[26px] text-[#64748B]">OR</p>

      <ExamBtn text="Instructor" onClick={() => navigate("/online-exam/instructor/login-signup")} />
    </div>
  );
}
