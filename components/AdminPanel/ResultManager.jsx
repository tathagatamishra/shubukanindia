"use client";
import { useEffect, useState } from "react";
import { shubukan_api } from "@/config";

export default function ResultManager() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await shubukan_api.get("/admin/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Results</h2>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-gray-500 text-center py-6">No results found</div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((r) => (
              <div
                key={r._id}
                className="bg-white shadow rounded-xl p-4 hover:shadow-md transition"
              >
                {/* Top section (Student + Exam ID) */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-dashed pb-2 mb-2">
                  <div>
                    <p className="font-semibold text-lg">{r.student?.name}</p>
                    <p className="text-sm text-gray-500">{r.student?.email}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-blue-600 font-bold text-lg tracking-widest">
                      {r.exam?.examID}
                    </span>
                  </div>
                </div>

                {/* Grid of details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Instructor ID:</span>{" "}
                    {r.student?.instructorId}
                  </p>
                  <p>
                    <span className="font-semibold">Exam Set:</span>{" "}
                    {r.exam?.examSet}
                  </p>
                  <p>
                    <span className="font-semibold">Kyu:</span>{" "}
                    {r.exam?.kyu ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Exam Date:</span>{" "}
                    {formatDate(r.exam?.examDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Submitted At:</span>{" "}
                    {formatDate(r.submittedAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Marks:</span>{" "}
                    {r.marksObtained}/{r.exam?.totalMarks}
                  </p>
                  <p className="text-green-600">
                    <span className="font-semibold">Correct:</span>{" "}
                    {r.correctAnsCount}
                  </p>
                  <p className="text-red-500">
                    <span className="font-semibold">Wrong:</span>{" "}
                    {r.wrongAnsCount}
                  </p>
                  <p className="col-span-1 sm:col-span-2">
                    <span className="font-semibold">Selected Options:</span>{" "}
                    {Array.isArray(r.selectedOptions)
                      ? r.selectedOptions.map((opt, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 rounded mr-1 mt-1"
                          >
                            {opt === null ? "N/A" : opt}
                          </span>
                        ))
                      : "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {formatDate(r.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Updated:</span>{" "}
                    {formatDate(r.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
