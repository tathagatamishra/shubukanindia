"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { useGuardianAuth } from "../Context/GuardianAuthContext";
import { Card, Divider, Stamp } from "../UI/Basics";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const { login } = useGuardianAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/guardian/login", { email, password });
      login(res.data.token);
      addToast("Welcome back", "success");
      router.push("/guardian-evaluation");
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
    <div className="gef-container">
      <Stamp>Guardian Portal</Stamp>
      <h1 className="gef-title">Welcome back</h1>
      <p className="gef-subtitle">Log in to view and complete the Guardian Evaluation Form.</p>
      <Divider />
      <Card>
        <form onSubmit={handleSubmit} className="gef-stack">
          <Field label="Email" required>
            <TextInput type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          </Field>
          <Field label="Password" required>
            <TextInput type="password" value={password} onChange={setPassword} placeholder="Your password" required />
          </Field>
          <Button type="submit" variant="primary" block disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
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
