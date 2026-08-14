import apiClient from './axios';
import type { Group, Message } from '../types';

export const groupsApi = {
  createGroup: async (data: Partial<Group>): Promise<Group> => {
    const response = await apiClient.post<Group>('/api/groups', data);
    return response.data;
  },

  getUserGroups: async (userId: string): Promise<Group[]> => {
    const response = await apiClient.get<Group[]>(`/api/groups/user/${userId}`);
    return response.data;
  },

  getGroupById: async (groupId: string): Promise<Group> => {
    const response = await apiClient.get<Group>(`/api/groups/${groupId}`);
    return response.data;
  },

  addMember: async (groupId: string, userId: string): Promise<Group> => {
    const response = await apiClient.post<Group>(`/api/groups/${groupId}/members`, { userId });
    return response.data;
  },

  removeMember: async (groupId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/api/groups/${groupId}/members/${userId}`);
  },

  getGroupMessages: async (groupId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/api/groups/${groupId}/messages`);
    return response.data;
  },

  joinGroup: async (groupId: string): Promise<void> => {
    await apiClient.post(`/api/groups/${groupId}/join`);
  },
};