import React from "react";
import "./ExamBtn.css";

export default function ExamBtn({
  text = "Click Here",
  fontstyle = "text-[#2A2727] font-[600]",
  size = "w-[150px] h-auto",
  padding = "px-[25px] py-[10px]",
  border = "2px solid #88807E",
  cssClass = "ExamBtn btn corner-shape",
  className = "",
  onClick,
}) {
  return (
    <button
      className={`${cssClass} ${className} ${padding} ${size} ${fontstyle}`}
      style={{
        border: `${border}`,
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
