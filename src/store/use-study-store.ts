"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ACHIEVEMENTS, SSC_ACHIEVEMENTS, levelFromXp, levelTitle } from "@/lib/achievements";
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
  | "leaderboard" | "planner" | "career" | "battle" | "lab" | "research" | "teacher" | "parent" | "social" | "guild" | "collections" | "seasonal" | "dungeons" | "resources" | "shop" | "notes" | "diagrams";

export type Track = "science" | "ssc" | "maths" | "english" | "sanskrit";

// ===== Difficulty tracking & adaptive engine =====
// One canonical difficulty tier, shared by every subject's MCQ data and by
// the analytics/adaptive-selection code below — replaces what used to be
// four unrelated "difficulty-ish" mechanisms (see adaptive.ts).
export type DiffTier = "easy" | "medium" | "hard";
export const DIFF_TIERS: DiffTier[] = ["easy", "medium", "hard"];
export interface DiffStat { correct: number; attempted: number; }
export type DiffStatsByTier = Record<DiffTier, DiffStat>;
// A subject's current position in the adaptive engine: which tier it's
// currently serving, and how many in-a-row correct/wrong answers at that
// tier (only one of the two is ever non-zero at a time).
export interface AdaptiveState { tier: DiffTier; correctRun: number; wrongRun: number; }

// Subject metadata for UI
export const SUBJECT_META: Record<Track, { label: string; short: string; icon: string; accent: string; dash: ViewId; mcq: ViewId; ach: ViewId; chapters: ViewId }> = {
  science: { label: "Science", short: "Sci", icon: "⚛️", accent: "#a78bfa", dash: "dash", mcq: "mcq", ach: "ach", chapters: "chapters" },
  ssc: { label: "Social Science", short: "SSC", icon: "🌏", accent: "#fb923c", dash: "ssc-dash", mcq: "ssc-mcq", ach: "ssc-ach", chapters: "ssc-chapters" },
  maths: { label: "Mathematics", short: "Maths", icon: "🔢", accent: "#22d3ee", dash: "maths-dash", mcq: "maths-mcq", ach: "maths-ach", chapters: "maths-chapters" },
  english: { label: "English", short: "Eng", icon: "📖", accent: "#f472b6", dash: "eng-dash", mcq: "eng-mcq", ach: "eng-ach", chapters: "eng-chapters" },
  sanskrit: { label: "Sanskrit", short: "Skt", icon: "🕉️", accent: "#fbbf24", dash: "skt-dash", mcq: "skt-mcq", ach: "skt-ach", chapters: "skt-chapters" },
};

// Canonical track -> XP/level resolver. Science and SSC keep their XP on
// dedicated top-level fields for historical reasons; Maths/English/Sanskrit
// share the generic `subjectStats` map. Several views used to each hand-roll
// this ternary themselves — xp-bar.tsx and footer.tsx only handled the SSC
// case and silently fell back to *Science* XP for the other three subjects,
// which meant the header showed the wrong number for 3 of 5 tracks. This is
// now the one place that logic lives; everything reads XP/level through it.
interface TrackXpSource {
  totalXp: number;
  ssc: { totalXp: number };
  subjectStats: Record<string, { totalXp: number } | undefined>;
}
export function getTrackXp(s: TrackXpSource, t: Track): number {
  if (t === "science") return s.totalXp;
  if (t === "ssc") return s.ssc.totalXp;
  return s.subjectStats[t]?.totalXp ?? 0;
}
interface TrackLevelSource {
  level: number;
  ssc: { level: number };
  subjectStats: Record<string, { level: number } | undefined>;
}
export function getTrackLevel(s: TrackLevelSource, t: Track): number {
  if (t === "science") return s.level;
  if (t === "ssc") return s.ssc.level;
  return s.subjectStats[t]?.level ?? 1;
}

export type Theme = "midnight" | "twilight" | "daylight" | "sepia" | "contrast";
export type TextSize = "md" | "lg" | "xl";
// User-customizable accent color (hex string, e.g. "#22d3ee"). Feeds --user-accent
// in globals.css, which the midnight/daylight themes read for --primary/--ring/
// --sidebar-primary/glow instead of a hardcoded hue — so "pure black/white with an
// accent colour" is one variable, not a new theme per colour. Default is cyan.
export const DEFAULT_ACCENT = "#22d3ee";
export const ACCENT_PRESETS: { label: string; hex: string }[] = [
  { label: "Cyan", hex: "#22d3ee" },
  { label: "Violet", hex: "#a78bfa" },
  { label: "Emerald", hex: "#34d399" },
  { label: "Rose", hex: "#fb7185" },
  { label: "Amber", hex: "#fbbf24" },
  { label: "Sky", hex: "#60a5fa" },
];
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

// Mistake taxonomy — lets the Mistake Notebook classify *why* a question
// was missed instead of just logging that it was. Optional and
// user-assigned (see tagMistake) rather than auto-detected, because
// reliably inferring "careless slip" vs "conceptual gap" from a wrong MCQ
// option isn't something the app can do honestly without reading the
// student's reasoning — asking them to tag it takes two taps and the
// resulting breakdown (see lib/mastery-engine.ts) is the actual payoff.
export const MISTAKE_CATEGORIES = [
  "concept", "forgot", "formula", "formula-application", "calculation",
  "unit", "sign", "misread", "careless", "confused-concepts",
  "incomplete", "terminology", "diagram", "time-pressure", "guessing",
] as const;
export type MistakeCategory = (typeof MISTAKE_CATEGORIES)[number];
export const MISTAKE_CATEGORY_META: Record<MistakeCategory, { label: string; icon: string }> = {
  "concept": { label: "Conceptual gap", icon: "🧩" },
  "forgot": { label: "Forgot the fact", icon: "🫥" },
  "formula": { label: "Forgot formula", icon: "📐" },
  "formula-application": { label: "Misapplied formula", icon: "⚙️" },
  "calculation": { label: "Calculation slip", icon: "🔢" },
  "unit": { label: "Unit error", icon: "📏" },
  "sign": { label: "Sign error", icon: "➖" },
  "misread": { label: "Misread the question", icon: "👀" },
  "careless": { label: "Careless mistake", icon: "🙈" },
  "confused-concepts": { label: "Confused two concepts", icon: "🔀" },
  "incomplete": { label: "Incomplete answer", icon: "✂️" },
  "terminology": { label: "Wrong terminology", icon: "🔤" },
  "diagram": { label: "Diagram error", icon: "📊" },
  "time-pressure": { label: "Time pressure", icon: "⏱️" },
  "guessing": { label: "Guessed", icon: "🎲" },
};

export interface Mistake {
  id: string; track: Track; qId: number; ch: number; subj: string;
  q: string; yourAns: string; correctAns: string; exp: string;
  diff: string; date: number;
  /** User-assigned root cause — set later via tagMistake, not at record time. */
  category?: MistakeCategory;
}

// A single chapter's evidence of concept mastery: correct/attempted counts
// from ordinary MCQ practice, kept per-track (not just Science, which is
// all the older `chStats` field covered) so every one of the 5 subjects can
// get a real chapter mastery map instead of only a subject-wide accuracy
// number. See lib/mastery-engine.ts for how this becomes a mastery tier.
export interface ChStat { correct: number; attempted: number; }

// Active-recall evidence for short/long answers: how many marks a student
// self-awarded themselves vs. the maximum available, aggregated per
// chapter. Populated by recordRecall — see components/shared/
// active-recall-panel.tsx for the write-answer-first UI that calls it.
export interface RecallStat { attempts: number; totalMarks: number; scoredMarks: number; }

// One saved Mock Test / board-paper-simulator attempt. Recorded once, when
// the student is done self-grading their written answers — see
// components/views/mock-test.tsx's "Save to Exam Readiness" action.
export interface MockResult {
  id: string;
  track: Track;
  date: number;
  testType: string;
  scoredMarks: number;
  maxMarks: number;
  scorePct: number;
  timeTakenSec: number;
  timeAllottedSec: number;
  sectionBreakdown: { section: string; scored: number; max: number }[];
}

// Confidence calibration — "you were 90% confident but correct only 55% of
// the time" (review doc item #27). Logged once per question, optionally,
// right after the instant-feedback reveal so it never blocks or slows down
// the core answer→feedback loop.
export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
export interface ConfidenceStat { correct: number; total: number; }
export interface Bookmark {
  id: string; track: Track; type: "chapter" | "mcq" | "qa" | "formula";
  refId: string; title: string; ch: number; subj: string; date: number; note?: string;
}
export interface Goal { id: string; text: string; due: string; done: boolean; created: number; }
export interface SrCard { key: string; interval: number; ef: number; reviews: number; nextReview: number; }
export interface Note {
  id: string;
  text: string;
  track: Track | null; // which subject it was jotted under, if any — null for a general note
  pinned: boolean;
  color: string; // one of NOTE_COLORS below
  createdAt: number;
  updatedAt: number;
}
export const NOTE_COLORS = ["default", "amber", "sky", "emerald", "rose"] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

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
  accentColor: string;
  textSize: TextSize;
  monochrome: boolean;
  room: RoomId;
  lastView: { track: Track; view: ViewId; ts: number } | null;
  quests: { id: string; label: string; type: "mcq" | "flash" | "chap" | "streak"; target: number; progress: number; reward: number; claimed: boolean; date: string }[];

  examDate: string;
  shields: number;
  coins: number;
  streakFreeze: number;
  // Shop
  inventory: string[]; // owned cosmetic ids (avatars + titles), from lib/shop-data
  equippedAvatar: string; // avatar id from lib/shop-data; "scholar" is the free default
  equippedTitle: string | null; // title id from lib/shop-data, or none
  xpBoost: number; // remaining answers with doubled XP
  // Quick Notes — capturable from anywhere via the floating button or the "N" shortcut
  notes: Note[];
  quickNoteOpen: boolean;
  // Interactive diagram-drawing practice
  diagramCompletions: Record<string, number>; // diagram id -> times completed
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

  // Per-track accuracy by difficulty tier — powers the "accuracy by
  // difficulty" analytics/parent-dashboard breakdown and seeds the
  // adaptive engine's starting tier. Lives independently of the three
  // different per-track state shapes above so it's written in one place.
  diffStats: Record<Track, DiffStatsByTier>;
  // Per-track adaptive-engine position — see AdaptiveState above.
  adaptive: Record<Track, AdaptiveState>;

  mistakes: Mistake[];
  bookmarks: Bookmark[];
  goals: Goal[];
  // Unified per-track, per-chapter concept-mastery evidence — see ChStat.
  // Populated by recordAnswer for all 5 tracks (Science also still writes
  // the legacy top-level `chStats` field so galaxy.tsx/dungeons.tsx keep
  // working unmodified).
  chapterStats: Record<Track, Record<number, ChStat>>;
  // Unified per-track, per-chapter active-recall evidence — see RecallStat.
  recallStats: Record<Track, Record<number, RecallStat>>;
  // History of saved Mock Test attempts, newest first — see MockResult.
  mockHistory: MockResult[];
  // Confidence-vs-correctness log per track, see ConfidenceLevel.
  confidenceStats: Record<Track, Record<ConfidenceLevel, ConfidenceStat>>;
  // Previous-Year-Question accuracy per track — see recordAnswer's isPyq flag.
  pyqStats: Record<Track, { correct: number; attempted: number }>;
  // Daily Exam Readiness snapshots per track — one entry per calendar day
  // at most, powering Progress History + Mastery Streak in Analytics.
  readinessHistory: Record<Track, { date: string; pct: number }[]>;
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
  setAccentColor: (hex: string) => void;
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
  buyCosmetic: (id: string, cost: number) => boolean;
  equipAvatar: (id: string) => void;
  equipTitle: (id: string | null) => void;
  buyXpBoost: (cost: number, uses: number) => boolean;
  addNote: (text: string, track: Track | null, color?: string) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
  toggleNotePin: (id: string) => void;
  setNoteColor: (id: string, color: string) => void;
  setQuickNoteOpen: (open: boolean) => void;
  completeDiagram: (id: string, track: Track, xp: number) => void;
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
  recordAnswer: (track: Track, subj: string, ch: number, correct: boolean, qId: number, q: string, yourAns: string, correctAns: string, exp: string, diff: string, isPyq?: boolean) => void;
  /** Advances (or holds) a track's adaptive difficulty tier after one answer.
   *  Moves up a tier after 3 correct in a row at the current tier, down a
   *  tier after 2 wrong in a row. The one place this logic lives — see
   *  src/lib/adaptive.ts for the question-selection half of the engine. */
  advanceAdaptiveTier: (track: Track, correct: boolean) => void;
  openChapter: (track: Track, chId: number) => void;
  revealQA: (track: Track, type: "short" | "long", marks: number) => void;
  reviewFlash: (track: Track) => void;
  recordPomo: (mins: number) => void;
  addMistake: (m: Omit<Mistake, "id" | "date">) => void;
  removeMistake: (id: string) => void;
  tagMistake: (id: string, category: MistakeCategory) => void;
  // Logs one active-recall attempt (student wrote an answer, self-graded
  // it against the model answer) into recallStats for that track/chapter.
  recordRecall: (track: Track, ch: number, marksTotal: number, marksScored: number) => void;
  // Saves one finished Mock Test attempt into mockHistory.
  recordMockResult: (entry: Omit<MockResult, "id" | "date">) => void;
  // Logs one confidence-vs-correctness data point for calibration tracking.
  logConfidence: (track: Track, level: ConfidenceLevel, correct: boolean) => void;
  // Records today's readiness % for a track — no-ops if today already has
  // an entry, so it's safe to call on every Analytics render.
  recordReadinessSnapshot: (track: Track, pct: number) => void;
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

export const ALL_TRACKS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
const defaultDiffStatsByTier = (): DiffStatsByTier => ({
  easy: { correct: 0, attempted: 0 },
  medium: { correct: 0, attempted: 0 },
  hard: { correct: 0, attempted: 0 },
});
const defaultDiffStats = (): Record<Track, DiffStatsByTier> => ({
  science: defaultDiffStatsByTier(), ssc: defaultDiffStatsByTier(), maths: defaultDiffStatsByTier(),
  english: defaultDiffStatsByTier(), sanskrit: defaultDiffStatsByTier(),
});
// Empty per-track record map — shared shape for both chapterStats (ChStat)
// and recallStats (RecallStat); each track starts as an empty object and
// fills in lazily per-chapter as the student answers questions.
const defaultTrackRecordMap = <T,>(): Record<Track, Record<number, T>> => ({
  science: {}, ssc: {}, maths: {}, english: {}, sanskrit: {},
});
const defaultConfidenceStats = (): Record<Track, Record<ConfidenceLevel, ConfidenceStat>> => {
  const perTrack = () => ({ low: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, high: { correct: 0, total: 0 } });
  return { science: perTrack(), ssc: perTrack(), maths: perTrack(), english: perTrack(), sanskrit: perTrack() };
};
const defaultReadinessHistory = (): Record<Track, { date: string; pct: number }[]> => ({
  science: [], ssc: [], maths: [], english: [], sanskrit: [],
});
const defaultPyqStats = (): Record<Track, { correct: number; attempted: number }> => ({
  science: { correct: 0, attempted: 0 }, ssc: { correct: 0, attempted: 0 }, maths: { correct: 0, attempted: 0 },
  english: { correct: 0, attempted: 0 }, sanskrit: { correct: 0, attempted: 0 },
});
const defaultAdaptiveState = (): AdaptiveState => ({ tier: "medium", correctRun: 0, wrongRun: 0 });
const defaultAdaptive = (): Record<Track, AdaptiveState> => ({
  science: defaultAdaptiveState(), ssc: defaultAdaptiveState(), maths: defaultAdaptiveState(),
  english: defaultAdaptiveState(), sanskrit: defaultAdaptiveState(),
});

let toastId = 1;

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      track: "science",
      view: "dash",
      sidebarOpen: false,
      searchOpen: false,
      theme: "midnight",
      accentColor: DEFAULT_ACCENT,
      textSize: "md",
      monochrome: false,
      room: "none",
      lastView: null,
      quests: [],
      examDate: "",
      shields: 1,
      coins: 0,
      streakFreeze: 0,
      inventory: [],
      equippedAvatar: "scholar",
      equippedTitle: "rising-scholar",
      xpBoost: 0,
      notes: [],
      quickNoteOpen: false,
      diagramCompletions: {},
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
      diffStats: defaultDiffStats(),
      adaptive: defaultAdaptive(),
      mistakes: [], bookmarks: [], goals: [],
      chapterStats: defaultTrackRecordMap<ChStat>(),
      recallStats: defaultTrackRecordMap<RecallStat>(),
      mockHistory: [],
      confidenceStats: defaultConfidenceStats(),
      pyqStats: defaultPyqStats(),
      readinessHistory: defaultReadinessHistory(),
      srCards: {}, heatmap: {},
      lastStudyDate: "", pomoSessions: 0, pomoMins: 0, pomoXp: 0,
      daily: { date: "", mcqDone: 0, flashDone: 0, chapRead: 0 },
      toasts: [], popup: { type: null, data: {} },

      setTrack: (t) => set({ track: t, view: SUBJECT_META[t].dash, sidebarOpen: false }),
      setView: (v) => set((s) => ({ view: v, sidebarOpen: false, lastView: v === "home" ? s.lastView : { track: s.track, view: v, ts: Date.now() } })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      setSearch: (open) => set({ searchOpen: open }),
      setTheme: (t) => set({ theme: t }),
      setAccentColor: (hex) => set({ accentColor: hex }),
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
      buyCosmetic: (id, cost) => {
        const s = get();
        if (s.inventory.includes(id)) return false;
        if (!get().spendCoins(cost)) {
          get().pushToast("🪙", `Not enough coins (need ${cost})`, "error");
          return false;
        }
        set((st) => ({ inventory: [...st.inventory, id] }));
        return true;
      },
      equipAvatar: (id) => set({ equippedAvatar: id }),
      equipTitle: (id) => set({ equippedTitle: id }),
      buyXpBoost: (cost, uses) => {
        if (!get().spendCoins(cost)) {
          get().pushToast("🪙", `Not enough coins (need ${cost})`, "error");
          return false;
        }
        set((s) => ({ xpBoost: s.xpBoost + uses }));
        get().pushToast("⚡", `XP Boost active — next ${uses} answers earn double XP!`, "success");
        return true;
      },
      addNote: (text, track, color = "default") => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const now = Date.now();
        const note: Note = { id: `note-${now}-${Math.random().toString(36).slice(2, 7)}`, text: trimmed, track, pinned: false, color, createdAt: now, updatedAt: now };
        set((s) => ({ notes: [note, ...s.notes] }));
        get().pushToast("📝", "Note saved", "success");
      },
      updateNote: (id, text) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, text, updatedAt: Date.now() } : n) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      toggleNotePin: (id) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n) })),
      setNoteColor: (id, color) => set((s) => ({ notes: s.notes.map((n) => n.id === id ? { ...n, color } : n) })),
      setQuickNoteOpen: (open) => set({ quickNoteOpen: open }),
      completeDiagram: (id, track, xp) => {
        const prevLevel = getTrackLevel(get(), track);
        const prevXp = getTrackXp(get(), track);
        set((s) => {
          const times = (s.diagramCompletions[id] || 0) + 1;
          const gain = times === 1 ? xp : Math.max(3, Math.round(xp / 3));
          if (track === "ssc") return { diagramCompletions: { ...s.diagramCompletions, [id]: times }, ssc: { ...s.ssc, totalXp: s.ssc.totalXp + gain, level: levelFromXp(s.ssc.totalXp + gain) } };
          if (isGeneric(track)) {
            const cur = s.subjectStats[track] || { ...defaultSsc };
            return { diagramCompletions: { ...s.diagramCompletions, [id]: times }, subjectStats: { ...s.subjectStats, [track]: { ...cur, totalXp: cur.totalXp + gain, level: levelFromXp(cur.totalXp + gain) } } };
          }
          return { diagramCompletions: { ...s.diagramCompletions, [id]: times }, totalXp: s.totalXp + gain, level: levelFromXp(s.totalXp + gain) };
        });
        get().checkAchievements();
        const gained = getTrackXp(get(), track) - prevXp;
        if (gained > 0) get().addCoins(Math.floor(gained / 10));
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },
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
            // Snapshot at join time — GuildView overrides this with your
            // live, current, all-subject total on every render (this used
            // to be science+SSC only and frozen forever), but seed it
            // correctly too so anything reading `guild.members` directly
            // isn't stuck with the old narrower number before the first render.
            { name: "You", xp: ALL_TRACKS.reduce((sum, t) => sum + getTrackXp(s, t), 0), avatar: "🧑‍🎓" },
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
        const prevLevel = getTrackLevel(get(), get().track);
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
        const track = get().track;
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      recordAnswer: (track, subj, ch, correct, qId, q, yourAns, correctAns, exp, diff, isPyq) => {
        const prevLevel = getTrackLevel(get(), track);
        const prevXp = getTrackXp(get(), track);
        const boosted = correct && get().xpBoost > 0;
        set((s) => {
          const mult = boosted ? 2 : 1;
          const today = todayStr();
          const newHeat = { ...s.heatmap, [today]: (s.heatmap[today] || 0) + 1 };
          const newDaily = s.daily.date === today ? { ...s.daily, mcqDone: s.daily.mcqDone + 1 } : { date: today, mcqDone: 1, flashDone: 0, chapRead: 0 };
          const boostPatch = boosted ? { xpBoost: s.xpBoost - 1 } : {};

          // Per-track, per-difficulty accuracy — one place this is updated
          // regardless of which of the three state shapes below `track`
          // uses. Falls back to "medium" for any legacy/unexpected value so
          // a bad `diff` string can never throw here.
          const tier: DiffTier = diff === "easy" || diff === "hard" ? diff : "medium";
          const trackDiff = { ...s.diffStats[track] };
          const tierStat = trackDiff[tier];
          trackDiff[tier] = { correct: tierStat.correct + (correct ? 1 : 0), attempted: tierStat.attempted + 1 };
          const diffStats = { ...s.diffStats, [track]: trackDiff };

          // Unified per-track chapter mastery evidence (all 5 tracks) —
          // computed once here so every branch below can just spread it in.
          const trackChStats = { ...s.chapterStats[track] };
          const chCur = trackChStats[ch] || { correct: 0, attempted: 0 };
          trackChStats[ch] = { correct: chCur.correct + (correct ? 1 : 0), attempted: chCur.attempted + 1 };
          const chapterStats = { ...s.chapterStats, [track]: trackChStats };

          // PYQ accuracy — only bumped when the calling view passed isPyq.
          const pyqStats = isPyq
            ? { ...s.pyqStats, [track]: { correct: s.pyqStats[track].correct + (correct ? 1 : 0), attempted: s.pyqStats[track].attempted + 1 } }
            : s.pyqStats;

          if (track === "ssc") {
            const ssc = { ...s.ssc };
            ssc.totalAnswered += 1; ssc.mcqDone += 1;
            ssc.currentStreak = correct ? ssc.currentStreak + 1 : 0;
            ssc.bestStreak = Math.max(ssc.bestStreak, ssc.currentStreak);
            if (correct) ssc.totalCorrect += 1;
            const sRec = ssc as unknown as Record<string, number>;
            sRec[`${subj}Answered`] = (sRec[`${subj}Answered`] || 0) + 1;
            if (correct) sRec[`${subj}Correct`] = (sRec[`${subj}Correct`] || 0) + 1;
            if (correct) ssc.totalXp += (10 + (ssc.currentStreak >= 5 ? 5 : 0)) * mult;
            ssc.level = levelFromXp(ssc.totalXp);
            return { ssc, heatmap: newHeat, daily: newDaily, lastStudyDate: today, diffStats, chapterStats, pyqStats, ...boostPatch };
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
            if (correct) cur.totalXp += (10 + (cur.currentStreak >= 5 ? 5 : 0)) * mult;
            cur.level = levelFromXp(cur.totalXp);
            return { subjectStats: { ...s.subjectStats, [track]: cur }, heatmap: newHeat, daily: newDaily, lastStudyDate: today, diffStats, chapterStats, pyqStats, ...boostPatch };
          }
          const chStats = { ...s.chStats };
          const cs = chStats[ch] || { correct: 0, attempted: 0 };
          chStats[ch] = { correct: cs.correct + (correct ? 1 : 0), attempted: cs.attempted + 1 };
          const subjAtt = `${subj}Attempted` as keyof StudyState;
          const subjCor = `${subj}Correct` as keyof StudyState;
          const xpGain = correct ? (10 + (s.currentStreak >= 4 ? 5 : 0)) * mult : 0;
          return {
            totalAnswered: s.totalAnswered + 1,
            mcqDone: s.mcqDone + 1,
            currentStreak: correct ? s.currentStreak + 1 : 0,
            bestStreak: Math.max(s.bestStreak, correct ? s.currentStreak + 1 : s.bestStreak),
            totalCorrect: s.totalCorrect + (correct ? 1 : 0),
            totalXp: s.totalXp + xpGain,
            level: levelFromXp(s.totalXp + xpGain),
            chStats,
            chapterStats,
            pyqStats,
            [subjAtt]: (s[subjAtt] as number) + 1,
            [subjCor]: (s[subjCor] as number) + (correct ? 1 : 0),
            heatmap: newHeat, daily: newDaily, lastStudyDate: today,
            diffStats,
            ...boostPatch,
          } as Partial<StudyState>;
        });
        if (!correct) get().addMistake({ track, qId, ch, subj, q, yourAns, correctAns, exp, diff });
        get().bumpQuest("mcq", 1);
        get().checkAchievements();
        const gained = getTrackXp(get(), track) - prevXp;
        if (gained > 0) get().addCoins(Math.floor(gained / 10));
        if (boosted) get().pushToast("⚡", `2× XP! (${get().xpBoost} boosted answer${get().xpBoost === 1 ? "" : "s"} left)`, "success");
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      advanceAdaptiveTier: (track, correct) => {
        const cur = get().adaptive[track];
        const idx = DIFF_TIERS.indexOf(cur.tier);
        let next: AdaptiveState;
        let tierChanged: { to: DiffTier; up: boolean } | null = null;
        if (correct) {
          const correctRun = cur.correctRun + 1;
          if (correctRun >= 3 && idx < DIFF_TIERS.length - 1) {
            next = { tier: DIFF_TIERS[idx + 1], correctRun: 0, wrongRun: 0 };
            tierChanged = { to: next.tier, up: true };
          } else {
            next = { tier: cur.tier, correctRun, wrongRun: 0 };
          }
        } else {
          const wrongRun = cur.wrongRun + 1;
          if (wrongRun >= 2 && idx > 0) {
            next = { tier: DIFF_TIERS[idx - 1], correctRun: 0, wrongRun: 0 };
            tierChanged = { to: next.tier, up: false };
          } else {
            next = { tier: cur.tier, correctRun: 0, wrongRun };
          }
        }
        set((s) => ({ adaptive: { ...s.adaptive, [track]: next } }));
        if (tierChanged) {
          const label = tierChanged.to[0].toUpperCase() + tierChanged.to.slice(1);
          if (tierChanged.up) get().pushToast("⚡", `Leveled up — now serving ${label} questions`, "success");
          else get().pushToast("🎯", `Easing off — back to ${label} questions`, "info");
        }
      },

      openChapter: (track, chId) => {
        const prevLevel = getTrackLevel(get(), track);
        const prevXp = getTrackXp(get(), track);
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
        const gained = getTrackXp(get(), track) - prevXp;
        if (gained > 0) get().addCoins(Math.floor(gained / 10));
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      revealQA: (track, type, marks) => {
        const prevLevel = getTrackLevel(get(), track);
        const prevXp = getTrackXp(get(), track);
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
        const gained = getTrackXp(get(), track) - prevXp;
        if (gained > 0) get().addCoins(Math.floor(gained / 10));
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      reviewFlash: (track) => {
        const prevLevel = getTrackLevel(get(), track);
        const prevXp = getTrackXp(get(), track);
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
        const gained = getTrackXp(get(), track) - prevXp;
        if (gained > 0) get().addCoins(Math.floor(gained / 10));
        const newLevel = getTrackLevel(get(), track);
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      recordPomo: (mins) => {
        const prevLevel = get().level;
        set((s) => {
          const today = todayStr();
          const newHeat = { ...s.heatmap, [today]: (s.heatmap[today] || 0) + mins };
          const xpGain = 20;
          const newDaily = s.daily.date === today ? { ...s.daily } : { date: today, mcqDone: 0, flashDone: 0, chapRead: 0 };
          return { pomoSessions: s.pomoSessions + 1, pomoMins: s.pomoMins + mins, pomoXp: s.pomoXp + xpGain, totalXp: s.totalXp + xpGain, level: levelFromXp(s.totalXp + xpGain), heatmap: newHeat, daily: newDaily, lastStudyDate: today };
        });
        get().checkAchievements();
        get().addCoins(2);
        const newLevel = get().level;
        if (newLevel > prevLevel) get().showPopup({ type: "level", data: { level: newLevel, icon: "🎉", title: `Level ${newLevel}!`, sub: levelTitle(newLevel) } });
      },

      addMistake: (m) => set((s) => ({ mistakes: [{ ...m, id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: Date.now() }, ...s.mistakes].slice(0, 200) })),
      removeMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),
      tagMistake: (id, category) => set((s) => ({ mistakes: s.mistakes.map((m) => (m.id === id ? { ...m, category } : m)) })),

      recordRecall: (track, ch, marksTotal, marksScored) => set((s) => {
        const trackMap = { ...s.recallStats[track] };
        const cur = trackMap[ch] || { attempts: 0, totalMarks: 0, scoredMarks: 0 };
        trackMap[ch] = {
          attempts: cur.attempts + 1,
          totalMarks: cur.totalMarks + marksTotal,
          scoredMarks: cur.scoredMarks + marksScored,
        };
        return { recallStats: { ...s.recallStats, [track]: trackMap } };
      }),

      recordMockResult: (entry) => set((s) => ({
        mockHistory: [
          { ...entry, id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: Date.now() },
          ...s.mockHistory,
        ].slice(0, 50),
      })),

      logConfidence: (track, level, correct) => set((s) => {
        const trackStats = { ...s.confidenceStats[track] };
        const cur = trackStats[level];
        trackStats[level] = { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 };
        return { confidenceStats: { ...s.confidenceStats, [track]: trackStats } };
      }),

      recordReadinessSnapshot: (track, pct) => set((s) => {
        const today = new Date().toISOString().slice(0, 10);
        const list = s.readinessHistory[track];
        if (list.length > 0 && list[list.length - 1].date === today) {
          // Already snapshotted today — overwrite with the latest reading
          // rather than appending, so re-visiting Analytics later the same
          // day reflects fresh progress instead of stacking duplicates.
          const updated = [...list];
          updated[updated.length - 1] = { date: today, pct };
          return { readinessHistory: { ...s.readinessHistory, [track]: updated } };
        }
        return { readinessHistory: { ...s.readinessHistory, [track]: [...list, { date: today, pct }].slice(-60) } };
      }),

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
        set((s) => ({
          diffStats: { ...s.diffStats, [track]: defaultDiffStatsByTier() },
          adaptive: { ...s.adaptive, [track]: defaultAdaptiveState() },
          chapterStats: { ...s.chapterStats, [track]: {} },
          recallStats: { ...s.recallStats, [track]: {} },
          mockHistory: s.mockHistory.filter((m) => m.track !== track),
          confidenceStats: { ...s.confidenceStats, [track]: { low: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, high: { correct: 0, total: 0 } } },
          pyqStats: { ...s.pyqStats, [track]: { correct: 0, attempted: 0 } },
          readinessHistory: { ...s.readinessHistory, [track]: [] },
        }));
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
        diffStats: defaultDiffStats(), adaptive: defaultAdaptive(),
        chapterStats: defaultTrackRecordMap<ChStat>(), recallStats: defaultTrackRecordMap<RecallStat>(), mockHistory: [],
        confidenceStats: defaultConfidenceStats(),
        pyqStats: defaultPyqStats(),
        readinessHistory: defaultReadinessHistory(),
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
      // Schema version for the persisted (localStorage) shape — bump this
      // whenever a change RESTRUCTURES an existing field (renames it, changes
      // its type, or changes what's nested inside an existing record like
      // `diffStats[track]` or `adaptive[track]`). Adding a brand-new
      // top-level field does NOT need a bump — Zustand's default `merge`
      // shallow-merges persisted state over the fresh initial state, so new
      // top-level fields already default in correctly on their own.
      //
      // Every prior release shipped with no `version` at all, so any
      // localStorage written before this line was added comes back from
      // `createJSONStorage` with `version: undefined` here — treat that as
      // version 0. When you bump this to 2+, add a case in `migrate` that
      // transforms the *old* shape into the *new* one; don't just widen
      // types and hope the shallow merge covers it, since nested-object
      // changes are exactly what the shallow merge can't fix.
      version: 1,
      migrate: (persistedState, fromVersion) => {
        // Nothing has needed a structural migration yet — this is a no-op
        // that documents the pattern for the next one. `persistedState` is
        // whatever was actually in localStorage (partial, and possibly
        // missing fields the current StudyState has), so callers still get
        // it shallow-merged over the fresh defaults after this returns.
        void fromVersion;
        return persistedState as StudyState;
      },
    }
  )
);

// ===== Progress export / import (Settings -> Data) =====
// Every bit of progress lives only in this one browser's localStorage — no
// account, no server, nothing to fall back on if the site data gets
// cleared, the browser is switched, or the device is replaced. These two
// helpers let a person take a manual snapshot and restore it later, on any
// device, without needing a backend.
const PROGRESS_EXPORT_KIND = "studyhub-progress";
// Bumped independently of the persist `version` above — this describes the
// shape of the *export file*, not the live store, though today they hold
// the same fields.
const PROGRESS_EXPORT_VERSION = 1;

export interface ProgressExportFile {
  kind: typeof PROGRESS_EXPORT_KIND;
  exportVersion: number;
  exportedAt: string;
  data: Partial<StudyState>;
}

/** A handful of fields that should always be present on a genuine export —
 *  enough to catch "wrong file" / hand-edited-into-garbage without being so
 *  strict that a future field addition breaks import of an older file. */
const EXPECTED_PROGRESS_KEYS: (keyof StudyState)[] = ["totalXp", "level", "ssc", "theme", "unlockedAch"];

export function buildProgressExport(): ProgressExportFile {
  const s = useStudyStore.getState();
  const { toasts, popup, sidebarOpen, searchOpen, view, track, pendingTutorContext, ...rest } = s;
  void toasts; void popup; void sidebarOpen; void searchOpen; void view; void track; void pendingTutorContext;
  // Strip the action functions too — only the plain-data fields make sense
  // in an export file, and JSON.stringify would drop them anyway.
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (typeof value !== "function") data[key] = value;
  }
  return {
    kind: PROGRESS_EXPORT_KIND,
    exportVersion: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data: data as Partial<StudyState>,
  };
}

export type ImportProgressResult =
  | { ok: true; file: ProgressExportFile }
  | { ok: false; error: string };

/** Checks whether `raw` (already JSON.parsed) is a well-formed, importable
 *  StudyHub export, without applying it. Shared by the "is this a real
 *  export file?" check a UI runs right after reading the file, and by
 *  `applyProgressImport` below — one place decides what counts as valid. */
export function validateProgressExport(raw: unknown): ImportProgressResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "That file doesn't look like a StudyHub export." };
  }
  const file = raw as Partial<ProgressExportFile>;
  if (file.kind !== PROGRESS_EXPORT_KIND || typeof file.data !== "object" || file.data === null) {
    return { ok: false, error: "That file doesn't look like a StudyHub export." };
  }
  const missing = EXPECTED_PROGRESS_KEYS.filter((k) => !(k in (file.data as object)));
  if (missing.length > 0) {
    return { ok: false, error: "That file is missing expected StudyHub data — it may be corrupted or from an unrelated app." };
  }
  if ((file.exportVersion ?? 0) > PROGRESS_EXPORT_VERSION) {
    return { ok: false, error: "This file was exported from a newer version of StudyHub than this app understands. Update the app before importing it." };
  }
  return { ok: true, file: file as ProgressExportFile };
}

/** Applies an already-validated progress file. Overwrites current progress
 *  with whatever's in the file — callers should confirm with the person
 *  before calling this, since it isn't reversible. */
export function applyProgressImport(file: ProgressExportFile): void {
  useStudyStore.setState(file.data as Partial<StudyState>);
}

// Wire the SFX engine to this store's mute preference, lazily — sfx.ts
// can't import the store directly (it would be a circular import since
// the store imports sfx.ts for playAchievement).
bindSfxToggle(() => useStudyStore.getState().soundEnabled);
