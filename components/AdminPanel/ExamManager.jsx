// components/AdminPanel/ExamManager.jsx
"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ExamManager() {
  const [exams, setExams] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [questions, setQuestions] = useState([]);
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
    examSet: 1, // 🔹 add this
  });
  const [editingId, setEditingId] = useState(null);

  // ---------------- Fetch Data ----------------
  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/exams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.error("Fetch exams error:", err.response?.data || err.message);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await shubukan_api.get("/instructors");
      setInstructors(res.data.instructors || []);
    } catch (err) {
      console.error(
        "Fetch instructors error:",
        err.response?.data || err.message
      );
    }
  };

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error(
        "Fetch questions error:",
        err.response?.data || err.message
      );
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
      questions: exam.questions.map((q) => q._id),
      password: exam.password || "",
      instructorId: exam.instructorId || "",
      instructorName: exam.instructorName || "",
      kyu: exam.kyu || "",
      examSet: exam.examSet || 1, // 🔹 add this
    });

    setEditingId(exam._id);
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
      examSet: 1, // 🔹 make sure this is always set
    });
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    fetchExams();
    fetchInstructors();
    fetchQuestions();
  }, []);

  // ---------------- UI ----------------
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Exams</h2>

      {/* Exam Form */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="font-medium">Exam Date & Time</span>
          <DatePicker
            selected={form.examDate ? new Date(form.examDate) : null}
            onChange={(date) => setForm({ ...form, examDate: date })}
            showTimeSelect
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
            value={form.examSet ?? 1} // ensures not undefined
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
              setForm({ ...form, examDuration: +e.target.value })
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
              setForm({ ...form, eachQuestionMarks: +e.target.value })
            }
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Accessability</span>
          <select
            value={form.accessability}
            onChange={(e) =>
              setForm({ ...form, accessability: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="public">Public</option>
            <option value="instructor">Instructor</option>
            <option value="allInstructors">All Instructors</option>
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Password (optional)</span>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        {/* Instructor selector */}
        <label className="flex flex-col">
          <span className="font-medium">Instructor</span>
          <select
            value={form.instructorId}
            onChange={(e) => {
              const iid = e.target.value;
              const ins = instructors.find((i) => i.instructorId === iid);
              setForm({
                ...form,
                instructorId: iid,
                instructorName: ins?.name || "",
              });
            }}
            className="border p-2 rounded"
          >
            <option value="">-- Select Instructor --</option>
            {instructors.map((ins) => (
              <option key={ins._id} value={ins.instructorId}>
                {ins.name} ({ins.instructorId})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="font-medium">Kyu (optional)</span>
          <input
            type="number"
            value={form.kyu}
            onChange={(e) => setForm({ ...form, kyu: e.target.value })}
            className="border p-2 rounded"
          />
        </label>

        {/* Questions list */}
        <label className="flex flex-col">
          <span className="font-medium">Select Questions</span>
          <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-2">
            {questions.map((q) => (
              <div key={q._id} className="border p-2 rounded">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={form.questions.includes(q._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({
                          ...form,
                          questions: [...form.questions, q._id],
                        });
                      } else {
                        setForm({
                          ...form,
                          questions: form.questions.filter(
                            (id) => id !== q._id
                          ),
                        });
                      }
                    }}
                  />
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <ul className="list-disc pl-5">
                      {q.options.map((opt, idx) => (
                        <li
                          key={idx}
                          className={
                            idx === q.answer
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
            ))}
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

      {/* Exams Table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2">Exam ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Set</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Access</th>
              <th className="p-2">Questions</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((ex) => (
              <tr key={ex._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{ex.examID}</td>
                <td className="p-2">
                  {new Date(ex.examDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  {" - "}
                  {new Date(ex.examDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-2">{ex.examSet}</td>
                <td className="p-2">{ex.examDuration} min</td>
                <td className="p-2">{ex.accessability}</td>
                <td className="p-2">{ex.totalQuestionCount}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => editExam(ex)}
                    className="text-blue-500"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteExam(ex._id)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
