"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProductShowcase.module.css";

gsap.registerPlugin(ScrollTrigger);

type Product = {
    id: string;
    category: string;
    name: string;
    tagline: string;
    description: string;
    image: string;
    notes: { top: string; heart: string; base: string };
    specs: { label: string; value: string }[];
    price: string;
    href: string;
};

// Placeholder data: apne asli products se badal lo
const PRODUCTS: Product[] = [
    {
        id: "oud-royale",
        category: "Eau de Parfum",
        name: "Oud Royale",
        tagline: "Deep, woody and unforgettable",
        description:
            "A rich blend of aged oud and warm spices, crafted for those who want a fragrance that speaks before they do.",
        image: "/products/01.jfif",
        notes: { top: "Saffron", heart: "Rose", base: "Oud, Amber" },
        specs: [
            { label: "Size", value: "50 ml" },
            { label: "Concentration", value: "Eau de Parfum" },
            { label: "Longevity", value: "10+ hours" },
            { label: "Best For", value: "Evening" },
        ],
        price: "$ 4,500",
        href: "/shop",
    },
    {
        id: "amber-noir",
        category: "Eau de Parfum",
        name: "Amber Noir",
        tagline: "Warm, smooth and mysterious",
        description:
            "Golden amber wrapped in soft vanilla and a touch of spice. A comforting scent that lingers long after you leave.",
        image: "/products/02.jfif",
        notes: { top: "Bergamot", heart: "Cinnamon", base: "Amber, Vanilla" },
        specs: [
            { label: "Size", value: "50 ml" },
            { label: "Concentration", value: "Eau de Parfum" },
            { label: "Longevity", value: "8+ hours" },
            { label: "Best For", value: "Winter" },
        ],
        price: "$ 4,200",
        href: "/shop",
    },
    {
        id: "jasmine-bloom",
        category: "Eau de Parfum",
        name: "Jasmine Bloom",
        tagline: "Soft, floral and graceful",
        description:
            "Fresh jasmine petals paired with creamy white musk for an elegant, feminine fragrance that feels effortless.",
        image: "/products/03.jfif",
        notes: { top: "Pear", heart: "Jasmine", base: "White Musk" },
        specs: [
            { label: "Size", value: "50 ml" },
            { label: "Concentration", value: "Eau de Parfum" },
            { label: "Longevity", value: "8+ hours" },
            { label: "Best For", value: "Daytime" },
        ],
        price: "$ 3,900",
        href: "/shop",
    },
    {
        id: "citrus-veil",
        category: "Eau de Toilette",
        name: "Citrus Veil",
        tagline: "Fresh, green and energising",
        description:
            "Sparkling citrus over a calm green tea heart, finished with clean cedar. Made for warm days and bright moods.",
        image: "/products/04.jfif",
        notes: { top: "Lemon, Mandarin", heart: "Green Tea", base: "Cedar" },
        specs: [
            { label: "Size", value: "100 ml" },
            { label: "Concentration", value: "Eau de Toilette" },
            { label: "Longevity", value: "6+ hours" },
            { label: "Best For", value: "Summer" },
        ],
        price: "$ 3,500",
        href: "/shop",
    },
];

const SCROLL_PER_PRODUCT = 1.6;
const DURATION = 1.8;
const HOLD = 0.7;
const STEP = DURATION + HOLD;

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);
    const [isStatic, setIsStatic] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
            setIsStatic(true);
            return;
        }

        const ctx = gsap.context(() => {
            const images = gsap.utils.toArray<HTMLElement>("[data-image]", section);
            const contents = gsap.utils.toArray<HTMLElement>("[data-content]", section);
            const last = PRODUCTS.length - 1;

            const imageState = (i: number, index: number) =>
                i === index
                    ? { autoAlpha: 1, scale: 1, xPercent: 0 }
                    : i < index
                        ? { autoAlpha: 0, scale: 0.92, xPercent: -8 }
                        : { autoAlpha: 0, scale: 1.1, xPercent: 8 };

            const contentState = (i: number, index: number) =>
                i === index
                    ? { autoAlpha: 1, xPercent: 0 }
                    : i < index
                        ? { autoAlpha: 0, xPercent: -40 }
                        : { autoAlpha: 0, xPercent: 40 };

            const render = (index: number, animate: boolean) => {
                images.forEach((el, i) => {
                    const to = imageState(i, index);
                    if (!animate) {
                        gsap.set(el, to);
                        return;
                    }
                    const on = i === index;
                    gsap.to(el, {
                        ...to,
                        duration: on ? 1 : 0.7,
                        delay: on ? 0.35 : 0,
                        ease: on ? "power2.out" : "power2.in",
                        overwrite: true,
                    });
                });

                contents.forEach((el, i) => {
                    const to = contentState(i, index);
                    if (!animate) {
                        gsap.set(el, to);
                        return;
                    }
                    const on = i === index;
                    gsap.to(el, {
                        ...to,
                        duration: on ? 0.9 : 0.6,
                        delay: on ? 0.5 : 0,
                        ease: on ? "power2.out" : "power2.in",
                        overwrite: true,
                    });
                });
            };

            render(0, false);

            let current = 0;

            ScrollTrigger.create({
                trigger: section,
                start: "top top",
                end: () => `+=${window.innerHeight * last}`,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                snap: {
                    snapTo: 1 / last,
                    directional: true,
                    inertia: false,
                    duration: { min: 0.25, max: 0.6 },
                    delay: 0.1,
                    ease: "power2.inOut",
                },
                onUpdate: (self) => {
                    const idx = Math.round(self.progress * last);
                    if (idx === current) return;
                    current = idx;
                    setActive(idx);
                    render(idx, true);
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);


    const total = PRODUCTS.length;
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isStatic ? styles.static : ""}`}
            aria-label="Our signature products"
        >
            <div className={styles.stage}>
                {PRODUCTS.map((p, i) => (
                    <article key={p.id} className={styles.slide}>
                        {/* LEFT: bari product image */}
                        <div className={styles.imagePanel}>
                            <div data-image className={styles.imageWrap}>
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    sizes="(max-width: 900px) 90vw, 50vw"
                                    priority={i === 0}
                                    className={styles.image}
                                />
                            </div>
                        </div>

                        {/* RIGHT: content */}
                        <div className={styles.contentPanel}>
                            <div data-content className={styles.content}>
                                <p className={styles.eyebrow}>
                                    {pad(i + 1)} &mdash; {p.category}
                                </p>

                                <h2 className={styles.name}>{p.name}</h2>
                                <p className={styles.tagline}>{p.tagline}</p>
                                <p className={styles.description}>{p.description}</p>

                                <dl className={styles.notes}>
                                    <div>
                                        <dt>Top</dt>
                                        <dd>{p.notes.top}</dd>
                                    </div>
                                    <div>
                                        <dt>Heart</dt>
                                        <dd>{p.notes.heart}</dd>
                                    </div>
                                    <div>
                                        <dt>Base</dt>
                                        <dd>{p.notes.base}</dd>
                                    </div>
                                </dl>

                                <dl className={styles.specs}>
                                    {p.specs.map((s) => (
                                        <div key={s.label}>
                                            <dt>{s.label}</dt>
                                            <dd>{s.value}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className={styles.buyRow}>
                                    <span className={styles.price}>{p.price}</span>
                                    <Link href={p.href} className="btn btn-primary">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Progress: counter + 4 segments */}
            <div className={styles.progress} aria-hidden="true">
                <span className={styles.counter}>
                    {pad(active + 1)} / {pad(total)}
                </span>
                {/* <div className={styles.bars}>
          {PRODUCTS.map((p, i) => (
            <span
              key={p.id}
              className={`${styles.bar} ${i <= active ? styles.barFilled : ""}`}
            />
          ))}
        </div> */}
            </div>
        </section>
    );
}

