import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const registerUser = (userId: string): void => {
  if (socket) {
    socket.emit('register_user', userId);
  }
};

export const joinGroup = (groupId: string): void => {
  if (socket) {
    socket.emit('join_group', groupId);
  }
};

export const leaveGroup = (groupId: string): void => {
  if (socket) {
    socket.emit('leave_group', groupId);
  }
};

export const sendGroupMessage = (data: {
  groupId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}): void => {
  if (socket) {
    socket.emit('send_group_message', data);
  }
};

export const sendPrivateMessage = (data: {
  toUserId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
}): void => {
  if (socket) {
    socket.emit('send_private_message', data);
  }
};

export const emitGroupTyping = (data: { groupId: string; isTyping: boolean }): void => {
  if (socket) {
    socket.emit('group_typing', data);
  }
};

export const emitPrivateTyping = (data: { toUserId: string; isTyping: boolean }): void => {
  if (socket) {
    socket.emit('private_typing', data);
  }
};

export const getOnlineUsers = (): void => {
  if (socket) {
    socket.emit('get_online_users');
  }
};