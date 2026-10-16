import styles from "./ListSkeleton.module.css";

export default function ListSkeleton() {
  return (
    <div className={styles.page} aria-hidden="true">
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
        <div className={`${styles.line} ${styles.btn}`} />
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={`${styles.line} ${styles.search}`} />
        <div className={`${styles.line} ${styles.count}`} />
      </div>

      {/* TABLE */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
          <div className={`${styles.line} ${styles.th}`} />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            {/* Product cell */}
            <div className={styles.productCell}>
              <div className={`${styles.line} ${styles.thumb}`} />
              <div className={`${styles.line} ${styles.productName}`} />
            </div>
            <div className={`${styles.line} ${styles.cell}`} />
            <div className={`${styles.line} ${styles.cell}`} />
            <div className={`${styles.line} ${styles.cellShort}`} />
            <div className={`${styles.line} ${styles.stockPill}`} />
            <div className={`${styles.line} ${styles.togglePill}`} />
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
