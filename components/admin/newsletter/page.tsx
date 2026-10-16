"use client";

import { useMemo, useState } from "react";
import { Search, Trash2, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { NewsletterSubscriber } from "@/types/newsletter";
import styles from "./Newsletter.module.css";

type Props = {
  subscribers: NewsletterSubscriber[];
};

export default function NewsletterList({ subscribers: initial }: Props) {
  const [subscribers, setSubscribers] = useState(initial);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<NewsletterSubscriber | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  const activeCount = useMemo(
    () => subscribers.filter((s) => s.is_active).length,
    [subscribers]
  );

  const handleDelete = () => {
    if (!deleting) return;
    setSubscribers((prev) => prev.filter((s) => s.id !== deleting.id));
    showToast(`"${deleting.email}" removed from newsletter.`);
    setDeleting(null);
  };

  const toggleStatus = (id: number) => {
    setSubscribers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const copyEmail = async (id: number, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      showToast("Email copied to clipboard.", "info");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast("Failed to copy email.", "error");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Newsletter</h2>
          <p className={styles.subtitle}>
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"} ·{" "}
            {activeCount} active
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
            placeholder="Search by email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search subscribers"
          />
        </div>
        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No subscribers found</p>
          <p className={styles.emptyText}>
            {query
              ? "Try a different search term."
              : "Subscribers will appear here once people join."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Status</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className={styles.emailCell}>
                      <span className={styles.email}>{s.email}</span>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => copyEmail(s.id, s.email)}
                        aria-label="Copy email"
                      >
                        {copiedId === s.id ? (
                          <Check size={13} strokeWidth={2} />
                        ) : (
                          <Copy size={13} strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className={styles.date}>{formatDate(s.subscribed_at)}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={s.is_active}
                      className={`${styles.toggle} ${
                        s.is_active ? styles.toggleOn : styles.toggleOff
                      }`}
                      onClick={() => toggleStatus(s.id)}
                      aria-label={`Toggle ${s.email} ${
                        s.is_active ? "inactive" : "active"
                      }`}
                    >
                      <span className={styles.toggleKnob} />
                      <span className={styles.toggleLabel}>
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className={styles.tdRight}>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => setDeleting(s)}
                      aria-label={`Delete ${s.email}`}
                    >
                      <Trash2 size={15} strokeWidth={1.7} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h3 className={styles.dialogTitle}>Remove subscriber?</h3>
            <p className={styles.dialogText}>
              Are you sure you want to remove{" "}
              <strong>{deleting.email}</strong> from the newsletter? This
              cannot be undone.
            </p>
            <div className={styles.dialogActions}>
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
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
