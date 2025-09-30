"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";

export default function Signup() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/online-exam/student/verify");
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-start items-center">
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
          htmlFor="kyu"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Present Kyu
        </label>
        <input
          type="kyu"
          name="kyu"
          id="kyu"
          onChange={() => {}}
          placeholder="Select your present kyu"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <label
          htmlFor="certificate"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Last Certificate No.
        </label>
        <input
          type="certificate"
          name="certificate"
          id="certificate"
          onChange={() => {}}
          placeholder="Enter your certificate no"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
        />

        <label
          htmlFor="sensei"
          className="font-[600] text-[12px] sm:text-[16px] text-[#334155]"
        >
          Sensei Name
        </label>
        <input
          type="sensei"
          name="sensei"
          id="sensei"
          onChange={() => {}}
          placeholder="Select your Sensei’s full name"
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
          placeholder="Enter your or parent's email id"
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
          placeholder="Enter your or parent’s phone no."
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[18px]"
        />

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
