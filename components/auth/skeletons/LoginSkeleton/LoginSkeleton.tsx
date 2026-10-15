import styles from "./LoginSkeleton.module.css";

export default function LoginSkeleton() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* Side */}
      <div className={styles.side}>
        <div className={`${styles.line} ${styles.sideBrand}`} />

        <div className={styles.sideContent}>
          <div className={`${styles.line} ${styles.sideEyebrow}`} />
          <div className={`${styles.line} ${styles.sideTitle}`} />
          <div className={`${styles.line} ${styles.sideTitleShort}`} />
          <div className={`${styles.line} ${styles.sideText}`} />
          <div className={`${styles.line} ${styles.sideTextShort}`} />
        </div>
      </div>

      {/* Panel */}
      <div className={styles.panel}>
        <div className={styles.card}>
          <div className={`${styles.line} ${styles.eyebrow}`} />
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.subtitle}`} />

          <div className={styles.field}>
            <div className={`${styles.line} ${styles.label}`} />
            <div className={`${styles.line} ${styles.input}`} />
          </div>

          <div className={styles.field}>
            <div className={`${styles.line} ${styles.label}`} />
            <div className={`${styles.line} ${styles.input}`} />
          </div>

          <div className={`${styles.line} ${styles.checkbox}`} />
          <div className={`${styles.line} ${styles.submit}`} />
          <div className={`${styles.line} ${styles.divider}`} />
          <div className={`${styles.line} ${styles.social}`} />
        </div>
      </div>
    </div>
  );
}
