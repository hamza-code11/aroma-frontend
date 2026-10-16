import styles from "./CustomersSkeleton.module.css";

export default function CustomersSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <div className={styles.header}>
        <div>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
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
          <div className={`${styles.line} ${styles.thRight}`} />
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.userCell}>
              <div className={`${styles.line} ${styles.avatar}`} />
              <div className={`${styles.line} ${styles.cellName}`} />
            </div>
            <div className={`${styles.line} ${styles.cellEmail}`} />
            <div className={`${styles.line} ${styles.rolePill}`} />
            <div className={`${styles.line} ${styles.cell}`} />
            <div className={`${styles.line} ${styles.actionBtn}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
