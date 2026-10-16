import styles from "./AdminSkeleton.module.css";

export default function AdminSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.heading}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.subtitle}`} />
      </div>

      <div className={styles.stats}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.stat}>
            <div className={`${styles.line} ${styles.statIcon}`} />
            <div className={styles.statBody}>
              <div className={`${styles.line} ${styles.statLabel}`} />
              <div className={`${styles.line} ${styles.statValue}`} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={`${styles.line} ${styles.sectionTitle}`} />
        <div className={styles.quickGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${styles.line} ${styles.quickCard}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
