"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

type Props = {
  images: string[];
  name: string;
  saleBadge?: string | null;
  outOfStock?: boolean;
};

export default function ImageGallery({
  images,
  name,
  saleBadge,
  outOfStock,
}: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const safeImages = images.length > 0 ? images : ["/placeholder.png"];

  return (
    <div className={styles.gallery}>
      {/* LEFT — vertical thumbnails */}
      {safeImages.length > 1 && (
        <div className={styles.thumbCol} role="tablist" aria-label="Product images">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeImage}
              className={`${styles.thumb} ${
                i === activeImage ? styles.thumbActive : ""
              }`}
              onClick={() => setActiveImage(i)}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="88px"
                unoptimized
                className={styles.thumbImg}
              />
            </button>
          ))}
        </div>
      )}

      {/* RIGHT — main image */}
      <div className={styles.mainImageWrap}>
        <Image
          src={safeImages[activeImage]}
          alt={name}
          fill
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
