"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card } from "../UI/Basics";
import Button from "../UI/Button";
import PdfViewerModal from "../UI/PdfViewerModal";
import { downloadFormPdfByRole, getFormPdfBlobUrl } from "../UI/downloadPdf";

// Auth (unauthenticated + unauthorized) is gated one level up by
// app/guardian-evaluation/admin/layout.js - by the time this mounts, adminToken
// is guaranteed present and valid.
export default function AdminSubmissions() {
  const { addToast } = useToast();
  const [token, setToken] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState(null);
  const [pdfModal, setPdfModal] = useState(null); // { url, title }

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

  const handleView = async (form) => {
    setViewingId(form._id);
    try {
      const url = await getFormPdfBlobUrl("admin", form._id, { Authorization: `Bearer ${token}` });
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

  if (loading) return <p className="gef-hint">Loading...</p>;

  return (
    <div className="gef-stack">
      <p className="gef-section-note" style={{ marginBottom: 0 }}>
        Every evaluation form guardians have finished and submitted, across every dojo and instructor. Drafts
        guardians haven't submitted yet are never shown here.
      </p>

      {forms.length === 0 ? (
        <Card>
          <p className="gef-empty">No submitted forms yet.</p>
        </Card>
      ) : (
        <div className="gef-stack">
          {forms.map((f) => (
            <div key={f._id} className="gef-row-card">
              <div>
                <div className="gef-row-card-title">{f.student?.name}</div>
                <div className="gef-row-card-sub">
                  {f.student?.dojoName} &middot; {f.student?.instructorName}
                </div>
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
