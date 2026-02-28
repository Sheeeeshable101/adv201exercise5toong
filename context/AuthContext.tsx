import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  email: string;
  password?: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "@auth_user",
  USERS: "@auth_users",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(userWithoutPassword),
        );
        return true;
      }
      return false;
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
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (existingUser) {
        return false;
      }

      const newUser: User = {
        email,
        password,
        isSetupComplete: false,
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(userWithoutPassword),
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
    if (!user) return;

    try {
      const updatedUser: User = {
        ...user,
        firstName,
        lastName,
        profilePhoto,
        isSetupComplete: true,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(updatedUser),
      );

      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (usersData) {
        const users: User[] = JSON.parse(usersData);
        const userIndex = users.findIndex((u) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        }
      }
    } catch (error) {
      console.error("Setup account error:", error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, setupAccount, logout }}
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
