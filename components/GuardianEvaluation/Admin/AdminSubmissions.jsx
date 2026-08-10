"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import Button from "../UI/Button";
import { downloadFormPdfByRole } from "../UI/downloadPdf";

export default function AdminSubmissions() {
  const { addToast } = useToast();
  const [token, setToken] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    setToken(t);
    if (!t) {
      setLoading(false);
      return;
    }
    shubukan_api
      .get("/admin/evaluation-form", { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => setForms(res.data.data || []))
      .catch(() => addToast("Could not load submissions", "error"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async (form) => {
    try {
      await downloadFormPdfByRole(
        "admin",
        form._id,
        { Authorization: `Bearer ${token}` },
        `evaluation-${form.student?.name || form._id}.pdf`
      );
    } catch (err) {
      addToast("Could not download PDF", "error");
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

  return (
    <div className="gef-container">
      <Stamp>Admin</Stamp>
      <h1 className="gef-title">All Submitted Forms</h1>
      <p className="gef-subtitle">Draft forms are never shown here &mdash; only fully submitted evaluations.</p>
      <Divider />

      {forms.length === 0 ? (
        <Card>
          <p className="gef-empty">No submitted forms yet.</p>
        </Card>
      ) : (
        <div className="gef-stack">
          {forms.map((f) => (
            <Card key={f._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{f.student?.name}</div>
                  <div className="gef-hint">
                    {f.student?.dojoName} &middot; {f.student?.instructorName}
                  </div>
                  <div className="gef-hint">Submitted {new Date(f.submittedAt).toLocaleString()}</div>
                </div>
                <Button size="sm" variant="gold" onClick={() => handleDownload(f)}>
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
