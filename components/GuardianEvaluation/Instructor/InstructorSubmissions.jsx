"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import Button from "../UI/Button";
import { downloadFormPdfByRole } from "../UI/downloadPdf";
import InstructorLogin from "./InstructorLogin";

export default function InstructorSubmissions() {
  const { addToast } = useToast();
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadForms = (t) => {
    setLoading(true);
    shubukan_api
      .get("/instructor/evaluation-form", { headers: { Authorization: `Bearer ${t}` } })
      .then((res) => setForms(res.data.data || []))
      .catch(() => addToast("Could not load your students' submissions", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = localStorage.getItem("instructor_token");
    setToken(t);
    setChecked(true);
    if (t) loadForms(t);
    else setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async (form) => {
    try {
      await downloadFormPdfByRole(
        "instructor",
        form._id,
        { Authorization: `Bearer ${token}` },
        `evaluation-${form.student?.name || form._id}.pdf`
      );
    } catch (err) {
      addToast("Could not download PDF", "error");
    }
  };

  if (!checked || loading) return <p className="gef-hint">Loading...</p>;

  if (!token) {
    return (
      <InstructorLogin
        onLoggedIn={() => {
          const t = localStorage.getItem("instructor_token");
          setToken(t);
          loadForms(t);
        }}
      />
    );
  }

  return (
    <div className="gef-container">
      <Stamp>Instructor</Stamp>
      <h1 className="gef-title">Your Students' Evaluations</h1>
      <p className="gef-subtitle">Submitted Guardian Evaluation Forms for your learners.</p>
      <Divider />

      {forms.length === 0 ? (
        <Card>
          <p className="gef-empty">No submitted forms for your students yet.</p>
        </Card>
      ) : (
        <div className="gef-stack">
          {forms.map((f) => (
            <Card key={f._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{f.student?.name}</div>
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
