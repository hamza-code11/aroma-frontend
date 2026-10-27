"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUp, Loader2 } from "lucide-react";
import styles from "./Footer.module.css";

// Hook Import
import { useSubscribeNewsletter } from "@/hooks/useNewsletter";
import { useToast } from "@/components/ui/Toast";

const SOCIALS = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Contact", href: "/contact" },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { showToast } = useToast();

    // Hook
    const subscribeMutation = useSubscribeNewsletter();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!valid) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        // API Call
        subscribeMutation.mutate(
            { email: email.trim() },
            {
                onSuccess: () => {
                    showToast("Successfully subscribed to the newsletter!", "success");
                    setEmail("");
                },
                onError: (err: any) => {
                    // Handle validation errors (422) or general errors
                    if (err.response?.status === 422 && err.response?.data?.errors?.email) {
                        setErrorMsg(err.response.data.errors.email[0]);
                    } else {
                        const msg = err.response?.data?.message || "Something went wrong. Try again.";
                        setErrorMsg(msg);
                    }
                }
            }
        );
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
                                    if (errorMsg) setErrorMsg(""); // Clear error on type
                                }}
                                placeholder="you@email.com"
                                autoComplete="email"
                                className={styles.input}
                                aria-invalid={!!errorMsg}
                                disabled={subscribeMutation.isPending}
                            />
                            <button
                                type="submit"
                                className={styles.submit}
                                aria-label="Subscribe"
                                disabled={subscribeMutation.isPending}
                            >
                                {subscribeMutation.isPending ? (
                                    <Loader2 size={18} strokeWidth={1.5} className="animate-spin" />
                                ) : (
                                    <ArrowRight size={18} strokeWidth={1.5} />
                                )}
                            </button>
                        </form>

                        {/* Error Message */}
                        {errorMsg && (
                            <p className={`${styles.status}`} style={{ color: "#ef4444" }} role="alert">
                                {errorMsg}
                            </p>
                        )}

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
