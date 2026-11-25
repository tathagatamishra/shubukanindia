import { Suspense } from "react";
import ExamAttemptPage from "../ExamAttemptPage";

export default function PublicExamPage() {
  return <Suspense fallback={<p>Loading exam…</p>}><ExamAttemptPage guest /></Suspense>;
}
