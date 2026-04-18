import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";

const HomeScreen = () => {
  return (
    <GradientBackground>
      <Header title="Home" showNotification={true} />
      <View style={styles.center}>
       
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#9AB17A",
    textAlign: "center",
  },
});

export default HomeScreen;
