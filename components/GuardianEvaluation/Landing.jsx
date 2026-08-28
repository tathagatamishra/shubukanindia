"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiUserPlus, FiEdit3, FiSend } from "react-icons/fi";
import { Divider, Card } from "./UI/Basics";
import Button from "./UI/Button";

const STEPS = [
  {
    icon: FiUserPlus,
    title: "1. Create your account",
    text: "Sign up as a guardian with your email, then add each of your children (learners) and link them to their dojo and instructor.",
  },
  {
    icon: FiEdit3,
    title: "2. Fill the form when it opens",
    text: "When your instructor opens an evaluation window, you'll be notified. Answer questions about sleep, food, study, physical health and training at home - you can save a draft and finish later.",
  },
  {
    icon: FiSend,
    title: "3. Submit & keep a copy",
    text: "Sign and submit the form before the window closes. Your instructor and dojo will use it to better understand your child - and you can download a PDF copy any time.",
  },
];

export default function Landing() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <div className="gef-container">
      <p className="gef-eyebrow">For Guardians &amp; Parents</p>
      <h1 className="gef-title">Guardian Evaluation Form</h1>
      <p className="gef-subtitle">
        A simple, structured way for parents and guardians to share how their
        child is doing at home - sleep, food, study and training habits - so
        instructors can support each student better.
      </p>
      <Divider />

      <div className="gef-stack">
        <Card>
          <p className="gef-hint" style={{ marginBottom: 16 }}>
            Log in or create a guardian account to add your children and
            complete the form when a submission window is open.
          </p>
          <div className="gef-stack">
            <Button
              variant="primary"
              block
              onClick={() =>
                (window.location.href = "/guardian-evaluation/login")
              }
            >
              Log In
            </Button>
            <Button
              variant="outline"
              block
              onClick={() =>
                (window.location.href = "/guardian-evaluation/signup")
              }
            >
              Create Account
            </Button>
          </div>
        </Card>

        <Card title="How it works">
          <div className="gef-how-it-works">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div className="gef-how-step" key={title}>
                <span className="gef-how-step-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="gef-how-step-title">{title}</h3>
                  <p className="gef-how-step-text">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <p className="gef-hint" style={{ textAlign: "center" }}>
          Are you an instructor or dojo admin?
        </p>

        <div className="w-full flex flex-row justify-center items-center gap-5">
          <button
            type="button"
            onClick={() => router.push("/guardian-evaluation/instructor/login")}
            aria-label="Home"
            title="Home"
            className="gef-btn--xsm"
          >
            Instructor login
          </button>
          <button
            type="button"
            onClick={() => router.push("/guardian-evaluation/admin/login")}
            aria-label="Home"
            title="Home"
            className="gef-btn--xsm"
          >
            Admin login
          </button>
        </div>
      </div>
    </div>
  );
}
