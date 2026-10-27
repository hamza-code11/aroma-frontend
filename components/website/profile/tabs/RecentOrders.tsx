"use client";

import { Package, Truck, CheckCircle2, Loader2, CreditCard, Calendar, Hash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserOrders } from "@/hooks/useUserOrders";
import styles from "./RecentOrders.module.css";

const STEPS = [
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function RecentOrders() {
    const router = useRouter();
    const { data, isLoading } = useUserOrders();
    const orders = data?.data || [];

    if (isLoading) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <Loader2 className="animate-spin text-[var(--accent-primary)] mx-auto" size={32} />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div>
                <h2 className={styles.sectionTitle}>Recent Orders</h2>
                <div className={styles.emptyState}>
                    <Package size={48} className={styles.emptyIcon} strokeWidth={1} />
                    <h3>No recent orders</h3>
                    <p>You haven't placed any orders recently. Explore our collection to get started.</p>
                    <button onClick={() => router.push('/shop')} className={styles.actionBtn}>
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    const getStepIndex = (status: string) => {
        if (status === "delivered") return 2;
        if (status === "shipped") return 1;
        return 0; // Processing (completed, pending)
    };

    return (
        <div>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <div className={styles.ordersList}>
                {orders.map((order: any) => {
                    const currentStep = getStepIndex(order.status);
                    const isPaid = order.payment_status === "paid";

                    return (
                        <div key={order.id} className={styles.orderCard}>
                            
                            {/* TOP INFO */}
                            <div className={styles.cardHeader}>
                                <div className={styles.infoGroup}>
                                    <span className={styles.infoLabel}><Hash size={12} /> Order</span>
                                    <span className={styles.infoValue}>#{order.id}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.infoLabel}><Calendar size={12} /> Date</span>
                                    <span className={styles.infoValue}>{new Date(order.created_at).toLocaleDateString("en-GB")}</span>
                                </div>
                                <div className={styles.infoGroup}>
                                    <span className={styles.infoLabel}><CreditCard size={12} /> Payment</span>
                                    <span className={`${styles.paymentBadge} ${isPaid ? styles.paid : styles.unpaid}`}>
                                        {isPaid ? "Paid" : "Unpaid"}
                                    </span>
                                </div>
                            </div>

                            {/* TRACKING & TOTAL */}
                            <div className={styles.cardBody}>
                                <div className={styles.tracking}>
                                    {order.tracking_number ? (
                                        <>
                                            <Truck size={14} className={styles.trackingIcon} />
                                            <span>Tracking: <strong>{order.tracking_number}</strong></span>
                                        </>
                                    ) : (
                                        <span className={styles.noTracking}>Tracking not available yet</span>
                                    )}
                                </div>
                                <div className={styles.total}>
                                    <span>Total</span>
                                    <strong>${Number(order.total).toFixed(2)}</strong>
                                </div>
                            </div>

                            {/* ✅ NEW PREMIUM TIMELINE */}
                            <div className={styles.timelineWrap}>
                                {STEPS.map((step, index) => {
                                    const isActive = index <= currentStep;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.key} className={styles.timelineStep}>
                                            {/* Line behind icon */}
                                            {index !== 0 && (
                                                <div className={`${styles.timelineLine} ${isActive ? styles.lineActive : ""}`} />
                                            )}
                                            
                                            {/* Icon Circle */}
                                            <div className={`${styles.timelineIcon} ${isActive ? styles.iconActive : ""}`}>
                                                <Icon size={14} strokeWidth={2.5} />
                                            </div>
                                            
                                            {/* Label */}
                                            <span className={`${styles.timelineLabel} ${isActive ? styles.labelActive : ""}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* VIEW DETAILS */}
                            <button 
                                className={styles.viewBtn}
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <Eye size={14} /> View Details
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
