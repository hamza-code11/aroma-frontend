import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopCmsService } from '@/services/shop-cms.service';

const QUERY_KEY = ['shop-cms'];

export const useShopCms = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: shopCmsService.getContent,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateShopCms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => shopCmsService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
