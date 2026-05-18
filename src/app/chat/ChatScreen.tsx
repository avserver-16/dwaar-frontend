import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Chats from "../../Molecules/Chats";

const ChatScreen = () => {
  const navigation = useNavigation<any>();

  const openChat = (title: string) => {
    navigation.navigate("ChatStreaming", {
      chatType: "INDIVIDUAL",
      chatId: title,
      currentUserId: "user_1",
    });
  };

  return (
    <GradientBackground>
      <Header
        title="Inbox"
        showNotification={true}
        showSearch={true}
      />

      <View style={styles.center}>
        <Chats
          title="Delivery Guy - Avish (1)"
          iconName="time-outline"
          subtitle="Hello, how are you?"
          subtitleStyle={styles.subtitle}
          iconColor="white"
          onPress={() =>
            openChat("Delivery Guy - Avish (1)")
          }
        />

        <Chats
          title="Delivery Boy - Gukesh (2)"
          iconName="checkmark-outline"
          subtitle="Hello, how are you?"
          subtitleStyle={styles.subtitle}
          iconColor="white"
          onPress={() =>
            openChat("Delivery Boy - Gukesh (2)")
          }
        />

        <Chats
          title="Delivery Boy - Raghavendra (3)"
          iconName="checkmark-outline"
          subtitle="Hello, how are you?"
          subtitleStyle={styles.subtitle}
          iconColor="white"
          onPress={() =>
            openChat("Delivery Boy - Raghavendra (3)")
          }
        />

        <Chats
          title="Delivery Boy - Somnath (4)"
          iconName="checkmark-outline"
          subtitle="Hello, how are you?"
          subtitleStyle={styles.subtitle}
          iconColor="white"
          onPress={() =>
            openChat("Delivery Boy - Somnath (4)")
          }
        />

        <Chats
          title="Delivery Boy - Kashish (5)"
          iconName="checkmark-outline"
          subtitle="Hello, how are you?"
          subtitleStyle={styles.subtitle}
          iconColor="white"
          onPress={() =>
            openChat("Delivery Boy - Kashish (5)")
          }
        />
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