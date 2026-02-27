import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="setup-account"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen
          name="account"
          options={{ headerShown: false, presentation: "card" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
