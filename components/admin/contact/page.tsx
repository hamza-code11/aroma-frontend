"use client";

import { useMemo, useState } from "react";
import { Search, Trash2, Copy, Check, Mail, Eye, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Contact } from "@/types/contact";
import styles from "./Contact.module.css";

// Skeleton Import
import ContactSkeleton from "@/components/admin/skeletons/ContactSkeleton/ContactSkeleton";

// Hooks Import
import { useAdminContacts, useDeleteContact } from "@/hooks/useContacts";

export default function ContactList() {
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useToast();

  // Fetch Data
  const { data: apiData, isLoading } = useAdminContacts(1);
  const contacts = apiData?.data || [];

  // Delete Mutation
  const deleteMutation = useDeleteContact();

  // Search Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
    );
  }, [contacts, query]);

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        showToast(`Message from "${deleting.name}" deleted.`, "success");
        setDeleting(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to delete message", "error");
      }
    });
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

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const truncate = (s: string, n = 60) =>
    s.length > n ? s.slice(0, n) + "…" : s;

  // Loading State -> Show Skeleton
  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Contact Messages</h2>
          <p className={styles.subtitle}>
            {contacts.length} message{contacts.length === 1 ? "" : "s"} received.
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
            placeholder="Search by name, email or subject…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search messages"
          />
        </div>
        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No messages found</p>
          <p className={styles.emptyText}>
            {query
              ? "Try a different search term."
              : "Messages will appear here when visitors reach out."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Created</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={styles.name}>{c.name}</span>
                  </td>
                  <td>
                    <div className={styles.emailCell}>
                      <span className={styles.email}>{c.email}</span>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => copyEmail(c.id, c.email)}
                        aria-label="Copy email"
                      >
                        {copiedId === c.id ? (
                          <Check size={13} strokeWidth={2} />
                        ) : (
                          <Copy size={13} strokeWidth={1.7} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className={styles.subject}>{c.subject || "—"}</td>
                  <td className={styles.messageCell}>
                    <span
                      className={styles.messagePreview}
                      title={c.message}
                    >
                      {truncate(c.message, 60)}
                    </span>
                  </td>
                  <td className={styles.date}>{formatDate(c.created_at)}</td>
                  <td className={styles.tdRight}>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setViewing(c)}
                        aria-label={`View message from ${c.name}`}
                      >
                        <Eye size={15} strokeWidth={1.7} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => setDeleting(c)}
                        aria-label={`Delete message from ${c.name}`}
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
          onMouseDown={(ev) => ev.target === ev.currentTarget && setViewing(null)}
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
              <span className={styles.dialogIcon} aria-hidden="true">
                <Mail size={20} strokeWidth={1.7} />
              </span>
              <div>
                <p className={styles.dialogEyebrow}>Message from</p>
                <h3 className={styles.dialogTitle}>{viewing.name}</h3>
              </div>
            </header>

            <dl className={styles.dialogMeta}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${viewing.email}`} className={styles.link}>
                    {viewing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Subject</dt>
                <dd>{viewing.subject || "—"}</dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
            </dl>

            <div className={styles.dialogBody}>
              <p className={styles.dialogBodyLabel}>Message</p>
              <p className={styles.dialogMessage}>{viewing.message}</p>
            </div>

            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setViewing(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleting && (
        <div
          className={styles.backdrop}
          onMouseDown={(ev) => ev.target === ev.currentTarget && setDeleting(null)}
          role="presentation"
        >
          <div className={styles.dialog} role="alertdialog" aria-modal="true">
            <h3 className={styles.dialogTitle}>Delete message?</h3>
            <p className={styles.dialogText}>
              Are you sure you want to delete the message from{" "}
              <strong>{deleting.name}</strong>? This cannot be undone.
            </p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeleting(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                autoFocus
              >
                {deleteMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

