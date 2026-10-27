import axiosInstance from '@/lib/axios';
import type { Testimonial, TestimonialPayload, PaginatedResponse } from '@/types/testimonial';

export const testimonialService = {
  // Public: Get approved testimonials (Paginated)
  getApproved: async (page: number = 1): Promise<PaginatedResponse<Testimonial>> => {
    const response = await axiosInstance.get(`/testimonials?page=${page}`);
    return response.data.data;
  },

  // Auth: Submit a new testimonial
  submit: async (payload: TestimonialPayload): Promise<Testimonial> => {
    const response = await axiosInstance.post('/testimonials', payload);
    return response.data.data;
  },

  // Admin: Get all testimonials
  getAdminAll: async (page: number = 1): Promise<PaginatedResponse<Testimonial>> => {
    const response = await axiosInstance.get(`/admin/testimonials?page=${page}`);
    return response.data.data;
  },

  // Admin: Toggle verification status
  toggleVerification: async (id: number, is_verified: boolean): Promise<Testimonial> => {
    const response = await axiosInstance.patch(`/admin/testimonials/${id}/verification`, {
      is_verified,
    });
    return response.data.data;
  },
};
