import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
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
  const { setupAccount, user } = useAuth();
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
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: SetupFormData) => {
    const filteredFirstName = data.firstName.trim();
    const filteredLastName = data.lastName.trim();

    setIsSubmitting(true);
    try {
      await setupAccount(filteredFirstName, filteredLastName, profilePhoto);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to set up account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Movie</Text>
          <Text style={styles.logoAccent}>Vault</Text>
        </View>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Add your personal information</Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoIcon}>📷</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <Text style={styles.editIcon}>✏️</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Tap to add photo</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="Enter your first name"
            placeholderTextColor="#666"
            {...register("firstName", {
              required: "First name is required",
            })}
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName.message}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Enter your last name"
            placeholderTextColor="#666"
            {...register("lastName", {
              required: "Last name is required",
            })}
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName.message}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

SetupAccountScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
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
    color: "#E50914",
  },
  logoAccent: {
    fontSize: 28,
    fontWeight: "300",
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#333",
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
    backgroundColor: "#E50914",
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
    color: "#666",
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
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#333",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 50,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#E50914",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    marginTop: 16,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
