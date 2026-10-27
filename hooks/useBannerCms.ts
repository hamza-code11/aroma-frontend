import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerCmsService } from '@/services/banner-cms.service';

const QUERY_KEY = ['banner-cms'];

export const useBannerCms = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: bannerCmsService.getContent,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateBannerCms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => bannerCmsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
