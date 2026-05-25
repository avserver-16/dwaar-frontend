// App.tsx
import React, { useEffect, useState } from "react";
import Navigator from "./navigation/Navigator";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./src/context/AppContext";
import { SocketProvider } from "./api/socket/SocketProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const App = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    "Epilogue-Bold": require("../dwaar/src/fonts/Epilogue-Bold.ttf"),
    "Epilogue-Extra-Bold": require("../dwaar/src/fonts/Epilogue-ExtraBold.ttf"),
    "Epilogue-Extra-Light": require("../dwaar/src/fonts/Epilogue-ExtraLight.ttf"),
    "Epilogue-Light": require("../dwaar/src/fonts/Epilogue-Light.ttf"),
    "Epilogue-Medium": require("../dwaar/src/fonts/Epilogue-Medium.ttf"),
    "Epilogue-Regular": require("../dwaar/src/fonts/Epilogue-Regular.ttf"),
    "Epilogue-Bold-Italic": require("../dwaar/src/fonts/Epilogue-BoldItalic.ttf"),
    "Epilogue-SemiBold": require("../dwaar/src/fonts/Epilogue-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Read real userId from AsyncStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("authUser");
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUserId(user._id ?? null);
        }
      } catch (err) {
        console.log("Failed to load user from storage:", err);
      }
    };

    loadUser();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* userId=null is fine — SocketProvider won't connect until it's set */}
      <SocketProvider userId={currentUserId}>
        <AppProvider>
          <Navigator />
        </AppProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
};

export default App;