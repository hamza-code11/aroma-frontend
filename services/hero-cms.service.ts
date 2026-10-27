import axiosInstance from '@/lib/axios';
import type { HeroCms } from '@/types/hero-cms';

export const heroCmsService = {
  getContent: async (): Promise<HeroCms> => {
    const response = await axiosInstance.get('/hero-cms');
    return response.data.data;
  },
  update: async (payload: Partial<HeroCms>): Promise<HeroCms> => {
    const response = await axiosInstance.post('/admin/hero-cms', payload);
    return response.data.data;
  },
};
