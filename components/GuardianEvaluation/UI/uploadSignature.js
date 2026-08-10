import { shubukan_api } from "@/config";

// Fetches a Cloudinary signature from the backend, then uploads the file
// directly to Cloudinary. Returns { url, publicId }.
export async function uploadSignatureImage(file, authHeader) {
  const sigRes = await shubukan_api.post("/guardian/signature/upload-signature", {}, { headers: authHeader });
  const { signature, timestamp, apiKey, cloudName } = sigRes.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", "Shubukan/GuardianSignature");

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(data.error?.message || "Signature upload failed");

  return { url: data.secure_url, publicId: data.public_id };
}
