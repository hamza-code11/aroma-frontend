"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  MailCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import styles from "./ForgotPassword.module.css";
import { useSendOtp, useVerifyOtp, useResetPassword } from "@/hooks/auth/useForgotPassword";

type Step = "email" | "otp" | "password" | "done";

const OTP_LENGTH = 6;
const OTP_RESEND_SECONDS = 45;

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  // Backend se aane wala Reset Token
  const [resetToken, setResetToken] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Hooks
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  /* ---------------- Countdown for resend ---------------- */
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  /* ---------------- Helpers ---------------- */
  const resetStatus = () => {
    setStatus("idle");
    setMessage("");
  };

  const startCountdown = () => setCountdown(OTP_RESEND_SECONDS);

  const handleApiError = (error: any, defaultMsg: string) => {
    setStatus("error");
    if (error.response?.data?.errors) {
      const firstError = Object.values(error.response.data.errors)[0] as string[];
      setMessage(firstError[0]);
    } else {
      setMessage(error.response?.data?.message || defaultMsg);
    }
  };

  /* ---------------- STEP 1: Send OTP ---------------- */
  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    resetStatus();
    
    sendOtpMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtp(Array(OTP_LENGTH).fill(""));
          setStep("otp");
          startCountdown();
        },
        onError: (error) => handleApiError(error, "Failed to send OTP. Try again."),
      }
    );
  };

  /* ---------------- STEP 2: Verify OTP ---------------- */
  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }

    // If user pastes multiple digits
    if (clean.length > 1) {
      const chars = clean.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");
      chars.forEach((c, i) => (next[i] = c));
      setOtp(next);
      // focus last filled
      const el = document.getElementById(
        `otp-${Math.min(chars.length, OTP_LENGTH) - 1}`
      ) as HTMLInputElement | null;
      el?.focus();
      return;
    }

    const next = [...otp];
    next[index] = clean;
    setOtp(next);

    // Auto-focus next
    if (index < OTP_LENGTH - 1) {
      const el = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
    if (status !== "idle") resetStatus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      const el = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setStatus("error");
      setMessage("Please enter the complete 6-digit code.");
      return;
    }

    resetStatus();
    
    verifyOtpMutation.mutate(
      { email: email.trim(), otp: code },
      {
        onSuccess: (data) => {
          setResetToken(data.reset_token); // Save token for final step
          setStep("password");
        },
        onError: (error) => handleApiError(error, "Invalid OTP."),
      }
    );
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;

    resetStatus();
    sendOtpMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setOtp(Array(OTP_LENGTH).fill(""));
          startCountdown();
        },
        onError: (error) => handleApiError(error, "Failed to resend OTP."),
      }
    );
  };

  /* ---------------- STEP 3: Set New Password ---------------- */
  const passStrength = (() => {
    const p = password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passStrength];

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passOk = password.length >= 8;
    const matchOk = password === confirm;

    if (!passOk) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (!matchOk) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    resetStatus();
    
    resetPasswordMutation.mutate(
      {
        email: email.trim(),
        reset_token: resetToken,
        password: password,
        password_confirmation: confirm,
      },
      {
        onSuccess: () => {
          setStep("done");
          // ✅ Login page par redirect (2 second baad)
          setTimeout(() => router.push("/login"), 1800);
        },
        onError: (error) => handleApiError(error, "Failed to reset password."),
      }
    );
  };

  // Global loading state (Koi bhi API chal rahi ho toh buttons/inputs disable ho jayein)
  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending || resetPasswordMutation.isPending;

  /* ================= STEP 4: DONE ================= */
  if (step === "done") {
    return (
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <span className={styles.iconWrap} aria-hidden="true">
            <CheckCircle2 size={26} strokeWidth={1.5} />
          </span>
          <p className={styles.eyebrow}>All set</p>
          <h1 className={styles.title}>Password updated</h1>
          <p className={styles.subtitle}>
            Your password has been reset successfully. Redirecting you to
            sign in…
          </p>
        </header>

        <Link href="/login" className={styles.primaryBtn}>
          Go to sign in
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  /* ================= STEP 3: NEW PASSWORD ================= */
  if (step === "password") {
    return (
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <span className={styles.iconWrap} aria-hidden="true">
            <ShieldCheck size={26} strokeWidth={1.5} />
          </span>
          <p className={styles.eyebrow}>Step 3 of 3</p>
          <h1 className={styles.title}>Create new password</h1>
          <p className={styles.subtitle}>
            Choose a strong password you haven&apos;t used before.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleResetPassword} noValidate>
          {/* New password */}
          <div className={styles.field}>
            <label htmlFor="new-password" className={styles.label}>
              New password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetStatus();
                }}
                aria-invalid={status === "error" && password.length < 8}
                autoFocus
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Strength */}
            {password && (
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

          {/* Confirm */}
          <div className={styles.field}>
            <label htmlFor="confirm-password" className={styles.label}>
              Confirm password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                className={styles.input}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  resetStatus();
                }}
                aria-invalid={
                  status === "error" &&
                  confirm.length > 0 &&
                  password !== confirm
                }
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className={styles.toggle}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showConfirm ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <p
            className={`${styles.status} ${
              status === "error" ? styles.statusError : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>

          <button type="submit" className={styles.submit} disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
            {!isLoading && <ArrowRight size={14} strokeWidth={1.5} />}
          </button>
        </form>

        <p className={styles.foot}>
          <button
            type="button"
            className={styles.footLink}
            onClick={() => {
              resetStatus();
              setStep("otp");
            }}
            disabled={isLoading}
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back to OTP
          </button>
        </p>
      </div>
    );
  }

  /* ================= STEP 2: OTP ================= */
  if (step === "otp") {
    return (
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <span className={styles.iconWrap} aria-hidden="true">
            <MailCheck size={26} strokeWidth={1.5} />
          </span>
          <p className={styles.eyebrow}>Step 2 of 3</p>
          <h1 className={styles.title}>Enter the code</h1>
          <p className={styles.subtitle}>
            We&apos;ve sent a 6-digit verification code to{" "}
            <strong className={styles.emailHighlight}>{email}</strong>.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleVerifyOtp} noValidate>
          <div className={styles.field}>
            <span className={styles.label}>Verification code</span>
            <div className={styles.otpRow}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={styles.otpInput}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  autoFocus={i === 0}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <p
            className={`${styles.status} ${
              status === "error" ? styles.statusError : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>

          <button type="submit" className={styles.submit} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify code"}
            {!isLoading && <ArrowRight size={14} strokeWidth={1.5} />}
          </button>
        </form>

        <div className={styles.resend}>
          <span className={styles.resendText}>
            Didn&apos;t receive the code?
          </span>
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResendOtp}
            disabled={countdown > 0 || isLoading}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
        </div>

        <p className={styles.foot}>
          <button
            type="button"
            className={styles.footLink}
            onClick={() => {
              resetStatus();
              setStep("email");
            }}
            disabled={isLoading}
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Change email
          </button>
        </p>
      </div>
    );
  }

  /* ================= STEP 1: EMAIL ================= */
  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <p className={styles.eyebrow}>Password reset</p>
        <h1 className={styles.title}>Forgot password?</h1>
        <p className={styles.subtitle}>
          Enter the email you registered with and we&apos;ll send you a 6-digit
          verification code.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSendOtp} noValidate>
        <div className={styles.field}>
          <label htmlFor="forgot-email" className={styles.label}>
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            className={styles.input}
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              resetStatus();
            }}
            aria-invalid={status === "error"}
            autoFocus
            disabled={isLoading}
            required
          />
        </div>

        <p
          className={`${styles.status} ${
            status === "error" ? styles.statusError : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send verification code"}
          {!isLoading && <ArrowRight size={14} strokeWidth={1.5} />}
        </button>
      </form>

      <p className={styles.foot}>
        <Link href="/login" className={styles.footLink}>
          <ArrowLeft size={12} strokeWidth={1.5} />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}