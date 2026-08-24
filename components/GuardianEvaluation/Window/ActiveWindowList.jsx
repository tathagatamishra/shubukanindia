"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, StatusBadge } from "../UI/Basics";
import Button from "../UI/Button";

export default function ActiveWindowList() {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shubukan_api
      .get("/guardian/evaluation-window/active", { headers: authHeader })
      .then((res) => setData(res.data.data || []))
      .catch(() => addToast("Could not load evaluation windows", "error"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p className="gef-hint">Checking for open evaluation windows...</p>;

  if (data.length === 0) {
    return (
      <Card title="Evaluation Form">
        <p className="gef-section-note" style={{ marginBottom: 0 }}>
          An "evaluation window" is a limited time period your instructor opens for submitting the form. There
          isn't one open right now — check back here, or watch your email, when your instructor starts one.
        </p>
      </Card>
    );
  }

  return (
    <div className="gef-stack">
      {data.map(({ window, learners }) => (
        <Card key={window._id} title={window.title}>
          <p className="gef-section-note">
            This form is open for submission until <strong>{new Date(window.endDate).toLocaleDateString()}</strong>.
            Pick a learner below to fill in, continue, or review their form.
          </p>
          <div className="gef-list">
            {learners.map(({ learner, status, formId }) => (
              <div key={learner._id} className="gef-row-card">
                <div>
                  <div className="gef-row-card-title">{learner.name}</div>
                  <div style={{ marginTop: 4 }}>
                    <StatusBadge status={status} />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={status === "submitted" ? "outline" : "primary"}
                  onClick={() =>
                    router.push(`/guardian-evaluation/form/${learner._id}/${window._id}`)
                  }
                >
                  {status === "submitted" ? "View / Edit" : status === "draft" ? "Continue" : "Fill Form"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
