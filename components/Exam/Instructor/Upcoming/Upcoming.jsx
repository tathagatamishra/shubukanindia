// components/Exam/Instructor/Upcoming/Upcoming.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Upcoming() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [exams, setExams] = useState([]);
  const [kyu, setKyu] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    setToken(t);
    if (!t) return router.push("/online-exam");
    fetchExams();
  }, []);

  const fetchExams = async (accessability = undefined, kyuFilter = kyu) => {
    try {
      setLoading(true);
      const params = {};
      if (accessability) params.accessability = accessability;
      if (kyuFilter) params.kyu = kyuFilter;
      const res = await shubukan_api.get("/instructor/exams/upcoming", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
        },
      });
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ExamChild w-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Upcoming Exams
      </label>
      {/* <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          onChange={(e) => fetchExams(e.target.value)}
          defaultValue=""
        >
          <option value="">All access</option>
          <option value="public">Public</option>
          <option value="allInstructors">All Instructors</option>
          <option value="instructor">Only My Exams</option>
        </select>

        <input
          type="number"
          placeholder="kyu"
          className="border p-2 rounded w-24"
          value={kyu}
          onChange={(e) => setKyu(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => fetchExams(undefined, kyu)}
        >
          Filter
        </button>
      </div> */}

      {loading ? (
        <p className="text-[14px] text-gray-500">Loading...</p>
      ) : exams.length === 0 ? (
        <p className="text-[14px] text-gray-500">No upcoming exams found.</p>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-[32px]">
          {exams.map((e) => (
            <div
              key={`${e._id}`}
              className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] shadow-md border !rounded-[40px]"
            >
              <div className="w-full flex flex-col">
                <div className="w-full border-b-1 border-dashed flex flex-row items-center">
                  <label className="w-full font-[600] text-[12px] sm:text-[14px] text-[#334155] !m-[0px] p-[8px] pl-[2px] border-r-1 border-dashed">
                    Exam ID
                  </label>
                  <p className="w-full text-center text-[14px] sm:text-[16px] text-[#334155]">
                    {e.examID}
                  </p>
                </div>

                <div className="w-full border-b-1 border-dashed flex flex-row items-center">
                  <label className="w-full font-[600] text-[12px] sm:text-[14px] text-[#334155] !m-[0px] p-[8px] pl-[2px] border-r-1 border-dashed">
                    Exam Password
                  </label>
                  <p className="w-full text-center text-[14px] sm:text-[16px] text-[#334155]">
                    {e.password}
                  </p>
                </div>
              </div>

              <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] p-[8px]">
                <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                  Exam Will Start At
                </label>
                <p className="w-full text-center text-[18px] sm:text-[20px] font-[600] text-[#334155]">
                  {new Date(e.examDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

                <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
                  {new Date(e.examDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="w-full flex flex-col gap-[4px] p-[8px]">
                <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                  Time Remains
                </label>
                <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
                  1 day 24 minutes 60 seconds
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
