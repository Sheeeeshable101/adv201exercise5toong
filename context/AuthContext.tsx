import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { authInstance } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleAuthProvider } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  isSetupComplete: boolean;
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  isSetupComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  setupAccount: (
    firstName: string,
    lastName: string,
    profilePhoto?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [localProfile, setLocalProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    try {
      const profileStr = await AsyncStorage.getItem(`@profile_${uid}`);
      if (profileStr) {
        const profile = JSON.parse(profileStr) as Profile;
        setLocalProfile(profile);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect(() => {
    const unsub = authInstance.onAuthStateChanged(async (fbUser) => {
      setIsLoading(true);
      if (fbUser) {
        await loadProfile(fbUser.uid);
        setFirebaseUser(fbUser);
      } else {
        setFirebaseUser(null);
        setLocalProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authInstance.signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const result = await authInstance.createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = result.user.uid;
      const initialProfile = {
        isSetupComplete: false,
        firstName: "",
        lastName: "",
        profilePhoto: undefined,
      };
      await AsyncStorage.setItem(
        `@profile_${uid}`,
        JSON.stringify(initialProfile),
      );
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const setupAccount = async (
    firstName: string,
    lastName: string,
    profilePhoto?: string,
  ): Promise<void> => {
    if (!firebaseUser) return;

    try {
      const profile: Profile = {
        firstName,
        lastName,
        profilePhoto,
        isSetupComplete: true,
      };
      const uid = firebaseUser.uid;
      setLocalProfile(profile);
      await AsyncStorage.setItem(`@profile_${uid}`, JSON.stringify(profile));
      await authInstance.currentUser?.updateProfile({
        displayName: `${firstName} ${lastName}`,
        photoURL: profilePhoto,
      });
    } catch (error) {
      console.error("Setup account error:", error);
    }
  };

  const googleSignIn = async (): Promise<boolean> => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // @ts-ignore Property 'idToken' on SignInResponse (library types issue)
      const idToken = (userInfo as any).idToken;
      if (!idToken) throw new Error("No ID token found");
      const googleCredential = GoogleAuthProvider.credential(idToken);

      await authInstance.signInWithCredential(googleCredential);
      return true;
    } catch (error) {
      console.error("Google Sign-In error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authInstance.signOut();
      await GoogleSignin.signOut(); // Also sign out from Google
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const user: User | null = firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: localProfile?.firstName,
        lastName: localProfile?.lastName,
        profilePhoto:
          localProfile?.profilePhoto || firebaseUser.photoURL || undefined,
        isSetupComplete: localProfile?.isSetupComplete ?? false,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        setupAccount,
        logout,
        googleSignIn,
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
