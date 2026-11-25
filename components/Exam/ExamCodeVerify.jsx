"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import ExamBtn from "./UI/ExamBtn";
import { clearExamCodeFlow, readExamCodeFlow } from "./examCodeFlow";

export default function ExamCodeVerify({ role }) {
  const router = useRouter();
  const [flow, setFlow] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    const saved = readExamCodeFlow(role);
    if (!saved) {
      router.replace(`/online-exam/${role}/login`);
      return;
    }
    setFlow(saved);
  }, [role, router]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submitCode = async (action) => {
    if (!flow || lock.current) return;
    lock.current = true;
    setPending(action);
    setError("");
    setMessage("");
    try {
      if (action === "resend") {
        const { data } = await shubukan_api.post(`/${role}/resend-otp`, flow);
        setMessage(data.message);
        setOtp("");
        setCooldown(60);
      } else {
        const { data } = await shubukan_api.post(`/${role}/verify-otp`, { email: flow.email, otp });
        localStorage.setItem(`${role}_token`, data.token);
        clearExamCodeFlow(role);
        router.replace(`/online-exam/${role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the verification service. Try again.");
      if (action === "resend" && err.response?.status === 503) setCooldown(60);
    } finally {
      lock.current = false;
      setPending("");
    }
  };

  if (!flow) return <p>Loading verification…</p>;

  return (
    <div className="ExamChild w-full max-w-[540px]">
      <form onSubmit={(event) => { event.preventDefault(); submitCode("verify"); }}
        className="OnlineExam rounded-3xl border p-4 flex flex-col gap-3">
        <h1 className="font-semibold">Verify your email</h1>
        <p>Enter the six-digit code sent to {flow.email}.</p>
        <label className="flex flex-col gap-1">Email code
          <input value={otp} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6}
            className="rounded border p-2" required disabled={Boolean(pending)}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} />
        </label>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        {message && <p role="status">{message}</p>}
        <ExamBtn type="submit" text={pending === "verify" ? "Verifying…" : "Verify"} disabled={Boolean(pending)} />
        <ExamBtn text={cooldown ? `Resend in ${cooldown}s` : "Resend Code"} disabled={Boolean(pending) || cooldown > 0}
          onClick={() => submitCode("resend")} />
      </form>
    </div>
  );
}
