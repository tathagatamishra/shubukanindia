"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "@/components/GuardianEvaluation/UI/Basics";
import { Field } from "@/components/GuardianEvaluation/UI/FormFields";
import Button from "@/components/GuardianEvaluation/UI/Button";

export default function GuardianEvaluationAdminLogin() {
  const router = useRouter();
  const { addToast } = useToast();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      addToast("Please enter your admin ID and password", "warning");
      return;
    }
    setLoading(true);
    try {
      const { data } = await shubukan_api.post("/admin/login", { id, password });
      localStorage.setItem("adminToken", data.token);
      addToast("Welcome back", "success");
      router.push("/guardian-evaluation/admin");
    } catch (err) {
      addToast(err.response?.data?.error || err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gef-container" style={{ maxWidth: 420 }}>

      <h1 className="gef-title" style={{ textAlign: "center" }}>
        Admin Login
      </h1>
      <p className="gef-subtitle" style={{ textAlign: "center" }}>
        Sign in to manage Guardian Evaluation windows &amp; submissions.
      </p>
      <Divider />
      <Card>
        <form onSubmit={handleLogin} className="gef-stack">
          <Field label="Admin ID" required>
            <div style={{ position: "relative" }}>
              <FiUser
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(28,26,23,0.45)",
                }}
              />
              <input
                className="gef-input"
                style={{ paddingLeft: 38 }}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Admin ID"
                autoComplete="username"
                required
              />
            </div>
          </Field>
          <Field label="Password" required>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(28,26,23,0.45)",
                }}
              />
              <input
                className="gef-input"
                style={{ paddingLeft: 38, paddingRight: 38 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
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
            {loading ? "Signing in..." : "Log In"}
          </Button>
        </form>
      </Card>
      <p className="gef-hint" style={{ marginTop: 14, textAlign: "center" }}>
        <a href="/guardian-evaluation" style={{ color: "var(--gef-vermillion)", fontWeight: 600 }}>
          &larr; Back to Guardian Evaluation
        </a>
      </p>
    </div>
  );
}
