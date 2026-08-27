import AdminAuthGuard from "@/components/GuardianEvaluation/Admin/AdminAuthGuard";

export default function GuardianEvaluationAdminLayout({ children }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
