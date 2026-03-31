import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
} from "react-native";
import GradientBackground from "../../styles/Background";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/auth/AuthStack";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">;

const ROLES = [
  { id: "resident", label: "Resident", sub: "Homeowner / Tenant" },
  { id: "courier", label: "Courier", sub: "Delivery Personnel" },
  { id: "guardian", label: "Guardian", sub: "Security / Watchman" },
];

const Register = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const selectedRoleObj = ROLES.find((r) => r.id === selectedRole);
  const route = useRoute<RouteProp<AuthStackParamList, "Login">>();
  const { phone } = route.params;
  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>Dwaar</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="@yourname"
              placeholderTextColor="#9AB17A99"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
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

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 56 }]}
                placeholder="••••••••"
                placeholderTextColor="#9AB17A99"
                secureTextEntry={!showConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPass ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

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
                  selectedRoleObj ? styles.dropdownSelected : styles.dropdownPlaceholder
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
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By registering, you agree to our Terms & Policy
          </Text>
          <TouchableOpacity
            style={[
              styles.registerButton,
              (!email || !username || !password || !confirmPassword || !selectedRole) &&
              styles.registerButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={
              !email || !username || !password || !confirmPassword || !selectedRole
            }
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>
              Already have an account?{" "}
              <Text style={styles.loginLinkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 64,
    marginBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#6a8a4a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 18,
    color: "#6a8a4a",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
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
  errorText: {
    fontSize: 11,
    color: "#e06c6c",
    paddingLeft: 16,
    marginTop: 2,
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
    backgroundColor: "#9AB17A",
    marginTop: 4,
    paddingVertical: 8
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  dropdownItemActive: {
    // backgroundColor: "#C3CC9B33",
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginHorizontal: 12
  },
  dropdownItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  dropdownItemSub: {
    fontSize: 12,
    color: "#000000",
    marginTop: 1,
  },
  footer: {
    marginTop: 32,
    gap: 12,
  },
  termsText: {
    alignSelf: "center",
    fontSize: 12,
    color: "#9AB17A",
    textAlign: "center",
  },
  registerButton: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C3CC9B",
    borderRadius: 100,
  },
  registerButtonDisabled: {
    opacity: 0.45,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  loginLink: {
    alignSelf: "center",
    fontSize: 13,
    color: "#9AB17A",
  },
  loginLinkBold: {
    fontWeight: "700",
    color: "#6a8a4a",
  },
});

export default Register;