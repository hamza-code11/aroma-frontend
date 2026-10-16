import styles from "./NewsletterSkeleton.module.css";

export default function NewsletterSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={`${styles.line} ${styles.search}`} />
        <div className={`${styles.line} ${styles.count}`} />
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.thRight}`} />
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={`${styles.line} ${styles.cellWide}`} />
            <div className={`${styles.line} ${styles.cell}`} />
            <div className={`${styles.line} ${styles.togglePill}`} />
            <div className={`${styles.line} ${styles.actionBtn}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
