"use client";

import { Lock } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/components/shared/helpers";

// Map achievement id -> { field, target, suffix } for progress hints
const HINTS: Record<string, { field: string; target: number; suffix?: string; label?: string }> = {
  first_q: { field: "totalCorrect", target: 1 },
  streak3: { field: "bestStreak", target: 3, label: "best" },
  streak5: { field: "bestStreak", target: 5, label: "best" },
  streak10: { field: "bestStreak", target: 10, label: "best" },
  correct10: { field: "totalCorrect", target: 10 },
  correct25: { field: "totalCorrect", target: 25 },
  correct50: { field: "totalCorrect", target: 50 },
  allmcq: { field: "mcqDone", target: 70 },
  xp100: { field: "totalXp", target: 100, suffix: " XP" },
  xp500: { field: "totalXp", target: 500, suffix: " XP" },
  level3: { field: "level", target: 3, label: "Lv" },
  chapters: { field: "chaptersOpened", target: 13 },
  short5: { field: "shortRevealed", target: 5 },
  long3: { field: "longRevealed", target: 3 },
  flash10: { field: "flashDone", target: 10 },
};

export function AchievementsView() {
  const mounted = useMounted();
  const unlockedAch = useStudyStore((s) => s.unlockedAch);
  const level = useStudyStore((s) => s.level);
  const totalXp = useStudyStore((s) => s.totalXp);
  const totalCorrect = useStudyStore((s) => s.totalCorrect);
  const bestStreak = useStudyStore((s) => s.bestStreak);
  const mcqDone = useStudyStore((s) => s.mcqDone);
  const chaptersOpened = useStudyStore((s) => s.chaptersOpened);
  const shortRevealed = useStudyStore((s) => s.shortRevealed);
  const longRevealed = useStudyStore((s) => s.longRevealed);
  const flashDone = useStudyStore((s) => s.flashDone);

  const state: Record<string, number> = {
    totalXp, level, totalCorrect, bestStreak, mcqDone,
    chaptersOpened, shortRevealed, longRevealed, flashDone,
  };

  const unlockedSet = mounted ? new Set(unlockedAch) : new Set<string>();
  const xpFromBadges = ACHIEVEMENTS
    .filter((a) => unlockedSet.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const summary = [
    { label: "Unlocked", value: mounted ? unlockedAch.length : 0, accent: "text-primary" },
    { label: "Total", value: ACHIEVEMENTS.length },
    { label: "XP from Badges", value: mounted ? xpFromBadges : 0, accent: "text-primary" },
    { label: "Level", value: mounted ? level : 1, accent: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Achievements <span className="inline-block">🏆</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Earn badges as you study — each badge gives bonus XP!
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summary.map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="py-4 text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${s.accent || ""}`}>{s.value}</div>
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
            <BadgeCard
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

function BadgeCard({
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
        unlocked ? "ring-1 ring-primary/40 shadow-md" : "opacity-60"
      }`}
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
          style={unlocked ? { filter: "drop-shadow(0 0 12px var(--primary))" } : undefined}
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
            unlocked
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          +{a.xp} XP
        </div>

        {/* Progress hint */}
        {hint && (
          <div className="mt-2 w-full">
            <div className="text-[10px] text-muted-foreground mb-1">{hint}</div>
            <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary/70 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {unlocked && (
          <div className="mt-2 text-[10px] uppercase tracking-wider text-primary font-semibold">
            ✓ Unlocked
          </div>
        )}
      </CardContent>
    </Card>
  );
}
