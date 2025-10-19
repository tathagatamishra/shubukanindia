// components/Exam/Instructor/Papers/Papers.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shubukan_api } from "@/config";
import Loader from "@/components/UIComponent/Loader/Loader";
import ExamBtn from "../../UI/ExamBtn";

export default function Papers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [papers, setPapers] = useState([]);
  const [count, setCount] = useState(0);
  const [kyu, setKyu] = useState(searchParams.get("kyu") || "");
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") || "");
  const [loading, setLoading] = useState(true);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPapers, setSelectedPaper] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      // const params = {};
      // if (kyu) params.kyu = kyu;
      // if (fromDate) params.fromDate = fromDate;
      // if (toDate) params.toDate = toDate;
      const res = await shubukan_api.get("/instructor/answers", {
        // params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
        },
      });
      console.log(res.data.answerSheets);
      setCount(res.data.count);
      setPapers(res.data.answerSheets || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load papers");
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
    setSelectedPaper(res);
    setIsModalOpen(true);
    // Optionally lock scrolling
    document.body.style.overflow = "hidden";
  };

  const closeAnswerSheet = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="ExamChild w-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">{`Question Papers (${count})`}</label>

      {/* <div className="flex gap-2 mb-4">
        <input
          placeholder="kyu"
          value={kyu}
          onChange={(e) => setKyu(e.target.value)}
          className="border p-2 rounded w-24"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          className="px-3 py-1 bg-black text-white rounded"
          onClick={fetchPapers}
        >
          Filter
        </button>
      </div> */}

      {loading ? (
        <Loader loading={loading} />
      ) : papers.length === 0 ? (
        <p className="text-[14px] text-gray-500">
          No papers found for the selected filters
        </p>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-[32px]">
          {papers.map((p, i) => (
            <div
              key={i}
              className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] shadow-md border !rounded-[40px]"
            >
              <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] pb-[8px]">
                <label className="font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                  Exam Date
                </label>
                <p className="text-[13px] sm:text-[14px] text-[#334155]">
                  {formatExamDate(p?.examDate)}
                </p>
              </div>

              <div className="w-full flex flex-col">
                {[
                  { label: "Kyu", data: p.kyu ?? "N/A" },
                  { label: "Exam Set", data: p.examSet ?? "N/A" },
                  { label: "Exam ID", data: p.examID ?? "N/A" },
                  {
                    label: "Exam Duration",
                    data: p.examDuration ?? "N/A",
                  },
                  {
                    label: "Total Questions Count",
                    data: p.totalQuestionCount ?? "N/A",
                  },
                  {
                    label: "Total Marks",
                    data: p.totalMarks,
                  },
                  {
                    label: "Each Question Marks",
                    data: p.eachQuestionMarks,
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
                    onClick={() => openAnswerSheet(p)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedPapers && (
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
                <p className="text-[14px] text-[#334155]">{`${
                  selectedPapers.examID || "N/A"
                } (Set ${selectedPapers.examSet || "N/A"})`}</p>
              </div>

              <ExamBtn text="Close" size="w-fit" onClick={closeAnswerSheet} />
            </div>

            {/* Questions list */}
            <div className="w-full flex flex-col gap-3">
              {(selectedPapers.questions || []).map((q, qIdx) => {
                const correctIdx = q.correctAnswer ?? q.answer;
                const studentSel = q.studentSelected ?? null;

                return (
                  <div
                    key={q._id || qIdx}
                    className="p-4 border border-dashed rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[13px] sm:text-[15px] font-[600] text-[#334155]">{`Q${
                        qIdx + 1
                      }. ${q.question}`}</div>
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
    </div>
  );
}
