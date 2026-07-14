// Import Firebase core
import { initializeApp } from "firebase/app";

// Services you need
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Optional
import { getAnalytics } from "firebase/analytics";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyDQQYVM0ay7pyxeWiJogJFWd7vPOMb2KVw",
  authDomain: "aurastay-858e4.firebaseapp.com",
  projectId: "aurastay-858e4",
  storageBucket: "aurastay-858e4.firebasestorage.app",
  messagingSenderId: "205662317783",
  appId: "1:205662317783:web:e789c5f8561c9128ff9492",
  measurementId: "G-DETSQL1BDJ"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Optional (only works in browser)
export const analytics = getAnalytics(app);