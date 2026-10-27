"use client";

import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  User as UserIcon,
  Filter,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAdminTaxIds, useUpdateTaxIdStatus } from "@/hooks/useTaxId";
import type { TaxId } from "@/types/tax-id";
import styles from "./TaxIdsList.module.css";

// Filter Types
type FilterType = "all" | "pending" | "verified" | "rejected";

export default function TaxIdsList() {
  const { showToast } = useToast();
  const { data: taxIds = [], isLoading } = useAdminTaxIds();
  const updateMutation = useUpdateTaxIdStatus();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filtered Data
  const filteredData = useMemo(() => {
    let list = taxIds;

    // 1. Filter by status
    if (activeFilter !== "all") {
      list = list.filter((t) => t.status === activeFilter);
    }

    // 2. Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.tax_id.toLowerCase().includes(q) ||
          t.user?.name.toLowerCase().includes(q) ||
          t.user?.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [taxIds, activeFilter, query]);

  // Counts for Tabs
  const counts = useMemo(() => {
    return {
      all: taxIds.length,
      pending: taxIds.filter((t) => t.status === "pending").length,
      verified: taxIds.filter((t) => t.status === "verified").length,
      rejected: taxIds.filter((t) => t.status === "rejected").length,
    };
  }, [taxIds]);

  // Handle Status Update
  const handleStatusChange = (id: number, status: "verified" | "rejected") => {
    updateMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          showToast(`Tax ID ${status === "verified" ? "approved" : "rejected"} successfully.`, "success");
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message || "Failed to update status.", "error");
        },
      }
    );
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className={`${styles.badge} ${styles.badgeVerified}`}>
            <CheckCircle2 size={12} /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className={`${styles.badge} ${styles.badgeRejected}`}>
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgePending}`}>
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Tax ID Verification</h2>
          <p className={styles.subtitle}>Review and manage user tax IDs.</p>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email or Tax ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        {(["all", "pending", "verified", "rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`${styles.tab} ${activeFilter === tab ? styles.tabActive : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={styles.tabCount}>{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* TABLE */}
      {filteredData.length === 0 ? (
        <div className={styles.empty}>
          <Filter size={32} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No records found</p>
          <p className={styles.emptyText}>
            {query ? "Try a different search term." : "No tax IDs in this category."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Tax ID</th>
                <th>Status</th>
                <th>Submitted</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div className={styles.userCell}>
                      <span className={styles.avatar}>
                        {t.user?.name.charAt(0).toUpperCase()}
                      </span>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{t.user?.name}</span>
                        <span className={styles.userEmail}>{t.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className={styles.taxCode}>{t.tax_id}</code>
                  </td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td className={styles.date}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                  <td className={styles.tdRight}>
                    {t.status === "pending" && (
                      <div className={styles.actions}>
                        <button
                          className={`${styles.iconBtn} ${styles.verifyBtn}`}
                          onClick={() => handleStatusChange(t.id, "verified")}
                          disabled={updateMutation.isPending}
                          title="Approve"
                        >
                          {updateMutation.isPending && updateMutation.variables?.id === t.id && updateMutation.variables?.status === "verified" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.rejectBtn}`}
                          onClick={() => handleStatusChange(t.id, "rejected")}
                          disabled={updateMutation.isPending}
                          title="Reject"
                        >
                          {updateMutation.isPending && updateMutation.variables?.id === t.id && updateMutation.variables?.status === "rejected" ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <XCircle size={16} />
                          )}
                        </button>
                      </div>
                    )}
                    {t.status !== "pending" && (
                      <span className={styles.noActions}>No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
