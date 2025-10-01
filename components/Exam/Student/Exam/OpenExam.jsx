// Exam/Student/Exam/OpenExam.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import { useRouter } from "next/navigation";

export default function OpenExam() {
  const [exams, setExams] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";
  const router = useRouter();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await shubukan_api.get("/exams/upcoming"); // public upcoming exams
        setExams(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch exams");
      }
    };
    fetchExams();
  }, []);

  const handleStart = async (exam) => {
    try {
      const res = await shubukan_api.post(
        "/student/exam/start",
        {
          examID: exam.examID,
          examSet: exam.examSet,
          password: exam.password || "", // handle optional
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
        Open Exams
      </label>
      {exams.length === 0 ? (
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
                Date: {new Date(exam.examDate).toLocaleString()}
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
