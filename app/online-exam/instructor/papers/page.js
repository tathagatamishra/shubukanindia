// File: app/online-exam/instructor/papers/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [papers, setPapers] = useState([]);
  const [kyu, setKyu] = useState(searchParams.get("kyu") || "");
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (kyu) params.kyu = kyu;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      const res = await shubukan_api.get("/instructor/question-papers", {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setPapers(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load papers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Question Papers (Previous Exams)</h2>
      <div className="flex gap-2 mb-4">
        <input placeholder="kyu" value={kyu} onChange={(e) => setKyu(e.target.value)} className="border p-2 rounded w-24" />
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2 rounded" />
        <button className="px-3 py-1 bg-black text-white rounded" onClick={fetchPapers}>Filter</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : papers.length === 0 ? (
        <div>No papers found for the selected filters</div>
      ) : (
        <div className="grid gap-3">
          {papers.map((p) => (
            <div key={`${p.examID}-${p.examSet}-${p.examDate}`} className="border rounded p-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Exam {p.examID} - Set {p.examSet}</div>
                  <div className="text-sm">KYU: {p.kyu ?? "-"}</div>
                  <div className="text-sm">Date: {p.examDate ? new Date(p.examDate).toLocaleString() : "-"}</div>
                </div>
                <div>
                  <button className="px-3 py-1 border rounded" onClick={() => router.push(`/online-exam/instructor/papers/view?examID=${p.examID}&examSet=${p.examSet}`)}>
                    View Questions
                  </button>
                </div>
              </div>

              <div className="mt-2">
                {p.questions.slice(0, 3).map((q) => (
                  <div key={q._id} className="text-sm border rounded p-2 my-1">
                    <div className="font-medium">{q.question}</div>
                    <div className="text-xs">Options: {q.options.length} | Correct: {q.answer}</div>
                  </div>
                ))}
                {p.questions.length > 3 && <div className="text-xs mt-1">+ {p.questions.length - 3} more questions</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}