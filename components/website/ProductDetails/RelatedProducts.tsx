"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "../../../globalComponents/product/ProductCard";
import type { Product } from "@/types/product";
import styles from "./RelatedProducts.module.css";

type Props = {
  products: Product[];
};

export default function RelatedProducts({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /* ---------- Arrows enable/disable ---------- */
  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateButtons();
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      track.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, products]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-related-card]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className={styles.related}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>You may also like</p>
          <h2 className={styles.title}>Related products</h2>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous products"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next products"
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div ref={trackRef} className={styles.track}>
        {products.map((p) => (
          <div key={p.id} data-related-card className={styles.cardWrap}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}