import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    getStoredSession,
} from "../../api/auth";

import {
    getCurrentLocation,
    UserLocation,
} from "./Geolocation";

import {
    addUserLocation,
} from "../../api/location";

interface AppContextType {
    isFirstLaunch: boolean | null;
    isLoggedIn: boolean;
    loading: boolean;
    location: UserLocation | null;

    completeOnboarding: () => Promise<void>;
    login: () => void;
    logout: () => Promise<void>;
}

const AppContext = createContext<
    AppContextType | undefined
>(undefined);

export const AppProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isFirstLaunch, setIsFirstLaunch] =
        useState<boolean | null>(null);

    const [isLoggedIn, setIsLoggedIn] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [location, setLocation] =
        useState<UserLocation | null>(null);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            /*
              FIRST OPEN
            */
            const hasOpened =
                await AsyncStorage.getItem(
                    "hasOpened"
                );

            setIsFirstLaunch(
                hasOpened === null
            );

            /*
              SESSION
            */
            const session =
                await getStoredSession();

            setIsLoggedIn(!!session);

            /*
              LOCATION
            */
            const userLocation =
                await getCurrentLocation();

            if (userLocation) {
                /*
                  STORE IN CONTEXT
                */
                setLocation(userLocation);

                console.log(
                    "Current User Location:",
                    userLocation
                );

                /*
                  FEED TO DATABASE
                */
                if (session?.token) {
                    await addUserLocation(
                        userLocation
                    );

                    console.log(
                        "Location synced to backend"
                    );
                }
            }
        } catch (error) {
            console.log(
                "App initialization error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    /*
      MARK ONBOARDING COMPLETE
    */
    const completeOnboarding =
        async () => {
            await AsyncStorage.setItem(
                "hasOpened",
                "true"
            );

            setIsFirstLaunch(false);
        };

    /*
      LOGIN STATE
    */
    const login = () => {
        setIsLoggedIn(true);
    };

    /*
      LOGOUT STATE
    */
    const logout = async () => {
        await AsyncStorage.removeItem(
            "authToken"
        );

        await AsyncStorage.removeItem(
            "authUser"
        );

        await AsyncStorage.removeItem(
            "refreshToken"
        );

        setIsLoggedIn(false);
    };

    return (
        <AppContext.Provider
            value={{
                isFirstLaunch,
                isLoggedIn,
                loading,
                location,
                completeOnboarding,
                login,
                logout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(
        AppContext
    );

    if (!context) {
        throw new Error(
            "useApp must be used inside AppProvider"
        );
    }

    return context;
};