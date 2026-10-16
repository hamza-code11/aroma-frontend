"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import type { Category } from "@/types/category";
import styles from "./DeleteCategoryModal.module.css";

type Props = {
  category: Category | null;
  onClose: () => void;
  onConfirm: (category: Category) => void;
};

export default function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
}: Props) {
  const open = !!category;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !category) return null;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-cat-title"
      >
        <span className={styles.iconWrap} aria-hidden="true">
          <AlertTriangle size={22} strokeWidth={1.8} />
        </span>

        <h2 id="delete-cat-title" className={styles.title}>
          Delete category?
        </h2>

        <p className={styles.text}>
          Are you sure you want to delete{" "}
          <strong className={styles.name}>{category.name}</strong>? This action
          cannot be undone.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={() => onConfirm(category)}
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
