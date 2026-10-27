"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import styles from "./Register.module.css";
import { useRegister } from "@/hooks/auth/useRegister"; // Hook import kiya
import { authService } from "@/services/auth.service"; // Service import ki

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  password: "",
  confirm: "",
};

export default function Register() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [message, setMessage] = useState("");

  // Hook initialize kiya
  const registerMutation = useRegister();

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
    // Agar API error aya tha, toh naya type karte hi clear kar dein
    if (registerMutation.isError) registerMutation.reset();
  };

  // Password strength check
  const passStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0-4
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passStrength];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Front-end Validations (Fast UI Response)
    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const passOk = form.password.length >= 8;
    const matchOk = form.password === form.confirm;

    if (!nameOk || !emailOk || !passOk || !matchOk || !agree) {
      setStatus("error");
      if (!nameOk) setMessage("Please enter your full name.");
      else if (!emailOk) setMessage("Please enter a valid email address.");
      else if (!passOk) setMessage("Password must be at least 8 characters.");
      else if (!matchOk) setMessage("Passwords do not match.");
      else if (!agree) setMessage("Please accept the terms to continue.");
      return;
    }

    // 2. API Call via Hook
    setStatus("idle");
    setMessage("");

    registerMutation.mutate(
      {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      },
      {
        onSuccess: () => {
          setStatus("done");
          setMessage("Account created — signing you in…");
          // Redirect hook ke andar handle ho raha hai
        },
        onError: (error: any) => {
          setStatus("error");
          // Backend validation errors handle karein (e.g., email already exists)
          const errMsg = error.response?.data?.message || "Something went wrong. Try again.";
          // Agar Laravel validation errors hain (422)
          if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0] as string[];
            setMessage(firstError[0]);
          } else {
            setMessage(errMsg);
          }
        },
      }
    );
  };

  // Loading state check
  const isLoading = registerMutation.isPending;

  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>Get started</p>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>
          Join i.Shine Aroma and start building your collection.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className={styles.field}>
          <label htmlFor="reg-name" className={styles.label}>
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            className={styles.input}
            placeholder="e.g. Ayesha Khan"
            autoComplete="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={status === "error" && form.name.trim().length < 2}
            disabled={isLoading}
            required
          />
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="reg-email" className={styles.label}>
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            className={styles.input}
            placeholder="you@email.com"
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={status === "error" && !form.email.trim()}
            disabled={isLoading}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.field}>
          <label htmlFor="reg-password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrap}>
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              className={styles.input}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              aria-invalid={status === "error" && form.password.length < 8}
              disabled={isLoading}
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

          {/* Strength meter */}
          {form.password && (
            <div className={styles.strength} data-level={passStrength}>
              <div className={styles.strengthBars}>
                {[1, 2, 3, 4].map((n) => (
                  <span
                    key={n}
                    className={`${styles.strengthBar} ${
                      passStrength >= n ? styles.strengthOn : ""
                    }`}
                  />
                ))}
              </div>
              <span className={styles.strengthLabel}>{strengthLabel}</span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className={styles.field}>
          <label htmlFor="reg-confirm" className={styles.label}>
            Confirm password
          </label>
          <div className={styles.passwordWrap}>
            <input
              id="reg-confirm"
              type={showConfirm ? "text" : "password"}
              className={styles.input}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => handleChange("confirm", e.target.value)}
              aria-invalid={
                status === "error" &&
                form.confirm.length > 0 &&
                form.password !== form.confirm
              }
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff size={14} strokeWidth={1.5} />
              ) : (
                <Eye size={14} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={isLoading}
          />
          <span className={styles.checkboxBox} aria-hidden="true">
            <Check size={11} strokeWidth={3} />
          </span>
          <span className={styles.checkboxText}>
            I agree to the{" "}
            <Link href="/terms" className={styles.inlineLink}>
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className={styles.inlineLink}>
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Status Message */}
        <p
          className={`${styles.status} ${
            status === "error" ? styles.statusError : ""
          } ${status === "done" ? styles.statusDone : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        {/* Submit Button */}
        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
          {!isLoading && <ArrowRight size={14} strokeWidth={1.5} />}
        </button>

        {/* Divider */}
        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Google Button - Directly triggers backend redirect */}
        <button
          type="button"
          className={styles.socialBtn}
          onClick={authService.googleLogin}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.84-2.67-5.84-5.9s2.62-5.9 5.84-5.9c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 4.1 14.55 3.2 12 3.2 6.98 3.2 2.9 7.28 2.9 12.3s4.08 9.1 9.1 9.1c5.25 0 8.73-3.7 8.73-8.9 0-.6-.06-1-.38-1.4z"
            />
          </svg>
          Sign up with Google
        </button>
      </form>

      <p className={styles.foot}>
        Already have an account?{" "}
        <Link href="/login" className={styles.footLink}>
          Sign in
        </Link>
      </p>
    </div>
  );
}