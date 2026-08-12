import { shubukan_api } from "@/config";

// role: "admin" | "instructor" | "guardian"
export async function downloadFormPdfByRole(role, formId, headers, filename = "evaluation-form.pdf") {
  const res = await shubukan_api.get(`/${role}/evaluation-form/${formId}/pdf`, { headers });
  const { base64, filename: serverFilename } = res.data;

  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", serverFilename || filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}