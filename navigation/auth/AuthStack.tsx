import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../../src/auth/GetStarted";
import Register from "../../src/auth/Register";
import Login from "../../src/auth/Login";
import MainTabNavigator from "../../src/app/tabs/MainTabNavigator";
import { getStoredSession } from "../../api/auth";

export type AuthStackParamList = {
  GetStarted: undefined;
  Login: { phone: string; email?: string };
  Register: { phone: string };
  MainTabNavigator: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getStoredSession();
        setIsLoggedIn(!!session);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkSession();
  }, []);

  // Show a spinner while checking AsyncStorage
  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? "MainTabNavigator" : "GetStarted"}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};

export default AuthStack;