"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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
  Loader2,
} from "lucide-react";
import styles from "./Contact.module.css";

// Hooks Import
import { useContactCms } from "@/hooks/useContactCms";
import { useSubmitContact } from "@/hooks/useContacts";
import { useToast } from "@/components/ui/Toast";

// Skeleton Import
import ContactSkeleton from "@/components/website/skeletons/ContactSkeleton/ContactSkeleton";

gsap.registerPlugin(ScrollTrigger);

const INFO_ICONS = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
  clock: Clock,
} as const;

function InfoIcon({ icon }: { icon: keyof typeof INFO_ICONS }) {
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

// ✅ Fallback data (Agar backend se data na aaye)
const FALLBACK_CONTENT = {
  hero: {
    eyebrow: "Contact Us",
    title: "Let's connect",
    titleHighlight: "with us",
    lead: "Have a question or need help? We're here for you.",
  },
  banner: {
    image: "", // Khaali chhorein taake error na aaye
    imageAlt: "Contact Banner",
  },
  info: [
    { id: "1", label: "Email", value: "hello@ishinearoma.com", icon: "mail" },
    { id: "2", label: "Phone", value: "+92 300 1234567", icon: "phone" },
    { id: "3", label: "Location", value: "Karachi, Pakistan", icon: "map" },
    { id: "4", label: "Hours", value: "Mon-Sat 10am-6pm", icon: "clock" },
  ],
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    items: [],
  },
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { showToast } = useToast();
  const submitMutation = useSubmitContact();

  // Fetch CMS Data
  const { data: cmsData, isLoading } = useContactCms();

  // Merge API data with fallback data
  const content = useMemo(() => {
    if (!cmsData) return FALLBACK_CONTENT;
    
    return {
      hero: cmsData.hero,
      banner: {
        image: cmsData.banner_image 
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` 
          : "",
        imageAlt: "Contact Banner",
      },
      info: cmsData.info,
      faq: cmsData.faq,
    };
  }, [cmsData]);

  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Set default open FAQ when data loads
  useEffect(() => {
    if (content.faq.items && content.faq.items.length > 0 && !openFaq) {
      setOpenFaq(content.faq.items[0].id);
    }
  }, [content.faq.items, openFaq]);

  /* ---------- GSAP reveal ---------- */
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

  /* ---------- Form submit ---------- */
  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    const nameOk = form.name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const messageOk = form.message.trim().length >= 5;

    if (!nameOk || !emailOk || !messageOk) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields correctly.");
      return;
    }

    submitMutation.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || "General Inquiry",
        message: form.message.trim(),
      },
      {
        onSuccess: () => {
          setStatus("done");
          setForm(INITIAL_FORM);
          showToast("Your message has been submitted successfully!", "success");
        },
        onError: (err: any) => {
          setStatus("error");
          if (err.response?.data?.errors) {
            const firstError = Object.values(err.response.data.errors)[0] as string[];
            setErrorMsg(firstError[0]);
          } else {
            setErrorMsg(err.response?.data?.message || "Failed to submit message. Try again.");
          }
        }
      }
    );
  };

  const isSubmitting = submitMutation.isPending;

  // Loading State
  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <main ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* ================= HERO BANNER ================= */}
        <section className={styles.heroBanner}>
          <div className={styles.heroBannerMedia}>
            {content.banner.image ? (
              <Image
                src={content.banner.image}
                alt={content.banner.imageAlt}
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
            <p className={styles.eyebrow}>{content.hero.eyebrow}</p>

            <h1 className={styles.title}>
              {content.hero.title}{" "}
              <span className={styles.titleHighlight}>
                {content.hero.titleHighlight}
              </span>
            </h1>

            <p className={styles.lead}>{content.hero.lead}</p>

            <div className={styles.infoGrid}>
              {content.info.map((item) => {
                const infoContent = (
                  <>
                    <span className={styles.infoLabel}>
                      <span className={styles.infoIcon}>
                        <InfoIcon icon={item.icon as keyof typeof INFO_ICONS} />
                      </span>
                      {item.label}
                    </span>
                    <span className={styles.infoValue}>{item.value}</span>
                  </>
                );

                return (item as any).href ? (
                  <a key={item.id} href={(item as any).href} className={styles.infoItem}>
                    {infoContent}
                  </a>
                ) : (
                  <div key={item.id} className={styles.infoItem}>
                    {infoContent}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FORM + SIDE TEXT ================= */}
        <section data-reveal className={styles.formSection}>
          <div className={styles.formIntro}>
            <h2 className={styles.heading}>Send us a message</h2>
            <p className={styles.para}>
              Have a question about our fragrances, need help with an order, or
              just want to say hello? Fill out the form and we’ll get back to
              you within one business day.
            </p>

            <ul className={styles.formHighlights}>
              <li>Replies within one business day</li>
              <li>Custom blends & bulk orders welcome</li>
              <li>Your details stay private — always</li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Your name <span aria-hidden="true"> *</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Ayesha Khan"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  autoComplete="name"
                  aria-invalid={status === "error" && !form.name.trim()}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email address <span aria-hidden="true"> *</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  autoComplete="email"
                  aria-invalid={status === "error" && !form.email.trim()}
                  disabled={isSubmitting}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label htmlFor="contact-subject" className={styles.label}>Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Question about the diffuser"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message <span aria-hidden="true"> *</span>
                </label>
                <textarea
                  id="contact-message"
                  className={styles.textarea}
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={6}
                  maxLength={1000}
                  aria-invalid={status === "error" && !form.message.trim()}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <p className={styles.status} role="status" aria-live="polite">
                {status === "error" && (errorMsg || "Please fill in all required fields correctly.")}
                {status === "done" && "Your message has been sent. We’ll be in touch soon."}
              </p>

              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending... <Loader2 size={16} className="animate-spin" /></>
                ) : (
                  <>Send message <ArrowRight size={16} strokeWidth={1.5} /></>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ================= FAQ ================= */}
        {content.faq.items && content.faq.items.length > 0 && (
          <section data-reveal className={styles.faqSection}>
            <header className={styles.faqHeader}>
              <p className={styles.eyebrow}>{content.faq.eyebrow}</p>
              <h2 className={styles.heading}>{content.faq.title}</h2>
            </header>

            <div className={styles.faqList}>
              {content.faq.items.map((item) => {
                const isOpen = openFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ""}`}
                  >
                    <button
                      type="button"
                      className={styles.faqTrigger}
                      onClick={() => setOpenFaq(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${item.id}`}
                    >
                      <span className={styles.faqQuestion}>{item.question}</span>
                      <span className={styles.faqToggle} aria-hidden="true">
                        {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                      </span>
                    </button>

                    <div id={`faq-${item.id}`} className={styles.faqAnswer} role="region">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
