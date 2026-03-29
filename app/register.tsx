import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError("");
    const filteredEmail = data.email.trim().toLowerCase();
    const filteredPassword = data.password.trim();

    if (!filteredEmail) {
      setRegisterError("Please enter your email address");
      return;
    }

    if (!filteredPassword) {
      setRegisterError("Please enter a password");
      return;
    }

    const success = await registerUser(filteredEmail, filteredPassword);
    if (success) {
      router.replace("/setup-account");
    } else {
      setRegisterError(
        "This email is already registered. Please use a different email or login.",
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
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
            <ThemedText style={styles.subtitle}>Create your account</ThemedText>
            <ThemedText style={styles.subtitle2}>
              Join the streaming revolution
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: useThemeColor({
                      light: "#f8f9fa",
                      dark: "#1a1a1a",
                      movieVault: "#2a1a4a",
                    }),
                    borderColor: useThemeColor({
                      light: "#E0E0E0",
                      dark: "#444444",
                      movieVault: "#4a2a7a",
                    }),
                    color: useThemeColor({
                      light: "#000000",
                      dark: "#ffffff",
                      movieVault: "#e0e0e0",
                    }),
                  },
                  (errors.email || registerError) && styles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={useThemeColor({
                  light: "#999999",
                  dark: "#888888",
                  movieVault: "#bb86fc",
                })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => {
                  setValue("email", text);
                  setRegisterError("");
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
                      backgroundColor: useThemeColor({
                        light: "#f8f9fa",
                        dark: "#1a1a1a",
                        movieVault: "#2a1a4a",
                      }),
                      borderColor: useThemeColor({
                        light: "#E0E0E0",
                        dark: "#444444",
                        movieVault: "#4a2a7a",
                      }),
                      color: useThemeColor({
                        light: "#000000",
                        dark: "#ffffff",
                        movieVault: "#e0e0e0",
                      }),
                    },
                  ]}
                  placeholder="Create a password"
                  placeholderTextColor={useThemeColor({
                    light: "#999999",
                    dark: "#888888",
                    movieVault: "#bb86fc",
                  })}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => {
                    setValue("password", text);
                    setRegisterError("");
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

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: useThemeColor({
                        light: "#f8f9fa",
                        dark: "#1a1a1a",
                        movieVault: "#2a1a4a",
                      }),
                      borderColor: useThemeColor({
                        light: "#E0E0E0",
                        dark: "#444444",
                        movieVault: "#4a2a7a",
                      }),
                      color: useThemeColor({
                        light: "#000000",
                        dark: "#ffffff",
                        movieVault: "#e0e0e0",
                      }),
                    },
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={useThemeColor({
                    light: "#999999",
                    dark: "#888888",
                    movieVault: "#bb86fc",
                  })}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={(text) => {
                    setValue("confirmPassword", text);
                    setRegisterError("");
                  }}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <ThemedText style={styles.eyeIcon}>
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <ThemedText style={styles.errorText}>
                  {errors.confirmPassword.message}
                </ThemedText>
              ) : null}
            </View>

            {registerError ? (
              <ThemedView style={styles.registerErrorContainer}>
                <ThemedText style={styles.registerErrorText}>
                  {registerError}
                </ThemedText>
              </ThemedView>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: useThemeColor({
                    light: "#007AFF",
                    dark: "#0A84FF",
                    movieVault: "#bb86fc",
                  }),
                },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  Create Account
                </ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Already have an account?{" "}
              </ThemedText>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <ThemedText style={styles.linkText}>Sign In</ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

RegisterScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
    borderRadius: 4,
    borderWidth: 1,
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
  registerErrorContainer: {
    textAlign: "center",
    marginTop: 8,
    padding: 12,
    borderRadius: 4,
  },
  registerErrorText: {
    fontSize: 14,
  },
});
