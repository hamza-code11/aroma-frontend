import styles from "./LoginSkeleton.module.css";

export default function LoginSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      {/* Header */}
      <header className={styles.cardHeader}>
        <div className={`${styles.line} ${styles.eyebrow}`} />
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.subtitle}`} />
      </header>

      {/* Form Fields */}
      <div className={styles.form}>
        {/* Email Field */}
        <div className={styles.field}>
          <div className={`${styles.line} ${styles.label}`} />
          <div className={`${styles.line} ${styles.input}`} />
        </div>

        {/* Password Field */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <div className={`${styles.line} ${styles.label}`} />
            <div className={`${styles.line} ${styles.forgot}`} />
          </div>
          <div className={`${styles.line} ${styles.input}`} />
        </div>

        {/* Checkbox */}
        <div className={styles.checkbox}>
          <div className={`${styles.line} ${styles.checkboxBox}`} />
          <div className={`${styles.line} ${styles.checkboxText}`} />
        </div>

        {/* Status space */}
        <div className={styles.status}></div>

        {/* Submit Button */}
        <div className={`${styles.line} ${styles.submit}`} />

        {/* Divider */}
        <div className={styles.divider}>
          <div className={`${styles.line} ${styles.dividerLine}`} />
          <div className={`${styles.line} ${styles.dividerText}`} />
          <div className={`${styles.line} ${styles.dividerLine}`} />
        </div>

        {/* Google Button */}
        <div className={`${styles.line} ${styles.socialBtn}`} />
      </div>

      {/* Footer */}
      <div className={styles.foot}>
        <div className={`${styles.line} ${styles.footText}`} />
      </div>
    </div>
  );
}
