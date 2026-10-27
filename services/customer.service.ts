import axiosInstance from '@/lib/axios';
import type { PaginatedCustomerResponse } from '@/types/customer';

export const customerService = {
  // Get all customers (Admin)
  getAll: async (page: number = 1): Promise<PaginatedCustomerResponse> => {
    const response = await axiosInstance.get(`/admin/customers?page=${page}`);
    return response.data.data;
  },

  // Delete customer (Admin)
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/customers/${id}`);
  },
};
