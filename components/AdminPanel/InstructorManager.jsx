"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";

export default function InstructorManager() {
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({ name: "", identity: "" });
  const [editForm, setEditForm] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePermanent, setDeletePermanent] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchInstructors = async () => {
    const res = await shubukan_api.get("/instructors");
    setInstructors(res.data.instructors);
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

  const updateInstructor = async () => {
    if (!editForm) return;
    await shubukan_api.put(`/instructor/profile`, editForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditForm(null);
    fetchInstructors();
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
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">ID</th>
              <th className="p-2">Claimed</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((i) => (
              <tr key={i._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i.name}</td>
                <td className="p-2">{i.instructorId}</td>
                <td className="p-2">{i.claimed ? "Yes" : "No"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-500"
                    onClick={() => setEditForm(i)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      setDeleteId(i.instructorId);
                      setDeletePermanent(false); // soft delete
                    }}
                  >
                    <FiTrash2 />
                  </button>

                  {/* <button
                    className="text-red-700"
                    onClick={() => {
                      setDeleteId(i.instructorId);
                      setDeletePermanent(true); // permanent delete
                    }}
                  >
                    <FiX />
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
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
                onClick={updateInstructor}
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
