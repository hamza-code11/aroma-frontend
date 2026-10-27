import styles from "./NewArrivalsSkeleton.module.css";

export default function NewArrivalsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={`${styles.line} ${styles.title}`} />
          <div className={styles.controls}>
            <div className={`${styles.line} ${styles.arrow}`} />
            <div className={`${styles.line} ${styles.arrow}`} />
          </div>
        </div>

        <div className={styles.track}>
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className={styles.card}>
              <div className={`${styles.line} ${styles.image}`} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
