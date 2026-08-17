"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";

const RESEND_COOLDOWN = 60; // seconds

function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [name, domain] = email.split("@");
  if (name.length <= 2) return `${name[0] || ""}***@${domain}`;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 3))}@${domain}`;
}

export default function InstructorLogin({ onLoggedIn }) {
  const { addToast } = useToast();
  const [stage, setStage] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Countdown timer for the resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const requestOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/instructor/login", { email });
      addToast(res.data.message || "OTP sent to your email", "success");
      setStage("otp");
      setOtp(new Array(6).fill(""));
      setCooldown(RESEND_COOLDOWN);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      addToast(err.response?.data?.message || "Could not send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verify = useCallback(
    async (e) => {
      e?.preventDefault();
      if (otp.join("").length !== 6) return;
      setLoading(true);
      try {
        const res = await shubukan_api.post("/instructor/verify-otp", { email, otp: otp.join("") });
        localStorage.setItem("instructor_token", res.data.token);
        addToast("Logged in", "success");
        onLoggedIn?.();
      } catch (err) {
        addToast(err.response?.data?.message || "Verification failed", "error");
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [otp, email, onLoggedIn, addToast]
  );

  // Auto-submit as soon as all 6 digits are filled in.
  useEffect(() => {
    if (stage === "otp" && otp.every((d) => d !== "") && !loading) {
      verify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await shubukan_api.post("/instructor/login", { email });
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

  const handleChange = (value, index) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 1) {
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
    inputRefs.current[Math.min(index + digits.length, otp.length - 1)]?.focus();
  };

  return (
    <div className="gef-container" style={{ maxWidth: 420 }}>

      <h1 className="gef-title" style={{ textAlign: stage === "otp" ? "center" : "left" }}>
        {stage === "otp" ? "Verify your email" : "Instructor Login"}
      </h1>
      <p className="gef-subtitle" style={{ textAlign: stage === "otp" ? "center" : "left" }}>
        {stage === "otp" ? (
          <>
            We sent a 6-digit code to
            <br />
            <strong>{maskEmail(email)}</strong>
          </>
        ) : (
          "Log in to view your students' submitted evaluation forms."
        )}
      </p>
      <Divider />
      <Card>
        {stage === "email" ? (
          <form onSubmit={requestOtp} className="gef-stack">
            <Field label="Email" required>
              <TextInput type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            </Field>
            <Button type="submit" variant="primary" block disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verify} className="gef-stack">
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
              {loading ? "Verifying..." : "Verify & Log In"}
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

            <button
              type="button"
              onClick={() => {
                setStage("email");
                setOtp(new Array(6).fill(""));
                setCooldown(0);
              }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: "0 auto",
                display: "block",
                color: "var(--gef-charcoal)",
                fontSize: 12,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Use a different email
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
