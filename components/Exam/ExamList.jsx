"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "./UI/ExamBtn";

export default function ExamList({ guest = false }) {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const token = guest ? null : localStorage.getItem("student_token");
    if (!guest && !token) {
      router.replace("/online-exam/student/login");
      return;
    }
    const request = new AbortController();
    setLoading(true);
    setError("");
    shubukan_api.get(guest ? "/exams/upcoming" : "/student/exams/upcoming", {
      signal: request.signal, headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(({ data }) => {
      if (!request.signal.aborted) setExams(data);
    }).catch((err) => {
      if (!request.signal.aborted) setError(err.response?.data?.message || "Could not load the exams.");
    }).finally(() => {
      if (!request.signal.aborted) setLoading(false);
    });
    return () => request.abort();
  }, [guest, retry, router]);

  return (
    <div className="ExamChild w-full flex flex-col gap-4 pb-8">
      <h1 className="font-semibold">{guest ? "Demo Exams" : "Available Exams"}</h1>
      {loading ? <p role="status">Loading exams…</p> : error ? (
        <>
          <p role="alert">{error}</p>
          <ExamBtn text="Try Again" onClick={() => setRetry((current) => current + 1)} />
        </>
      ) : exams.length === 0 ? <p>No exams are available.</p> : exams.map((exam) => (
        <div key={exam._id} className="OnlineExam rounded-3xl border shadow-md p-4 flex flex-col gap-2">
          <h2 className="font-semibold">{exam.examID} · Set {exam.examSet}</h2>
          <p>{exam.examDate ? new Date(exam.examDate).toLocaleString() : "Available anytime"}</p>
          <p>{exam.examDuration} minutes · {exam.totalMarks} marks{exam.kyu != null ? ` · Kyu ${exam.kyu}` : ""}</p>
          {exam.passwordRequired && <p>Password required</p>}
          <ExamBtn text="Open Exam" className="self-end" onClick={() =>
            router.push(`/online-exam/${guest ? "public/" : ""}${encodeURIComponent(exam.examID)}?set=${exam.examSet}`)
          } />
        </div>
      ))}
    </div>
  );
}
