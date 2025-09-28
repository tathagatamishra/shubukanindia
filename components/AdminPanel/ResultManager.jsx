// components/AdminPanel/ResultManager.jsx
"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";

export default function ResultManager() {
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await shubukan_api.get("/admin/results", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResults(res.data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2">Student</th>
              <th className="p-2">Exam</th>
              <th className="p-2">Marks</th>
              <th className="p-2">Correct</th>
              <th className="p-2">Wrong</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{r.student?.name}</td>
                <td className="p-2">{r.exam?.examID}</td>
                <td className="p-2">{r.marksObtained}</td>
                <td className="p-2">{r.correctAnsCount}</td>
                <td className="p-2">{r.wrongAnsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
