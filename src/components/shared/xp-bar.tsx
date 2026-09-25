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
    <div className={compact ? "w-full" : "w-full px-4 py-2.5"}>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-bold text-foreground tabular-nums">Lv {level}</span>
        <span className="text-muted-foreground/70 tabular-nums text-[10px]">
          {totalXp - lo}/{hi - lo}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, boxShadow: `0 0 8px ${accent}70` }}
        />
      </div>
      {!compact && (
        <div className="text-[9px] text-muted-foreground/50 mt-1 tabular-nums">
          {SUBJECT_META[track].label} · {totalXp} XP
        </div>
      )}
    </div>
  );
}
