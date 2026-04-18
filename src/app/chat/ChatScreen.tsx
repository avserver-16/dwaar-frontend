import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Chats from "../../Molecules/Chats";

const ChatScreen = () => {
  return (
    <GradientBackground>
      <Header title="Inbox" showNotification={true} showSearch={true} />
      <View style={styles.center}>
       <Chats title="Delivery Guy - Avish (1)" iconName="time-outline" subtitle="Hello, how are you?" subtitleStyle={styles.subtitle} />
       <Chats title="Delivery Boy - Gukesh (2)" iconName="checkmark-outline" subtitle="Hello, how are you?" subtitleStyle={styles.subtitle} />
       <Chats title="Delivery Boy - Raghavendra (3)" iconName="checkmark-outline" subtitle="Hello, how are you?" subtitleStyle={styles.subtitle} />
       <Chats title="Delivery Boy - Somnath (4)" iconName="checkmark-outline" subtitle="Hello, how are you?" subtitleStyle={styles.subtitle} />
       <Chats title="Delivery Boy - Kashish (5)" iconName="checkmark-outline" subtitle="Hello, how are you?" subtitleStyle={styles.subtitle} />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    // flex: 1,
    paddingHorizontal: 4,
    marginTop:64,
    alignItems: "center",

  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    // marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#9AB17A",
    // textAlign: "center",
    left:48,
    top:-16
  },
});

export default ChatScreen;
