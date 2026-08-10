"use client";
import React from "react";
import { Stamp, Divider, Card } from "./UI/Basics";
import Button from "./UI/Button";

export default function Landing() {
  return (
    <div className="gef-container">
      <Stamp>Shubukan India</Stamp>
      <h1 className="gef-title">Guardian Evaluation Form</h1>
      <p className="gef-subtitle">
        A structured evaluation, filled by guardians, to help instructors understand each student's habits,
        training needs, and progress.
      </p>
      <Divider />
      <Card>
        <p className="gef-hint" style={{ marginBottom: 16 }}>
          Log in or create a guardian account to add your children and complete the form when a submission
          window is open.
        </p>
        <div className="gef-stack">
          <Button variant="primary" block onClick={() => (window.location.href = "/guardian-evaluation/login")}>
            Log In
          </Button>
          <Button variant="outline" block onClick={() => (window.location.href = "/guardian-evaluation/signup")}>
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
