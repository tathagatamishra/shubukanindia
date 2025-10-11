// Exam/Student/Profile/EditProfile.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import { FiChevronDown } from "react-icons/fi";
import { Lekton } from "next/font/google";

const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lekton",
});

const KYU_OPTIONS = [
  "10th Kyu - White Belt",
  "9th Kyu - Yellow Belt",
  "8th Kyu - Orange Belt",
  "7th Kyu - Green Belt",
  "6th Kyu - Blue Belt",
  "5th Kyu - Purple Belt",
  "4th Kyu - Brown Belt",
  "3th Kyu - Brown Belt",
  "2th Kyu - Brown Belt",
  "1th Kyu - Brown Belt",
  "1st Dan - Black Belt",
];

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    presentKyu: "",
    lastCertificateNum: "",
    instructorName: "",
    instructorId: "",
    email: "",
    mobile: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // instructors dropdown
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const instructorRef = useRef(null);

  // kyu dropdown
  const [filteredKyu, setFilteredKyu] = useState(KYU_OPTIONS);
  const [showKyuDropdown, setShowKyuDropdown] = useState(false);
  const kyuRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("student_token") : "";

  function shuffle(array) {
    const copy = [...array];
    copy.sort(() => Math.random() - 0.5);
    return copy;
  }

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await shubukan_api.get("/instructors");
        let insts = res.data.instructors || [];
        insts = insts.filter(
          (inst) => inst && inst.name !== "__" && inst.identity !== "__"
        );
        const shuffled = shuffle(insts);
        setInstructors(shuffled);
        setFilteredInstructors(shuffled);
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    };
    fetchInstructors();
  }, []);

  // fetch profile and prefill formData
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await shubukan_api.get("/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data || {};
        setFormData({
          name: p.name || "",
          presentKyu: p.presentKyu || "",
          lastCertificateNum: p.lastCertificateNum || "",
          instructorName: p.instructorName || "",
          instructorId: p.instructorId || "",
          email: p.email || "",
          mobile: p.mobile || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile");
      } finally {
        setProfileLoading(false);
      }
    };

    if (token) fetchProfile();
    else setProfileLoading(false);
  }, [token]);

  // click outside handler for both dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (instructorRef.current && !instructorRef.current.contains(e.target)) {
        setShowInstructorDropdown(false);
      }
      if (kyuRef.current && !kyuRef.current.contains(e.target)) {
        setShowKyuDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "instructorName") {
      setFormData((prev) => ({ ...prev, instructorName: value }));
      const f = instructors.filter((ins) =>
        ins.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInstructors(f);
      setShowInstructorDropdown(true);

      const exact = instructors.find((ins) => ins.name === value);
      if (exact) {
        setFormData((prev) => ({
          ...prev,
          instructorName: exact.name,
          instructorId: exact._id,
        }));
      } else {
        setFormData((prev) => ({ ...prev, instructorId: "" }));
      }
      return;
    }

    if (name === "presentKyu") {
      setFormData((prev) => ({ ...prev, presentKyu: value }));
      const fk = KYU_OPTIONS.filter((k) =>
        k.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredKyu(fk);
      setShowKyuDropdown(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectInstructor = (ins) => {
    setFormData((prev) => ({
      ...prev,
      instructorName: ins.name,
      instructorId: ins._id,
    }));
    setShowInstructorDropdown(false);
  };

  const handleSelectKyu = (kyu) => {
    setFormData((prev) => ({ ...prev, presentKyu: kyu }));
    setShowKyuDropdown(false);
  };

  const handleInstructorToggle = () => {
    setFilteredInstructors(instructors);
    setShowInstructorDropdown((p) => !p);
  };

  const handleKyuToggle = () => {
    setFilteredKyu(KYU_OPTIONS);
    setShowKyuDropdown((p) => !p);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await shubukan_api.put("/student/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <p>Loading profile...</p>;

  return (
    <div className="ExamChild w-full h-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Edit Profile
      </label>

      <form className="OnlineExam corner-shape w-full flex flex-col p-4 shadow-md border !rounded-[40px]">
        {/* Name */}
        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Name
          </label>
          <input
            required
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        {/* Present Kyu - same behavior as Sensei */}
        <div ref={kyuRef} className="relative w-full flex flex-col mb-[8px]">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Present Kyu
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="presentKyu"
              value={formData.presentKyu || ""}
              onChange={handleChange}
              onFocus={() => setShowKyuDropdown(true)}
              placeholder="Select or type your present kyu"
              className={`${lekton.className} corner-shape border w-full font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[4px]`}
            />
            <button
              type="button"
              onClick={handleKyuToggle}
              className="absolute right-2 text-gray-600 hover:text-black"
            >
              <FiChevronDown size={20} />
            </button>
          </div>

          {showKyuDropdown && filteredKyu.length > 0 && (
            <ul
              className={`${lekton.className} corner-shape absolute top-[100%] left-0 right-0 shadow-md max-h-[240px] overflow-y-auto z-20 border-2 bg-[#efe9e5] border-[#9050438d] !rounded-[30px] font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
            >
              {filteredKyu.map((k) => (
                <li
                  key={k}
                  className={`corner-shape px-4 py-2 hover:bg-[#fff] active:bg-[#fff] ${
                    k === formData.presentKyu ? "bg-[#fff]" : ""
                  } cursor-pointer text-[14px] sm:text-[16px]`}
                  onClick={() => handleSelectKyu(k)}
                >
                  {k}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Last Certificate No. */}
        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Last Certificate No.
          </label>
          <input
            type="text"
            name="lastCertificateNum"
            value={formData.lastCertificateNum || ""}
            onChange={handleChange}
            placeholder="Enter your certificate no"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        {/* Sensei Name */}
        <div
          ref={instructorRef}
          className="relative w-full flex flex-col mb-[8px]"
        >
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Sensei Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="instructorName"
              value={formData.instructorName || ""}
              onChange={handleChange}
              onFocus={() => setShowInstructorDropdown(true)}
              placeholder="Select or type Sensei’s name"
              className={`${lekton.className} corner-shape border w-full font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[4px]`}
            />
            <button
              type="button"
              onClick={handleInstructorToggle}
              className="absolute right-2 text-gray-600 hover:text-black"
            >
              <FiChevronDown size={20} />
            </button>
          </div>

          {showInstructorDropdown && filteredInstructors.length > 0 && (
            <ul
              className={`${lekton.className} corner-shape absolute top-[100%] left-0 right-0 shadow-md max-h-[240px] overflow-y-auto z-20 border-2 bg-[#efe9e5] border-[#9050438d] !rounded-[30px] font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
            >
              {filteredInstructors.map((ins) => (
                <li
                  key={ins._id}
                  className={`corner-shape px-4 py-2 hover:bg-[#fff] active:bg-[#fff] ${
                    ins.name === formData.instructorName ? "bg-[#fff]" : ""
                  } cursor-pointer text-[14px] sm:text-[16px]`}
                  onClick={() => handleSelectInstructor(ins)}
                >
                  {ins.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Email & Mobile */}
        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Enter your or parent's email id"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Mobile
          </label>
          <input
            required
            type="text"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            placeholder="Enter your or parent’s phone no."
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <ExamBtn
          text={loading ? "Saving..." : "Save Changes"}
          onClick={handleSave}
          className="self-end mt-2"
          size="w-fit h-auto"
        />
      </form>
    </div>
  );
}
