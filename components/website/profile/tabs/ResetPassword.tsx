"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/auth/useUser";
import { useSendOtp, useVerifyOtp, useResetPassword } from "@/hooks/auth/useForgotPassword";
import { ShieldCheck } from "lucide-react";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const { data: userData } = useUser();
  const user = userData?.user;

  const [passStep, setPassStep] = useState<"idle" | "otp" | "new_password" | "done">("idle");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [passStatus, setPassStatus] = useState({ type: "", message: "" });
  const [countdown, setCountdown] = useState(0);

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleSendOtp = () => {
    setPassStatus({ type: "", message: "" });
    sendOtpMutation.mutate(
      { email: user.email },
      {
        onSuccess: () => {
          setPassStep("otp");
          setCountdown(45);
        },
        onError: (err: any) => {
          setPassStatus({ type: "error", message: err.response?.data?.message || "Failed to send OTP" });
        },
      }
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      const next = Array(6).fill("");
      chars.forEach((c, i) => (next[i] = c));
      setOtp(next);
      document.getElementById(`prof-otp-${Math.min(chars.length, 6) - 1}`)?.focus();
      return;
    }
    const next = [...otp];
    next[index] = clean;
    setOtp(next);
    if (index < 5) document.getElementById(`prof-otp-${index + 1}`)?.focus();
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setPassStatus({ type: "error", message: "Please enter complete 6-digit code." });
      return;
    }
    setPassStatus({ type: "", message: "" });
    verifyOtpMutation.mutate(
      { email: user.email, otp: code },
      {
        onSuccess: (data) => {
          setResetToken(data.reset_token);
          setPassStep("new_password");
        },
        onError: (err: any) => {
          setPassStatus({ type: "error", message: err.response?.data?.message || "Invalid OTP" });
        },
      }
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    setPassStatus({ type: "", message: "" });
    resetPasswordMutation.mutate(
      {
        email: user.email,
        reset_token: resetToken,
        password: newPassword,
        password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          setPassStep("done");
          setNewPassword("");
          setConfirmPassword("");
          setOtp(Array(6).fill(""));
        },
        onError: (err: any) => {
          setPassStatus({ type: "error", message: err.response?.data?.message || "Failed to reset password" });
        },
      }
    );
  };

  const isAuthLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div>
      <h2 className={styles.sectionTitle}>Change Password</h2>

      {passStatus.message && (
        <div className={`${styles.statusMsg} ${passStatus.type === 'error' ? styles.statusError : styles.statusSuccess}`}>
          {passStatus.message}
        </div>
      )}

      {passStep === "idle" && (
        <div className={styles.emptyState} style={{ padding: '40px 0', alignItems: 'flex-start', textAlign: 'left' }}>
          <p>To change your password, we need to verify your identity. We will send a 6-digit code to your email address.</p>
          <button 
            onClick={handleSendOtp} 
            disabled={isAuthLoading}
            className={styles.actionBtn}
            style={{ marginTop: '16px' }}
          >
            {isAuthLoading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>
      )}

      {passStep === "otp" && (
        <div className={styles.passForm}>
          <p className="text-sm text-gray-500 mb-2">Enter the 6-digit code sent to {user?.email}</p>
          <div className={styles.otpContainer}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`prof-otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                disabled={isAuthLoading}
                className={styles.otpInput}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleVerifyOtp}
              disabled={isAuthLoading}
              className={styles.saveBtn}
              style={{ marginTop: 0 }}
            >
              {isAuthLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={countdown > 0 || isAuthLoading}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: countdown > 0 ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>
        </div>
      )}

      {passStep === "new_password" && (
        <form onSubmit={handleResetPassword} className={styles.passForm}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
              placeholder="Min 8 characters"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={isAuthLoading}
            className={styles.saveBtn}
          >
            {isAuthLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {passStep === "done" && (
        <div className={styles.emptyState} style={{ alignItems: 'flex-start', textAlign: 'left', padding: '20px 0' }}>
          <ShieldCheck size={40} className="text-green-500 mb-4" />
          <h3>Password Updated</h3>
          <p>Your password has been changed successfully.</p>
          <button 
            onClick={() => setPassStep("idle")} 
            className={styles.actionBtn}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
