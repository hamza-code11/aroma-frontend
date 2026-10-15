import type { AboutContent } from "@/types/about";

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "Our Story",
    title: "Scent, crafted for",
    titleHighlight: "every room",
    lead: "i.Shine Aroma is a fragrance house built on a simple belief — that a room should feel like it has always smelled this way. Soft, warm, and quietly luxurious.",
    primaryCta: { label: "Shop the Collection", href: "/shop" },
    secondaryCta: { label: "Contact Us", href: "/contact" },
  },

  stats: [
    { value: "12K+", label: "Happy Customers" },
    { value: "40+", label: "Signature Blends" },
    { value: "4.9", label: "Average Rating" },
    { value: "6", label: "Years of Craft" },
  ],

  banner: {
    image: "/banner/03.jfif",
    imageAlt: "i.Shine Aroma signature diffuser bottle",
  },

  story: {
    heading: "A house built on scent",
    body: [
      "What began as a small evening ritual — lighting a diffuser at the end of a long day — grew into something we couldn't ignore. We wanted fragrances that felt personal. Scents that belonged to a home, not a shelf.",
      "Every i.Shine Aroma blend is developed in small batches, tested by hand, and refined until the scent feels exactly right. No shortcuts, no fillers — only what belongs in the bottle.",
      "Today, our fragrances live in living rooms, bedrooms, spas, and studies across the country. Each bottle carries the same intention: to make a space feel like home, the moment you walk in.",
    ],
    image: "/products/02.jfif",
    imageAlt: "Fragrance bottle detail",
  },

  missionVision: {
    mission: {
      title: "Our Mission",
      text: "To craft premium, long-lasting fragrances that transform everyday spaces into experiences — using honest ingredients and a deep respect for the craft of perfumery.",
    },
    vision: {
      title: "Our Vision",
      text: "To become the most trusted fragrance house in the region — known not for loud marketing, but for the quiet confidence of a scent that speaks for itself.",
    },
  },


  cta: {
    title: "Find the scent that belongs in your space.",
    text: "Explore the full collection and bring home a fragrance crafted with intention.",
    cta: { label: "Shop Now", href: "/shop" },
  },
};
