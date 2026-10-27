import styles from "./TestimonialsSkeleton.module.css";

export default function TestimonialsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header Skeleton */}
        <div className={styles.header}>
          <div>
            <div className={`${styles.line} ${styles.eyebrow}`} />
            <div className={`${styles.line} ${styles.title}`} />
          </div>
          <div className={styles.rating}>
            <div className={`${styles.line} ${styles.score}`} />
            <div>
              <div className={`${styles.line} ${styles.stars}`} />
              <div className={`${styles.line} ${styles.count}`} />
            </div>
          </div>
        </div>

        {/* Toolbar Skeleton */}
        <div className={styles.toolbar}>
          <div className={`${styles.line} ${styles.writeBtn}`} />
          <div className={styles.controls}>
            <div className={`${styles.line} ${styles.arrow}`} />
            <div className={`${styles.line} ${styles.arrow}`} />
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className={styles.track}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={`${styles.line} ${styles.cardStars}`} />
              <div className={styles.cardQuote}>
                <div className={`${styles.line} ${styles.quoteLine}`} />
                <div className={`${styles.line} ${styles.quoteLine}`} />
                <div className={`${styles.line} ${styles.quoteLineShort}`} />
              </div>
              <div className={styles.cardAuthor}>
                <div className={`${styles.line} ${styles.authorName}`} />
                <div className={`${styles.line} ${styles.authorMeta}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
