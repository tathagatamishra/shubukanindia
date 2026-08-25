"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGuardianAuth } from "./Context/GuardianAuthContext";
import { Stamp, Divider, Card } from "./UI/Basics";
import Button from "./UI/Button";
import GefBrowserTabs from "./UI/GefBrowserTabs";
import LearnerList from "./Learner/LearnerList";
import ActiveWindowList from "./Window/ActiveWindowList";

export default function Dashboard() {
  const { guardian, logout } = useGuardianAuth();
  const router = useRouter();

  return (
    <div className="gef-container">
      {/* <h1 className="gef-title">Welcome, {guardian?.name}</h1>
      <p className="gef-subtitle">
        Manage your learners and complete the Guardian Evaluation Form when a submission window is open.
      </p> */}
      {/* <Divider /> */}

      <GefBrowserTabs />
      <div className="gef-tab-panel">
        <div className="gef-stack">
          <ActiveWindowList />
          <LearnerList />

          <Card title="Your Records">
            <p className="gef-section-note">
              Every evaluation form you've submitted for any of your learners is saved here — view it any time or
              download a PDF copy for your records.
            </p>
            <Button variant="outline" block onClick={() => router.push("/guardian-evaluation/submissions")}>
              My Submissions
            </Button>
          </Card>

          <Button variant="danger" size="sm" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
