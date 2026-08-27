import { shubukan_api } from "@/config";

function base64ToPdfBlob(base64) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  return new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
}

// role: "admin" | "instructor" | "guardian"
export async function downloadFormPdfByRole(role, formId, headers, filename = "evaluation-form.pdf") {
  const res = await shubukan_api.get(`/${role}/evaluation-form/${formId}/pdf`, { headers });
  const { base64, filename: serverFilename } = res.data;
  const blob = base64ToPdfBlob(base64);

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", serverFilename || filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Fetches the PDF and returns an in-page blob: URL for it (caller owns the
// URL and must window.URL.revokeObjectURL it once done — e.g. on modal close).
// Used by every "View" button to show the PDF inline via PdfViewerModal.
// role: "admin" | "instructor" | "guardian"
export async function getFormPdfBlobUrl(role, formId, headers) {
  const res = await shubukan_api.get(`/${role}/evaluation-form/${formId}/pdf`, { headers });
  const blob = base64ToPdfBlob(res.data.base64);
  return window.URL.createObjectURL(blob);
}