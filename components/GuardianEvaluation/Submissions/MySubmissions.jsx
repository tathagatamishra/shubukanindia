"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, StatusBadge, Stamp, Divider } from "../UI/Basics";
import Button from "../UI/Button";
import { downloadFormPdfByRole, viewFormPdfByRole } from "../UI/downloadPdf";

const EDIT_WINDOW_MS = 5 * 60 * 1000;

export default function MySubmissions() {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shubukan_api
      .get("/guardian/evaluation-form", { headers: authHeader })
      .then((res) => setForms(res.data.data || []))
      .catch(() => addToast("Could not load your submissions", "error"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async (form) => {
    try {
      await downloadFormPdfByRole("guardian", form._id, authHeader, `evaluation-${form.student?.name || form._id}.pdf`);
    } catch (err) {
      addToast("Could not download PDF", "error");
    }
  };

  const handleView = async (form) => {
    try {
      await viewFormPdfByRole("guardian", form._id, authHeader);
    } catch (err) {
      addToast(err.message || "Could not open PDF", "error");
    }
  };

  const canEdit = (form) => {
    if (form.status === "draft") return true;
    return Date.now() - new Date(form.submittedAt).getTime() <= EDIT_WINDOW_MS;
  };

  return (
    <div className="gef-container">
      <h1 className="gef-title">My Submissions</h1>
      <p className="gef-subtitle">All evaluation forms you have started or submitted.</p>
      <Divider />

      {loading ? (
        <p className="gef-hint">Loading...</p>
      ) : forms.length === 0 ? (
        <Card>
          <p className="gef-empty">No forms yet. Fill one from your dashboard when a window is open.</p>
        </Card>
      ) : (
        <div className="gef-stack">
          {forms.map((f) => (
            <Card key={f._id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{f.student?.name || "Unnamed"}</div>
                  <StatusBadge status={f.status} />
                  <div className="gef-hint" style={{ marginTop: 6 }}>
                    {f.status === "submitted"
                      ? `Submitted ${new Date(f.submittedAt).toLocaleString()}`
                      : "Not yet submitted"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {canEdit(f) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/guardian-evaluation/form/${f.learnerId}/${f.windowId}`)}
                    >
                      Edit
                    </Button>
                  ) : null}
                  {f.status === "submitted" ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleView(f)}>
                        View
                      </Button>
                      <Button size="sm" variant="gold" onClick={() => handleDownload(f)}>
                        Download PDF
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
