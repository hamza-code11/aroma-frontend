import styles from "./ProductDetailsSkeleton.module.css";

export default function ProductDetailsSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={`${styles.line} ${styles.crumb}`} />

        {/* Main */}
        <div className={styles.main}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={`${styles.block} ${styles.mainImage}`} />
            <div className={styles.thumbRow}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`${styles.block} ${styles.thumb}`} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={`${styles.line} ${styles.sku}`} />
            <div className={`${styles.line} ${styles.name}`} />
            <div className={`${styles.line} ${styles.nameShort}`} />
            <div className={`${styles.line} ${styles.desc}`} />
            <div className={`${styles.line} ${styles.descShort}`} />
            <div className={`${styles.line} ${styles.price}`} />
            <div className={styles.actions}>
              <div className={`${styles.line} ${styles.qty}`} />
              <div className={`${styles.line} ${styles.addBtn}`} />
            </div>
            <div className={styles.perks}>
              <div className={`${styles.line} ${styles.perk}`} />
              <div className={`${styles.line} ${styles.perk}`} />
              <div className={`${styles.line} ${styles.perk}`} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsWrap}>
          <div className={styles.tabs}>
            <div className={`${styles.line} ${styles.tab}`} />
            <div className={`${styles.line} ${styles.tab}`} />
            <div className={`${styles.line} ${styles.tab}`} />
          </div>
          <div className={`${styles.line} ${styles.panel}`} />
          <div className={`${styles.line} ${styles.panelShort}`} />
        </div>

        {/* Related */}
        <div className={styles.related}>
          <div className={`${styles.line} ${styles.relatedTitle}`} />
          <div className={styles.relatedGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${styles.block} ${styles.card}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
