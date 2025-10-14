// components/Exam/Instructor/Results/Results.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [Xresults, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {};
      const studentId = searchParams.get("studentId");
      if (studentId) params.studentId = studentId;
      const res = await shubukan_api.get("/instructor/results", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
        },
      });
      setStudentName(res.data.studentName);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

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

  const openAnswerSheet = (res) => {
    setSelectedResult(res);
    setIsModalOpen(true);
    // Optionally lock scrolling
    document.body.style.overflow = "hidden";
  };

  const closeAnswerSheet = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="ExamChild w-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">{`${studentName}'s Results`}</label>

      {loading ? (
        <p className="text-[14px] text-gray-500">Loading...</p>
      ) : Xresults.length === 0 ? (
        <p className="text-[14px] text-gray-500">No results found</p>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-[32px]">
          {Xresults.map((res, idx) => {
            const exam = res.exam || null;
            const totalQuestions = exam?.totalQuestionCount ?? null;
            const totalMarks = exam?.totalMarks ?? "N/A";
            const eachMarks = exam?.eachQuestionMarks ?? "N/A";
            console.log(res);

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
                    { label: "Kyu", data: exam.kyu ?? "N/A" },
                    { label: "Exam Set", data: exam.examSet ?? "N/A" },
                    { label: "Exam ID", data: exam.examID ?? "N/A" },
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
                      // noBorder: true,
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

                  {/* Action row - View Answer Sheet button */}
                  <div className="w-full flex justify-center mt-3">
                    <ExamBtn
                      text="View Answer Sheet"
                      size="w-fit"
                      onClick={() => openAnswerSheet(res)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[20px]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeAnswerSheet}
          />
          <div className="OnlineExam ExamLayout corner-shape relative z-10 w-full max-w-[720px] max-h-[90vh] overflow-y-auto p-6 h-fit flex flex-col !rounded-[30px]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
                  Answer Sheet
                </label>
                <p className="text-[13px] text-[#334155]">{`${
                  selectedResult.exam?.examID || "N/A"
                } (Set ${selectedResult.exam?.examSet || "N/A"})`}</p>
                <p className="text-[13px] text-[#334155]">{`${studentName}`}</p>
                <p className="text-[13px] text-[#334155]">{`${selectedResult.marksObtained} out of ${selectedResult.exam.totalQuestionCount} X ${selectedResult.exam.eachQuestionMarks} = ${selectedResult.exam.totalMarks}`}</p>
              </div>

              <ExamBtn text="Close" size="w-fit" onClick={closeAnswerSheet} />
            </div>

            {/* Questions list */}
            <div className="w-full flex flex-col gap-3">
              {(selectedResult.exam?.questions || []).map((q, qIdx) => {
                const correctIdx = q.correctAnswer ?? q.answer;
                const studentSel = q.studentSelected ?? null;

                return (
                  <div
                    key={q._id || qIdx}
                    className="p-4 border border-dashed rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-[13px] sm:text-[15px] font-[600] text-[#334155]">{`Q${
                          qIdx + 1
                        }. ${q.question}`}</div>
                        {/* <div className="text-[12px] text-[#64748b] mt-1">{`Question ID: ${q._id || 'N/A'}`}</div> */}
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-[12px] text-[#334155]">{`Correct: ${
                          typeof correctIdx === "number"
                            ? String.fromCharCode(65 + correctIdx)
                            : "N/A"
                        }`}</div>
                        <div className="text-[12px] text-[#334155]">{`Selected: ${
                          typeof studentSel === "number"
                            ? String.fromCharCode(65 + studentSel)
                            : "N/A"
                        }`}</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isCorrect = correctIdx === optIdx;
                        const isSelected = studentSel === optIdx;

                        // style logic: correct -> green; selected but wrong -> red; neutral otherwise
                        let classes =
                          "w-full p-2 rounded-md text-[11px] sm:text-[13px] text-[#334155] border";
                        if (isCorrect)
                          classes += " bg-green-50 border-green-200";
                        else if (isSelected && !isCorrect)
                          classes += " bg-red-50 border-red-200";
                        else classes += " border-dashed";

                        return (
                          <div key={optIdx} className={classes}>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-[16px] sm:w-[28px] font-[700]">
                                {String.fromCharCode(65 + optIdx)}.
                              </div>
                              <div className="flex-1 text-[11px] sm:text-[13px]">
                                {opt}
                              </div>
                              {isCorrect && (
                                <div className="text-[12px] font-[700] text-green-700">
                                  Correct
                                </div>
                              )}
                              {isSelected && !isCorrect && (
                                <div className="text-[12px] font-[700] text-red-600">
                                  Selected
                                </div>
                              )}
                              {isSelected && isCorrect && (
                                <div className="text-[12px] font-[700] text-green-700">
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Loader loading={loading} />
    </div>
  );
}
