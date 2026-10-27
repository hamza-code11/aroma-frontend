// src/hooks/auth/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authService.getUser,
    retry: false, 
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false, // Window focus par bar bar API na chale
  });
};
