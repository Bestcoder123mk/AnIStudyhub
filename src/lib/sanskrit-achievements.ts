// Sanskrit track achievements (12 badges)
// Reads from the SscState-shaped subjectStats["sanskrit"] record via Number() coercion.
import type { Achievement } from "@/lib/achievements";

export const SANSKRIT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_translate",
    icon: "🕉️",
    title: "प्रथम अनुवाद",
    desc: "Answer your first Sanskrit MCQ",
    xp: 10,
    check: (s) => Number(s.totalCorrect) >= 1,
  },
  {
    id: "streak5",
    icon: "🔥",
    title: "शब्दकोश",
    desc: "Get 5 correct answers in a row",
    xp: 35,
    check: (s) => Number(s.bestStreak) >= 5,
  },
  {
    id: "translate5",
    icon: "🔁",
    title: "अनुवादक",
    desc: "Use the Sanskrit translator 5 times",
    xp: 25,
    // Approximate — translator uses are not tracked; each translation awards +5 XP, so totalXp ≥ 25 implies ~5 translator sessions.
    check: (s) => Number(s.totalXp) >= 25,
  },
  {
    id: "read10",
    icon: "📖",
    title: "पाठक",
    desc: "Read 10 Shemushi chapters",
    xp: 25,
    check: (s) => Number(s.chaptersOpened) >= 10,
  },
  {
    id: "grammar_guru",
    icon: "🔤",
    title: "व्याकरण गुरु",
    desc: "Answer 10 Vyakaran (grammar) MCQs correctly",
    xp: 30,
    // Approximate — per-topic MCQs are not tracked; use mcqDone as proxy.
    check: (s) => Number(s.mcqDone) >= 10,
  },
  {
    id: "mock_pass",
    icon: "📝",
    title: "परीक्षा तैयार",
    desc: "Complete a Sanskrit mock test",
    xp: 50,
    // Approximate — mock completion not separately tracked; totalXp ≥ 100 implies a mock was likely completed.
    check: (s) => Number(s.totalXp) >= 100,
  },
  {
    id: "level3",
    icon: "🌟",
    title: "विद्वान",
    desc: "Reach Level 3 in Sanskrit",
    xp: 50,
    check: (s) => Number(s.level) >= 3,
  },
  {
    id: "xp300",
    icon: "💫",
    title: "संस्कृत प्रेमी",
    desc: "Earn 300 XP in Sanskrit",
    xp: 25,
    check: (s) => Number(s.totalXp) >= 300,
  },
  {
    id: "flash10",
    icon: "⚡",
    title: "त्वरित पाठक",
    desc: "Review 10 Sanskrit flashcards",
    xp: 20,
    check: (s) => Number(s.flashDone) >= 10,
  },
  {
    id: "correct25",
    icon: "🏆",
    title: "ज्ञानी",
    desc: "Answer 25 Sanskrit questions correctly",
    xp: 40,
    check: (s) => Number(s.totalCorrect) >= 25,
  },
  {
    id: "all_chapters",
    icon: "📜",
    title: "शेमुषी सम्पूर्ण",
    desc: "Open all 12 Sanskrit chapters",
    xp: 30,
    check: (s) => Number(s.chaptersOpened) >= 12,
  },
  {
    id: "streak10",
    icon: "🌪️",
    title: "पण्डित",
    desc: "Get 10 correct answers in a row",
    xp: 75,
    check: (s) => Number(s.bestStreak) >= 10,
  },
];
