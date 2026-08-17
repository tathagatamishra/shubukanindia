"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import Modal from "../UI/Modal";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";

export default function AddLearnerModal({ open, onClose, onCreated }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingCards(true);
    shubukan_api
      .get("/guardian/dojo-instructor-directory", { headers: authHeader })
      .then((res) => setCards(res.data.data || []))
      .catch(() => addToast("Could not load dojo list", "error"))
      .finally(() => {
        setLoadingCards(false);
      });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected)
      return addToast("Please select a dojo and instructor", "warning");
    if (!name.trim())
      return addToast("Please enter the learner's name", "warning");

    setSaving(true);
    try {
      const res = await shubukan_api.post(
        "/guardian/learner",
        {
          name,
          dojoId: selected.dojoId,
          dojoName: selected.dojoName,
          instructorName: selected.instructorName,
          instructorCode: selected.instructorCode,
        },
        { headers: authHeader },
      );
      addToast("Learner added", "success");
      onCreated?.(res.data.data);
      setName("");
      setSelected(null);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not add learner", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add a Learner">
      <form onSubmit={handleSubmit} className="gef-stack">
        <Field label="Learner's Name" required>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="Child's name"
            required
          />
        </Field>

        <Field
          label="Select Dojo & Instructor"
          required
          hint="Choose the dojo card that matches your child"
        >
          {loadingCards ? (
            <p className="gef-hint">Loading dojos...</p>
          ) : cards.length === 0 ? (
            <p className="gef-hint">No dojos found.</p>
          ) : (
            <div className="gef-card-grid">
              {cards.map(
                (c, i) =>
                  c.instructorCode && (
                    <div
                      key={i}
                      className={`gef-picker-card ${selected === c ? "active" : ""}`}
                      onClick={() => setSelected(c)}
                    >
                      {c.profileImage ? (
                        <img src={c.profileImage} alt={c.dojoName} />
                      ) : (
                        <div
                          style={{
                            height: 64,
                            marginBottom: 8,
                            borderRadius: 8,
                            background: "var(--gef-line)",
                          }}
                        />
                      )}
                      <div className="gef-picker-card-name">{c.dojoName}</div>
                      <div className="gef-picker-card-sub">
                        {c.instructorName}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </Field>

        <div className="gef-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Adding..." : "Add Learner"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
