"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    instructorName: "",
    instructorId: "",
  });
  const [editForm, setEditForm] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await shubukan_api.get("/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await shubukan_api.get("/instructors", {
        headers: { Authorization: `Bearer ${token}` }, // in case endpoint is protected
      });
      let insts = res.data.instructors || res.data || [];
      // basic filter
      insts = insts.filter((inst) => inst && inst.name && inst.identity);
      setInstructors(insts);
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addStudent = async () => {
    try {
      await shubukan_api.post("/student/signup", form);
      setForm({ name: "", email: "", instructorName: "", instructorId: "" });
      fetchStudents();
    } catch (err) {
      console.error("Add student failed", err);
      alert(err.response?.data?.message || "Failed to add student");
    }
  };

  const deleteStudent = async (sid) => {
    try {
      await shubukan_api.delete(`/admin/student/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  const updateStudent = async () => {
    if (!editForm || !editForm._id) return;
    try {
      await shubukan_api.put(`/admin/student/${editForm._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditForm(null);
      fetchStudents();
    } catch (err) {
      console.error("Update failed", err);
      alert(err.response?.data?.message || "Failed to update student");
    }
  };

  const openEdit = (s) => {
    // ensure boolean for isVerified
    setEditForm({
      ...s,
      isVerified: !!s.isVerified,
      // instructorIdentity might be missing; ensure presence
      instructorIdentity: s.instructorIdentity || "",
    });
  };

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
            onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
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

      {/* Student List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-gray-500 text-center">No students available</div>
        ) : (
          students.map((s) => (
            <div
              key={s._id}
              className="hover:bg-[#f9fcff] bg-white shadow rounded-xl p-4 flex flex-row w-full"
            >
              {/* label column */}
              <div className="border-r border-dashed border-[#334155] w-fit text-[12px] sm:text-[14px] font-semibold">
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Name
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Email
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Mobile
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Present Kyu
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Last Cert No
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Instructor (Name)
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Instructor (Identity)
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 border-b border-dashed flex items-center">
                  Verified
                </div>
                <div className="h-[40px] sm:h-[50px] sm:p-2 p-1 flex items-center">
                  Actions
                </div>
              </div>

              {/* values column */}
              <div className="w-full text-[12px] sm:text-[14px]">
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.name}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center break-all">
                  {s.email}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.mobile || "-"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.presentKyu || "-"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.lastCertificateNum || "-"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.instructorName || "-"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.instructorIdentity || "-"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 sm:py-2 py-1 border-b border-dashed flex items-center">
                  {s.isVerified ? "Yes" : "No"}
                </div>
                <div className="h-[40px] sm:h-[50px] p-2 gap-2 flex items-center">
                  <button
                    className="text-blue-500 w-full max-w-[100px] h-full flex justify-center items-center gap-2 border-2 rounded font-[600]"
                    onClick={() => openEdit(s)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="text-red-500 w-full max-w-[100px] h-full flex justify-center items-center gap-2 border-2 rounded font-[600]"
                    onClick={() => setDeleteId(s._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit modal */}
      {editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl">
            <h3 className="text-lg font-bold mb-4">Edit Student</h3>

            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm">Name</label>
              <input
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <label className="text-sm">Email</label>
              <input
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <label className="text-sm">Mobile</label>
              <input
                value={editForm.mobile || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, mobile: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <label className="text-sm">Present Kyu</label>
              <input
                value={editForm.presentKyu || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, presentKyu: e.target.value })
                }
                className="border p-2 rounded w-full"
              />

              <label className="text-sm">Last Certificate No.</label>
              <input
                value={editForm.lastCertificateNum || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    lastCertificateNum: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              />

              <div>
                <label className="text-sm">Instructor</label>
                <select
                  value={editForm.instructorId || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    const sel = instructors.find((i) => i._id === id) || {};
                    setEditForm({
                      ...editForm,
                      instructorId: sel._id || "",
                      instructorName: sel.name || "",
                      instructorIdentity: sel.identity || "",
                    });
                  }}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- No instructor / outside --</option>
                  {instructors.map((ins) => (
                    <option key={ins._id} value={ins._id}>
                      {ins.name} — {ins.identity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  id="isVerified"
                  type="checkbox"
                  checked={!!editForm.isVerified}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isVerified: e.target.checked })
                  }
                />
                <label htmlFor="isVerified">Verified</label>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
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

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this student? This cannot be
              undone.
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
