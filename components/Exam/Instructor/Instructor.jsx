// Exam/Instructor/Instructor.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../UI/ExamBtn";
import { shubukan_api } from "@/config";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function Instructor() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [name, setName] = useState("");
  const [TokenLoading, setTokenLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    setToken(t);
    setTokenLoading(false);

    if (!t) {
      router.push("/online-exam");
    }
  }, [router]);

  if (TokenLoading) return null;

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await shubukan_api.get("/instructor/result/search", {
        params: { name },
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      console.log("Search results:", res.data);
      router.push(
        `/online-exam/instructor/result?student=${encodeURIComponent(name)}`
      );
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || "Search failed");
    }
  };

  // Instructor menu actions
  const menuItems = [
    {
      text: "Upcoming Exam",
      action: () => {
        router.push("/online-exam/instructor/upcoming");
        setLoading(true);
      },
    },
    {
      text: "View All Students",
      // disabled: true,
      action: () => {
        router.push("/online-exam/instructor/students");
        setLoading(true);
      },
    },
    // {
    //   text: "All Student Results",
    //   // disabled: true,
    //   action: () => router.push("/online-exam/instructor/results"),
    // },
    {
      text: "Question Papers",
      // disabled: true,
      action: () => {
        router.push("/online-exam/instructor/papers");
        setLoading(true);
      },
    },
    {
      text: "Edit Profile",
      action: () => {
        router.push("/online-exam/instructor/profile");
        setLoading(true);
      },
    },
    {
      text: "Log Out",
      fontstyle: "text-[#B23A48] font-[600] text-[14px] sm:text-[16px]",
      action: () => {
        setLoading(true);
        localStorage.removeItem("instructor_token"); // clear token
        router.push("/online-exam");
      },
    },
  ];

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-between items-center">
      {/* Search Student */}
      <div className="w-full Disabled">
        <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
          Search Student by Name
        </label>

        <form
          onSubmit={handleSubmit}
          className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
        >
          <label className="font-[600] text-[14px] sm:text-[16px] text-[#334155] mb-2">
            Student Name
          </label>
          <input
            required
            type="text"
            name="name"
            id="name"
            value={name}
            disabled={true}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          <ExamBtn
            disabled={true}
            text="View Result"
            type="submit"
            className="self-end"
          />
        </form>
      </div>

      {/* Instructor Actions */}
      <div className="flex flex-col self-start gap-[16px]">
        {menuItems.map((btn, index) => (
          <ExamBtn
            key={index}
            text={btn.text}
            type="button"
            size="w-full"
            disabled={btn.disabled}
            fontstyle={btn.fontstyle}
            onClick={btn.action}
          />
        ))}
      </div>

      <Loader loading={loading} />
    </div>
  );
}
