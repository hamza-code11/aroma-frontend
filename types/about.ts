export type AboutHero = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutStoryBlock = {
  heading: string;
  body: string[];
  image: string;
  imageAlt: string;
};

export type AboutMissionVision = {
  mission: { title: string; text: string };
  vision: { title: string; text: string };
};

export type AboutBanner = {
  image: string;
  imageAlt: string;
};

export type AboutCta = {
  title: string;
  text: string;
  cta: { label: string; href: string };
};

export type AboutContent = {
  hero: AboutHero;
  stats: AboutStat[];
  banner: AboutBanner;
  story: AboutStoryBlock;
  missionVision: AboutMissionVision;
  cta: AboutCta;
};
