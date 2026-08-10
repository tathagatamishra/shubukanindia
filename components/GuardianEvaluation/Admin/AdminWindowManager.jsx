"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import { Field, TextInput, ChipMultiSelect } from "../UI/FormFields";
import Button from "../UI/Button";

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
    if (!confirm("Close this window early?")) return;
    try {
      await shubukan_api.patch(`/admin/evaluation-window/${id}/close`, {}, { headers: { Authorization: `Bearer ${token}` } });
      addToast("Window closed", "success");
      refreshWindows();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not close window", "error");
    }
  };

  if (loading) return <p className="gef-hint">Loading...</p>;
  if (!token) {
    return (
      <div className="gef-container">
        <Card>
          <p className="gef-empty">
            Please log in at <a href="/admin/login" style={{ color: "var(--gef-vermillion)" }}>/admin/login</a> first.
          </p>
        </Card>
      </div>
    );
  }

  const instructorNames = new Map(instructors.map((i) => [i.instructorId, i.name]));

  return (
    <div className="gef-container">
      <Stamp>Admin</Stamp>
      <h1 className="gef-title">Evaluation Windows</h1>
      <p className="gef-subtitle">Open the Guardian Evaluation Form portal for one or more instructors.</p>
      <Divider />

      <Card title="Open a New Window">
        <form onSubmit={handleCreate} className="gef-stack">
          <Field label="Title" required>
            <TextInput value={title} onChange={setTitle} placeholder="e.g. Q1 2026 Evaluation" />
          </Field>
          <div className="gef-row">
            <Field label="Start Date" required>
              <TextInput type="date" value={startDate} onChange={setStartDate} />
            </Field>
            <Field label="End Date" required>
              <TextInput type="date" value={endDate} onChange={setEndDate} />
            </Field>
          </div>
          <Field label="Instructors" required hint="Select one or more">
            <ChipMultiSelect
              value={selectedCodes}
              onChange={setSelectedCodes}
              options={instructors.map((i) => i.instructorId)}
            />
            {instructors.length > 0 ? (
              <p className="gef-hint" style={{ marginTop: 6 }}>
                {instructors.map((i) => `${i.instructorId} = ${i.name}`).join(" | ")}
              </p>
            ) : null}
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
                <div key={w._id} style={{ padding: "10px 12px", border: "1px solid var(--gef-line)", borderRadius: 12, background: "#fffdf8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{w.title}</div>
                      <div className="gef-hint">
                        {new Date(w.startDate).toLocaleDateString()} - {new Date(w.endDate).toLocaleDateString()}
                      </div>
                      <div className="gef-hint">
                        Instructors: {w.instructorCodes.map((c) => instructorNames.get(c) || c).join(", ")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className={`gef-badge ${isOpen ? "gef-badge--submitted" : "gef-badge--pending"}`}>
                        {isOpen ? "Open" : "Closed"}
                      </span>
                      {isOpen ? (
                        <div style={{ marginTop: 8 }}>
                          <Button size="sm" variant="danger" onClick={() => handleCloseEarly(w._id)}>
                            Close Early
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
