"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import Button from "../UI/Button";
import PdfViewerModal from "../UI/PdfViewerModal";
import { downloadFormPdfByRole, getFormPdfBlobUrl } from "../UI/downloadPdf";
import Loader from "@/components/UIComponent/Loader/Loader";

export default function InstructorSubmissions() {
  const router = useRouter();
  const { addToast } = useToast();
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);
  const [pdfModal, setPdfModal] = useState(null); // { url, title }

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

  const handleView = async (form) => {
    setViewingId(form._id);
    try {
      const url = await getFormPdfBlobUrl("instructor", form._id, { Authorization: `Bearer ${token}` });
      setPdfModal({ url, title: `${form.student?.name || "Evaluation"}'s Evaluation Form` });
    } catch (err) {
      addToast(err.response?.data?.message || "Could not load PDF", "error");
    } finally {
      setViewingId(null);
    }
  };

  const closePdfModal = () => {
    if (pdfModal?.url) window.URL.revokeObjectURL(pdfModal.url);
    setPdfModal(null);
  };

  useEffect(() => {
    if (checked && !token) {
      router.replace("/guardian-evaluation/instructor/login");
    }
  }, [checked, token, router]);

  if (!checked || loading || !token) return <Loader loading />;

  const handleLogout = () => {
    localStorage.removeItem("instructor_token");
    setToken(null);
    setForms([]);
  };

  return (
    <div className="gef-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h1 className="gef-title">Your Students' Evaluations</h1>
          <p className="gef-subtitle">
            Guardian evaluation forms submitted for students training under you. Use these to understand each
            student's habits and needs outside the dojo.
          </p>
        </div>
        {/* <Button size="sm" variant="outline" onClick={handleLogout}>
          Log Out
        </Button> */}
      </div>
      <Divider />

      {forms.length === 0 ? (
        <Card>
          <p className="gef-empty">No submitted forms for your students yet.</p>
        </Card>
      ) : (
        <div className="gef-stack">
          {forms.map((f) => (
            <div key={f._id} className="gef-row-card">
              <div>
                <div className="gef-row-card-title">{f.student?.name}</div>
                <div className="gef-row-card-sub">Submitted {new Date(f.submittedAt).toLocaleString()}</div>
              </div>
              <div className="gef-row-card-actions">
                <Button size="sm" variant="outline" disabled={viewingId === f._id} onClick={() => handleView(f)}>
                  {viewingId === f._id ? "Loading..." : "View"}
                </Button>
                <Button size="sm" variant="gold" onClick={() => handleDownload(f)}>
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PdfViewerModal open={!!pdfModal} onClose={closePdfModal} pdfUrl={pdfModal?.url} title={pdfModal?.title} />
    </div>
  );
}
