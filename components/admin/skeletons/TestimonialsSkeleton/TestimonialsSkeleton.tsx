import styles from "./TestimonialsSkeleton.module.css";

export default function TestimonialsSkeleton() {
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
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`${styles.line} ${styles.th}`} />
          ))}
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={styles.userCell}>
              <div className={`${styles.line} ${styles.avatar}`} />
              <div className={styles.userInfo}>
                <div className={`${styles.line} ${styles.cellName}`} />
                <div className={`${styles.line} ${styles.cellId}`} />
              </div>
            </div>
            <div className={`${styles.line} ${styles.cellEmail}`} />
            <div className={`${styles.line} ${styles.cellStars}`} />
            <div className={`${styles.line} ${styles.cellReview}`} />
            <div className={`${styles.line} ${styles.togglePill}`} />
            <div className={`${styles.line} ${styles.cellDate}`} />
            <div className={styles.actions}>
              <div className={`${styles.line} ${styles.actionBtn}`} />
              <div className={`${styles.line} ${styles.actionBtn}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
