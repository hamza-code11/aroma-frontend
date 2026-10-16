"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminHeader from "../AdminHeader/AdminHeader";
import styles from "./AdminShell.module.css";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open (mobile)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.shell}>
      {/* SIDEBAR — desktop always visible, mobile drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* BACKDROP (mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className={styles.main}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
