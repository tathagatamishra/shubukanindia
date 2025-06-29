import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "./PdfViewer.scss";
import { isDesktop } from "react-device-detect";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop(); // Extract the file name from the URL
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
