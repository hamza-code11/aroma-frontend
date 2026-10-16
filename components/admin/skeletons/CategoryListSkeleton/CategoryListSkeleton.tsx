import styles from "./CategoryListSkeleton.module.css";

export default function CategoryListSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
        <div className={`${styles.line} ${styles.createBtn}`} />
      </div>

      <div className={styles.toolbar}>
        <div className={`${styles.line} ${styles.search}`} />
        <div className={`${styles.line} ${styles.count}`} />
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={`${styles.line} ${styles.td}`} />
            <div className={`${styles.line} ${styles.td}`} />
            <div className={`${styles.line} ${styles.td}`} />
            <div className={`${styles.line} ${styles.tdRight}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
