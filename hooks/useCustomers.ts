import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';

const QUERY_KEY = ['customers'];

export const useCustomers = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEY, page],
    queryFn: () => customerService.getAll(page),
    staleTime: 1000 * 60 * 2, // 2 minute cache
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
