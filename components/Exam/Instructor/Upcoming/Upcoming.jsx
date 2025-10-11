// components/Exam/Instructor/Upcoming/Upcoming.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "../../UI/ExamBtn";
import html2canvas from "html2canvas";

export default function Upcoming() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [exams, setExams] = useState([]);
  const [kyu, setKyu] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // refs map for exam cards - used for html2canvas capture
  const examRefs = useRef({});

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    setToken(t);
    if (!t) return router.push("/online-exam");
    fetchExams();

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

    if (parts.length === 0) return "0 seconds";
    return parts.join(" ");
  };

  const makeShareText = (e) => {
    const timeStr = e.examDate
      ? new Date(e.examDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";
    const dateStr = e.examDate
      ? new Date(e.examDate).toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "N/A";

    const pwd = e.password || "No Password Needed";
    return `Exam ID: ${e.examID}\nPassword: ${pwd}\nExam Will Start At: ${timeStr} - ${dateStr}`;
  };

  // Copy to clipboard (simple)
  const handleCopy = async (e) => {
    try {
      const text = makeShareText(e);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("Exam details copied to clipboard");
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        alert("Exam details copied to clipboard");
      }
    } catch (err) {
      console.error("copy failed", err);
      alert("Failed to copy");
    }
  };

  // Share handler:
  // 1) Try to capture the card as PNG and share via Web Share API (files) if available.
  // 2) Fallback to opening WhatsApp share link with text.
  const handleShare = async (e) => {
    const shareText = makeShareText(e);
    const encoded = encodeURIComponent(shareText);
    const waLink = `https://wa.me/?text=${encoded}`;

    console.log("[Share] clicked for", e.examID);

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // --- Mobile: try navigator.share / file share as before
    if (isMobile) {
      // keep your mobile flow (text share or file share) — fall back to waLink
      if (navigator.share && !navigator.canShare) {
        try {
          await navigator.share({ title: `Exam ${e.examID}`, text: shareText });
          return;
        } catch (err) {
          window.open(waLink, "_blank");
          return;
        }
      }

      try {
        const refNode = examRefs.current?.[e._id];
        if (refNode && navigator.canShare && html2canvas) {
          const canvas = await html2canvas(refNode, {
            useCORS: true,
            scale: 2,
          });
          const blob = await new Promise((res) =>
            canvas.toBlob(res, "image/png")
          );
          if (blob) {
            const file = new File([blob], `exam-${e.examID}.png`, {
              type: "image/png",
            });
            if (navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: `Exam ${e.examID}`,
                  text: shareText,
                });
                return;
              } catch (err) {
                console.warn("mobile file share failed:", err);
                window.open(waLink, "_blank");
                return;
              }
            }
          }
        }
      } catch (err) {
        console.warn("mobile png flow failed, falling back:", err);
      }

      window.open(waLink, "_blank");
      return;
    }

    // --- Desktop: try copy PNG to clipboard, else download, then open WhatsApp Web
    try {
      const refNode = examRefs.current?.[e._id];
      if (!refNode || !html2canvas) {
        // nothing to capture: just open wa link
        window.open(waLink, "_blank");
        return;
      }

      // create canvas / blob
      const canvas = await html2canvas(refNode, { useCORS: true, scale: 2 });
      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("Could not create image blob");

      // 1) Try writing image to clipboard (best UX: user can paste into WhatsApp Web)
      const canWriteImageToClipboard =
        !!navigator.clipboard &&
        !!navigator.clipboard.write &&
        typeof ClipboardItem !== "undefined";

      if (canWriteImageToClipboard) {
        try {
          // ClipboardItem expects a map of MIME -> blob
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);

          // open whatsapp web and tell user to paste
          window.open(waLink, "_blank");
          alert(
            "Image copied to clipboard. Open the WhatsApp chat and press Ctrl+V (or right-click → Paste) to paste the image. The message text is still available in the share link."
          );
          return;
        } catch (err) {
          console.warn("clipboard.write image failed:", err);
          // fall through to download fallback
        }
      }

      // 2) Fallback: trigger a download of the PNG
      try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `exam-${e.examID}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        // optionally also copy text to clipboard so they can paste caption quickly
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareText);
          }
        } catch (copyErr) {
          console.warn("copy text fallback failed", copyErr);
        }

        window.open(waLink, "_blank");
        alert(
          "Image downloaded. Attach the downloaded image in WhatsApp Web and paste the caption (it was copied to your clipboard if supported)."
        );
        return;
      } catch (downloadErr) {
        console.warn("download fallback failed:", downloadErr);
        window.open(waLink, "_blank");
        alert(
          "Could not prepare image. WhatsApp Web opened with text share instead."
        );
        return;
      }
    } catch (err) {
      console.warn("desktop png/copy flow failed:", err);
      // final fallback: open whatsapp link with text
      window.open(waLink, "_blank");
      return;
    }
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
            const examDateMs = e.examDate
              ? new Date(e.examDate).getTime()
              : null;
            const remaining = examDateMs ? examDateMs - now : null;

            return (
              <div
                key={`${e._id}`}
                className="OnlineExam corner-shape w-full h-fit flex flex-col p-[16px] shadow-md border !rounded-[40px]"
              >
                <div
                  className="w-full flex flex-col"
                  ref={(el) => (examRefs.current[e._id] = el)}
                >
                  <div className="w-full flex flex-col">
                    <div className="w-full h-[40px] border-b-1 border-dashed flex flex-row items-center">
                      <p className="w-[40%] sm:w-[60%] font-[600] text-center text-[14px] sm:text-[16px] text-[#334155]">
                        Exam ID
                      </p>
                      <div className="border-r-1 border-dashed h-full"></div>
                      <p
                        className="w-[60%] font-[700] text-center text-[14px] sm:text-[16px] text-[#334155]"
                        style={{ letterSpacing: "4px" }}
                      >
                        {e.examID}
                      </p>
                    </div>

                    {/* <div className="w-full h-[40px] border-b-1 border-dashed flex flex-row items-center">
                      <p className="w-[40%] sm:w-[60%] font-[600] text-center text-[14px] sm:text-[16px] text-[#334155]">
                        Exam Password
                      </p>
                      <div className="border-r-1 border-dashed h-full"></div>
                      <p
                        className={`w-[60%] ${
                          e.password && "font-[700]"
                        } text-center text-[14px] sm:text-[16px] text-[#334155]`}
                        style={{
                          letterSpacing: `${e.password ? "4px" : "auto"}`,
                        }}
                      >
                        {e.password || "No Password Needed"}
                      </p>
                    </div> */}
                  </div>

                  <div className="w-full border-b-1 border-dashed flex flex-col gap-[4px] p-[8px]">
                    <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                      Exam Will Start At
                    </label>
                    {/* <div className="w-full flex sm:flex-row flex-col gap-[4px]"> */}
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
                    {/* </div> */}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-[4px] p-[8px]">
                  <label className="w-full text-center font-[600] text-[12px] sm:text-[14px] text-[#334155]">
                    Time Remains
                  </label>
                  <p className="w-full text-center text-[16px] sm:text-[18px] font-[600] text-[#334155]">
                    {remaining === null ? "N/A" : formatDiff(remaining)}
                  </p>
                </div>

                <div className="w-full border-t-1 border-dashed flex flex-row justify-center p-[8px] gap-[16px]">
                  <ExamBtn
                    text="Share"
                    size="w-full sm:w-[150px]"
                    onClick={() => {
                      console.log("ExamBtn clicked (UI) for", e.examID);
                      handleShare(e);
                    }}
                  />

                  <ExamBtn
                    text="Copy"
                    size="w-full sm:w-[150px]"
                    onClick={() => handleCopy(e)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
