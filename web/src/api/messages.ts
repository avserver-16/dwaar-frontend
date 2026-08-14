import apiClient from './axios';
import type { Message, Conversation } from '../types';

export const messagesApi = {
  getRoomMessages: async (roomId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/api/messages/rooms/${roomId}`);
    return response.data;
  },

  getPrivateMessages: async (toUserId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/api/messages/private/${toUserId}`);
    return response.data;
  },

  getConversations: async (userId: string): Promise<Conversation[]> => {
    const response = await apiClient.get<Conversation[]>(`/api/conversations/${userId}`);
    return response.data;
  },
};