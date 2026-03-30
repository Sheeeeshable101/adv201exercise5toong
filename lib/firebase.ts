import { getApps, initializeApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj5us8nijxqTJ4dYqYFz9nWFhjYciC_II",
  authDomain: "adv102exercise7.firebaseapp.com",
  projectId: "adv102exercise7",
  storageBucket: "adv102exercise7.firebasestorage.app",
  messagingSenderId: "97405809723",
  appId: "1:97405809723:web:64703646bd7e89848ed81e",
  measurementId: "G-GRC4HKXW48",
};

let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export const authInstance = auth();
export default firebaseApp;
