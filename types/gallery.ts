export type GalleryImage = {
  id: string;
  image: string;
  imageAlt: string;
};

export type GalleryContent = {
  images: GalleryImage[];
};
