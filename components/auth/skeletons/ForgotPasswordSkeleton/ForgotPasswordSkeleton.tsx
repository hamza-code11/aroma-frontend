import styles from "./ForgotPasswordSkeleton.module.css";

export default function ForgotPasswordSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.line} ${styles.eyebrow}`} />
      <div className={`${styles.line} ${styles.title}`} />
      <div className={`${styles.line} ${styles.subtitle}`} />
      <div className={`${styles.line} ${styles.subtitleShort}`} />

      <div className={styles.field}>
        <div className={`${styles.line} ${styles.label}`} />
        <div className={`${styles.line} ${styles.input}`} />
      </div>

      <div className={`${styles.line} ${styles.submit}`} />
      <div className={`${styles.line} ${styles.foot}`} />
    </div>
  );
}
