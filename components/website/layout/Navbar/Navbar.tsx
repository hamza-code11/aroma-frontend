"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useCart } from "@/hooks/useCart";
import { useWishlistContext } from "@/app/providers/WishlistProvider";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const { totalItems, mounted: cartMounted } = useCart();
  const { wishlist, mounted: wishMounted, open: openWishlist } =
    useWishlistContext();

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const cartCount = cartMounted ? totalItems : 0;
  const wishlistCount = wishMounted ? wishlist.length : 0;

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${menuOpen ? styles.menuOpen : ""}`}
    >
      <div className={styles.container}>
        {/* LEFT: Round logo */}
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
                className={`${styles.link} ${isActive(link.href) ? styles.active : ""
                  }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT: Icons */}
        <div className={styles.icons}>
          {/* Sign in */}
          <Link
            href="/login"
            className={styles.iconBtn}
            aria-label="Sign in"
          >
            <User size={20} strokeWidth={1.8} />
          </Link>

          {/* Wishlist */}
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""
              }`}
            onClick={openWishlist}
          >
            <Heart size={20} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className={`${styles.badge} ${styles.badgeRed}`}>{wishlistCount}</span>
            )}
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className={styles.iconBtn}
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Hamburger (mobile only) */}
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
