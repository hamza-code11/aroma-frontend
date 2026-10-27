"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, CreditCard, Loader2, Hash, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import UserOrderDetailsSkeleton from "@/components/website/skeletons/UserOrderDetailsSkeleton/UserOrderDetailsSkeleton";
import styles from "./UserOrderDetails.module.css";

const STEPS = [
    { key: "processing", label: "Order Placed & Processing", desc: "Your payment was successful. We are preparing your order.", icon: Package },
    { key: "shipped", label: "Shipped", desc: "Your order is on the way.", icon: Truck },
    { key: "delivered", label: "Delivered", desc: "Your order has been delivered.", icon: CheckCircle2 },
];

export default function UserOrderDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;

    const { data: order, isLoading } = useQuery({
        queryKey: ["user-order", orderId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/user/orders/${orderId}`);
            return res.data.data;
        },
        enabled: !!orderId,
    });

    if (isLoading) return <UserOrderDetailsSkeleton />;
    if (!order) return <div className={styles.error}>Order not found.</div>;

    const isPaid = order.payment_status === "paid";

    const getStepIndex = (status: string) => {
        if (status === "delivered") return 2;
        if (status === "shipped") return 1;
        return 0; // Processing
    };

    const currentStep = getStepIndex(order.status);

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href="/profile" className={styles.backLink}><ArrowLeft size={14} /> Back to Profile</Link>

                {/* MAIN SINGLE BOX */}
                <div className={styles.mainCard}>
                    
                    {/* HEADER */}
                    <div className={styles.cardHeader}>
                        <div>
                            <h1 className={styles.title}>Order #{order.id}</h1>
                            <div className={styles.metaInfo}>
                                <span><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString("en-GB")}</span>
                                <span className={`${styles.paymentBadge} ${isPaid ? styles.paid : styles.unpaid}`}>
                                    {isPaid ? "Paid" : "Unpaid"}
                                </span>
                            </div>
                        </div>
                        {order.tracking_number && (
                            <div className={styles.trackingBox}>
                                <span className={styles.trackingLabel}>Tracking Number</span>
                                <span className={styles.trackingNumber}>{order.tracking_number}</span>
                            </div>
                        )}
                    </div>

                    {/* TWO COLUMN LAYOUT INSIDE THE CARD */}
                    <div className={styles.contentGrid}>
                        
                        {/* LEFT COLUMN: Timeline & Items */}
                        <div className={styles.leftCol}>
                            
                            {/* VERTICAL TIMELINE */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}><Truck size={16} /> Order Status</h2>
                                <div className={styles.verticalTimeline}>
                                    {STEPS.map((step, index) => {
                                        const isActive = index <= currentStep;
                                        const isCurrent = index === currentStep;
                                        const Icon = step.icon;
                                        
                                        return (
                                            <div key={step.key} className={`${styles.timelineStep} ${isActive ? styles.active : ""} ${isCurrent ? styles.current : ""}`}>
                                                <div className={styles.timelineIconWrap}>
                                                    <Icon size={16} />
                                                </div>
                                                {index < STEPS.length - 1 && (
                                                    <div className={`${styles.timelineLine} ${isActive && index < currentStep ? styles.lineActive : ""}`} />
                                                )}
                                                <div className={styles.timelineContent}>
                                                    <h4>{step.label}</h4>
                                                    <p>{step.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ORDER ITEMS */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}><Package size={16} /> Items</h2>
                                <div className={styles.itemsList}>
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className={styles.itemRow}>
                                            <div>
                                                <p className={styles.itemName}>{item.product_name}</p>
                                                <p className={styles.itemMeta}>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                                            </div>
                                            <strong>${Number(item.subtotal).toFixed(2)}</strong>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.totals}>
                                    <div><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
                                    <div><span>Shipping</span><span>${Number(order.shipping_price).toFixed(2)}</span></div>
                                    <div className={styles.totalRow}><span>Total</span><strong>${Number(order.total).toFixed(2)}</strong></div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Address & Payment */}
                        <div className={styles.rightCol}>
                            
                            {/* SHIPPING ADDRESS */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}><MapPin size={16} /> Shipping Address</h2>
                                <div className={styles.addressBlock}>
                                    <p className={styles.strong}>{order.full_name}</p>
                                    <p>{order.address}</p>
                                    <p>{order.city}, {order.postal_code}</p>
                                    <p>{order.country}</p>
                                    <p>{order.phone}</p>
                                </div>
                            </div>

                            {/* PAYMENT INFO */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}><CreditCard size={16} /> Payment Details</h2>
                                <div className={styles.paymentBlock}>
                                    <div className={styles.paymentRow}>
                                        <span>Method</span>
                                        <span className="capitalize">{order.payment_method || "Card"}</span>
                                    </div>
                                    <div className={styles.paymentRow}>
                                        <span>Transaction ID</span>
                                        <span className={styles.mono}>{order.transaction_id || "—"}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}