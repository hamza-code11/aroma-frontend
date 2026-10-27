import styles from "./ContactSkeleton.module.css";

export default function ContactSkeleton() {
  return (
    <main className={styles.section} aria-hidden="true">
      <div className={styles.container}>
        
        {/* ================= HERO BANNER SKELETON ================= */}
        <section className={styles.heroBanner}>
          <div className={styles.heroBannerMedia}>
            <div className={`${styles.line} ${styles.bannerImage}`} />
            <div className={styles.heroBannerOverlay} />
          </div>

          <div className={styles.heroInner}>
            <div className={`${styles.line} ${styles.eyebrow}`} />
            <div className={`${styles.line} ${styles.title}`} />
            <div className={`${styles.line} ${styles.titleShort}`} />
            <div className={`${styles.line} ${styles.lead}`} />
            <div className={`${styles.line} ${styles.leadShort}`} />

            <div className={styles.infoGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.infoItem}>
                  <div className={`${styles.line} ${styles.infoLabel}`} />
                  <div className={`${styles.line} ${styles.infoValue}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FORM SECTION SKELETON ================= */}
        <section className={styles.formSection}>
          <div className={styles.formIntro}>
            <div className={`${styles.line} ${styles.heading}`} />
            <div className={`${styles.line} ${styles.para}`} />
            <div className={`${styles.line} ${styles.paraShort}`} />
            <div className={styles.highlights}>
              <div className={`${styles.line} ${styles.highlight}`} />
              <div className={`${styles.line} ${styles.highlight}`} />
              <div className={`${styles.line} ${styles.highlight}`} />
            </div>
          </div>

          <div className={styles.form}>
            <div className={styles.formGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.field} ${i >= 2 ? styles.fieldFull : ""}`}
                >
                  <div className={`${styles.line} ${styles.label}`} />
                  <div className={`${styles.line} ${i === 3 ? styles.textarea : styles.input}`} />
                </div>
              ))}
            </div>
            <div className={styles.formFooter}>
              <div className={`${styles.line} ${styles.status}`} />
              <div className={`${styles.line} ${styles.submit}`} />
            </div>
          </div>
        </section>

        {/* ================= FAQ SKELETON ================= */}
        <section className={styles.faqSection}>
          <header className={styles.faqHeader}>
            <div className={`${styles.line} ${styles.eyebrow}`} />
            <div className={`${styles.line} ${styles.heading}`} />
          </header>

          <div className={styles.faqList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${styles.line} ${styles.faqItem}`} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
