import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import styles from './NotFound.module.css';

export const metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <span className={styles.code}>404</span>

        <h1 className={styles.title}>Page not found</h1>

        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist, was removed, or
          is temporarily unavailable.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <Home size={16} strokeWidth={2.2} />
            Back to Home
          </Link>

          <Link href="/shop" className={styles.secondaryBtn}>
            <Search size={16} strokeWidth={2} />
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
