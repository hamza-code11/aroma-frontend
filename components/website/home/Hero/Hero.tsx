// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import styles from "./Hero.module.css";

// gsap.registerPlugin(ScrollTrigger);

// // Scroll lambai (viewport heights mein)
// const VIDEO_SCROLL = 3;   // itni scroll mein poori video chalti hai
// const EXIT_SCROLL = 0.7;  // video end hone ke BAAD text upar jane ki scroll

// export default function Hero() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const video = videoRef.current;
//     if (!section || !video) return;

//     const reduceMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     video.muted = true;
//     video.defaultMuted = true;
//     video.pause();

//     // 1) Intro animation
//     const introCtx = gsap.context(() => {
//       if (reduceMotion) {
//         gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
//         return;
//       }
//       gsap.from("[data-hero-item]", {
//         y: 40,
//         opacity: 0,
//         duration: 1.1,
//         ease: "power3.out",
//         stagger: 0.15,
//         delay: 0.2,
//       });
//     }, section);

//     // 2) Scroll-controlled video
//     let scrubCtx: gsap.Context | null = null;
//     let tickerFn: ((time: number, dt: number) => void) | null = null;

//     const setupScrub = () => {
//       if (scrubCtx || reduceMotion) return;

//       const duration = video.duration;
//       if (!Number.isFinite(duration) || duration <= 0) return;

//       let target = 0;   // scroll se aane wala time
//       let current = 0;  // video ka smooth time

//       scrubCtx = gsap.context(() => {
//         const proxy = { t: 0 };

//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top",
//             end: () =>
//               `+=${window.innerHeight * (VIDEO_SCROLL + EXIT_SCROLL)}`,
//             scrub: true,            // smoothing neeche rAF loop karta hai
//             pin: true,
//             anticipatePin: 1,
//             invalidateOnRefresh: true,
//             refreshPriority: 1,
//           },
//         });

//         // Hissa 1: scroll -> video time (text yahan bilkul fix rehta hai)
//         tl.to(
//           proxy,
//           {
//             t: duration,
//             duration: VIDEO_SCROLL,
//             ease: "none",
//             onUpdate: () => {
//               target = proxy.t;
//             },
//           },
//           0
//         );

//         // Hissa 2: video khatam hone ke BAAD text upar jaye aur fade ho
//         tl.to(
//           contentRef.current,
//           {
//             y: -120,
//             opacity: 0,
//             duration: EXIT_SCROLL,
//             ease: "none",
//           },
//           VIDEO_SCROLL
//         );
//       }, section);

//       // Smooth follow: current -> target, aur seek tabhi jab pichla seek khatam
//       tickerFn = (_time, dt) => {
//         const k = 1 - Math.exp(-(dt / 1000) * 12);
//         current += (target - current) * k;

//         if (Math.abs(target - current) < 0.001) current = target;

//         if (!video.seeking && Math.abs(video.currentTime - current) > 0.01) {
//           video.currentTime = current;
//         }
//       };
//       gsap.ticker.add(tickerFn);

//       ScrollTrigger.refresh();

//       // iOS Safari: frames load karne ke liye ek baar play/pause
//       video
//         .play()
//         .then(() => {
//           video.pause();
//           video.currentTime = current;
//         })
//         .catch(() => {});
//     };

//     if (video.readyState >= 1) {
//       setupScrub();
//     } else {
//       video.addEventListener("loadedmetadata", setupScrub, { once: true });
//     }

//     return () => {
//       video.removeEventListener("loadedmetadata", setupScrub);
//       if (tickerFn) gsap.ticker.remove(tickerFn);
//       introCtx.revert();
//       scrubCtx?.revert();
//     };
//   }, []);

//   return (
//     <section ref={sectionRef} className={styles.heroSection}>
//       <div className={styles.videoWrap}>
//         <video
//           ref={videoRef}
//           className={styles.video}
//           muted
//           playsInline
//           preload="auto"
//           poster="/videos/hero-poster.png"
//           aria-hidden="true"
//         >
//           <source src="/videos/hero.mp4" type="video/mp4" />
//         </video>
//       </div>

//       <div className={styles.overlay} aria-hidden="true" />

//       <div className={styles.container}>
//         <div ref={contentRef} className={styles.content}>
//           <p data-hero-item className={styles.subtitle}>
//             Luxury Aroma Collection
//           </p>

//           <h1 data-hero-item className={styles.title}>
//             Fragrances That <span className="text-gradient-gold">Stay</span>
//           </h1>

//           <p data-hero-item className={styles.description}>
//             Experience the pure essence of nature with our premium aroma
//             diffusers. Handcrafted to bring freshness and serenity to your
//             space.
//           </p>

//           <div data-hero-item className={styles.actions}>
//             <a href="#collection" className="btn btn-primary">
//               Explore Collection
//             </a>
//             <a href="#how-it-works" className="btn btn-secondary">
//               How It Works
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


























// "use client";

// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import styles from "./Hero.module.css";

// gsap.registerPlugin(ScrollTrigger);

// // Scroll lambai (viewport heights mein)
// const VIDEO_SCROLL = 1.2;   // itni scroll mein poori video chalti hai
// const EXIT_SCROLL = 0.4;  // video end hone ke BAAD text upar jane ki scroll

// export default function Hero() {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const sectionRef = useRef<HTMLElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   // useLayoutEffect: cleanup DOM remove hone se PEHLE chalta hai
//   useLayoutEffect(() => {
//     const section = sectionRef.current;
//     const video = videoRef.current;
//     if (!section || !video) return;

//     const reduceMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     video.muted = true;
//     video.defaultMuted = true;
//     video.pause();

//     // 1) Intro animation
//     const introCtx = gsap.context(() => {
//       if (reduceMotion) {
//         gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
//         return;
//       }
//       gsap.from("[data-hero-item]", {
//         y: 40,
//         opacity: 0,
//         duration: 1.1,
//         ease: "power3.out",
//         stagger: 0.15,
//         delay: 0.2,
//       });
//     }, section);

//     // 2) Scroll-controlled video
//     let scrubCtx: gsap.Context | null = null;
//     let tickerFn: ((time: number, dt: number) => void) | null = null;

//     const setupScrub = () => {
//       if (scrubCtx || reduceMotion) return;

//       const duration = video.duration;
//       if (!Number.isFinite(duration) || duration <= 0) return;

//       let target = 0;   // scroll se aane wala time
//       let current = 0;  // video ka smooth time

//       scrubCtx = gsap.context(() => {
//         const proxy = { t: 0 };

//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top",
//             end: () =>
//               `+=${window.innerHeight * (VIDEO_SCROLL + EXIT_SCROLL)}`,
//             scrub: true,
//             pin: true,
//             anticipatePin: 1,
//             invalidateOnRefresh: true,
//             refreshPriority: 1,
//           },
//         });

//         // Hissa 1: scroll -> video time
//         tl.to(
//           proxy,
//           {
//             t: duration,
//             duration: VIDEO_SCROLL,
//             ease: "none",
//             onUpdate: () => {
//               target = proxy.t;
//             },
//           },
//           0
//         );

//         // Hissa 2: video khatam hone ke BAAD text upar jaye aur fade ho
//         tl.to(
//           contentRef.current,
//           {
//             y: -120,
//             opacity: 0,
//             duration: EXIT_SCROLL,
//             ease: "none",
//           },
//           VIDEO_SCROLL
//         );
//       }, wrapperRef); // scope wrapper rakha, taake pin-spacer bhi context me aaye

//       // Smooth follow: current -> target
//       tickerFn = (_time, dt) => {
//         const k = 1 - Math.exp(-(dt / 1000) * 18);
//         current += (target - current) * k;

//         if (Math.abs(target - current) < 0.001) current = target;

//         if (!video.seeking && Math.abs(video.currentTime - current) > 0.01) {
//           video.currentTime = current;
//         }
//       };
//       gsap.ticker.add(tickerFn);

//       ScrollTrigger.refresh();

//       // iOS Safari: frames load karne ke liye ek baar play/pause
//       video
//         .play()
//         .then(() => {
//           video.pause();
//           video.currentTime = current;
//         })
//         .catch(() => {});
//     };

//     if (video.readyState >= 1) {
//       setupScrub();
//     } else {
//       video.addEventListener("loadedmetadata", setupScrub, { once: true });
//     }

//     return () => {
//       video.removeEventListener("loadedmetadata", setupScrub);
//       if (tickerFn) gsap.ticker.remove(tickerFn);
//       scrubCtx?.revert(); // pehle unpin (pin-spacer hatao)
//       introCtx.revert();
//     };
//   }, []);

//   return (
//     // Wrapper: pin-spacer iske andar banega, React ka parent stable rahega
//     <div ref={wrapperRef}>
//       <section ref={sectionRef} className={styles.heroSection}>
//         <div className={styles.videoWrap}>
//           <video
//             ref={videoRef}
//             className={styles.video}
//             muted
//             playsInline
//             preload="auto"
//             poster="/videos/hero-poster.png"
//             aria-hidden="true"
//           >
//             <source src="/videos/hero2.mp4" type="video/mp4" /> 
//             {/* 8 second video */}
//           </video>
//         </div>

//         <div className={styles.overlay} aria-hidden="true" />

//         <div className={styles.container}>
//           <div ref={contentRef} className={styles.content}>
//             <p data-hero-item className={styles.subtitle}>
//               Luxury Aroma Collection
//             </p>

//             <h1 data-hero-item className={styles.title}>
//               Fragrances That <span className="text-gradient-gold">Stay</span>
//             </h1>

//             <p data-hero-item className={styles.description}>
//               Experience the pure essence of nature with our premium aroma
//               diffusers. Handcrafted to bring freshness and serenity to your
//               space.
//             </p>

//             <div data-hero-item className={styles.actions}>
//               <a href="#collection" className="btn btn-primary">
//                 Explore Collection
//               </a>
//               <a href="#how-it-works" className="btn btn-secondary">
//                 How It Works
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
 











"use client";

import { useLayoutEffect, useRef, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroCms } from "@/hooks/useHeroCms";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SCROLL = 1.2;
const EXIT_SCROLL = 0.4;

// Fallback (jo foran render hoga, API data aane tak)
const FALLBACK = {
  label: "Luxury Aroma Collection",
  title: "Fragrances That Stay",
  description: "Experience the pure essence of nature with our premium aroma diffusers. Handcrafted to bring freshness and serenity to your space.",
  primary_btn_label: "Explore Collection",
  primary_btn_link: "#collection",
  secondary_btn_label: "How It Works",
  secondary_btn_link: "#how-it-works",
};

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Data fetch karein
  const { data: cmsData } = useHeroCms();

  // API data agar mojood hai toh use karein, warna fallback foran render ho
  const content = cmsData || FALLBACK;

  // useLayoutEffect: animation ke liye
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    video.muted = true;
    video.defaultMuted = true;
    video.pause();

    // 1) Intro animation (Ye foran chalegi kyunki content DOM mein mojood hai)
    const introCtx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
        return;
      }
      gsap.from("[data-hero-item]", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.2,
      });
    }, section);

    // 2) Scroll-controlled video
    let scrubCtx: gsap.Context | null = null;
    let tickerFn: ((time: number, dt: number) => void) | null = null;

    const setupScrub = () => {
      if (scrubCtx || reduceMotion) return;

      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      let target = 0;
      let current = 0;

      scrubCtx = gsap.context(() => {
        const proxy = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (VIDEO_SCROLL + EXIT_SCROLL)}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        tl.to(
          proxy,
          {
            t: duration,
            duration: VIDEO_SCROLL,
            ease: "none",
            onUpdate: () => {
              target = proxy.t;
            },
          },
          0
        );

        tl.to(
          contentRef.current,
          {
            y: -120,
            opacity: 0,
            duration: EXIT_SCROLL,
            ease: "none",
          },
          VIDEO_SCROLL
        );
      }, wrapperRef);

      tickerFn = (_time, dt) => {
        const k = 1 - Math.exp(-(dt / 1000) * 18);
        current += (target - current) * k;

        if (Math.abs(target - current) < 0.001) current = target;

        if (!video.seeking && Math.abs(video.currentTime - current) > 0.01) {
          video.currentTime = current;
        }
      };
      gsap.ticker.add(tickerFn);

      ScrollTrigger.refresh();

      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = current;
        })
        .catch(() => {});
    };

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", setupScrub);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      scrubCtx?.revert();
      introCtx.revert();
    };
  }, []); // <--- Dependency empty hai, kyunki ab DOM foran render hota hai

  // Yahan humne `isLoading` ka return hata diya, taake fallback content foran render ho

  return (
    <div ref={wrapperRef}>
      <section ref={sectionRef} className={styles.heroSection}>
        <div className={styles.videoWrap}>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            preload="auto"
            poster="/videos/hero-poster.png"
            aria-hidden="true"
          >
            <source src="/videos/hero2.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.container}>
          <div ref={contentRef} className={styles.content}>
            {content.label && (
              <p data-hero-item className={styles.subtitle}>
                {content.label}
              </p>
            )}

            <h1 data-hero-item className={styles.title}>
              {content.title}
            </h1>

            {content.description && (
              <p data-hero-item className={styles.description}>
                {content.description}
              </p>
            )}

            <div data-hero-item className={styles.actions}>
              {content.primary_btn_label && content.primary_btn_link && (
                <Link href={content.primary_btn_link} className="btn btn-primary">
                  {content.primary_btn_label}
                </Link>
              )}
              {content.secondary_btn_label && content.secondary_btn_link && (
                <Link href={content.secondary_btn_link} className="btn btn-secondary">
                  {content.secondary_btn_label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
