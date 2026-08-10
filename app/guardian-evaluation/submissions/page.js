import MySubmissions from "@/components/GuardianEvaluation/Submissions/MySubmissions";
import AuthGate from "@/components/GuardianEvaluation/AuthGate";

export default function Page() {
  return (
    <AuthGate>
      <MySubmissions />
    </AuthGate>
  );
}
