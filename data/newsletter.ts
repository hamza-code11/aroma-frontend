import type { NewsletterSubscriber } from "@/types/newsletter";

export const subscribers: NewsletterSubscriber[] = [
  {
    id: 1,
    email: "ayesha.khan@example.com",
    is_active: true,
    subscribed_at: "2026-09-15T10:00:00Z",
    updated_at: "2026-09-15T10:00:00Z",
  },
  {
    id: 2,
    email: "hamza.siddiqui@example.com",
    is_active: true,
    subscribed_at: "2026-09-22T14:30:00Z",
    updated_at: "2026-09-22T14:30:00Z",
  },
  {
    id: 3,
    email: "sana.malik@example.com",
    is_active: false,
    subscribed_at: "2026-09-28T09:15:00Z",
    updated_at: "2026-10-05T11:00:00Z",
  },
  {
    id: 4,
    email: "bilal.ahmed@example.com",
    is_active: true,
    subscribed_at: "2026-10-01T16:45:00Z",
    updated_at: "2026-10-01T16:45:00Z",
  },
  {
    id: 5,
    email: "mariam.tariq@example.com",
    is_active: true,
    subscribed_at: "2026-10-08T08:20:00Z",
    updated_at: "2026-10-08T08:20:00Z",
  },
  {
    id: 6,
    email: "usman.raza@example.com",
    is_active: false,
    subscribed_at: "2026-10-12T20:00:00Z",
    updated_at: "2026-10-14T10:30:00Z",
  },
];
