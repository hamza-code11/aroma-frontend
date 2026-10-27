"use client";

import { useEffect, useState } from "react";
import { X, Save, Pencil, Loader2 } from "lucide-react"; // Loader2 import kiya
import type { Category } from "@/types/category";
import styles from "./EditCategoryModal.module.css";

type Props = {
  category: Category | null;
  onClose: () => void;
  onSubmit: (updated: Category) => void;
  isLoading?: boolean; // Loading prop add ki
};

export default function EditCategoryModal({
  category,
  onClose,
  onSubmit,
  isLoading = false,
}: Props) {
  const open = !!category;

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  // Sync state when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setIsActive(category.is_active);
      setStatus("idle");
      setMessage("");
    }
  }, [category]);

  // Esc + body scroll lock
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, isLoading]);

  if (!open || !category) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      setStatus("error");
      setMessage("Please enter a category name (min 2 characters).");
      return;
    }

    // Slug field hata diya hai, backend khud handle karega
    onSubmit({
      id: category.id,
      name: name.trim(),
      slug: category.slug, // Purana slug bhej rahe hain (backend ise zaroorat pade toh update kar dega)
      is_active: isActive,
    } as any);
  };

  return (
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdrop}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-cat-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <header className={styles.header}>
          <span className={styles.iconWrap} aria-hidden="true">
            <Pencil size={18} strokeWidth={1.8} />
          </span>
          <div>
            <p className={styles.eyebrow}>Update category</p>
            <h2 id="edit-cat-title" className={styles.title}>
              Edit Category
            </h2>
          </div>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className={styles.field}>
            <label htmlFor="edit-cat-name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="edit-cat-name"
              type="text"
              className={styles.input}
              placeholder="e.g. Aroma Diffusers"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              aria-invalid={status === "error" && name.trim().length < 2}
              autoFocus
              disabled={isLoading}
              required
            />
            <p className={styles.hint}>
              Changing the name will automatically update the slug.
            </p>
          </div>

          {/* Active */}
          <div className={styles.field}>
            <span className={styles.label}>Status</span>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => {
                  setIsActive(e.target.checked);
                  if (status !== "idle") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                disabled={isLoading}
              />
              <span className={styles.checkboxBox} aria-hidden="true" />
              <span className={styles.checkboxText}>
                Active (visible on storefront)
              </span>
            </label>
          </div>

          {/* Status */}
          <p
            className={`${styles.status} ${
              status === "error" ? styles.statusError : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? (
                <>
                  Saving...
                  <Loader2 size={15} strokeWidth={2} className="animate-spin" />
                </>
              ) : (
                <>
                  <Save size={15} strokeWidth={1.8} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
