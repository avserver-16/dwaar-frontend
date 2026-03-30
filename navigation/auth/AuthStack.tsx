import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStarted from "../../src/auth/GetStarted";
import Register from "../../src/auth/Register";


export type AuthStackParamList = {
  GetStarted: undefined;
  Register: undefined;
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
    </Stack.Navigator>
  );
};

export default AuthStack;