"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Eye, Package, Truck, Loader2, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import OrdersListSkeleton from "@/components/admin/skeletons/OrdersSkeleton/OrdersListSkeleton";
import styles from "./OrdersList.module.css";

type FilterType = "all" | "pending" | "processing" | "shipped" | "completed";

export default function OrdersList() {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    // Data Fetching
    const { data, isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const res = await axiosInstance.get("/admin/orders");
            return res.data.data;
        },
        staleTime: 1000 * 60 * 2, // 2 min cache
    });

    const orders = data?.data || [];

    // Filtered
    const filtered = useMemo(() => {
        let list = orders;
        if (filter !== "all") list = list.filter((o: any) => o.status === filter);
        const q = query.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (o: any) =>
                    o.full_name.toLowerCase().includes(q) ||
                    o.id.toString().includes(q) ||
                    o.user?.email.toLowerCase().includes(q)
            );
        }
        return list;
    }, [orders, filter, query]);

    const getStatusBadge = (status: string) => {
        const map: Record<string, string> = {
            pending: styles.badgePending,
            processing: styles.badgeProcessing,
            shipped: styles.badgeShipped,
            completed: styles.badgeCompleted,
            cancelled: styles.badgeCancelled,
        };
        return map[status] || styles.badgePending;
    };

    if (isLoading) {
        return <OrdersListSkeleton />;
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h2 className={styles.title}>Orders</h2>
                    <p className={styles.subtitle}>{orders.length} total orders</p>
                </div>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                {(["all", "pending", "processing", "shipped", "completed"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`${styles.tab} ${filter === tab ? styles.tabActive : ""}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <Search size={15} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by order ID, name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <span className={styles.count}>{filtered.length} results</span>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className={styles.empty}>
                    <Filter size={32} className={styles.emptyIcon} />
                    <p>No orders found.</p>
                </div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th className={styles.thRight}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o: any) => (
                                <tr key={o.id}>
                                    <td><strong>#{o.id}</strong></td>
                                    <td>
                                        <div className={styles.customerCell}>
                                            <span>{o.full_name}</span>
                                            <small>{o.user?.email}</small>
                                        </div>
                                    </td>
                                    <td><strong>${Number(o.total).toFixed(2)}</strong></td>
                                    <td><span className={`${styles.badge} ${getStatusBadge(o.status)}`}>{o.status}</span></td>
                                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className={styles.tdRight}>
                                        <Link href={`/admin/orders/${o.id}`} className={styles.iconBtn}>
                                            <Eye size={16} />
                                        </Link>
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
