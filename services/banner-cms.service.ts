import axiosInstance from '@/lib/axios';
import type { BannerCms } from '@/types/banner-cms';

export const bannerCmsService = {
  getContent: async (): Promise<BannerCms> => {
    const response = await axiosInstance.get('/banner-cms');
    return response.data.data;
  },
  update: async (payload: FormData): Promise<BannerCms> => {
    const response = await axiosInstance.post('/admin/banner-cms', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
