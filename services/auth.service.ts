// src/services/auth.service.ts
import axiosInstance from '@/lib/axios'; // Aapka axios instance

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}


export interface UpdatePasswordPayload {
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}


export interface ForgotPasswordPayload { email: string; }
export interface VerifyOtpPayload { email: string; otp: string; }
export interface ResetPasswordPayload {
  email: string;
  reset_token: string;
  password: string;
  password_confirmation: string;
}


export const authService = {
  login: async (data: LoginPayload) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterPayload) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await axiosInstance.get('/user');
    return response.data;
  },

  // Google Login ke liye direct browser redirect
  googleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  },


// authService object ke andar add karein:
  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await axiosInstance.post('/forgot-password', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await axiosInstance.post('/verify-otp', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await axiosInstance.post('/reset-password', data);
    return response.data;
  },



// authService object ke andar:
  updatePassword: async (data: UpdatePasswordPayload) => {
    const response = await axiosInstance.put('/change-password', data);
    return response.data;
  },

};

