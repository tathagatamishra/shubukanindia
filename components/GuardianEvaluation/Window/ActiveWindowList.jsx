"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, StatusBadge } from "../UI/Basics";
import Button from "../UI/Button";

// Mirrors the backend's own EDIT_WINDOW_MS (evaluationCtrl.js) - a submitted
// form stays editable for 5 minutes after submission, then locks for good.
const EDIT_WINDOW_MS = 5 * 60 * 1000;

// `refreshKey` is bumped by Dashboard.jsx whenever a learner is added,
// edited, or removed — which windows/learners show up here depends on that
// list (e.g. a changed instructor can add/remove which windows apply), so
// this needs to refetch too instead of going stale next to it.
export default function ActiveWindowList({ refreshKey }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    shubukan_api
      .get("/guardian/evaluation-window/active", { headers: authHeader })
      .then((res) => setData(res.data.data || []))
      .catch(() => addToast("Could not load evaluation windows", "error"))
      .finally(() => {
        // Only the very first fetch shows the "Checking..." placeholder — a
        // learner-triggered refresh swaps the data in silently instead of
        // flashing the whole section back to a loading state.
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          setLoading(false);
        }
      });
  }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drafts and not-yet-started forms are always editable; a submitted form
  // is only editable within EDIT_WINDOW_MS of its submittedAt timestamp.
  const canStillEdit = (status, submittedAt) => {
    if (status !== "submitted") return true;
    if (!submittedAt) return false;
    return Date.now() - new Date(submittedAt).getTime() <= EDIT_WINDOW_MS;
  };

  if (loading) return <p className="gef-hint">Checking for open evaluation windows...</p>;

  if (data.length === 0) {
    return (
      <Card title="Evaluation Form">
        <p className="gef-section-note" style={{ marginBottom: 0 }}>
          An "evaluation window" is a limited time period your instructor opens for submitting the form. There
          isn't one open right now - check back here, or watch your email, when your instructor starts one.
        </p>
      </Card>
    );
  }

  return (
    <div className="gef-stack">
      {data.map(({ window, learners }) => (
        <Card key={window._id} title={window.title}>
          <p className="gef-section-note">
            This form is open for submission until <strong className="text-[#c53a3a]">{new Date(window.endDate).toLocaleDateString()}</strong>.
            Pick a learner below to fill in, continue, or review their form.
          </p>
          <div className="gef-list">
            {learners.map(({ learner, status, submittedAt }) => {
              const editable = canStillEdit(status, submittedAt);
              return (
                <div key={learner._id} className="gef-row-card">
                  <div>
                    <div className="gef-row-card-title">{learner.name}</div>
                    <div style={{ marginTop: 4 }}>
                      <StatusBadge status={status} />
                    </div>
                  </div>
                  <div className="gef-row-card-actions">
                    {status === "submitted" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/guardian-evaluation/form/${learner._id}/${window._id}`)}
                      >
                        View
                      </Button>
                    ) : null}
                    {editable ? (
                      <Button
                        size="sm"
                        variant={status === "submitted" ? "outline" : "primary"}
                        onClick={() =>
                          router.push(`/guardian-evaluation/form/${learner._id}/${window._id}`)
                        }
                      >
                        {status === "pending" ? "Fill Form" : status === "draft" ? "Continue" : "Edit"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
