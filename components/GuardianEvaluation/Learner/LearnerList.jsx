"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card } from "../UI/Basics";
import Button from "../UI/Button";
import AddLearnerModal from "./AddLearnerModal";

export default function LearnerList({ onChange }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLearners = () => {
    setLoading(true);
    shubukan_api
      .get("/guardian/learner", { headers: authHeader })
      .then((res) => {
        setLearners(res.data.data || []);
        onChange?.(res.data.data || []);
      })
      .catch(() => addToast("Could not load learners", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLearners();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = async (id) => {
    if (!confirm("Remove this learner?")) return;
    try {
      await shubukan_api.delete(`/guardian/learner/${id}`, { headers: authHeader });
      addToast("Learner removed", "success");
      fetchLearners();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not remove learner", "error");
    }
  };

  return (
    <Card title="Your Learners">
      {loading ? (
        <p className="gef-hint">Loading...</p>
      ) : learners.length === 0 ? (
        <p className="gef-empty">No learners added yet.</p>
      ) : (
        <div className="gef-list">
          {learners.map((l) => (
            <div
              key={l._id}
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
                <div style={{ fontWeight: 700 }}>{l.name}</div>
                <div className="gef-hint">
                  {l.dojoName} &middot; {l.instructorName}
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleRemove(l._id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 14 }}>
        <Button variant="gold" block onClick={() => setModalOpen(true)}>
          + Add Learner
        </Button>
      </div>
      <AddLearnerModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={fetchLearners} />
    </Card>
  );
}
