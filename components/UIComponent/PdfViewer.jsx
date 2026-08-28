import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "./PdfViewer.scss";
import { isDesktop } from "react-device-detect";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfUrl, filename }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    // A blob: URL has no real path to extract a name from, so an explicit
    // filename must be passed in that case - falls back to the old
    // URL-derived behavior for plain file/http(s) URLs.
    link.download = filename || pdfUrl.split("/").pop();
    link.click();
  };

  return (
    <div className="PDiv">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={isDesktop ? 2 : 1}
          />
        ))}
      </Document>

      {pdfUrl && (
        <div className="BtnDiv">
          <button className="button-54" role="button" onClick={handleDownload}>
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
