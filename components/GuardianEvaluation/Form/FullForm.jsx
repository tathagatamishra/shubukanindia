"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { useFormFontSize } from "../Context/FormFontSizeContext";
import { Divider, StatusBadge, SectionHeading } from "../UI/Basics";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { Field, TextInput, TextArea, Select, YesNo, ChipMultiSelect, DailyOrBeforeExam, OrDivider, ReadOnlyProvider } from "../UI/FormFields";
import BeltRankSelect from "../UI/BeltRankSelect";
import { emptyEvaluationForm, mergeIntoDefaults } from "./emptyForm";
import { bi } from "../i18n/labels";

const TRAINING_AREAS = [bi("kihon"), bi("kata"), bi("idoKihon"), bi("kumite"), bi("theory")];
const TRAINING_NEEDED = [
  bi("dojoTraining"),
  bi("districtCamp"),
  bi("stateCamp"),
  bi("nationalCamp"),
  bi("seminar"),
  bi("internationalSession"),
];

// Mirrors the backend's own EDIT_WINDOW_MS (evaluationCtrl.js) — a submitted
// form stays editable for 5 minutes after submission, then locks for good
// and this page renders read-only instead (see `readOnly` below).
const EDIT_WINDOW_MS = 5 * 60 * 1000;

export default function FullForm({ learnerId, windowId }) {
  const { authHeader } = useGuardianAuth();
  const { fontSize } = useFormFontSize();
  const { addToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState(emptyEvaluationForm());
  const [status, setStatus] = useState("pending");
  const [submittedAt, setSubmittedAt] = useState(null);
  const [learner, setLearner] = useState(null);
  const [draftSavedModalOpen, setDraftSavedModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Loads the learner and the (learnerId, windowId) form independently
        // of whether the evaluation window is still open — the old approach
        // only looked inside /guardian/evaluation-window/active, so viewing
        // an already-submitted form after its window closed (the common
        // case for anything but a very recent submission) would fail with
        // "not open for this learner" even though the guardian is only
        // trying to *view* it, never fill or edit it. Any actual write
        // (draft save / finalize) is still fully guarded server-side.
        const [learnersRes, formsRes] = await Promise.all([
          shubukan_api.get("/guardian/learner", { headers: authHeader }),
          shubukan_api.get("/guardian/evaluation-form", { headers: authHeader }),
        ]);

        const learnerData = (learnersRes.data.data || []).find((l) => l._id === learnerId) || null;
        if (!learnerData) {
          addToast("Learner not found", "error");
          router.push("/guardian-evaluation");
          return;
        }
        setLearner(learnerData);

        const existingForm = (formsRes.data.data || []).find(
          (f) => f.learnerId === learnerId && f.windowId === windowId
        );

        let formData;
        if (existingForm) {
          formData = mergeIntoDefaults(existingForm);
          setStatus(existingForm.status);
          setSubmittedAt(existingForm.submittedAt || null);
        } else {
          formData = emptyEvaluationForm();
          setStatus("pending");
        }

        // instructor/dojo are read-only fields sourced from the learner
        // record (guardian edits them via "Edit Learner" on the dashboard,
        // not here) — keep them in sync with the live learner on every load.
        formData = {
          ...formData,
          student: {
            ...formData.student,
            instructorName: learnerData.instructorName || "",
            dojoName: learnerData.dojoName || "",
          },
        };
        setData(formData);
      } catch (err) {
        addToast(err.response?.data?.message || "Could not load form", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [learnerId, windowId]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = data.student;
  const t = data.teacher;
  const tr = data.training;

  // A submitted form is only editable within EDIT_WINDOW_MS of submission;
  // past that (or for a form loaded purely to review it), every field
  // renders locked and Save/Submit disappear — "View" and "Edit" both land
  // here now, this just decides which one it behaves as.
  const withinEditWindow = submittedAt ? Date.now() - new Date(submittedAt).getTime() <= EDIT_WINDOW_MS : false;
  const readOnly = status === "submitted" && !withinEditWindow;

  const patchStudent = (p) => setData((d) => ({ ...d, student: { ...d.student, ...p } }));
  const patchFood = (p) => setData((d) => ({ ...d, student: { ...d.student, food: { ...d.student.food, ...p } } }));
  const patchTimes = (p) =>
    setData((d) => ({ ...d, student: { ...d.student, food: { ...d.student.food, times: { ...d.student.food.times, ...p } } } }));
  const patchTeacher = (p) => setData((d) => ({ ...d, teacher: { ...d.teacher, ...p } }));
  const patchTraining = (p) => setData((d) => ({ ...d, training: { ...d.training, ...p } }));
  const patchTrainingNested = (key, p) =>
    setData((d) => ({ ...d, training: { ...d.training, [key]: { ...d.training[key], ...p } } }));

  const tiffins = s.food?.otherTiffinTimes || [];
  const setTiffin = (no, time) => {
    const others = tiffins.filter((tt) => tt.no !== no);
    patchFood({ otherTiffinTimes: [...others, { no, time }].sort((a, b) => a.no.localeCompare(b.no)) });
  };

  const saveDraft = async (silent = false) => {
    setSaving(true);
    try {
      const res = await shubukan_api.put(`/guardian/evaluation-form/${learnerId}/${windowId}`, data, { headers: authHeader });
      setStatus(res.data.data.status);
      setSubmittedAt(res.data.data.submittedAt || null);
      // A toast is easy to miss and dismisses on its own — a guardian could
      // walk away thinking they're done. Saving a draft is a silent
      // "in-progress" state the instructor can't see, so the explicit
      // "Save Draft" click (never the silent auto-save before submit) gets a
      // modal they have to actively dismiss instead.
      if (!silent) setDraftSavedModalOpen(true);
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || "Could not save draft", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const savedOk = await saveDraft(true);
    if (!savedOk) return;
    setSubmitting(true);
    try {
      const res = await shubukan_api.post(`/guardian/evaluation-form/${learnerId}/${windowId}/finalize`, {}, { headers: authHeader });
      addToast("Form submitted successfully", "success");
      setStatus("submitted");
      setSubmittedAt(res.data.data.submittedAt);
      router.push("/guardian-evaluation/submissions");
    } catch (err) {
      const missing = err.response?.data?.missingFields;
      if (missing?.length) {
        // Name a handful of the actual missing questions rather than just a
        // count — "37 field(s) missing" tells the guardian nothing about
        // where to look. Longer message, so it gets more time on screen too.
        const PREVIEW_COUNT = 4;
        const preview = missing.slice(0, PREVIEW_COUNT).join(", ");
        const rest = missing.length - PREVIEW_COUNT;
        addToast(
          `Please fill in: ${preview}${rest > 0 ? `, and ${rest} more required field${rest === 1 ? "" : "s"}` : ""}.`,
          "error",
          8000
        );
      } else {
        addToast(err.response?.data?.message || "Could not submit form", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="gef-hint gef-container">Loading form...</p>;

  const ActionBar = () => (
    <div className="gef-nav" style={{ position: "sticky", bottom: 10, paddingTop: 10 }}>
      <Button variant="outline" disabled={saving} onClick={() => saveDraft(false)}>
        {saving ? "Saving..." : bi("saveDraft")}
      </Button>
      <Button variant="primary" disabled={submitting} onClick={handleSubmit}>
        {submitting ? "Submitting..." : bi("submitForm")}
      </Button>
    </div>
  );

  return (
    <div className="gef-container gef-doc gef-form-scale" style={{ fontSize: `${fontSize}px` }}>
      <h1 className="gef-title">{bi("formTitle")}</h1>
      <p className="gef-subtitle">
        <StatusBadge status={status} />
      </p>
      {readOnly ? (
        <p className="gef-section-note">
          This form has been submitted and can no longer be edited. This is a read-only copy of what was submitted.
        </p>
      ) : null}

      <ReadOnlyProvider value={readOnly}>
        <fieldset disabled={readOnly} className="gef-doc-body gef-fieldset-reset">
        {/* ===== FOR STUDENTS ===== */}
        <SectionHeading title={bi("studentSectionTitle")} instruction={bi("yesNoInstruction")} />

        <Field label={bi("studentName")} required>
          <TextInput value={s.name} onChange={(v) => patchStudent({ name: v })} placeholder={learner?.name} />
        </Field>
        <div className="gef-row">
          <Field label={bi("age")} required>
            <TextInput value={s.age} onChange={(v) => patchStudent({ age: v })} placeholder="e.g. 12" />
          </Field>
          <Field label={bi("dob")} required>
            <TextInput type="date" value={s.dob ? String(s.dob).slice(0, 10) : ""} onChange={(v) => patchStudent({ dob: v })} />
          </Field>
        </div>
        <Field label={bi("currentRank")} required>
          <BeltRankSelect value={s.currentRank} onChange={(v) => patchStudent({ currentRank: v })} />
        </Field>

        <div className="gef-row">
          <Field label={bi("instructor")}>
            <TextInput value={s.instructorName || ""} onChange={() => {}} disabled />
          </Field>
          <Field label={bi("dojo")}>
            <TextInput value={s.dojoName || ""} onChange={() => {}} disabled />
          </Field>
        </div>

        <p className="gef-doc-q">{bi("q1")}</p>
        <div className="gef-row">
          <Field label={bi("classOf")} required>
            <TextInput value={s.classOf} onChange={(v) => patchStudent({ classOf: v })} />
          </Field>
          <Field label={bi("board")} required>
            <TextInput value={s.board} onChange={(v) => patchStudent({ board: v })} />
          </Field>
        </div>
        <Field label={bi("q2")} required>
          <TextInput value={s.studyTime} onChange={(v) => patchStudent({ studyTime: v })} placeholder="e.g. 3 hours" />
        </Field>

        <Field label={bi("q3")} required>
          <DailyOrBeforeExam value={s.karatePractice} onChange={(v) => patchStudent({ karatePractice: v })} />
        </Field>
        <Field label={bi("q4")} required>
          <DailyOrBeforeExam value={s.karateNotes} onChange={(v) => patchStudent({ karateNotes: v })} />
        </Field>
        <Field label={bi("q5")} required>
          <TextInput value={s.otherArtsNames} onChange={(v) => patchStudent({ otherArtsNames: v })} />
        </Field>
        <Field label={bi("dailyPracticeTime")} required>
          <DailyOrBeforeExam value={s.otherArtsPractice} onChange={(v) => patchStudent({ otherArtsPractice: v })} />
        </Field>
        <Field label={bi("q6")} required>
          <TextInput value={s.physicalExerciseTime} onChange={(v) => patchStudent({ physicalExerciseTime: v })} placeholder="e.g. 30 min" />
        </Field>

        <Field label={bi("q7")} required>
          <YesNo
            value={s.screenDevice?.used}
            onChange={(v) => patchStudent({ screenDevice: { ...s.screenDevice, used: v } })}
            yesLabel={bi("yes")}
            noLabel={bi("no")}
          />
        </Field>
        {s.screenDevice?.used ? (
          <Field label="How?" required>
            <div className="gef-yesno-checks">
              <button
                type="button"
                className={`gef-checkbox-row ${s.screenDevice?.mode === "daily" ? "checked" : ""}`}
                onClick={() => patchStudent({ screenDevice: { ...s.screenDevice, mode: "daily" } })}
              >
                <span className="gef-checkbox-box">{s.screenDevice?.mode === "daily" ? <span className="gef-checkbox-tick" /> : null}</span>
                <span className="gef-checkbox-label">{bi("dailyMode")}</span>
              </button>
              <OrDivider />
              <button
                type="button"
                className={`gef-checkbox-row ${s.screenDevice?.mode === "onlyIfNecessary" ? "checked" : ""}`}
                onClick={() => patchStudent({ screenDevice: { ...s.screenDevice, mode: "onlyIfNecessary", duration: "" } })}
              >
                <span className="gef-checkbox-box">{s.screenDevice?.mode === "onlyIfNecessary" ? <span className="gef-checkbox-tick" /> : null}</span>
                <span className="gef-checkbox-label">{bi("onlyIfNecessary")}</span>
              </button>
            </div>
            {s.screenDevice?.mode === "daily" ? (
              <TextInput
                placeholder="e.g. 1 hour"
                value={s.screenDevice?.duration}
                onChange={(v) => patchStudent({ screenDevice: { ...s.screenDevice, duration: v } })}
                className="gef-mt-10"
              />
            ) : null}
          </Field>
        ) : null}

        <Field label={bi("q8")} required>
          <TextInput value={s.sleep?.totalDuration} onChange={(v) => patchStudent({ sleep: { ...s.sleep, totalDuration: v } })} placeholder="e.g. 8 hours" />
        </Field>
        <div className="gef-row">
          <Field label={bi("bedTime")} required>
            <TextInput value={s.sleep?.bedTime} onChange={(v) => patchStudent({ sleep: { ...s.sleep, bedTime: v } })} placeholder="e.g. 9:30 PM" />
          </Field>
          <Field label={bi("afternoonSleep")} hint="Optional">
            <TextInput value={s.sleep?.afternoonSleep} onChange={(v) => patchStudent({ sleep: { ...s.sleep, afternoonSleep: v } })} />
          </Field>
        </div>

        <Field label={bi("q9")} required hint="Both may be selected">
          <div className="gef-checklist" style={{ flexDirection: "row", gap: 24 }}>
            <button
              type="button"
              className={`gef-checkbox-row ${s.food?.type === "veg" ? "checked" : ""}`}
              onClick={() => patchFood({ type: s.food?.type === "veg" ? null : "veg" })}
            >
              <span className="gef-checkbox-box">{s.food?.type === "veg" ? <span className="gef-checkbox-tick" /> : null}</span>
              <span className="gef-checkbox-label">{bi("veg")}</span>
            </button>
            <button
              type="button"
              className={`gef-checkbox-row ${s.food?.type === "nonveg" ? "checked" : ""}`}
              onClick={() => patchFood({ type: s.food?.type === "nonveg" ? null : "nonveg" })}
            >
              <span className="gef-checkbox-box">{s.food?.type === "nonveg" ? <span className="gef-checkbox-tick" /> : null}</span>
              <span className="gef-checkbox-label">{bi("nonveg")}</span>
            </button>
          </div>
        </Field>
        <Field label={bi("q10")} required>
          <div className="gef-row">
            <TextInput placeholder={bi("breakfast")} value={s.food?.times?.breakfast} onChange={(v) => patchTimes({ breakfast: v })} />
            <TextInput placeholder={bi("lunch")} value={s.food?.times?.lunch} onChange={(v) => patchTimes({ lunch: v })} />
          </div>
          <div className="gef-row">
            <TextInput placeholder={bi("afternoonSnacks")} value={s.food?.times?.afternoonSnacks} onChange={(v) => patchTimes({ afternoonSnacks: v })} />
            <TextInput placeholder={bi("dinner")} value={s.food?.times?.dinner} onChange={(v) => patchTimes({ dinner: v })} />
          </div>
        </Field>
        <Field label={bi("q11")} hint="Optional">
          <div className="gef-row">
            <TextInput placeholder="No. 1" value={tiffins.find((tt) => tt.no === "1")?.time} onChange={(v) => setTiffin("1", v)} />
            <TextInput placeholder="No. 2" value={tiffins.find((tt) => tt.no === "2")?.time} onChange={(v) => setTiffin("2", v)} />
          </div>
        </Field>
        <Field label={bi("remarksIfAny")} hint="Optional">
          <TextArea value={s.food?.remarks} onChange={(v) => patchFood({ remarks: v })} rows={2} />
        </Field>

        <div className="gef-row">
          <Field label={bi("q12height")} required>
            <TextInput value={s.height} onChange={(v) => patchStudent({ height: v })} placeholder="cm" />
          </Field>
          <Field label={bi("q12weight")} required>
            <TextInput value={s.weight} onChange={(v) => patchStudent({ weight: v })} placeholder="kg" />
          </Field>
        </div>
        <Field label={bi("q13")} required>
          <Select
            value={s.sportPerformance}
            onChange={(v) => patchStudent({ sportPerformance: v })}
            options={[
              { value: "Bad", label: bi("bad") },
              { value: "Very bad", label: bi("veryBad") },
              { value: "Good", label: bi("good") },
              { value: "Very good", label: bi("veryGood") },
              { value: "Excellent", label: bi("excellent") },
            ]}
          />
        </Field>
        <Field label={bi("q14")} required>
          <TextInput value={s.hobby} onChange={(v) => patchStudent({ hobby: v })} />
        </Field>
        <Field label={bi("hobbyRemarks")} hint="Optional">
          <TextArea value={s.hobbyRemarks} onChange={(v) => patchStudent({ hobbyRemarks: v })} rows={2} />
        </Field>
        <Field label={bi("q15")} required>
          <TextArea value={s.karateLearningRemarks} onChange={(v) => patchStudent({ karateLearningRemarks: v })} rows={4} />
        </Field>

        {/* ===== FOR THE TEACHER ===== */}
        <SectionHeading title={bi("teacherSectionTitle")} instruction={bi("yesNoInstruction")} />
        <Field label={bi("t1")} required>
          <YesNo value={t.punctual} onChange={(v) => patchTeacher({ punctual: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        <Field label={bi("t2")} required>
          <YesNo value={t.attentionToEachStudent} onChange={(v) => patchTeacher({ attentionToEachStudent: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        <Field label={bi("t3")} required>
          <YesNo value={t.hardWorking} onChange={(v) => patchTeacher({ hardWorking: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        <Field label={bi("t4")} required hint="Select all that apply">
          <ChipMultiSelect value={t.goodTrainingAreas} onChange={(v) => patchTeacher({ goodTrainingAreas: v })} options={TRAINING_AREAS} />
        </Field>
        <Field label={bi("t5")} required>
          <YesNo value={t.honest} onChange={(v) => patchTeacher({ honest: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        <Field label={bi("t6")} required>
          <TextArea value={t.remarks} onChange={(v) => patchTeacher({ remarks: v })} rows={4} />
        </Field>

        {/* ===== ABOUT TRAINING ===== */}
        <SectionHeading title={bi("trainingSectionTitle")} instruction={bi("yesNoInstruction")} />
        <Field label={bi("tr1")} required hint="Select all that apply">
          <ChipMultiSelect value={tr.trainingNeeded} onChange={(v) => patchTraining({ trainingNeeded: v })} options={TRAINING_NEEDED} />
        </Field>

        <Field label={bi("tr2i")} required>
          <YesNo value={tr.studiedSportKarateBefore?.answer} onChange={(v) => patchTrainingNested("studiedSportKarateBefore", { answer: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        {tr.studiedSportKarateBefore?.answer ? (
          <div className="gef-row">
            <TextInput placeholder={bi("styleName")} value={tr.studiedSportKarateBefore?.styleName} onChange={(v) => patchTrainingNested("studiedSportKarateBefore", { styleName: v })} />
            <TextInput placeholder={bi("coachName")} value={tr.studiedSportKarateBefore?.coachName} onChange={(v) => patchTrainingNested("studiedSportKarateBefore", { coachName: v })} />
            <TextInput placeholder={bi("yearsLearnt")} value={tr.studiedSportKarateBefore?.yearsLearnt} onChange={(v) => patchTrainingNested("studiedSportKarateBefore", { yearsLearnt: v })} />
          </div>
        ) : null}

        <Field label={bi("tr2ii")} required>
          <YesNo value={tr.newInTraditionalFullContact} onChange={(v) => patchTraining({ newInTraditionalFullContact: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>

        <Field label={bi("tr2iii")} required>
          <YesNo value={tr.otherMartialArts?.answer} onChange={(v) => patchTrainingNested("otherMartialArts", { answer: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        {tr.otherMartialArts?.answer ? (
          <div className="gef-row">
            <TextInput placeholder={bi("styleName")} value={tr.otherMartialArts?.styleName} onChange={(v) => patchTrainingNested("otherMartialArts", { styleName: v })} />
            <TextInput placeholder={bi("coachName")} value={tr.otherMartialArts?.coachName} onChange={(v) => patchTrainingNested("otherMartialArts", { coachName: v })} />
            <TextInput placeholder={bi("yearsLearnt")} value={tr.otherMartialArts?.yearsLearnt} onChange={(v) => patchTrainingNested("otherMartialArts", { yearsLearnt: v })} />
          </div>
        ) : null}

        <Field label={bi("tr3")} required>
          <YesNo value={tr.preferScientificEffectiveLesson} onChange={(v) => patchTraining({ preferScientificEffectiveLesson: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        {tr.preferScientificEffectiveLesson === false ? (
          <Field label={bi("suggestIfNo")} required>
            <TextArea value={tr.preferScientificSuggestion} onChange={(v) => patchTraining({ preferScientificSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label={bi("tr4")} required>
          <YesNo value={tr.preferOnlyFitness} onChange={(v) => patchTraining({ preferOnlyFitness: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        {tr.preferOnlyFitness === true ? (
          <Field label={bi("suggestIfYes")} required>
            <TextArea value={tr.preferOnlyFitnessSuggestion} onChange={(v) => patchTraining({ preferOnlyFitnessSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label={bi("tr5")} required>
          <YesNo value={tr.onlyNeedBeltCertificate} onChange={(v) => patchTraining({ onlyNeedBeltCertificate: v })} yesLabel={bi("yes")} noLabel={bi("no")} />
        </Field>
        {tr.onlyNeedBeltCertificate === false ? (
          <Field label={bi("suggestIfNo")} required>
            <TextArea value={tr.onlyNeedBeltCertificateSuggestion} onChange={(v) => patchTraining({ onlyNeedBeltCertificateSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label={bi("tr6")} required>
          <TextArea value={tr.remarksAndSuggestion} onChange={(v) => patchTraining({ remarksAndSuggestion: v })} rows={3} />
        </Field>

        {/* ===== SIGNATURE ===== */}
        <SectionHeading title={bi("guardianSignature")} />
        <Field label={bi("filledByName")} required hint="This name is printed on the form as the guardian's signature">
          <TextInput value={data.filledByName} onChange={(v) => setData((d) => ({ ...d, filledByName: v }))} placeholder="e.g. Guardian's full name" />
        </Field>

        {!readOnly ? <ActionBar /> : null}
        </fieldset>
      </ReadOnlyProvider>

      <Modal open={draftSavedModalOpen} onClose={() => setDraftSavedModalOpen(false)} title="Draft Saved">
        <p className="gef-section-note">
          Your information has been saved, but it has <strong>not been submitted</strong> yet — your instructor can't
          see it until you submit. Please make sure every question is filled in, then click{" "}
          <strong>{bi("submitForm")}</strong>.
        </p>
        <div className="gef-row">
          <Button type="button" variant="primary" block onClick={() => setDraftSavedModalOpen(false)}>
            Yes, I Understand
          </Button>
        </div>
      </Modal>
    </div>
  );
}
