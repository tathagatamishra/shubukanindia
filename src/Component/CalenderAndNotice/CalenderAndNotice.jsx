import { useEffect, useState } from "react";
import "./CalenderAndNotice.scss";
import pdfURL_nanak from "../../Documents/Marksheet nanak.pdf";
import pdfURL_prasanta from "../../Documents/Prasen Academy Marksheet.pdf";
import PdfViewer from "../UIComponent/PdfViewer";

export default function CalenderAndNotice() {
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
    if (uniqueCode === "karatenanak@2024") {
      setURL(pdfURL_nanak);
    } 
    if (uniqueCode === "karateprasanta@2024") {
      setURL(pdfURL_prasanta);
    } 
    
  }, [uniqueCode]);

  return (
    <div className="CalenderAndNotice">
      {/* <section className="Calender-Hero">
          <h1>Calender</h1>
          <p>Discovering the Way of Words</p>
      </section> */}

      <section className="Notice-Hero">
        <h1>Notice</h1>
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
        <p>Enter the code below to view your marksheet, to download scroll down and click the download button</p>

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
