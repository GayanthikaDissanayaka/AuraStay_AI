// firebase/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQQYVM0ay7pyxeWiJogJFWd7vPOMb2KVw",
  authDomain: "aurastay-858e4.firebaseapp.com",
  projectId: "aurastay-858e4",
  storageBucket: "aurastay-858e4.firebasestorage.app",
  messagingSenderId: "205662317783",
  appId: "1:205662317783:web:e789c5f8561c9128ff9492",
  measurementId: "G-DETSQL1BDJ"
};

// Initialize Firebase only once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} else {
  app = getApp();
  console.log('Using existing Firebase instance');
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;