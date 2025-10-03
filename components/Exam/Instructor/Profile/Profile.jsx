// File: app/online-exam/instructor/profile/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    if (!t) return router.push("/online-exam");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await shubukan_api.get("/instructor/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` },
      });
      setProfile(res.data);
      setForm({ name: res.data.name || "", email: res.data.email || "", mobile: res.data.mobile || "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await shubukan_api.put(
        "/instructor/profile",
        { name: form.name, email: form.email, mobile: form.mobile },
        { headers: { Authorization: `Bearer ${localStorage.getItem("instructor_token")}` } }
      );
      alert("Profile updated");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleUpdate} className="grid gap-3 max-w-md">
          <label className="flex flex-col">
            Name
            <input className="border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="flex flex-col">
            Email
            <input type="email" className="border p-2 rounded" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="flex flex-col">
            Mobile
            <input className="border p-2 rounded" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          </label>

          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-black text-white rounded">Save</button>
            <button type="button" className="px-3 py-1 border rounded" onClick={() => router.push('/online-exam')}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
