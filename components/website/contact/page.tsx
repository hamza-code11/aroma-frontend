"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { contactContent } from "@/data/contact";
import type { ContactInfoItem } from "@/types/contact";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const INFO_ICONS = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
  clock: Clock,
} as const;

function InfoIcon({ icon }: { icon: ContactInfoItem["icon"] }) {
  const Icon = INFO_ICONS[icon] ?? Mail;
  return <Icon size={18} strokeWidth={1.5} />;
}

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [openFaq, setOpenFaq] = useState<string | null>(
    contactContent.faq.items[0]?.id ?? null
  );

  const { hero, banner, info, form: formCfg, faq } = contactContent;

  /* ---------- GSAP reveal ---------- */
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

  /* ---------- Form submit ---------- */
  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const messageOk = form.message.trim().length >= 5;

    if (!nameOk || !emailOk || !messageOk) {
      setStatus("error");
      return;
    }

    // TODO: yahan apna API call laga do
    console.log("Contact form submitted:", form);

    setStatus("done");
    setForm(INITIAL_FORM);
  };

  return (
    <main ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* ================= HERO BANNER (About style) ================= */}
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

    <p className={styles.lead}>{hero.lead}</p>

    {/* Info list — About ke stats jaisa style */}
    <div className={styles.infoGrid}>
      {info.map((item) => {
        const content = (
          <>
            <span className={styles.infoLabel}>
              <span className={styles.infoIcon}>
                <InfoIcon icon={item.icon} />
              </span>
              {item.label}
            </span>
            <span className={styles.infoValue}>{item.value}</span>
          </>
        );

        return item.href ? (
          <a key={item.id} href={item.href} className={styles.infoItem}>
            {content}
          </a>
        ) : (
          <div key={item.id} className={styles.infoItem}>
            {content}
          </div>
        );
      })}
    </div>
  </div>
</section>

        {/* ================= FORM + SIDE TEXT ================= */}
        <section data-reveal className={styles.formSection}>
          <div className={styles.formIntro}>
            <h2 className={styles.heading}>{formCfg.title}</h2>
            <p className={styles.para}>{formCfg.text}</p>

            <ul className={styles.formHighlights}>
              <li>Replies within one business day</li>
              <li>Custom blends & bulk orders welcome</li>
              <li>Your details stay private — always</li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              {formCfg.fields.map((f) => {
                const isTextarea = f.type === "textarea";
                const isFullWidth =
                  f.type === "textarea" || f.id === "subject";
                const value = form[f.id];

                return (
                  <div
                    key={f.id}
                    className={`${styles.field} ${
                      isFullWidth ? styles.fieldFull : ""
                    }`}
                  >
                    <label htmlFor={`contact-${f.id}`} className={styles.label}>
                      {f.label}
                      {f.required && <span aria-hidden="true"> *</span>}
                    </label>

                    {isTextarea ? (
                      <textarea
                        id={`contact-${f.id}`}
                        className={styles.textarea}
                        placeholder={f.placeholder}
                        value={value}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        rows={6}
                        maxLength={1000}
                        aria-invalid={status === "error" && !value.trim()}
                      />
                    ) : (
                      <input
                        id={`contact-${f.id}`}
                        type={f.type}
                        className={styles.input}
                        placeholder={f.placeholder}
                        value={value}
                        onChange={(e) => handleChange(f.id, e.target.value)}
                        autoComplete={f.id === "email" ? "email" : "off"}
                        aria-invalid={status === "error" && !value.trim()}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.formFooter}>
              <p className={styles.status} role="status" aria-live="polite">
                {status === "error" && formCfg.errorMessage}
                {status === "done" && formCfg.successMessage}
              </p>

              <button type="submit" className={styles.submit}>
                {formCfg.submitLabel}
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </section>

        {/* ================= FAQ ================= */}
        <section data-reveal className={styles.faqSection}>
          <header className={styles.faqHeader}>
            <p className={styles.eyebrow}>{faq.eyebrow}</p>
            <h2 className={styles.heading}>{faq.title}</h2>
          </header>

          <div className={styles.faqList}>
            {faq.items.map((item) => {
              const isOpen = openFaq === item.id;
              return (
                <div
                  key={item.id}
                  className={`${styles.faqItem} ${
                    isOpen ? styles.faqOpen : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.faqTrigger}
                    onClick={() => setOpenFaq(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                  >
                    <span className={styles.faqQuestion}>
                      {item.question}
                    </span>
                    <span className={styles.faqToggle} aria-hidden="true">
                      {isOpen ? (
                        <Minus size={16} strokeWidth={1.5} />
                      ) : (
                        <Plus size={16} strokeWidth={1.5} />
                      )}
                    </span>
                  </button>

                  <div
                    id={`faq-${item.id}`}
                    className={styles.faqAnswer}
                    role="region"
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
