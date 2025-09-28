"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    instructorName: "",
    instructorId: "",
  });
  const [editForm, setEditForm] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // 🔴 new state for delete modal

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchStudents = async () => {
    const res = await shubukan_api.get("/admin/students", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  const addStudent = async () => {
    await shubukan_api.post("/student/signup", form);
    setForm({ name: "", email: "", instructorName: "", instructorId: "" });
    fetchStudents();
  };

  const deleteStudent = async (sid) => {
    await shubukan_api.delete(`/admin/student/${sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchStudents();
  };

  const updateStudent = async () => {
    if (!editForm) return;
    await shubukan_api.put(`/student/profile`, editForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditForm(null);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>

      {/* Add student form */}
      <div className="bg-white shadow rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-2">Add Student</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Instructor Name"
            value={form.instructorName}
            onChange={(e) =>
              setForm({ ...form, instructorName: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            placeholder="Instructor ID"
            value={form.instructorId}
            onChange={(e) =>
              setForm({ ...form, instructorId: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={addStudent}
          className="mt-3 bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
        >
          <FiPlus /> Add Student
        </button>
      </div>

      {/* Students table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Instructor</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.instructorName || "-"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="text-blue-500"
                    onClick={() => setEditForm(s)}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => setDeleteId(s._id)} // 🔴 open confirmation modal
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">Edit Student</h3>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              value={editForm.instructorName}
              onChange={(e) =>
                setEditForm({ ...editForm, instructorName: e.target.value })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              value={editForm.instructorId}
              onChange={(e) =>
                setEditForm({ ...editForm, instructorId: e.target.value })
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
                onClick={updateStudent}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this student? This cannot be undone.
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
                  await deleteStudent(deleteId);
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
    </div>
  );
}
