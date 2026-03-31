import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    KeyboardAvoidingView, // ← add this
    Platform,
    Keyboard,
    TouchableWithoutFeedbackBase,
    TouchableWithoutFeedback,             // ← add this
} from "react-native";
import GradientBackground from "../../styles/Background";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";


type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

const ROLES = [
    { id: "resident", label: "🏠 Resident", sub: "Homeowner / Tenant" },
    { id: "courier", label: "📦 Courier", sub: "Delivery Personnel" },
    { id: "guardian", label: "🛡️ Guardian", sub: "Security / Watchman" },
];

const Login = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<AuthStackParamList, "Login">>();
    const { phone } = route.params;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const selectedRoleObj = ROLES.find((r) => r.id === selectedRole);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <GradientBackground>
                <KeyboardAvoidingView  // ← wrap here
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"} // ← ios needs "padding", android "height"
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
                            <Text style={styles.subtitle}>Welcome back · +91 {phone}</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Role Dropdown */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>I am a...</Text>
                                <TouchableOpacity
                                    style={[styles.input, styles.dropdownTrigger]}
                                    onPress={() => setDropdownOpen(!dropdownOpen)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={
                                            selectedRoleObj
                                                ? styles.dropdownSelected
                                                : styles.dropdownPlaceholder
                                        }
                                    >
                                        {selectedRoleObj ? selectedRoleObj.label : "Select your role"}
                                    </Text>
                                    <Text style={styles.chevron}>{dropdownOpen ? "▲" : "▼"}</Text>
                                </TouchableOpacity>

                                {dropdownOpen && (
                                    <View style={styles.dropdownMenu}>
                                        {ROLES.map((role, idx) => (
                                            <TouchableOpacity
                                                key={role.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    selectedRole === role.id && styles.dropdownItemActive,
                                                    idx < ROLES.length - 1 && styles.dropdownItemBorder,
                                                ]}
                                                onPress={() => {
                                                    setSelectedRole(role.id);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownItemLabel}>{role.label}</Text>
                                                <Text style={styles.dropdownItemSub}>{role.sub}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Email */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#9AB17A99"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
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
                                    (!email || !password || !selectedRole) &&
                                    styles.loginButtonDisabled,
                                ]}
                                activeOpacity={0.85}
                                disabled={!email || !password || !selectedRole}
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
                </KeyboardAvoidingView> {/* ← close here */}
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
        color: "#1a1a1a",
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
});

export default Login;