import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials, SignupData } from '../types';
import { requestLocationPermission, formatLocationForAPI } from '../utils/location';

export const useLogin = () => {
  const { login, updateUser } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      return response;
    },
    onSuccess: async (data) => {
      login(data.user, data.token, data.refreshToken);
      
      // Request location permission after successful login
      try {
        const position = await requestLocationPermission();
        const locationData = formatLocationForAPI(position);
        
        // Send location to backend
        const updatedUser = await usersApi.addLocation(locationData as any);
        updateUser(updatedUser);
      } catch (error) {
        console.warn('Location permission denied or failed:', error);
        // Continue without location - don't block login
      }
    },
  });
};

export const useSignup = () => {
  const { login, updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await authApi.signup(data);
      return response;
    },
    onSuccess: async (data) => {
      login(data.user, data.token, data.refreshToken);
      
      // Request location permission after successful signup
      try {
        const position = await requestLocationPermission();
        const locationData = formatLocationForAPI(position);
        
        // Send location to backend
        const updatedUser = await usersApi.addLocation(locationData as any);
        updateUser(updatedUser);
      } catch (error) {
        console.warn('Location permission denied or failed:', error);
        // Continue without location - don't block signup
      }
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