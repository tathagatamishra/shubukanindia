// components/AdminPanel/ResultManager.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { shubukan_api } from "@/config";

function formatDate(d) {
  return d
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
}

function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      header
        .map((h) => {
          const val = r[h] == null ? "" : String(r[h]).replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ResultManager() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupView, setGroupView] = useState(false);

  // filters / UI state
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [instructorFilter, setInstructorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minMarks, setMinMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const [selectedResult, setSelectedResult] = useState(null);

  const tokenRef = useRef(null);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    tokenRef.current = localStorage.getItem("adminToken");
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever filters change, fetch (with debounce for text search)
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1); // reset to first page on filter change
      fetchResults(1);
    }, 450);
    return () => clearTimeout(searchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    examFilter,
    instructorFilter,
    fromDate,
    toDate,
    minMarks,
    maxMarks,
    sortBy,
    sortDir,
    limit,
  ]);

  useEffect(() => {
    fetchResults(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function fetchResults(pageToUse = 1) {
    try {
      if (groupView) {
        // request summary
        await fetchSummary();
        return;
      }
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (examFilter) params.append("examID", examFilter);
      if (instructorFilter) params.append("instructorId", instructorFilter);
      if (fromDate) params.append("from", new Date(fromDate).toISOString());
      if (toDate) params.append("to", new Date(toDate).toISOString());
      if (minMarks) params.append("minMarks", minMarks);
      if (maxMarks) params.append("maxMarks", maxMarks);
      params.append("sortBy", sortBy);
      params.append("sortDir", sortDir);
      params.append("page", pageToUse);
      params.append("limit", limit);

      const token = tokenRef.current;
      const res = await shubukan_api.get(
        `/admin/results?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(res.data.data || []);
      setTotal(res.data.total || 0);
      setPage(res.data.page || pageToUse);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      // choose groupBy based on UI selection (for demo we group by examID)
      // you can expose groupBy as a dropdown for admin
      params.append("groupBy", "examID");
      if (fromDate) params.append("from", new Date(fromDate).toISOString());
      if (toDate) params.append("to", new Date(toDate).toISOString());
      params.append("limit", 200);

      const token = tokenRef.current;
      const res = await shubukan_api.get(
        `/admin/results/summary?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummary(res.data.summary || []);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    // export current page of results as CSV
    const rows = results.map((r) => ({
      id: r._id || "",
      studentName: r.student?.name || "",
      studentEmail: r.student?.email || "",
      instructorId: r.student?.instructorId || "",
      examID: r.exam?.examID || r.examID || "",
      examSet: r.exam?.examSet || "",
      examDate: r.exam?.examDate ? new Date(r.exam.examDate).toISOString() : "",
      marksObtained: r.marksObtained ?? "",
      totalMarks: r.exam?.totalMarks ?? "",
      correct: r.correctAnsCount ?? "",
      wrong: r.wrongAnsCount ?? "",
      submittedAt: r.submittedAt ? new Date(r.submittedAt).toISOString() : "",
    }));
    downloadCSV(`results_page${page}.csv`, rows);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Results</h2>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 md:col-span-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, email or examID..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Exams</option>
            {/* Lightweight client-side list from current results; for full lists create a /admin/exams route */}
            {[
              ...new Set(results.map((r) => r.exam?.examID).filter(Boolean)),
            ].map((id) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>

          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">All Instructors</option>
            {[
              ...new Set(
                results.map((r) => r.student?.instructorId).filter(Boolean)
              ),
            ].map((id) => (
              <option value={id} key={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center justify-end">
          <label className="text-sm">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <label className="text-sm">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex gap-2 items-center">
          <input
            placeholder="min marks"
            value={minMarks}
            onChange={(e) => setMinMarks(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <input
            placeholder="max marks"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            className="border rounded px-2 py-1 w-24"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="submittedAt">Submitted At</option>
            <option value="marksObtained">Marks</option>
            <option value="createdAt">Created</option>
            <option value="updatedAt">Updated</option>
            <option value="exam.examDate">Exam Date</option>
            <option value="student.name">Student Name</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>

        <div className="flex gap-2 items-center justify-end">
          <button
            onClick={() => {
              setGroupView(false);
              fetchResults(1);
            }}
            className="px-3 py-1 border rounded"
          >
            List
          </button>
          <button
            onClick={() => {
              setGroupView(true);
              fetchSummary();
            }}
            className="px-3 py-1 border rounded"
          >
            Group by Exam
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1 bg-slate-800 text-white rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-[30vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : groupView ? (
          <div className="grid gap-3">
            <h3 className="font-semibold">Grouped summary (by examID)</h3>
            {!summary || summary.length === 0 ? (
              <div className="text-gray-500">No groups found</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-3">
                {summary.map((g) => (
                  <div key={g._id} className="p-3 border rounded">
                    <div className="text-sm text-gray-600">Exam</div>
                    <div className="font-bold text-lg">{g._id}</div>
                    <div className="mt-2">
                      <div>
                        Submissions:{" "}
                        <span className="font-semibold">{g.count}</span>
                      </div>
                      <div>
                        Avg Marks:{" "}
                        <span className="font-semibold">
                          {Number(g.avgMarks).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        Min: {g.minMarks} Max: {g.maxMarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                {/* Top */}
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

                {/* Grid */}
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

                  <div className="col-span-1 sm:col-span-2 flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => setSelectedResult(r)}
                      className="px-3 py-1 border rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!groupView && total > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            Showing page {page} of {Math.ceil(total / limit)} — total {total}{" "}
            results
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded"
            >
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded"
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      {/* Modal for details */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">
                Result — {selectedResult.student?.name}
              </h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="px-2 py-1 border rounded"
              >
                Close
              </button>
            </div>
            <pre className="text-sm overflow-auto max-h-[60vh]">
              {JSON.stringify(selectedResult, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
