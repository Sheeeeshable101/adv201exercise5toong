import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function LandingScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [loadingAnim] = useState(new Animated.Value(0));

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
  }, [user, isLoading]);

  const spin = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>Movie</Text>
          <Text style={styles.loadingLogoAccent}>Vault</Text>
        </View>
        <Animated.View
          style={[styles.loadingSpinner, { transform: [{ rotate: spin }] }]}
        >
          <View style={styles.spinnerInner} />
        </Animated.View>
        <Text style={styles.loadingText}>Loading your experience...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient}>
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>Movie</Text>
          <Text style={styles.logoAccent}>Vault</Text>
        </View>

        <Text style={styles.tagline}>
          Unlimited movies, TV shows, and more.
        </Text>

        <Text style={styles.subtitle}>Watch anywhere. Cancel anytime.</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📺</Text>
          <Text style={styles.featureText}>Watch on any device</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⬇️</Text>
          <Text style={styles.featureText}>Download & go</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>✨</Text>
          <Text style={styles.featureText}>New releases weekly</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: "#141414",
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
    color: "#E50914",
  },
  logoAccent: {
    fontSize: 48,
    fontWeight: "300",
    color: "#fff",
  },
  tagline: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
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
    color: "#fff",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  terms: {
    color: "#666",
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
    color: "#666",
    fontSize: 10,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#141414",
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
    color: "#E50914",
  },
  loadingLogoAccent: {
    fontSize: 36,
    fontWeight: "300",
    color: "#fff",
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#333",
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
    borderColor: "#444",
    borderTopColor: "#E50914",
  },
});
