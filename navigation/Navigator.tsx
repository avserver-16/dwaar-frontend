import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./auth/AuthStack";

const Navigator = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default Navigator;