import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../../../styles/Background";
import { fonts } from "../../../styles/globalStyles";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const ChatOnboardingScreen = () => {
    const [phase, setPhase] = useState<"loading" | "fetching">("loading");
    const [message, setMessage] = useState("Initializing...");

    const leftOpacity = useRef(new Animated.Value(1)).current;
    const rightOpacity = useRef(new Animated.Value(0.3)).current;
    const navigation = useNavigation<NavigationProp<any>>();
    useEffect(() => {
        const first = setTimeout(() => {
            setPhase("fetching");
        }, 1000);

        return () => clearTimeout(first);
    }, []);

    useEffect(() => {
        if (phase !== "fetching") return;

        const messages = [
            "Connecting to server...",
            "Fetching chat rooms...",
            "Syncing conversations...",
            "Almost ready...",
        ];

        let index = 0;

        setMessage(messages[0]);

        const messageInterval = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 1300);

        const animation = Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(leftOpacity, {
                        toValue: 0.25,
                        duration: 450,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightOpacity, {
                        toValue: 1,
                        duration: 450,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(leftOpacity, {
                        toValue: 1,
                        duration: 450,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rightOpacity, {
                        toValue: 0.25,
                        duration: 450,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        animation.start();

        const stop = setTimeout(() => {
            animation.stop();
            clearInterval(messageInterval);

            // Navigate or fetch complete here
            console.log("Finished");
            navigation.navigate("ChatStreaming", {
                chatType: "INDIVIDUAL",
                chatId: "3",
                toUserId: "u103",
                title: "Building (Pratham, Nagesh..+6more)",
                subtitle: "Meeting at 6 PM today!!!",
            });
        }, 5000);

        return () => {
            animation.stop();
            clearTimeout(stop);
            clearInterval(messageInterval);
        };
    }, [phase]);

    return (
        <GradientBackground>
            <View style={styles.container}>
                {phase === "loading" ? (
                    <>
                        <ActivityIndicator size="large" color="#9AB17A" />
                        <Text style={styles.text}>Initializing...</Text>
                    </>
                ) : (
                    <>
                        <View style={styles.iconRow}>
                            <Animated.View style={{ opacity: leftOpacity }}>
                                <Ionicons
                                    name="server-outline"
                                    size={42}
                                    color="#9AB17A"
                                />
                            </Animated.View>

                            <Animated.View style={{ opacity: rightOpacity }}>
                                <Ionicons
                                    name="chatbubbles-outline"
                                    size={42}
                                    color="#9AB17A"
                                />
                            </Animated.View>
                        </View>

                        <Text style={styles.text}>{message}</Text>
                    </>
                )}
            </View>
        </GradientBackground>
    );
};

export default ChatOnboardingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    iconRow: {
        flexDirection: "row",
        width: 140,
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    text: {
        color: "white",
        fontSize: 17,
        fontFamily: fonts.Eregular,
        marginTop: 18,
        opacity: 0.9,
    },
});