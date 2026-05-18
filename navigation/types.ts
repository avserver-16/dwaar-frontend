import type { AuthStackParamList } from "./auth/AuthStack";

export type { AuthStackParamList };

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChatStreaming: {
    chatType: "INDIVIDUAL" | "GROUP";
    chatId: string;
    currentUserId: string;
  };
};

