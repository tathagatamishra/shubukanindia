"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card } from "../UI/Basics";
import { Field, TextInput, ChipMultiSelect } from "../UI/FormFields";
import Button from "../UI/Button";
import EditWindowModal from "./EditWindowModal";
import ConfirmModal from "../UI/ConfirmModal";

// Auth (unauthenticated + unauthorized) is gated one level up by
// app/guardian-evaluation/admin/layout.js — by the time this mounts, adminToken
// is guaranteed present and valid.
export default function AdminWindowManager() {
  const { addToast } = useToast();
  const [token, setToken] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [editingWindow, setEditingWindow] = useState(null);
  const [closingWindow, setClosingWindow] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    setToken(t);
    if (!t) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${t}` };
    Promise.all([
      shubukan_api.get("/admin/instructors", { headers }),
      shubukan_api.get("/admin/evaluation-window", { headers }),
    ])
      .then(([instRes, winRes]) => {
        setInstructors(instRes.data.instructors || []);
        setWindows(winRes.data.data || []);
      })
      .catch(() => addToast("Could not load admin data", "error"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshWindows = () => {
    const headers = { Authorization: `Bearer ${token}` };
    shubukan_api.get("/admin/evaluation-window", { headers }).then((res) => setWindows(res.data.data || []));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || selectedCodes.length === 0) {
      return addToast("Please fill title, dates and select at least one instructor", "warning");
    }
    setCreating(true);
    try {
      await shubukan_api.post(
        "/admin/evaluation-window",
        { title, startDate, endDate, instructorCodes: selectedCodes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Evaluation window opened and guardians notified", "success");
      setTitle("");
      setStartDate("");
      setEndDate("");
      setSelectedCodes([]);
      refreshWindows();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not create window", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleCloseEarly = async (id) => {
    try {
      await shubukan_api.patch(`/admin/evaluation-window/${id}/close`, {}, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Window closed", "success");
      refreshWindows();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not close window", "error");
    } finally {
      setClosingWindow(null);
    }
  };

  if (loading) return <p className="gef-hint">Loading...</p>;

  const instructorNames = new Map(instructors.map((i) => [i.instructorId, i.name]));

  return (
    <div className="gef-stack">
      <Card title="Open a New Window">
        <p className="gef-section-note">
          Opening a window emails every guardian whose child trains under the instructors you select, inviting
          them to fill the evaluation form before it closes.
        </p>
        <form onSubmit={handleCreate} className="gef-stack">
          <Field label="Title" required hint="Shown to guardians, e.g. what this evaluation round is for">
            <TextInput value={title} onChange={setTitle} placeholder="e.g. Q1 2026 Evaluation" />
          </Field>
          <div className="gef-row">
            <Field label="Start Date" required>
              <TextInput type="date" value={startDate} onChange={setStartDate} />
            </Field>
            <Field label="End Date" required hint="The form locks automatically after this date">
              <TextInput type="date" value={endDate} onChange={setEndDate} />
            </Field>
          </div>
          <Field label="Instructors" required hint="Only guardians of students under these instructors will be notified">
            <ChipMultiSelect
              value={selectedCodes}
              onChange={setSelectedCodes}
              options={instructors.map((i) => ({ value: i.instructorId, label: i.name }))}
            />
          </Field>
          <Button type="submit" variant="primary" block disabled={creating}>
            {creating ? "Opening..." : "Open Window & Notify Guardians"}
          </Button>
        </form>
      </Card>

      <Card title="All Windows">
        {windows.length === 0 ? (
          <p className="gef-empty">No windows scheduled yet.</p>
        ) : (
          <div className="gef-list">
            {windows.map((w) => {
              const now = Date.now();
              const isOpen = !w.closedEarly && now >= new Date(w.startDate).getTime() && now <= new Date(w.endDate).getTime();
              return (
                <div key={w._id} className="gef-row-card" style={{ alignItems: "flex-start" }}>
                  <div>
                    <div className="gef-row-card-title">{w.title}</div>
                    <div className="gef-row-card-sub">
                      {new Date(w.startDate).toLocaleDateString()} - {new Date(w.endDate).toLocaleDateString()}
                    </div>
                    <div className="gef-row-card-sub">
                      Instructors: {w.instructorCodes.map((c) => instructorNames.get(c) || c).join(", ")}
                    </div>
                    <span
                      className={`gef-badge ${isOpen ? "gef-badge--submitted" : "gef-badge--pending"}`}
                      style={{ marginTop: 8, display: "inline-block" }}
                    >
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                  {isOpen ? (
                    <div className="gef-row-card-actions">
                      <Button size="sm" variant="outline" onClick={() => setEditingWindow(w)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setClosingWindow(w)}>
                        Close Early
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <EditWindowModal
        open={!!editingWindow}
        evaluationWindow={editingWindow}
        instructors={instructors}
        token={token}
        onClose={() => setEditingWindow(null)}
        onUpdated={refreshWindows}
      />

      <ConfirmModal
        open={!!closingWindow}
        onClose={() => setClosingWindow(null)}
        onConfirm={() => handleCloseEarly(closingWindow._id)}
        title="Close Window Early"
        message={`Close "${closingWindow?.title || "this window"}" now? Guardians won't be able to submit or edit forms for it anymore.`}
        confirmLabel="Close Early"
      />
    </div>
  );
}