import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import GradientBackground from "../../../styles/Background";
import Header from "../../Molecules/Header";
import Options from "../../Molecules/Options";
import { logoutUser } from "../../../api/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fonts } from "../../../styles/globalStyles";
import AccountSettings from "../../Molecules/AccountSettings";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<
    "profile" | "account"
  >("profile");

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("authUser");
      setUser(JSON.parse(user || "{}"));
    };

    fetchUser();
  }, []);

  const renderContent = () => {
    switch (selectedScreen) {
      case "account":
        return (
          <View style={{ width: "100%", marginTop: 40 }}>
            <AccountSettings
              username={user?.name || "N/A"}
              email={user?.email || "N/A"}
            />
          </View>
        );

      default:
        return (
          <>
            <View style={styles.profileContainer}>
              <Image
                source={{
                  uri: "https://www.shutterstock.com/image-vector/pixel-art-hacker-laptop-8-260nw-2709309517.jpg",
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                }}
                resizeMode="cover"
              />
            </View>

            <Text
              style={[
                styles.subtitle,
                {
                  fontFamily: fonts.Ebold,
                  fontSize: 24,
                  marginBottom: 4,
                },
              ]}
            >
              {user?.name || "N/A"}
            </Text>

            <Text
              style={[
                styles.title,
                {
                  fontFamily: fonts.Eregular,
                  fontSize: 12,
                  marginBottom: 32,
                },
              ]}
            >
              {user?.email || "N/A"}
            </Text>

            <Options
              title="Account Settings"
              iconName="chevron-forward-outline"
              iconColor="#9AB17A"
              onPress={() => setSelectedScreen("account")}
            />

            <Options
              title="Logout"
              iconName="chevron-forward-outline"
              iconColor="#9AB17A"
              onPress={async () => {
                await logoutUser();

                await AsyncStorage.removeItem("authToken");
                await AsyncStorage.removeItem("refreshToken");
                await AsyncStorage.removeItem("authUser");

                navigation.reset({
                  index: 0,
                  routes: [{ name: "Auth" as never }],
                });
              }}
            />
          </>
        );
    }
  };

  return (
    <GradientBackground>
      <Header
        title={
          selectedScreen === "account"
            ? "Account Settings"
            : "Profile"
        }
        showNotification={true}
        // showSearch={true}
        showMenu={selectedScreen === "profile"}
        showBack={selectedScreen === "account" ? true : false}
        onBackPress={() => setSelectedScreen("profile")}
      />

      <View style={styles.center}>{renderContent()}</View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 64,
    width: "100%",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#c3cc9b60",
    marginBottom: 8,
    fontFamily: fonts.Ebold,
  },

  subtitle: {
    fontSize: 15,
    color: "#9AB17A",
    textAlign: "center",
    fontFamily: fonts.Eregular,
  },

  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 110,
    width: 110,
    borderRadius: 100,
    backgroundColor: "#C3CC9B",
    marginBottom: 18,
    overflow: "hidden",
  },
});

export default ProfileScreen;