"use client";
import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import Modal from "../UI/Modal";
import { Field, TextInput, ChipMultiSelect } from "../UI/FormFields";
import Button from "../UI/Button";

const toDateInputValue = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export default function EditWindowModal({ open, onClose, evaluationWindow, instructors, token, onUpdated }) {
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !evaluationWindow) return;
    setTitle(evaluationWindow.title || "");
    setStartDate(toDateInputValue(evaluationWindow.startDate));
    setEndDate(toDateInputValue(evaluationWindow.endDate));
    setSelectedCodes(evaluationWindow.instructorCodes || []);
  }, [open, evaluationWindow]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate || selectedCodes.length === 0) {
      return addToast("Please fill title, dates and select at least one instructor", "warning");
    }
    setSaving(true);
    try {
      const res = await shubukan_api.put(
        `/admin/evaluation-window/${evaluationWindow._id}`,
        { title, startDate, endDate, instructorCodes: selectedCodes },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      addToast("Window updated", "success");
      onUpdated?.(res.data.data);
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || "Could not update window", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Window">
      <form onSubmit={handleSubmit} className="gef-stack">
        <Field label="Title" required hint="Shown to guardians, e.g. what this evaluation round is for">
          <TextInput value={title} onChange={setTitle} placeholder="e.g. Q1 2026 Evaluation" />
        </Field>
        <div className="gef-row">
          <Field label="Start Date" required>
            <TextInput type="date" value={startDate} onChange={setStartDate} />
          </Field>
          <Field label="End Date" required hint="The form locks automatically after this date">
            <TextInput type="date" value={endDate} onChange={setEndDate} />
          </Field>
        </div>
        <Field label="Instructors" required hint="Only guardians of students under these instructors will be notified">
          <ChipMultiSelect
            value={selectedCodes}
            onChange={setSelectedCodes}
            options={instructors.map((i) => ({ value: i.instructorId, label: i.name }))}
          />
        </Field>
        <div className="gef-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
