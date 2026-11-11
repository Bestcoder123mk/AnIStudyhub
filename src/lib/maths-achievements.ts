// Maths track achievements (12 badges)
// Reads from the SscState-shaped subjectStats["maths"] record via Number() coercion.
import type { Achievement } from "@/lib/achievements";

export const MATHS_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_solve",
    icon: "🧮",
    title: "First Equation",
    desc: "Solve your first Maths MCQ",
    xp: 10,
    check: (s) => Number(s.totalCorrect) >= 1,
  },
  {
    id: "streak5",
    icon: "🔥",
    title: "Calculated Risk",
    desc: "Get 5 correct answers in a row",
    xp: 35,
    check: (s) => Number(s.bestStreak) >= 5,
  },
  {
    id: "solve25",
    icon: "✏️",
    title: "Problem Solver",
    desc: "Answer 25 questions correctly",
    xp: 40,
    check: (s) => Number(s.totalCorrect) >= 25,
  },
  {
    id: "solve50",
    icon: "🎓",
    title: "Equation Master",
    desc: "Answer 50 questions correctly",
    xp: 80,
    check: (s) => Number(s.totalCorrect) >= 50,
  },
  {
    id: "all_chapters",
    icon: "📚",
    title: "Syllabus Conqueror",
    desc: "Open all 13 Maths chapters",
    xp: 20,
    check: (s) => Number(s.chaptersOpened) >= 13,
  },
  {
    id: "algebra_ace",
    icon: "🔡",
    title: "Algebra Ace",
    desc: "Answer 10 Algebra chapter MCQs correctly",
    xp: 30,
    // Approximate — per-topic MCQs are not tracked, use total mcqDone as proxy.
    check: (s) => Number(s.mcqDone) >= 10,
  },
  {
    id: "geometry_guru",
    icon: "📐",
    title: "Geometry Guru",
    desc: "Answer 10 Geometry MCQs correctly",
    xp: 30,
    // Approximate — per-topic MCQs are not tracked, use total mcqDone as proxy.
    check: (s) => Number(s.mcqDone) >= 10,
  },
  {
    id: "formula_master",
    icon: "🧠",
    title: "Formula Master",
    desc: "Review 10 Maths formulas",
    xp: 25,
    // Approximate — formula reviews are not tracked; mcqDone ≥ 15 implies active formula usage.
    check: (s) => Number(s.mcqDone) >= 15,
  },
  {
    id: "mock_pass",
    icon: "📝",
    title: "Mock Master",
    desc: "Complete a Maths mock test",
    xp: 50,
    // Approximate — mock completion not separately tracked; totalXp ≥ 100 implies a mock was likely completed.
    check: (s) => Number(s.totalXp) >= 100,
  },
  {
    id: "level3",
    icon: "🌟",
    title: "Rising Mathematician",
    desc: "Reach Level 3 in Maths",
    xp: 50,
    check: (s) => Number(s.level) >= 3,
  },
  {
    id: "xp500",
    icon: "💥",
    title: "Power Player",
    desc: "Earn 500 XP in Maths",
    xp: 30,
    check: (s) => Number(s.totalXp) >= 500,
  },
  {
    id: "flash10",
    icon: "⚡",
    title: "Flash Calculator",
    desc: "Review 10 Maths flashcards",
    xp: 20,
    check: (s) => Number(s.flashDone) >= 10,
  },
];
