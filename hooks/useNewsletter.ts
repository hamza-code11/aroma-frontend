import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterService } from '@/services/newsletter.service';
import type { NewsletterPayload } from '@/types/newsletter';

const QUERY_KEY = ['newsletters'];

/* ================= MUTATIONS (PUBLIC) ================= */

// Subscribe Mutation
export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: (payload: NewsletterPayload) => newsletterService.subscribe(payload),
  });
};

/* ================= QUERIES (ADMIN) ================= */

// Get all subscribers (Admin)
export const useAdminNewsletters = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEY, page],
    queryFn: () => newsletterService.getAdminAll(page),
    staleTime: 1000 * 60 * 2, // 2 minute cache
  });
};

/* ================= MUTATIONS (ADMIN) ================= */

// Delete Subscriber (Admin)
export const useDeleteNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => newsletterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
