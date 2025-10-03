// File: app/online-exam/instructor/results/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [queryName, setQueryName] = useState(searchParams.get("student") || "");

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    if (queryName) return searchByName(queryName);
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {};
      if (date) params.date = date;
      const res = await shubukan_api.get("/instructor/results", {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async (name) => {
    try {
      setLoading(true);
      const res = await shubukan_api.get("/instructor/result/search", {
        params: { name },
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const viewSheet = (resultId) => router.push(`/online-exam/instructor/result/${resultId}`);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Student Results</h2>

      <div className="flex gap-2 mb-4">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 rounded" />
        <button className="px-3 py-1 bg-black text-white rounded" onClick={fetchResults}>Filter by Date</button>

        <input
          placeholder="Search student by name"
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button className="px-3 py-1 bg-black text-white rounded" onClick={() => searchByName(queryName)}>
          Search
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : results.length === 0 ? (
        <div>No results found</div>
      ) : (
        <div className="grid gap-3">
          {results.map((r) => (
            <div key={r._id} className="border rounded p-3 flex justify-between items-start">
              <div>
                <div className="font-semibold">{r.student?.name ?? "-"}</div>
                <div className="text-sm">Exam: {r.exam?.examID} | Set {r.exam?.examSet}</div>
                <div className="text-sm">Submitted: {new Date(r.submittedAt).toLocaleString()}</div>
                <div className="text-sm">Marks: {r.marksObtained} / {r.exam?.totalMarks ?? '-'}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1 border rounded" onClick={() => viewSheet(r._id)}>View Answer Sheet</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}