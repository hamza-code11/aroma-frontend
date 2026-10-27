import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutCmsService } from '@/services/about-cms.service';

const QUERY_KEY = ['about-cms'];

export const useAboutCms = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: aboutCmsService.getContent,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateAboutCms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => aboutCmsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
