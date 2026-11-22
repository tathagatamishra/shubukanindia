"use client";

import React, { useEffect, useState } from "react";
import { shubukan_api } from "@/config";
import Button from "../UI/Button";
import { Field, TextInput } from "../UI/FormFields";

const RESEND_SECONDS = 60;

export default function EmailCodeForm({ purpose, email, setEmail, onComplete, onBack }) {
  const [notice, setNotice] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const resetting = purpose === "reset";
  const busy = Boolean(pending);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestCode = async () => {
    if (busy || cooldown > 0) return;

    setPending("sending");
    setError("");
    try {
      const { data } = await shubukan_api.post("/guardian/request-otp", { email, purpose });
      setNotice(data.message);
      setOtp("");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send a code. Please try again.");
    } finally {
      setPending("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!notice) {
      await requestCode();
      return;
    }
    if (resetting && password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setPending("verifying");
    setError("");
    try {
      const { data } = await shubukan_api.post(
        resetting ? "/guardian/reset-password" : "/guardian/login-otp",
        { email, otp, ...(resetting && { password }) }
      );
      onComplete(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not verify the code. Please try again.");
    } finally {
      setPending("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gef-stack" aria-busy={busy}>
      {!notice ? (
        <Field label="Registered email" htmlFor="guardian-code-email" required>
          <TextInput
            id="guardian-code-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            disabled={busy}
            required
          />
        </Field>
      ) : (
        <>
          <div className="gef-hint" role="status">
            {notice} Codes expire after 5 minutes.
            <br />
            <strong>{email.trim()}</strong>
          </div>
          <Field label="Six-digit email code" htmlFor="guardian-email-code" required>
            <TextInput
              id="guardian-email-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, ""))}
              disabled={busy}
              required
            />
          </Field>
          {resetting && (
            <>
              <Field label="New password" htmlFor="guardian-new-password" hint="Use at least 8 characters." required>
                <TextInput
                  id="guardian-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={setPassword}
                  disabled={busy}
                  required
                />
              </Field>
              <Field label="Confirm new password" htmlFor="guardian-confirm-password" required>
                <TextInput
                  id="guardian-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={setConfirmation}
                  disabled={busy}
                  required
                />
              </Field>
            </>
          )}
        </>
      )}
      {error && <p className="gef-error" role="alert">{error}</p>}
      <Button type="submit" block disabled={busy}>
        {notice
          ? pending === "verifying" ? "Verifying..." : resetting ? "Reset Password" : "Log In"
          : pending === "sending" ? "Sending..." : "Send Email Code"}
      </Button>
      {notice && (
        <Button variant="outline" block disabled={busy || cooldown > 0} onClick={requestCode}>
          {pending === "sending" ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </Button>
      )}
      <button type="button" className="gef-auth-link" disabled={busy} onClick={onBack}>
        Back to password login
      </button>
    </form>
  );
}
