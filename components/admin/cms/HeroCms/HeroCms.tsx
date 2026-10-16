import { Sparkles } from "lucide-react";
import styles from "../DummyPanel.module.css";

export default function HeroCms() {
  return (
    <div className={styles.panel}>
      <header className={styles.panelHeader}>
        <span className={styles.panelIcon}>
          <Sparkles size={20} strokeWidth={1.7} />
        </span>
        <div>
          <h3 className={styles.panelTitle}>Hero Section</h3>
          <p className={styles.panelSubtitle}>
            Homepage hero banner — eyebrow, title, lead, and CTAs.
          </p>
        </div>
      </header>

      <div className={styles.placeholder}>
        <p className={styles.placeholderTitle}>
          Hero editor coming soon
        </p>
        <p className={styles.placeholderText}>
          Ye section aapka hero content edit karne ke liye hoga. Abhi
          placeholder hai.
        </p>
      </div>
    </div>
  );
}
