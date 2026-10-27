"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, FileText, Loader2, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/ui/Toast";
import OrderDetailsSkeleton from "@/components/admin/skeletons/OrdersSkeleton/OrderDetailsSkeleton";
import styles from "./OrderDetails.module.css";

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: order, isLoading } = useQuery({
        queryKey: ["admin-order", orderId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/admin/orders/${orderId}`);
            return res.data.data;
        },
        enabled: !!orderId,
    });

    const shipMutation = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post(`/admin/orders/${orderId}/ship`);
            return res.data;
        },
        onSuccess: () => {
            showToast("FedEx Shipment created successfully!", "success");
            queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || "Failed to create shipment.", "error");
        },
    });

    if (isLoading) return <OrderDetailsSkeleton />;
    if (!order) return <div className={styles.error}>Order not found.</div>;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB");
    };

    return (
        <div className={styles.page}>
            {/* HEADER */}
            <div className={styles.header}>
                <Link href="/admin/orders" className={styles.backLink}>
                    <ArrowLeft size={14} /> Back to Orders
                </Link>
                <div className={styles.headerTitle}>
                    <h1>Order #{order.id}</h1>
                    <span className={`${styles.badge} ${styles[`badge${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className={styles.invoiceContainer}>
                
                {/* TOP INFO GRID */}
                <div className={styles.topGrid}>
                    <div className={styles.gridRow}>
                        <span className={styles.label}>Order No.</span><span className={styles.value}>{order.id}</span>
                        <span className={styles.label}>Order Date</span><span className={styles.value}>{formatDate(order.created_at)}</span>
                    </div>
                    <div className={styles.gridRow}>
                        <span className={styles.label}>Payment Method</span><span className={styles.value}>{order.payment_method || "Card"}</span>
                        <span className={styles.label}>Payment Status</span><span className={styles.value}>{order.payment_status}</span>
                    </div>
                    <div className={styles.gridRow}>
                        <span className={styles.label}>Shipping Method</span><span className={styles.value}>{order.shipping_method || "FedEx"}</span>
                        <span className={styles.label}>Tracking No.</span><span className={styles.value}>{order.tracking_number || "—"}</span>
                    </div>
                    <div className={styles.gridRow}>
                        <span className={styles.label}>Transaction ID</span><span className={styles.value}>{order.transaction_id || "—"}</span>
                        <span className={styles.label}>Paid At</span><span className={styles.value}>{order.paid_at ? formatDate(order.paid_at) : "—"}</span>
                    </div>
                </div>

                {/* CUSTOMER DETAILS & ACTIONS (Full Width Row) */}
                <div className={styles.customerRow}>
                    <div className={styles.customerInfo}>
                        <h4 className={styles.sectionTitle}>Customer Details</h4>
                        <div className={styles.infoLine}><strong>Name:</strong> {order.full_name}</div>
                        <div className={styles.infoLine}><strong>Email:</strong> {order.user?.email}</div>
                        <div className={styles.infoLine}><strong>Phone:</strong> {order.phone}</div>
                        <div className={styles.infoLine}><strong>Address:</strong> {order.address}, {order.city}, {order.postal_code}, {order.country}</div>
                    </div>
                    
                    <div className={styles.actionButtons}>
                        {order.label_url && (
                            <a href={order.label_url} target="_blank" rel="noreferrer" className={styles.btnOutline}>
                                <Download size={14} /> Download Label
                            </a>
                        )}
                        {!order.tracking_number && (
                            <button onClick={() => shipMutation.mutate()} disabled={shipMutation.isPending} className={styles.btnPrimary}>
                                {shipMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <><Truck size={14} /> Create FedEx Shipment</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div className={styles.tableWrap}>
                    <table className={styles.itemsTable}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Title</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th className={styles.textRight}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.product_name}</td>
                                    <td>{formatDate(order.created_at)}</td>
                                    <td>${Number(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td className={styles.textRight}>${Number(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TOTALS */}
                <div className={styles.totalsWrap}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>${Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Shipping</span>
                            <span>${Number(order.shipping_price).toFixed(2)}</span>
                        </div>
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <span>Total</span>
                            <span>${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
