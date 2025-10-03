// app/online-exam/instructor/profile/page.js
import Papers from "@/components/Exam/Instructor/Papers/Papers";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading papers...</div>}>
      <Papers />
    </Suspense>
  );
}
