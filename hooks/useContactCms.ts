import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactCmsService } from '@/services/contact-cms.service';

const QUERY_KEY = ['contact-cms'];

export const useContactCms = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: contactCmsService.getContent,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateContactCms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => contactCmsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
