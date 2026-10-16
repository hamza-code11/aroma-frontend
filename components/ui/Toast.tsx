"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

/* ================= TYPES ================= */
export type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/* ================= PROVIDER ================= */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className={styles.container} role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <ToastRow key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

/* ================= ROW ================= */
const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

function ToastRow({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICONS[toast.variant];

  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[toast.variant]}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={18} strokeWidth={1.8} className={styles.icon} />
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <X size={14} strokeWidth={1.8} />
      </button>
    </div>
  );
}
