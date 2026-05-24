import { GOOGLE_WEB_CLIENT_ID } from "@/config/google";
import { useAuth } from "@/context/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
  const router = useRouter();
  const { signInWithGoogleIdToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    responseType: "id_token",
    selectAccount: true,
  });

  useEffect(() => {
    const handleNativeResponse = async () => {
      if (!response) return;

      if (response.type === "dismiss") {
        setIsLoading(false);
        return;
      }

      if (response.type !== "success") {
        if (response.type === "error") {
          setError("Google sign-in was cancelled or failed.");
        }
        setIsLoading(false);
        return;
      }

      const idToken = response.params.id_token;
      if (!idToken) {
        setError("Google sign-in did not return a valid token.");
        setIsLoading(false);
        return;
      }

      const result = await signInWithGoogleIdToken(idToken);
      setIsLoading(false);

      if (result.success) {
        router.replace(result.needsSetup ? "/setup-account" : "/(tabs)");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    };

    handleNativeResponse();
  }, [response, router, signInWithGoogleIdToken]);

  const handlePress = async () => {
    setError("");
    setIsLoading(true);

    if (!request) {
      setIsLoading(false);
      setError("Google sign-in is not ready yet. Please try again.");
      return;
    }

    const result = await promptAsync();
    if (result.type === "dismiss") {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={isLoading || !request}
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
