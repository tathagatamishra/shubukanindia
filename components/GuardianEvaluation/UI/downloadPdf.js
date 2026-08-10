import { shubukan_api } from "@/config";

// role: "admin" | "instructor" | "guardian"
export async function downloadFormPdfByRole(role, formId, headers, filename = "evaluation-form.pdf") {
  const res = await shubukan_api.get(`/${role}/evaluation-form/${formId}/pdf`, {
    headers,
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
