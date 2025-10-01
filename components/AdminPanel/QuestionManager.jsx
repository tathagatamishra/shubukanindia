"use client";
import { useState, useEffect } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({ question: "", options: [""], answer: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    const token = localStorage.getItem("adminToken");
    setLoading(true);
    try {
      const res = await shubukan_api.get("/admin/questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
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
    try {
      await shubukan_api.delete(`/admin/question/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
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
      {loading ? (
        <div className="flex justify-center items-center h-[30vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-gray-500 text-center">No questions available</div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="hover:bg-[#f9fcff] bg-white shadow rounded-xl p-4 flex flex-col w-full"
            >
              {/* Label column */}
              <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                <p className="min-w-[65px]">Question</p>
                <div className="w-full h-[50px] ml-[10px] p-[12px] border-l border-dashed border-[#334155]">
                  {q.question}
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                <p className="min-w-[65px]">Options</p>
                <div className="h-fit min-h-[50px] ml-[10px] p-[12px] border-l border-dashed border-[#334155] flex flex-wrap gap-2">
                  {q.options.map((i, n) => (
                    <p
                      key={n}
                      className="border-1 border-blue-400 rounded h-fit px-2 pb-1"
                    >
                      {i}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit border-b border-dashed border-[#334155]">
                <p className="min-w-[65px]">Answer</p>
                <div className="h-[50px] ml-[10px] p-[12px] border-l border-dashed border-[#334155]">
                  {q.options[q.answer]}
                </div>
              </div>
              <div className="flex flex-row items-center w-full h-fit border-dashed border-[#334155]">
                <p className="min-w-[65px]">Actions</p>
                <div className="h-[50px] ml-[10px] p-[12px] border-l border-dashed border-[#334155] flex gap-2">
                  <button
                    onClick={() => setDeleteId(q._id)}
                    className="text-red-500 w-[100px] flex justify-center items-center gap-2 border-2 rounded font-[600]"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
