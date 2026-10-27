// src/hooks/useProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, UpdatePasswordPayload } from '@/services/auth.service';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Password change mutation
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordPayload) => authService.updatePassword(data),
  });
};

// Logout mutation
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // 1. Token delete karein
      localStorage.removeItem('auth_token');
      
      // 2. Google auto-select band karein (taake logout ke baad wapas popup na aaye)
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.disableAutoSelect();
      }

      // 3. Query cache clear karein taake purana data na dikhe
      queryClient.clear();
      
      // 4. Home page par bhej dein
      router.push('/');
    },
  });
};
