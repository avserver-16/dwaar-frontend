import React, { useEffect } from "react";
import Navigator from "./navigation/Navigator";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./src/context/AppContext";

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
const App = () => {
  const [fontsLoaded] = useFonts({
    "Epilogue-Bold": require('../dwaar/src/fonts/Epilogue-Bold.ttf'),
    "Epilogue-Extra-Bold": require('../dwaar/src/fonts/Epilogue-ExtraBold.ttf'),
    "Epilogue-Extra-Light": require('../dwaar/src/fonts/Epilogue-ExtraLight.ttf'),
    "Epilogue-Light": require('../dwaar/src/fonts/Epilogue-Light.ttf'),
    "Epilogue-Medium": require('../dwaar/src/fonts/Epilogue-Medium.ttf'),
    "Epilogue-Regular": require('../dwaar/src/fonts/Epilogue-Regular.ttf'),
    "Epilogue-Bold-Italic": require('../dwaar/src/fonts/Epilogue-BoldItalic.ttf'),
    "Epilogue-SemiBold": require('../dwaar/src/fonts/Epilogue-SemiBold.ttf'),



  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash visible
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Navigator />
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;