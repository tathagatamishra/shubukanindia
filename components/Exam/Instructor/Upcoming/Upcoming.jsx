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
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">KYU: {e.kyu ?? "-"}</div>
                  <div className="text-sm">
                    ExamID: {e.examID} - Set {e.examSet}
                  </div>
                  <div className="text-sm">Access: {e.accessability}</div>
                </div>
                <div className="text-sm text-right">
                  <div>
                    {e.examDate
                      ? new Date(e.examDate).toLocaleString()
                      : "On-demand (public)"}
                  </div>
                  <div>Total Qs: {e.totalQuestionCount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
