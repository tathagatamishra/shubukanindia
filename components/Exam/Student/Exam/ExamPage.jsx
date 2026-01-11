"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function ExamPage() {
  const { examId } = useParams();
  const router = useRouter();

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState(null);
  const [waitingInfo, setWaitingInfo] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // store the target time in milliseconds (either exam start time for waiting, or exam end time for running)
  const [endTime, setEndTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());

  // sync-safe refs to prevent duplicate submits
  const submitLockRef = useRef(false); // immediate lock (synchronous)
  const submittedRef = useRef(false); // whether we've already submitted (persist across rerenders)

  const sessionEndKey = examId ? `exam_${examId}_endTime` : null;
  const sessionSubmittedKey = examId ? `exam_${examId}_submitted` : null;

  // single clock: tick 'now' every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // on mount try to restore endTime / submitted flag from sessionStorage (prevents countdown reset)
  useEffect(() => {
    if (!examId || typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem(sessionEndKey);
      if (stored) {
        const ms = Number(stored);
        if (!Number.isNaN(ms) && ms > Date.now()) {
          setEndTime(ms);
        } else {
          // expired - clean up stale value
          sessionStorage.removeItem(sessionEndKey);
        }
      }

      const wasSubmitted = sessionStorage.getItem(sessionSubmittedKey) === "1";
      if (wasSubmitted) submittedRef.current = true;
    } catch (e) {
      // ignore sessionStorage errors (private mode etc.)
    }

    // fetch fresh server state
    fetchExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // fetchExam wrapped in useCallback for stability
  const fetchExam = useCallback(async () => {
    if (!examId) return;
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

      const data = res.data || {};

      if (data.status === "waiting") {
        setWaitingInfo(data);
        setExam(null);
        setSelectedOptions([]);

        // if backend provided a numeric remaining seconds, use it; otherwise use examDate timestamp
        let computedEnd = null;
        if (typeof data.timeRemains === "number") {
          computedEnd = Date.now() + Math.max(0, data.timeRemains) * 1000;
        } else if (data.examDate) {
          computedEnd = new Date(data.examDate).getTime();
        }

        if (computedEnd) {
          setEndTime(computedEnd);
          try {
            sessionStorage.setItem(sessionEndKey, String(computedEnd));
          } catch (e) {}
        }
      } else if (data.status === "ok") {
        // canonical exam object
        const serverExam = data.exam || data;
        setExam(serverExam);
        setWaitingInfo(null);

        // ensure selectedOptions length matches the number of questions returned
        const qCount = Array.isArray(serverExam.questions)
          ? serverExam.questions.length
          : serverExam.totalQuestionCount || 0;
        setSelectedOptions(Array(qCount).fill(null));

        // compute end time using the best available source
        let computedEnd = null;
        if (serverExam.examEndTime) {
          computedEnd = new Date(serverExam.examEndTime).getTime();
        } else if (data.examEndTime) {
          computedEnd = new Date(data.examEndTime).getTime();
        } else if (typeof data.timeRemains === "number") {
          computedEnd = Date.now() + Math.max(0, data.timeRemains) * 1000;
        } else {
          const dur = serverExam.examDuration || 0; // minutes
          computedEnd = Date.now() + Math.max(0, dur) * 60 * 1000;
        }

        setEndTime(computedEnd);
        try {
          sessionStorage.setItem(sessionEndKey, String(computedEnd));
        } catch (e) {}
      } else {
        // unexpected status - navigate away
        throw new Error(data.message || "Unexpected response from server");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load exam";
      if (err?.response?.status === 403 && /password/i.test(msg)) {
        router.push("/online-exam/student");
        return;
      }

      alert(msg);
      router.push("/online-exam/student");
    }
  }, [examId, router, sessionEndKey, token]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    if (!exam || !Array.isArray(exam.questions)) return;
    if (qIndex < 0 || qIndex >= exam.questions.length) return;

    const updated = [...selectedOptions];
    updated[qIndex] = optionIndex;
    setSelectedOptions(updated);
  };

  const handleSubmit = useCallback(async () => {
    if (!exam) return;
    if (submitLockRef.current || submittedRef.current) return;

    submitLockRef.current = true;
    setSubmitting(true);
    setLoading(true);

    try {
      await shubukan_api.post(
        `/student/exam/${exam._id}/submit`,
        { selectedOptions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      submittedRef.current = true;
      try {
        sessionStorage.setItem(sessionSubmittedKey, "1");
        sessionStorage.removeItem(sessionEndKey);
      } catch (e) {}

      alert("Exam submitted successfully!");
      router.push("/online-exam/student/results");
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to submit exam";

      if (/already attempted/i.test(errMsg) || /already submitted/i.test(errMsg)) {
        submittedRef.current = true;
        try {
          sessionStorage.setItem(sessionSubmittedKey, "1");
          sessionStorage.removeItem(sessionEndKey);
        } catch (e) {}
        router.push("/online-exam/student/results");
        return;
      }

      alert(errMsg);
      router.push("/online-exam/student");
    } finally {
      setSubmitting(false);
      setLoading(false);
      if (!submittedRef.current) submitLockRef.current = false;
    }
  }, [exam, selectedOptions, router, sessionEndKey, sessionSubmittedKey, token]);

  // format seconds to H:MM:SS (hours omitted if zero)
  const formatDuration = (totalSec) => {
    if (totalSec == null) return "N/A";
    const sec = Math.max(0, Number(totalSec));
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    const pad = (n) => String(n).padStart(2, "0");
    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    return `${minutes}:${pad(seconds)}`;
  };

  // compute derived countdown seconds from single clock
  const displayTimeLeftSeconds = endTime
    ? Math.max(0, Math.floor((endTime - now) / 1000))
    : null;

  // watch clock and trigger events when countdown hits zero
  useEffect(() => {
    if (!endTime) return;

    const secLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
    if (secLeft <= 0) {
      if (waitingInfo) {
        // exam should have started; re-check backend
        fetchExam();
      } else if (exam) {
        if (!submitLockRef.current && !submittedRef.current) {
          handleSubmit();
        }
      }
    }
    // run on each tick; fetchExam/handleSubmit are stable via useCallback
  }, [now, endTime, waitingInfo, exam, fetchExam, handleSubmit]);

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
            <p className="w-full text-center font-[600] text-[14px] sm:text-[16px] text-[#334155]">Exam ID</p>
            <div className="border-r-1 border-dashed h-full"></div>
            <p
              className="w-full font-[700] text-center text-[14px] sm:text-[16px] text-[#334155]"
              style={{ letterSpacing: "4px" }}
            >
              {waitingInfo.examID}
            </p>
          </div>

          <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] p-[8px]">
            <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">Exam Will Start At</label>
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
            <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">Time Remains</label>
            <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-red-500">
              {remaining === null ? "N/A" : (() => {
                const s = Math.max(0, Math.floor(remaining / 1000));
                return formatDuration(s);
              })()}
            </p>
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
          Time Left: {submittedRef.current ? "Submitted" : displayTimeLeftSeconds === null ? "N/A" : formatDuration(displayTimeLeftSeconds)}
        </label>
      </div>

      <div className="w-full flex flex-col gap-[12px] sm:gap-[24px]">
        {Array.isArray(exam.questions) && exam.questions.map((q, idx) => (
          <div
            key={q._id || idx}
            className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] mb-[16px] shadow-md border !rounded-[40px]"
          >
            <p className="font-semibold mb-2">Q{idx + 1}. {q.question}</p>
            <div className="flex flex-col gap-2">
              {Array.isArray(q.options) && q.options.map((opt, oIdx) => (
                <label
                  key={oIdx}
                  className={`corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-4 cursor-pointer flex flex-row items-center ${selectedOptions[idx] === oIdx ? "bg-blue-100 border-blue-500" : "border-gray-300"}`}
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

      <Loader loading={loading} />
    </div>
  );
}
