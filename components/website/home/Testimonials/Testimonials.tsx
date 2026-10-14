"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
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
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-review]", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
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
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Customer reviews"
    >
      <div className={styles.container}>
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

        <div className={styles.grid}>
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
    </section>
  );
}
