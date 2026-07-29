"use client";

import { Lock } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/components/shared/helpers";

// Maths accent (cyan) — local constant.
const ACCENT = "#22d3ee";

// Map ACHIEVEMENTS id -> { field, target, label } for progress hints.
// All these fields exist on the generic SscState shape used by subjectStats["maths"].
const HINTS: Record<string, { field: string; target: number; label?: string }> = {
  first_q: { field: "totalCorrect", target: 1 },
  streak3: { field: "bestStreak", target: 3, label: "best" },
  streak5: { field: "bestStreak", target: 5, label: "best" },
  streak10: { field: "bestStreak", target: 10, label: "best" },
  correct10: { field: "totalCorrect", target: 10 },
  correct25: { field: "totalCorrect", target: 25 },
  correct50: { field: "totalCorrect", target: 50 },
  allmcq: { field: "mcqDone", target: 40 },
  xp100: { field: "totalXp", target: 100 },
  xp500: { field: "totalXp", target: 500 },
  level3: { field: "level", target: 3, label: "Lv" },
  chapters: { field: "chaptersOpened", target: 13 },
  short5: { field: "shortRevealed", target: 5 },
  long3: { field: "longRevealed", target: 3 },
  flash10: { field: "flashDone", target: 10 },
};

export function MathsAchievementsView() {
  const mounted = useMounted();
  const subjectStats = useStudyStore((s) => s.subjectStats);

  const stats = subjectStats["maths"];

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
  const xpFromBadges = ACHIEVEMENTS
    .filter((a) => unlockedSet.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const summary = [
    { label: "Unlocked", value: unlockedAch.length, accent: `color: ${ACCENT}` },
    { label: "Total", value: ACHIEVEMENTS.length },
    { label: "XP from Badges", value: xpFromBadges, accent: `color: ${ACCENT}` },
    { label: "Level", value: stats?.level ?? 1, accent: `color: ${ACCENT}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: ACCENT }}>
          Maths Achievements 🏆
        </h1>
        <p className="text-muted-foreground mt-2">
          Earn badges as you master Mathematics — each badge gives bonus XP!
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
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedSet.has(a.id);
          const hint = HINTS[a.id];
          const current = hint ? state[hint.field] ?? 0 : 0;
          const pct = hint ? Math.min(100, Math.round((current / hint.target) * 100)) : 0;
          return (
            <MathsBadgeCard
              key={a.id}
              a={a}
              unlocked={unlocked}
              hint={
                hint && !unlocked
                  ? `${hint.label ? hint.label + " " : ""}${current}/${hint.target}`
                  : null
              }
              pct={pct}
            />
          );
        })}
      </div>

      {!mounted && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

function MathsBadgeCard({
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
      style={unlocked ? { boxShadow: `0 0 0 1px ${ACCENT}40`, borderColor: `${ACCENT}33` } : undefined}
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
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">{a.desc}</p>

        {/* XP reward */}
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            unlocked ? "" : "bg-muted text-muted-foreground"
          }`}
          style={unlocked ? { backgroundColor: `${ACCENT}22`, color: ACCENT } : undefined}
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
