"use client";
import React, { useState, useRef } from "react";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";

export default function InstructorLogin({ onLoggedIn }) {
  const { addToast } = useToast();
  const [stage, setStage] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/instructor/login", { email });
      addToast(res.data.message || "OTP sent to your email", "success");
      setStage("otp");
    } catch (err) {
      addToast(err.response?.data?.message || "Could not send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/instructor/verify-otp", { email, otp: otp.join("") });
      localStorage.setItem("instructor_token", res.data.token);
      addToast("Logged in", "success");
      onLoggedIn?.();
    } catch (err) {
      addToast(err.response?.data?.message || "Verification failed", "error");
    } finally {
      setLoading(false);
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
    <div className="gef-container">
      <Stamp>Instructor</Stamp>
      <h1 className="gef-title">Instructor Login</h1>
      <p className="gef-subtitle">Log in to view your students' submitted evaluation forms.</p>
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
            <p className="gef-hint">Enter the 6-digit code sent to {email}</p>
            <div className="gef-row" style={{ justifyContent: "center" }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="gef-input"
                  style={{ textAlign: "center", maxWidth: 48 }}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={(e) => handlePaste(e, i)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <Button type="submit" variant="primary" block disabled={loading}>
              {loading ? "Verifying..." : "Verify & Log In"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
