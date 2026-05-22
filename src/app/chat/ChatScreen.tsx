// ChatScreen.tsx
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Chats from "../../Molecules/Chats";

// ─── Simulated current user ───────────────────────────────────────────────────
// Replace with your real auth (AsyncStorage, context, zustand, etc.)
const CURRENT_USER_ID =
  Platform.OS === "web"
    ? new URLSearchParams(window.location.search).get("userId") ?? "user_1"
    : "user_1";

// ─── Chat directory ───────────────────────────────────────────────────────────
// Each entry maps a display title → a stable chatId and a toUserId.
// chatId   : the room/conversation identifier your backend uses
// toUserId : the OTHER person's userId (needed for private socket events)
const CHATS = [
  {
    title: "Delivery Guy - Avish",
    chatId: "6a108e2d02739e86e3427c1a",
    toUserId: "6a108e9702739e86e3427c1b",
    iconName: "time-outline" as const,
  },
  {
    title: "Delivery Boy - Gukesh",
    chatId: "chat_gukesh",
    toUserId: "user_gukesh",
    iconName: "checkmark-outline" as const,
  },
  {
    title: "Delivery Boy - Raghavendra",
    chatId: "chat_raghavendra",
    toUserId: "user_raghavendra",
    iconName: "checkmark-outline" as const,
  },
  {
    title: "Delivery Boy - Somnath",
    chatId: "chat_somnath",
    toUserId: "user_somnath",
    iconName: "checkmark-outline" as const,
  },
  {
    title: "Delivery Boy - Kashish",
    chatId: "6a108e9702739e86e3427c1b",
    toUserId: "6a108e2d02739e86e3427c1a",
    iconName: "checkmark-outline" as const,
  },
];

const ChatScreen = () => {
  const navigation = useNavigation<any>();

  const openChat = (chatId: string, toUserId: string) => {
    navigation.navigate("ChatStreaming", {
      chatType: "INDIVIDUAL",
      chatId,
      currentUserId: CURRENT_USER_ID,
      toUserId,           // ← now passed correctly
    });
  };

  return (
    <GradientBackground>
      <Header title="Inbox" showNotification={true} showSearch={true} />

      <View style={styles.center}>
        {CHATS.map((chat) => (
          <Chats
            key={chat.chatId}
            title={chat.title}
            iconName={chat.iconName}
            subtitle="Hello, how are you?"
            subtitleStyle={styles.subtitle}
            iconColor="white"
            onPress={() => openChat(chat.chatId, chat.toUserId)}
          />
        ))}
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    paddingHorizontal: 4,
    marginTop: 64,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#9AB17A",
    left: 48,
    top: -16,
  },
});

export default ChatScreen;