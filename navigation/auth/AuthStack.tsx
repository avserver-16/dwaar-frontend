import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../../src/auth/GetStarted";
import Register from "../../src/auth/Register";
import Login from "../../src/auth/Login";
import MainTabNavigator from "../../src/app/tabs/MainTabNavigator";


export type AuthStackParamList = {
  GetStarted: undefined;
  Login: { phone: string };
  Register: { phone: string };
  MainTabNavigator: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="GetStarted"
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