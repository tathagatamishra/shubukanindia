// Exam/Student/LoginSignup/LoginSignup.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";

export default function LoginSignup() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const [userType, setUserType] = useState(null);

  return (
    <div className="ExamChild OnlineExam corner-shape w-full h-[calc(100%-120px)] flex flex-col justify-center items-center gap-4 p-[20px] border !rounded-[40px] shadow-md">
      <ExamBtn
        text="Log in"
        onClick={() => navigate("/online-exam/student/login")}
      />
      <p className="font-[600] text-[26px] text-[#64748B]">OR</p>
      <ExamBtn
        text="Sign up"
        onClick={() => navigate("/online-exam/student/signup")}
      />
    </div>
  );
}
