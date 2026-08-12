import "@/components/GuardianEvaluation/gef-theme.css";
import { GuardianAuthProvider } from "@/components/GuardianEvaluation/Context/GuardianAuthContext";
import GefNav from "@/components/GuardianEvaluation/UI/GefNav";

export const metadata = {
  title: "Guardian Evaluation Form",
  description: "Shubukan India Guardian Evaluation Form portal",
};

export default function GuardianEvaluationLayout({ children }) {
  return (
    <GuardianAuthProvider>
      <div className="gef-root">
        <GefNav />
        {children}
      </div>
    </GuardianAuthProvider>
  );
}
