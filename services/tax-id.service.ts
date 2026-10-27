import axiosInstance from '@/lib/axios';
import type { TaxId, TaxIdPayload } from '@/types/tax-id';

export const taxIdService = {
  // User: Submit / Update Tax ID
  submit: async (payload: TaxIdPayload): Promise<TaxId> => {
    const response = await axiosInstance.post('/tax-id', payload);
    return response.data.data;
  },

  // User: Get My Tax ID
  getMyTaxId: async (): Promise<TaxId | null> => {
    const response = await axiosInstance.get('/tax-id');
    return response.data.data;
  },

  // Admin: Get All Tax IDs
  getAdminAll: async (): Promise<TaxId[]> => {
    const response = await axiosInstance.get('/admin/tax-ids');
    // Backend response format: { status, data: { data: [...] } } (paginated)
    return response.data.data.data;
  },

  // Admin: Update Status (verify/reject)
  updateStatus: async (id: number, status: string): Promise<TaxId> => {
    const response = await axiosInstance.patch(`/admin/tax-ids/${id}/status`, { status });
    return response.data.data;
  },
};
