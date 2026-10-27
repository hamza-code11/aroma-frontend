"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Copy,
  Check,
  Shield,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Customer } from "@/types/customer";
import styles from "./Customers.module.css";

// Skeleton & Hooks
import CustomersSkeleton from "@/components/admin/skeletons/CustomersSkeleton/CustomersSkeleton";
import { useCustomers, useDeleteCustomer } from "@/hooks/useCustomers";

export default function CustomersList() {
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { showToast } = useToast();

  // Data Fetching
  const { data: apiData, isLoading } = useCustomers(1);
  const customers = apiData?.data || [];

  // Delete Mutation
  const deleteMutation = useDeleteCustomer();

  // Search Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const adminCount = useMemo(
    () => customers.filter((c) => c.role === "admin").length,
    [customers]
  );

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        showToast(`Customer "${deleting.name}" deleted.`, "success");
        setDeleting(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to delete customer", "error");
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Loading State
  if (isLoading) {
    return <CustomersSkeleton />;
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Customers</h2>
          <p className={styles.subtitle}>
            {customers.length} customer{customers.length === 1 ? "" : "s"} ·{" "}
            {adminCount} admin{adminCount === 1 ? "" : "s"}
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
            placeholder="Search by name, email or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search customers"
          />
        </div>
        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No customers found</p>
          <p className={styles.emptyText}>
            {query
              ? "Try a different search term."
              : "Customers will appear here once they sign up."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className={styles.userCell}>
                      <span
                        className={`${styles.avatar} ${
                          c.role === "admin" ? styles.avatarAdmin : ""
                        }`}
                        aria-hidden="true"
                      >
                        {getInitials(c.name)}
                      </span>
                      <span className={styles.name}>{c.name}</span>
                    </div>
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
                  <td>
                    <span
                      className={`${styles.roleBadge} ${
                        c.role === "admin"
                          ? styles.roleAdmin
                          : styles.roleUser
                      }`}
                    >
                      {c.role === "admin" ? (
                        <Shield size={11} strokeWidth={2.2} />
                      ) : (
                        <UserIcon size={11} strokeWidth={2.2} />
                      )}
                      {c.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className={styles.date}>{formatDate(c.created_at)}</td>
                  <td className={styles.tdRight}>
                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                      onClick={() => setDeleting(c)}
                      aria-label={`Delete ${c.name}`}
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
            <h3 className={styles.dialogTitle}>Delete customer?</h3>
            <p className={styles.dialogText}>
              Are you sure you want to delete{" "}
              <strong>{deleting.name}</strong> ({deleting.email})? This cannot
              be undone.
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