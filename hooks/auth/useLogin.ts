// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginPayload } from '@/services/auth.service';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (data) => {
  localStorage.setItem('auth_token', data.token);
  queryClient.setQueryData(['user'], { user: data.user });

  // Role ke hisaab se redirect
  if (data.user.role === 'admin') {
    router.push('/admin'); // Admin Dashboard
  } else {
    router.push('/'); // Normal User Home
  }
},
  });
};
