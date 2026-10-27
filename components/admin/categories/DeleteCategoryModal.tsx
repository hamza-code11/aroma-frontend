"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react"; // Loader2 import kiya
import type { Category } from "@/types/category";
import styles from "./DeleteCategoryModal.module.css";

type Props = {
  category: Category | null;
  onClose: () => void;
  onConfirm: (category: Category) => void;
  isLoading?: boolean; // Loading prop add ki
};

export default function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
  isLoading = false,
}: Props) {
  const open = !!category;

  useEffect(() => {
    if (!open) return;
    
    const onKey = (e: KeyboardEvent) => {
      // Agar delete API chal rahi hai toh ESC se close na ho
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

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
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
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={() => onConfirm(category)}
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? (
              <>
                Deleting...
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
