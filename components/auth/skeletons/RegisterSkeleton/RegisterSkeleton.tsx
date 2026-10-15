import styles from "./RegisterSkeleton.module.css";

export default function RegisterSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
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

      <div className={styles.field}>
        <div className={`${styles.line} ${styles.label}`} />
        <div className={`${styles.line} ${styles.input}`} />
        <div className={`${styles.line} ${styles.strength}`} />
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
  );
}
