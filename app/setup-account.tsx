import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SetupFormData {
  firstName: string;
  lastName: string;
}

export default function SetupAccountScreen() {
  const router = useRouter();
  const { setupAccount } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SetupFormData>({
    defaultValues: { firstName: "", lastName: "" },
    mode: "onBlur",
  });

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    const firstName = data.firstName;
    const lastName = data.lastName;

    setIsSubmitting(true);
    try {
      await setupAccount(firstName, lastName, profilePhoto);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to set up account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <ThemedText style={styles.logoText}>Movie</ThemedText>
          <ThemedText style={styles.logoAccent}>Vault</ThemedText>
        </View>
        <ThemedText style={styles.title}>Set Up Your Profile</ThemedText>
        <ThemedText style={styles.subtitle}>
          Add your personal information
        </ThemedText>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <ThemedText style={styles.photoIcon}>📷</ThemedText>
            </View>
          )}
          <View style={styles.editBadge}>
            <ThemedText style={styles.editIcon}>✏️</ThemedText>
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.photoHint}>Tap to add photo</ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>First Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: useThemeColor({}, "card"),
                borderColor: useThemeColor({}, "border"),
                color: useThemeColor({}, "text"),
              },
              errors.firstName && styles.inputError,
            ]}
            placeholder="Enter your first name"
            placeholderTextColor={useThemeColor({}, "placeholder")}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <ThemedText style={styles.errorText}>
              {errors.firstName.message}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Last Name</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: useThemeColor({}, "card"),
                borderColor: useThemeColor({}, "border"),
                color: useThemeColor({}, "text"),
              },
              errors.lastName && styles.inputError,
            ]}
            placeholder="Enter your last name"
            placeholderTextColor={useThemeColor({}, "placeholder")}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <ThemedText style={styles.errorText}>
              {errors.lastName.message}
            </ThemedText>
          ) : null}
        </View>

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
            <ThemedText style={styles.buttonText}>Complete Setup</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

SetupAccountScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  logoAccent: {
    fontSize: 28,
    fontWeight: "300",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  photoContainer: {
    alignSelf: "center",
    marginBottom: 8,
    position: "relative",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#E50914",
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#444",
    borderStyle: "dashed",
  },
  photoIcon: {
    fontSize: 36,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    fontSize: 14,
  },
  photoHint: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
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
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
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
  skipButton: {
    marginTop: 16,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 14,
  },
});
