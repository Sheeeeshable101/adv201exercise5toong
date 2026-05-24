import { auth } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { Platform } from "react-native";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  isSetupComplete: boolean;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  isSetupComplete: boolean;
}

export interface GoogleSignInResult {
  success: boolean;
  needsSetup: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  signInWithGoogleIdToken: (idToken: string) => Promise<GoogleSignInResult>;
  signInWithGoogleWeb: () => Promise<GoogleSignInResult>;
  setupAccount: (
    firstName: string,
    lastName: string,
    profilePhoto?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const profileKey = (uid: string) => `@auth_profile_${uid}`;

async function loadProfile(uid: string): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(profileKey(uid));
    if (data) {
      return JSON.parse(data) as UserProfile;
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
  return { isSetupComplete: false };
}

async function saveProfile(uid: string, profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(profileKey(uid), JSON.stringify(profile));
}

async function finalizeGoogleSignIn(
  firebaseUser: FirebaseUser,
): Promise<GoogleSignInResult> {
  const stored = await AsyncStorage.getItem(profileKey(firebaseUser.uid));
  if (!stored) {
    await saveProfile(firebaseUser.uid, { isSetupComplete: false });
    return { success: true, needsSetup: true };
  }

  const profile = await loadProfile(firebaseUser.uid);
  return { success: true, needsSetup: !profile.isSetupComplete };
}

function mapFirebaseUser(
  firebaseUser: FirebaseUser,
  profile: UserProfile,
): User {
  return {
    email: firebaseUser.email ?? "",
    firstName: profile.firstName,
    lastName: profile.lastName,
    profilePhoto: profile.profilePhoto,
    isSetupComplete: profile.isSetupComplete,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await loadProfile(firebaseUser.uid);
        setFirebaseUid(firebaseUser.uid);
        setUser(mapFirebaseUser(firebaseUser, profile));
      } else {
        setFirebaseUid(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signInWithGoogleIdToken = async (
    idToken: string,
  ): Promise<GoogleSignInResult> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return await finalizeGoogleSignIn(result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false, needsSetup: false };
    }
  };

  const signInWithGoogleWeb = async (): Promise<GoogleSignInResult> => {
    if (Platform.OS !== "web") {
      return { success: false, needsSetup: false };
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await finalizeGoogleSignIn(result.user);
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false, needsSetup: false };
    }
  };

  const register = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await saveProfile(credential.user.uid, { isSetupComplete: false });
      return true;
    } catch (error: unknown) {
      const code =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : "";
      if (code === "auth/email-already-in-use") {
        return false;
      }
      console.error("Register error:", error);
      return false;
    }
  };

  const setupAccount = async (
    firstName: string,
    lastName: string,
    profilePhoto?: string,
  ): Promise<void> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error("No authenticated user");
    }

    try {
      const profile: UserProfile = {
        firstName,
        lastName,
        profilePhoto,
        isSetupComplete: true,
      };
      await saveProfile(firebaseUser.uid, profile);
      setFirebaseUid(firebaseUser.uid);
      setUser({
        email: firebaseUser.email ?? user?.email ?? "",
        ...profile,
      });
    } catch (error) {
      console.error("Setup account error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        signInWithGoogleIdToken,
        signInWithGoogleWeb,
        setupAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
