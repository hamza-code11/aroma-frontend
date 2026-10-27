export interface ContactCmsHero {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  lead: string;
}

export interface ContactCmsInfo {
  id: string;
  label: string;
  value: string;
  icon: 'mail' | 'phone' | 'map' | 'clock';
}

export interface ContactCmsFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactCms {
  id: number;
  hero: ContactCmsHero;
  banner_image: string | null;
  info: ContactCmsInfo[];
  faq: {
    eyebrow: string;
    title: string;
    items: ContactCmsFaqItem[];
  };
}