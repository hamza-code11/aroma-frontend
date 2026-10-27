"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

type Props = {
  mainImage: string;        
  images: string[];         
  name: string;
  saleBadge?: string | null;
  outOfStock?: boolean;
};

export default function ImageGallery({
  mainImage,
  images,
  name,
  saleBadge,
  outOfStock,
}: Props) {
  // Saari images ko combine karein (Main image + Gallery images) aur duplicates hatayein
  const allImages = useMemo(() => {
    const combined = [mainImage, ...(images || [])];
    return Array.from(new Set(combined)).filter(Boolean); // Remove empty and duplicates
  }, [mainImage, images]);

  const [selected, setSelected] = useState<string>(allImages[0] || "");
  const hasThumbs = allImages.length > 1;

  // Function to get full image URL
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${path}`;
  };

  const shownImage = selected || allImages[0];

  return (
    <div className={`${styles.gallery} ${hasThumbs ? "" : styles.galleryNoThumbs}`}>
      {/* THUMBNAILS */}
      {hasThumbs && (
        <div className={styles.thumbCol} role="tablist" aria-label="Product images">
          {allImages.map((img, i) => {
            const fullUrl = getImageUrl(img);
            return (
              <button
                key={`${img}-${i}`}
                type="button"
                role="tab"
                aria-selected={selected === img}
                className={`${styles.thumb} ${selected === img ? styles.thumbActive : ""}`}
                onClick={() => setSelected(img)}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={fullUrl}
                  alt={`${name} ${i + 1}`}
                  fill
                  sizes="88px"
                  unoptimized
                  className={styles.thumbImg}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN IMAGE */}
      <div className={styles.mainImageWrap}>
        <Image
          key={shownImage}
          src={getImageUrl(shownImage)}
          alt={name}
          fill
          priority
          sizes="(max-width: 900px) 90vw, 50vw"
          unoptimized
          className={styles.mainImage}
        />

        {saleBadge && <span className={styles.saleBadge}>{saleBadge}</span>}
        {outOfStock && <span className={styles.outBadge}>Out of Stock</span>}
      </div>
    </div>
  );
}
