"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    presentKyu: "",
    lastCertificateNum: "",
    instructorName: "",
    instructorId: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await shubukan_api.post("/student/signup", formData);
      alert(res.data.message);

      localStorage.setItem("student_email", formData.email);
      localStorage.setItem("otp_type", "signup");
      router.push("/online-exam/student/verify");
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
            label: "Present Kyu",
            placeholder: "Select your present kyu",
            name: "presentKyu",
            type: "text",
          },
          {
            label: "Last Certificate No.",
            placeholder: "Enter your certificate no",
            name: "lastCertificateNum",
            type: "text",
          },
          {
            label: "Sensei Name",
            placeholder: "Select your Sensei’s full name",
            name: "instructorName",
            type: "text",
          },
          {
            label: "Email",
            placeholder: "Enter your or parent's email id",
            name: "email",
            type: "email",
            required: true,
          },
          {
            label: "Mobile",
            placeholder: "Enter your or parent’s phone no.",
            name: "mobile",
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
              placeholder={`Enter ${field.label}`}
              className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
            />
          </div>
        ))}

        <ExamBtn
          text={loading ? "Registering..." : "Sign up"}
          type="submit"
          className="self-end mt-[6px]"
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
}
