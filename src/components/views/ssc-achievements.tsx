"use client";

import { Lock } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { SSC_ACHIEVEMENTS, type Achievement } from "@/lib/achievements";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/components/shared/helpers";

// Map SSC achievement id -> { field, target, suffix, label } for progress hints
const HINTS: Record<string, { field: string; target: number; suffix?: string; label?: string }> = {
  ssc_start: { field: "totalAnswered", target: 1 },
  ssc_hist5: { field: "histAnswered", target: 5 },
  ssc_geo5: { field: "geoAnswered", target: 5 },
  ssc_polsci5: { field: "polsciAnswered", target: 5 },
  ssc_eco5: { field: "ecoAnswered", target: 5 },
  ssc_streak5: { field: "bestStreak", target: 5, label: "best" },
  ssc_25: { field: "totalAnswered", target: 25 },
  ssc_all40: { field: "totalAnswered", target: 40 },
  ssc_flash10: { field: "flashDone", target: 10 },
  ssc_chaps5: { field: "chaptersOpened", target: 5 },
  ssc_lv3: { field: "level", target: 3, label: "Lv" },
  ssc_correct10: { field: "totalCorrect", target: 10 },
};

export function SscAchievementsView() {
  const mounted = useMounted();
  const ssc = useStudyStore((s) => s.ssc);

  const state: Record<string, number> = {
    totalXp: ssc.totalXp,
    level: ssc.level,
    totalCorrect: ssc.totalCorrect,
    totalAnswered: ssc.totalAnswered,
    bestStreak: ssc.bestStreak,
    mcqDone: ssc.mcqDone,
    chaptersOpened: ssc.chaptersOpened,
    shortRevealed: ssc.shortRevealed,
    longRevealed: ssc.longRevealed,
    flashDone: ssc.flashDone,
    histAnswered: ssc.histAnswered,
    geoAnswered: ssc.geoAnswered,
    polsciAnswered: ssc.polsciAnswered,
    ecoAnswered: ssc.ecoAnswered,
  };

  const unlockedSet = mounted ? new Set(ssc.unlockedAch) : new Set<string>();
  const xpFromBadges = SSC_ACHIEVEMENTS
    .filter((a) => unlockedSet.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);

  const summary = [
    { label: "Unlocked", value: mounted ? ssc.unlockedAch.length : 0, accent: "text-primary" },
    { label: "Total", value: SSC_ACHIEVEMENTS.length },
    { label: "XP from Badges", value: mounted ? xpFromBadges : 0, accent: "text-primary" },
    { label: "Level", value: mounted ? ssc.level : 1, accent: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          SSC Achievements <span className="inline-block">🏆</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Earn badges as you master Social Science — each badge gives bonus XP!
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
        {SSC_ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedSet.has(a.id);
          const hint = HINTS[a.id];
          const current = hint ? state[hint.field] ?? 0 : 0;
          const pct = hint ? Math.min(100, Math.round((current / hint.target) * 100)) : 0;
          return (
            <SscBadgeCard
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

function SscBadgeCard({
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
