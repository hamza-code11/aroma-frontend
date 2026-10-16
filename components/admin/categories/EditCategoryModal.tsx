"use client";

import { useEffect, useState } from "react";
import { X, Save, Pencil } from "lucide-react";
import type { Category } from "@/types/category";
import styles from "./EditCategoryModal.module.css";

type Props = {
  category: Category | null;
  onClose: () => void;
  onSubmit: (updated: Category) => void;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function EditCategoryModal({
  category,
  onClose,
  onSubmit,
}: Props) {
  const open = !!category;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  // Sync state when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setSlugTouched(true);
      setIsActive(category.is_active);
      setStatus("idle");
      setMessage("");
    }
  }, [category]);

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

  if (!open || !category) return null;

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
      id: category.id,
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
        aria-labelledby="edit-cat-title"
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
              required
            />
          </div>

          {/* Slug */}
          <div className={styles.field}>
            <label htmlFor="edit-cat-slug" className={styles.label}>
              Slug <span className={styles.required}>*</span>
            </label>
            <input
              id="edit-cat-slug"
              type="text"
              className={styles.input}
              placeholder="e.g. aroma-diffusers"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              aria-invalid={status === "error" && !/^[a-z0-9-]+$/.test(slug)}
              required
            />
            <p className={styles.hint}>
              Only lowercase letters, numbers and dashes.
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
              <Save size={15} strokeWidth={1.8} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
