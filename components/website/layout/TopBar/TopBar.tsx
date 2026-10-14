"use client";
import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <p>✨ Free Shipping on Orders Above Rs. 2000 | Use Code: <span>AROMA10</span></p>
    </div>
  );
}
