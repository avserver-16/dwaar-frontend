import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '../api/messages';

export const useRoomMessages = (roomId: string) => {
  return useQuery({
    queryKey: ['roomMessages', roomId],
    queryFn: () => messagesApi.getRoomMessages(roomId),
    enabled: !!roomId,
  });
};

export const usePrivateMessages = (toUserId: string) => {
  return useQuery({
    queryKey: ['privateMessages', toUserId],
    queryFn: () => messagesApi.getPrivateMessages(toUserId),
    enabled: !!toUserId,
  });
};

export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => messagesApi.getConversations(userId),
    enabled: !!userId,
  });
};