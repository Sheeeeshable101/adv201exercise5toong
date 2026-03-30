import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");
    const filteredEmail = data.email.trim().toLowerCase();
    const filteredPassword = data.password.trim();

    if (!filteredEmail) {
      setLoginError("Please enter your email address");
      return;
    }

    if (!filteredPassword) {
      setLoginError("Please enter your password");
      return;
    }

    const success = await login(filteredEmail, filteredPassword);
    if (success) {
      router.replace("/(tabs)");
    } else {
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <ThemedText style={styles.logoText}>Movie</ThemedText>
              <ThemedText style={styles.logoAccent}>Vault</ThemedText>
            </View>
            <ThemedText style={styles.subtitle} type="subtitle">
              Welcome back!
            </ThemedText>
            <ThemedText style={styles.subtitle2}>
              Sign in to continue watching
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: useThemeColor({}, "border"),
                  },
                  (errors.email || loginError) && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={useThemeColor({}, "placeholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setValue("email", text);
                  setLoginError("");
                }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email ? (
                <ThemedText style={styles.errorText}>
                  {errors.email.message}
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: useThemeColor({}, "inputBg"),
                      borderColor: useThemeColor({}, "inputBorder"),
                      color: "#ffffff",
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={useThemeColor({}, "placeholder")}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => {
                    setValue("password", text);
                    setLoginError("");
                  }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <ThemedText style={styles.eyeIcon}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <ThemedText style={styles.errorText}>
                  {errors.password.message}
                </ThemedText>
              ) : null}
            </View>

            {loginError ? (
              <ThemedView style={styles.loginErrorText}>
                <ThemedText style={styles.errorText}>{loginError}</ThemedText>
              </ThemedView>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: useThemeColor({}, "primary"),
                },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Don't have an account?{" "}
              </ThemedText>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.linkText}>Sign Up</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

LoginScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  logoAccent: {
    fontSize: 36,
    fontWeight: "300",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle2: {
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    height: 50,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  loginErrorText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 4,
  },
});
