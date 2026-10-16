export type BannerCard = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export type BannerContent = {
  image: string;
  imageAlt: string;
  cards: BannerCard[];
};
