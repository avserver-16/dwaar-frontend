import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket, registerUser } from './socket';
import { useAuth } from '../context/AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = (token: string) => {
    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);
  };

  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  };

  useEffect(() => {
    if (token && user?._id) {
      const socketInstance = initializeSocket(token);
      setSocket(socketInstance);

      if (socketInstance.connected) {
        setIsConnected(true);
        registerUser();
      } else {
        setIsConnected(false);
      }

      const handleConnect = () => {
        setIsConnected(true);
        registerUser();
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      const handleConnectError = (error: any) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      };

      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('connect_error', handleConnectError);

      return () => {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        socketInstance.off('connect_error', handleConnectError);
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    }
  }, [token, user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};