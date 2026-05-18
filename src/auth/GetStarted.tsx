import { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Pressable,
    Keyboard,
    Image,
    Animated,
    KeyboardEvent,
    Platform,
} from "react-native";
import GradientBackground from "../../styles/Background";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";
import { fonts } from "../../styles/globalStyles";
import { useMutation } from "@tanstack/react-query";
import { checkPhone } from "../../api/auth";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "GetStarted">;

const GetStarted = () => {
    const navigation = useNavigation<NavigationProp>();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    // Animated values
    const imageScale = useRef(new Animated.Value(1)).current;
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const inputTranslateY = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(1)).current;
    const textTranslateY = useRef(new Animated.Value(0)).current;
    const logoBounce = useRef(new Animated.Value(0)).current;

    // Subtle continuous float/bounce
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(logoBounce, {
                    toValue: -10,
                    duration: 1300,
                    useNativeDriver: true,
                }),
                Animated.timing(logoBounce, {
                    toValue: 0,
                    duration: 1300,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const onShow = (e: KeyboardEvent) => {
            const duration = Platform.OS === "ios" ? e.duration || 280 : 220;

            Animated.parallel([
                // Scale down and fade the image
                Animated.timing(imageScale, {
                    toValue: 0.55,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(imageOpacity, {
                    toValue: 0.7,
                    duration,
                    useNativeDriver: true,
                }),
                // Slide input upward
                Animated.timing(inputTranslateY, {
                    toValue: -e.endCoordinates.height * 0.45,
                    duration,
                    useNativeDriver: true,
                }),
                // Fade + slide up the question/sub text
                Animated.timing(textOpacity, {
                    toValue: 0,
                    duration: duration * 0.7,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: -20,
                    duration,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const onHide = (e: KeyboardEvent) => {
            const duration = Platform.OS === "ios" ? e.duration || 280 : 220;

            Animated.parallel([
                Animated.timing(imageScale, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(inputTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const showSub = Keyboard.addListener(showEvent, onShow);
        const hideSub = Keyboard.addListener(hideEvent, onHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: () => checkPhone(phone),
        onSuccess: (data) => {
            if (data.exists) {
                navigation.navigate("Login", { phone, email: data.user.email });
            } else {
                navigation.navigate("Register", { phone });
            }
        },
        onError: () => setError("Something went wrong. Please try again."),
    });

    const isValid = phone.length === 10;

    return (
        <GradientBackground>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>

                    {/* Logo — scales down on keyboard open */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                transform: [
                                    { scale: imageScale },
                                    { translateY: logoBounce },
                                ],
                                opacity: imageOpacity,
                            },
                        ]}
                    >
                        <Image
                            source={require("../../assets/dwaar.png")}
                            style={{ width: 315, height: 300, top: 60 }}
                        />
                    </Animated.View>

                    {/* Question + sub text — fades out on keyboard open */}
                    <Animated.View
                        style={{
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                        }}
                    >
                        <Text style={styles.questionText}>What&apos;s your number?</Text>
                        <Text style={styles.subText}>
                            Your entrance to the local community. We&apos;ll send a code to verify your connection.
                        </Text>
                    </Animated.View>

                    {/* Input — slides up above keyboard */}
                    <Animated.View
                        style={[
                            styles.inputWrapper,
                            { transform: [{ translateY: inputTranslateY }] },
                        ]}
                    >
                        <View style={styles.countryCode}>
                            <Text style={styles.countryCodeText}>+91</Text>
                        </View>
                        <TextInput
                            placeholder="Enter your number"
                            style={[styles.input, error ? styles.inputError : null]}
                            keyboardType="numeric"
                            placeholderTextColor="#9AB17A"
                            maxLength={10}
                            value={phone}
                            onChangeText={(text) => {
                                const cleaned = text.replace(/[^0-9]/g, "");
                                setError("");
                                setPhone(cleaned);
                                if (cleaned.length === 10) {
                                    Keyboard.dismiss();
                                }
                            }}
                        />
                        {phone.length > 0 && (
                            <Text style={styles.counter}>{phone.length}/10</Text>
                        )}
                    </Animated.View>

                    {/* Error message */}
                    {error ? (
                        <View style={styles.errorWrapper}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.footer}>
                        <Text style={styles.termsText}>
                            Please carefully read the Terms & Policy
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                (!isValid || isPending) && styles.nextButtonDisabled,
                            ]}
                            onPress={() => mutate()}
                            disabled={!isValid || isPending}
                            activeOpacity={0.85}
                        >
                            {isPending ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <Text style={styles.nextButtonText}>Next</Text>
                            )}
                        </TouchableOpacity>
                    </View>
            </Pressable>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    logoContainer: {
        marginTop: 20,
        alignItems: "center",
        alignSelf: "center",
        left: 10,
    },
    countryCode: {
        position: "absolute",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#9AB17A",
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        top: 70,
        left: 10,
        zIndex: 1,
    },
    countryCodeText: {
        fontSize: 18,
        fontFamily: fonts.Eregular,
        top: 2,
        right: 2,
    },
    inputWrapper: {
        position: "absolute",
        bottom: 320,
        width: "100%",
    },
    input: {
        width: "100%",
        height: 60,
        borderWidth: 2,
        borderRadius: 100,
        fontSize: 18,
        padding: 16,
        paddingLeft: 80,
        borderColor: "#9AB17A",
        top: 60,
        color: "#9AB17A",
        fontFamily: fonts.Eregular,
    },
    inputError: {
        borderColor: "#e06c6c",
    },
    counter: {
        position: "absolute",
        right: 20,
        top: 80,
        fontSize: 13,
        color: "#9AB17A99",
    },
    errorWrapper: {
        position: "absolute",
        bottom: 290,
        width: "100%",
        alignItems: "center",
    },
    errorText: {
        fontSize: 13,
        color: "#e06c6c",
    },
    footer: {
        position: "absolute",
        bottom: 24,
        width: "100%",
        gap: 12,
    },
    termsText: {
        alignSelf: "center",
        fontSize: 12,
        color: "#9AB17A",
        fontFamily: fonts.Eregular,
    },
    nextButton: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C3CC9B",
        borderRadius: 100,
    },
    nextButtonDisabled: {
        opacity: 0.45,
    },
    nextButtonText: {
        fontSize: 16,
        color: "#000000",
        fontFamily: fonts.Ebold,
    },
    questionText: {
        fontSize: 24,
        color: "#FFFFFF",
        alignSelf: "center",
        marginBottom: 12,
        fontFamily: fonts.Ebold,
        marginTop: 100,
    },
    subText: {
        fontSize: 12,
        color: "#A0A0A0",
        alignSelf: "center",
        marginBottom: 20,
        fontFamily: fonts.Eregular,
        marginTop: 0,
        textAlign: "center",
    },
});

export default GetStarted;