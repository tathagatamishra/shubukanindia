"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { shubukan_api } from "@/config";
import { useToast } from "@/components/UIComponent/Toast/Toast";
import { Card, Divider, Stamp } from "../UI/Basics";
import { Field, TextInput } from "../UI/FormFields";
import Button from "../UI/Button";

export default function Signup() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await shubukan_api.post("/guardian/signup", form);
      addToast(res.data.message || "OTP sent to your email", "success");
      localStorage.setItem("guardian_verify_email", form.email);
      router.push("/guardian-evaluation/verify");
    } catch (err) {
      addToast(err.response?.data?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gef-container" style={{ maxWidth: 420 }}>

      <h1 className="gef-title" style={{ textAlign: "center" }}>
        Create your account
      </h1>
      <p className="gef-subtitle" style={{ textAlign: "center" }}>
        Register as a guardian to submit the Guardian Evaluation Form for your children.
      </p>
      <Divider />
      <Card>
        <form onSubmit={handleSubmit} className="gef-stack">
          <Field label="Full Name" required>
            <TextInput value={form.name} onChange={set("name")} placeholder="Your name" required />
          </Field>
          <Field label="Email" required hint="Used for login and evaluation form notifications">
            <TextInput type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
          </Field>
          <Field label="Mobile">
            <TextInput value={form.mobile} onChange={set("mobile")} placeholder="Mobile number" />
          </Field>
          <Field label="Password" required>
            <div style={{ position: "relative" }}>
              <input
                className="gef-input"
                style={{ paddingRight: 38 }}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password")(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
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
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </Card>
      <p className="gef-hint" style={{ marginTop: 14, textAlign: "center" }}>
        Already have an account?{" "}
        <a href="/guardian-evaluation/login" style={{ color: "var(--gef-vermillion)", fontWeight: 600 }}>
          Log in
        </a>
      </p>
    </div>
  );
}
