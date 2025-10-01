// Exam/UI/ExamBtn.jsx
import React from "react";
import "./ExamBtn.css";

export default function ExamBtn({
  text = "Click Here",
  fontstyle = "text-[#2A2727] font-[600] text-[14px] sm:text-[16px]",
  size = "w-[150px] h-auto",
  padding = "px-[18px] sm:px-[25px] py-[10px]",
  border = "2px solid #88807E",
  cssClass = "ExamBtn btn corner-shape",
  className = "",
  value = "",
  type = "",
  form = "",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      form={form}
      value={value}
      disabled={disabled}
      onClick={onClick}
      style={{
        border: `${border}`,
      }}
      className={`${cssClass} ${className} ${padding} ${size} ${fontstyle}`}
    >
      {text}
    </button>
  );
}
