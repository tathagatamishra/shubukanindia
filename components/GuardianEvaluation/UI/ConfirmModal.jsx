"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="gef-section-note" style={{ marginBottom: 20 }}>
        {message}
      </p>
      <div className="gef-row">
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          {cancelLabel}
        </Button>
        <Button type="button" variant={variant} onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Please wait..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
