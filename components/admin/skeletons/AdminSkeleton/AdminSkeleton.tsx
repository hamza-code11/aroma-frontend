import styles from "./AdminSkeleton.module.css";

export default function AdminShellSkeleton() {
  return (
    <div className={styles.shell}>
      {/* SIDEBAR SKELETON */}
      <aside className={styles.sidebar}>
        <div className={`${styles.line} ${styles.logo}`} />
        <div className={styles.navLinks}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${styles.line} ${styles.navItem}`} />
          ))}
        </div>
      </aside>

      {/* MAIN AREA SKELETON */}
      <div className={styles.main}>
        {/* HEADER SKELETON */}
        <header className={styles.header}>
          <div className={`${styles.line} ${styles.headerTitle}`} />
          <div className={styles.headerRight}>
            <div className={`${styles.line} ${styles.headerIcon}`} />
            <div className={`${styles.line} ${styles.headerIcon}`} />
          </div>
        </header>

        {/* CONTENT SKELETON */}
        <main className={styles.content}>
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
        </main>
      </div>
    </div>
  );
}
