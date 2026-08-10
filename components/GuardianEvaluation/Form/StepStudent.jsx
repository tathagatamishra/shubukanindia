"use client";
import React from "react";
import { Field, TextInput, DailyOrBeforeExam, YesNo } from "../UI/FormFields";
import { Card } from "../UI/Basics";

export default function StepStudent({ data, setData, learner }) {
  const s = data.student;
  const patch = (patch) => setData((d) => ({ ...d, student: { ...d.student, ...patch } }));

  return (
    <div className="gef-stack">
      <Card title="Student Details">
        <Field label="Student Name" required>
          <TextInput value={s.name} onChange={(v) => patch({ name: v })} placeholder={learner?.name} />
        </Field>
        <div className="gef-row">
          <Field label="Age" required>
            <TextInput type="number" value={s.age} onChange={(v) => patch({ age: v })} />
          </Field>
          <Field label="Date of Birth" required>
            <TextInput type="date" value={s.dob ? String(s.dob).slice(0, 10) : ""} onChange={(v) => patch({ dob: v })} />
          </Field>
        </div>
        <Field label="Current Rank" required>
          <TextInput value={s.currentRank} onChange={(v) => patch({ currentRank: v })} />
        </Field>
        <div className="gef-row">
          <Field label="Class" required>
            <TextInput value={s.classOf} onChange={(v) => patch({ classOf: v })} />
          </Field>
          <Field label="Board" required>
            <TextInput value={s.board} onChange={(v) => patch({ board: v })} />
          </Field>
        </div>
        <Field label="Study Time (School + Self-study + Tuition)" required>
          <TextInput value={s.studyTime} onChange={(v) => patch({ studyTime: v })} placeholder="e.g. 3 hours" />
        </Field>
      </Card>

      <Card title="Karate Practice">
        <Field label="Karate Practice Time (self-study)" required>
          <DailyOrBeforeExam value={s.karatePractice} onChange={(v) => patch({ karatePractice: v })} />
        </Field>
        <Field label="Karate Notes / Theory Study" required>
          <DailyOrBeforeExam value={s.karateNotes} onChange={(v) => patch({ karateNotes: v })} />
        </Field>
        <Field label="Other Arts Practiced (names)" required>
          <TextInput value={s.otherArtsNames} onChange={(v) => patch({ otherArtsNames: v })} />
        </Field>
        <Field label="Other Arts Practice Time" required>
          <DailyOrBeforeExam value={s.otherArtsPractice} onChange={(v) => patch({ otherArtsPractice: v })} />
        </Field>
        <Field label="Physical Exercise Time" required>
          <TextInput value={s.physicalExerciseTime} onChange={(v) => patch({ physicalExerciseTime: v })} placeholder="e.g. 30 min" />
        </Field>
      </Card>

      <Card title="Screen Device">
        <Field label="Uses any screen device (TV/mobile etc.)" required>
          <YesNo value={s.screenDevice?.used} onChange={(v) => patch({ screenDevice: { ...s.screenDevice, used: v } })} />
        </Field>
        {s.screenDevice?.used ? (
          <Field label="How?" required>
            <div className="gef-yesno">
              <button
                type="button"
                className={`gef-yesno-btn ${s.screenDevice?.mode === "daily" ? "active" : ""}`}
                onClick={() => patch({ screenDevice: { ...s.screenDevice, mode: "daily" } })}
              >
                Daily
              </button>
              <button
                type="button"
                className={`gef-yesno-btn ${s.screenDevice?.mode === "onlyIfNecessary" ? "active" : ""}`}
                onClick={() => patch({ screenDevice: { ...s.screenDevice, mode: "onlyIfNecessary" } })}
              >
                Only if necessary
              </button>
            </div>
            {s.screenDevice?.mode === "daily" ? (
              <div className="gef-row" style={{ marginTop: 10 }}>
                <TextInput type="number" placeholder="Hours" value={s.screenDevice?.hour} onChange={(v) => patch({ screenDevice: { ...s.screenDevice, hour: v } })} />
                <TextInput type="number" placeholder="Minutes" value={s.screenDevice?.minute} onChange={(v) => patch({ screenDevice: { ...s.screenDevice, minute: v } })} />
              </div>
            ) : null}
          </Field>
        ) : null}
      </Card>
    </div>
  );
}
