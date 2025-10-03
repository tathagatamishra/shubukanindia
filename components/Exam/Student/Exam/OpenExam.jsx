"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import { useRouter } from "next/navigation";

export default function OpenExam() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchExams = async (attempt = 0) => {
      if (!mounted) return;
      setLoading(true);
      try {
        const res = await shubukan_api.get("/exams/upcoming"); // public upcoming exams
        if (!mounted) return;
        const data = res.data || [];
        setExams(data);
        setLoading(false);

        // If empty and we still have retries left, wait 1s and retry
        if (Array.isArray(data) && data.length === 0 && attempt < 2) {
          setTimeout(() => fetchExams(attempt + 1), 1000);
        }
      } catch (err) {
        console.error("fetchExams error:", err);
        if (attempt < 2) {
          setTimeout(() => fetchExams(attempt + 1), 1000);
        } else {
          setLoading(false);
          alert("Failed to fetch exams");
        }
      }
    };

    fetchExams(0);

    return () => {
      mounted = false;
    };
  }, []);

  const handleStart = async (exam) => {
    try {
      const res = await shubukan_api.post(
        "/student/exam/start",
        {
          examID: exam.examID,
          examSet: exam.examSet,
          password: exam.password || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Exam started!");
      router.push(`/online-exam/${exam.examID}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start exam");
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Demo Exams
      </label>

      {loading && <p className="text-[14px] text-gray-500">Loading exams...</p>}

      {!loading && exams.length === 0 ? (
        <p className="text-[14px] text-gray-500">No upcoming exams available</p>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="OnlineExam corner-shape w-full flex flex-col p-4 shadow-md border !rounded-[40px]"
            >
              <p className="font-[600]">Exam ID: {exam.examID}</p>
              <p className="text-sm text-gray-600">
                Date:{" "}
                {exam.examDate
                  ? new Date(exam.examDate).toLocaleString()
                  : "Available anytime"}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {exam.examDuration} min | Marks: {exam.totalMarks}
              </p>
              {exam.kyu && <p className="text-sm">For Kyu: {exam.kyu}</p>}

              <ExamBtn
                text="Start Exam"
                onClick={() => handleStart(exam)}
                className="mt-2 self-end"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
