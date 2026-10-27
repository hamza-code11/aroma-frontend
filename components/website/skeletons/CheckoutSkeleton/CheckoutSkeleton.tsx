import styles from "./CheckoutSkeleton.module.css";

export default function CheckoutSkeleton() {
  return (
    <main className={styles.page} aria-hidden="true">
      <div className={styles.container}>
        {/* Back Link Skeleton */}
        <div className={`${styles.line} ${styles.backLink}`} />

        {/* Header Skeleton */}
        <div className={styles.pageHeader}>
          <div className={`${styles.line} ${styles.pageTitle}`} />
          <div className={`${styles.line} ${styles.pageSubtitle}`} />
        </div>

        <div className={styles.layout}>
          {/* FORM SKELETON */}
          <div className={styles.formSection}>
            <div className={styles.header}>
              <div className={`${styles.line} ${styles.title}`} />
              <div className={`${styles.line} ${styles.subtitle}`} />
            </div>

            <div className={styles.form}>
              {/* Name */}
              <div className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={`${styles.line} ${styles.input}`} />
              </div>

              {/* Phone (with Code) */}
              <div className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={styles.phoneGroup}>
                  <div className={`${styles.line} ${styles.codeSelect}`} />
                  <div className={`${styles.line} ${styles.input}`} />
                </div>
              </div>

              {/* Country */}
              <div className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={`${styles.line} ${styles.input}`} />
              </div>

              {/* Address */}
              <div className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={`${styles.line} ${styles.input}`} />
              </div>

              {/* City & Postal */}
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <div className={`${styles.line} ${styles.label}`} />
                  <div className={`${styles.line} ${styles.input}`} />
                </div>
                <div className={styles.field}>
                  <div className={`${styles.line} ${styles.label}`} />
                  <div className={`${styles.line} ${styles.input}`} />
                </div>
              </div>

              {/* Submit Button */}
              <div className={`${styles.line} ${styles.submitBtn}`} />
            </div>
          </div>

          {/* SUMMARY SKELETON */}
          <aside className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <div className={`${styles.line} ${styles.summaryTitle}`} />
              <div className={styles.summaryItems}>
                <div className={`${styles.line} ${styles.summaryItem}`} />
                <div className={`${styles.line} ${styles.summaryItem}`} />
              </div>
              <div className={styles.summaryFooter}>
                <div className={styles.summaryRow}>
                  <div className={`${styles.line} ${styles.summaryLabel}`} />
                  <div className={`${styles.line} ${styles.summaryValue}`} />
                </div>
                <div className={styles.summaryRow}>
                  <div className={`${styles.line} ${styles.summaryLabel}`} />
                  <div className={`${styles.line} ${styles.summaryValue}`} />
                </div>
                <div className={styles.totalRow}>
                  <div className={`${styles.line} ${styles.totalLabel}`} />
                  <div className={`${styles.line} ${styles.totalValue}`} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
