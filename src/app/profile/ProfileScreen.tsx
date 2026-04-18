import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Options from "../../Molecules/Options";

const ProfileScreen = () => {
  return (
    <GradientBackground>
      <Header title="Profile" showNotification={true} showSearch={true} />
      <View style={styles.center}>
        <View style={styles.profileContainer}></View>
        <Options title="Account Settings" iconName="chevron-forward-outline" />
        <Options title="Privacy Policy" iconName="chevron-forward-outline" />
        <Options title="Help & Support" iconName="chevron-forward-outline" />
        <Options title="Logout" iconName="chevron-forward-outline" />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop:64
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
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: "#C3CC9B",
    marginBottom:48
  },
});

export default ProfileScreen;
