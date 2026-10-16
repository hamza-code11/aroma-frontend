import styles from "./EditSkeleton.module.css";

export default function EditSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={`${styles.line} ${styles.back}`} />
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />
        </div>
        <div className={styles.headerActions}>
          <div className={`${styles.line} ${styles.btn}`} />
          <div className={`${styles.line} ${styles.btn}`} />
        </div>
      </div>

      {/* LAYOUT */}
      <div className={styles.layout}>
        {/* LEFT */}
        <div className={styles.left}>
          {/* Basic Info */}
          <div className={styles.section}>
            <div className={`${styles.line} ${styles.sectionTitle}`} />
            <div className={styles.grid2}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.field}>
                  <div className={`${styles.line} ${styles.label}`} />
                  <div className={`${styles.line} ${styles.input}`} />
                </div>
              ))}
            </div>
            <div className={styles.field}>
              <div className={`${styles.line} ${styles.label}`} />
              <div className={`${styles.line} ${styles.textarea}`} />
            </div>
          </div>

          {/* Images */}
          <div className={styles.section}>
            <div className={`${styles.line} ${styles.sectionTitle}`} />
            <div className={styles.previewGrid}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={`${styles.line} ${styles.previewItem}`} />
              ))}
            </div>
            <div className={`${styles.line} ${styles.dropZone}`} />
          </div>

          {/* Status */}
          <div className={styles.section}>
            <div className={`${styles.line} ${styles.sectionTitle}`} />
            <div className={`${styles.line} ${styles.checkbox}`} />
          </div>
        </div>

        {/* RIGHT */}
        <aside className={styles.right}>
          {/* Pricing */}
          <div className={styles.section}>
            <div className={`${styles.line} ${styles.sectionTitle}`} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={`${styles.line} ${styles.input}`} />
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className={styles.section}>
            <div className={`${styles.line} ${styles.sectionTitle}`} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.field}>
                <div className={`${styles.line} ${styles.label}`} />
                <div className={`${styles.line} ${styles.input}`} />
              </div>
            ))}
            <div className={styles.grid3}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.field}>
                  <div className={`${styles.line} ${styles.label}`} />
                  <div className={`${styles.line} ${styles.input}`} />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
