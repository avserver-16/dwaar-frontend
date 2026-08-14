import apiClient from './axios';
import type { LoginCredentials, SignupData, AuthResponse, CheckPhoneResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/api/users/login',
      credentials
    );

    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users', data);

    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  },

  checkPhone: async (phone: string): Promise<CheckPhoneResponse> => {
    const response = await apiClient.post<CheckPhoneResponse>('/api/users/check-phone', { phone });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/users/refresh-token', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/users/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};