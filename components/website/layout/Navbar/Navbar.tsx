"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Navbar.module.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Hydration error se bachne ke liye
  useEffect(() => {
    setMounted(true);
  }, []);

  // Route change par mobile menu band
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape key se menu band
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // GSAP ScrollTrigger: glassmorphism on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: styles.scrolled, targets: navRef.current },
      });
    });
    return () => ctx.revert();
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${menuOpen ? styles.menuOpen : ""}`}
    >
      <div className={styles.container}>
        {/* LEFT: Round logo with gold outline */}
        <Link href="/" className={styles.logo} aria-label="i.Shine Aroma - Home">
          <Image
            src="/logo/01.jpeg"
            alt="i.Shine Aroma"
            width={160}
            height={160}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* CENTER: Page links */}
        <ul
          id="primary-navigation"
          className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${isActive(link.href) ? styles.active : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: Icons */}
        <div className={styles.icons}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={20} strokeWidth={1.8} />
          </button>

          <button className={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.8} />
            <span className={styles.badge}>2</span>
          </button>

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} strokeWidth={1.8} />
            ) : (
              <Moon size={20} strokeWidth={1.8} />
            )}
          </button>

          {/* Hamburger (sirf mobile/tablet par) */}
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <Menu size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
