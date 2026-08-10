"use client";
import React from "react";
import { Field, TextInput, Select, TextArea } from "../UI/FormFields";
import { Card } from "../UI/Basics";


export default function StepSleepFood({ data, setData }) {
  const s = data.student;
  const patch = (patch) => setData((d) => ({ ...d, student: { ...d.student, ...patch } }));
  const patchFood = (patch) => setData((d) => ({ ...d, student: { ...d.student, food: { ...d.student.food, ...patch } } }));
  const patchTimes = (patch) =>
    setData((d) => ({
      ...d,
      student: { ...d.student, food: { ...d.student.food, times: { ...d.student.food.times, ...patch } } },
    }));

  const tiffins = s.food?.otherTiffinTimes || [];
  const setTiffin = (no, time) => {
    const others = tiffins.filter((t) => t.no !== no);
    patchFood({ otherTiffinTimes: [...others, { no, time }].sort((a, b) => a.no - b.no) });
  };

  return (
    <div className="gef-stack">
      <Card title="Sleep">
        <Field label="Total Sleep Duration" required>
          <TextInput value={s.sleep?.totalDuration} onChange={(v) => patch({ sleep: { ...s.sleep, totalDuration: v } })} placeholder="e.g. 8 hours" />
        </Field>
        <div className="gef-row">
          <Field label="Bed Time" required>
            <TextInput value={s.sleep?.bedTime} onChange={(v) => patch({ sleep: { ...s.sleep, bedTime: v } })} placeholder="e.g. 9:30 PM" />
          </Field>
          <Field label="Afternoon Sleep" required>
            <TextInput value={s.sleep?.afternoonSleep} onChange={(v) => patch({ sleep: { ...s.sleep, afternoonSleep: v } })} placeholder="e.g. none / 30 min" />
          </Field>
        </div>
      </Card>

      <Card title="Food">
        <Field label="Food Type" required>
          <Select
            value={s.food?.type}
            onChange={(v) => patchFood({ type: v })}
            options={[
              { value: "veg", label: "Vegetarian" },
              { value: "nonveg", label: "Non-Vegetarian" },
            ]}
          />
        </Field>
        <Field label="Approx. Time of Food Intake" required>
          <div className="gef-row">
            <TextInput placeholder="Breakfast" value={s.food?.times?.breakfast} onChange={(v) => patchTimes({ breakfast: v })} />
            <TextInput placeholder="Lunch" value={s.food?.times?.lunch} onChange={(v) => patchTimes({ lunch: v })} />
          </div>
          <div className="gef-row">
            <TextInput placeholder="Afternoon Snacks" value={s.food?.times?.afternoonSnacks} onChange={(v) => patchTimes({ afternoonSnacks: v })} />
            <TextInput placeholder="Dinner" value={s.food?.times?.dinner} onChange={(v) => patchTimes({ dinner: v })} />
          </div>
        </Field>
        <Field label="Other Tiffin Times" hint="Optional">
          <div className="gef-row">
            <TextInput placeholder="No. 1" value={tiffins.find((t) => t.no === 1)?.time} onChange={(v) => setTiffin(1, v)} />
            <TextInput placeholder="No. 2" value={tiffins.find((t) => t.no === 2)?.time} onChange={(v) => setTiffin(2, v)} />
          </div>
        </Field>
        <Field label="Remarks (if any)" hint="Optional">
          <TextArea value={s.food?.remarks} onChange={(v) => patchFood({ remarks: v })} rows={3} />
        </Field>
      </Card>
    </div>
  );
}
