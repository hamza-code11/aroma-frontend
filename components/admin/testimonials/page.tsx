"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  X,
  Star,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Testimonial } from "@/types/testimonial";
import styles from "./Testimonials.module.css";

// Hooks Import
import { useAdminTestimonials, useToggleTestimonialVerification } from "@/hooks/useTestimonials";
import TestimonialsSkeleton from "@/components/admin/skeletons/TestimonialsSkeleton/TestimonialsSkeleton";

export default function TestimonialsList() {
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);
  const { showToast } = useToast();

  // Fetch Dynamic Data
  const { data: apiData, isLoading } = useAdminTestimonials(1);
  const testimonials = apiData?.data || [];

  // Toggle Mutation
  const toggleMutation = useToggleTestimonialVerification();

  // Search Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter(
      (t) =>
        t.user.name.toLowerCase().includes(q) ||
        (t.user.email && t.user.email.toLowerCase().includes(q)) ||
        t.reviews.toLowerCase().includes(q)
    );
  }, [testimonials, query]);

  // Verified Count
  const verifiedCount = useMemo(
    () => testimonials.filter((t) => t.is_verified).length,
    [testimonials]
  );

  const toggleVerified = (t: Testimonial) => {
    toggleMutation.mutate(
      { id: t.id, is_verified: !t.is_verified },
      {
        onSuccess: () => {
          showToast(
            `"${t.user.name}" review is now ${!t.is_verified ? "verified" : "unverified"}.`,
            !t.is_verified ? "success" : "info"
          );
          // Modal khula hai toh update kar dein
          if (viewing?.id === t.id) {
            setViewing({ ...viewing, is_verified: !t.is_verified });
          }
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || "Failed to update status", "error");
        }
      }
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    // TODO: Backend API banne ke baad isko connect karein
    // deleteMutation.mutate(deleting.id, { ... })
    
    showToast(`Review by "${deleting.user.name}" deleted.`, "success");
    setDeleting(null);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const truncate = (s: string, n = 70) =>
    s.length > n ? s.slice(0, n) + "…" : s;

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }
 
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Testimonials</h2>
          <p className={styles.subtitle}>
            {testimonials.length} review{testimonials.length === 1 ? "" : "s"} ·{" "}
            {verifiedCount} verified
          </p>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} strokeWidth={1.7} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email or review…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search testimonials"
          />
        </div>
        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No reviews found</p>
          <p className={styles.emptyText}>
            {query
              ? "Try a different search term."
              : "Reviews will appear here once customers submit them."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Verified</th>
                <th>Created</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.avatar}>
                        {initials(t.user.name)}
                      </span>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{t.user.name}</span>
                        <span className={styles.userId}>
                          ID: {t.user.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.ratingCell}>
                      <span className={styles.ratingValue}>
                        {t.ratings}.0
                      </span>
                    </div>
                  </td>
                  <td className={styles.reviewCell}>
                    <span className={styles.reviewPreview} title={t.reviews}>
                      {truncate(t.reviews)}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={t.is_verified}
                      className={`${styles.toggle} ${
                        t.is_verified ? styles.toggleOn : styles.toggleOff
                      }`}
                      onClick={() => toggleVerified(t)}
                      disabled={toggleMutation.isPending && toggleMutation.variables?.id === t.id}
                      aria-label={`Toggle verified for ${t.user.name}`}
                    >
                      <span className={styles.toggleKnob} />
                      <span className={styles.toggleLabel}>
                        {t.is_verified ? "Verified" : "Unverified"}
                      </span>
                    </button>
                  </td>
                  <td className={styles.date}>{formatDate(t.created_at)}</td>
                  <td className={styles.tdRight}>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setViewing(t)}
                        aria-label={`View review by ${t.user.name}`}
                      >
                        <Eye size={15} strokeWidth={1.7} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => setDeleting(t)}
                        aria-label={`Delete review by ${t.user.name}`}
                      >
                        <Trash2 size={15} strokeWidth={1.7} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewing && (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => e.target === e.currentTarget && setViewing(null)}
          role="presentation"
        >
          <div className={styles.dialog} role="dialog" aria-modal="true">
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setViewing(null)}
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <header className={styles.dialogHeader}>
              <span className={styles.avatarLarge}>
                {initials(viewing.user.name)}
              </span>
              <div>
                <p className={styles.dialogEyebrow}>Review by</p>
                <h3 className={styles.dialogTitle}>{viewing.user.name}</h3>
                <p className={styles.dialogEmail}>{viewing.user.email}</p>
              </div>
            </header>

            <dl className={styles.dialogMeta}>
              <div>
                <dt>User ID</dt>
                <dd>#{viewing.user.id}</dd>
              </div>
              <div>
                <dt>Rating ID</dt>
                <dd>#{viewing.id}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  <span className={styles.dialogStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        strokeWidth={0}
                        fill={
                          i < viewing.ratings ? "currentColor" : "none"
                        }
                        className={
                          i < viewing.ratings
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                      />
                    ))}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  {viewing.is_verified ? (
                    <span className={styles.verifiedBadge}>
                      <BadgeCheck size={12} strokeWidth={2.2} />
                      Verified
                    </span>
                  ) : (
                    <span className={styles.unverifiedBadge}>
                      Not Verified
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
            </dl>

            <div className={styles.dialogBody}>
              <p className={styles.dialogBodyLabel}>Review</p>
              <p className={styles.dialogReview}>{viewing.reviews}</p>
            </div>

            <div className={styles.dialogActions}>
              <button
                type="button"
                className={`${styles.toggleLarge} ${
                  viewing.is_verified
                    ? styles.toggleLargeOn
                    : styles.toggleLargeOff
                }`}
                onClick={() => toggleVerified(viewing)}
                disabled={toggleMutation.isPending}
              >
                {toggleMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Updating...</>
                ) : viewing.is_verified ? (
                  <>
                    <BadgeCheck size={14} strokeWidth={2} />
                    Verified — Click to unverify
                  </>
                ) : (
                  <>
                    <BadgeCheck size={14} strokeWidth={2} />
                    Verify this review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleting && (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => e.target === e.currentTarget && setDeleting(null)}
          role="presentation"
        >
          <div className={styles.dialog} role="alertdialog" aria-modal="true">
            <h3 className={styles.dialogTitle}>Delete review?</h3>
            <p className={styles.dialogText}>
              Are you sure you want to delete the review by{" "}
              <strong>{deleting.user.name}</strong>? This cannot be undone.
            </p>
            <div className={styles.dialogActionsCenter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleDelete}
                autoFocus
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
