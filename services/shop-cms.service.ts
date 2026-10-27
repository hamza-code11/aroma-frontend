import axiosInstance from '@/lib/axios';
import type { ShopCms } from '@/types/shop-cms';

export const shopCmsService = {
  getContent: async (): Promise<ShopCms> => {
    const response = await axiosInstance.get('/shop-cms');
    return response.data.data;
  },
  update: async (payload: FormData): Promise<ShopCms> => {
    const response = await axiosInstance.post('/admin/shop-cms', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
