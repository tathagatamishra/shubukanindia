// Exam/Student/LoginSignup/Signup.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";
import { FiChevronDown } from "react-icons/fi";
import { Lekton } from "next/font/google";
import Loader from "@/components/UIComponent/Loader/Loader";

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

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    presentKyu: "",
    lastCertificateNum: "",
    instructorName: "",
    instructorId: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);

  // instructors dropdown state
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [showInstructorDropdown, setShowInstructorDropdown] = useState(false);
  const instructorRef = useRef(null);

  // kyu dropdown state (mirrors instructor behaviour)
  const [filteredKyu, setFilteredKyu] = useState(KYU_OPTIONS);
  const [showKyuDropdown, setShowKyuDropdown] = useState(false);
  const kyuRef = useRef(null);

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
          (inst) => inst && inst.name !== "___" && inst.identity !== "___"
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

  // when loading: close dropdowns and prevent body scroll
  useEffect(() => {
    if (loading) {
      setShowInstructorDropdown(false);
      setShowKyuDropdown(false);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // instructor name search & selection logic
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

    // presentKyu search & selection logic (same UX as Sensei)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await shubukan_api.post("/student/signup", formData);
      alert(res.data.message);
      localStorage.setItem("student_email", formData.email);
      localStorage.setItem("otp_type", "signup");
      router.push("/online-exam/student/verify");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
      setLoading(false);
    } finally {
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-start items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Enter Sign up Details
      </label>

      <form
        onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] shadow-md border !rounded-[40px]"
      >
        <p className="text-[14px] sm:text-[14px] text-[#64748B] mb-2">
          ** Your Name & Email id is mandatory to fill.
        </p>
        {/* Name */}
        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Name *
          </label>
          <input
            required
            disabled={loading}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Email *
          </label>
          <input
            required
            disabled={loading}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your or parent's email id"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <div
          ref={instructorRef}
          className="relative w-full flex flex-col mb-[8px]"
        >
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Sensei's Name
          </label>
          <div className="relative flex items-center">
            <input
              disabled={loading}
              type="text"
              name="instructorName"
              value={formData.instructorName}
              onChange={handleChange}
              onFocus={() => !loading && setShowInstructorDropdown(true)}
              placeholder="Select or type Sensei’s name"
              className={`${lekton.className} corner-shape border w-full font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[4px]`}
            />
            <button
              type="button"
              onClick={handleInstructorToggle}
              disabled={loading}
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
                  onClick={() => !loading && handleSelectInstructor(ins)}
                >
                  {ins.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Present Kyu - search + dropdown (same behaviour as Sensei) */}
        <div ref={kyuRef} className="relative w-full flex flex-col mb-[8px]">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Present Kyu
          </label>
          <div className="relative flex items-center">
            <input
              disabled={loading}
              type="text"
              name="presentKyu"
              value={formData.presentKyu}
              onChange={handleChange}
              onFocus={() => !loading && setShowKyuDropdown(true)}
              placeholder="Select your present kyu"
              className={`${lekton.className} corner-shape border w-full font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[4px]`}
            />
            <button
              type="button"
              onClick={handleKyuToggle}
              disabled={loading}
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
                  onClick={() => !loading && handleSelectKyu(k)}
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
            disabled={loading}
            type="text"
            name="lastCertificateNum"
            value={formData.lastCertificateNum}
            onChange={handleChange}
            placeholder="Enter your certificate no"
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Mobile
          </label>
          <input
            required
            disabled={loading}
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your or parent’s phone no."
            className={`${lekton.className} corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]`}
          />
        </div>

        <ExamBtn
          onClick={handleSubmit}
          text={loading ? "Registering..." : "Create Account"}
          type="submit"
          size="min-w-[150px] w-fit h-auto"
          className="self-end mt-[6px]"
          disabled={loading}
        />
      </form>

      {/* Full page loader overlay (blocks clicks & shows rotating elephant) */}
      <Loader
        loading={loading}
        message={
          <div className="loader-message w-full max-w-[720px] mt-4 flex flex-col items-center">
            <p className="loading text-[16px] sm:text-[18px] font-[600] text-[#252b32] mb-[12px] text-center">
              We are creating your account, <br/> please wait...
            </p>
            <p className="quote text-[16px] sm:text-[18px] font-[400] text-[#4d545c] mb-[12px] text-center">
              The warrior who masters patience conquers battles before they
              begin.
            </p>
          </div>
        }
      />
    </div>
  );
}
