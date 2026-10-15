"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { aboutContent } from "@/data/about";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const {
    hero,
    stats,
    banner,
    story,
    missionVision,
    cta,
  } = aboutContent;

  return (
    <main ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* ================= HERO BANNER (image + eyebrow + title + description + stats) ================= */}
        <section className={styles.heroBanner}>
          <div className={styles.heroBannerMedia}>
            <Image
              src={banner.image}
              alt={banner.imageAlt}
              fill
              sizes="100vw"
              priority
              className={styles.heroBannerImage}
            />
            <div className={styles.heroBannerOverlay} />
          </div>

          <div data-reveal className={styles.heroInner}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>

            <h1 className={styles.title}>
              {hero.title}{" "}
              <span className={styles.titleHighlight}>
                {hero.titleHighlight}
              </span>
            </h1>

            <p className={styles.heroDescription}>{hero.lead}</p>

            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STORY ================= */}
        <section data-reveal className={styles.story}>
          <div className={styles.storyText}>
            <h2 className={styles.heading}>{story.heading}</h2>
            {story.body.map((p, i) => (
              <p key={i} className={styles.para}>
                {p}
              </p>
            ))}
          </div>

          <div className={styles.storyImage}>
            <Image
              src={story.image}
              alt={story.imageAlt}
              fill
              sizes="(max-width: 900px) 90vw, 45vw"
              className={styles.storyImg}
            />
          </div>
        </section>

        {/* ================= MISSION / VISION ================= */}
        <section data-reveal className={styles.missionVision}>
          <div className={styles.mvCard}>
            <p className={styles.mvEyebrow}>What drives us</p>
            <h3 className={styles.mvTitle}>{missionVision.mission.title}</h3>
            <p className={styles.mvText}>{missionVision.mission.text}</p>
          </div>

          <div className={styles.mvCard}>
            <p className={styles.mvEyebrow}>Where we are going</p>
            <h3 className={styles.mvTitle}>{missionVision.vision.title}</h3>
            <p className={styles.mvText}>{missionVision.vision.text}</p>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section data-reveal className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{cta.title}</h2>
            <p className={styles.ctaText}>{cta.text}</p>
          </div>
          <Link href={cta.cta.href} className={styles.primaryBtn}>
            {cta.cta.label}
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </section>
      </div>
    </main>
  );
}
