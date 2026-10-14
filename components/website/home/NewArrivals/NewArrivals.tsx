"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./NewArrivals.module.css";

gsap.registerPlugin(ScrollTrigger);

const ROOMS = [
  { id: "living-room", name: "Price: $2600", note: "Morning, forty square metres", image: "/products/02.webp" },
  { id: "bedroom", name: "Price: $2600", note: "Night mode, the last hour", image: "/products/02.webp" },
  { id: "spa", name: "Price: $2600", note: "Steam and cedar, low light", image: "/products/02.webp" },
  { id: "study", name: "Price: $2600", note: "Afternoon, focused calm", image: "/products/02.webp" },
  { id: "lounge", name: "Price: $2600", note: "Evening, soft amber glow", image: "/products/02.webp" },
  { id: "entryway", name: "Price: $2600", note: "First impression, all day", image: "/products/02.webp" },
];

export default function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-room]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

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
  }, [updateButtons]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-room]", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="The room after">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>The room after</h2>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous rooms"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next rooms"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={trackRef} className={styles.track}>
          {ROOMS.map((room, i) => (
            <article key={room.id} data-room className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 600px) 85vw, (max-width: 900px) 50vw, 33vw"
                  className={styles.image}
                  priority={i < 3}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{room.note}</h3>
                <p className={styles.note}>{room.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
