import type { Testimonial } from "@/types/testimonial";

export const testimonials: Testimonial[] = [
  {
    user: {
      id: 2,
      name: "Ayesha Khan",
      email: "ayesha.khan@example.com",
    },
    rating: {
      id: 101,
      ratings: 5,
      review:
        "The scent fills my living room within minutes and stays soft all evening. Guests ask about it every single time.",
      verified: true,
      created_at: "2026-10-12T09:15:00Z",
    },
  },
  {
    user: {
      id: 3,
      name: "Hamza Siddiqui",
      email: "hamza.s@example.com",
    },
    rating: {
      id: 102,
      ratings: 5,
      review:
        "I use the diffuser in my bedroom at night and the amber blend is calming without being heavy. Worth every rupee.",
      verified: true,
      created_at: "2026-10-11T14:30:00Z",
    },
  },
  {
    user: {
      id: 4,
      name: "Sana Malik",
      email: "sana.malik@example.com",
    },
    rating: {
      id: 103,
      ratings: 4,
      review:
        "Packaging felt premium and the jasmine fragrance is exactly as described. It has become my daily ritual.",
      verified: true,
      created_at: "2026-10-10T16:45:00Z",
    },
  },
  {
    user: {
      id: 5,
      name: "Bilal Ahmed",
      email: "bilal.ahmed@example.com",
    },
    rating: {
      id: 104,
      ratings: 5,
      review:
        "Citrus Veil is now my morning ritual. Fresh, clean and it wakes up the whole house without being overpowering.",
      verified: false,
      created_at: "2026-10-08T11:00:00Z",
    },
  },
  {
    user: {
      id: 6,
      name: "Mariam Tariq",
      email: "mariam.t@example.com",
    },
    rating: {
      id: 105,
      ratings: 5,
      review:
        "I gifted Amber Noir to my mother and she has not stopped talking about it. Elegant bottle, richer scent.",
      verified: true,
      created_at: "2026-10-06T08:20:00Z",
    },
  },
  {
    user: {
      id: 7,
      name: "Usman Raza",
      email: "usman.raza@example.com",
    },
    rating: {
      id: 106,
      ratings: 4,
      review:
        "Every room in my home smells like a boutique hotel now. The longevity is genuinely impressive.",
      verified: false,
      created_at: "2026-10-04T19:00:00Z",
    },
  },
  {
    user: {
      id: 8,
      name: "Zara Iqbal",
      email: "zara.iqbal@example.com",
    },
    rating: {
      id: 107,
      ratings: 5,
      review:
        "Absolutely loved the Oud Royale. It's luxurious and long-lasting — my new signature scent.",
      verified: true,
      created_at: "2026-10-02T13:10:00Z",
    },
  },
];
