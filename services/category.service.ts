import axiosInstance from '@/lib/axios';
import type { Category, CategoryPayload } from '@/types/category';

export const categoryService = {
  // Public API - Get All Categories (Cached on backend)
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data.data; // Backend response: { status: 'success', data: [...] }
  },

  // Public API - Get Single Category
  getOne: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data.data;
  },

  // Admin API - Create Category
  create: async (payload: CategoryPayload): Promise<Category> => {
    const response = await axiosInstance.post('/admin/categories', payload);
    return response.data.data;
  },

  // Admin API - Update Category
  update: async (id: number, payload: CategoryPayload): Promise<Category> => {
    const response = await axiosInstance.put(`/admin/categories/${id}`, payload);
    return response.data.data;
  },

  // Admin API - Delete Category
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },




  // Naya toggle function
  toggleStatus: async (id: number): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/categories/${id}/toggle-status`);
    return response.data.data;
  },


  
};

