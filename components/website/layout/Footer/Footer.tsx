"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUp } from "lucide-react";
import styles from "./Footer.module.css";

const SOCIALS = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Contact", href: "/contact" },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!valid) {
            setStatus("error");
            return;
        }
        setStatus("done");
        setEmail("");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <div className={styles.brandRow}>
                            <Link
                                href="/"
                                className={styles.logo}
                                aria-label="i.Shine Aroma - Home"
                            >
                                <Image
                                    src="/logo/01.jpeg"
                                    alt="i.Shine Aroma"
                                    width={160}
                                    height={160}
                                    className={styles.logoImage}
                                />
                            </Link>

                            <h2 className={styles.heading}>i.Shine </h2>
                        </div>

                        <p className={styles.tagline}>i.Shine Aroma &mdash; Fragrance for every room.</p>
                        <p className={styles.about}>
                            i.Shine Aroma creates premium fragrances and diffusers from carefully selected ingredients. Whether it is a quiet morning or a long evening, find the scent that fills your space and stays in the memory.
                        </p>
                    </div>

                    <div className={styles.join}>
                        <p className={styles.eyebrow}>Join the list</p>
                        <p className={styles.text}>
                            New fragrances, rituals and private offers. Twice a season.
                        </p>

                        <form className={styles.form} onSubmit={onSubmit} noValidate>
                            <label htmlFor="footer-email" className={styles.srOnly}>
                                Email address
                            </label>
                            <input
                                id="footer-email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status !== "idle") setStatus("idle");
                                }}
                                placeholder="you@email.com"
                                autoComplete="email"
                                className={styles.input}
                                aria-invalid={status === "error"}
                            />
                            <button
                                type="submit"
                                className={styles.submit}
                                aria-label="Subscribe"
                            >
                                <ArrowRight size={18} strokeWidth={1.5} />
                            </button>
                        </form>

                        <p className={styles.status} role="status" aria-live="polite">
                            {status === "done" && "Thank you, you are on the list."}
                            {status === "error" && "Please enter a valid email address."}
                        </p>

                        <ul className={styles.socials}>
                            {SOCIALS.map((s) => (
                                <li key={s.label}>
                                    <Link
                                        href={s.href}
                                        className={styles.socialLink}
                                        {...(s.href.startsWith("http")
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                    >
                                        {s.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.legal}>
                        &copy; {new Date().getFullYear()} i.Shine Aroma
                    </p>

                    <button
                        type="button"
                        className={styles.toTop}
                        onClick={scrollToTop}
                        aria-label="Back to top"
                    >
                        <ArrowUp size={16} strokeWidth={1.5} />
                    </button>

                    <p className={`${styles.legal} ${styles.legalRight}`}>
                        Fragrance for the air &mdash; Crafted with care
                    </p>
                </div>
            </div>
        </footer>
    );
}
