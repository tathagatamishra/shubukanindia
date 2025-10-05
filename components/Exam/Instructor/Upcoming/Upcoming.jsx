// components/Exam/Instructor/Upcoming/Upcoming.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";

export default function Upcoming() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [exams, setExams] = useState([]);
  const [kyu, setKyu] = useState("");
  const [loading, setLoading] = useState(true);

  // single tick time used to compute remaining for all exams
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    setToken(t);
    if (!t) return router.push("/online-exam");
    fetchExams();

    // one global interval for all countdowns
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExams = async (accessability = undefined, kyuFilter = kyu) => {
    try {
      setLoading(true);
      const params = {};
      if (accessability) params.accessability = accessability;
      if (kyuFilter) params.kyu = kyuFilter;
      const res = await shubukan_api.get("/instructor/exams/upcoming", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("instructor_token")}`,
        },
      });
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  // format difference in ms -> only non-zero parts, e.g. "5 hours 32 minutes 39 seconds"
  const formatDiff = (diffMs) => {
    if (diffMs <= 0) return "Started";

    let totalSec = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSec / 86400);
    totalSec %= 86400;

    const hours = Math.floor(totalSec / 3600);
    totalSec %= 3600;

    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    // if somehow all were zero (very small positive diff), show 0 seconds
    if (parts.length === 0) return "0 seconds";

    return parts.join(" ");
  };

  return (
    <div className="ExamChild w-full flex flex-col items-center">
      <label className="w-full font-[600] text-[14px] sm:text-[16px] text-[#334155]">
        Upcoming Exams
      </label>

      {loading ? (
        <p className="text-[14px] text-gray-500">Loading...</p>
      ) : exams.length === 0 ? (
        <p className="text-[14px] text-gray-500">No upcoming exams found.</p>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-[32px]">
          {exams.map((e) => {
            const examDateMs = e.examDate ? new Date(e.examDate).getTime() : null;
            const remaining = examDateMs ? examDateMs - now : null;
            return (
              <div
                key={`${e._id}`}
                className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] shadow-md border !rounded-[40px]"
              >
                <div className="w-full flex flex-col">
                  <div className="w-full border-b-1 border-dashed flex flex-row items-center">
                    <label className="w-[40%] font-[600] text-[12px] sm:text-[14px] text-[#334155] !m-[0px] p-[8px] pl-[2px] border-r-1 border-dashed">
                      Exam ID
                    </label>
                    <p className="w-[60%] text-center text-[14px] sm:text-[16px] text-[#334155]">
                      {e.examID}
                    </p>
                  </div>

                  <div className="w-full border-b-1 border-dashed flex flex-row items-center">
                    <label className="w-[40%] font-[600] text-[12px] sm:text-[14px] text-[#334155] !m-[0px] p-[8px] pl-[2px] border-r-1 border-dashed">
                      Exam Password
                    </label>
                    <p className="w-[60%] text-center text-[14px] sm:text-[16px] text-[#334155]">
                      {e.password || "No Password Needed"}
                    </p>
                  </div>
                </div>

                <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] p-[8px]">
                  <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                    Exam Will Start At
                  </label>
                  <p className="w-full text-center text-[18px] sm:text-[20px] font-[600] text-[#334155]">
                    {e.examDate
                      ? new Date(e.examDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>

                  <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
                    {e.examDate
                      ? new Date(e.examDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-[4px] p-[8px]">
                  <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                    Time Remains
                  </label>
                  <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
                    {remaining === null ? "N/A" : formatDiff(remaining)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
