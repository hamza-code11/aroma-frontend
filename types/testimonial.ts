export type TestimonialUser = {
  id: number;
  name: string;
  email: string;
};

export type TestimonialRating = {
  id: number;
  ratings: number;        // 1-5
  review: string;
  verified: boolean;
  created_at: string;
};

export type Testimonial = {
  user: TestimonialUser;
  rating: TestimonialRating;
};
