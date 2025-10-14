// components/Exam/Public/PublicExamPage.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "../UI/ExamBtn";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function PublicExamPage() {
  const { examId } = useParams(); // examID (string)
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // store returned result (score etc.)
  const [loading, setLoading] = useState(false);

  const fetchExamStart = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.post("/exam/start", { examID: examId });
      setLoading(false);
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
      setLoading(false);
      console.error("Failed to start public exam:", err);
      alert(err?.response?.data?.message || "Failed to start exam");
      router.push("/online-exam/public");
    }
  };

  useEffect(() => {
    fetchExamStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (waitingInfo) {
        fetchExamStart();
      } else if (exam && !result) {
        // Auto submit when time up
        handleSubmit();
      }
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, waitingInfo, exam, result]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    const updated = [...selectedOptions];
    updated[qIndex] = optionIndex;
    setSelectedOptions(updated);
  };

  // Submit: call public submit endpoint which returns computed score / details but doesn't persist
  const handleSubmit = async () => {
    if (!exam) return;
    setSubmitting(true);
    setLoading(true);
    try {
      // send selectedOptions to server; server computes score and returns result (but does not save)
      const res = await shubukan_api.post(`/exam/${exam._id}/submit`, {
        selectedOptions,
        // optional guest fields if you want: guestName, guestEmail
      });

      // Expect server to return { score, totalMarks, correctCount, details? }
      setResult(res.data);
    } catch (err) {
      console.error("Submit failed:", err);
      alert(err?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (waitingInfo) {
    return (
      <div className="ExamChild w-full h-full flex flex-col justify-center items-center">
        <div className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]">
          <h2 className="text-xl font-bold mb-2">Exam Not Started Yet</h2>
          <p>Exam ID: {waitingInfo.examID}</p>
          <p>Set: {waitingInfo.examSet}</p>
          <p>Scheduled: {new Date(waitingInfo.examDate).toLocaleString()}</p>
          <p className="text-red-500 mt-2">
            Time Remaining: {formatTime(timeLeft || 0)}
          </p>
        </div>
      </div>
    );
  }

  if (!exam && !waitingInfo) {
    return <p className="text-center mt-10">Loading exam...</p>;
  }

  // If result exists, show instant result UI (guest result not saved)
  if (result) {
    return (
      <div className="ExamChild w-full flex flex-col items-center">
        <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
          Your Result
        </label>

        <div className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]">
          <p className="text-lg font-semibold">
            Score:{" "}
            {result.score ?? result.totalMarks
              ? `${result.score}/${result.totalMarks}`
              : result.message}
          </p>
          {result.correctCount !== undefined && (
            <p>
              Correct: {result.correctCount} / {exam.totalQuestionCount}
            </p>
          )}

          {/* Optional: show per-question details if backend provides it */}
          {result.details && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              {result.details.map((d, i) => (
                <div key={i} className="mb-2">
                  <p>
                    Q{i + 1}:{" "}
                    {d.correct
                      ? "Correct"
                      : `Wrong (Correct: ${d.correctOption})`}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <ExamBtn
              text="Retake"
              size="w-fit h-auto"
              onClick={() => {
                setResult(null);
                fetchExamStart();
              }}
            />
            <ExamBtn
              text="Back to Public Exams"
              size="w-fit min-w-[150px] h-auto"
              onClick={() => router.push("/online-exam/public")}
            />
          </div>
        </div>
      </div>
    );
  }

  // Exam in progress UI
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
        text={submitting ? "Submitting..." : "Submit Answers"}
        className="mt-6 self-end"
        onClick={handleSubmit}
      />

      <Loader loading={loading} />
    </div>
  );
}
