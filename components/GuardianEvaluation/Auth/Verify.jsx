"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, Divider, Stamp } from "../UI/Basics";
import Button from "../UI/Button";

const RESEND_COOLDOWN = 60; // seconds

function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0] || ""}***@${domain}`;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}

export default function Verify() {
  const router = useRouter();
  const { addToast } = useToast();
  const { login } = useGuardianAuth();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("guardian_verify_email") || "");
    // Focus the first OTP box as soon as the page is ready.
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  // Countdown timer for the resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Start the initial cooldown once we land on this page (an OTP was just sent).
  useEffect(() => {
    setCooldown(RESEND_COOLDOWN);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (otp.join("").length !== 6) return;
      setLoading(true);
      try {
        const res = await shubukan_api.post("/guardian/verify-otp", { email, otp: otp.join("") });
        login(res.data.token);
        addToast("Email verified", "success");
        localStorage.removeItem("guardian_verify_email");
        router.push("/guardian-evaluation");
      } catch (err) {
        addToast(err.response?.data?.message || "Verification failed", "error");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [otp, email, login, addToast, router]
  );

  // Auto-submit as soon as all 6 digits are filled in.
  useEffect(() => {
    if (otp.every((d) => d !== "") && !loading) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleChange = (value, index) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 1) {
      // Autofill / multi-character input landed in one box - distribute it.
      const digits = digitsOnly.slice(0, otp.length - index).split("");
      const next = [...otp];
      digits.forEach((d, i) => {
        if (index + i < next.length) next[index + i] = d;
      });
      setOtp(next);
      inputRefs.current[Math.min(index + digits.length, otp.length - 1)]?.focus();
      return;
    }
    if (/^[0-9]?$/.test(digitsOnly)) {
      const next = [...otp];
      next[index] = digitsOnly;
      setOtp(next);
      if (digitsOnly && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pasted.replace(/\D/g, "").slice(0, otp.length - index).split("");
    if (!digits.length) return;
    const next = [...otp];
    digits.forEach((d, i) => {
      if (index + i < next.length) next[index + i] = d;
    });
    setOtp(next);
    const lastFilled = Math.min(index + digits.length, otp.length - 1);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await shubukan_api.post("/guardian/resend-otp", { email });
      addToast(res.data.message || "A new OTP has been sent", "success");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      addToast(err.response?.data?.message || "Could not resend OTP", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="gef-container" style={{ maxWidth: 420 }}>

      <h1 className="gef-title" style={{ textAlign: "center" }}>
        Verify your email
      </h1>
      <p className="gef-subtitle" style={{ textAlign: "center" }}>
        We sent a 6-digit code to
        <br />
        <strong>{email ? maskEmail(email) : "your email"}</strong>
      </p>
      <Divider />
      <Card>
        <form onSubmit={handleSubmit} className="gef-stack">
          <div className="gef-otp-row">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className="gef-input gef-otp-input"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={(e) => handlePaste(e, i)}
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={loading}
              />
            ))}
          </div>
          <Button type="submit" variant="primary" block disabled={loading || otp.join("").length !== 6}>
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <div style={{ textAlign: "center", fontSize: 13 }}>
            <span className="gef-hint">Didn&apos;t receive the code? </span>
            {cooldown > 0 ? (
              <span className="gef-hint">Resend in 0:{String(cooldown).padStart(2, "0")}</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--gef-vermillion)",
                  fontWeight: 600,
                  cursor: resending ? "not-allowed" : "pointer",
                  textDecoration: "underline",
                }}
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </Card>
      <p className="gef-hint" style={{ marginTop: 14, textAlign: "center" }}>
        Wrong email?{" "}
        <a href="/guardian-evaluation/signup" style={{ color: "var(--gef-vermillion)", fontWeight: 600 }}>
          Change it
        </a>
      </p>
    </div>
  );
}
