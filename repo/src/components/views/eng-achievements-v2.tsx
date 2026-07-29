"use client";

import { Lock } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { type Achievement } from "@/lib/achievements";
import { ENGLISH_ACHIEVEMENTS } from "@/lib/english-achievements";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/components/shared/helpers";

// English accent (rose) — matches SUBJECT_META.english.accent
const ACCENT = "#f472b6";

// Map achievement id -> { field, target, suffix, label } for progress hints.
// All fields exist on the SscState shape used by subjectStats["english"].
const HINTS: Record<string, { field: string; target: number; suffix?: string; label?: string }> = {
  first_read: { field: "totalCorrect", target: 1, suffix: " correct" },
  streak5: { field: "bestStreak", target: 5, label: "best", suffix: " streak" },
  read10: { field: "chaptersOpened", target: 10, suffix: " / 10" },
  poem_master: { field: "mcqDone", target: 5, suffix: " MCQs" },
  essay_expert: { field: "longRevealed", target: 5, suffix: " essays" },
  mock_pass: { field: "totalXp", target: 100, suffix: " XP" },
  level3: { field: "level", target: 3, label: "Lv" },
  xp300: { field: "totalXp", target: 300, suffix: " XP" },
  flash10: { field: "flashDone", target: 10, suffix: " cards" },
  correct25: { field: "totalCorrect", target: 25, suffix: " correct" },
  all_chapters: { field: "chaptersOpened", target: 17, suffix: " / 17" },
  streak10: { field: "bestStreak", target: 10, label: "best", suffix: " streak" },
};

export function EngAchievementsV2() {
  const mounted = useMounted();
  const subjectStats = useStudyStore((s) => s.subjectStats);

  const stats = subjectStats["english"];

  const state: Record<string, number> = {
    totalXp: stats?.totalXp ?? 0,
    level: stats?.level ?? 1,
    totalCorrect: stats?.totalCorrect ?? 0,
    totalAnswered: stats?.totalAnswered ?? 0,
    bestStreak: stats?.bestStreak ?? 0,
    mcqDone: stats?.mcqDone ?? 0,
    chaptersOpened: stats?.chaptersOpened ?? 0,
    shortRevealed: stats?.shortRevealed ?? 0,
    longRevealed: stats?.longRevealed ?? 0,
    flashDone: stats?.flashDone ?? 0,
  };

  const unlockedAch = mounted && stats ? stats.unlockedAch : [];
  const unlockedSet = new Set(unlockedAch);
  const xpFromBadges = ENGLISH_ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).reduce(
    (sum, a) => sum + a.xp,
    0,
  );

  const summary = [
    { label: "Unlocked", value: unlockedAch.length, accent: true },
    { label: "Total", value: ENGLISH_ACHIEVEMENTS.length, accent: false },
    { label: "XP from Badges", value: xpFromBadges, accent: true },
    { label: "Level", value: stats?.level ?? 1, accent: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header animate-float-up">
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: ACCENT }}
        >
          English Achievements 🏆
        </h1>
        <p className="text-muted-foreground mt-2">
          12 subject-themed badges — earn bonus XP as you master First Flight, Footprints &
          Poetry!
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summary.map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="py-4 text-center">
              <div
                className="text-2xl sm:text-3xl font-bold tabular-nums"
                style={s.accent ? { color: ACCENT } : undefined}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ENGLISH_ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedSet.has(a.id);
          const hint = HINTS[a.id];
          const current = hint ? state[hint.field] ?? 0 : 0;
          const pct = hint
            ? Math.min(100, Math.round((current / hint.target) * 100))
            : 0;
          return (
            <EngBadgeCardV2
              key={a.id}
              a={a}
              unlocked={unlocked}
              hint={
                hint && !unlocked
                  ? `${hint.label ? hint.label + " " : ""}${current}/${hint.target}${hint.suffix || ""}`
                  : null
              }
              pct={pct}
            />
          );
        })}
      </div>

      {!mounted && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

function EngBadgeCardV2({
  a,
  unlocked,
  hint,
  pct,
}: {
  a: Achievement;
  unlocked: boolean;
  hint: string | null;
  pct: number;
}) {
  return (
    <Card
      className={`glass relative overflow-hidden transition-all ${
        unlocked ? "shadow-md" : "opacity-60"
      }`}
      style={
        unlocked
          ? { boxShadow: `0 0 0 1px ${ACCENT}55`, borderColor: `${ACCENT}33` }
          : undefined
      }
    >
      <CardContent className="py-4 flex flex-col items-center text-center">
        {/* Lock overlay */}
        {!unlocked && (
          <div className="absolute top-2 right-2 text-muted-foreground/70">
            <Lock className="size-3.5" />
          </div>
        )}

        {/* Emoji icon */}
        <div
          className={`text-4xl sm:text-5xl mb-2 transition-all ${
            unlocked ? "" : "grayscale opacity-50"
          }`}
          style={unlocked ? { filter: `drop-shadow(0 0 12px ${ACCENT})` } : undefined}
        >
          {a.icon}
        </div>

        {/* Title */}
        <h3 className={`text-sm font-semibold ${unlocked ? "" : "text-muted-foreground"}`}>
          {a.title}
        </h3>

        {/* Desc */}
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">
          {a.desc}
        </p>

        {/* XP reward */}
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            unlocked ? "" : "bg-muted text-muted-foreground"
          }`}
          style={unlocked ? { backgroundColor: `${ACCENT}26`, color: ACCENT } : undefined}
        >
          +{a.xp} XP
        </div>

        {/* Progress hint */}
        {hint && (
          <div className="mt-2 w-full">
            <div className="text-[10px] text-muted-foreground mb-1">{hint}</div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: ACCENT }}
              />
            </div>
          </div>
        )}

        {unlocked && (
          <div
            className="mt-2 text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: ACCENT }}
          >
            ✓ Unlocked
          </div>
        )}
      </CardContent>
    </Card>
  );
}
