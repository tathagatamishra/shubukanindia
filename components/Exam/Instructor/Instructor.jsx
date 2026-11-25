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
  const [matches, setMatches] = useState(null);

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
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      const res = await shubukan_api.get("/instructor/student/search", {
        params: { name: name.trim() },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
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
      <div className="w-full">
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
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4"
          />

          <ExamBtn
            disabled={loading}
            text="Search"
            type="submit"
            className="self-end"
          />
        </form>
        {matches && (matches.length ? (
          <ul className="mb-4 flex flex-col gap-2">
            {matches.map((student) => (
              <li key={student._id}>
                <button type="button" className="underline" onClick={() =>
                  router.push(`/online-exam/instructor/results?studentId=${student._id}`)
                }>{student.name}</button>
              </li>
            ))}
          </ul>
        ) : <p>No matching students.</p>)}
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
