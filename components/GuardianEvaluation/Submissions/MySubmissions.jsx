"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, StatusBadge, Stamp, Divider } from "../UI/Basics";
import Button from "../UI/Button";
import GefBrowserTabs from "../UI/GefBrowserTabs";
import { downloadFormPdfByRole } from "../UI/downloadPdf";
import { useEditWindowTime } from "../Form/useEditWindowTime";

export default function MySubmissions() {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useEditWindowTime(forms.map((form) => form.editableUntil));

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

  return (
    <div className="gef-container">
      <h1 className="gef-title">My Submissions</h1>
      <p className="gef-subtitle">Every evaluation form you've started or submitted, across all your learners.</p>
      <Divider />

      <GefBrowserTabs />
      <div className="gef-tab-panel">
        {loading ? (
          <p className="gef-hint">Loading...</p>
        ) : forms.length === 0 ? (
          <Card>
            <p className="gef-empty">No forms yet. Fill one from your dashboard when a window is open.</p>
          </Card>
        ) : (
          <div className="gef-stack">
            {forms.map((f) => {
              const deadline = Date.parse(f.editableUntil);
              const canEditSubmission = f.status === "submitted" && now < deadline;
              return (
                <Card key={f._id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{f.student?.name || "Unnamed"}</div>
                      <div style={{ marginTop: 4 }}>
                        <StatusBadge status={f.status} />
                      </div>
                      <div className="gef-hint" style={{ marginTop: 6 }}>
                        {f.status === "submitted"
                          ? `Submitted ${new Date(f.submittedAt).toLocaleString()}`
                          : "Draft saved - pick up where you left off"}
                      </div>
                      {canEditSubmission ? (
                        <div className="gef-hint" style={{ marginTop: 2, color: "var(--gef-vermillion)" }}>
                          Editable until {new Date(deadline).toLocaleString(undefined, {
                            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                          })}
                        </div>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {f.status === "draft" || canEditSubmission ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/guardian-evaluation/form/${f.learnerId}/${f.windowId}`)}
                        >
                          {f.status === "draft" ? "Continue" : "Edit"}
                        </Button>
                      ) : null}
                      {f.status === "submitted" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/guardian-evaluation/form/${f.learnerId}/${f.windowId}`)}
                          >
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
