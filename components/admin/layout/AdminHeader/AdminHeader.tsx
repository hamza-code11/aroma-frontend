"use client";

import Link from "next/link";
import { Menu, ExternalLink, User } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./AdminHeader.module.css";

type Props = {
  onMenuClick?: () => void;
  title?: string;
};

export default function AdminHeader({
  onMenuClick,
  title = "Admin",
}: Props) {
  return (
    <header className={styles.header}>
      {/* LEFT — mobile menu + title */}
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className={styles.titleWrap}>
          <p className={styles.eyebrow}>i.Shine Aroma</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      {/* RIGHT — actions */}
      <div className={styles.right}>
        <Link
          href="/"
          className={styles.siteLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View site"
        >
          <ExternalLink size={14} strokeWidth={1.6} />
        </Link>

        <ThemeToggle size="sm" />

        <div className={styles.user} aria-label="Admin user">
          <span className={styles.userAvatar}>
            <User size={16} strokeWidth={1.7} />
          </span>
          <span className={styles.userText}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Owner</span>
          </span>
        </div>
      </div>
    </header>
  );
}
