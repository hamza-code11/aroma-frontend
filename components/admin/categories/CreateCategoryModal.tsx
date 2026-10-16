"use client";

import { useEffect, useState } from "react";
import { X, Plus, ArrowRight } from "lucide-react";
import type { Category } from "@/types/category";
import styles from "./CreateCategoryModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<Category, "id">) => void;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CreateCategoryModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setName("");
      setSlug("");
      setSlugTouched(false);
      setIsActive(true);
      setStatus("idle");
      setMessage("");
    }
  }, [open]);

  // Esc + body scroll lock
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setSlug(slugify(value));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameOk = name.trim().length >= 2;
    const slugOk = /^[a-z0-9-]+$/.test(slug.trim());

    if (!nameOk) {
      setStatus("error");
      setMessage("Please enter a category name (min 2 characters).");
      return;
    }
    if (!slugOk) {
      setStatus("error");
      setMessage(
        "Slug can only contain lowercase letters, numbers and dashes."
      );
      return;
    }

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      is_active: isActive,
    });
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
        aria-labelledby="create-cat-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <header className={styles.header}>
          <span className={styles.iconWrap} aria-hidden="true">
            <Plus size={20} strokeWidth={1.8} />
          </span>
          <div>
            <p className={styles.eyebrow}>New category</p>
            <h2 id="create-cat-title" className={styles.title}>
              Create Category
            </h2>
          </div>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className={styles.field}>
            <label htmlFor="create-cat-name" className={styles.label}>
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="create-cat-name"
              type="text"
              className={styles.input}
              placeholder="e.g. Aroma Diffusers"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              aria-invalid={status === "error" && name.trim().length < 2}
              autoFocus
              required
            />
          </div>

          {/* Slug */}
          <div className={styles.field}>
            <label htmlFor="create-cat-slug" className={styles.label}>
              Slug <span className={styles.required}>*</span>
            </label>
            <input
              id="create-cat-slug"
              type="text"
              className={styles.input}
              placeholder="e.g. aroma-diffusers"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              aria-invalid={status === "error" && !/^[a-z0-9-]+$/.test(slug)}
              required
            />
            <p className={styles.hint}>
              Auto-generated from name. Only lowercase letters, numbers and
              dashes.
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
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Create Category
              <ArrowRight size={15} strokeWidth={1.8} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
