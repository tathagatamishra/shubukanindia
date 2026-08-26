"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card } from "../UI/Basics";
import Button from "../UI/Button";
import AddLearnerModal from "./AddLearnerModal";
import ConfirmModal from "../UI/ConfirmModal";

export default function LearnerList({ onChange }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLearner, setEditingLearner] = useState(null);
  const [removingLearner, setRemovingLearner] = useState(null);

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
    try {
      await shubukan_api.delete(`/guardian/learner/${id}`, { headers: authHeader });
      addToast("Learner removed", "success");
      fetchLearners();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not remove learner", "error");
    } finally {
      setRemovingLearner(null);
    }
  };

  return (
    <Card title="Your Learners">
      <p className="gef-section-note">
        A "learner" is one of your children training at Shubukan. Add each child here, linked to their dojo
        and instructor, so you can fill an evaluation form for them when one is open.
      </p>
      {loading ? (
        <p className="gef-hint">Loading...</p>
      ) : learners.length === 0 ? (
        <p className="gef-empty">No learners added yet. Add your first child below to get started.</p>
      ) : (
        <div className="gef-list">
          {learners.map((l) => (
            <div key={l._id} className="gef-row-card">
              <div>
                <div className="gef-row-card-title">{l.name}</div>
                <div className="gef-row-card-sub">
                  {l.dojoName} &middot; {l.instructorName}
                </div>
              </div>
              <div className="gef-row-card-actions">
                <Button variant="outline" size="sm" onClick={() => setEditingLearner(l)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setRemovingLearner(l)}>
                  Remove
                </Button>
              </div>
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
      <AddLearnerModal
        open={!!editingLearner}
        learner={editingLearner}
        onClose={() => setEditingLearner(null)}
        onCreated={fetchLearners}
      />
      <ConfirmModal
        open={!!removingLearner}
        onClose={() => setRemovingLearner(null)}
        onConfirm={() => handleRemove(removingLearner._id)}
        title="Remove Learner"
        message={`Remove ${removingLearner?.name || "this learner"}? This can't be undone.`}
        confirmLabel="Remove"
      />
    </Card>
  );
}
