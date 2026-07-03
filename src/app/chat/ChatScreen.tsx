// ChatScreen.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Chats from "../../Molecules/Chats";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../../../styles/globalStyles";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    phone?: string;
  }[];
  lastMessage?: {
    message: string;
    createdAt: string;
  };
}

interface ChatItem {
  chatId: string;
  toUserId: string;
  title: string;
  subtitle: string;
}

// ─── API helper ───────────────────────────────────────────────────────────────

async function fetchConversations(userId: string, token: string): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/conversations/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  console.log("Response:", res);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

// ─── Component ────────────────────────────────────────────────────────────────

const ChatScreen = () => {
  const navigation = useNavigation<any>();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       // 1. Read session from AsyncStorage
  //       const token = await AsyncStorage.getItem("authToken");
  //       const userStr = await AsyncStorage.getItem("authUser");

  //       if (!token || !userStr) {
  //         setError("Not logged in");
  //         return;
  //       }

  //       const user = JSON.parse(userStr);
  //       const userId: string = user._id;
  //       setCurrentUserId(userId);

  //       // 2. Fetch conversations
  //       const conversations = await fetchConversations(userId, token);

  //       // 3. Shape into chat items — filter out self, use the other participant
  //       const shaped: ChatItem[] = conversations.map((conv) => {
  //         const other = conv.participants.find((p) => p._id !== userId);

  //         return {
  //           chatId: conv._id,           // conversation/room id
  //           toUserId: other?._id ?? "", // the other person's userId
  //           title: other?.name ?? "Unknown",
  //           subtitle: conv.lastMessage?.message ?? "Say hello!",
  //         };
  //       });

  //       setChats(shaped);
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load chats");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   load();
  // }, []);
  useEffect(() => {
  // Simulate logged-in user
  setCurrentUserId("user123");

  const dummyChats: ChatItem[] = [
    {
      chatId: "1",
      toUserId: "u101",
      title: "Dhruv Kotian",
      subtitle: "chal bhai niche hu!!!!",
    },
    {
      chatId: "2",
      toUserId: "u102",
      title: "Samiksha Patil",
      subtitle: "Ha dhruv aur me just niklenge",
    },
    {
      chatId: "3",
      toUserId: "u103",
      title: "Building (Pratham, Nagesh..+6more)",
      subtitle: "Meeting at 6 PM today!!!",
    },
    {
      chatId: "4",
      toUserId: "u104",
      title: "Sri",
      subtitle: "Confirm Hogaya, wo aayenge bole",
    },
    {
      chatId: "5",
      toUserId: "u105",
      title: "Tester",
      subtitle: "Test it",
    },
  ];

  setChats(dummyChats);
  setLoading(false);
}, []);

  const openChat = (chatId: string, toUserId: string) => {
    if (!currentUserId) return;
    navigation.navigate("ChatStreaming", {
      chatType: "INDIVIDUAL",
      chatId,
      currentUserId,
      toUserId,
    });
  };

  return (
    <GradientBackground>
      <Header title="Inbox" showNotification />

      <View style={styles.center}>
        {loading && <ActivityIndicator color="#9ab17a" style={{ marginTop: 40 }} />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !error && chats.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="white" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>
              No Chats Yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Start a conversation and your chats will appear here.
            </Text>
          </View>
        )}

        {!loading && !error && chats.length > 0 && chats.map((chat) => (
          <Chats
            key={chat.chatId}
            title={chat.title}
            iconName="chatbubble-outline"
            subtitle={chat.subtitle}
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
    marginTop: 24,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#9AB17A",
    left: 48,
    top: -16,
  },
  errorText: {
    color: "rgba(255,255,255,0.5)",
    marginTop: 40,
    fontSize: 14,
  },
  emptyContainer: {
  marginTop: 120,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 30,
},

emptyIcon: {
  fontSize: 54,
  marginBottom: 16,
},

emptyTitle: {
  color: "white",
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 8,
  fontFamily: fonts.Ebold,
},

emptySubtitle: {
  color: "rgba(255,255,255,0.5)",
  textAlign: "center",
  lineHeight: 22,
  fontSize: 14,
  fontFamily: fonts.Eregular,
},
});

export default ChatScreen;