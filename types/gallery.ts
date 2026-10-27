export interface GalleryImage {
  id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

// Pagination Type (agar use karna ho)
export interface PaginatedGalleryResponse {
  current_page: number;
  data: GalleryImage[];
  total: number;
  per_page: number;
  last_page: number;
}