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

  return (
    <div className="OnlineExam corner-shape w-full flex flex-col justify-center items-center gap-4 p-[20px] border !rounded-[40px] shadow-md">
      <div className="corner-shape w-full h-[200px] flex flex-col justify-center items-center gap-4 border !rounded-[40px] shadow-md"></div>

      <ExamBtn
        text="Sign up"
        onClick={() => navigate("/online-exam/instructor/verify")}
      />
    </div>
  );
}
