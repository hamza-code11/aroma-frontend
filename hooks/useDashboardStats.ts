import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await axiosInstance.get('/admin/dashboard-stats');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};
