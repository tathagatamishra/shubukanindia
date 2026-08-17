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

// Opens the PDF in a new tab for viewing, instead of forcing a download.
// role: "admin" | "instructor" | "guardian"
export async function viewFormPdfByRole(role, formId, headers) {
  const res = await shubukan_api.get(`/${role}/evaluation-form/${formId}/pdf`, { headers });
  const { base64 } = res.data;
  const blob = base64ToPdfBlob(base64);

  const url = window.URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    window.URL.revokeObjectURL(url);
    throw new Error("Popup blocked — please allow popups for this site to view the PDF.");
  }
  // Give the new tab time to load the blob before releasing it.
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
}