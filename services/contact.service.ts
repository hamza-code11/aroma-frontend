import axiosInstance from '@/lib/axios';
import type { ContactPayload, PaginatedContactResponse } from '@/types/contact';

export const contactService = {
  // Public: Submit contact form
  submit: async (payload: ContactPayload): Promise<void> => {
    await axiosInstance.post('/contact', payload);
  },

  // Admin: Get all contacts (Paginated)
  getAdminAll: async (page: number = 1): Promise<PaginatedContactResponse> => {
    const response = await axiosInstance.get(`/admin/contacts?page=${page}`);
    return response.data.data;
  },

  // Admin: Delete contact
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/contacts/${id}`);
  },
};
