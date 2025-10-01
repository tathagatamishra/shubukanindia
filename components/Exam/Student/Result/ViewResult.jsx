// Exam/Student/Result/ViewResult.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";

export default function ViewResult() {
  const [results, setResults] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await shubukan_api.get("/student/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch results");
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <h2 className="font-[700] text-[18px] sm:text-[20px] mb-4">
        My Exam Results
      </h2>

      {results.length === 0 ? (
        <p className="text-[14px] text-gray-500">No results found</p>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {results.map((res, idx) => (
            <div
              key={idx}
              className="border shadow-md corner-shape p-4 flex flex-col"
            >
              <p className="font-[600]">Exam ID: {res.examID}</p>
              <p className="text-sm">Kyu: {res.kyu || "N/A"}</p>
              <p className="text-sm">Marks: {res.marksObtained}</p>
              <p className="text-sm">
                Correct: {res.correctAnsCount} | Wrong: {res.wrongAnsCount}
              </p>
              <p className="text-sm">
                Submitted At: {new Date(res.submittedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
