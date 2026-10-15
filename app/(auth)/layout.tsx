import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        {/* Top row: brand + back to home */}
        <div className={styles.sideTop}>
          <Link
            href="/"
            className={styles.brandRow}
            aria-label="i.Shine Aroma — Home"
          >
            <span className={styles.logo}>
              <Image
                src="/logo/01.jpeg"
                alt="i.Shine Aroma"
                width={160}
                height={160}
                className={styles.logoImage}
                priority
              />
            </span>
            <span className={styles.heading}>i.Shine Aroma</span>
          </Link>

          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to home
          </Link>
        </div>

        {/* Middle content — generic for login & register */}
        <div className={styles.sideContent}>
          <div className={styles.sideText}>
            <p className={styles.sideEyebrow}>Welcome to i.Shine Aroma</p>
            <h2 className={styles.sideTitle}>
              Your fragrance <br />
              journey{" "}
              <span className={styles.sideTitleAccent}>starts here</span>
            </h2>
            <p className={styles.sideLead}>
              Discover premium diffusers and fragrances crafted for every room.
              Sign in to track orders, save favourites, and unlock early access
              to new blends — or create an account to begin your collection.
            </p>
          </div>
        </div>

        {/* Bottom row — copyright only */}
        <div className={styles.sideBottom}>
          <p className={styles.sideFoot}>
            &copy; {new Date().getFullYear()} i.Shine Aroma
          </p>
        </div>
      </aside>

      <main className={styles.panel}>{children}</main>
    </div>
  );
}
