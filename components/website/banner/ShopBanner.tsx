import Image from "next/image";
import styles from "./ShopBanner.module.css";

export default function ShopBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.media}>
        <Image
          src="/banner/02.jfif"
          alt="i.Shine Aroma diffuser collection"
          fill
          sizes="100vw"
          priority
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <p className={styles.eyebrow}>Shop</p>

        <h1 className={styles.title}>
          Fragrances for{" "}
          <span className={styles.titleHighlight}>every room</span>
        </h1>

        <p className={styles.lead}>
          Explore our collection of premium aroma diffusers, crafted for
          bedrooms, living spaces, and quiet corners of the home.
        </p>
      </div>
    </section>
  );
}
