// Exam/Student/LoginSignup/Verify.jsx
"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";

export default function Verify() {
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const email =
    typeof window !== "undefined" ? localStorage.getItem("student_email") : "";
  const otpType =
    typeof window !== "undefined" ? localStorage.getItem("otp_type") : "";

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto-focus next box
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^[0-9]+$/.test(pasted)) return;

    const pastedArray = pasted.split("").slice(0, otp.length);
    const newOtp = [...otp];

    pastedArray.forEach((char, i) => {
      newOtp[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });

    setOtp(newOtp);

    // focus last filled input
    const lastIndex = pastedArray.length - 1;
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    try {
      const res = await shubukan_api.post("/student/verify-otp", {
        email,
        otp: enteredOtp,
      });
      alert(res.data.message);

      localStorage.setItem("student_token", res.data.token);
      router.push("/online-exam/student");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await shubukan_api.post("/student/resend-otp", { email, type: otpType });
      alert("OTP resent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="ExamChild !w-full !max-w-[540px] h-full flex flex-col justify-center items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Enter OTP To Verify
      </label>

      <form
        // onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[125px] shadow-md border !rounded-[40px]"
      >
        <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
          OTP
        </label>

        <div className="w-full flex justify-around gap-[2px] mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              placeholder="0"
              className="corner-shape border font-[600] text-[16px] text-center max-w-[45px] w-full sm:w-[55px] py-[8px] sm:py-[10px] mb-2"
            />
          ))}
        </div>

        <p className="text-[14px] sm:text-[14px] text-[#64748B] mb-4">
          ** <br />
          We sent an OTP to <span className="font-semibold">{email}</span>.
          Check your email to get the code.
        </p>

        <div className="w-full flex justify-between gap-[16px]">
          <ExamBtn text="Resend OTP" size="w-full" onClick={handleResend} />
          <ExamBtn
            text="Submit"
            size="w-full"
            type="submit"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
