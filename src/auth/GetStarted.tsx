import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
} from "react-native";
import GradientBackground from "../../styles/Background";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";
import MainTabNavigator from "../app/tabs/MainTabNavigator";
import { fonts } from "../../styles/globalStyles";


type NavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "GetStarted"
>;


// const checkPhoneExists = async (phone: string): Promise<boolean> => {
//     return true
//     try {
//         const response = await fetch("https://your-api.com/auth/check-phone", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ phone: `+91${phone}` }),
//         });
//         const data = await response.json();
//         return data.exists; // expects { exists: true | false }
//     } catch (error) {
//         console.error("Phone check failed:", error);
//         throw error;
//     }
// };

const GetStarted = () => {
    const navigation = useNavigation<NavigationProp>();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isValid = phone.length === 10;

    const handleNext = async () => {
        navigation.navigate("MainTabNavigator");
        // if (!isValid) return;
        // setError("");
        // setLoading(true);

        // try {
        //     const exists = await checkPhoneExists(phone);
        //     if (exists) {
        //         navigation.navigate("Login", { phone });
        //     } else {
        //         navigation.navigate("Register", { phone });
        //     }
        // } catch {
        //     setError("Something went wrong. Please try again.");
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <GradientBackground>
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image source={require("../../assets/dwaar.png")} style={{ width: 315, height: 300, top: 60, }} />
                    </View>
                    <Text style={styles.questionText}>What's your number?</Text>
                    <Text style={styles.subText}>Your entrance to the local community. We'll
                        send a code to verify your connection.</Text>
                    <View style={styles.inputWrapper}>
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
                        {/* Character counter */}
                        {phone.length > 0 && (
                            <Text style={styles.counter}>{phone.length}/10</Text>
                        )}
                    </View>

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
                                (!isValid || loading) && styles.nextButtonDisabled,
                            ]}
                            onPress={handleNext}
                            disabled={!isValid || loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" size="small" />
                            ) : (
                                <Text style={styles.nextButtonText}>Next</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </GradientBackground>
        </TouchableWithoutFeedback>
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
        left: 10
    },
    logoText: {
        fontSize: 64,
    },
    inputWrapper: {
        position: "absolute",
        bottom: 320,
        width: "100%",
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
        top:2,
        right:2
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
        top:60,
        color:"#9AB17A",
        fontFamily:fonts.Eregular
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
        fontFamily: fonts.Eregular
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
        fontFamily: fonts.Ebold
    },
    questionText: {
        fontSize: 24,
        color: "#FFFFFF",
        alignSelf: "center",
        marginBottom: 12,
        fontFamily: fonts.Ebold,
        marginTop: 100
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