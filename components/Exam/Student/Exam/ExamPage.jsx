// Exam/Student/Exam/ExamPage.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  const [exam, setExam] = useState(null);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchExam = async () => {
    try {
      const storedPassword =
        typeof window !== "undefined"
          ? localStorage.getItem("exam_password") || ""
          : "";

      if (!storedPassword) {
        console.log("no pass");
        router.push("/online-exam/student"); // enforce entry point
        return;
      }

      const res = await shubukan_api.post(
        "/student/exam/start",
        { examID: examId, password: storedPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "waiting") {
        setWaitingInfo(res.data);
        setExam(null);
        setTimeLeft(res.data.timeRemains);
      } else if (res.data.status === "ok") {
        setExam(res.data.exam);
        setWaitingInfo(null);
        setSelectedOptions(Array(res.data.exam.totalQuestionCount).fill(null));
        setTimeLeft(res.data.exam.examDuration * 60);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load exam");
      router.push("/online-exam/student"); // go back if bad access
    }
  };

  // Initial load
  useEffect(() => {
    const storedPassword =
      typeof window !== "undefined"
        ? localStorage.getItem("exam_password")
        : "";
    if (!storedPassword) {
      router.push("/online-exam/student"); // force entry through Student.jsx
    } else {
      fetchExam();
    }
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (waitingInfo) {
        // exam not started yet, recheck backend
        fetchExam();
      } else if (exam) {
        // exam in progress → auto submit
        handleSubmit();
      }
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, waitingInfo, exam]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    const updated = [...selectedOptions];
    updated[qIndex] = optionIndex;
    setSelectedOptions(updated);
  };

  const handleSubmit = async () => {
    if (!exam) return;
    try {
      setSubmitting(true);
      await shubukan_api.post(
        `/student/exam/${exam._id}/submit`,
        { selectedOptions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Exam submitted successfully!");
      router.push("/online-exam/student/results");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit exam");
      router.push("/online-exam/student");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Waiting Page
  if (waitingInfo) {
    return (
      <div className="ExamChild w-full h-full flex flex-col justify-center items-center">
        <div className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]">
          <h2 className="text-xl font-bold mb-2">Exam Not Started Yet</h2>
          <p>Exam ID: {waitingInfo.examID}</p>
          <p>Exam ID: {waitingInfo.password}</p>
          <p>Set: {waitingInfo.examSet}</p>
          <p>Scheduled: {new Date(waitingInfo.examDate).toLocaleString()}</p>
          <p className="text-red-500 mt-2">
            Time Remaining: {formatTime(timeLeft || 0)}
          </p>
        </div>
      </div>
    );
  }

  // Exam Page
  if (!exam) return <p className="text-center mt-10">Loading exam...</p>;

  return (
    <div className="ExamChild w-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
          Exam {exam.examID} - Set {exam.examSet}
        </label>
        <label className="w-full text-right font-[600] text-[14px] sm:text-[16px] text-[#B23A48]">
          Time Left: {formatTime(timeLeft || 0)}
        </label>
      </div>

      <div className="w-full flex flex-col gap-[12px] sm:gap-[24px]">
        {exam.questions.map((q, idx) => (
          <div
            key={q._id}
            className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
          >
            <p className="font-semibold mb-2">
              Q{idx + 1}. {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oIdx) => (
                <label
                  key={oIdx}
                  className={`corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4 cursor-pointer flex flex-row items-center ${
                    selectedOptions[idx] === oIdx
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={oIdx}
                    checked={selectedOptions[idx] === oIdx}
                    onChange={() => handleOptionSelect(idx, oIdx)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ExamBtn
        text={submitting ? "Submitting..." : "Submit Exam"}
        className="mt-6 self-end"
        onClick={handleSubmit}
      />
    </div>
  );
}
