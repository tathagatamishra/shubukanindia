"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Divider, StatusBadge, SectionHeading } from "../UI/Basics";
import Button from "../UI/Button";
import { Field, TextInput, TextArea, Select, YesNo, ChipMultiSelect, DailyOrBeforeExam, OrDivider } from "../UI/FormFields";
import SignatureUpload from "./SignatureUpload";
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

// Belt/rank ladder shown in the "Student's Current Rank" dropdown.
const RANK_OPTIONS = [
  "White Belt - 10th Kyu",
  "Yellow Belt - 9th Kyu",
  "Orange Belt - 8th Kyu",
  "Green Belt - 7th Kyu",
  "Blue Belt - 6th Kyu",
  "Purple Belt - 5th Kyu",
  "Brown Belt - 4th Kyu",
  "Brown Belt - 3rd Kyu",
  "Brown Belt - 2nd Kyu",
  "Brown Belt - 1st Kyu",
  "Black Belt - 1st Dan",
].map((r) => ({ value: r, label: r }));

export default function FullForm({ learnerId, windowId }) {
  const { authHeader } = useGuardianAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const s = data.student;
  const t = data.teacher;
  const tr = data.training;

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
      if (!silent) addToast("Draft saved", "success");
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
      await shubukan_api.post(`/guardian/evaluation-form/${learnerId}/${windowId}/finalize`, {}, { headers: authHeader });
      addToast("Form submitted successfully", "success");
      setStatus("submitted");
      router.push("/guardian-evaluation/submissions");
    } catch (err) {
      const missing = err.response?.data?.missingFields;
      addToast(
        (err.response?.data?.message || "Could not submit form") + (missing ? `: ${missing.length} field(s) missing` : ""),
        "error"
      );
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
    <div className="gef-container gef-doc">
      <h1 className="gef-title">{bi("formTitle")}</h1>
      <p className="gef-subtitle">
        For <strong>{learner?.name}</strong> &middot; <StatusBadge status={status} />
      </p>
      <Divider />

      <div className="gef-doc-body">
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
          <Select
            value={s.currentRank}
            onChange={(v) => patchStudent({ currentRank: v })}
            options={RANK_OPTIONS}
            placeholder="Select current rank..."
          />
        </Field>

        <div className="gef-row">
          <Field label={bi("instructor")}>
            <TextInput value={s.instructorName || learner?.instructorName || ""} onChange={() => {}} disabled />
          </Field>
          <Field label={bi("dojo")}>
            <TextInput value={s.dojoName || learner?.dojoName || ""} onChange={() => {}} disabled />
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
        <Field label={bi("filledByName")} required hint="If you don't upload a signature below, this name is printed on the form instead">
          <TextInput value={data.filledByName} onChange={(v) => setData((d) => ({ ...d, filledByName: v }))} placeholder="e.g. Guardian's full name" />
        </Field>
        <p className="gef-hint" style={{ marginBottom: 12 }}>
          Signature upload is optional — only the guardian signs this form.
        </p>
        <SignatureUpload
          label={`${bi("guardianSignature")} (optional)`}
          value={{ url: data.guardianSignatureUrl, publicId: data.guardianSignaturePublicId }}
          onChange={({ url, publicId }) => setData((d) => ({ ...d, guardianSignatureUrl: url, guardianSignaturePublicId: publicId }))}
        />

        <ActionBar />
      </div>
    </div>
  );
}
