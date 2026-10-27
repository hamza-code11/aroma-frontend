export interface TestimonialUser {
  id: number;
  name: string;
  email?: string; // Admin list mein email bhi aata hai
}

export interface Testimonial {
  id: number;
  user_id: number;
  ratings: number;
  reviews: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user: TestimonialUser; // Backend with('user') kar raha hai
}

export interface TestimonialPayload {
  ratings: number;
  reviews: string;
}

// Pagination Type (Laravel ki default pagination ke liye)
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
