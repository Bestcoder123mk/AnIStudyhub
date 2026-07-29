"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ACHIEVEMENTS, SSC_ACHIEVEMENTS, levelFromXp } from "@/lib/achievements";
import { MATHS_ACHIEVEMENTS } from "@/lib/maths-achievements";
import { ENGLISH_ACHIEVEMENTS } from "@/lib/english-achievements";
import { SANSKRIT_ACHIEVEMENTS } from "@/lib/sanskrit-achievements";
import { playAchievement, bindSfxToggle } from "@/lib/sfx";

// ===== Types =====
export type ViewId =
  | "home" | "dash" | "chapters" | "mcq" | "short" | "long" | "flash"
  | "ach" | "mock" | "formulas" | "timer" | "speedrun"
  | "analytics" | "mistakes" | "bookmarks" | "tutor" | "settings" | "museum" | "translator" | "galaxy" | "review"
  | "ssc-dash" | "ssc-chapters" | "ssc-mcq" | "ssc-short" | "ssc-long"
  | "ssc-flash" | "ssc-ach" | "ssc-formulas"
  | "maths-dash" | "maths-chapters" | "maths-mcq" | "maths-short" | "maths-long" | "maths-formulas" | "maths-ach" | "maths-flash" | "maths-mock"
  | "eng-dash" | "eng-chapters" | "eng-mcq" | "eng-short" | "eng-long" | "eng-ach" | "eng-flash" | "eng-mock"
  | "skt-dash" | "skt-chapters" | "skt-mcq" | "skt-short" | "skt-long" | "skt-ach" | "skt-translator" | "skt-flash" | "skt-mock" | "skill-tree"
  | "leaderboard" | "planner" | "career" | "battle" | "lab" | "research" | "teacher" | "parent" | "social" | "guild" | "collections" | "seasonal" | "dungeons" | "resources";

export type Track = "science" | "ssc" | "maths" | "english" | "sanskrit";

// Subject metadata for UI
export const SUBJECT_META: Record<Track, { label: string; short: string; icon: string; accent: string; dash: ViewId }> = {
  science: { label: "Science", short: "Sci", icon: "⚛️", accent: "#a78bfa", dash: "dash" },
  ssc: { label: "Social Science", short: "SSC", icon: "🌏", accent: "#fb923c", dash: "ssc-dash" },
  maths: { label: "Mathematics", short: "Maths", icon: "🔢", accent: "#22d3ee", dash: "maths-dash" },
  english: { label: "English", short: "Eng", icon: "📖", accent: "#f472b6", dash: "eng-dash" },
  sanskrit: { label: "Sanskrit", short: "Skt", icon: "🕉️", accent: "#fbbf24", dash: "skt-dash" },
};
export type Theme = "midnight" | "twilight" | "daylight" | "sepia" | "contrast";
export type TextSize = "md" | "lg" | "xl";
export type RoomId = "none" | "rain-cafe" | "cyberpunk" | "forest" | "space-station" | "japanese-library" | "mountain-cabin" | "ocean" | "dark-academia" | "mars" | "temple" | "floating-islands";

export interface RoomDef {
  id: RoomId; label: string; icon: string;
  bg: string; // CSS background (gradient)
  ambientHue: number; // base hue for aurora
  soundPreset: "none" | "rain" | "cafe" | "forest" | "space" | "ocean" | "fire" | "wind";
}

export const ROOMS: RoomDef[] = [
  { id: "none", label: "Default", icon: "✦", bg: "", ambientHue: 265, soundPreset: "none" },
  { id: "rain-cafe", label: "Rain Café", icon: "🌧️", bg: "linear-gradient(135deg, #1a1f2e 0%, #0f1419 50%, #1a1f2e 100%)", ambientHue: 210, soundPreset: "rain" },
  { id: "cyberpunk", label: "Cyberpunk", icon: "🌃", bg: "linear-gradient(135deg, #0a0014 0%, #1a0033 50%, #001a33 100%)", ambientHue: 300, soundPreset: "none" },
  { id: "forest", label: "Forest Camp", icon: "🌲", bg: "linear-gradient(135deg, #0a1a0a 0%, #0f1f0f 50%, #0a1a0a 100%)", ambientHue: 120, soundPreset: "forest" },
  { id: "space-station", label: "Space Station", icon: "🚀", bg: "linear-gradient(135deg, #000010 0%, #050518 50%, #000005 100%)", ambientHue: 230, soundPreset: "space" },
  { id: "japanese-library", label: "Japanese Library", icon: "🏯", bg: "linear-gradient(135deg, #1a1410 0%, #2a1f18 50%, #1a1410 100%)", ambientHue: 30, soundPreset: "none" },
  { id: "mountain-cabin", label: "Mountain Cabin", icon: "🏔️", bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)", ambientHue: 220, soundPreset: "wind" },
  { id: "ocean", label: "Ocean Lab", icon: "🌊", bg: "linear-gradient(135deg, #001a2e 0%, #002a3e 50%, #001a2e 100%)", ambientHue: 195, soundPreset: "ocean" },
  { id: "dark-academia", label: "Dark Academia", icon: "📚", bg: "linear-gradient(135deg, #1a0f08 0%, #2a1810 50%, #1a0f08 100%)", ambientHue: 25, soundPreset: "none" },
  { id: "mars", label: "Mars Colony", icon: "🔴", bg: "linear-gradient(135deg, #2a0a00 0%, #3a1400 50%, #2a0a00 100%)", ambientHue: 15, soundPreset: "wind" },
  { id: "temple", label: "Ancient Temple", icon: "🛕", bg: "linear-gradient(135deg, #1a1408 0%, #2a2010 50%, #1a1408 100%)", ambientHue: 40, soundPreset: "none" },
  { id: "floating-islands", label: "Floating Islands", icon: "🏝️", bg: "linear-gradient(135deg, #0a1a2e 0%, #1a2a3e 50%, #0a1a2e 100%)", ambientHue: 200, soundPreset: "wind" },
];

export interface Mistake {
  id: string; track: Track; qId: number; ch: number; subj: string;
  q: string; yourAns: string; correctAns: string; exp: string;
  diff: string; date: number;
}
export interface Bookmark {
  id: string; track: Track; type: "chapter" | "mcq" | "qa" | "formula";
  refId: string; title: string; ch: number; subj: string; date: number; note?: string;
}
export interface Goal { id: string; text: string; due: string; done: boolean; created: number; }
export interface SrCard { key: string; interval: number; ef: number; reviews: number; nextReview: number; }

interface ToastMsg { id: number; icon: string; msg: string; type: "success" | "error" | "info" | "ach"; }

interface SscState {
  totalXp: number; level: number;
  totalCorrect: number; totalAnswered: number;
  bestStreak: number; currentStreak: number;
  mcqDone: number; chaptersOpened: number;
  shortRevealed: number; longRevealed: number; flashDone: number;
  unlockedAch: string[];
  openedChapters: number[];
  histAnswered: number; histCorrect: number;
  geoAnswered: number; geoCorrect: number;
  polsciAnswered: number; polsciCorrect: number;
  ecoAnswered: number; ecoCorrect: number;
}

interface StudyState {
  track: Track;
  view: ViewId;
  sidebarOpen: boolean;
  searchOpen: boolean;

  theme: Theme;
  textSize: TextSize;
  monochrome: boolean;
  room: RoomId;
  lastView: { track: Track; view: ViewId; ts: number } | null;
  quests: { id: string; label: string; type: "mcq" | "flash" | "chap" | "streak"; target: number; progress: number; reward: number; claimed: boolean; date: string }[];

  examDate: string;
  shields: number;
  coins: number;
  streakFreeze: number;
  autoTheme: boolean;
  voiceEnabled: boolean;
  ttsRate: number;
  soundEnabled: boolean;
  pendingTutorContext: string | null;
  skillTree: Record<string, boolean>; // unlocked node ids
  // Tier 3
  planner: { id: string; date: string; subject: Track; topic: string; duration: number; done: boolean }[];
  collections: string[]; // collected museum artifact ids
  battles: { id: string; subject: Track; score: number; total: number; date: number; won: boolean }[];
  guild: { name: string; members: { name: string; xp: number; avatar: string }[] } | null;
  seasonalEvent: { id: string; name: string; icon: string; progress: number; target: number; reward: number; claimed: boolean } | null;
  studyBuddies: { id: string; name: string; avatar: string; xp: number; status: "online" | "offline" }[];

  // science stats
  totalXp: number; level: number;
  totalCorrect: number; totalAnswered: number;
  bestStreak: number; currentStreak: number;
  mcqDone: number; chaptersOpened: number;
  shortRevealed: number; longRevealed: number; flashDone: number;
  unlockedAch: string[];
  openedChapters: number[];
  chStats: Record<number, { correct: number; attempted: number }>;
  chemCorrect: number; chemAttempted: number;
  bioCorrect: number; bioAttempted: number;
  phyCorrect: number; phyAttempted: number;

  ssc: SscState;
  // generic stats for maths/english/sanskrit (reuse SscState shape)
  subjectStats: Record<string, SscState>;

  mistakes: Mistake[];
  bookmarks: Bookmark[];
  goals: Goal[];
  srCards: Record<string, SrCard>;
  heatmap: Record<string, number>;
  lastStudyDate: string;
  pomoSessions: number; pomoMins: number; pomoXp: number;
  daily: { date: string; mcqDone: number; flashDone: number; chapRead: number };

  toasts: ToastMsg[];
  popup: { type: "ach" | "level" | null; data: { icon?: string; title?: string; sub?: string; xp?: number; level?: number } };

  setTrack: (t: Track) => void;
  setView: (v: ViewId) => void;
  setSidebar: (open: boolean) => void;
  setSearch: (open: boolean) => void;
  setTheme: (t: Theme) => void;
  setTextSize: (t: TextSize) => void;
  toggleMonochrome: () => void;
  setRoom: (r: RoomId) => void;
  setExamDate: (d: string) => void;
  setAutoTheme: (v: boolean) => void;
  setVoiceEnabled: (v: boolean) => void;
  setTtsRate: (v: number) => void;
  toggleSound: () => void;
  setPendingTutorContext: (v: string | null) => void;
  spendCoins: (n: number) => boolean;
  addCoins: (n: number) => void;
  buyStreakFreeze: () => void;
  unlockSkill: (id: string) => void;
  addPlannerSession: (date: string, subject: Track, topic: string, duration: number) => void;
  togglePlannerSession: (id: string) => void;
  removePlannerSession: (id: string) => void;
  collectArtifact: (id: string) => void;
  recordBattle: (subject: Track, score: number, total: number) => void;
  joinGuild: (name: string) => void;
  ensureSeasonal: () => void;
  claimSeasonal: () => void;
  ensureStudyBuddies: () => void;
  touchLastView: () => void;
  claimQuest: (id: string) => void;
  ensureQuests: () => void;
  bumpQuest: (type: "mcq" | "flash" | "chap", amt: number) => void;

  addXp: (n: number, label?: string) => void;
  recordAnswer: (track: Track, subj: string, ch: number, correct: boolean, qId: number, q: string, yourAns: string, correctAns: string, exp: string, diff: string) => void;
  openChapter: (track: Track, chId: number) => void;
  revealQA: (track: Track, type: "short" | "long", marks: number) => void;
  reviewFlash: (track: Track) => void;
  recordPomo: (mins: number) => void;
  addMistake: (m: Omit<Mistake, "id" | "date">) => void;
  removeMistake: (id: string) => void;
  addBookmark: (b: Omit<Bookmark, "id" | "date">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (track: Track, type: Bookmark["type"], refId: string) => boolean;
  addGoal: (text: string, due: string) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  rateSrCard: (key: string, quality: 1 | 2 | 3 | 4 | 5) => void;

  pushToast: (icon: string, msg: string, type?: ToastMsg["type"]) => void;
  dismissToast: (id: number) => void;
  showPopup: (p: StudyState["popup"]) => void;
  closePopup: () => void;
  checkAchievements: () => void;
  resetTrack: (track: Track) => void;
  resetAll: () => void;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

// Subjects that use the generic subjectStats map (maths/english/sanskrit)
const GENERIC_SUBJECTS: Track[] = ["maths", "english", "sanskrit"];
const isGeneric = (t: Track) => GENERIC_SUBJECTS.includes(t);

const defaultSsc: SscState = {
  totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0,
  bestStreak: 0, currentStreak: 0, mcqDone: 0, chaptersOpened: 0,
  shortRevealed: 0, longRevealed: 0, flashDone: 0, unlockedAch: [],
  openedChapters: [], histAnswered: 0, histCorrect: 0,
  geoAnswered: 0, geoCorrect: 0, polsciAnswered: 0, polsciCorrect: 0,
  ecoAnswered: 0, ecoCorrect: 0,
};

let toastId = 1;

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      track: "science",
      view: "dash",
      sidebarOpen: false,
      searchOpen: false,
      theme: "midnight",
      textSize: "md",
      monochrome: false,
      room: "none",
      lastView: null,
      quests: [],
      examDate: "",
      shields: 1,
      coins: 0,
      streakFreeze: 0,
      autoTheme: false,
      voiceEnabled: false,
      ttsRate: 1,
      soundEnabled: true,
      pendingTutorContext: null,
      skillTree: {},
      planner: [],
      collections: [],
      battles: [],
      guild: null,
      seasonalEvent: null,
      studyBuddies: [],
      totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0,
      bestStreak: 0, currentStreak: 0, mcqDone: 0, chaptersOpened: 0,
      shortRevealed: 0, longRevealed: 0, flashDone: 0, unlockedAch: [],
      openedChapters: [], chStats: {},
      chemCorrect: 0, chemAttempted: 0, bioCorrect: 0, bioAttempted: 0,
      phyCorrect: 0, phyAttempted: 0,
      ssc: { ...defaultSsc },
      subjectStats: {},
      mistakes: [], bookmarks: [], goals: [], srCards: {}, heatmap: {},
      lastStudyDate: "", pomoSessions: 0, pomoMins: 0, pomoXp: 0,
      daily: { date: "", mcqDone: 0, flashDone: 0, chapRead: 0 },
      toasts: [], popup: { type: null, data: {} },

      setTrack: (t) => set({ track: t, view: SUBJECT_META[t].dash, sidebarOpen: false }),
      setView: (v) => set((s) => ({ view: v, sidebarOpen: false, lastView: v === "home" ? s.lastView : { track: s.track, view: v, ts: Date.now() } })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      setSearch: (open) => set({ searchOpen: open }),
      setTheme: (t) => set({ theme: t }),
      setTextSize: (t) => set({ textSize: t }),
      toggleMonochrome: () => set((s) => ({ monochrome: !s.monochrome })),
      setRoom: (r) => set({ room: r }),
      touchLastView: () => set((s) => ({ lastView: { track: s.track, view: s.view, ts: Date.now() } })),
      claimQuest: (id) => {
        const q = get().quests.find((x) => x.id === id);
        if (!q || q.claimed || q.progress < q.target) return;
        set((s) => ({ quests: s.quests.map((x) => x.id === id ? { ...x, claimed: true } : x) }));
        get().addXp(q.reward, "Quest complete");
      },
      ensureQuests: () => {
        const today = new Date().toISOString().slice(0, 10);
        const s = get();
        if (s.quests.length > 0 && s.quests[0]?.date === today) return;
        const dailies = [
          { id: `q-mcq-${today}`, label: "Answer 10 MCQs", type: "mcq" as const, target: 10, progress: 0, reward: 30, claimed: false, date: today },
          { id: `q-flash-${today}`, label: "Review 5 flashcards", type: "flash" as const, target: 5, progress: 0, reward: 20, claimed: false, date: today },
          { id: `q-chap-${today}`, label: "Read 2 chapters", type: "chap" as const, target: 2, progress: 0, reward: 25, claimed: false, date: today },
        ];
        set({ quests: dailies });
      },
      bumpQuest: (type: "mcq" | "flash" | "chap", amt: number) => {
        set((s) => ({ quests: s.quests.map((q) => q.type === type && !q.claimed ? { ...q, progress: Math.min(q.target, q.progress + amt) } : q) }));
      },
      setExamDate: (d) => set({ examDate: d }),
      setAutoTheme: (v) => set({ autoTheme: v }),
      setVoiceEnabled: (v) => set({ voiceEnabled: v }),
      setTtsRate: (v) => set({ ttsRate: v }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setPendingTutorContext: (v) => set({ pendingTutorContext: v }),
      addCoins: (n) => set((s) => ({ coins: s.coins + n })),
      spendCoins: (n) => {
        const s = get();
        if (s.coins < n) return false;
        set({ coins: s.coins - n });
        return true;
      },
      buyStreakFreeze: () => {
        if (get().spendCoins(50)) {
          set((s) => ({ streakFreeze: s.streakFreeze + 1 }));
          get().pushToast("🛡️", "Streak Freeze purchased! (+1)", "success");
        } else {
          get().pushToast("🪙", "Not enough coins (need 50)", "error");
        }
      },
      unlockSkill: (id) => set((s) => ({ skillTree: { ...s.skillTree, [id]: true } })),
      addPlannerSession: (date, subject, topic, duration) => set((s) => ({ planner: [...s.planner, { id: `p-${Date.now()}`, date, subject, topic, duration, done: false }] })),
      togglePlannerSession: (id) => set((s) => ({ planner: s.planner.map((p) => p.id === id ? { ...p, done: !p.done } : p) })),
      removePlannerSession: (id) => set((s) => ({ planner: s.planner.filter((p) => p.id !== id) })),
      collectArtifact: (id) => set((s) => s.collections.includes(id) ? {} : ({ collections: [...s.collections, id] })),
      recordBattle: (subject, score, total) => {
        const won = score >= Math.ceil(total * 0.7);
        set((s) => ({ battles: [{ id: `b-${Date.now()}`, subject, score, total, date: Date.now(), won }, ...s.battles].slice(0, 50) }));
        if (won) get().addXp(score * 10, "Battle won");
      },
      joinGuild: (name) => set((s) => ({
        guild: {
          name,
          members: [
            { name: "You", xp: s.totalXp + s.ssc.totalXp, avatar: "🧑‍🎓" },
            { name: "Priya", xp: 4200, avatar: "👩‍🎓" },
            { name: "Arjun", xp: 3800, avatar: "👨‍🎓" },
            { name: "Ananya", xp: 5100, avatar: "👩‍🔬" },
            { name: "Mohammed", xp: 2900, avatar: "🧑‍💻" },
          ],
        },
      })),
      ensureSeasonal: () => {
        const s = get();
        if (s.seasonalEvent) return;
        const events = [
          { id: "weekly-mcq", name: "Weekly MCQ Challenge", icon: "🎯", target: 50, reward: 100 },
          { id: "streak-week", name: "7-Day Streak Event", icon: "🔥", target: 7, reward: 150 },
          { id: "chapter-master", name: "Chapter Mastery", icon: "📚", target: 10, reward: 120 },
        ];
        const idx = Math.floor(Date.now() / (7 * 86400000)) % events.length;
        const ev = events[idx];
        set({ seasonalEvent: { ...ev, progress: 0, claimed: false } });
      },
      claimSeasonal: () => {
        const s = get();
        if (!s.seasonalEvent || s.seasonalEvent.claimed || s.seasonalEvent.progress < s.seasonalEvent.target) return;
        set({ seasonalEvent: { ...s.seasonalEvent, claimed: true } });
        get().addXp(s.seasonalEvent.reward, "Seasonal event complete");
        get().addCoins(s.seasonalEvent.reward / 5 | 0);
      },
      ensureStudyBuddies: () => {
        const s = get();
        if (s.studyBuddies.length > 0) return;
        set({ studyBuddies: [
          { id: "b1", name: "Priya Sharma", avatar: "👩‍🎓", xp: 4200, status: "online" },
          { id: "b2", name: "Arjun Patel", avatar: "👨‍🎓", xp: 3800, status: "online" },
          { id: "b3", name: "Ananya Roy", avatar: "👩‍🔬", xp: 5100, status: "offline" },
          { id: "b4", name: "Mohammed Khan", avatar: "🧑‍💻", xp: 2900, status: "online" },
          { id: "b5", name: "Sneha Gupta", avatar: "👩‍🏫", xp: 3400, status: "offline" },
        ] });
      },

      addXp: (n, label) => {
        set((s) => {
          if (s.track === "ssc") {
            const ssc = { ...s.ssc, totalXp: s.ssc.totalXp + n, level: levelFromXp(s.ssc.totalXp + n) };
            return { ssc };
          }
          if (isGeneric(s.track)) {
            const cur = s.subjectStats[s.track] || { ...defaultSsc };
            return { subjectStats: { ...s.subjectStats, [s.track]: { ...cur, totalXp: cur.totalXp + n, level: levelFromXp(cur.totalXp + n) } } };
          }
          return { totalXp: s.totalXp + n, level: levelFromXp(s.totalXp + n) };
        });
        get().pushToast("⚡", `+${n} XP${label ? " — " + label : ""}`, "success");
        get().addCoins(Math.floor(n / 10));
        get().checkAchievements();
      },

      recordAnswer: (track, subj, ch, correct, qId, q, yourAns, correctAns, exp, diff) => {
        set((s) => {
          const today = todayStr();
          const newHeat = { ...s.heatmap, [today]: (s.heatmap[today] || 0) + 1 };
          const newDaily = s.daily.date === today ? { ...s.daily, mcqDone: s.daily.mcqDone + 1 } : { date: today, mcqDone: 1, flashDone: 0, chapRead: 0 };

          if (track === "ssc") {
            const ssc = { ...s.ssc };
            ssc.totalAnswered += 1; ssc.mcqDone += 1;
            ssc.currentStreak = correct ? ssc.currentStreak + 1 : 0;
            ssc.bestStreak = Math.max(ssc.bestStreak, ssc.currentStreak);
            if (correct) ssc.totalCorrect += 1;
            const sRec = ssc as unknown as Record<string, number>;
            sRec[`${subj}Answered`] = (sRec[`${subj}Answered`] || 0) + 1;
            if (correct) sRec[`${subj}Correct`] = (sRec[`${subj}Correct`] || 0) + 1;
            if (correct) ssc.totalXp += 10 + (ssc.currentStreak >= 5 ? 5 : 0);
            ssc.level = levelFromXp(ssc.totalXp);
            return { ssc, heatmap: newHeat, daily: newDaily, lastStudyDate: today };
          }
          if (isGeneric(track)) {
            const cur = { ...(s.subjectStats[track] || { ...defaultSsc }) };
            cur.totalAnswered += 1; cur.mcqDone += 1;
            cur.currentStreak = correct ? cur.currentStreak + 1 : 0;
            cur.bestStreak = Math.max(cur.bestStreak, cur.currentStreak);
            if (correct) cur.totalCorrect += 1;
            const sRec = cur as unknown as Record<string, number>;
            sRec[`${subj}Answered`] = (sRec[`${subj}Answered`] || 0) + 1;
            if (correct) sRec[`${subj}Correct`] = (sRec[`${subj}Correct`] || 0) + 1;
            if (correct) cur.totalXp += 10 + (cur.currentStreak >= 5 ? 5 : 0);
            cur.level = levelFromXp(cur.totalXp);
            return { subjectStats: { ...s.subjectStats, [track]: cur }, heatmap: newHeat, daily: newDaily, lastStudyDate: today };
          }
          const chStats = { ...s.chStats };
          const cs = chStats[ch] || { correct: 0, attempted: 0 };
          chStats[ch] = { correct: cs.correct + (correct ? 1 : 0), attempted: cs.attempted + 1 };
          const subjAtt = `${subj}Attempted` as keyof StudyState;
          const subjCor = `${subj}Correct` as keyof StudyState;
          const xpGain = correct ? 10 + (s.currentStreak >= 4 ? 5 : 0) : 0;
          return {
            totalAnswered: s.totalAnswered + 1,
            mcqDone: s.mcqDone + 1,
            currentStreak: correct ? s.currentStreak + 1 : 0,
            bestStreak: Math.max(s.bestStreak, correct ? s.currentStreak + 1 : s.bestStreak),
            totalCorrect: s.totalCorrect + (correct ? 1 : 0),
            totalXp: s.totalXp + xpGain,
            level: levelFromXp(s.totalXp + xpGain),
            chStats,
            [subjAtt]: (s[subjAtt] as number) + 1,
            [subjCor]: (s[subjCor] as number) + (correct ? 1 : 0),
            heatmap: newHeat, daily: newDaily, lastStudyDate: today,
          } as Partial<StudyState>;
        });
        if (!correct) get().addMistake({ track, qId, ch, subj, q, yourAns, correctAns, exp, diff });
        get().bumpQuest("mcq", 1);
        get().checkAchievements();
      },

      openChapter: (track, chId) => {
        set((s) => {
          const today = todayStr();
          const newHeat = { ...s.heatmap, [today]: (s.heatmap[today] || 0) + 1 };
          if (track === "ssc") {
            if (s.ssc.openedChapters.includes(chId)) return {};
            const ssc = { ...s.ssc, openedChapters: [...s.ssc.openedChapters, chId], chaptersOpened: s.ssc.chaptersOpened + 1, totalXp: s.ssc.totalXp + 5, level: levelFromXp(s.ssc.totalXp + 5) };
            return { ssc, heatmap: newHeat };
          }
          if (isGeneric(track)) {
            const cur = s.subjectStats[track] || { ...defaultSsc };
            if (cur.openedChapters.includes(chId)) return {};
            const upd = { ...cur, openedChapters: [...cur.openedChapters, chId], chaptersOpened: cur.chaptersOpened + 1, totalXp: cur.totalXp + 5, level: levelFromXp(cur.totalXp + 5) };
            return { subjectStats: { ...s.subjectStats, [track]: upd }, heatmap: newHeat };
          }
          if (s.openedChapters.includes(chId)) return {};
          return { openedChapters: [...s.openedChapters, chId], chaptersOpened: s.chaptersOpened + 1, totalXp: s.totalXp + 5, level: levelFromXp(s.totalXp + 5), heatmap: newHeat };
        });
        get().bumpQuest("chap", 1);
        get().checkAchievements();
      },

      revealQA: (track, type, marks) => {
        set((s) => {
          if (track === "ssc") {
            const ssc = { ...s.ssc, totalXp: s.ssc.totalXp + marks, level: levelFromXp(s.ssc.totalXp + marks) };
            if (type === "short") ssc.shortRevealed += 1; else ssc.longRevealed += 1;
            return { ssc };
          }
          if (isGeneric(track)) {
            const cur = { ...(s.subjectStats[track] || { ...defaultSsc }) };
            cur.totalXp += marks; cur.level = levelFromXp(cur.totalXp);
            if (type === "short") cur.shortRevealed += 1; else cur.longRevealed += 1;
            return { subjectStats: { ...s.subjectStats, [track]: cur } };
          }
          const patch: Partial<StudyState> = { totalXp: s.totalXp + marks, level: levelFromXp(s.totalXp + marks) };
          if (type === "short") patch.shortRevealed = s.shortRevealed + 1; else patch.longRevealed = s.longRevealed + 1;
          return patch;
        });
        get().checkAchievements();
      },

      reviewFlash: (track) => {
        set((s) => {
          if (track === "ssc") {
            const ssc = { ...s.ssc, flashDone: s.ssc.flashDone + 1, totalXp: s.ssc.totalXp + 5, level: levelFromXp(s.ssc.totalXp + 5) };
            return { ssc };
          }
          if (isGeneric(track)) {
            const cur = { ...(s.subjectStats[track] || { ...defaultSsc }) };
            cur.flashDone += 1; cur.totalXp += 5; cur.level = levelFromXp(cur.totalXp);
            return { subjectStats: { ...s.subjectStats, [track]: cur } };
          }
          return { flashDone: s.flashDone + 1, totalXp: s.totalXp + 5, level: levelFromXp(s.totalXp + 5) };
        });
        get().bumpQuest("flash", 1);
        get().checkAchievements();
      },

      recordPomo: (mins) => {
        set((s) => {
          const today = todayStr();
          const newHeat = { ...s.heatmap, [today]: (s.heatmap[today] || 0) + mins };
          const xpGain = 20;
          const newDaily = s.daily.date === today ? { ...s.daily } : { date: today, mcqDone: 0, flashDone: 0, chapRead: 0 };
          return { pomoSessions: s.pomoSessions + 1, pomoMins: s.pomoMins + mins, pomoXp: s.pomoXp + xpGain, totalXp: s.totalXp + xpGain, level: levelFromXp(s.totalXp + xpGain), heatmap: newHeat, daily: newDaily, lastStudyDate: today };
        });
        get().checkAchievements();
      },

      addMistake: (m) => set((s) => ({ mistakes: [{ ...m, id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: Date.now() }, ...s.mistakes].slice(0, 200) })),
      removeMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),

      addBookmark: (b) => set((s) => s.bookmarks.some((x) => x.track === b.track && x.type === b.type && x.refId === b.refId) ? {} : ({ bookmarks: [{ ...b, id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: Date.now() }, ...s.bookmarks] })),
      removeBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
      isBookmarked: (track, type, refId) => get().bookmarks.some((b) => b.track === track && b.type === type && b.refId === refId),

      addGoal: (text, due) => set((s) => ({ goals: [...s.goals, { id: `g-${Date.now()}`, text, due, done: false, created: Date.now() }] })),
      toggleGoal: (id) => set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, done: !g.done } : g) })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      rateSrCard: (key, quality) => {
        set((s) => {
          const card = s.srCards[key] || { key, interval: 1, ef: 2.5, reviews: 0, nextReview: Date.now() };
          const newEf = Math.max(1.3, card.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
          let newInterval: number;
          if (quality < 3) newInterval = 1;
          else if (card.reviews === 0) newInterval = 1;
          else if (card.reviews === 1) newInterval = 6;
          else newInterval = Math.round(card.interval * newEf);
          return { srCards: { ...s.srCards, [key]: { key, interval: newInterval, ef: newEf, reviews: card.reviews + 1, nextReview: Date.now() + newInterval * 86400000 } } };
        });
      },

      pushToast: (icon, msg, type = "info") => {
        const id = toastId++;
        set((s) => ({ toasts: [...s.toasts, { id, icon, msg, type }] }));
        if (type === "ach") playAchievement();
        setTimeout(() => get().dismissToast(id), 3400);
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      showPopup: (p) => set({ popup: p }),
      closePopup: () => set({ popup: { type: null, data: {} } }),

      checkAchievements: () => {
        const s = get();
        const achs = s.track === "ssc" ? SSC_ACHIEVEMENTS
          : s.track === "maths" ? MATHS_ACHIEVEMENTS
          : s.track === "english" ? ENGLISH_ACHIEVEMENTS
          : s.track === "sanskrit" ? SANSKRIT_ACHIEVEMENTS
          : ACHIEVEMENTS;
        let state: Record<string, number>;
        let unlocked: string[];
        if (s.track === "ssc") { const { unlockedAch, openedChapters, ...rest } = s.ssc; state = rest; unlocked = unlockedAch; }
        else if (isGeneric(s.track)) { const cur = s.subjectStats[s.track] || { ...defaultSsc }; const { unlockedAch, openedChapters, ...rest } = cur; state = rest; unlocked = unlockedAch; }
        else { state = { totalXp: s.totalXp, level: s.level, totalCorrect: s.totalCorrect, bestStreak: s.bestStreak, mcqDone: s.mcqDone, chaptersOpened: s.chaptersOpened, shortRevealed: s.shortRevealed, longRevealed: s.longRevealed, flashDone: s.flashDone, totalAnswered: s.totalAnswered }; unlocked = s.unlockedAch; }
        const newly = achs.filter((a) => !unlocked.includes(a.id) && a.check(state as Record<string, unknown>));
        if (newly.length === 0) return;
        const xpBonus = newly.reduce((sum, a) => sum + a.xp, 0);
        if (s.track === "ssc") {
          set((st) => ({ ssc: { ...st.ssc, unlockedAch: [...st.ssc.unlockedAch, ...newly.map((a) => a.id)], totalXp: st.ssc.totalXp + xpBonus, level: levelFromXp(st.ssc.totalXp + xpBonus) } }));
        } else if (isGeneric(s.track)) {
          set((st) => {
            const cur = { ...(st.subjectStats[s.track] || { ...defaultSsc }) };
            cur.unlockedAch = [...cur.unlockedAch, ...newly.map((a) => a.id)];
            cur.totalXp += xpBonus; cur.level = levelFromXp(cur.totalXp);
            return { subjectStats: { ...st.subjectStats, [s.track]: cur } };
          });
        } else {
          set((st) => ({ unlockedAch: [...st.unlockedAch, ...newly.map((a) => a.id)], totalXp: st.totalXp + xpBonus, level: levelFromXp(st.totalXp + xpBonus) }));
        }
        newly.forEach((a, i) => setTimeout(() => {
          get().showPopup({ type: "ach", data: { icon: a.icon, title: a.title, sub: a.desc, xp: a.xp } });
          get().pushToast(a.icon, `Achievement: ${a.title}`, "ach");
        }, i * 700));
      },

      resetTrack: (track) => {
        if (track === "ssc") set({ ssc: { ...defaultSsc } });
        else if (isGeneric(track)) set((s) => ({ subjectStats: { ...s.subjectStats, [track]: { ...defaultSsc } } }));
        else set({
          totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0, bestStreak: 0, currentStreak: 0,
          mcqDone: 0, chaptersOpened: 0, shortRevealed: 0, longRevealed: 0, flashDone: 0,
          unlockedAch: [], openedChapters: [], chStats: {},
          chemCorrect: 0, chemAttempted: 0, bioCorrect: 0, bioAttempted: 0, phyCorrect: 0, phyAttempted: 0,
        });
      },
      resetAll: () => set({
        totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0, bestStreak: 0, currentStreak: 0,
        mcqDone: 0, chaptersOpened: 0, shortRevealed: 0, longRevealed: 0, flashDone: 0,
        unlockedAch: [], openedChapters: [], chStats: {},
        chemCorrect: 0, chemAttempted: 0, bioCorrect: 0, bioAttempted: 0, phyCorrect: 0, phyAttempted: 0,
        ssc: { ...defaultSsc }, subjectStats: {}, mistakes: [], bookmarks: [], goals: [], srCards: {}, heatmap: {},
        pomoSessions: 0, pomoMins: 0, pomoXp: 0,
      }),
    }),
    {
      name: "studyhub-v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (s) => {
        const { toasts, popup, sidebarOpen, searchOpen, view, track, pendingTutorContext, ...rest } = s;
        void toasts; void popup; void sidebarOpen; void searchOpen; void view; void track; void pendingTutorContext;
        return rest as StudyState;
      },
    }
  )
);

// Wire the SFX engine to this store's mute preference, lazily — sfx.ts
// can't import the store directly (it would be a circular import since
// the store imports sfx.ts for playAchievement).
bindSfxToggle(() => useStudyStore.getState().soundEnabled);
