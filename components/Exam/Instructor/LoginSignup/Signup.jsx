// Exam/Instructor/LoginSignup/Signup.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    instructorId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await shubukan_api.post("/instructor/signup", formData);
      alert(res.data.message);

      localStorage.setItem("instructor_email", formData.email);
      localStorage.setItem("otp_type", "signup");
      router.push("/online-exam/instructor/verify");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-start items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Enter Sign up Details
      </label>
      <form
        // onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] shadow-md border !rounded-[40px]"
      >
        {[
          {
            label: "Name",
            placeholder: "Enter your full name",
            name: "name",
            type: "text",
            required: true,
          },
          {
            label: "Email",
            placeholder: "Enter your email id",
            name: "email",
            type: "email",
            required: true,
          },
          {
            label: "Mobile",
            placeholder: "Enter your phone no.",
            name: "mobile",
            type: "text",
            required: true,
          },
          {
            label: "Instructor ID No.",
            placeholder: "Enter your instructor id no.",
            name: "instructorId",
            type: "text",
            required: true,
          },
        ].map((field, idx) => (
          <div key={idx} className="w-full h-fit flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              {field.label}
            </label>
            <input
              required={field.required}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
            />
          </div>
        ))}

        <p className="text-[12px] sm:text-[14px] text-[#64748B] mb-[12px]">
          ** <br />
          Instructor ID number provided by your organization, if you don't have
          instructor ID, Please contact to your organization !
        </p>

        <ExamBtn
          text={loading ? "Registering..." : "Sign up"}
          type="submit"
          className="self-end"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
