"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

type Props = {
  mainImage: string;        // products.main_image
  images: string[];         // products.images (sirf thumbnails ke liye)
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
  // null = default main_image dikhao, warna clicked thumbnail
  const [selected, setSelected] = useState<string | null>(null);

  const thumbs = images ?? [];
  const hasThumbs = thumbs.length > 0;
  const shownImage = selected ?? mainImage ?? "/placeholder.png";

  return (
    <div
      className={`${styles.gallery} ${hasThumbs ? "" : styles.galleryNoThumbs}`}
    >
      {/* LEFT: thumbnails (images column) */}
      {hasThumbs && (
        <div
          className={styles.thumbCol}
          role="tablist"
          aria-label="Product images"
        >
          {thumbs.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={shownImage === img}
              className={`${styles.thumb} ${
                shownImage === img ? styles.thumbActive : ""
              }`}
              onClick={() => setSelected(img)}
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

      {/* RIGHT: main image (main_image column) */}
      <div className={styles.mainImageWrap}>
        <Image
          key={shownImage}
          src={shownImage}
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
