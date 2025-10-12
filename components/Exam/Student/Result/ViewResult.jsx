// Exam/Student/Result/ViewResult.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";

export default function ViewResult() {
  const [results, setResults] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await shubukan_api.get("/student/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
        console.log(token);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch results");
      }
    };
    fetchResults();
  }, []);

  function formatExamDate(dateString) {
    if (!dateString) return "N/A";
    const examDate = new Date(dateString);
    if (Number.isNaN(examDate.getTime())) return "N/A";

    const time = examDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const weekday = examDate.toLocaleDateString("en-US", { weekday: "long" });
    const day = examDate.getDate();
    const month = examDate.toLocaleDateString("en-US", { month: "long" });
    const year = examDate.getFullYear();

    return `${time}, ${weekday}, ${day} ${month} ${year}`;
  }

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-start items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        My Exam Results
      </label>

      {results.length === 0 ? (
        <p className="text-[14px] text-gray-500">No results found</p>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-[32px]">
          {results.map((res, idx) => {
            const exam = res.exam || null;
            const totalQuestions = exam?.totalQuestionCount ?? null;
            const totalMarks = exam?.totalMarks ?? "N/A";
            const eachMarks = exam?.eachQuestionMarks ?? "N/A";

            // compute answers not selected only when totalQuestions is available
            const answersNotSelected =
              typeof totalQuestions === "number"
                ? totalQuestions -
                  ((res.correctAnsCount || 0) + (res.wrongAnsCount || 0))
                : "N/A";

            return (
              <div
                key={res._id || idx}
                className={`OnlineExam corner-shape ${
                  idx == 0 && "!border-[#ffd771]"
                } w-full h-fit flex flex-col p-[16px] shadow-md border !rounded-[40px]`}
              >
                <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] pb-[8px]">
                  <label className="font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                    Exam Date
                  </label>
                  <p className="text-[13px] sm:text-[14px] text-[#334155]">
                    {formatExamDate(exam?.examDate)}
                  </p>
                </div>

                <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] py-[8px]">
                  <label className="font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                    Submitted At
                  </label>
                  <p className="text-[13px] sm:text-[14px] text-[#334155]">
                    {formatExamDate(res.submittedAt)}
                  </p>
                </div>

                <div className="w-full flex flex-col">
                  {[
                    { label: "Kyu", data: res.kyu ?? "N/A" },
                    { label: "Exam Set", data: res.examSet ?? "N/A" },
                    { label: "Exam ID", data: res.examID ?? "N/A" },
                    {
                      label: "Total Questions Count",
                      data: totalQuestions ?? "N/A",
                    },
                    {
                      label: "Total Marks",
                      data: totalMarks,
                    },
                    {
                      label: "Each Question Marks",
                      data: eachMarks,
                    },
                    {
                      label: "Marks Obtained",
                      data: res.marksObtained ?? "N/A",
                    },
                    {
                      label: "Correct Answers Selected",
                      data: res.correctAnsCount ?? 0,
                    },
                    {
                      label: "Wrong Answers Selected",
                      data: res.wrongAnsCount ?? 0,
                    },
                    {
                      noBorder: true,
                      label: "Answers Not Selected",
                      data: answersNotSelected,
                    },
                  ].map((i, rowIdx) => (
                    <div
                      key={rowIdx}
                      className={`w-full ${
                        i.noBorder ? "" : "border-b-1"
                      } border-dashed flex flex-row items-center`}
                    >
                      <label className="w-full font-[600] text-[12px] sm:text-[14px] text-[#334155] !m-[0px] p-[8px] pl-[2px] border-r-1 border-dashed">
                        {i.label}
                      </label>
                      <p className="w-full text-center text-[13px] sm:text-[14px] text-[#334155]">
                        {i.data}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
