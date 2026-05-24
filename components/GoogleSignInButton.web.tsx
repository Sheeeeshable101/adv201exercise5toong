import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function GoogleSignInButton() {
  const router = useRouter();
  const { signInWithGoogleWeb } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePress = async () => {
    setError("");
    setIsLoading(true);

    const result = await signInWithGoogleWeb();
    setIsLoading(false);

    if (result.success) {
      router.replace(result.needsSetup ? "/setup-account" : "/(tabs)");
    } else {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#141414" />
        ) : (
          <>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  button: {
    height: 50,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 10,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
  },
  buttonText: {
    color: "#141414",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
