"use client";
import { useState, useEffect } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({ question: "", options: [""], answer: 0 });

  const [deleteId, setDeleteId] = useState(null);

  const fetchQuestions = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await shubukan_api.get("/admin/questions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuestions(res.data);
  };

  const addQuestion = async () => {
    const token = localStorage.getItem("adminToken");
    const payload = {
      ...newQ,
      options: newQ.options.map((o) => o.trim()).filter((o) => o !== ""),
      answer: parseInt(newQ.answer, 10),
    };
    await shubukan_api.post("/admin/question", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNewQ({ question: "", options: [""], answer: 0 });
    fetchQuestions();
  };

  const deleteQ = async (id) => {
    const token = localStorage.getItem("adminToken");
    await shubukan_api.delete(`/admin/question/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Questions</h2>

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
                className="text-red-500"
                disabled={newQ.options.length === 1} // keep at least 1
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
            onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
            className="border p-2 rounded"
          />
          <label className="italic text-sm">
            Options starts from number 0 then 1, 2, 3 ...
          </label>
        </div>

        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> Add Question
        </button>
      </div>

      {/* List Questions */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2">Question</th>
              <th className="p-2">Options</th>
              <th className="p-2">Answer</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{q.question}</td>
                <td className="p-2">{q.options.join(", ")}</td>
                <td className="p-2">{q.options[q.answer]}</td>
                <td className="p-2">
                  <button
                    onClick={() => setDeleteId(q._id)}
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
    </div>
  );
}
