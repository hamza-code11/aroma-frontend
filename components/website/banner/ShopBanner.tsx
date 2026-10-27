"use client";

import Image from "next/image";
import { useShopCms } from "@/hooks/useShopCms";
import styles from "./ShopBanner.module.css";

export default function ShopBanner() {
  const { data: cmsData, isLoading } = useShopCms();

  // Fallback content
  const fallback = {
    eyebrow: "Shop",
    title: "Fragrances for every room",
    description: "Explore our collection of premium aroma diffusers, crafted for bedrooms, living spaces, and quiet corners of the home.",
    image: "/banner/02.jfif",
  };

  const eyebrow = cmsData?.eyebrow || fallback.eyebrow;
  // Ab title poora hi CMS se aayega (without splitting)
  const title = cmsData?.title || fallback.title;
  const description = cmsData?.description || fallback.description;
  const imageUrl = cmsData?.banner_image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}`
    : fallback.image;

  if (isLoading) {
    return (
      <section className={styles.banner} style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className={styles.media}>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--border-color)", opacity: 0.3 }} />
          <div className={styles.overlay} />
        </div>
        <div className={styles.inner}>
          <div style={{ width: "80px", height: "16px", backgroundColor: "var(--border-color)", borderRadius: "4px", marginBottom: "16px", opacity: 0.5 }} />
          <div style={{ width: "60%", height: "48px", backgroundColor: "var(--border-color)", borderRadius: "8px", marginBottom: "16px", opacity: 0.5 }} />
          <div style={{ width: "90%", height: "16px", backgroundColor: "var(--border-color)", borderRadius: "4px", marginBottom: "8px", opacity: 0.5 }} />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.banner}>
      <div className={styles.media}>
        <Image
          src={imageUrl}
          alt={title || "i.Shine Aroma diffuser collection"}
          fill
          sizes="100vw"
          priority
          unoptimized
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>{description}</p>
      </div>
    </section>
  );
}
