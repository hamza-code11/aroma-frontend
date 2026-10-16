"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  X,
  Star,
  BadgeCheck,
  Check,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Testimonial } from "@/types/testimonial";
import styles from "./Testimonials.module.css";

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialsList({ testimonials: initial }: Props) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState<Testimonial | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) =>
        t.user.name.toLowerCase().includes(q) ||
        t.user.email.toLowerCase().includes(q) ||
        t.rating.review.toLowerCase().includes(q)
    );
  }, [items, query]);

  const verifiedCount = useMemo(
    () => items.filter((t) => t.rating.verified).length,
    [items]
  );

  const toggleVerified = (ratingId: number) => {
    setItems((prev) =>
      prev.map((t) =>
        t.rating.id === ratingId
          ? { ...t, rating: { ...t.rating, verified: !t.rating.verified } }
          : t
      )
    );
    const item = items.find((t) => t.rating.id === ratingId);
    if (item) {
      showToast(
        `"${item.user.name}" review is now ${
          item.rating.verified ? "unverified" : "verified"
        }.`,
        item.rating.verified ? "info" : "success"
      );
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    setItems((prev) => prev.filter((t) => t.rating.id !== deleting.rating.id));
    showToast(`Review by "${deleting.user.name}" deleted.`);
    setDeleting(null);
  };

  const copyEmail = async (id: number, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      showToast("Email copied.", "info");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast("Failed to copy.", "error");
    }
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

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Testimonials</h2>
          <p className={styles.subtitle}>
            {items.length} review{items.length === 1 ? "" : "s"} ·{" "}
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
                <tr key={t.rating.id}>
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
                        {t.rating.ratings}.0
                      </span>
                    </div>
                  </td>
                  <td className={styles.reviewCell}>
                    <span className={styles.reviewPreview} title={t.rating.review}>
                      {truncate(t.rating.review)}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={t.rating.verified}
                      className={`${styles.toggle} ${
                        t.rating.verified ? styles.toggleOn : styles.toggleOff
                      }`}
                      onClick={() => toggleVerified(t.rating.id)}
                      aria-label={`Toggle verified for ${t.user.name}`}
                    >
                      <span className={styles.toggleKnob} />
                      <span className={styles.toggleLabel}>
                        {t.rating.verified ? "Verified" : "Unverified"}
                      </span>
                    </button>
                  </td>
                  <td className={styles.date}>{formatDate(t.rating.created_at)}</td>
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
                <dd>#{viewing.rating.id}</dd>
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
                          i < viewing.rating.ratings ? "currentColor" : "none"
                        }
                        className={
                          i < viewing.rating.ratings
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
                  {viewing.rating.verified ? (
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
                <dd>{formatDateTime(viewing.rating.created_at)}</dd>
              </div>
            </dl>

            <div className={styles.dialogBody}>
              <p className={styles.dialogBodyLabel}>Review</p>
              <p className={styles.dialogReview}>{viewing.rating.review}</p>
            </div>

            <div className={styles.dialogActions}>
              <button
                type="button"
                className={`${styles.toggleLarge} ${
                  viewing.rating.verified
                    ? styles.toggleLargeOn
                    : styles.toggleLargeOff
                }`}
                onClick={() => {
                  toggleVerified(viewing.rating.id);
                  setViewing({
                    ...viewing,
                    rating: {
                      ...viewing.rating,
                      verified: !viewing.rating.verified,
                    },
                  });
                }}
              >
                {viewing.rating.verified ? (
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
