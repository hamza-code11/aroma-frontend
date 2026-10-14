"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./VideoBanner.module.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    eyebrow: "Signature Collection",
    title: "Pure Essence",
    accent: "Crafted To Linger",
    description:
      "Each fragrance is blended from carefully selected ingredients to leave a lasting impression, from the first spray to the very last note.",
  },
  {
    eyebrow: "The Craft",
    title: "Rare Ingredients",
    accent: "Patiently Aged",
    description:
      "Oud, amber and saffron are sourced with care and matured slowly, so every note arrives rich, balanced and unmistakably yours.",
  },
  {
    eyebrow: "The Experience",
    title: "Made To Be",
    accent: "Remembered",
    description:
      "From a quiet morning to a long evening, find the scent that moves with you and stays long after you have left the room.",
  },
];

const IMAGE_SRC = "/videos/banner-poster.png";
const FULL_CLIP = "inset(0% 0% 0% 0% round 0px)";
const DESKTOP_CLIP = "inset(14% 32% 14% 32% round 20px)";
const MOBILE_CLIP = "inset(22% 10% 22% 10% round 16px)";

export default function VideoBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsStatic(true);
      return;
    }

    const media = section.querySelector<HTMLElement>("[data-media]");
    const picture = section.querySelector<HTMLElement>("[data-picture]");
    const overlay = section.querySelector<HTMLElement>("[data-overlay]");
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
    const bar = section.querySelector<HTMLElement>("[data-bar]");
    if (!media || !picture || !overlay || !bar) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 901px)",
        mobile: "(max-width: 900px)",
      },
      (context) => {
        const startClip = context.conditions?.desktop
          ? DESKTOP_CLIP
          : MOBILE_CLIP;
        const last = steps.length - 1;

        gsap.set(media, { clipPath: startClip });
        gsap.set(picture, { scale: 1.25 });
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(steps, { autoAlpha: 0, y: 48 });
        gsap.set(bar, { scaleX: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 6}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          media,
          { clipPath: startClip },
          { clipPath: FULL_CLIP, duration: 2, ease: "power2.inOut" },
          0.4
        );
        tl.fromTo(
          picture,
          { scale: 1.25 },
          { scale: 1, duration: 2, ease: "power2.inOut", immediateRender: false },
          0.4
        );
        tl.fromTo(
          overlay,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, immediateRender: false },
          1.6
        );

        const stepStart = 2.8;
        const stepLength = 2.4;

        steps.forEach((step, i) => {
          const at = stepStart + i * stepLength;

          tl.fromTo(
            step,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              immediateRender: false,
            },
            at
          );

          if (i < last) {
            tl.fromTo(
              step,
              { autoAlpha: 1, y: 0 },
              {
                autoAlpha: 0,
                y: -48,
                duration: 0.5,
                ease: "power2.in",
                immediateRender: false,
              },
              at + 1.7
            );
          }
        });

        const total = stepStart + last * stepLength + 0.6 + 1.2;

        tl.fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: total, immediateRender: false },
          0
        );

        tl.to({}, { duration: 0.01 }, total);
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isStatic ? styles.static : ""}`}
      aria-label="Signature collection"
    >
      <div data-media className={styles.media}>
        <div data-picture className={styles.picture}>
          <Image
            src={IMAGE_SRC}
            alt="/videos/banner-poster.png"
            fill
            sizes="100vw"
            className={styles.image}
          />
        </div>
        <div data-overlay className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.steps}>
        {STEPS.map((s, i) => (
          <div key={s.title} data-step className={styles.step}>
            <p className={styles.eyebrow}>{s.eyebrow}</p>
            <h2 className={styles.title}>
              {s.title}{" "}
              <span className="text-gradient-gold">{s.accent}</span>
            </h2>
            <p className={styles.description}>{s.description}</p>
            {i === STEPS.length - 1 && (
              <Link href="/shop" className="btn btn-primary">
                Shop Now
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className={styles.progress} aria-hidden="true">
        <div data-bar className={styles.bar} />
      </div>
    </section>
  );
}
