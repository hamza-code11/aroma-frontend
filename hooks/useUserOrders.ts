import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useUserOrders = () => {
    return useQuery({
        queryKey: ['user-orders'],
        queryFn: async () => {
            const res = await axiosInstance.get('/user/orders');
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minute cache
    });
};
