"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";

export default function Signup() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/online-exam/instructor/verify");
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-center items-center">
      <label
        htmlFor="signup"
        className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]"
      >
        Enter Sign up Details
      </label>
      <form
        // onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] shadow-md border !rounded-[40px]"
      >
        <label
          htmlFor="name"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Name
        </label>
        <input
          required
          type="name"
          name="name"
          id="name"
          onChange={() => {}}
          placeholder="Enter your full name"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <label
          htmlFor="email"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          id="email"
          onChange={() => {}}
          placeholder="Enter your email id"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <label
          htmlFor="mobile"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Mobile Number
        </label>
        <input
          required
          type="mobile"
          name="mobile"
          id="mobile"
          onChange={() => {}}
          placeholder="Enter your phone no."
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <label
          htmlFor="instructorid"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Instructor ID No.
        </label>
        <input
          required
          type="instructorid"
          name="instructorid"
          id="instructorid"
          onChange={() => {}}
          placeholder="Enter your instructor id no."
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <p className="text-[12px] sm:text-[14px] text-[#64748B] mb-[12px]">
          ** <br />
          Instructor ID number provided by your organization, if you don't have
          instructor ID, Please contact to your organization !
        </p>

        <ExamBtn
          text="Sign up"
          type="submit"
          className="self-end"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
