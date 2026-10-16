import TestimonialsList from "@/components/admin/testimonials/page";
import { testimonials } from "@/data/testimonial";

export const metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return <TestimonialsList testimonials={testimonials} />;
}
