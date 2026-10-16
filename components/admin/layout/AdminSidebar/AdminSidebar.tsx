"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Mail,
  FileText,
  X,
  Star,
  MessageSquare
} from "lucide-react";
import styles from "./AdminSidebar.module.css";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: string;
};

type NavSection = {
  heading: string;
  items: NavItem[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SECTIONS: NavSection[] = [
  {
    heading: "Dashboards",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    heading: "Store",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    heading: "Apps",
    items: [
            {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: Star,
      },
      {
        label: "Contact",
        href: "/admin/contact",
        icon: MessageSquare,
      },
      {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
        badge: "New",
      },
      {
        label: "CMS Manager",
        href: "/admin/cms",
        icon: FileText,
        badge: "New",
      },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <Link href="/admin" className={styles.brand} onClick={onClose}>
        <span className={styles.brandLogo}>
          <Image
            src="/logo/01.jpeg"
            alt="i.Shine Aroma"
            width={64}
            height={64}
            className={styles.brandLogoImg}
            priority
          />
        </span>
        <span className={styles.brandName}>i.Shine Aroma</span>
      </Link>

      {/* Mobile close button */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>

      {/* Nav */}
      <nav className={styles.nav}>
        {SECTIONS.map((section) => (
          <div key={section.heading} className={styles.section}>
            <p className={styles.sectionLabel}>{section.heading}</p>
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${active ? styles.navLinkActive : ""
                        }`}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                    >
                      <span className={styles.navIcon}>
                        <Icon size={18} strokeWidth={1.7} />
                      </span>
                      <span className={styles.navText}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.badge}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <Link href="/" className={styles.backToSite}>
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
