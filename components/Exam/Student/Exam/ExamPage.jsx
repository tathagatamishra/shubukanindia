import { Suspense } from "react";
import ExamAttemptPage from "../../ExamAttemptPage";

export default function ExamPage() {
  return <Suspense fallback={<p>Loading exam…</p>}><ExamAttemptPage /></Suspense>;
}
