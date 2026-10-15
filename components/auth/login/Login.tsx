"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import styles from "./Login.module.css";

type FormState = {
  email: string;
  password: string;
};

const INITIAL: FormState = { email: "", password: "" };

export default function Login() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const passOk = form.password.length >= 6;

    if (!emailOk || !passOk) {
      setStatus("error");
      setMessage("Please enter a valid email and password (min 6 characters).");
      return;
    }

    // TODO: yahan apna auth API call laga do
    console.log("Login submitted:", { ...form, remember });

    setStatus("done");
    setMessage("Welcome back — signing you in…");
  };

  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>Account</p>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Enter your details to access your account.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="login-email" className={styles.label}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className={styles.input}
            placeholder="you@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={status === "error" && !form.email.trim()}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="login-password" className={styles.label}>
              Password
            </label>
            <Link href="/forgot-password" className={styles.forgot}>
              Forgot?
            </Link>
          </div>
          <div className={styles.passwordWrap}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              aria-invalid={status === "error" && form.password.length < 6}
              required
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={14} strokeWidth={1.5} />
              ) : (
                <Eye size={14} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Remember */}
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span className={styles.checkboxBox} aria-hidden="true" />
          <span className={styles.checkboxText}>Keep me signed in</span>
        </label>

        {/* Status */}
        <p
          className={`${styles.status} ${
            status === "error" ? styles.statusError : ""
          } ${status === "done" ? styles.statusDone : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        {/* Submit */}
        <button type="submit" className={styles.submit}>
          Sign in
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Google */}
        <button
          type="button"
          className={styles.socialBtn}
          onClick={() => console.log("Google sign-in clicked")}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.84-2.67-5.84-5.9s2.62-5.9 5.84-5.9c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 4.1 14.55 3.2 12 3.2 6.98 3.2 2.9 7.28 2.9 12.3s4.08 9.1 9.1 9.1c5.25 0 8.73-3.7 8.73-8.9 0-.6-.06-1-.38-1.4z"
            />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className={styles.foot}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className={styles.footLink}>
          Create one
        </Link>
      </p>
    </div>
  );
}
