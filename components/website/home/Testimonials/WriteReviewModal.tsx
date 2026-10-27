"use client";

import { useEffect, useRef, useState } from "react";
import { Star, X, Loader2 } from "lucide-react"; // Loader2 import kiya
import styles from "./WriteReviewModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; review: string }) => void;
  isLoading?: boolean; // Loading prop add kiya
};

export default function WriteReviewModal({ open, onClose, onSubmit, isLoading = false }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, isLoading]);

  useEffect(() => {
    if (open) {
      setRating(0);
      setHover(0);
      setReview("");
      setStatus("idle");
    }
  }, [open]);

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating < 1) {
      setStatus("error");
      return;
    }
    if (review.trim().length < 5) {
      setStatus("error");
      return;
    }
    
    onSubmit?.({ rating, review: review.trim() });
    // Status done parent component handle karega API success ke baad
  };

  const displayRating = hover || rating;

  return (
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdrop}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="write-review-title"
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

        <p className={styles.eyebrow}>Share your experience</p>
        <h2 id="write-review-title" className={styles.title}>
          Write a Review
        </h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Stars */}
          <div className={styles.field}>
            <span className={styles.label}>Your rating</span>
            <div
              className={styles.starPicker}
              onMouseLeave={() => setHover(0)}
              role="radiogroup"
              aria-label="Rating"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const filled = value <= displayRating;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.starBtn} ${filled ? styles.starOn : ""}`}
                    onMouseEnter={() => setHover(value)}
                    onFocus={() => setHover(value)}
                    onClick={() => {
                      setRating(value);
                      setStatus("idle");
                    }}
                    disabled={isLoading}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    aria-checked={rating === value}
                    role="radio"
                  >
                    <Star
                      size={26}
                      fill={filled ? "currentColor" : "none"}
                      strokeWidth={filled ? 0 : 1.4}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review */}
          <div className={styles.field}>
            <label htmlFor="review-text" className={styles.label}>
              Your review
            </label>
            <textarea
              id="review-text"
              className={styles.textarea}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Tell us how the fragrance felt in your space..."
              rows={5}
              maxLength={500}
              disabled={isLoading}
            />
            <span className={styles.counter}>{review.length} / 500</span>
          </div>

          {/* Status */}
          <p className={styles.status} role="status" aria-live="polite">
            {status === "error" && "Please pick a rating and write a short review."}
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submit} disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="animate-spin" size={16} /> Submitting...</>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
