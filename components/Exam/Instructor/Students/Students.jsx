// File: app/online-exam/instructor/students/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await shubukan_api.get("/instructor/students", {
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sid) => {
    if (!confirm("Delete this student?")) return;
    try {
      await shubukan_api.delete(`/instructor/student/${sid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setStudents((s) => s.filter((st) => st._id !== sid));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Students</h2>
      {loading ? (
        <div>Loading...</div>
      ) : students.length === 0 ? (
        <div>No students found</div>
      ) : (
        <div className="grid gap-3">
          {students.map((s) => (
            <div key={s._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm">KYU: {s.presentKyu ?? "-"} | Email: {s.email}</div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded"
                  onClick={() => router.push(`/online-exam/instructor/results?studentId=${s._id}`)}
                >
                  Results
                </button>
                <button className="px-3 py-1 border rounded" onClick={() => handleDelete(s._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}