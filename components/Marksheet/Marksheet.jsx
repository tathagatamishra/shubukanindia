"use client";
import { useEffect, useState } from "react";
import "./Marksheet.scss";
import pdfURL_nanak from "../../Documents/Marksheet nanak.pdf";
import pdfURL_prasanta from "../../Documents/Prasen Academy Marksheet.pdf";
import pdfURL_smaa from "../../Documents/SMAA Marksheet.pdf";
import pdfURL_fmaa from "../../Documents/Fudoshin Martial Arts Academy Marksheet.pdf";
import pdfURL_udi from "../../Documents/Uema Dojo India Marksheet.pdf";

import PdfViewer from "../UIComponent/PdfViewer";

export default function Marksheet() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const [uniqueCode, setUniqueCode] = useState("");
  const [URL, setURL] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setUniqueCode(value.toLowerCase());
  };

  useEffect(() => {
    if (uniqueCode === "rmaa@2024") {
      setURL(pdfURL_nanak);
    }
    if (uniqueCode === "pka@2024") {
      setURL(pdfURL_prasanta);
    }
    if (uniqueCode === "smaa@2025") {
      setURL(pdfURL_smaa);
    }
    if (uniqueCode === "fmaa@2025") {
      setURL(pdfURL_fmaa);
    }
    if (uniqueCode === "udi@2025") {
      setURL(pdfURL_udi);
    }
  }, [uniqueCode]);

  return (
    <div className="Marksheet">
      {/* <section className="Calender-Hero">
          <h1>Calender</h1>
          <p>Discovering the Way of Words</p>
      </section> */}

      <section className="Marksheet-Hero">
        <p className="heading">Marksheet</p>
        {/* <p>Discovering the Way of Words</p> */}
        <div className="underline"></div>
      </section>

      <section className="data">
        <p>Dear Students,</p>
        <p>
          We are pleased to inform you that the examination results have been
          released. To check your marksheet, Obtain your unique code from your
          instructor.
        </p>
        <p>
          Enter the code below to view your marksheet, to download scroll down
          and click the download button
        </p>

        <input
          type="text"
          value={uniqueCode}
          onChange={handleChange}
          placeholder="Enter code..."
        />
      </section>

      <PdfViewer pdfUrl={URL} />
    </div>
  );
}
