// English track achievements (12 badges)
// Reads from the SscState-shaped subjectStats["english"] record via Number() coercion.
import type { Achievement } from "@/lib/achievements";

export const ENGLISH_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_read",
    icon: "📖",
    title: "First Page",
    desc: "Answer your first English MCQ",
    xp: 10,
    check: (s) => Number(s.totalCorrect) >= 1,
  },
  {
    id: "streak5",
    icon: "🔥",
    title: "Word Smith",
    desc: "Get 5 correct answers in a row",
    xp: 35,
    check: (s) => Number(s.bestStreak) >= 5,
  },
  {
    id: "read10",
    icon: "📚",
    title: "Bookworm",
    desc: "Read 10 English chapters",
    xp: 25,
    check: (s) => Number(s.chaptersOpened) >= 10,
  },
  {
    id: "poem_master",
    icon: "🪶",
    title: "Poetry Lover",
    desc: "Answer 5 Poetry MCQs correctly",
    xp: 30,
    // Approximate — per-genre MCQs are not tracked; use mcqDone as proxy.
    check: (s) => Number(s.mcqDone) >= 5,
  },
  {
    id: "essay_expert",
    icon: "✍️",
    title: "Essay Expert",
    desc: "Reveal 5 long-answer model essays",
    xp: 30,
    check: (s) => Number(s.longRevealed) >= 5,
  },
  {
    id: "mock_pass",
    icon: "📝",
    title: "Exam Ready",
    desc: "Complete an English mock test",
    xp: 50,
    // Approximate — mock completion not separately tracked; totalXp ≥ 100 implies a mock was likely completed.
    check: (s) => Number(s.totalXp) >= 100,
  },
  {
    id: "level3",
    icon: "🌟",
    title: "Wordsmith",
    desc: "Reach Level 3 in English",
    xp: 50,
    check: (s) => Number(s.level) >= 3,
  },
  {
    id: "xp300",
    icon: "💫",
    title: "Literary Star",
    desc: "Earn 300 XP in English",
    xp: 25,
    check: (s) => Number(s.totalXp) >= 300,
  },
  {
    id: "flash10",
    icon: "⚡",
    title: "Quick Reader",
    desc: "Review 10 English flashcards",
    xp: 20,
    check: (s) => Number(s.flashDone) >= 10,
  },
  {
    id: "correct25",
    icon: "🏅",
    title: "Comprehension King",
    desc: "Answer 25 English questions correctly",
    xp: 40,
    check: (s) => Number(s.totalCorrect) >= 25,
  },
  {
    id: "all_chapters",
    icon: "🏛️",
    title: "Library Complete",
    desc: "Open all 17 English chapters",
    xp: 30,
    check: (s) => Number(s.chaptersOpened) >= 17,
  },
  {
    id: "streak10",
    icon: "🌪️",
    title: "Eloquent",
    desc: "Get 10 correct answers in a row",
    xp: 75,
    check: (s) => Number(s.bestStreak) >= 10,
  },
];
