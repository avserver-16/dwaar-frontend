import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import GradientBackground from "../../styles/Background";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "GetStarted"
>;

const GetStarted = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Dwaar</Text>
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.countryCode}>
                        <Text style={styles.countryCodeText}>+91</Text>
                    </View>
                    <TextInput
                        placeholder="Enter your number"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholderTextColor="#9AB17A"
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.termsText}>
                        Please carefully read the Terms & Policy
                    </Text>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    logoContainer: {
        marginTop: 200,
        alignItems: "center",
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
        top: 10,
        left: 10,
        zIndex: 1,
    },
    countryCodeText: {
        fontSize: 18,
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
    },
    nextButton: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C3CC9B",
        borderRadius: 100,
    },
    nextButtonText: {
        fontSize: 16,
        color: "#000000",
    },
});

export default GetStarted;