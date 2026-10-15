import styles from "./CartSkeleton.module.css";

export default function CartSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={`${styles.line} ${styles.eyebrow}`} />
            <div className={`${styles.line} ${styles.title}`} />
            <div className={`${styles.line} ${styles.subtitle}`} />
          </div>
          <div className={`${styles.line} ${styles.clearBtn}`} />
        </div>

        {/* Main */}
        <div className={styles.main}>
          {/* Items */}
          <div className={styles.itemsCol}>
            <ul className={styles.items}>
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className={styles.item}>
                  <div className={`${styles.block} ${styles.itemImage}`} />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div className={`${styles.line} ${styles.itemName}`} />
                      <div className={`${styles.line} ${styles.removeBtn}`} />
                    </div>
                    <div className={styles.itemBottom}>
                      <div className={`${styles.line} ${styles.itemPrice}`} />
                      <div className={`${styles.line} ${styles.qty}`} />
                      <div className={`${styles.line} ${styles.lineTotal}`} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <aside className={styles.summary}>
            <div className={`${styles.line} ${styles.summaryTitle}`} />
            <div className={styles.summaryList}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.summaryRow}>
                  <div className={`${styles.line} ${styles.summaryLabel}`} />
                  <div className={`${styles.line} ${styles.summaryValue}`} />
                </div>
              ))}
            </div>
            <div className={`${styles.line} ${styles.promo}`} />
            <div className={`${styles.line} ${styles.grandTotal}`} />
            <div className={`${styles.line} ${styles.checkout}`} />
          </aside>
        </div>
      </div>
    </div>
  );
}
