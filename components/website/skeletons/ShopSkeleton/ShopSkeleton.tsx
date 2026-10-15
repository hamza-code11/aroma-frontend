import styles from "./ShopSkeleton.module.css";

export default function ShopSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <div className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={`${styles.line} ${styles.eyebrow}`} />
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.titleShort}`} />
          <div className={`${styles.line} ${styles.lead}`} />
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`${styles.line} ${styles.tab}`} />
            ))}
          </div>
          <div className={`${styles.line} ${styles.sort}`} />
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <div className={`${styles.line} ${styles.cardImage}`} />
              <div className={styles.cardInfo}>
                <div className={`${styles.line} ${styles.cardName}`} />
                <div className={`${styles.line} ${styles.cardDesc}`} />
                <div className={`${styles.line} ${styles.cardDescShort}`} />
                <div className={styles.cardFooter}>
                  <div className={`${styles.line} ${styles.cardPrice}`} />
                  <div className={`${styles.line} ${styles.cardBtn}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
