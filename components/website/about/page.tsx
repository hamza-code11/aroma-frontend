"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import styles from "./About.module.css";

// Hooks Import 
import { useAboutCms } from "@/hooks/useAboutCms";

// Skeleton Import
import AboutSkeleton from "@/components/website/skeletons/AboutSkeleton/AboutSkeleton";

gsap.registerPlugin(ScrollTrigger);

// ✅ Fallback Data (Purane static data ki jagah)
const FALLBACK_CONTENT = {
  hero: {
    eyebrow: "About Us",
    title: "Our Story",
    titleHighlight: "Crafted with care",
    lead: "i.Shine Aroma creates premium fragrances.",
    primaryCta: { label: "", href: "" },
    secondaryCta: { label: "", href: "" },
  },
  stats: [],
  banner: {
    image: "",
    imageAlt: "About Banner",
  },
  story: {
    heading: "",
    body: [],
    image: "",
    imageAlt: "Story Image",
  },
  missionVision: {
    mission: { title: "", text: "" },
    vision: { title: "", text: "" },
  },
  cta: {
    title: "",
    text: "",
    cta: { label: "", href: "" },
  },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch CMS Data
  const { data: cmsData, isLoading } = useAboutCms();

  // Merge API data with fallback
  const content = useMemo(() => {
    if (!cmsData) return FALLBACK_CONTENT;

    return {
      hero: cmsData.hero,
      stats: cmsData.stats,
      banner: {
        image: cmsData.banner_image 
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` 
          : "",
        imageAlt: "About Banner",
      },
      story: {
        heading: cmsData.story.heading,
        body: cmsData.story.body,
        image: cmsData.story.image 
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.story.image}` 
          : "",
        imageAlt: "Story Image",
      },
      missionVision: cmsData.mission_vision,
      cta: cmsData.cta,
    };
  }, [cmsData]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLoading) return;

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
  }, [isLoading]);

  // Show Skeleton while loading
  if (isLoading) {
    return <AboutSkeleton />;
  }

  const { hero, stats, banner, story, missionVision, cta } = content;

  return (
    <main ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* ================= HERO BANNER ================= */}
        <section className={styles.heroBanner}>
          <div className={styles.heroBannerMedia}>
            {banner.image ? (
              <Image
                src={banner.image}
                alt={banner.imageAlt}
                fill
                sizes="100vw"
                priority
                unoptimized
                className={styles.heroBannerImage}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "var(--bg-surface)" }} />
            )}
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
              {stats && stats.length > 0 && stats.map((s: { label: string; value: string }, i: number) => (
                <div key={`${s.label}-${i}`} className={styles.statItem}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STORY ================= */}
        {story && (
          <section data-reveal className={styles.story}>
            <div className={styles.storyText}>
              <h2 className={styles.heading}>{story.heading}</h2>
              {story.body && story.body.map((p: string, i: number) => (
                <p key={i} className={styles.para}>
                  {p}
                </p>
              ))}
            </div>

            <div className={styles.storyImage}>
              {story.image ? (
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(max-width: 900px) 90vw, 45vw"
                  unoptimized
                  className={styles.storyImg}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", backgroundColor: "var(--bg-surface)" }} />
              )}
            </div>
          </section>
        )}

        {/* ================= MISSION / VISION ================= */}
        {missionVision && (
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
        )}

        {/* ================= CTA ================= */}
        {cta && (
          <section data-reveal className={styles.cta}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{cta.title}</h2>
              <p className={styles.ctaText}>{cta.text}</p>
            </div>
            {cta.cta && cta.cta.href && (
              <Link href={cta.cta.href} className={styles.primaryBtn}>
                {cta.cta.label}
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
