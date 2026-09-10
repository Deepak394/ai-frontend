import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hook/AuthHook";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticating } = useAuth();

  async function handleLogin() {
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const isDisabled = isAuthenticating || !email || !password;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8a8a8e"
              style={styles.leftIcon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9a9a9e"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!isAuthenticating}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#8a8a8e"
              style={styles.leftIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9a9a9e"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isAuthenticating}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.rightIcon}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#8a8a8e"
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#d33" />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.loginButton, isDisabled && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isDisabled}
            activeOpacity={0.8}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerLink}
            disabled={isAuthenticating}
          >
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b6b6b",
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
  leftIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#1a1a1a",
  },
  rightIcon: {
    position: "absolute",
    right: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdeaea",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    gap: 6,
  },
  error: {
    color: "#d33",
    fontSize: 13,
    flexShrink: 1,
  },
  loginButton: {
    backgroundColor: "#2f6fed",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: "#2f6fed",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#a9c2f5",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#6b6b6b",
  },
  registerTextBold: {
    color: "#2f6fed",
    fontWeight: "600",
  },
});