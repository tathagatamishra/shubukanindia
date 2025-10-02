"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useRouter } from "next/navigation";
import SlidingNumber from "../UIComponent/SlidingNumber";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    blogs: 0,
    gallery: 0,
    students: 0,
    instructors: 0,
    questions: 0,
    exams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const [blogs, gallery, students, instructors, questions, exams] =
          await Promise.all([
            shubukan_api.get("/blogs"),
            shubukan_api.get("/gallery?limit=1"),
            shubukan_api.get("/admin/students", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            shubukan_api.get("/instructors"),
            shubukan_api.get("/admin/questions", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            shubukan_api.get("/admin/exams", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setStats({
          blogs: blogs.data.total || blogs.data.blogs.length,
          gallery: gallery.data.total || gallery.data.images?.length || 0,
          students: students.data.length,
          instructors: instructors.data.instructors.length,
          questions: questions.data.total || questions.data.length,
          exams: exams.data.length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-[60vh]">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div>
      {loading && (
        <div className="z-[4] bg-[#ffffff51]  backdrop-blur-[2px] flex justify-center items-center w-screen h-screen fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(stats).map(([k, v]) => (
          <div
            key={k}
            className="min-h-[96px] bg-white hover:bg-[#f5fcff] active:scale-[95%] shadow-md p-4 rounded-xl text-center"
            onClick={() => router.push(`/admin/${k}`)}
          >
            <div className="min-h-[40px] text-3xl font-bold">
              <SlidingNumber value={v} />
            </div>
            <p className="capitalize">{k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
