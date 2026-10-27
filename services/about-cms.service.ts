import axiosInstance from '@/lib/axios';
import type { AboutCms } from '@/types/about-cms';

export const aboutCmsService = {
  getContent: async (): Promise<AboutCms> => {
    const response = await axiosInstance.get('/about-cms');
    return response.data.data;
  },
  update: async (payload: FormData): Promise<AboutCms> => {
    const response = await axiosInstance.post('/admin/about-cms', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
