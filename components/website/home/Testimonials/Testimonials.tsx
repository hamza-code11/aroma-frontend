"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowLeft, ArrowRight, PenLine } from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";
import styles from "./Testimonials.module.css";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    id: 1,
    quote:
      "The scent fills my living room within minutes and stays soft all evening. Guests ask about it every single time.",
    name: "Ayesha Khan",
    place: "Karachi",
    product: "Oud Royale",
  },
  {
    id: 2,
    quote:
      "I use the diffuser in my bedroom at night and the amber blend is calming without being heavy. Worth every rupee.",
    name: "Hamza Siddiqui",
    place: "Lahore",
    product: "Amber Noir",
  },
  {
    id: 3,
    quote:
      "Packaging felt premium and the jasmine fragrance is exactly as described. It has become my daily ritual.",
    name: "Sana Malik",
    place: "Islamabad",
    product: "Jasmine Bloom",
  },
  {
    id: 4,
    quote:
      "Citrus Veil is now my morning ritual. Fresh, clean and it wakes up the whole house without being overpowering.",
    name: "Bilal Ahmed",
    place: "Faisalabad",
    product: "Citrus Veil",
  },
  {
    id: 5,
    quote:
      "I gifted Amber Noir to my mother and she has not stopped talking about it. Elegant bottle, richer scent.",
    name: "Mariam Tariq",
    place: "Multan",
    product: "Amber Noir",
  },
  {
    id: 6,
    quote:
      "Every room in my home smells like a boutique hotel now. The longevity is genuinely impressive.",
    name: "Usman Raza",
    place: "Rawalpindi",
    product: "Oud Royale",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  /* ---------- Arrows enable/disable ---------- */
  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
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

  /* ---------- GSAP intro (opacity-only, no layout shift) ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-review]", { opacity: 0 });

      gsap.to("[data-review]", {
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Customer reviews"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Customer Reviews</p>
            <h2 className={styles.title}>
              Loved in <span className="text-gradient-gold">every room</span>
            </h2>
          </div>

          <div className={styles.rating}>
            <span className={styles.score}>4.9</span>
            <div>
              <div className={styles.stars} aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className={styles.count}>From 500+ happy customers</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Write a Review + arrows */}
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.writeBtn}
            onClick={() => setModalOpen(true)}
          >
            <PenLine size={16} strokeWidth={1.5} />
            Write a Review
          </button>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous reviews"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next reviews"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div ref={trackRef} className={styles.track}>
          {REVIEWS.map((r) => (
            <figure key={r.id} data-review className={styles.card}>
              <div className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <blockquote className={styles.quote}>{r.quote}</blockquote>

              <figcaption className={styles.author}>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.meta}>
                  {r.place} &middot; {r.product}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Modal */}
      <WriteReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          // Yahan aap apna API call laga sakte ho
          console.log("Review submitted:", data);
        }}
      />
    </section>
  );
}
