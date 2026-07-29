"use client";
import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

// Initializes Firebase Analytics on the client (mount-once, no UI).
export function FirebaseAnalytics() {
  useEffect(() => {
    let active = true;
    getFirebaseAnalytics()
      .then(() => { if (active) console.info("[firebase] analytics ready"); })
      .catch((e) => { if (active) console.warn("[firebase] analytics init failed", e); });
    return () => { active = false; };
  }, []);
  return null;
}
