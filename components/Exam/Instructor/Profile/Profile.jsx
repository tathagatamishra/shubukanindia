// components/Exam/Instructor/Profile/Profile.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import Loader from "@/components/UIComponent/Loader/Loader";
import { Lekton } from "next/font/google";
import ExamBtn from "../../UI/ExamBtn";
const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lekton",
});

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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
        },
      });
      setProfile(res.data);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
      });
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
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
          },
        }
      );
      alert("Profile updated");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Edit Profile
      </label>

      {loading ? (
        <Loader loading={loading} />
      ) : (
        <form className="OnlineExam corner-shape w-full flex flex-col p-4 shadow-md border !rounded-[40px]">
          <div className="w-full flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
            />
          </div>

          <div className="w-full flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              Mobile
            </label>
            <input
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
            />
          </div>

          <ExamBtn
            text={loading ? "Saving..." : "Save Changes"}
            onClick={handleUpdate}
            className="self-end mt-2"
            size="w-fit h-auto"
          />
        </form>
      )}

      <Loader loading={loading} />
    </div>
  );
}
