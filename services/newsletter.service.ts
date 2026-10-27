import axiosInstance from '@/lib/axios';
import type { NewsletterPayload, PaginatedNewsletterResponse, NewsletterSubscriber } from '@/types/newsletter';

export const newsletterService = {
  // Public: Subscribe to newsletter
  subscribe: async (payload: NewsletterPayload): Promise<NewsletterSubscriber> => {
    const response = await axiosInstance.post('/newsletter', payload);
    return response.data.data;
  },

  // Admin: Get all subscribers (Paginated)
  getAdminAll: async (page: number = 1): Promise<PaginatedNewsletterResponse> => {
    const response = await axiosInstance.get(`/admin/newsletters?page=${page}`);
    return response.data.data;
  },

  // Admin: Delete subscriber
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/newsletters/${id}`);
  },
};
