import { getApps, initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { Platform } from "react-native";

// Firebase config for web
const firebaseConfig = {
  apiKey: "AIzaSyBj5us8nijxqTJ4dYqYFz9nWFhjYciC_II",
  authDomain: "adv102exercise7.firebaseapp.com",
  databaseURL: "https://adv102exercise7-default-rtdb.firebaseio.com/",
  projectId: "adv102exercise7",
  storageBucket: "adv102exercise7.firebasestorage.app",
  messagingSenderId: "97405809723",
  appId: "1:97405809723:web:64703646bd7e89848ed81e",
  measurementId: "G-GRC4HKXW48",
};

// Get or initialize Firebase app
let firebaseApp = getApps()[0];
if (!firebaseApp) {
  if (Platform.OS === "web") {
    firebaseApp = await initializeApp(firebaseConfig);
  } else {
    // On native (Android/iOS), RNFirebase automatically initializes the default app using google-services.json
    // Calling getApps() will return it
    firebaseApp = getApps()[0];
    if (!firebaseApp) {
      firebaseApp = await initializeApp(firebaseConfig); // Fallback
    }
  }
}

import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "97405809723-j1tc589ec4ov6v86v2p4rtn79i9b96te.apps.googleusercontent.com",
  offlineAccess: false,
  scopes: ["profile", "email"],
});

export const authInstance = auth();
export default firebaseApp;
