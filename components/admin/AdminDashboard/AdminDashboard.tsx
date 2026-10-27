"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Clock,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <header className={styles.heading}>
          <h2 className={styles.title}>Welcome back, Admin</h2>
          <p className={styles.subtitle}>Loading your store data...</p>
        </header>
        <div className={styles.stats}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.stat} ${styles.skeletonCard}`} />
          ))}
        </div>
        <div className={styles.mainSections}>
            <div className={styles.section}>
                <div className={`${styles.sectionTitle} ${styles.skeletonCard}`} style={{width: '200px', height: '24px'}}></div>
            </div>
            <div className={styles.section}>
                <div className={`${styles.sectionTitle} ${styles.skeletonCard}`} style={{width: '200px', height: '24px'}}></div>
            </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { products: 0, orders: 0, customers: 0, revenue: 0 };
  const recentOrders = data?.recent_orders || [];
  const pendingTaxCount = data?.pending_tax_ids_count || 0;

  const STATS = [
    {
      id: "products",
      label: "Total Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      id: "customers",
      label: "Customers",
      value: stats.customers,
      icon: Users,
      href: "/admin/customers",
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: `$${Number(stats.revenue).toFixed(2)}`,
      icon: DollarSign,
      href: "/admin/orders",
    },
  ];

  return (
    <div className={styles.wrap}>
      {/* Page heading */}
      <header className={styles.heading}>
        <h2 className={styles.title}>Welcome back, Admin</h2>
        <p className={styles.subtitle}>
          Here is a quick look at your store today.
        </p>
      </header>

      {/* Stats */}
      <div className={styles.stats}>
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.id} href={s.href} className={styles.stat}>
              <span className={styles.statIcon}>
                <Icon size={20} strokeWidth={1.7} />
              </span>
              <span className={styles.statBody}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statValue}>{s.value}</span>
              </span>
            </Link>
          );
        })}
      </div>

      {/* Main Sections Grid */}
      <div className={styles.mainSections}>
        
        {/* Recent Orders */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent 5 Orders</h3>
            <Link href="/admin/orders" className={styles.viewAll}>View All</Link>
          </div>
          <div className={styles.recentOrdersList}>
            {recentOrders.length === 0 ? (
              <p className={styles.noData}>No recent orders yet.</p>
            ) : (
              recentOrders.map((order: any) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className={styles.recentOrderItem}>
                  <div>
                    <span className={styles.orderId}>#{order.id}</span>
                    <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderTotal}>${Number(order.total).toFixed(2)}</span>
                    <span className={`${styles.badge} ${styles[`badge${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Tax ID Verifications */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Pending Tax IDs</h3>
            <Link href="/admin/tax-ids" className={styles.viewAll}>View All</Link>
          </div>
          <div className={styles.taxBox}>
            <div className={styles.taxIconWrap}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className={styles.taxCount}>{pendingTaxCount}</p>
              <p className={styles.taxLabel}>Tax ID requests pending admin approval</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
