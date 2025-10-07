"use client";
import { useState, useEffect } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import SlidingNumber from "../UIComponent/SlidingNumber";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({
    question: "",
    options: ["", ""], // require at least 2 options now
    answer: 0,
    questionSet: 1,
  });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Edit modal state
  const [editId, setEditId] = useState(null);
  const [editQ, setEditQ] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const now = () => new Date();

  // Determine if a question is editable according to backend rules:
  // - Not editable if used in any scheduled exam (examDate exists and in future) or used in any past exam (examDate exists and in past).
  // - Editable if no usedInExams entries, or all usedInExams entries have examDate === null/undefined (public on-demand).
  const isEditable = (q) => {
    if (!q.usedInExams || q.usedInExams.length === 0) return true;
    for (const ue of q.usedInExams) {
      // ue.examDate may be null or missing for public-on-demand
      if (ue.examDate) {
        const d = new Date(ue.examDate);
        if (d <= now()) return false; // used in past
        if (d > now()) return false; // used in upcoming scheduled
      }
      // if no examDate => public-on-demand -> allowed
    }
    return true;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addQuestion = async () => {
    // validation
    const payloadOptions = newQ.options
      .map((o) => o.trim())
      .filter((o) => o !== "");
    if (payloadOptions.length < 2) {
      return alert("Please provide at least 2 options.");
    }
    const answerIdx = parseInt(newQ.answer, 10);
    if (
      isNaN(answerIdx) ||
      answerIdx < 0 ||
      answerIdx >= payloadOptions.length
    ) {
      return alert("Answer index is invalid for the provided options.");
    }

    const payload = {
      question: newQ.question.trim(),
      options: payloadOptions,
      answer: answerIdx,
      questionSet: newQ.questionSet || 1,
    };

    try {
      await shubukan_api.post("/admin/question", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewQ({ question: "", options: ["", ""], answer: 0, questionSet: 1 });
      fetchQuestions();
    } catch (err) {
      console.error("Add question failed", err);
      alert(err.response?.data?.message || "Add failed");
    }
  };

  const deleteQ = async (id) => {
    try {
      await shubukan_api.delete(`/admin/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Open edit modal and prepare state
  const openEdit = (q) => {
    setEditId(q._id);
    setEditQ({
      question: q.question,
      options: q.options.length ? [...q.options] : ["", ""],
      answer: q.answer,
      questionSet: q.questionSet ?? 1,
    });
  };

  const closeEdit = () => {
    setEditId(null);
    setEditQ(null);
    setSavingEdit(false);
  };

  const saveEdit = async () => {
    if (!editQ) return;
    const payloadOptions = editQ.options
      .map((o) => o.trim())
      .filter((o) => o !== "");
    if (payloadOptions.length < 2) {
      return alert("Please provide at least 2 options.");
    }
    const answerIdx = parseInt(editQ.answer, 10);
    if (
      isNaN(answerIdx) ||
      answerIdx < 0 ||
      answerIdx >= payloadOptions.length
    ) {
      return alert("Answer index is invalid for the provided options.");
    }
    const payload = {
      question: editQ.question.trim(),
      options: payloadOptions,
      answer: answerIdx,
      questionSet: editQ.questionSet || 1,
    };

    try {
      setSavingEdit(true);
      await shubukan_api.put(`/admin/question/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeEdit();
      fetchQuestions();
    } catch (err) {
      console.error("Edit failed", err);
      alert(err.response?.data?.message || "Save failed");
      setSavingEdit(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString("en-IN");
    } catch {
      return d;
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between ">
        <h2 className="text-xl font-bold mb-4">Questions</h2>

        <div className="flex items-center bg-white px-4 rounded-xl shadow mb-[14px]">
          {/* <p className="text-[14px] font-[600] text-[#64748B]">
            Total Questions &nbsp;&nbsp;
          </p> */}
          <SlidingNumber value={questions.length} />
        </div>
      </div>

      {/* Create Question */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-2">
        <input
          placeholder="Question"
          value={newQ.question}
          onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
          className="border p-2 rounded"
        />

        {/* Dynamic Options */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Options</label>
          {newQ.options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                placeholder={`Option ${idx}`}
                value={opt}
                onChange={(e) => {
                  const updated = [...newQ.options];
                  updated[idx] = e.target.value;
                  setNewQ({ ...newQ, options: updated });
                }}
                className="border p-2 rounded flex-1"
              />
              <button
                onClick={() =>
                  setNewQ({
                    ...newQ,
                    options: newQ.options.filter((_, i) => i !== idx),
                  })
                }
                className="text-red-500 border rounded w-[40px] flex items-center justify-center"
                disabled={newQ.options.length === 2} // keep at least 2 now
                title={
                  newQ.options.length === 2
                    ? "At least 2 options required"
                    : "Remove option"
                }
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            onClick={() => setNewQ({ ...newQ, options: [...newQ.options, ""] })}
            className="text-blue-500 flex items-center gap-1"
          >
            <FiPlus /> Add Option
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Correct Option</label>
          <input
            placeholder="Correct answer index (0,1,2..)"
            type="number"
            value={newQ.answer}
            min={0}
            onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
            className="border p-2 rounded"
          />
          <label className="italic text-sm">
            Options start from number 0 then 1, 2, 3 ...
          </label>
        </div>

        {/* <div className="flex gap-2 items-center">
          <label className="font-semibold">Question Set</label>
          <input
            type="number"
            value={newQ.questionSet}
            min={1}
            onChange={(e) =>
              setNewQ({
                ...newQ,
                questionSet: parseInt(e.target.value || "1", 10),
              })
            }
            className="border p-2 rounded w-[80px]"
          />
        </div> */}

        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> Add Question
        </button>
      </div>

      {/* List Questions */}
      {loading ? (
        <div className="flex justify-center items-center h-[30vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-gray-500 text-center">No questions available</div>
      ) : (
        <div className="flex flex-col gap-4 text-[11px] sm:text-[16px]">
          {questions.map((q) => {
            const editable = isEditable(q);
            return (
              <div
                key={q._id}
                className="relative hover:bg-[#f9fcff] bg-white shadow rounded-xl p-2 sm:p-4 flex flex-col w-full"
              >
                <p className="absolute top-[-6px] left-[-6px] flex items-center justify-center w-fit h-fit min-w-[20px] min-h-[20px] sm:min-w-[30px] sm:min-h-[30px] px-[8px] rounded-full text-white bg-blue-500">
                  {q.questionID}
                </p>

                {/* Used badge */}
                <span
                  className={`absolute top-[-6px] right-[-6px] px-2 py-1 rounded sm:text-sm font-medium ${
                    q.used
                      ? "bg-red-100 text-red-700 border"
                      : "bg-green-100 text-green-700 border"
                  }`}
                >
                  {q.used ? "Used" : "Unused"}
                </span>

                {/* Label column */}
                <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                  <p className="min-w-[40px] sm:min-w-[65px]">Question</p>
                  <div className="w-full h-fit ml-[10px] p-[12px] border-l border-dashed border-[#334155]">
                    {q.question}
                  </div>
                </div>

                <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                  <p className="min-w-[40px] sm:min-w-[65px]">Options</p>
                  <div className="h-fit ml-[10px] p-[12px] border-l border-dashed border-[#334155] flex flex-wrap gap-2">
                    {q.options.map((opt, n) => (
                      <p
                        key={n}
                        className={`border-1 ${
                          n === q.answer
                            ? "border-green-400 bg-green-100 font-[600]"
                            : "border-blue-400"
                        } rounded h-fit px-2 pb-1`}
                      >
                        {opt}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Used in exams */}
                <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                  <p className="min-w-[40px] sm:min-w-[65px]">Used In</p>
                  <div className="h-fit ml-[10px] p-[12px] border-l border-dashed border-[#334155] flex flex-wrap gap-2 w-full">
                    {!q.usedInExams || q.usedInExams.length === 0 ? (
                      <span className="sm:text-sm text-gray-500">
                        Not used in any exam
                      </span>
                    ) : (
                      q.usedInExams.map((ue, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 text-[9px] sm:text-[11px]"
                        >
                          <div className="px-2 py-1 bg-gray-100 rounded">
                            <strong>
                              {ue.examID ?? (ue.exam && ue.exam.examID) ?? "—"}
                            </strong>
                            {typeof ue.examSet !== "undefined" && (
                              <span> · Set {ue.examSet} · </span>
                            )}
                            <span>
                              {ue.accessability ??
                                (ue.exam && ue.exam.accessability) ??
                                ""}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex flex-row items-center w-full h-fit border-dashed border-[#334155]">
                  <p className="min-w-[40px] sm:min-w-[65px]">Actions</p>
                  <div className="sm:h-[50px] w-full ml-[10px] p-[12px] border-l border-dashed border-[#334155] flex gap-2">
                    <button
                      onClick={() => openEdit(q)}
                      className={`text-blue-600 w-full max-w-[125px] h-full flex justify-center items-center gap-2 border-2 rounded font-[600] ${
                        !editable ? "opacity-20 cursor-not-allowed" : ""
                      }`}
                      disabled={!editable}
                      title={
                        !editable
                          ? "Cannot edit question used in past or upcoming scheduled exams"
                          : "Edit question"
                      }
                    >
                      <FiEdit /> Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(q._id)}
                      className={`text-red-500 w-full max-w-[125px] h-full flex justify-center items-center gap-2 border-2 rounded font-[600] ${
                        q.used ? "opacity-20 cursor-not-allowed" : ""
                      }`}
                      disabled={q.used}
                      title={
                        q.used
                          ? "Cannot delete question used in any exam"
                          : "Delete question"
                      }
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this question? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteQ(deleteId);
                  setDeleteId(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && editQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Edit Question #
                {questions.find((q) => q._id === editId)?.questionID}
              </h3>
              <button onClick={closeEdit} className="text-gray-600">
                <FiX />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <label className="font-semibold">Question</label>
              <input
                value={editQ.question}
                onChange={(e) =>
                  setEditQ({ ...editQ, question: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="font-semibold">Options</label>
              {editQ.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={opt}
                    onChange={(e) => {
                      const updated = [...editQ.options];
                      updated[idx] = e.target.value;
                      setEditQ({ ...editQ, options: updated });
                    }}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    onClick={() =>
                      setEditQ({
                        ...editQ,
                        options: editQ.options.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-red-500 border rounded w-[40px] flex items-center justify-center"
                    disabled={editQ.options.length === 2}
                    title={
                      editQ.options.length === 2
                        ? "At least 2 options required"
                        : "Remove option"
                    }
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setEditQ({ ...editQ, options: [...editQ.options, ""] })
                }
                className="text-blue-500 flex items-center gap-1"
              >
                <FiPlus /> Add Option
              </button>

              <div className="flex gap-4 items-center mt-2">
                <div className="flex-1">
                  <label className="font-semibold">
                    Correct Option (index)
                  </label>
                  <input
                    type="number"
                    value={editQ.answer}
                    min={0}
                    onChange={(e) =>
                      setEditQ({ ...editQ, answer: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* <div className="w-[140px]">
                  <label className="font-semibold">Question Set</label>
                  <input
                    type="number"
                    value={editQ.questionSet}
                    min={1}
                    onChange={(e) =>
                      setEditQ({
                        ...editQ,
                        questionSet: parseInt(e.target.value || "1", 10),
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div> */}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeEdit}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
