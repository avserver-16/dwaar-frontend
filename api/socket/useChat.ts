// hooks/useChat.ts
import { useEffect, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { useSocket } from "../socket/SocketProvider";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  content: string;
  fileName?: string;
  thumbnail?: string;
  createdAt: string;
  isPrivate?: boolean;
}

// ─── API helpers (swap with your actual API client) ──────────────────────────

const API_BASE = "http://localhost:5000/api"; // ← replace

async function fetchRoomMessages(roomId: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/messages/rooms/${roomId}`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

async function fetchPrivateMessages(
  userId: string,
  toUserId: string
): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/messages/private/${toUserId}`, {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error("Failed to fetch private messages");
  return res.json();
}

// ─── useRoomChat ─────────────────────────────────────────────────────────────

export function useRoomChat(roomId: string, currentUserId: string) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const queryKey = ["messages", "room", roomId];

  // 1. Fetch message history from REST
  const query = useQuery<Message[]>({
    queryKey,
    queryFn: () => fetchRoomMessages(roomId),
    staleTime: 30_000,
    retry: false,
  });

  // 2. Join room + listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", roomId);

    const handleMessage = (data: {
      _id: string;
      message: string;
      sender: { id: string; name: string };
      timestamp: string;
      isPrivate: boolean;
    }) => {
      const incoming: Message = {
        id: data._id,
        senderId: data.sender.id,
        type: "TEXT",
        content: data.message,
        createdAt: data.timestamp,
        isPrivate: data.isPrivate,
      };

      // Append to the cached list without a full refetch
      queryClient.setQueryData<Message[]>(queryKey, (prev = []) => [
        ...prev,
        incoming,
      ]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.emit("leave_room", roomId);
      socket.off("receive_message", handleMessage);
    };
  }, [socket, roomId]);

  // 3. Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (payload: {
      content: string;
      type: Message["type"];
      fileName?: string;
      thumbnail?: string;
    }) => {
      console.log("Sending message:", payload);
      if (!socket) throw new Error("Socket not connected");

      // Optimistic update
      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        senderId: currentUserId,
        type: payload.type,
        content: payload.content,
        fileName: payload.fileName,
        thumbnail: payload.thumbnail,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(queryKey, (prev = []) => [
        ...prev,
        optimistic,
      ]);

      // Emit to socket — server will broadcast back via receive_message
      socket.emit("send_message", {
        roomId,
        message: payload.content,
        sender: { id: currentUserId },
      });

      return optimistic;
    },
    onError: () => {
      // Roll back optimistic update on error
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { ...query, sendMessage };
}

// ─── usePrivateChat ───────────────────────────────────────────────────────────

export function usePrivateChat(currentUserId: string, toUserId: string) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const queryKey = ["messages", "private", currentUserId, toUserId];

  // 1. Fetch history
  const query = useQuery<Message[]>({
    queryKey,
    queryFn: () => fetchPrivateMessages(currentUserId, toUserId),
    staleTime: 30_000,
  });

  // 2. Listen for incoming private messages
  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (data: {
      _id: string;
      message: string;
      sender: { id: string };
      toUserId: string;
      timestamp: string;
      isPrivate: boolean;
    }) => {
      // Only update this conversation's cache
      if (data.sender.id === currentUserId) return;

      if (data.sender.id !== toUserId) return;

      const incoming: Message = {
        id: data._id,
        senderId: data.sender.id,
        type: "TEXT",
        content: data.message,
        createdAt: data.timestamp,
        isPrivate: true,
      };

      queryClient.setQueryData<Message[]>(queryKey, (prev = []) => [
        ...prev,
        incoming,
      ]);
    };

    socket.on("receive_private_message", handlePrivateMessage);
    return () => {
      socket.off("receive_private_message", handlePrivateMessage);
    };
  }, [socket, currentUserId, toUserId]);

  // 3. Send private message
  const sendMessage = useMutation({
    mutationFn: async (payload: {
      content: string;
      type: Message["type"];
      fileName?: string;
      thumbnail?: string;
    }) => {
      console.log("Sending private message:", payload,socket);
      if (!socket) throw new Error("Socket not connected");

      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        senderId: currentUserId,
        type: payload.type,
        content: payload.content,
        fileName: payload.fileName,
        thumbnail: payload.thumbnail,
        createdAt: new Date().toISOString(),
        isPrivate: true,
      };

      queryClient.setQueryData<Message[]>(queryKey, (prev = []) => [
        ...prev,
        optimistic,
      ]);

      socket.emit("send_private_message", {
        toUserId,
        message: payload.content,
        sender: { id: currentUserId },
      });

      return optimistic;
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { ...query, sendMessage };
}

// ─── useTypingIndicator ───────────────────────────────────────────────────────

export function useTypingIndicator(toUserId: string, fromUserId: string) {
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handle = (data: { fromUserId: string; isTyping: boolean }) => {
      if (data.fromUserId === toUserId) setIsTyping(data.isTyping);
    };

    socket.on("private_typing", handle);
    return () => {
      socket.off("private_typing", handle);
    };
  }, [socket, toUserId]);

  const emitTyping = (typing: boolean) => {
    socket?.emit("private_typing", { toUserId, fromUserId, isTyping: typing });
  };

  return { isTyping, emitTyping };
}

// ─── useOnlineUsers ───────────────────────────────────────────────────────────

export function useOnlineUsers() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_online_users");

    socket.on("online_users", (userIds: string[]) => {
      queryClient.setQueryData(["onlineUsers"], userIds);
    });

    socket.on("user_offline", ({ userId }: { userId: string }) => {
      queryClient.setQueryData<string[]>(["onlineUsers"], (prev = []) =>
        prev.filter((id) => id !== userId)
      );
    });

    return () => {
      socket.off("online_users");
      socket.off("user_offline");
    };
  }, [socket]);

  return useQuery<string[]>({
    queryKey: ["onlineUsers"],
    queryFn: () => [],       // seeded by socket events above
    staleTime: Infinity,
    initialData: [],
  });
}

