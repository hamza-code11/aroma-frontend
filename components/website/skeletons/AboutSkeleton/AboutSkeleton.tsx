import styles from "./AboutSkeleton.module.css";

export default function AboutSkeleton() {
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
          <div className={styles.heroActions}>
            <div className={styles.btn} />
            <div className={styles.btn} />
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.stat}>
              <div className={`${styles.line} ${styles.statValue}`} />
              <div className={`${styles.line} ${styles.statLabel}`} />
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className={`${styles.block} ${styles.banner}`} />

        {/* Story */}
        <div className={styles.story}>
          <div className={styles.storyText}>
            <div className={`${styles.line} ${styles.heading}`} />
            <div className={`${styles.line} ${styles.para}`} />
            <div className={`${styles.line} ${styles.para}`} />
            <div className={`${styles.line} ${styles.paraShort}`} />
          </div>
          <div className={`${styles.block} ${styles.storyImage}`} />
        </div>

        {/* Mission / Vision */}
        <div className={styles.mv}>
          <div className={`${styles.block} ${styles.mvCard}`} />
          <div className={`${styles.block} ${styles.mvCard}`} />
        </div>

      </div>
    </div>
  );
}
