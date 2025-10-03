import Results from "@/components/Exam/Instructor/Results/Results";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading papers...</div>}>
      <Results />
    </Suspense>
  );
}
