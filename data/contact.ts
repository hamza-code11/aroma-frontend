import type { ContactContent, ContactEnquiry } from "@/types/contact";

export const contactContent: ContactContent = {

  hero: {
    eyebrow: "Get in touch",
    title: "Let's talk about",
    titleHighlight: "your space",
    lead: "Questions about a fragrance, an order, or a custom blend? Send us a message and our team will reply within one business day.",
  },
  banner: {
    image: "/banner/03.jfif",
    imageAlt: "i.Shine Aroma diffuser in a warm room",
  },
  info: [
    {
      id: "email",
      label: "Email",
      value: "hello@ishinearoma.com",
      href: "mailto:hello@ishinearoma.com",
      icon: "mail",
    },
    {
      id: "phone",
      label: "Phone",
      value: "+92 300 1234567",
      href: "tel:+923001234567",
      icon: "phone",
    },
    {
      id: "address",
      label: "Studio",
      value: "Gulberg III, Lahore, Pakistan",
      icon: "map",
    },
    {
      id: "hours",
      label: "Hours",
      value: "Mon – Sat · 10:00 to 19:00",
      icon: "clock",
    },
  ],
  form: {
    title: "Send us a message",
    text: "Fill in the form below and we'll get back to you as soon as possible.",
    fields: [
      {
        id: "name",
        label: "Your name",
        placeholder: "e.g. Ayesha Khan",
        type: "text",
        required: true,
      },
      {
        id: "email",
        label: "Email address",
        placeholder: "you@email.com",
        type: "email",
        required: true,
      },
      {
        id: "subject",
        label: "Subject",
        placeholder: "e.g. Order inquiry",
        type: "text",
        required: false,
      },
      {
        id: "message",
        label: "Your message",
        placeholder: "Tell us what you need…",
        type: "textarea",
        required: true,
      },
    ],
    submitLabel: "Send Message",
    successMessage: "Thank you — we'll be in touch shortly.",
    errorMessage: "Please fill in all required fields correctly.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        id: "shipping",
        question: "Do you ship across Pakistan?",
        answer:
          "Yes. We ship to all major cities within 3–5 working days, and to smaller towns within 5–7 working days. Delivery is free on orders above PKR 5,000.",
      },
      {
        id: "longevity",
        question: "How long does a diffuser last?",
        answer:
          "Depending on room size and airflow, a 50 ml diffuser typically lasts 6–8 weeks. In smaller rooms with low airflow, it can last up to 10 weeks.",
      },
      {
        id: "returns",
        question: "What is your return policy?",
        answer:
          "Unopened products can be returned within 14 days of delivery for a full refund. Opened products are non-refundable for hygiene reasons, unless the item is defective.",
      },
      {
        id: "custom",
        question: "Can I order a custom fragrance?",
        answer:
          "Absolutely. For custom blends, bulk orders, or corporate gifting, please email us directly at hello@ishinearoma.com with your requirements.",
      },
      {
        id: "samples",
        question: "Do you offer samples?",
        answer:
          "We offer a discovery set of our four signature blends. It's the easiest way to find the scent that belongs in your space before committing to a full bottle.",
      },
    ],
  },
};

// ============ Dummy enquiries for admin list ============
export const contactEnquiries: ContactEnquiry[] = [
  {
    id: 1,
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    subject: "Bulk order for office",
    message:
      "Hi, I would like to place a bulk order for 25 diffusers for our office. Can you share the pricing and delivery timeline?",
    created_at: "2026-10-12T09:15:00Z",
  },
  {
    id: 2,
    name: "Hamza Siddiqui",
    email: "hamza.s@example.com",
    subject: "Custom fragrance inquiry",
    message:
      "I am interested in a custom fragrance for my boutique hotel. Could we schedule a call to discuss the blend?",
    created_at: "2026-10-11T14:30:00Z",
  },
  {
    id: 3,
    name: "Sana Malik",
    email: "sana.malik@example.com",
    subject: "Order not received",
    message:
      "My order #ISH-10245 was supposed to arrive on Oct 8 but I haven't received it yet. Could you please check the status?",
    created_at: "2026-10-10T16:45:00Z",
  },
  {
    id: 4,
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    subject: "Wholesale partnership",
    message:
      "We run a chain of home decor stores in Lahore and would like to explore a wholesale partnership. Please advise next steps.",
    created_at: "2026-10-08T11:00:00Z",
  },
  {
    id: 5,
    name: "Mariam Tariq",
    email: "mariam.t@example.com",
    subject: "Refill availability",
    message:
      "Do you sell refills for the Zen Ultrasonic Diffuser? I would like to buy in bulk if available.",
    created_at: "2026-10-06T08:20:00Z",
  },
  {
    id: 6,
    name: "Usman Raza",
    email: "usman.raza@example.com",
    subject: "Feedback on Amber Noir",
    message:
      "Just wanted to say the Amber Noir is incredible. My guests keep asking about it. Keep up the great work!",
    created_at: "2026-10-04T19:00:00Z",
  },
  {
    id: 7,
    name: "Zara Iqbal",
    email: "zara.iqbal@example.com",
    subject: "Corporate gifting",
    message:
      "We want to gift diffusers to 50 employees this Eid. Could you provide a corporate gifting quote and packaging options?",
    created_at: "2026-10-02T13:10:00Z",
  },
];