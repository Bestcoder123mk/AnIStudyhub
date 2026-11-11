"use client";

import { useMemo } from "react";
import { Flame, Zap, Coins } from "lucide-react";
import { useStudyStore, SUBJECT_META, getTrackXp } from "@/store/use-study-store";
import { levelProgress } from "@/lib/achievements";
import { useMounted } from "@/components/shared/helpers";

/** Consecutive days with any study activity, ending today — or yesterday, so the streak is still
 *  alive until the day is actually over. Keys match the store's own `toISOString().slice(0, 10)`. */
export function dayStreak(heatmap: Record<string, number>): number {
  const key = (d: Date) => d.toISOString().slice(0, 10);
  const d = new Date();
  if (!(heatmap[key(d)] > 0)) d.setUTCDate(d.getUTCDate() - 1);
  let n = 0;
  while (heatmap[key(d)] > 0) {
    n++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}

/** The three numbers that matter at a glance: day streak, level, coins. Flat colour, no glow. */
export function StatPills({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const heatmap = useStudyStore((s) => s.heatmap);
  const coins = useStudyStore((s) => s.coins);
  const track = useStudyStore((s) => s.track);
  const xp = useStudyStore((s) => getTrackXp(s, track));
  const streak = useMemo(() => dayStreak(heatmap ?? {}), [heatmap]);
  const { level } = levelProgress(xp);
  const accent = SUBJECT_META[track].accent;

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="Your stats">
      <span className="stat-pill" style={{ color: streak > 0 ? "var(--fire)" : "var(--muted-foreground)" }} title="Day streak">
        <Flame className={`size-[1.1em] ${streak > 0 ? "flame-flicker" : ""}`} fill={streak > 0 ? "currentColor" : "none"} strokeWidth={2.4} />
        {mounted ? streak : 0}
      </span>
      <span className="stat-pill" style={{ color: `color-mix(in oklch, ${accent} var(--atm, 100%), black)` }} title="Level">
        <Zap className="size-[1.1em]" fill="currentColor" strokeWidth={2.4} />
        {mounted ? level : 1}
      </span>
      <span className="stat-pill" style={{ color: "var(--gold-text)" }} title="Coins">
        <Coins className="size-[1.1em]" strokeWidth={2.4} />
        {mounted ? coins : 0}
      </span>
    </div>
  );
}
