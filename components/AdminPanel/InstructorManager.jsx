// components/AdminPanel/InstructorManager.jsx
"use client";
import { FiPlus, FiTrash2, FiEdit, FiX, FiCopy, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import { shubukan_api } from "@/config";

export default function InstructorManager() {
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({ name: "", identity: "" });
  const [editForm, setEditForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePermanent, setDeletePermanent] = useState(false);
  const [copiedId, setCopiedId] = useState(null); // ✅ state to track copied ID
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/admin/instructors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInstructors(res.data.instructors);
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    } finally {
      setLoading(false);
    }
  };

  const generateId = async () => {
    await shubukan_api.post("/admin/instructor/generate", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ name: "", identity: "" });
    fetchInstructors();
  };

  const deleteInstructor = async (iid, permanent = false) => {
    const url = permanent
      ? `/admin/instructor/perma/${iid}`
      : `/admin/instructor/soft/${iid}`;
    await shubukan_api.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchInstructors();
  };

  const updateInstructor = async (iid) => {
    if (!editForm) return;
    await shubukan_api.put(`/admin/instructor/edit/${iid}`, editForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditForm(null);
    setEditId(null);
    fetchInstructors();
  };

  // ✅ Copy to clipboard handler
  const handleCopy = (text, iid, name) => {
    navigator.clipboard.writeText(text);
    setCopiedId(iid); // keep track of which row was copied
    setTimeout(() => setCopiedId(null), 2000); // reset after 2s
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Instructors</h2>

      {/* Create ID */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2">Generate Instructor ID</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            placeholder="Identity"
            value={form.identity}
            onChange={(e) => setForm({ ...form, identity: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={generateId}
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
          >
            <FiPlus /> Generate
          </button>
        </div>
      </div>

      {/* Instructor Table */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-gray-500 text-center">
            No instructors available
          </div>
        ) : (
          instructors.map((i) => (
            <div
              key={i._id}
              className="hover:bg-[#f9fcff] bg-white shadow rounded-xl p-4 flex flex-row w-full"
            >
              <div className="border-r border-dashed border-[#334155] w-fit">
                <div className="h-[50px] p-2 border-b border-dashed">Name</div>
                <div className="h-[50px] p-2 border-b border-dashed">ID</div>
                <div className="h-[50px] p-2 border-b border-dashed">
                  Identity
                </div>
                <div className="h-[50px] p-2 border-b border-dashed">
                  Claimed
                </div>
                <div className="h-[50px] p-2">Actions</div>
              </div>

              <div className="w-full">
                <div className="h-[50px] p-2 border-b border-dashed">
                  {i.name}
                </div>

                <div className="h-[50px] p-2 border-b border-dashed flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopy(`${i.name}: ${i.instructorId}`, i._id, i.name)
                    }
                    className="text-blue-500 hover:text-blue-700 font-[700] flex flex-row items-center gap-4"
                    title="Copy ID"
                    style={{ letterSpacing: "4px" }}
                  >
                    {i.instructorId}
                    {copiedId === i._id ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>

                <div className="h-[50px] p-2 border-b border-dashed">
                  {i.identity}
                </div>

                <div className="h-[50px] p-2 border-b border-dashed">
                  {i.claimed ? "Yes" : "No"}
                </div>

                <div className="h-[50px] p-2 flex gap-2">
                  <button
                    className="text-red-500 w-full max-w-[100px] flex justify-center items-center gap-2 border-2 rounded font-[600]"
                    onClick={() => {
                      setDeleteId(i.instructorId);
                      setDeletePermanent(false);
                    }}
                  >
                    <FiTrash2 /> Delete
                  </button>

                  <button
                    className="text-blue-500 w-full max-w-[100px] flex justify-center items-center gap-2 border-2 rounded font-[600]"
                    onClick={() => {
                      setEditForm(i);
                      setEditId(i.instructorId);
                    }}
                  >
                    <FiEdit /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50  p-4">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              {deletePermanent
                ? "Are you sure you want to permanently delete this instructor? This cannot be undone."
                : "Are you sure you want to delete this instructor?"}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteInstructor(deleteId, deletePermanent);
                  setDeleteId(null);
                }}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">Edit Instructor</h3>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              value={editForm.identity}
              onChange={(e) =>
                setEditForm({ ...editForm, identity: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditForm(null)}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateInstructor(editId);
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
