export interface NewsletterSubscriber {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterPayload {
  email: string;
}

// Pagination Type
export interface PaginatedNewsletterResponse {
  current_page: number;
  data: NewsletterSubscriber[];
  total: number;
  per_page: number;
  last_page: number;
}