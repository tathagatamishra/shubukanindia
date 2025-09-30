"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";

export default function Signup() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState("");

  return (
    // <div className="OnlineExam corner-shape w-full flex flex-col justify-center items-center gap-4 p-[20px] border !rounded-[40px] shadow-md">
    <div className="w-full flex flex-col justify-center items-center gap-4">
      {/* <form className="corner-shape w-full h-fit flex flex-col justify-s items-start p-[16px] pb-[32px] border border-[#88807E] !rounded-[40px] bg-[#fff] shadow-md"> */}
      <form className="OnlineExam corner-shape w-full h-fit p-[16px] pb-[32px] shadow-md flex flex-col justify-center items-center gap-4 border !rounded-[40px]">
        <label
          htmlFor="email"
          className="font-[600] text-[14px] sm:text-[16px] text-[#334155]"
        >
          Email
        </label>
        <input
          required
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your or parent's email id"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px]"
        />
      </form>
      
      <ExamBtn
        text="Sign up"
        onClick={() => navigate("/online-exam/student/verify")}
      />
    </div>
  );
}
