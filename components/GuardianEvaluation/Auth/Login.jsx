"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, Divider } from "../UI/Basics";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";
import EmailCodeForm from "./EmailCodeForm";

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const { login, logout } = useGuardianAuth();
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const finishLogin = (token) => {
    login(token);
    addToast("Welcome back", "success");
    router.push("/guardian-evaluation");
  };

  const changeMode = (nextMode) => {
    setPassword("");
    setShowPassword(false);
    setMode(nextMode);
  };

  const finishEmailCode = (data) => {
    if (mode === "reset") {
      logout();
      changeMode("password");
      addToast(data.message, "success");
      return;
    }
    finishLogin(data.token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await shubukan_api.post("/guardian/login", { email, password });
      finishLogin(res.data.token);
    } catch (err) {
      if (err.response?.status === 403) {
        addToast(err.response.data.message || "Please verify your email first", "warning");
        localStorage.setItem("guardian_verify_email", email);
        router.push("/guardian-evaluation/verify");
      } else {
        addToast(err.response?.data?.message || "Login failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gef-auth-shell">
      <h1 className="gef-title" style={{ textAlign: "center" }}>
        {mode === "reset" ? "Reset your password" : mode === "login" ? "Log in with an email code" : "Welcome back"}
      </h1>
      <p className="gef-subtitle" style={{ textAlign: "center" }}>
        {mode === "password"
          ? "Log in to view and complete the Guardian Evaluation Form."
          : "Use the email address registered with the Guardian Portal."}
      </p>
      <Divider />
      <Card>
        {mode === "password" ? (
          <form onSubmit={handleSubmit} className="gef-stack" aria-busy={loading}>
            <Field label="Email" htmlFor="guardian-login-email" required>
              <TextInput
                id="guardian-login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </Field>
            <Field label="Password" htmlFor="guardian-login-password" required>
              <div style={{ position: "relative" }}>
                <input
                  id="guardian-login-password"
                  className="gef-input"
                  style={{ paddingRight: 38 }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(28,26,23,0.55)",
                    display: "flex",
                  }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </Field>
            <Button type="submit" variant="primary" block disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
            <Button variant="outline" block disabled={loading} onClick={() => changeMode("login")}>
              Log in with an email code (OTP)
            </Button>
            <button type="button" className="gef-auth-link" disabled={loading} onClick={() => changeMode("reset")}>
              Reset password
            </button>
          </form>
        ) : (
          <EmailCodeForm
            key={mode}
            purpose={mode}
            email={email}
            setEmail={setEmail}
            onComplete={finishEmailCode}
            onBack={() => changeMode("password")}
          />
        )}
      </Card>
      <p className="gef-hint" style={{ marginTop: 14, textAlign: "center" }}>
        New here?{" "}
        <a href="/guardian-evaluation/signup" style={{ color: "var(--gef-vermillion)", fontWeight: 600 }}>
          Create an account
        </a>
      </p>
    </div>
  );
}
