"use client";

import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { levelProgress } from "@/lib/achievements";

export function XpBar({ compact = false }: { compact?: boolean }) {
  const track = useStudyStore((s) => s.track);
  const totalXp = useStudyStore((s) => (s.track === "ssc" ? s.ssc.totalXp : s.totalXp));
  const { level, lo, hi, pct } = levelProgress(totalXp);
  const accent = SUBJECT_META[track].accent;

  return (
    <div className={compact ? "w-full" : "w-full px-4 py-2.5"}>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-semibold text-primary tabular-nums">Lv {level}</span>
        <span className="text-muted-foreground/70 tabular-nums text-[10px]">
          {totalXp - lo}/{hi - lo}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-400 transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, boxShadow: `0 0 10px ${accent}90` }}
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
