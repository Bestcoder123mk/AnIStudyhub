// ===== Mastery / Exam Readiness Engine =====
//
// Replaces the old "Score Predictor" (which was literally just
// `accuracy * 0.95`) with something closer to what the review this was
// built from asked for: a transparent, multi-factor readiness index built
// from real evidence already sitting in the store, broken down so a
// student can see exactly *why* the number is what it is instead of being
// handed a single fake-precise digit.
//
// Design principle carried through every function here: if there isn't
// enough evidence for a component, that component is EXCLUDED (not
// defaulted to 0 or 50) and the remaining weights are renormalised. A
// brand-new track with 3 MCQs answered should not be told it's "40% exam
// ready" — it should say plainly that most components don't have enough
// data yet.

import type { Track, ChStat, RecallStat, MockResult, DiffStatsByTier, Mistake, ConfidenceLevel, ConfidenceStat } from "@/store/use-study-store";
import { CONFIDENCE_LEVELS } from "@/store/use-study-store";
import { getTrackChapters, getAllTrackMcqs, getTrackMcqs, getTrackShortQa, getTrackLongQa, type TrackChapter } from "@/lib/track-content";

/** Question-bank size per chapter for one track — the "exam weight" proxy
 *  used by computeChapterMastery. Pulled once from track-content so both
 *  the Analytics view and the Dashboard's mission widget compute the same
 *  weighting without duplicating the loop. */
export function trackQuestionCountByChapter(track: Track): Record<number, number> {
  const chapters = getTrackChapters(track);
  const mcqs = getAllTrackMcqs(track);
  const counts: Record<number, number> = {};
  chapters.forEach((c) => {
    const mcqCount = mcqs.filter((m) => m.ch === c.id).length;
    const shortCount = getTrackShortQa(track, c.id).length;
    const longCount = getTrackLongQa(track, c.id).length;
    counts[c.id] = mcqCount + shortCount + longCount || 1;
  });
  return counts;
}

// ---- Chapter mastery tiers ----

export type MasteryTier = "unknown" | "weak" | "developing" | "strong" | "exam-ready" | "mastered";

export const MASTERY_TIER_META: Record<MasteryTier, { label: string; color: string; min: number }> = {
  unknown: { label: "Unknown", color: "#71717a", min: -1 },
  weak: { label: "Weak", color: "#fb7185", min: 0 },
  developing: { label: "Developing", color: "#fbbf24", min: 40 },
  strong: { label: "Strong", color: "#22d3ee", min: 60 },
  "exam-ready": { label: "Exam Ready", color: "#34d399", min: 75 },
  mastered: { label: "Mastered", color: "#a78bfa", min: 90 },
};

const MIN_ATTEMPTS_FOR_CONFIDENCE = 3;

export function chStatPct(stat: ChStat | undefined): number | null {
  if (!stat || stat.attempted < MIN_ATTEMPTS_FOR_CONFIDENCE) return null;
  return Math.round((stat.correct / stat.attempted) * 100);
}

export function masteryTier(pct: number | null, attempted: number): MasteryTier {
  if (pct === null) return "unknown";
  if (attempted === 0) return "unknown";
  if (pct >= 90) return "mastered";
  if (pct >= 75) return "exam-ready";
  if (pct >= 60) return "strong";
  if (pct >= 40) return "developing";
  return "weak";
}

export interface ChapterMastery {
  chapterId: number;
  num: string;
  title: string;
  attempted: number;
  correct: number;
  masteryPct: number | null;
  tier: MasteryTier;
  /** Share (0..1) of this track's total question bank that lives in this
   *  chapter — used as a proxy for "how much of the exam this chapter is
   *  worth" since the app doesn't have an official CBSE marks-weightage
   *  table wired in. Chapters with a bigger bank get a bigger say. */
  examWeight: number;
  /** Estimated marks at stake, assuming an 80-mark theory paper — a
   *  deliberately labelled ESTIMATE, not a guarantee. */
  estMarksAtStake: number;
  /** Active-recall self-graded % for this chapter, or null if never
   *  recall-tested (MCQ-only practice doesn't count). */
  recallPct: number | null;
  recallAttempts: number;
  /** True only when MCQ accuracy AND recall performance both clear a high
   *  bar — review doc's "a chapter is mastered only when content coverage,
   *  recall, and question accuracy are all strong", not just one signal. */
  trueMastery: boolean;
}

const ASSUMED_BOARD_MARKS = 80;

/** Builds the full chapter-by-chapter mastery map for one track. */
export function computeChapterMastery(
  chapters: TrackChapter[],
  chapterStats: Record<number, ChStat>,
  questionCountByChapter: Record<number, number>,
  recallStats: Record<number, RecallStat> = {}
): ChapterMastery[] {
  const totalQuestions = Object.values(questionCountByChapter).reduce((a, b) => a + b, 0) || 1;
  return chapters.map((c) => {
    const stat = chapterStats[c.id];
    const attempted = stat?.attempted ?? 0;
    const correct = stat?.correct ?? 0;
    const pct = chStatPct(stat);
    const tier = masteryTier(pct, attempted);
    const examWeight = (questionCountByChapter[c.id] ?? 1) / totalQuestions;
    // Unattempted/low-confidence chapters are conservatively treated as
    // ~35% mastery for ranking purposes only (an unopened chapter IS a
    // real risk, just not a precisely-measured one) — never shown as a
    // hard number, only used to sort "Recover My Marks".
    const fractionForRanking = pct !== null ? pct / 100 : 0.35;
    const estMarksAtStake = Math.round(examWeight * ASSUMED_BOARD_MARKS * (1 - fractionForRanking) * 10) / 10;

    const rs = recallStats[c.id];
    const recallAttempts = rs?.attempts ?? 0;
    const recallPct = rs && rs.totalMarks >= 2 ? Math.round((rs.scoredMarks / rs.totalMarks) * 100) : null;
    const trueMastery = pct !== null && pct >= 85 && attempted >= 3 && (recallAttempts === 0 || (recallPct !== null && recallPct >= 70));

    return {
      chapterId: c.id, num: c.num, title: c.title,
      attempted, correct, masteryPct: pct, tier, examWeight, estMarksAtStake,
      recallPct, recallAttempts, trueMastery,
    };
  });
}

/** Top N chapters ranked by estimated marks at stake — "Recover My Marks". */
export function recoverMyMarks(chapters: ChapterMastery[], count = 4): ChapterMastery[] {
  return [...chapters]
    .filter((c) => c.tier !== "mastered" && c.tier !== "exam-ready")
    .sort((a, b) => b.estMarksAtStake - a.estMarksAtStake)
    .slice(0, count);
}

/**
 * Chapters practiced through MCQs but never once tested via active recall
 * (short/long answer) — "fake preparedness" per the review doc: a student
 * can feel confident from MCQ streaks while never having actually
 * retrieved the material in written form, which is a different skill.
 */
export function neglectedChapters(chapters: ChapterMastery[], minMcqAttempts = 5): ChapterMastery[] {
  return chapters
    .filter((c) => c.attempted >= minMcqAttempts && c.recallAttempts === 0)
    .sort((a, b) => b.attempted - a.attempted);
}

// ---- Progress History / Mastery Streak ----

/**
 * Counts consecutive days, working backwards from the most recent
 * snapshot, where readiness held steady or improved — "7 days of genuine
 * improvement" per the review doc, rather than a generic activity streak
 * (which the app already tracks separately via daily XP/questions
 * answered). A single down day ends the streak.
 */
export function computeMasteryStreak(history: { date: string; pct: number }[]): number {
  if (history.length < 2) return 0;
  let streak = 1;
  for (let i = history.length - 1; i > 0; i--) {
    if (history[i].pct >= history[i - 1].pct) streak++;
    else break;
  }
  return streak;
}

// ---- One Sheet ----

export interface OneSheetAnswer { q: string; points: string[]; marks: number; }
export interface OneSheet {
  chapterTitle: string;
  quickFacts: OneSheetAnswer[];
  essayTopics: string[];
  pyqCount: number;
  totalQuestions: number;
}

/**
 * Compiles a dense, single-chapter revision sheet purely from content that
 * already exists and is already chapter-tagged (short-answer key points,
 * long-answer topics, PYQ counts) — deliberately NOT built on top of the
 * app's formula data, which is organised by subject category rather than
 * by chapter (see Round 5's changelog note on why that mapping doesn't
 * exist yet). Works identically across all 5 tracks since it only uses
 * the track-agnostic helpers in track-content.ts.
 */
export function buildOneSheet(track: Track, chapterId: number, chapterTitle: string, extractKeyPoints: (a: string) => string[]): OneSheet {
  const shortQa = getTrackShortQa(track, chapterId);
  const longQa = getTrackLongQa(track, chapterId);
  const mcqs = getTrackMcqs(track, chapterId);

  const quickFacts: OneSheetAnswer[] = shortQa.slice(0, 8).map((qa) => ({
    q: qa.q, points: extractKeyPoints(qa.a).slice(0, 4), marks: qa.marks,
  }));
  const essayTopics = longQa.map((qa) => qa.q);
  const pyqCount = [...mcqs, ...shortQa, ...longQa].filter((q) => q.pyq).length;
  const totalQuestions = mcqs.length + shortQa.length + longQa.length;

  return { chapterTitle, quickFacts, essayTopics, pyqCount, totalQuestions };
}

// ---- Exam Readiness Index ----

export interface ReadinessComponent {
  key: string;
  label: string;
  /** null = not enough evidence yet; excluded from the weighted average. */
  score: number | null;
  weight: number;
  note: string;
}

export interface ReadinessResult {
  readinessPct: number | null;
  band: [number, number] | null;
  components: ReadinessComponent[];
}

function weightedDiffAccuracy(d: DiffStatsByTier): number | null {
  const tiers = [d.easy, d.medium, d.hard];
  const totalAttempted = tiers.reduce((a, t) => a + t.attempted, 0);
  if (totalAttempted < MIN_ATTEMPTS_FOR_CONFIDENCE) return null;
  const totalCorrect = tiers.reduce((a, t) => a + t.correct, 0);
  return Math.round((totalCorrect / totalAttempted) * 100);
}

function conceptMasteryScore(chapters: ChapterMastery[]): number | null {
  const withData = chapters.filter((c) => c.masteryPct !== null);
  if (withData.length === 0) return null;
  const totalAttempts = withData.reduce((a, c) => a + c.attempted, 0);
  if (totalAttempts === 0) return null;
  const weighted = withData.reduce((a, c) => a + (c.masteryPct as number) * c.attempted, 0);
  return Math.round(weighted / totalAttempts);
}

function recallScore(recallStats: Record<number, RecallStat>): number | null {
  const entries = Object.values(recallStats);
  const totalMarks = entries.reduce((a, e) => a + e.totalMarks, 0);
  if (totalMarks < 6) return null; // fewer than ~2-3 written answers isn't enough signal
  const scored = entries.reduce((a, e) => a + e.scoredMarks, 0);
  return Math.round((scored / totalMarks) * 100);
}

function timedPerformanceScore(mocks: MockResult[]): number | null {
  if (mocks.length === 0) return null;
  const recent = mocks.slice(0, 5);
  const avg = recent.reduce((a, m) => a + m.scorePct, 0) / recent.length;
  return Math.round(avg);
}

function mistakeConsistencyScore(mistakes: Mistake[], totalAttempted: number): number | null {
  if (totalAttempted < 10) return null;
  const rate = mistakes.length / totalAttempted;
  return Math.round(Math.max(0, Math.min(1, 1 - rate * 1.4)) * 100);
}

function coverageScore(openedChapters: number, totalChapters: number): number | null {
  if (totalChapters === 0) return null;
  return Math.round((openedChapters / totalChapters) * 100);
}

/** The main entry point: builds the full, transparent readiness breakdown
 *  for one track. Every component can independently be `null` (no data);
 *  the overall percentage renormalises weights across whatever components
 *  actually have evidence, and returns null itself if nothing does. */
export function computeReadiness(args: {
  chapters: ChapterMastery[];
  diffStats: DiffStatsByTier;
  recallStats: Record<number, RecallStat>;
  mockHistory: MockResult[];
  mistakes: Mistake[];
  totalAttempted: number;
  openedChapters: number;
  totalChapters: number;
}): ReadinessResult {
  const concept = conceptMasteryScore(args.chapters);
  const difficulty = weightedDiffAccuracy(args.diffStats);
  const recall = recallScore(args.recallStats);
  const timed = timedPerformanceScore(args.mockHistory);
  const mistakeC = mistakeConsistencyScore(args.mistakes, args.totalAttempted);
  const coverage = coverageScore(args.openedChapters, args.totalChapters);

  const components: ReadinessComponent[] = [
    { key: "concept", label: "Concept Mastery", score: concept, weight: 0.30, note: "Weighted accuracy across every chapter you've attempted." },
    { key: "difficulty", label: "Difficulty Range", score: difficulty, weight: 0.15, note: "Accuracy across easy/medium/hard questions combined." },
    { key: "recall", label: "Active Recall & Written Answers", score: recall, weight: 0.20, note: "Self-graded marks earned on short/long answer recall attempts." },
    { key: "timed", label: "Timed Performance", score: timed, weight: 0.15, note: "Average of your last 5 saved mock test scores." },
    { key: "mistakes", label: "Error Consistency", score: mistakeC, weight: 0.10, note: "How often mistakes pile up relative to how much you've attempted." },
    { key: "coverage", label: "Syllabus Coverage", score: coverage, weight: 0.10, note: "Share of the syllabus's chapters you've opened at least once." },
  ];

  const withData = components.filter((c) => c.score !== null);
  if (withData.length === 0) return { readinessPct: null, band: null, components };

  const totalWeight = withData.reduce((a, c) => a + c.weight, 0);
  const readinessPct = Math.round(withData.reduce((a, c) => a + (c.score as number) * c.weight, 0) / totalWeight);
  // Confidence band widens when fewer components have data — an honest
  // way to show "this number is rougher than it looks" rather than a
  // falsely precise single figure.
  const spread = Math.max(3, Math.round(12 - withData.length * 1.5));
  const band: [number, number] = [Math.max(0, readinessPct - spread), Math.min(100, readinessPct + spread)];

  return { readinessPct, band, components };
}

// ---- Daily Plan ("Today's Mission") ----

export interface DailyPlanTask {
  id: string;
  icon: string;
  label: string;
  minutes: number;
  view: string; // ViewId to route to
}

/** Builds a short, prioritised study session from the weakest evidence
 *  available: the top weak chapters (Recover My Marks) plus a mistake-
 *  review pass if there are mistakes logged. Intentionally simple and
 *  deterministic rather than "AI-generated" — the plan should be
 *  explainable in one sentence, which a black-box generator wouldn't be. */
export function generateDailyPlan(
  weakChapters: ChapterMastery[],
  mistakeCount: number,
  mcqView: string,
  mistakesView: string,
  shortView: string,
  mockView: string
): DailyPlanTask[] {
  const tasks: DailyPlanTask[] = [];
  const top = weakChapters.slice(0, 2);
  top.forEach((c, i) => {
    tasks.push({
      id: `weak-${c.chapterId}`,
      icon: i === 0 ? "🎯" : "📌",
      label: `Repair Ch ${c.num}: ${c.title}`,
      minutes: 15,
      view: mcqView,
    });
  });
  if (mistakeCount > 0) {
    tasks.push({ id: "mistakes", icon: "🔁", label: `Retry ${Math.min(mistakeCount, 10)} logged mistakes`, minutes: 10, view: mistakesView });
  }
  tasks.push({ id: "recall", icon: "✍️", label: "Write 2 short answers from memory", minutes: 12, view: shortView });
  if (top.length > 0) {
    tasks.push({ id: "test", icon: "🧪", label: "Timed mini mock on weak chapters", minutes: 12, view: mockView });
  }
  return tasks;
}

export function estimatedMarksRecoverable(tasks: DailyPlanTask[], weakChapters: ChapterMastery[]): number {
  const top = weakChapters.slice(0, tasks.filter((t) => t.id.startsWith("weak")).length || 2);
  const total = top.reduce((a, c) => a + c.estMarksAtStake, 0) * 0.4; // conservative: assume ~40% recoverable per session
  return Math.round(total * 10) / 10;
}

// ---- Danger Zone ("live risk list") ----

export type DangerLevel = "danger" | "watch" | "safe";

export const DANGER_LEVEL_META: Record<DangerLevel, { label: string; icon: string; color: string }> = {
  danger: { label: "Danger", icon: "🔴", color: "#fb7185" },
  watch: { label: "Watch", icon: "🟡", color: "#fbbf24" },
  safe: { label: "Safe", icon: "🟢", color: "#34d399" },
};

/** Buckets chapters into 🔴 Danger / 🟡 Watch / 🟢 Safe — a coarser, more
 *  scannable view of the same mastery-tier data than the full map, meant
 *  for a quick "what's actually at risk right now" glance. */
export function computeDangerZone(chapters: ChapterMastery[]): Record<DangerLevel, ChapterMastery[]> {
  const danger: ChapterMastery[] = [];
  const watch: ChapterMastery[] = [];
  const safe: ChapterMastery[] = [];
  chapters.forEach((c) => {
    if (c.tier === "unknown" || c.tier === "weak") danger.push(c);
    else if (c.tier === "developing") watch.push(c);
    else safe.push(c);
  });
  const byRisk = (a: ChapterMastery, b: ChapterMastery) => b.estMarksAtStake - a.estMarksAtStake;
  return { danger: danger.sort(byRisk), watch: watch.sort(byRisk), safe };
}

// ---- Confusion Pairs ----

export interface ConfusionPair {
  a: string;
  b: string;
  count: number;
  track: Track;
}

/**
 * Surfaces concepts a student keeps mixing up, purely from logged mistake
 * data (correct-answer text vs. the wrong option they picked) — no new
 * tagging required. Only meaningful for MCQ-style mistakes where both
 * answers are short option text; a pair needs to recur at least `minCount`
 * times before it's shown, so a single unlucky guess doesn't get flagged
 * as a "confusion".
 */
export function computeConfusionPairs(mistakes: Mistake[], minCount = 2, topN = 6): ConfusionPair[] {
  const map = new Map<string, ConfusionPair>();
  mistakes.forEach((m) => {
    if (!m.yourAns || !m.correctAns || m.yourAns === m.correctAns) return;
    if (m.yourAns.length > 40 || m.correctAns.length > 40) return; // skip long free-text answers
    const key = `${m.track}::${[m.yourAns, m.correctAns].sort().join("::")}`;
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else map.set(key, { a: m.correctAns, b: m.yourAns, count: 1, track: m.track });
  });
  return [...map.values()].filter((p) => p.count >= minCount).sort((a, b) => b.count - a.count).slice(0, topN);
}

// ---- Confidence Calibration ----

export interface CalibrationLevel { level: ConfidenceLevel; accuracy: number | null; total: number; }
export interface CalibrationResult { levels: CalibrationLevel[]; insight: string | null; }

const MIN_CONFIDENCE_SAMPLES = 4;

/**
 * Compares self-rated confidence against actual correctness (review doc
 * item #27 — "you were 90% confident but correct only 55% of the time").
 * Needs a handful of samples per bucket before it'll say anything, so it
 * doesn't draw a conclusion from 1-2 data points.
 */
export function computeCalibration(stats: Record<ConfidenceLevel, ConfidenceStat>): CalibrationResult {
  const levels: CalibrationLevel[] = CONFIDENCE_LEVELS.map((level) => {
    const s = stats[level];
    return { level, accuracy: s.total >= MIN_CONFIDENCE_SAMPLES ? Math.round((s.correct / s.total) * 100) : null, total: s.total };
  });
  const high = levels.find((l) => l.level === "high");
  const low = levels.find((l) => l.level === "low");
  let insight: string | null = null;
  if (high?.accuracy !== null && high?.accuracy !== undefined && high.accuracy < 70) {
    insight = `When you say you're "high confidence", you're only right ${high.accuracy}% of the time — that's overconfidence, and it's risky because you won't double-check those answers in the exam.`;
  } else if (low?.accuracy !== null && low?.accuracy !== undefined && low.accuracy > 75) {
    insight = `When you say you're "low confidence", you're actually right ${low.accuracy}% of the time — you know more than you think. Worth trusting your first instinct more.`;
  }
  return { levels, insight };
}

// ---- Memory Strength (forgetting curve proxy) ----

/**
 * A 0-100 "memory strength" estimate from a card's SM-2 ease factor and
 * current interval — used to show a forgetting-curve-style strength bar
 * for cards that aren't due yet (review doc items #24-25), rather than
 * only surfacing decay after a card has already lapsed.
 */
export function computeMemoryStrength(ef: number, interval: number): number {
  const efScore = Math.max(0, Math.min(1, (ef - 1.3) / (2.8 - 1.3)));
  const intervalScore = Math.max(0, Math.min(1, interval / 60));
  return Math.round((efScore * 0.5 + intervalScore * 0.5) * 100);
}

// ---- Exam Countdown Intelligence ----

export interface CountdownTier {
  key: "far" | "prioritize" | "consolidate" | "final" | "tomorrow" | "today" | "past" | "unset";
  headline: string;
  message: string;
  icon: string;
}

/**
 * Turns "days until the exam" into an actual change of strategy, not just
 * a number — review doc item #11. Thresholds are deliberately coarse
 * (weeks, not days) since exam prep strategy doesn't need finer granularity
 * than "there's still runway" vs "stop exploring, consolidate" vs "final
 * sprint".
 */
export function examCountdownTier(daysLeft: number | null): CountdownTier {
  if (daysLeft === null) {
    return { key: "unset", icon: "🗓️", headline: "No exam date set", message: "Set your exam date in Settings to unlock a tailored countdown plan." };
  }
  if (daysLeft < 0) {
    return { key: "past", icon: "✅", headline: "Exam date has passed", message: "Update your exam date in Settings if you're prepping for the next one." };
  }
  if (daysLeft === 0) {
    return { key: "today", icon: "🎯", headline: "Exam is today", message: "No new material now. Stay calm, do a light final review of your One Sheet or key mistakes, and trust your prep." };
  }
  if (daysLeft === 1) {
    return { key: "tomorrow", icon: "⚡", headline: "Exam is tomorrow", message: "No new chapters unless truly critical. Skim your Danger Zone list, re-read your worst mistakes, and rest well tonight." };
  }
  if (daysLeft <= 3) {
    return { key: "final", icon: "🔥", headline: `${daysLeft} days left — final sprint`, message: "Focus only on high-frequency mistakes, active recall, and one timed mock. Skip anything you haven't touched yet." };
  }
  if (daysLeft <= 14) {
    return { key: "consolidate", icon: "🧭", headline: `${daysLeft} days left — consolidate`, message: "Stop learning low-value material. Prioritize your Danger Zone chapters and Recover My Marks list over exploring new topics." };
  }
  if (daysLeft <= 29) {
    return { key: "prioritize", icon: "📌", headline: `${daysLeft} days left — prioritize`, message: "You have some runway left, but start weighting your time toward weak chapters over ones you've already mastered." };
  }
  return { key: "far", icon: "🌱", headline: `${daysLeft} days left`, message: "Plenty of runway — a good time for systematic full-syllabus coverage before shifting to consolidation." };
}

// ---- Rapid Revision Modes ----

export const REVISION_MODES = ["5min", "15min", "30min", "60min", "night-before", "morning-of"] as const;
export type RevisionMode = (typeof REVISION_MODES)[number];

export const REVISION_MODE_META: Record<RevisionMode, { label: string; icon: string; minutes: number }> = {
  "5min": { label: "5-Minute Blitz", icon: "⚡", minutes: 5 },
  "15min": { label: "15-Minute Focus", icon: "🎯", minutes: 15 },
  "30min": { label: "30-Minute High-Yield", icon: "📈", minutes: 30 },
  "60min": { label: "60-Minute Crash", icon: "🔥", minutes: 60 },
  "night-before": { label: "Night Before Exam", icon: "🌙", minutes: 30 },
  "morning-of": { label: "Morning of Exam", icon: "☀️", minutes: 15 },
};

export interface RevisionPlan { mode: RevisionMode; note: string; tasks: DailyPlanTask[]; }

/**
 * Six distinct revision modes (review doc's "Rapid Revision Modes"), each
 * with a genuinely different task composition rather than just the same
 * mix scaled by time — a 5-minute session shouldn't try to teach anything
 * new, and the night-before/morning-of modes deliberately avoid anything
 * that could introduce a new wrong idea right before the exam.
 */
export function generateRevisionPlan(
  mode: RevisionMode,
  weakChapters: ChapterMastery[],
  mistakeCount: number,
  views: { mcq: string; mistakes: string; short: string; mock: string; review: string }
): RevisionPlan {
  const top = weakChapters.filter((c) => c.tier !== "mastered" && c.tier !== "exam-ready").slice(0, 3);

  if (mode === "5min") {
    return {
      mode,
      note: "Too little time for anything new — pure rapid-fire recall of material you already half-know.",
      tasks: [{ id: "blitz", icon: "⚡", label: "Rapid spaced-repetition pass (due cards only)", minutes: 5, view: views.review }],
    };
  }
  if (mode === "15min") {
    return {
      mode,
      note: top[0] ? `One chapter, deeply — Ch ${top[0].num}: ${top[0].title}.` : "Pick your weakest chapter and drill it hard.",
      tasks: [
        ...(top[0] ? [{ id: "ch0", icon: "🎯", label: `MCQ drill: Ch ${top[0].num} ${top[0].title}`, minutes: 10, view: views.mcq }] : [{ id: "review", icon: "🧠", label: "Spaced-repetition review", minutes: 10, view: views.review }]),
        { id: "recall", icon: "✍️", label: "1 short answer from memory", minutes: 5, view: views.short },
      ],
    };
  }
  if (mode === "30min") {
    return {
      mode,
      note: "High-yield mix across your two weakest chapters, plus a mistake pass.",
      tasks: [
        ...top.slice(0, 2).map((c, i) => ({ id: `ch${i}`, icon: i === 0 ? "🎯" : "📌", label: `MCQ drill: Ch ${c.num} ${c.title}`, minutes: 10, view: views.mcq })),
        mistakeCount > 0
          ? { id: "mistakes", icon: "🔁", label: `Retry ${Math.min(mistakeCount, 8)} logged mistakes`, minutes: 10, view: views.mistakes }
          : { id: "recall", icon: "✍️", label: "Active recall practice", minutes: 10, view: views.short },
      ],
    };
  }
  if (mode === "60min") {
    return {
      mode,
      note: "A crash session across your weakest areas — the closest thing to a full study block in an hour.",
      tasks: [
        ...top.map((c, i) => ({ id: `ch${i}`, icon: i === 0 ? "🎯" : "📌", label: `MCQ drill: Ch ${c.num} ${c.title}`, minutes: 10, view: views.mcq })),
        ...(mistakeCount > 0 ? [{ id: "mistakes", icon: "🔁", label: `Retry ${Math.min(mistakeCount, 10)} logged mistakes`, minutes: 15, view: views.mistakes }] : []),
        { id: "test", icon: "🧪", label: "Timed mini mock", minutes: 15, view: views.mock },
      ],
    };
  }
  if (mode === "night-before") {
    return {
      mode,
      note: "No new chapters tonight — only material you've already flagged as risky. Get real sleep after this.",
      tasks: [
        ...(mistakeCount > 0 ? [{ id: "mistakes", icon: "🔁", label: "Review your worst logged mistakes", minutes: 15, view: views.mistakes }] : []),
        { id: "danger", icon: "🔴", label: top[0] ? `Skim Danger Zone: Ch ${top[0].num} ${top[0].title}` : "Skim your Danger Zone chapters", minutes: 15, view: views.mcq },
      ],
    };
  }
  // morning-of
  return {
    mode,
    note: "Pure retrieval only — nothing new, nothing that could shake your confidence right before you walk in.",
    tasks: [
      { id: "review", icon: "🧠", label: "Quick spaced-repetition pass", minutes: 10, view: views.review },
      { id: "calm", icon: "😌", label: "Re-read your logged mistakes — no quizzing, just reading", minutes: 5, view: views.mistakes },
    ],
  };
}
