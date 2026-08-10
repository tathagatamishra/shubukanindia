"use client";
import React, { useState } from "react";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { uploadSignatureImage } from "../UI/uploadSignature";
import { Field } from "../UI/FormFields";

export default function SignatureUpload({ label, value, onChange }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, publicId } = await uploadSignatureImage(file, authHeader);
      onChange({ url, publicId });
      addToast("Signature uploaded", "success");
    } catch (err) {
      addToast(err.message || "Signature upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint="Upload a clear photo or scan of the signature">
      {value?.url ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={value.url} alt="signature" style={{ height: 48, background: "#fff", borderRadius: 6, border: "1px solid var(--gef-line)" }} />
          <label className="gef-btn gef-btn--outline gef-btn--sm" style={{ cursor: "pointer" }}>
            {uploading ? "Uploading..." : "Replace"}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
        </div>
      ) : (
        <label className="gef-btn gef-btn--outline gef-btn--block" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Upload Signature Image"}
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
      )}
    </Field>
  );
}
