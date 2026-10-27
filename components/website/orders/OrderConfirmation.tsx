"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import axiosInstance from "@/lib/axios";
import styles from "./OrderConfirmation.module.css";

export default function OrderConfirmation({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/orders/${orderId}`);
                setOrder(res.data.data);
            } catch (err) {
                console.error("Failed to fetch order", err);
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) return <div className={styles.loading}>Loading order details...</div>;
    if (!order) return <div className={styles.error}>Order not found.</div>;

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <div className={styles.iconWrap}>
                    <CheckCircle2 size={48} className={styles.icon} />
                </div>
                <h1 className={styles.title}>Thank you for your order!</h1>
                <p className={styles.subtitle}>
                    Your payment was successful. We&apos;ve sent a confirmation email to your inbox.
                </p>

                <div className={styles.details}>
                    <div className={styles.row}>
                        <span>Order Number</span>
                        <strong>#{order.id}</strong>
                    </div>
                    <div className={styles.row}>
                        <span>Total Paid</span>
                        <strong>${Number(order.total).toFixed(2)}</strong>
                    </div>
                    <div className={styles.row}>
                        <span>Status</span>
                        <span className={styles.statusBadge}>{order.status}</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/shop" className={styles.primaryBtn}>
                        Continue Shopping
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </main>
    );
}
