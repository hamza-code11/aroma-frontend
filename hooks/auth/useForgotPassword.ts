import { useMutation } from '@tanstack/react-query';
import { authService, ForgotPasswordPayload, VerifyOtpPayload, ResetPasswordPayload } from '@/services/auth.service';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => authService.forgotPassword(data),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => authService.verifyOtp(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
  });
};
