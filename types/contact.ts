export type ContactHero = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  lead: string;
};

export type ContactInfoItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon: "mail" | "phone" | "map" | "clock";
};

export type ContactFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ContactFormField = {
  id: "name" | "email" | "subject" | "message";
  label: string;
  placeholder: string;
  type: "text" | "email" | "textarea";
  required: boolean;
};

export type ContactBanner = {
  image: string;
  imageAlt: string;
};

export type ContactContent = {
  hero: ContactHero;
  banner: ContactBanner;   // ← ye naya
  info: ContactInfoItem[];
  form: {
    title: string;
    text: string;
    fields: ContactFormField[];
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: ContactFaqItem[];
  };
};
