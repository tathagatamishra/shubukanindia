// Exam/Student/Profile/EditProfile.jsx
"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";

export default function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await shubukan_api.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await shubukan_api.put("/student/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Edit Profile
      </label>

      <div className="OnlineExam corner-shape w-full flex flex-col p-4 shadow-md border !rounded-[40px]">
        {[
          { label: "Name", name: "name" },
          { label: "Email", name: "email" },
          { label: "Mobile", name: "mobile" },
          { label: "Present Kyu", name: "presentKyu" },
          { label: "Last Certificate No.", name: "lastCertificateNum" },
          { label: "Sensei Name", name: "instructorName" },
        ].map((field, idx) => (
          <div key={idx} className="w-full h-fit flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={profile[field.name] || ""}
              onChange={handleChange}
              className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
            />
          </div>
        ))}

        <ExamBtn
          text={loading ? "Saving..." : "Save Changes"}
          onClick={handleSave}
          className="self-end mt-2"
        />
      </div>
    </div>
  );
}
