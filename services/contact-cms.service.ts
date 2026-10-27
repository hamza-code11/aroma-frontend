import axiosInstance from '@/lib/axios';
import type { ContactCms } from '@/types/contact-cms';

export const contactCmsService = {
  // Public: Fetch content
  getContent: async (): Promise<ContactCms> => {
    const response = await axiosInstance.get('/contact-cms');
    return response.data.data;
  },

  // Admin: Update content
  update: async (payload: FormData): Promise<ContactCms> => {
    const response = await axiosInstance.post('/admin/contact-cms', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
