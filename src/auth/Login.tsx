import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView, 
    Platform,
    Keyboard,
    TouchableWithoutFeedback,            
} from "react-native";
import GradientBackground from "../../styles/Background";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";
import type { RootStackParamList } from "../../navigation/types";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth";


type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;



const Login = () => {
    const navigation = useNavigation<NavigationProp>();
    const rootNavigation = navigation.getParent<RootNavigationProp>();

    const route = useRoute<RouteProp<AuthStackParamList, "Login">>();
    const { phone, email: prefillEmail } = route.params;

    const [email, setEmail] = useState(prefillEmail ?? "");

    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);



    const { mutate: signIn, isPending } = useMutation({
        mutationFn: () => loginUser({ phone, email, password }),
        onSuccess: () =>
            rootNavigation?.reset({ index: 0, routes: [{ name: "Main" }] }),
        onError: (err: Error) => {
            console.error(err);
        },
    });

    const maskEmail = (email: string) => {
        if (!email) return "";
        const [local, domain] = email.split("@");
        if (!domain) return email;
        const visible = local.slice(0, 2);           // first 2 chars
        const masked = "*".repeat(Math.max(local.length - 2, 3));
        return `${visible}${masked}@${domain}`;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <GradientBackground>
                <KeyboardAvoidingView  // ← wrap here
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.logoText}>Dwaar</Text>
                            <Text style={styles.subtitle}>Welcome back · +91-{phone}</Text>
                            {/* {prefillEmail ? (
                                <Text style={styles.prefillHint}>
                                    Signing in as {maskEmail(prefillEmail)}
                                </Text>
                            ) : null} */}
                        </View>

                        {/* Form */}
                        <View style={styles.form}>


                            {/* Email */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={[styles.input,{color:"#9ab17a69"}]}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#9AB17A99"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={maskEmail(email)}
                                    onChangeText={setEmail}
                                />
                            </View>

                            {/* Password */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.passwordWrapper}>
                                    <TextInput
                                        style={[styles.input, { paddingRight: 56 }]}
                                        placeholder="••••••••"
                                        placeholderTextColor="#9AB17A99"
                                        secureTextEntry={!showPass}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeBtn}
                                        onPress={() => setShowPass(!showPass)}
                                    >
                                        <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity style={styles.forgotWrapper}>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.termsText}>
                                Please carefully read the Terms & Policy
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    (!email || !password) &&
                                    styles.loginButtonDisabled,
                                ]}
                                activeOpacity={0.85}
                                disabled={isPending || !email || !password}
                                onPress={() => signIn()}
                            >
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => navigation.navigate("Register", { phone })}
                            >
                                <Text style={styles.registerLink}>
                                    Don't have an account?{" "}
                                    <Text style={styles.registerLinkBold}>Register</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </GradientBackground>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        marginTop: 160,
        marginBottom: 48,
    },
    logoText: {
        fontSize: 64,
        fontWeight: "700",
        letterSpacing: -2,
        color:"#9ab17a"
    },
    subtitle: {
        fontSize: 16,
        color: "#9AB17A",
        marginTop: 4,
    },
    form: {
        gap: 16,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9AB17A",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        paddingLeft: 4,
    },
    input: {
        width: "100%",
        height: 56,
        borderWidth: 1.5,
        borderRadius: 100,
        fontSize: 16,
        paddingHorizontal: 20,
        borderColor: "#9AB17A",
        color: "#9AB17A",
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    passwordWrapper: {
        position: "relative",
    },
    eyeBtn: {
        position: "absolute",
        right: 16,
        top: 0,
        height: 56,
        justifyContent: "center",
    },
    eyeIcon: {
        fontSize: 18,
    },
    forgotWrapper: {
        alignSelf: "flex-end",
        paddingRight: 8,
        marginTop: -4,
    },
    forgotText: {
        fontSize: 13,
        color: "#9AB17A",
        fontWeight: "600",
    },
    dropdownTrigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: "#9AB17A99",
    },
    dropdownSelected: {
        fontSize: 16,
        color: "#1a1a1a",
    },
    chevron: {
        fontSize: 11,
        color: "#9AB17A",
    },
    dropdownMenu: {
        borderWidth: 1.5,
        borderColor: "#9AB17A",
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.96)",
        marginTop: 4,
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    dropdownItemActive: {
        backgroundColor: "#C3CC9B33",
    },
    dropdownItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#9AB17A33",
    },
    dropdownItemLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1a1a1a",
    },
    dropdownItemSub: {
        fontSize: 12,
        color: "#9AB17A",
        marginTop: 1,
    },
    footer: {
        marginTop: 40,
        gap: 12,
    },
    termsText: {
        alignSelf: "center",
        fontSize: 12,
        color: "#9AB17A",
        textAlign: "center",
    },
    loginButton: {
        width: "100%",
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C3CC9B",
        borderRadius: 100,
    },
    loginButtonDisabled: {
        opacity: 0.45,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000",
    },
    registerLink: {
        alignSelf: "center",
        fontSize: 13,
        color: "#9AB17A",
    },
    registerLinkBold: {
        fontWeight: "700",
        color: "#6a8a4a",
    },
    prefillHint: {
        fontSize: 13,
        color: "#9AB17A99",
        marginTop: 4,
        fontStyle: "italic",
    },
});

export default Login;