import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const [state, dispatch] = useTheme();
  const theme = state.theme;
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [loadingAnim] = useState(new Animated.Value(0));

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

  const themeText =
    theme === "light"
      ? "☀️ Light"
      : theme === "dark"
        ? "🌙 Dark"
        : "🎬 MovieVault";

  useEffect(() => {
    Animated.loop(
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      loadingAnim.stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (!user.isSetupComplete) {
          router.replace("/setup-account");
        } else {
          router.replace("/(tabs)");
        }
      }
    }
  }, [user, isLoading, router]);

  const spin = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <ThemedText style={styles.loadingLogoText}>Movie</ThemedText>
          <ThemedText style={styles.loadingLogoAccent}>Vault</ThemedText>
        </View>
        <Animated.View
          style={[styles.loadingSpinner, { transform: [{ rotate: spin }] }]}
        >
          <View style={styles.spinnerInner} />
        </Animated.View>
        <ThemedText style={styles.loadingText}>
          Loading your experience...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <ThemedText style={styles.themeToggleText}>{themeText}</ThemedText>
      </TouchableOpacity>
      <ThemedView style={styles.backgroundGradient}>
        <View style={styles.logoSection}>
          <ThemedText style={styles.logoText}>Movie</ThemedText>
          <ThemedText style={styles.logoAccent}>Vault</ThemedText>
        </View>

        <ThemedText style={styles.tagline}>
          Unlimited movies, TV shows, and more.
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Watch anywhere. Cancel anytime.
        </ThemedText>
      </ThemedView>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/login")}
        >
          <ThemedText style={styles.signInButtonText}>Sign In</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => router.push("/register")}
        >
          <ThemedText style={styles.signUpButtonText}>
            Create Account
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </ThemedText>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📺</ThemedText>
          <ThemedText style={styles.featureText}>
            Watch on any device
          </ThemedText>
        </View>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>⬇️</ThemedText>
          <ThemedText style={styles.featureText}>Download & go</ThemedText>
        </View>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>✨</ThemedText>
          <ThemedText style={styles.featureText}>
            New releases weekly
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: "absolute",
    top: 60,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  themeToggleText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 48,
  },
  logoAccent: {
    fontSize: 48,
    fontWeight: "300",
    lineHeight: 48,
    marginLeft: 4,
  },
  tagline: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonSection: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: "#E50914",
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 12,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  terms: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  featureItem: {
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  loadingLogoText: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 36,
  },
  loadingLogoAccent: {
    fontSize: 36,
    fontWeight: "300",
    lineHeight: 36,
    marginLeft: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  spinnerInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
    borderTopColor: "#E50914",
  },
});
