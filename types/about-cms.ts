export interface AboutCms {
  id: number;
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    lead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  stats: { value: string; label: string }[];
  banner_image: string | null;
  story: {
    heading: string;
    body: string[];
    image: string | null; // Backend se aane wala path
    imageAlt: string;
  };
  mission_vision: {
    mission: { title: string; text: string };
    vision: { title: string; text: string };
  };
  cta: {
    title: string;
    text: string;
    cta: { label: string; href: string };
  };
}
