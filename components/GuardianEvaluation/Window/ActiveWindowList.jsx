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
        <p className="gef-empty">No evaluation window is currently open for your learners.</p>
      </Card>
    );
  }

  return (
    <div className="gef-stack">
      {data.map(({ window, learners }) => (
        <Card key={window._id} title={window.title}>
          <p className="gef-hint" style={{ marginBottom: 12 }}>
            Open until {new Date(window.endDate).toLocaleDateString()}
          </p>
          <div className="gef-list">
            {learners.map(({ learner, status, formId }) => (
              <div
                key={learner._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid var(--gef-line)",
                  borderRadius: 12,
                  background: "#fffdf8",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{learner.name}</div>
                  <StatusBadge status={status} />
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
