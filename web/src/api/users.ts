import apiClient from './axios';
import type { User, Location } from '../types';

export const usersApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/api/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },

  getLocation: async (): Promise<Location> => {
    const response = await apiClient.get<Location>('/api/users/get-location');
    return response.data;
  },

  addLocation: async (location: Location): Promise<User> => {
    const response = await apiClient.post<User>('/api/users/add-location', location);
    return response.data;
  },

  getNearbyBuildings: async (location: Location, radius?: number): Promise<any[]> => {
    const response = await apiClient.post<any[]>('/api/users/nearby-buildings', {
      location,
      radius: radius || 1000,
    });
    return response.data;
  },

  joinRoom: async (roomId: string): Promise<void> => {
    await apiClient.post('/api/users/join-room', { roomId });
  },

  getJoinedRooms: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/api/users/joined-rooms');
    return response.data;
  },
};