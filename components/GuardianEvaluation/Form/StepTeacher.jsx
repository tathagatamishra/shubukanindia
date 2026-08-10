"use client";
import React from "react";
import { Field, YesNo, TextArea, ChipMultiSelect } from "../UI/FormFields";
import { Card } from "../UI/Basics";

const TRAINING_AREAS = ["Kihon", "Kata", "Ido Kihon", "Kumite", "Theory"];

export default function StepTeacher({ data, setData }) {
  const t = data.teacher;
  const patch = (patch) => setData((d) => ({ ...d, teacher: { ...d.teacher, ...patch } }));

  return (
    <div className="gef-stack">
      <Card title="For the Teacher">
        <Field label="Punctual" required>
          <YesNo value={t.punctual} onChange={(v) => patch({ punctual: v })} />
        </Field>
        <Field label="Provides attention to each student" required>
          <YesNo value={t.attentionToEachStudent} onChange={(v) => patch({ attentionToEachStudent: v })} />
        </Field>
        <Field label="Hard working in teaching" required>
          <YesNo value={t.hardWorking} onChange={(v) => patch({ hardWorking: v })} />
        </Field>
        <Field label="What he/she trains well" required hint="Select all that apply">
          <ChipMultiSelect value={t.goodTrainingAreas} onChange={(v) => patch({ goodTrainingAreas: v })} options={TRAINING_AREAS} />
        </Field>
        <Field label="Honest in teaching" required>
          <YesNo value={t.honest} onChange={(v) => patch({ honest: v })} />
        </Field>
        <Field label="Remarks about the teacher" required>
          <TextArea value={t.remarks} onChange={(v) => patch({ remarks: v })} rows={4} />
        </Field>
      </Card>
    </div>
  );
}
