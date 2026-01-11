// components/Exam/OnlineExam.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./OnlineExam.css";
import ExamBtn from "./UI/ExamBtn";
import Loader from "../UIComponent/Loader/Loader";

export default function OnlineExam() {
  const router = useRouter();

  const navigate = (page) => {
    router.push(page);
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-dvh flex flex-col justify-start items-center gap-4">
      <div className="ExamChild OnlineExam corner-shape w-full h-fit flex flex-col justify-center items-center gap-4 p-[20px] pt-[40px] border !rounded-[40px] shadow-md">
        {/* DEMO / PUBLIC (no login) */}
        <ExamBtn
          text="Demo Exam"
          onClick={() => {
            setLoading(true);
            navigate("/online-exam/public");
          }}
          className="mt-2"
        />

        <p className="text-[14px] sm:text-[14px] text-[#64748B] mb-4">
          ** <br /> We have created DEMO exams for you !! <br /> You can try the
          DEMO exam without creating any account !
        </p>
      </div>

      <div className="ExamChild OnlineExam corner-shape w-full h-full flex flex-col justify-center items-center gap-4 p-[20px] py-[40px] border !rounded-[40px] shadow-md">
        <p className="text-[14px] sm:text-[14px] text-[#64748B] mb-2">
          ** <br />
          If you are a Student, click the Student button.
        </p>
        <ExamBtn
          text="Student"
          onClick={() => {
            setLoading(true);
            navigate("/online-exam/student/login-signup");
          }}
        />

        <p className="font-[600] text-[26px] text-[#64748B]">OR</p>

        <ExamBtn
          text="Instructor"
          onClick={() => {
            setLoading(true);
            navigate("/online-exam/instructor/login-signup");
          }}
        />
        <p className="text-[14px] sm:text-[14px] text-[#64748B] mt-2">
          ** <br />
          If you are an Instructor, you can create account as an Instructor and
          Student !!
        </p>
      </div>

      <Loader loading={loading} />
    </div>
  );
}
