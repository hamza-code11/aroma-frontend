import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contact.service';
import type { ContactPayload } from '@/types/contact';

const QUERY_KEY = ['contacts'];

/* ================= MUTATIONS (PUBLIC) ================= */

// Submit Contact Form
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (payload: ContactPayload) => contactService.submit(payload),
  });
};

/* ================= QUERIES (ADMIN) ================= */

// Get All Contacts (Admin)
export const useAdminContacts = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEY, page],
    queryFn: () => contactService.getAdminAll(page),
    staleTime: 1000 * 60 * 2, // 2 minute cache
  });
};

/* ================= MUTATIONS (ADMIN) ================= */

// Delete Contact
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
