// Firebase initialization for StudyHub (anistudyhub project)
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyDA5FYRSD8ba84-Nc9mj1-oe7cemdmlK2k",
  authDomain: "anistudyhub.firebaseapp.com",
  projectId: "anistudyhub",
  storageBucket: "anistudyhub.firebasestorage.app",
  messagingSenderId: "612493515750",
  appId: "1:612493515750:web:721bec4d09c9da4e9f1427",
  measurementId: "G-S4KVP4TPQ8",
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  const a = getFirebaseApp();
  if (!a) return null;
  const ok = await isSupported();
  if (!ok) return null;
  if (!analytics) analytics = getAnalytics(a);
  return analytics;
}
