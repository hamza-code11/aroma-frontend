export interface BannerCard {
  id: string;
  label: string;
  title: string;
  description: string;
}

export interface BannerCms {
  id: number;
  image: string | null;
  cards: BannerCard[];
}
