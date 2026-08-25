import "@/components/GuardianEvaluation/gef-theme.css";
import { GuardianAuthProvider } from "@/components/GuardianEvaluation/Context/GuardianAuthContext";
import { FormFontSizeProvider } from "@/components/GuardianEvaluation/Context/FormFontSizeContext";
import GefNav from "@/components/GuardianEvaluation/UI/GefNav";

export const metadata = {
  title: "Guardian Evaluation Form",
  description: "Shubukan India Guardian Evaluation Form portal",
};

export default function GuardianEvaluationLayout({ children }) {
  return (
    <GuardianAuthProvider>
      <FormFontSizeProvider>
        {/* Rendered anywhere in the tree, Next.js hoists this into <head> and starts
            fetching it immediately, so the loader's image is already cached/in-flight
            by the time any loading state (route-level or client-triggered) mounts it. */}
        <link rel="preload" as="image" href="/images/loader-elephant.png" fetchPriority="high" />
        <div className="gef-root" style={{ zIndex: 2 }}>
          <GefNav />
          {children}
        </div>
      </FormFontSizeProvider>
    </GuardianAuthProvider>
  );
}
