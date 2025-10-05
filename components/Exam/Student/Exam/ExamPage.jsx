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
  // store the target time in milliseconds (either exam start time for waiting, or exam end time for running)
  const [endTime, setEndTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  // single clock: tick 'now' every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchExam = async () => {
    try {
      const storedPassword =
        typeof window !== "undefined"
          ? (localStorage.getItem("exam_password") || "").trim()
          : "";

      const payload = storedPassword
        ? { examID: examId, password: storedPassword }
        : { examID: examId };

      const res = await shubukan_api.post("/student/exam/start", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);

      if (res.data.status === "waiting") {
        setWaitingInfo(res.data);
        setExam(null);
        setSelectedOptions([]);

        // if backend provided a numeric remaining seconds, use it; otherwise use examDate timestamp
        if (typeof res.data.timeRemains === "number") {
          setEndTime(Date.now() + Math.max(0, res.data.timeRemains) * 1000);
        } else {
          const examDateMs = res.data.examDate
            ? new Date(res.data.examDate).getTime()
            : null;
          setEndTime(examDateMs);
        }
      } else if (res.data.status === "ok") {
        setExam(res.data.exam);
        setWaitingInfo(null);
        setSelectedOptions(Array(res.data.exam.totalQuestionCount).fill(null));

        // if backend returned remaining seconds, use that; otherwise use examDuration (minutes)
        const initialSec =
          typeof res.data.timeRemains === "number"
            ? res.data.timeRemains
            : (res.data.exam?.examDuration || 0) * 60;
        setEndTime(Date.now() + Math.max(0, initialSec) * 1000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load exam";
      if (err?.response?.status === 403 && /password/i.test(msg)) {
        router.push("/online-exam/student");
        return;
      }

      alert(msg);
      router.push("/online-exam/student");
    }
  };

  // Initial load
  useEffect(() => {
    if (!examId) return;
    fetchExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    if (!exam) return;
    if (qIndex < 0 || qIndex >= exam.totalQuestionCount) return;

    const updated = [...selectedOptions];
    updated[qIndex] = optionIndex;
    setSelectedOptions(updated);
  };

  const handleSubmit = async () => {
    if (!exam) return;
    if (submitting) return;

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
    if (sec == null) return "0:00";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDiff = (diffMs) => {
    if (!diffMs || diffMs <= 0) return "Started";

    let totalSec = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSec / 86400);
    totalSec %= 86400;

    const hours = Math.floor(totalSec / 3600);
    totalSec %= 3600;

    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    if (parts.length === 0) return "0 seconds";
    return parts.join(" ");
  };

  // compute derived countdown seconds from single clock
  const displayTimeLeft = endTime ? Math.max(0, Math.ceil((endTime - now) / 1000)) : null;

  // watch clock and trigger events when countdown hits zero
  useEffect(() => {
    if (!endTime) return;

    const secLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
    if (secLeft <= 0) {
      if (waitingInfo) {
        // exam should have started; re-check backend
        fetchExam();
      } else if (exam) {
        if (!submitting) handleSubmit();
      }
    }
    // we intentionally depend on now so this runs each tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, endTime, waitingInfo, exam, submitting]);

  // Waiting Page
  if (waitingInfo) {
    const examDateMs = waitingInfo.examDate
      ? new Date(waitingInfo.examDate).getTime()
      : null;
    const remaining = examDateMs ? examDateMs - now : null;

    return (
      <div className="ExamChild w-full h-full flex flex-col justify-center items-center">
        <div className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] mb-[100px] shadow-md border !rounded-[40px]">
          <label className="w-full h-[40px] text-center font-[600] text-[16px] sm:text-[18px] text-[#334155]">
            Exam Not Started Yet
          </label>

          <div className="w-full h-[40px] border-b-1 border-t-1 border-dashed flex flex-row items-center">
            <p className="w-[40%] sm:w-[60%] sm:text-center font-[600] text-[14px] sm:text-[16px] text-[#334155]">
              Exam ID
            </p>
            <div className="border-r-1 border-dashed h-full"></div>
            <p
              className="w-[60%] font-[700] text-center text-[14px] sm:text-[16px] text-[#334155]"
              style={{ letterSpacing: "4px" }}
            >
              {waitingInfo.examID}
            </p>
          </div>

          <div className="w-full h-[40px] border-b-1 border-dashed flex flex-row items-center">
            <p className="w-[40%] sm:w-[60%] sm:text-center font-[600] text-[14px] sm:text-[16px] text-[#334155]">
              Exam Password
            </p>
            <div className="border-r-1 border-dashed h-full"></div>
            <p
              className={`w-[60%] ${waitingInfo.password && "font-[700]"} text-center text-[14px] sm:text-[16px] text-[#334155]`}
              style={{ letterSpacing: `${waitingInfo.password ? "4px" : "auto"}` }}
            >
              {waitingInfo.password || "No Password Needed"}
            </p>
          </div>

          <div className="w-full h-[40px] border-b-1 border-dashed flex flex-row items-center">
            <p className="w-[40%] sm:w-[60%] sm:text-center font-[600] text-[14px] sm:text-[16px] text-[#334155]">
              Exam Set
            </p>
            <div className="border-r-1 border-dashed h-full"></div>
            <p className="w-[60%] font-[700] text-center text-[14px] sm:text-[16px] text-[#334155]" style={{ letterSpacing: "4px" }}>
              {waitingInfo.examSet}
            </p>
          </div>

          <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] p-[8px]">
            <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
              Exam Will Start At
            </label>
            <p className="w-full text-center text-[18px] sm:text-[20px] font-[600] text-[#334155]">
              {waitingInfo.examDate
                ? new Date(waitingInfo.examDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>

            <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
              {waitingInfo.examDate
                ? new Date(waitingInfo.examDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div className="w-full flex flex-col gap-[4px] p-[8px]">
            <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
              Time Remains
            </label>
            <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-red-500">
              {remaining === null ? "N/A" : formatDiff(remaining)}
            </p>
            {/* testing line removed as requested */}
          </div>
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
          Time Left: {formatTime(displayTimeLeft || 0)}
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
                    selectedOptions[idx] === oIdx ? "bg-blue-100 border-blue-500" : "border-gray-300"
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
