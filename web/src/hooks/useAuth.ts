import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials, SignupData } from '../types';

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      return response;
    },
    onSuccess: (data) => {
      login(data.user, data.token, data.refreshToken);
    },
  });
};

export const useSignup = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await authApi.signup(data);
      return response;
    },
    onSuccess: (data) => {
      login(data.user, data.token, data.refreshToken);
    },
  });
};

export const useCheckPhone = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await authApi.checkPhone(phone);
      return response;
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      logout();
    },
  });
};