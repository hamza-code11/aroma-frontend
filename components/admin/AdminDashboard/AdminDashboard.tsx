import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { products } from "@/data/product";
import { categories } from "@/data/category";
import styles from "./AdminDashboard.module.css";

const STATS = [
  {
    id: "products",
    label: "Total Products",
    value: products.length,
    icon: Package,
    href: "/admin/products",
  },
  {
    id: "categories",
    label: "Categories",
    value: categories.length,
    icon: ShoppingCart,
    href: "/admin/categories",
  },
  {
    id: "customers",
    label: "Customers",
    value: 12,
    icon: Users,
    href: "/admin/customers",
  },
  {
    id: "revenue",
    label: "Revenue (mock)",
    value: "$4,250",
    icon: DollarSign,
    href: "/admin/orders",
  },
];

export default function AdminDashboard() {
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

      {/* Quick links */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick actions</h3>
        <div className={styles.quickGrid}>
          <Link href="/admin/products" className={styles.quickCard}>
            <span>Manage products</span>
            <ArrowRight size={16} strokeWidth={1.6} />
          </Link>
          <Link href="/admin/categories" className={styles.quickCard}>
            <span>Manage categories</span>
            <ArrowRight size={16} strokeWidth={1.6} />
          </Link>
          <Link href="/admin/orders" className={styles.quickCard}>
            <span>View orders</span>
            <ArrowRight size={16} strokeWidth={1.6} />
          </Link>
          <Link href="/admin/settings" className={styles.quickCard}>
            <span>Store settings</span>
            <ArrowRight size={16} strokeWidth={1.6} />
          </Link>
        </div>
      </section>
    </div>
  );
}
