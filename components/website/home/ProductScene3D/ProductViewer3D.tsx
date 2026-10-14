"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProductViewer3D.module.css";

gsap.registerPlugin(ScrollTrigger);

const ProductScene3D = dynamic(() => import("./ProductScene3D"), {
  ssr: false,
  loading: () => null,
});

const FEATURES = [
  { label: "Fragrance", value: "Premium essential oil blend" },
  { label: "Scent", value: "Long-lasting aroma" },
  { label: "Volume", value: "50 ml" },
  { label: "Lasts", value: "10+ hours" },
];

export default function ProductViewer3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduceMotion(reduced);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        setActive(entry.isIntersecting);
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(section);

    if (reduced) {
      return () => observer.disconnect();
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-viewer-item]", {
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

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Explore the bottle in 3D"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <p data-viewer-item className={styles.eyebrow}>
            Explore in 3D
          </p>

          <h2 data-viewer-item className={styles.title}>
            Pure Fragrance, <span className="text-gradient-gold"> Crafted to Perfection</span>
          </h2>

          <p data-viewer-item className={styles.description}>
            Turn it, tilt it, look closer. A refined fragrance oil blend in a beautifully crafted bottle, designed to elevate your space with rich aromas and a luxurious touch.
          </p>

          <dl data-viewer-item className={styles.features}>
            {FEATURES.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div data-viewer-item className={styles.actions}>
            <Link href="/shop" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>

        <div data-viewer-item className={styles.stage}>
          <div className={styles.canvasWrap}>
            {mounted && (
              <ProductScene3D active={active} reduceMotion={reduceMotion} />
            )}
          </div>
          <p className={styles.hint} aria-hidden="true">
            Drag to rotate
          </p>
        </div>
      </div>
    </section>
  );
}

