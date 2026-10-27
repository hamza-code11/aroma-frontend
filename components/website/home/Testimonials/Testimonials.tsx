"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowLeft, ArrowRight, PenLine, Loader2 } from "lucide-react";
import WriteReviewModal from "./WriteReviewModal";
import styles from "./Testimonials.module.css";

// Hooks Import
import { useTestimonials, useSubmitTestimonial } from "@/hooks/useTestimonials";
import { useToast } from "@/components/ui/Toast";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { showToast } = useToast();

  // Data Fetching
  const { data: testimonialsData, isLoading } = useTestimonials(1); // Page 1
  const testimonials = testimonialsData?.data || [];

  // Submit Mutation
  const submitMutation = useSubmitTestimonial();

  /* ---------- Arrows enable/disable ---------- */
  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateButtons();
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      track.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons, testimonials]);

  /* ---------- GSAP intro ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLoading || testimonials.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-review]", { opacity: 0 });

      gsap.to("[data-review]", {
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isLoading, testimonials.length]);

  // Handle Form Submit
  const handleReviewSubmit = (data: { rating: number; review: string }) => {
    submitMutation.mutate(
      { ratings: data.rating, reviews: data.review },
      {
        onSuccess: () => {
          showToast("Your review has been submitted for approval.", "success");
          setModalOpen(false);
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            showToast("Please login to submit a review.", "error");
          } else {
            showToast(error.response?.data?.message || "Failed to submit review.", "error");
          }
        }
      }
    );
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Customer reviews"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Customer Reviews</p>
            <h2 className={styles.title}>
              Loved in <span className="text-gradient-gold">every room</span>
            </h2>
          </div>

          <div className={styles.rating}>
            <span className={styles.score}>4.9</span>
            <div>
              <div className={styles.stars} aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className={styles.count}>From {testimonials.length > 0 ? "500+" : "0"} happy customers</p>
            </div>
          </div>
        </div>

        {/* Toolbar: Write a Review + arrows */}
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.writeBtn}
            onClick={() => setModalOpen(true)}
          >
            <PenLine size={16} strokeWidth={1.5} />
            Write a Review
          </button>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous reviews"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next reviews"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin text-[var(--accent-primary)]" size={32} />
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div ref={trackRef} className={styles.track}>
            {testimonials.map((r) => (
              <figure key={r.id} data-review className={styles.card}>
                <div className={styles.stars} aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < r.ratings ? "currentColor" : "none"} 
                      strokeWidth={i < r.ratings ? 0 : 1.5}
                      style={{ opacity: i < r.ratings ? 1 : 0.3 }}
                    />
                  ))}
                </div>

                <blockquote className={styles.quote}>{r.reviews}</blockquote>

                <figcaption className={styles.author}>
                  <span className={styles.name}>{r.user?.name || "Anonymous"}</span>
                  <span className={styles.meta}>
                    Verified Customer
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <WriteReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleReviewSubmit}
        isLoading={submitMutation.isPending}
      />
    </section>
  );
}
