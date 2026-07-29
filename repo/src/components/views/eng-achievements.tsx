"use client";

import { Lock } from "lucide-react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/components/shared/helpers";

const ACCENT = SUBJECT_META.english.accent;

// Map achievement id -> { field, target, label } for progress hints
const HINTS: Record<string, { field: string; target: number; label?: string }> = {
  first_q: { field: "totalCorrect", target: 1 },
  streak3: { field: "bestStreak", target: 3, label: "best" },
  streak5: { field: "bestStreak", target: 5, label: "best" },
  streak10: { field: "bestStreak", target: 10, label: "best" },
  correct10: { field: "totalCorrect", target: 10 },
  correct25: { field: "totalCorrect", target: 25 },
  correct50: { field: "totalCorrect", target: 50 },
  allmcq: { field: "mcqDone", target: 70 },
  xp100: { field: "totalXp", target: 100 },
  xp500: { field: "totalXp", target: 500 },
  level3: { field: "level", target: 3, label: "Lv" },
  chapters: { field: "chaptersOpened", target: 13 },
  short5: { field: "shortRevealed", target: 5 },
  long3: { field: "longRevealed", target: 3 },
  flash10: { field: "flashDone", target: 10 },
};

export function EngAchievementsView() {
  const mounted = useMounted();
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const eng = subjectStats["english"];

  const state: Record<string, number> = {
    totalXp: eng?.totalXp ?? 0,
    level: eng?.level ?? 1,
    totalCorrect: eng?.totalCorrect ?? 0,
    totalAnswered: eng?.totalAnswered ?? 0,
    bestStreak: eng?.bestStreak ?? 0,
    mcqDone: eng?.mcqDone ?? 0,
    chaptersOpened: eng?.chaptersOpened ?? 0,
    shortRevealed: eng?.shortRevealed ?? 0,
    longRevealed: eng?.longRevealed ?? 0,
    flashDone: eng?.flashDone ?? 0,
  };

  const unlockedSet = mounted ? new Set(eng?.unlockedAch || []) : new Set<string>();
  const xpFromBadges = ACHIEVEMENTS
    .filter((a) => unlockedSet.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const summary = [
    { label: "Unlocked", value: mounted ? (eng?.unlockedAch?.length ?? 0) : 0 },
    { label: "Total", value: ACHIEVEMENTS.length },
    { label: "XP from Badges", value: mounted ? xpFromBadges : 0 },
    { label: "Level", value: mounted ? (eng?.level ?? 1) : 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header animate-float-up">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: ACCENT }}>
          English Achievements 🏆
        </h1>
        <p className="text-muted-foreground mt-2">
          Earn badges as you master First Flight &amp; Footprints — each badge gives bonus XP!
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summary.map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="py-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: ACCENT }}>{s.value}</div>
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
            <EngBadgeCard
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

function EngBadgeCard({
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
  const accent = ACCENT;
  return (
    <Card
      className={`glass relative overflow-hidden transition-all ${
        unlocked ? "ring-1 shadow-md" : "opacity-60"
      }`}
      style={unlocked ? { boxShadow: `0 0 0 1px ${accent}55` } : undefined}
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
          style={unlocked ? { filter: `drop-shadow(0 0 12px ${accent})` } : undefined}
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
          style={unlocked ? { backgroundColor: `${accent}26`, color: accent } : undefined}
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
                style={{ width: `${pct}%`, backgroundColor: `${accent}b3` }}
              />
            </div>
          </div>
        )}

        {unlocked && (
          <div className="mt-2 text-[10px] uppercase tracking-wider font-semibold" style={{ color: accent }}>
            ✓ Unlocked
          </div>
        )}
      </CardContent>
    </Card>
  );
}
