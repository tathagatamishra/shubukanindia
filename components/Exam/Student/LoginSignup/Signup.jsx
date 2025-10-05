// Exam/Student/LoginSignup/Signup.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ExamBtn from "../../UI/ExamBtn";
import { shubukan_api } from "@/config";
import { FiChevronDown } from "react-icons/fi";

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
  const [instructors, setInstructors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await shubukan_api.get("/instructors");
        let instructors = res.data.instructors || [];

        // 🧹 Remove invalid entries (where name == "__" or identity == "__")
        instructors = instructors.filter(
          (inst) => inst.name !== "__" && inst.identity !== "__"
        );

        // 🔀 Shuffle and set
        const shuffled = shuffle(instructors);

        setInstructors(shuffled);
        setFiltered(instructors); // default for dropdown
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    };

    fetchInstructors();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "instructorName") {
      const f = instructors.filter((ins) =>
        ins.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(f);
      setShowDropdown(true);

      const selected = instructors.find((ins) => ins.name === value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          instructorName: selected.name,
          instructorId: selected._id,
        }));
      } else {
        setFormData((prev) => ({ ...prev, instructorId: "" }));
      }
    }
  };

  const handleSelectInstructor = (ins) => {
    setFormData((prev) => ({
      ...prev,
      instructorName: ins.name,
      instructorId: ins._id,
    }));
    setShowDropdown(false);
  };

  const handleDropdownToggle = () => {
    setFiltered(instructors); // show full list
    setShowDropdown((prev) => !prev);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ExamChild w-full h-full flex flex-col justify-start items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Enter Sign up Details
      </label>
      <form
        // onSubmit={handleSubmit}
        className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] pb-[32px] shadow-md border !rounded-[40px]"
      >
        {/* Common Inputs */}
        {[
          {
            label: "Name",
            name: "name",
            type: "text",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            label: "Present Kyu",
            name: "presentKyu",
            type: "text",
            placeholder: "Select your present kyu",
          },
          {
            label: "Last Certificate No.",
            name: "lastCertificateNum",
            type: "text",
            placeholder: "Enter your certificate no",
          },
        ].map((f, i) => (
          <div key={i} className="w-full flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              {f.label}
            </label>
            <input
              required={f.required}
              type={f.type}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
            />
          </div>
        ))}

        {/* Hybrid Instructor Input with Dropdown Button */}
        <div
          ref={dropdownRef}
          className="relative w-full flex flex-col mb-[8px]"
        >
          <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
            Sensei Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="instructorName"
              value={formData.instructorName}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
              placeholder="Select or type Sensei’s name"
              className="corner-shape border w-full font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[4px]"
            />
            <button
              type="button"
              onClick={handleDropdownToggle}
              className="absolute right-2 text-gray-600 hover:text-black"
            >
              <FiChevronDown size={20} />
            </button>
          </div>

          {showDropdown && filtered.length > 0 && (
            <ul className="OptionStyle corner-shape absolute top-[100%] left-0 right-0 shadow-md max-h-[240px] overflow-y-auto z-20 border !rounded-[30px] font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]">
              {filtered.map((ins) => (
                <li
                  key={ins._id}
                  className={`corner-shape px-4 py-2 hover:bg-[#fff] active:bg-[#fff] ${
                    ins.name == formData.instructorName && "bg-[#fff]"
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
        {[
          {
            label: "Email",
            name: "email",
            type: "email",
            required: true,
            placeholder: "Enter your or parent's email id",
          },
          {
            label: "Mobile",
            name: "mobile",
            type: "text",
            required: true,
            placeholder: "Enter your or parent’s phone no.",
          },
        ].map((f, i) => (
          <div key={i} className="w-full flex flex-col">
            <label className="font-[600] text-[12px] sm:text-[16px] text-[#334155]">
              {f.label}
            </label>
            <input
              required={f.required}
              type={f.type}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="corner-shape border font-[600] text-[14px] sm:text-[16px] px-[10px] sm:px-[18px] py-[8px] mb-[12px]"
            />
          </div>
        ))}

        <ExamBtn
          onClick={handleSubmit}
          text={loading ? "Registering..." : "Sign up"}
          type="submit"
          className="self-end mt-[6px]"
        />
      </form>
    </div>
  );
}
