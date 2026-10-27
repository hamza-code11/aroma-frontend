// src/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { authService, RegisterPayload } from '@/services/auth.service';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: (data) => {
      // Token save karein
      localStorage.setItem('auth_token', data.token);
      // Home par bhej dein
      router.push('/');
    },
    onError: (error: AxiosError<any>) => {
      console.error("Registration failed", error);
    },
  });
};
