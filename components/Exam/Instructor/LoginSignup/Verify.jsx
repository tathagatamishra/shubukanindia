"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";

export default function Verify() {
  const router = useRouter();
  const navigate = (page) => {
    router.push(page);
  };

  const [userType, setUserType] = useState(null);

  return (
    <div className="OnlineExam corner-shape w-full flex flex-col justify-center items-center gap-4 p-[20px] border !rounded-[40px] shadow-md">
      <div className="corner-shape w-full h-[200px] flex flex-col justify-center items-center gap-4 border !rounded-[40px] shadow-md"></div>

      <div className="w-full flex justify-center gap-[16px]">
        <ExamBtn
          text="Resend OTP"
          size="w-auto"
          onClick={() => {}}
        />
        <ExamBtn
          text="Submit"
          size="w-auto"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
