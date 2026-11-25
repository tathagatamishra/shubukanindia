"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "./UI/ExamBtn";

function readSession(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

function writeSession(key, session) {
  try {
    if (session) localStorage.setItem(key, JSON.stringify(session));
    else localStorage.removeItem(key);
  } catch { /* The server still saves answers when browser storage is unavailable. */ }
}

function accountId(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).id;
  } catch {
    return null;
  }
}

function clockLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function newStartKey() {
  if (globalThis.crypto.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hash = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
}

export default function ExamAttemptPage({ guest = false }) {
  const { examId } = useParams();
  const requestedSet = Number(useSearchParams().get("set")) || undefined;
  const router = useRouter();
  const base = guest ? "/exam" : "/student/exam";
  const back = guest ? "/online-exam/public" : "/online-exam/student";
  const [access, setAccess] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [waiting, setWaiting] = useState(null);
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(requestedSet);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(0);
  const [offset, setOffset] = useState(0);
  const inFlight = useRef(false);
  const autoSubmitted = useRef(false);
  const session = useRef(null);

  const opened = attempt || waiting || receipt?.availableAt;
  useEffect(() => {
    if (!opened) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [opened]);

  const updateClock = (serverTime) => {
    const local = Date.now();
    setNow(local);
    setOffset(serverTime ? Date.parse(serverTime) - local : 0);
  };

  const uploadAnswers = useCallback(async (credentials, exam, draft) => {
    setNotice("Saving answers…");
    try {
      const { data } = await shubukan_api.put(`${base}/${exam._id}/answers`, {
        attemptId: draft.attemptId, selectedOptions: draft.selectedOptions, answerRevision: draft.answerRevision,
      }, { headers: credentials.headers });
      if (session.current === draft) {
        setNotice(data.saved ? "Answers saved" : "Your latest answers are kept on this device.");
      }
    } catch {
      if (session.current === draft) setNotice("Saved on this device. Waiting for a connection.");
    }
  }, [base]);

  const start = useCallback(async (credentials, setNumber, secret = "") => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      if (!session.current?.startKey) session.current = { ...session.current, startKey: newStartKey() };
      writeSession(credentials.key, session.current);
      const { data } = await shubukan_api.post(`${base}/start`, {
        examID: examId, examSet: setNumber, password: secret,
        startKey: session.current.startKey, attemptId: session.current.attemptId,
      }, { headers: credentials.headers });
      updateClock(data.serverTime);
      setWaiting(null);
      if (data.status === "waiting") {
        setWaiting(data);
        setSelectedSet(data.examSet);
      } else if (data.status === "chooseSet") {
        setSets(data.sets);
      } else if (data.status === "expired") {
        setError("This exam has ended.");
      } else if (data.status === "submitted") {
        setReceipt(data);
      } else if (data.status === "ok") {
        const previous = session.current;
        const useLocal = previous.attemptId === data.attemptId && previous.answerRevision > data.answerRevision &&
          previous.selectedOptions?.length === data.selectedOptions.length && !data.submitted;
        session.current = {
          startKey: previous.startKey, attemptId: data.attemptId, examSet: data.exam.examSet,
          selectedOptions: useLocal ? previous.selectedOptions : data.selectedOptions,
          answerRevision: useLocal ? previous.answerRevision : data.answerRevision,
        };
        writeSession(credentials.key, session.current);
        setSelectedOptions(session.current.selectedOptions);
        setAttempt(data);
        setPassword("");
        if (useLocal && Date.parse(data.endsAt) > Date.parse(data.serverTime)) {
          uploadAnswers(credentials, data.exam, session.current);
        }
      } else {
        setError("Could not open this exam.");
      }
    } catch (err) {
      if (err.response?.data?.code === "EXAM_PASSWORD") setPasswordRequired(true);
      setWaiting(null);
      setError(err.response?.data?.message || "Could not connect. Try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, [base, examId, uploadAnswers]);

  useEffect(() => {
    const token = guest ? null : localStorage.getItem("student_token");
    if (!guest) localStorage.removeItem("exam_password");
    const owner = guest ? "guest" : accountId(token);
    if (!owner) {
      router.replace("/online-exam/student/login");
      return;
    }
    const credentials = {
      key: `online-exam:${owner}:${examId}:${requestedSet ?? "any"}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
    session.current = readSession(credentials.key);
    setAccess(credentials);
    if (session.current?.attemptId) start(credentials, session.current.examSet ?? requestedSet);
  }, [examId, guest, requestedSet, router, start]);

  const sendSubmission = useCallback(async () => {
    if (!attempt || !access || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const { data } = await shubukan_api.post(`${base}/${attempt.exam._id}/submit`, {
        attemptId: session.current.attemptId, selectedOptions: session.current.selectedOptions,
        answerRevision: session.current.answerRevision,
      }, { headers: access.headers });
      if (data.serverTime) updateClock(data.serverTime);
      setReceipt(data);
    } catch (err) {
      setError(err.response?.data?.message || "Submission could not be confirmed. Your answers are kept on this device. Try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, [access, attempt, base]);

  const timeLeft = Math.max(0, Math.ceil((Date.parse(attempt?.endsAt || waiting?.examDate) - now - offset) / 1000));
  const examClosed = attempt && (attempt.submitted || timeLeft === 0);
  const resultsReady = receipt?.availableAt && now + offset >= Date.parse(receipt.availableAt);
  useEffect(() => {
    if (waiting && timeLeft === 0 && !busy) start(access, waiting.examSet, password);
    if (examClosed && !receipt && !busy && !autoSubmitted.current) {
      autoSubmitted.current = true;
      sendSubmission();
    }
  }, [access, busy, examClosed, password, receipt, sendSubmission, start, timeLeft, waiting]);

  useEffect(() => {
    if (!attempt || !access || receipt || examClosed) return;
    const sync = () => {
      if (session.current?.answerRevision) uploadAnswers(access, attempt.exam, session.current);
    };
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, [access, attempt, examClosed, receipt, uploadAnswers]);

  const chooseOption = (index, option) => {
    if (inFlight.current || Date.now() + offset >= Date.parse(attempt.endsAt)) return;
    const answers = [...session.current.selectedOptions];
    answers[index] = option;
    const draft = { ...session.current, selectedOptions: answers, answerRevision: session.current.answerRevision + 1 };
    session.current = draft;
    setSelectedOptions(answers);
    writeSession(access.key, draft);
    uploadAnswers(access, attempt.exam, draft);
  };

  const restart = () => {
    writeSession(access.key, null);
    session.current = null;
    autoSubmitted.current = false;
    setAttempt(null);
    setReceipt(null);
    setNotice("");
    setError("");
  };

  return (
    <div className="ExamChild w-full flex flex-col gap-4 pb-8">
      <h1 className="font-semibold text-slate-700">Exam {examId}{attempt && ` · Set ${attempt.exam.examSet}`}</h1>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!access ? <p>Loading exam…</p> : null}
      {access && !attempt && !waiting && !receipt && (
        <form onSubmit={(event) => { event.preventDefault(); start(access, selectedSet, password); }}
          className="OnlineExam w-full rounded-3xl border p-4 flex flex-col gap-3">
          {sets.length > 0 && (
            <label>Exam set
              <select required className="ml-2 rounded border p-2" value={selectedSet || ""}
                onChange={(event) => setSelectedSet(Number(event.target.value) || undefined)}>
                <option value="">Choose a set</option>
                {sets.map((set) => <option key={set} value={set}>{set}</option>)}
              </select>
            </label>
          )}
          {passwordRequired && (
            <label>Exam password
              <input type="password" value={password} required
                onChange={(event) => setPassword(event.target.value)} className="ml-2 rounded border p-2" />
            </label>
          )}
          <ExamBtn type="submit" disabled={busy} text={busy ? "Opening…" : "Open Exam"} />
        </form>
      )}
      {waiting && <p role="status">Set {waiting.examSet} starts at {new Date(waiting.examDate).toLocaleString()}. Time remaining {clockLabel(timeLeft)}.</p>}
      {attempt && !receipt && (
        <>
          <div className="flex flex-wrap justify-between gap-3 text-slate-700">
            <strong>{examClosed ? "Answer editing closed" : `Time left ${clockLabel(timeLeft)}`}</strong>
            <span role="status">{notice}</span>
          </div>
          <fieldset disabled={busy || examClosed} className="flex flex-col gap-4 min-w-0">
            {attempt.exam.questions.map((question, index) => (
              <fieldset key={question._id || index} className="OnlineExam w-full rounded-3xl border p-4">
                <legend className="font-semibold px-2">Q{index + 1}. {question.question}</legend>
                <div className="grid gap-2">
                  {question.options.map((option, choice) => (
                    <label key={choice} className="rounded-lg border p-2">
                      <input type="radio" name={`question-${index}`} className="mr-2"
                        checked={selectedOptions[index] === choice} onChange={() => chooseOption(index, choice)} />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </fieldset>
          <ExamBtn disabled={busy} onClick={sendSubmission} text={busy ? "Submitting…" : error ? "Retry Submission" : "Submit Exam"} />
        </>
      )}
      {receipt && (
        <div className="OnlineExam rounded-3xl border p-4 flex flex-col items-start gap-3">
          <h2 className="font-semibold">Exam submitted</h2>
          {receipt.availableAt && <p>Results are available after {new Date(receipt.availableAt).toLocaleString()}.</p>}
          {!guest && <ExamBtn text="My Results" onClick={() => router.push("/online-exam/student/results")} />}
          {guest && receipt.availableAt && <ExamBtn text="Check Result" disabled={!resultsReady || busy} onClick={sendSubmission} />}
          {guest && receipt.score != null && (
            <>
              <p>Score {receipt.score} / {receipt.totalMarks}</p>
              <ol className="list-decimal pl-5">
                {receipt.details.map((detail, index) => (
                  <li key={index}>
                    {detail.correct ? "Correct" : detail.chosen == null ? "Unanswered" : "Incorrect"}
                    {" · "}{attempt.exam.questions[index].options[detail.correctOption]}
                  </li>
                ))}
              </ol>
            </>
          )}
          {attempt && !attempt.exam.examDate && <ExamBtn text="Try Again" onClick={restart} />}
        </div>
      )}
      <button type="button" className="underline self-start" onClick={() => router.push(back)}>Back to exams</button>
    </div>
  );
}
