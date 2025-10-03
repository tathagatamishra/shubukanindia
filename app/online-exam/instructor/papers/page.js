// app/online-exam/instructor/papers/page.js
import Papers from "@/components/Exam/Instructor/Papers/Papers";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading papers...</div>}>
      <Papers />
    </Suspense>
  );
}
