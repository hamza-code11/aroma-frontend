export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Pagination Type
export interface PaginatedContactResponse {
  current_page: number;
  data: Contact[];
  total: number;
  per_page: number;
  last_page: number;
}











// types/contact-cms.ts ke aakhir mein add karein:

export interface ContactInfoItem {
  id: string;
  label: string;
  value: string;
  icon: 'mail' | 'phone' | 'map' | 'clock';
}

export interface ContactFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactContent {
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    lead: string;
  };
  banner: {
    image: string;
    imageAlt: string;
  };
  info: ContactInfoItem[];
  faq: {
    eyebrow: string;
    title: string;
    items: ContactFaqItem[];
  };
  form: {
    title: string;
    text: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    fields: any[]; // ya specific fields type
  };
}