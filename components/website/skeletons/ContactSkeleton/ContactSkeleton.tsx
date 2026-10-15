import styles from "./ContactSkeleton.module.css";

export default function ContactSkeleton() {
  return (
    <div className={styles.section} aria-hidden="true">
      <div className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={`${styles.line} ${styles.eyebrow}`} />
          <div className={`${styles.line} ${styles.title}`} />
          <div className={`${styles.line} ${styles.titleShort}`} />
          <div className={`${styles.line} ${styles.lead}`} />
          <div className={`${styles.line} ${styles.leadShort}`} />
        </div>

        {/* Info cards */}
        <div className={styles.infoGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.infoCard}>
              <div className={`${styles.line} ${styles.infoIcon}`} />
              <div className={`${styles.line} ${styles.infoLabel}`} />
              <div className={`${styles.line} ${styles.infoValue}`} />
            </div>
          ))}
        </div>

        {/* Form section */}
        <div className={styles.formSection}>
          <div className={styles.formIntro}>
            <div className={`${styles.line} ${styles.heading}`} />
            <div className={`${styles.line} ${styles.para}`} />
            <div className={`${styles.line} ${styles.paraShort}`} />
          </div>

          <div className={styles.form}>
            <div className={styles.formGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.field} ${
                    i === 3 ? styles.fieldFull : ""
                  }`}
                >
                  <div className={`${styles.line} ${styles.label}`} />
                  <div
                    className={`${styles.line} ${
                      i === 3 ? styles.textarea : styles.input
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className={styles.formFooter}>
              <div className={`${styles.line} ${styles.status}`} />
              <div className={`${styles.line} ${styles.submit}`} />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <div className={`${styles.line} ${styles.eyebrow}`} />
            <div className={`${styles.line} ${styles.heading}`} />
          </div>

          <div className={styles.faqList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${styles.line} ${styles.faqItem}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
