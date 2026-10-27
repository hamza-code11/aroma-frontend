import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialService } from '@/services/testimonial.service';
import type { TestimonialPayload } from '@/types/testimonial';

const PUBLIC_KEY = ['testimonials', 'public'];
const ADMIN_KEY = ['testimonials', 'admin'];

/* ================= PUBLIC QUERIES ================= */

// Get approved testimonials (Homepage ke liye)
export const useTestimonials = (page: number = 1) => {
  return useQuery({
    queryKey: [...PUBLIC_KEY, page],
    queryFn: () => testimonialService.getApproved(page),
    staleTime: 1000 * 60 * 5, // 5 minute cache
  });
};

/* ================= USER MUTATIONS ================= */

// Submit new testimonial
export const useSubmitTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TestimonialPayload) => testimonialService.submit(payload),
    onSuccess: () => {
      // User ke submit karne ke baad public cache refresh karein (agar approve hua ho toh)
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
    },
  });
};

/* ================= ADMIN QUERIES & MUTATIONS ================= */

// Get all testimonials (Admin panel ke liye)
export const useAdminTestimonials = (page: number = 1) => {
  return useQuery({
    queryKey: [...ADMIN_KEY, page],
    queryFn: () => testimonialService.getAdminAll(page),
    staleTime: 1000 * 60 * 2, // Admin ke liye 2 minute cache
  });
};

// Toggle Verification (Admin)
export const useToggleTestimonialVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_verified }: { id: number; is_verified: boolean }) =>
      testimonialService.toggleVerification(id, is_verified),
    onSuccess: () => {
      // Admin list aur public list dono refresh karein
      queryClient.invalidateQueries({ queryKey: ADMIN_KEY });
      queryClient.invalidateQueries({ queryKey: PUBLIC_KEY });
    },
  });
};
