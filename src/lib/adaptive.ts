// The adaptive-difficulty engine — one shared implementation used by every
// subject's MCQ view, replacing what used to be three different, mutually
// inconsistent "⚡ Adaptive" behaviors (weak-topic sort in Science/SSC,
// fixed easy→hard order in Maths, nothing at all in English/Sanskrit).
//
// How it works: each track has a "current tier" (see AdaptiveState in the
// store), which moves up after 3 correct answers in a row at that tier and
// down after 2 wrong answers in a row (see `advanceAdaptiveTier` in
// use-study-store.ts). This file is the other half — picking *which*
// question to show next, given that tier.
import { DIFF_TIERS, type DiffTier } from "@/store/use-study-store";

export interface AdaptiveQuestion {
  id: number;
  diff: string;
}

/**
 * Picks a random unanswered question at the given tier. If none remain at
 * that exact tier (a real risk — e.g. English has only 1 hard-tagged MCQ in
 * its whole bank), falls back to the nearest tier that still has questions,
 * checking one step away first (medium before easy when hard is asked for
 * from hard, etc.), then widening outward. Returns null only if the whole
 * pool is empty.
 */
export function pickAdaptiveQuestion<T extends AdaptiveQuestion>(
  pool: T[],
  tier: DiffTier
): T | null {
  if (pool.length === 0) return null;
  const startIdx = DIFF_TIERS.indexOf(tier);
  // Search outward from the requested tier: [0], [-1,+1], [-2,+2], ...
  for (let offset = 0; offset < DIFF_TIERS.length; offset++) {
    const candidates: DiffTier[] = offset === 0
      ? [DIFF_TIERS[startIdx]]
      : [DIFF_TIERS[startIdx - offset], DIFF_TIERS[startIdx + offset]].filter(
          (t): t is DiffTier => t !== undefined
        );
    for (const t of candidates) {
      const atTier = pool.filter((q) => q.diff === t);
      if (atTier.length > 0) {
        return atTier[Math.floor(Math.random() * atTier.length)];
      }
    }
  }
  // Every question in the pool has an unrecognized `diff` value — fall back
  // to any remaining question rather than returning null.
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Human-readable label + color class for a tier, for the "Adaptive: Medium" badge. */
export function tierMeta(tier: DiffTier): { label: string; cls: string } {
  if (tier === "easy") return { label: "Easy", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  if (tier === "hard") return { label: "Hard", cls: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
  return { label: "Medium", cls: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
}
