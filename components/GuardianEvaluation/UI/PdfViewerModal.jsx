"use client";
import React from "react";
import Modal from "./Modal";
import PdfViewer from "@/components/UIComponent/PdfViewer";

// Embeds the evaluation form PDF right in the page (via the shared PdfViewer)
// instead of forcing a new-tab open. `pdfUrl` is expected to be a blob: URL -
// see getFormPdfBlobUrl in ./downloadPdf.js - which the caller owns and must
// revoke on close.
export default function PdfViewerModal({ open, onClose, pdfUrl, title = "Evaluation Form", filename }) {
  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      {pdfUrl ? (
        <PdfViewer pdfUrl={pdfUrl} filename={filename} />
      ) : (
        <p className="gef-hint">Loading PDF...</p>
      )}
    </Modal>
  );
}
