"use client";
import React from "react";
import { Field, TextInput, Select, TextArea } from "../UI/FormFields";
import { Card } from "../UI/Basics";

export default function StepPhysical({ data, setData }) {
  const s = data.student;
  const patch = (patch) => setData((d) => ({ ...d, student: { ...d.student, ...patch } }));

  return (
    <div className="gef-stack">
      <Card title="Physical">
        <div className="gef-row">
          <Field label="Height (cm)" required>
            <TextInput type="number" value={s.height} onChange={(v) => patch({ height: v })} />
          </Field>
          <Field label="Weight (kg)" required>
            <TextInput type="number" value={s.weight} onChange={(v) => patch({ weight: v })} />
          </Field>
        </div>
        <Field label="Sport Performance" required>
          <Select
            value={s.sportPerformance}
            onChange={(v) => patch({ sportPerformance: v })}
            options={["Bad", "Very bad", "Good", "Very good", "Excellent"].map((v) => ({ value: v, label: v }))}
          />
        </Field>
      </Card>

      <Card title="Personal">
        <Field label="Hobby" required>
          <TextInput value={s.hobby} onChange={(v) => patch({ hobby: v })} />
        </Field>
        <Field label="Hobby Remarks" hint="Optional">
          <TextArea value={s.hobbyRemarks} onChange={(v) => patch({ hobbyRemarks: v })} rows={2} />
        </Field>
        <Field label="Remarks on karate learning" required hint="Write in short">
          <TextArea value={s.karateLearningRemarks} onChange={(v) => patch({ karateLearningRemarks: v })} rows={4} />
        </Field>
      </Card>
    </div>
  );
}
