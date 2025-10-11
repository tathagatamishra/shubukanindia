// components/AdminPanel/ExamManager.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSave,
  FiX,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ExamManager() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const [form, setForm] = useState({
    examDate: "",
    examDuration: 60,
    eachQuestionMarks: 1,
    accessability: "public",
    questions: [],
    password: "",
    instructorId: "",
    instructorName: "",
    kyu: "",
    examSet: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState({ id: null, type: null });
  const [loading, setLoading] = useState(false);

  // Normalize IDs to strings to avoid reference/type mismatches
  const normalizeQuestions = (raw = []) =>
    raw.map((q) => ({ ...q, _id: String(q._id) }));

  // ---------------- Fetch Data ----------------
  const fetchExams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.error("Fetch exams error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/instructors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors(res.data.instructors || []);
    } catch (err) {
      console.error(
        "Fetch instructors error:",
        err.response?.data || err.message
      );
      err.response?.data.error == "Invalid or expired token" &&
        router.push("/admin/login");
    }
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ensure _id are strings
      setQuestions(normalizeQuestions(res.data || []));
    } catch (err) {
      console.error(
        "Fetch questions error:",
        err.response?.data || err.message
      );
      err.response?.data.error == "Invalid or expired token" &&
        router.push("/admin/login");
    }
  };

  // ---------------- CRUD ----------------
  const createExam = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.post("/admin/exam", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const updateExam = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.put(`/admin/exam/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      setEditingId(null);
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const deleteExam = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await shubukan_api.delete(`/admin/exam/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const editExam = (exam) => {
    setForm({
      examDate: exam.examDate,
      examDuration: exam.examDuration,
      eachQuestionMarks: exam.eachQuestionMarks,
      accessability: exam.accessability,
      // normalize to string ids
      questions: (exam.questions || []).map((q) => String(q._id)),
      password: exam.password || "",
      instructorId: exam.instructorId || "",
      instructorName: exam.instructorName || "",
      kyu: exam.kyu || "",
      examSet: exam.examSet || 1,
    });

    setEditingId(exam._id);
    // scroll to form or focus could be added here
  };

  const resetForm = () => {
    setForm({
      examDate: "",
      examDuration: 60,
      eachQuestionMarks: 1,
      accessability: "public",
      questions: [],
      password: "",
      instructorId: "",
      instructorName: "",
      kyu: "",
      examSet: 1,
    });
  };

  // ✅ Copy to clipboard
  const handleCopy = (text, id, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ id, type });
    setTimeout(() => setCopied({ id: null, type: null }), 2000);
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    fetchExams();
    fetchInstructors();
    fetchQuestions();
  }, []);

  // ---------------- Question selection helpers ----------------
  const toggleQuestion = (id, checked) => {
    // Always use functional update to avoid stale closures
    setForm((prev) => {
      if (checked) {
        // avoid duplicates
        if (prev.questions.includes(id)) return prev;
        return { ...prev, questions: [...prev.questions, id] };
      } else {
        return { ...prev, questions: prev.questions.filter((i) => i !== id) };
      }
    });
  };

  const selectAllVisible = () => {
    const visibleIds = filteredQuestions.map((q) => q._id);
    setForm((prev) => {
      // merge unique ids
      const uniq = Array.from(new Set([...prev.questions, ...visibleIds]));
      return { ...prev, questions: uniq };
    });
  };

  const clearSelection = () => setForm((prev) => ({ ...prev, questions: [] }));

  // ---------------- Filters / UI helpers ----------------
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredQuestions = questions.filter((q) => {
    if (showOnlySelected && !form.questions.includes(q._id)) return false;
    if (!normalizedSearch) return true;
    return (
      q.question?.toLowerCase().includes(normalizedSearch) ||
      (q.options || []).some((opt) =>
        String(opt || "")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    );
  });

  const selectedCount = form.questions.length;

  // ---------------- UI ----------------
  return (
    <div className="text-[14px]">
      <h2 className="text-xl font-bold mb-4">Manage Exams</h2>

      {/* Exam Form */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="font-medium">Exam Date & Time</span>
          <DatePicker
            selected={form.examDate ? new Date(form.examDate) : null}
            onChange={(date) => setForm({ ...form, examDate: date })}
            showTimeSelect
            timeIntervals={1}
            timeFormat="hh:mm aa"
            dateFormat="hh:mm aa - EEEE, dd MMMM yyyy"
            className="border p-2 rounded w-full"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Exam Set</span>
          <input
            type="number"
            min="1"
            value={form.examSet ?? 1}
            onChange={(e) => setForm({ ...form, examSet: +e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Duration (minutes)</span>
          <input
            type="number"
            value={form.examDuration}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, examDuration: +e.target.value }))
            }
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Marks per Question</span>
          <input
            type="number"
            value={form.eachQuestionMarks}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                eachQuestionMarks: +e.target.value,
              }))
            }
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Accessability</span>
          <select
            value={form.accessability}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, accessability: e.target.value }))
            }
            className="border p-2 rounded"
          >
            <option value="public">Public</option>
            <option value="instructor">Instructor</option>
            <option value="allInstructors">All Instructors</option>
          </select>
        </label>

        {/* <label className="flex flex-col">
          <span className="font-medium">Password (optional)</span>
          <input
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            className="border p-2 rounded"
          />
        </label> */}

        {/* Instructor selector */}
        <label className="flex flex-col">
          <span className="font-medium">Instructor</span>
          <select
            value={
              form.instructorId
                ? JSON.stringify({
                    _id: form.instructorId,
                    name: form.instructorName,
                  })
                : ""
            }
            onChange={(e) => {
              if (!e.target.value) {
                setForm((prev) => ({
                  ...prev,
                  instructorId: "",
                  instructorName: "",
                }));
                return;
              }
              const { _id, name } = JSON.parse(e.target.value);
              setForm((prev) => ({
                ...prev,
                instructorId: _id,
                instructorName: name,
              }));
            }}
            className="border p-2 rounded"
          >
            <option value="">-- Select Instructor --</option>
            {instructors.map((ins) => (
              <option
                key={ins._id}
                value={JSON.stringify({ _id: ins._id, name: ins.name })}
              >
                {ins.name} ({ins.identity})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Kyu (optional)</span>
          <input
            type="number"
            value={form.kyu}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, kyu: e.target.value }))
            }
            className="border p-2 rounded"
          />
        </label>

        {/* Questions list with improved UX */}
        <label className="flex flex-col mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <span className="font-medium flex items-center justify-between gap-2 min-w-fit w-full sm:w-fit">
                Selected Questions{" "}
                <span className="min-w-fit text-sm text-white bg-blue-500 rounded px-2 py-[3px]">
                  {selectedCount}
                </span>
              </span>
              <span className="sm:w-full"></span>

              <button
                type="button"
                onClick={clearSelection}
                className="min-w-fit px-2 py-1 rounded border text-sm"
                title="Clear all selected"
              >
                Clear all selected questions
              </button>

              <button
                type="button"
                onClick={() => setShowOnlySelected((s) => !s)}
                className={`min-w-fit px-2 py-1 rounded border text-sm ${
                  showOnlySelected ? "bg-blue-50" : ""
                }`}
                title="Toggle show only selected"
              >
                {showOnlySelected ? "Showing: Selected" : "Show only selected"}
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium">Search a question</label>

              <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2">
                <input
                  placeholder="Search questions or options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border p-2 rounded text-sm w-full"
                  style={{ minWidth: 220 }}
                />

                <button
                  type="button"
                  onClick={selectAllVisible}
                  className="min-w-fit w-full sm:w-fit px-2 py-1 rounded border text-sm"
                  title="Select all visible questions"
                >
                  Select all visible
                </button>
              </div>
            </div>
          </div>

          <div
            className="min-h-64 max-h-[480px] max-w-full overflow-y-auto border rounded p-2 space-y-2 mt-2"
            style={{ resize: "vertical" }}
          >
            {filteredQuestions.length === 0 ? (
              <div className="text-gray-500 text-sm">No questions found</div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isSelected = form.questions.includes(q._id);
                return (
                  <div
                    key={`${q._id}-${idx}`}
                    className={`border p-2 rounded text-[14px] ${
                      isSelected ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-2"
                        value={q._id}
                        checked={isSelected}
                        onChange={(e) =>
                          toggleQuestion(q._id, e.target.checked)
                        }
                        aria-checked={isSelected}
                      />
                      <div>
                        <p className="font-medium break-normal">{q.question}</p>
                        <ul className="list-disc pl-5">
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              className={
                                i === q.answer
                                  ? "text-green-600 font-semibold"
                                  : ""
                              }
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </label>

        {/* Action buttons */}
        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={updateExam}
                className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-1"
              >
                <FiSave /> Save
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                }}
                className="bg-gray-400 text-white px-3 py-2 rounded flex items-center gap-1"
              >
                <FiX /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={createExam}
              className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FiPlus /> Create Exam
            </button>
          )}
        </div>
      </div>

      {/* Exams List (unchanged from original) */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="text-gray-500 text-center">No exams available</div>
        ) : (
          exams.map((ex) => (
            <div
              key={ex._id}
              className="hover:!outline-[#64748B] hover:!outline-2 bg-white shadow rounded-xl p-4 flex flex-col w-full"
            >
              {/* (rest of your exams rendering unchanged) */}
              <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Exam ID</p>
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  <button
                    onClick={() => handleCopy(ex.examID, ex._id, "id")}
                    className="text-blue-500 hover:text-blue-700 text-[14px] sm:text-[16px] font-[700] flex flex-row items-center gap-4"
                    style={{ letterSpacing: "4px" }}
                    title="Copy Exam ID"
                  >
                    {ex.examID}
                    {copied.id === ex._id && copied.type === "id" ? (
                      <FiCheck />
                    ) : (
                      <FiCopy />
                    )}
                  </button>
                </div>
              </div>

              {/* <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Password</p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  {ex.password ? (
                    <button
                      onClick={() =>
                        handleCopy(ex.password, ex._id, "password")
                      }
                      className="text-red-500 hover:text-red-700 text-[14px] sm:text-[16px] font-[700] flex flex-row items-center gap-4"
                      style={{ letterSpacing: "4px" }}
                      title="Copy Password"
                    >
                      {ex.password}
                      {copied.id === ex._id && copied.type === "password" ? (
                        <FiCheck />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No Password</span>
                  )}
                </div>
              </div> */}
              <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Date</p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  {ex.examDate ? (
                    <>
                      {new Date(ex.examDate).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(ex.examDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </>
                  ) : (
                    "Available anytime"
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Set</p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  {ex.examSet}
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Duration</p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  {ex.examDuration} min
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Access</p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  {ex.accessability}
                </div>
              </div>
              <div className="flex flex-row w-full h-fit min-h-[20px] border-b border-dashed border-[#334155]">
                <p className="min-w-[78px] pt-[5px] sm:pt-[10px] pr-2 sm:pr-4">
                  Questions
                </p>{" "}
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155]">
                  Total Question - {ex.totalQuestionCount}
                  <ol className="list-decimal ml-5 text-[11px]">
                    {ex.questions.map((q, i) => (
                      <li
                        key={i}
                        className={`${
                          i < ex.questions.length - 1 &&
                          "border-b border-dashed border-[#33415535]"
                        }`}
                      >
                        <span>{q.question}</span>
                        <ul>
                          <li>- {q.options[q.answer]} </li>
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex flex-row items-center w-full h-fit min-h-[20px]">
                <p className="min-w-[78px] pr-2 sm:pr-4">Actions</p>
                <div className="w-full h-fit min-h-[20px] sm:ml-[10px] p-[5px] sm:p-[10px] border-l border-dashed border-[#334155] flex gap-2">
                  <button
                    onClick={() => editExam(ex)}
                    className="text-blue-500 h-full w-full max-w-[125px] flex justify-center items-center gap-2 border-2 rounded font-[600]"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => deleteExam(ex._id)}
                    className="text-red-500 h-full w-full max-w-[125px] flex justify-center items-center gap-2 border-2 rounded font-[600]"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Values */}
              <div className="w-full text-[12px] sm:text-[16px]">
                {/* Actions */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
