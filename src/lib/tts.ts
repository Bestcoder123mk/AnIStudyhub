"use client";

import { useStudyStore } from "@/store/use-study-store";

// Text-to-Speech using the Web Speech API (no external deps).
// Respects the store's voiceEnabled + ttsRate settings.

let voices: SpeechSynthesisVoice[] = [];
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const load = () => { voices = window.speechSynthesis.getVoices(); };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

export function speak(text: string, opts?: { lang?: string; rate?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const store = useStudyStore.getState();
  if (!store.voiceEnabled) return;

  // Strip markdown-ish characters for cleaner speech
  const clean = text.replace(/[*_`#>|]/g, "").replace(/\n+/g, ". ").slice(0, 500);

  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = opts?.lang || "en-US";
  utter.rate = opts?.rate || store.ttsRate || 1;
  utter.pitch = 1;
  utter.volume = 0.8;

  // Pick a good voice
  const preferred = voices.find((v) => v.lang.startsWith(utter.lang.slice(0, 2)) && v.name.includes("Google"));
  if (preferred) utter.voice = preferred;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return window.speechSynthesis.speaking;
}
