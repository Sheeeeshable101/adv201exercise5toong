import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme as useHookColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const router = useRouter();
  const { user, setupAccount, logout } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(
    user?.profilePhoto,
  );
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useHookColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "placeholder");
  const tintColor = useThemeColor({}, "primary");
  const inputBgColor = useThemeColor(
    { light: "#f8f9fa", dark: "#333333" },
    "card",
  );
  const inputBorderColor = useThemeColor({ light: "#E0E0E0", dark: "#444444" });
  const buttonBgColor = tintColor;
  const buttonTextColor = useThemeColor({ light: "#FFFFFF", dark: "#FFFFFF" });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library to select a profile photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await setupAccount(firstName, lastName, profilePhoto);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to update account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const getUserInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Account Details</ThemedText>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.profilePhoto}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  { backgroundColor: inputBgColor },
                ]}
              >
                <ThemedText style={styles.photoInitials}>
                  {getUserInitials()}
                </ThemedText>
              </View>
            )}
            <View
              style={[styles.editBadge, { backgroundColor: buttonBgColor }]}
            >
              <ThemedText style={styles.editIcon}>📷</ThemedText>
            </View>
          </TouchableOpacity>
          <ThemedText style={styles.photoHint}>Tap to change photo</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Account Information
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View
              style={[styles.emailContainer, { backgroundColor: inputBgColor }]}
            >
              <ThemedText style={styles.emailText}>
                {user?.email || "Not set"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  borderColor: inputBorderColor,
                  color: textColor,
                },
              ]}
              placeholder="First name (optional)"
              placeholderTextColor={iconColor}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  borderColor: inputBorderColor,
                  color: textColor,
                },
              ]}
              placeholder="Last name (optional)"
              placeholderTextColor={iconColor}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: buttonBgColor }]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={buttonTextColor} />
          ) : (
            <ThemedText
              style={[styles.saveButtonText, { color: buttonTextColor }]}
            >
              Save Changes
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: buttonBgColor }]}
          onPress={handleLogout}
        >
          <ThemedText
            style={[styles.logoutButtonText, { color: buttonBgColor }]}
          >
            Logout
          </ThemedText>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </ThemedView>
  );
}

AccountScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  photoContainer: {
    position: "relative",
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E50914",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#444",
  },
  photoInitials: {
    fontSize: 40,
    fontWeight: "bold",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 16,
  },
  photoHint: {
    fontSize: 12,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  emailContainer: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
  },
  emailText: {
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    height: 50,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
