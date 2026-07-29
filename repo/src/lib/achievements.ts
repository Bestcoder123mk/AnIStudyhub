// Achievements & levels for StudyHub
// Science track achievements (15) + SSC track achievements (12)

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  xp: number;
  check: (s: Record<string, unknown>) => boolean;
}

// Science track achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_q", icon: "🎯", title: "First Strike", desc: "Answer your first question correctly", xp: 10, check: s => Number(s.totalCorrect) >= 1 },
  { id: "streak3", icon: "🔥", title: "On Fire!", desc: "Get 3 correct answers in a row", xp: 20, check: s => Number(s.bestStreak) >= 3 },
  { id: "streak5", icon: "⚡", title: "Lightning Rod", desc: "Get 5 correct answers in a row", xp: 35, check: s => Number(s.bestStreak) >= 5 },
  { id: "streak10", icon: "🌪️", title: "Unstoppable!", desc: "Get 10 correct answers in a row", xp: 75, check: s => Number(s.bestStreak) >= 10 },
  { id: "correct10", icon: "✅", title: "Getting Started", desc: "Answer 10 questions correctly", xp: 20, check: s => Number(s.totalCorrect) >= 10 },
  { id: "correct25", icon: "🏅", title: "Bronze Scholar", desc: "Answer 25 questions correctly", xp: 40, check: s => Number(s.totalCorrect) >= 25 },
  { id: "correct50", icon: "🥈", title: "Silver Scientist", desc: "Answer 50 questions correctly", xp: 80, check: s => Number(s.totalCorrect) >= 50 },
  { id: "allmcq", icon: "🏆", title: "MCQ Champion", desc: "Complete all 70 MCQ questions", xp: 100, check: s => Number(s.mcqDone) >= 70 },
  { id: "xp100", icon: "💫", title: "Energy Surge", desc: "Earn 100 XP total", xp: 15, check: s => Number(s.totalXp) >= 100 },
  { id: "xp500", icon: "💥", title: "Power Overload", desc: "Earn 500 XP total", xp: 30, check: s => Number(s.totalXp) >= 500 },
  { id: "level3", icon: "🌟", title: "Rising Star", desc: "Reach Level 3", xp: 50, check: s => Number(s.level) >= 3 },
  { id: "chapters", icon: "📚", title: "Bookworm", desc: "Open all 13 chapters", xp: 20, check: s => Number(s.chaptersOpened) >= 13 },
  { id: "short5", icon: "✍️", title: "Short Thinker", desc: "Reveal 5 short-answer model answers", xp: 15, check: s => Number(s.shortRevealed) >= 5 },
  { id: "long3", icon: "📜", title: "Essay Expert", desc: "Read 3 long-answer model answers", xp: 20, check: s => Number(s.longRevealed) >= 3 },
  { id: "flash10", icon: "⚡", title: "Flash Master", desc: "Complete 10 flashcard reviews", xp: 20, check: s => Number(s.flashDone) >= 10 },
];

// SSC track achievements
export const SSC_ACHIEVEMENTS: Achievement[] = [
  { id: "ssc_start", icon: "🌏", title: "Global Citizen", desc: "Answer your first SSC question", xp: 15, check: s => Number(s.totalAnswered) >= 1 },
  { id: "ssc_hist5", icon: "🏛️", title: "History Buff", desc: "Answer 5 History MCQs", xp: 25, check: s => Number(s.histAnswered) >= 5 },
  { id: "ssc_geo5", icon: "🌍", title: "Geo Explorer", desc: "Answer 5 Geography MCQs", xp: 25, check: s => Number(s.geoAnswered) >= 5 },
  { id: "ssc_polsci5", icon: "⚖️", title: "Democracy Champ", desc: "Answer 5 Pol. Science MCQs", xp: 25, check: s => Number(s.polsciAnswered) >= 5 },
  { id: "ssc_eco5", icon: "💰", title: "Young Economist", desc: "Answer 5 Economics MCQs", xp: 25, check: s => Number(s.ecoAnswered) >= 5 },
  { id: "ssc_streak5", icon: "🔥", title: "On Fire!", desc: "5 SSC MCQs correct in a row", xp: 50, check: s => Number(s.bestStreak) >= 5 },
  { id: "ssc_25", icon: "📚", title: "SSC Champion", desc: "Complete 25 SSC MCQs", xp: 75, check: s => Number(s.totalAnswered) >= 25 },
  { id: "ssc_all40", icon: "🏆", title: "Board Ready", desc: "Complete all 40 SSC MCQs", xp: 100, check: s => Number(s.totalAnswered) >= 40 },
  { id: "ssc_flash10", icon: "⚡", title: "Flash Master", desc: "Complete 10 SSC flashcards", xp: 30, check: s => Number(s.flashDone) >= 10 },
  { id: "ssc_chaps5", icon: "📖", title: "Thorough Reader", desc: "Open 5 different SSC chapters", xp: 40, check: s => Number(s.chaptersOpened) >= 5 },
  { id: "ssc_lv3", icon: "🌟", title: "Rising Star", desc: "Reach Level 3 in SSC", xp: 60, check: s => Number(s.level) >= 3 },
  { id: "ssc_correct10", icon: "💎", title: "High Accuracy", desc: "Get 10 SSC answers correct", xp: 35, check: s => Number(s.totalCorrect) >= 10 },
];

// XP thresholds per level (index 0 = level 1 start, etc.)
export const LEVELS = [0, 100, 250, 500, 800, 1200, 1700, 2400, 3200, 4200, 5500, 7000, 9000, 11500, 14500, 18000];

export function levelFromXp(totalXp: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i]) return i + 1;
  }
  return 1;
}

export function levelProgress(totalXp: number): { level: number; lo: number; hi: number; pct: number } {
  const level = levelFromXp(totalXp);
  const lo = LEVELS[level - 1] ?? 0;
  const hi = LEVELS[level] ?? LEVELS[LEVELS.length - 1] + 2000;
  const pct = Math.min(100, Math.round(((totalXp - lo) / Math.max(1, hi - lo)) * 100));
  return { level, lo, hi, pct };
}
