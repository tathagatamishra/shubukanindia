// components/Exam/Public/OpenExamPublic.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import ExamBtn from "../UI/ExamBtn";
import { useRouter } from "next/navigation";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function OpenExamPublic() {
  const [exams, setExams] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchExams = async () => {
      try {
        const res = await shubukan_api.get(
          "/exams/upcoming?accessability=public"
        );
        setExams(res.data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Failed to fetch public exams:", err);
        alert("Failed to fetch public exams");
      }
    };
    fetchExams();
    setLoading(false);
  }, []);

  const handleStart = async (exam) => {
    setLoading(true);
    try {
      // For public, we call public start endpoint (no auth)
      const res = await shubukan_api.post("/exam/start", {
        examID: exam.examID,
        password: exam.password || "",
      });
      // If waiting, still navigate — the PublicExamPage will show waiting screen as well.
      router.push(`/online-exam/public/${exam.examID}`);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert(err?.response?.data?.message || "Failed to start public exam");
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Demo Exams
      </label>

      <Loader loading={loading} />

      {exams.length === 0 ? (
        <p className="text-[14px] text-gray-500">No public exams available</p>
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
