import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbdXuBeVsTmvPno3D5hIJLHscWeSrDvdY",
  authDomain: "exercise7adv102.firebaseapp.com",
  projectId: "exercise7adv102",
  storageBucket: "exercise7adv102.firebasestorage.app",
  messagingSenderId: "389751292879",
  appId: "1:389751292879:web:e1162a29904a13a6ec08ba",
};

const app = initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };
