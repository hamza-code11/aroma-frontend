import styles from "./CmsSkeleton.module.css";

export default function CmsSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${styles.line} ${styles.tab}`} />
        ))}
      </div>

      {/* PANEL */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={`${styles.line} ${styles.panelIcon}`} />
          <div className={styles.panelText}>
            <div className={`${styles.line} ${styles.panelTitle}`} />
            <div className={`${styles.line} ${styles.panelSubtitle}`} />
          </div>
        </div>
        <div className={`${styles.line} ${styles.placeholder}`} />
      </div>
    </div>
  );
}
