import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxIdService } from '@/services/tax-id.service';
import type { TaxIdPayload } from '@/types/tax-id';

// Query Keys
const MY_TAX_KEY = ['tax-id', 'my'];
const ADMIN_TAX_KEY = ['tax-id', 'admin'];

/* ================= USER HOOKS ================= */

// Get My Tax ID (User)
export const useMyTaxId = () => {
  return useQuery({
    queryKey: ['tax-id', 'my'],
    queryFn: taxIdService.getMyTaxId,
    staleTime: 1000 * 60 * 5, // 5 min cache
    // refetchInterval hata diya (ab manually check hoga)
    refetchOnWindowFocus: true,
  });
};

// Submit Tax ID (User)
export const useSubmitTaxId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaxIdPayload) => taxIdService.submit(payload),
    onSuccess: () => {
      // Data submit hone ke baad "my tax id" refresh karein
      queryClient.invalidateQueries({ queryKey: MY_TAX_KEY });
    },
  });
};

/* ================= ADMIN HOOKS ================= */

// Get All Tax IDs (Admin)
export const useAdminTaxIds = () => {
  return useQuery({
    queryKey: ADMIN_TAX_KEY,
    queryFn: taxIdService.getAdminAll,
    staleTime: 1000 * 60 * 2, // 2 minute cache (admin needs fresh data)
  });
};

// Update Status (Admin)
export const useUpdateTaxIdStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'pending' | 'verified' | 'rejected' }) =>
      taxIdService.updateStatus(id, status),
    onSuccess: () => {
      // Admin list refresh karein
      queryClient.invalidateQueries({ queryKey: ADMIN_TAX_KEY });
      // User ka "my tax id" bhi update ho jayega (agar same browser mein hai toh)
      queryClient.invalidateQueries({ queryKey: MY_TAX_KEY });
    },
  });
};
