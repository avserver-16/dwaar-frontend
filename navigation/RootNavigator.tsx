import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./auth/AuthStack";
import MainTabNavigator from "../src/app/tabs/MainTabNavigator";
import type { RootStackParamList } from "./types";
import ChatStreaming from "../src/app/chat/ChatStreaming";
import ChatOnboardingScreen from "../src/app/chat/ChatOnboardingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="ChatStreaming" component={ChatStreaming} />
      <Stack.Screen name="ChatOnboarding" component={ChatOnboardingScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
