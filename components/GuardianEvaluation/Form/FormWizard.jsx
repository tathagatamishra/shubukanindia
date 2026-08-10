"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Stamp, Divider, StatusBadge } from "../UI/Basics";
import Button from "../UI/Button";
import StepStudent from "./StepStudent";
import StepSleepFood from "./StepSleepFood";
import StepPhysical from "./StepPhysical";
import StepTeacher from "./StepTeacher";
import StepTraining from "./StepTraining";
import { emptyEvaluationForm, mergeIntoDefaults } from "./emptyForm";

const STEPS = ["Student", "Sleep & Food", "Physical", "Teacher", "Training & Signature"];

export default function FormWizard({ learnerId, windowId }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyEvaluationForm());
  const [status, setStatus] = useState("pending");
  const [learner, setLearner] = useState(null);
  const [windowInfo, setWindowInfo] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const activeRes = await shubukan_api.get("/guardian/evaluation-window/active", { headers: authHeader });
        const match = (activeRes.data.data || []).find((w) => w.window._id === windowId);
        if (!match) {
          addToast("This evaluation window is not open for this learner", "error");
          router.push("/guardian-evaluation");
          return;
        }
        setWindowInfo(match.window);
        const learnerEntry = match.learners.find((l) => l.learner._id === learnerId);
        setLearner(learnerEntry?.learner || null);

        if (learnerEntry?.formId) {
          const formRes = await shubukan_api.get(`/guardian/evaluation-form/${learnerEntry.formId}`, { headers: authHeader });
          setData(mergeIntoDefaults(formRes.data.data));
          setStatus(formRes.data.data.status);
        } else {
          setStatus("pending");
        }
      } catch (err) {
        addToast(err.response?.data?.message || "Could not load form", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [learnerId, windowId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveDraft = async (silent = false) => {
    setSaving(true);
    try {
      const res = await shubukan_api.put(`/guardian/evaluation-form/${learnerId}/${windowId}`, data, { headers: authHeader });
      setStatus(res.data.data.status);
      if (!silent) addToast("Draft saved", "success");
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Could not save draft", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const ok = await saveDraft(true);
    if (ok && step < STEPS.length - 1) setStep(step + 1);
  };

  const handleSubmit = async () => {
    const savedOk = await saveDraft(true);
    if (!savedOk) return;
    setSubmitting(true);
    try {
      await shubukan_api.post(`/guardian/evaluation-form/${learnerId}/${windowId}/finalize`, {}, { headers: authHeader });
      addToast("Form submitted successfully", "success");
      setStatus("submitted");
      router.push("/guardian-evaluation/submissions");
    } catch (err) {
      const missing = err.response?.data?.missingFields;
      addToast(
        err.response?.data?.message + (missing ? `: ${missing.length} field(s) missing` : "") || "Could not submit form",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="gef-hint">Loading form...</p>;

  const StepComponent = [StepStudent, StepSleepFood, StepPhysical, StepTeacher, StepTraining][step];

  return (
    <div className="gef-container">
      <Stamp>{windowInfo?.title}</Stamp>
      <h1 className="gef-title">Guardian Evaluation Form</h1>
      <p className="gef-subtitle">
        For <strong>{learner?.name}</strong> &middot; <StatusBadge status={status} />
      </p>
      <Divider />

      <div className="gef-progress">
        {STEPS.map((_, i) => (
          <div key={i} className={`gef-progress-step ${i < step ? "done" : i === step ? "current" : ""}`} />
        ))}
      </div>
      <p className="gef-hint" style={{ marginBottom: 6 }}>
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <StepComponent data={data} setData={setData} learner={learner} />

      <div className="gef-nav">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outline" disabled={saving} onClick={() => saveDraft(false)}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="primary" disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Submitting..." : "Submit Form"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
