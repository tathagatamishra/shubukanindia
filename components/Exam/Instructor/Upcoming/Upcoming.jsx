// File: app/online-exam/instructor/upcoming/page.jsx
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
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
      <div className="flex gap-2 mb-4">
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
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : exams.length === 0 ? (
        <div>No upcoming exams found.</div>
      ) : (
        <div className="grid gap-3">
          {exams.map((e) => (
            <div key={`${e._id}`} className="border rounded p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">KYU: {e.kyu ?? "-"}</div>
                  <div className="text-sm">ExamID: {e.examID} - Set {e.examSet}</div>
                  <div className="text-sm">Access: {e.accessability}</div>
                </div>
                <div className="text-sm text-right">
                  <div>{e.examDate ? new Date(e.examDate).toLocaleString() : "On-demand (public)"}</div>
                  <div>Total Qs: {e.totalQuestionCount}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => router.push(`/online-exam/instructor/papers?examID=${e.examID}&examSet=${e.examSet}`)}
                >
                  View Paper
                </button>
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => router.push(`/online-exam/instructor/results?examId=${e._id}`)}
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}