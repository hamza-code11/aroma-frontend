import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroCmsService } from '@/services/hero-cms.service';
import type { HeroCms } from '@/types/hero-cms';

const QUERY_KEY = ['hero-cms'];

export const useHeroCms = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: heroCmsService.getContent,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateHeroCms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<HeroCms>) => heroCmsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
