// Exam/Instructor/LoginSignup/Login.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await shubukan_api.post("/instructor/login", { email });
      alert(res.data.message);

      localStorage.setItem("instructor_email", email);
      localStorage.setItem("otp_type", "login");
      router.push("/online-exam/instructor/verify");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-center items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Enter Log In Details
      </label>
      <form
        // onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[125px] shadow-md border !rounded-[40px]"
      >
        <label
          htmlFor="email"
          className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2"
        >
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email id"
          className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
        />

        <ExamBtn
          text={loading ? "Sending OTP..." : "Log in"}
          type="submit"
          size="min-w-[150px] w-fit h-auto"
          className="self-end"
          onClick={handleSubmit}
        />
      </form>

      <Loader loading={loading} />
    </div>
  );
}
