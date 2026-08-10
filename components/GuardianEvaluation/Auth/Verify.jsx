"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, Divider, Stamp } from "../UI/Basics";
import Button from "../UI/Button";

export default function Verify() {
  const router = useRouter();
  const { addToast } = useToast();
  const { login } = useGuardianAuth();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("guardian_verify_email") || "");
  }, []);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/guardian/verify-otp", { email, otp: otp.join("") });
      login(res.data.token);
      addToast("Email verified", "success");
      localStorage.removeItem("guardian_verify_email");
      router.push("/guardian-evaluation");
    } catch (err) {
      addToast(err.response?.data?.message || "Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await shubukan_api.post("/guardian/resend-otp", { email });
      addToast(res.data.message || "OTP resent", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Could not resend OTP", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="gef-container">
      <Stamp>Guardian Portal</Stamp>
      <h1 className="gef-title">Verify your email</h1>
      <p className="gef-subtitle">
        We sent a 6-digit code to <strong>{email || "your email"}</strong>.
      </p>
      <Divider />
      <Card>
        <form onSubmit={handleSubmit} className="gef-stack">
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
              />
            ))}
          </div>
          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <Button type="button" variant="outline" block disabled={resending} onClick={handleResend}>
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
