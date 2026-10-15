"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

type Variant = "icon" | "pill";
type Size = "sm" | "md";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  label?: string;
};

export default function ThemeToggle({
  variant = "icon",
  size = "md",
  className = "",
  label = "Toggle theme",
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch avoid karne ke liye
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  // Icon button variant
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`${styles.iconBtn} ${styles[size]} ${className}`}
        aria-label={ariaLabel}
        title={ariaLabel}
        suppressHydrationWarning
      >
        <span className={`${styles.iconWrap} ${isDark ? styles.dark : styles.light}`}>
          <Sun
            size={size === "sm" ? 16 : 20}
            strokeWidth={1.8}
            className={styles.iconSun}
          />
          <Moon
            size={size === "sm" ? 16 : 20}
            strokeWidth={1.8}
            className={styles.iconMoon}
          />
        </span>
      </button>
    );
  }

  // Pill variant (icon + label)
  return (
    <button
      type="button"
      onClick={toggle}
      className={`${styles.pillBtn} ${styles[size]} ${className}`}
      aria-label={ariaLabel}
      title={ariaLabel}
      suppressHydrationWarning
    >
      <span className={`${styles.iconWrap} ${isDark ? styles.dark : styles.light}`}>
        <Sun
          size={size === "sm" ? 16 : 18}
          strokeWidth={1.8}
          className={styles.iconSun}
        />
        <Moon
          size={size === "sm" ? 16 : 18}
          strokeWidth={1.8}
          className={styles.iconMoon}
        />
      </span>
      <span className={styles.pillLabel}>
        {mounted ? (isDark ? label || "Light" : label || "Dark") : label}
      </span>
    </button>
  );
}
