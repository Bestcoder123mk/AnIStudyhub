"use client";

import { tierMeta } from "@/lib/adaptive";
import type { DiffTier } from "@/store/use-study-store";

/**
 * The "Serving: Medium ⚡" indicator shown under the filter pills whenever
 * Adaptive mode is active. One shared component for all 5 subjects' MCQ
 * views, with a small dot-progress readout instead of a wall of text —
 * filled dots count toward leveling up (green) or easing off (rose).
 */
export function AdaptiveTierBadge({
  tier,
  correctRun,
  wrongRun,
}: {
  tier: DiffTier;
  correctRun: number;
  wrongRun: number;
}) {
  const meta = tierMeta(tier);
  const pips =
    correctRun > 0
      ? { count: 3, filled: correctRun, tone: "up" as const, title: "Correct in a row to level up" }
      : wrongRun > 0
      ? { count: 2, filled: wrongRun, tone: "down" as const, title: "Wrong in a row to ease off" }
      : null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground -mt-1">
      <span>⚡ Adaptive · serving</span>
      <span className={`font-semibold px-2 py-0.5 rounded-md border ${meta.cls}`}>{meta.label}</span>
      {pips && (
        <span className="flex items-center gap-1" title={pips.title}>
          {Array.from({ length: pips.count }).map((_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full transition-colors duration-300 ${
                i < pips.filled ? (pips.tone === "up" ? "bg-emerald-400" : "bg-rose-400") : "bg-muted"
              }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}
