"use client";
import React from "react";
import { Field, YesNo, TextArea, ChipMultiSelect, TextInput } from "../UI/FormFields";
import { Card } from "../UI/Basics";
import SignatureUpload from "./SignatureUpload";

const TRAINING_NEEDED = ["Dojo", "District Camp", "State Camp", "National Camp", "Seminar", "International Session"];

export default function StepTraining({ data, setData }) {
  const tr = data.training;
  const patch = (patch) => setData((d) => ({ ...d, training: { ...d.training, ...patch } }));
  const patchNested = (key, patch) => setData((d) => ({ ...d, training: { ...d.training, [key]: { ...d.training[key], ...patch } } }));

  return (
    <div className="gef-stack">
      <Card title="About Training">
        <Field label="Which training is needed" required hint="Select all that apply">
          <ChipMultiSelect value={tr.trainingNeeded} onChange={(v) => patch({ trainingNeeded: v })} options={TRAINING_NEEDED} />
        </Field>

        <Field label="Studied sport karate before" required>
          <YesNo value={tr.studiedSportKarateBefore?.answer} onChange={(v) => patchNested("studiedSportKarateBefore", { answer: v })} />
        </Field>
        {tr.studiedSportKarateBefore?.answer ? (
          <div className="gef-row">
            <TextInput placeholder="Style Name" value={tr.studiedSportKarateBefore?.styleName} onChange={(v) => patchNested("studiedSportKarateBefore", { styleName: v })} />
            <TextInput placeholder="Coach Name" value={tr.studiedSportKarateBefore?.coachName} onChange={(v) => patchNested("studiedSportKarateBefore", { coachName: v })} />
            <TextInput placeholder="Years Learnt" value={tr.studiedSportKarateBefore?.yearsLearnt} onChange={(v) => patchNested("studiedSportKarateBefore", { yearsLearnt: v })} />
          </div>
        ) : null}

        <Field label="New in Traditional Full Contact Karate" required>
          <YesNo value={tr.newInTraditionalFullContact} onChange={(v) => patch({ newInTraditionalFullContact: v })} />
        </Field>

        <Field label="Practiced any other martial arts" required>
          <YesNo value={tr.otherMartialArts?.answer} onChange={(v) => patchNested("otherMartialArts", { answer: v })} />
        </Field>
        {tr.otherMartialArts?.answer ? (
          <div className="gef-row">
            <TextInput placeholder="Style Name" value={tr.otherMartialArts?.styleName} onChange={(v) => patchNested("otherMartialArts", { styleName: v })} />
            <TextInput placeholder="Coach Name" value={tr.otherMartialArts?.coachName} onChange={(v) => patchNested("otherMartialArts", { coachName: v })} />
            <TextInput placeholder="Years Learnt" value={tr.otherMartialArts?.yearsLearnt} onChange={(v) => patchNested("otherMartialArts", { yearsLearnt: v })} />
          </div>
        ) : null}
      </Card>

      <Card title="Training Preferences">
        <Field label="Prefers scientific, effective lessons" required>
          <YesNo value={tr.preferScientificEffectiveLesson} onChange={(v) => patch({ preferScientificEffectiveLesson: v })} />
        </Field>
        {tr.preferScientificEffectiveLesson === false ? (
          <Field label="If no, please suggest" required>
            <TextArea value={tr.preferScientificSuggestion} onChange={(v) => patch({ preferScientificSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label="Wants fitness-only programme (no karate)" required>
          <YesNo value={tr.preferOnlyFitness} onChange={(v) => patch({ preferOnlyFitness: v })} />
        </Field>
        {tr.preferOnlyFitness === true ? (
          <Field label="If yes, what type of training?" required>
            <TextArea value={tr.preferOnlyFitnessSuggestion} onChange={(v) => patch({ preferOnlyFitnessSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label="Only needs belt & certificate for the student" required>
          <YesNo value={tr.onlyNeedBeltCertificate} onChange={(v) => patch({ onlyNeedBeltCertificate: v })} />
        </Field>
        {tr.onlyNeedBeltCertificate === false ? (
          <Field label="If no, please specify what you want" required>
            <TextArea value={tr.onlyNeedBeltCertificateSuggestion} onChange={(v) => patch({ onlyNeedBeltCertificateSuggestion: v })} rows={2} />
          </Field>
        ) : null}

        <Field label="Remarks and suggestion" required>
          <TextArea value={tr.remarksAndSuggestion} onChange={(v) => patch({ remarksAndSuggestion: v })} rows={3} />
        </Field>
      </Card>

      <Card title="Signature">
        <SignatureUpload
          label="Guardian's Signature (required)"
          value={{ url: data.guardianSignatureUrl, publicId: data.guardianSignaturePublicId }}
          onChange={({ url, publicId }) =>
            setData((d) => ({ ...d, guardianSignatureUrl: url, guardianSignaturePublicId: publicId }))
          }
        />
        <SignatureUpload
          label="Student's Signature (optional)"
          value={{ url: data.studentSignatureUrl, publicId: data.studentSignaturePublicId }}
          onChange={({ url, publicId }) =>
            setData((d) => ({ ...d, studentSignatureUrl: url, studentSignaturePublicId: publicId }))
          }
        />
      </Card>
    </div>
  );
}
