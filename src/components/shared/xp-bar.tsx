"use client";

import { useStudyStore, SUBJECT_META, getTrackXp } from "@/store/use-study-store";
import { levelProgress } from "@/lib/achievements";

export function XpBar({ compact = false }: { compact?: boolean }) {
  const track = useStudyStore((s) => s.track);
  // Resolved through the single canonical helper — previously this read
  // s.totalXp directly for every non-SSC track, which meant Maths/English/
  // Sanskrit all silently showed Science's XP here. See getTrackXp in the store.
  const totalXp = useStudyStore((s) => getTrackXp(s, track));
  const { level, lo, hi, pct } = levelProgress(totalXp);
  const accent = SUBJECT_META[track].accent;

  return (
    <div className={compact ? "w-full px-3 pb-2" : "w-full px-4 py-2.5"}>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="font-extrabold tabular-nums text-foreground">Level {level}</span>
        <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
          {totalXp - lo} / {hi - lo} XP
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[color-mix(in_oklch,var(--edge)_70%,var(--background))]">
        <div className="relative h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: accent }}>
          <span className="duo-shine" />
        </div>
      </div>
      {!compact && (
        <div className="mt-1 text-[10px] font-bold tabular-nums text-muted-foreground">
          {SUBJECT_META[track].label} · {totalXp} XP
        </div>
      )}
    </div>
  );
}
