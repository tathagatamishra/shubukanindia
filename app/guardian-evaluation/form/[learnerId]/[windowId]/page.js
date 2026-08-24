import AuthGate from "@/components/GuardianEvaluation/AuthGate";
import FullForm from "@/components/GuardianEvaluation/Form/FullForm";

export default async function Page({ params }) {
  const { learnerId, windowId } = await params;
  return (
    <AuthGate>
      <FullForm learnerId={learnerId} windowId={windowId} />
    </AuthGate>
  );
}
