"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/store/use-study-store";

/**
 * Boss identity per track. Used by BattleView (and reusable as-is by
 * DungeonsView later — same Track union, same component).
 */
export const BOSS_IDENTITY: Record<Track, { name: string; emoji: string }> = {
  science: { name: "The Reaction Warden", emoji: "🧪" },
  ssc: { name: "The Chronicle Keeper", emoji: "🏛️" },
  maths: { name: "The Proof Golem", emoji: "🔢" },
  english: { name: "The Verse Warden", emoji: "📜" },
  sanskrit: { name: "The Shloka Guardian", emoji: "🕉️" },
};

export type BossEvent = { type: "hit" | "miss"; amount: number; nonce: number };

interface BossPanelProps {
  track: Track;
  hp: number; // 0-100
  maxHp?: number;
  event: BossEvent | null;
  /** Override the per-track default — e.g. dungeons.tsx has its own
   * rotating boss-per-chapter emoji/name it wants to keep using. */
  nameOverride?: string;
  emojiOverride?: string;
}

/**
 * A real boss encounter HUD: animated HP bar, hit-flash, screen-shake,
 * floating damage numbers, and an enrage state at low HP. Drop-in — feed it
 * `hp` (0-100) and bump `event.nonce` whenever the player answers.
 */
export function BossPanel({ track, hp, maxHp = 100, event, nameOverride, emojiOverride }: BossPanelProps) {
  const boss = {
    name: nameOverride ?? BOSS_IDENTITY[track].name,
    emoji: emojiOverride ?? BOSS_IDENTITY[track].emoji,
  };
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const enraged = pct > 0 && pct <= 25;
  const defeated = pct <= 0;

  const [shake, setShake] = useState(false);
  const [popups, setPopups] = useState<{ id: number; amount: number; kind: "hit" | "miss" }[]>([]);

  useEffect(() => {
    if (!event) return;
    setPopups((p) => [...p.slice(-4), { id: event.nonce, amount: event.amount, kind: event.type }]);
    if (event.type === "hit") {
      setShake(true);
      const t = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(t);
    }
  }, [event]);

  useEffect(() => {
    if (popups.length === 0) return;
    const t = setTimeout(() => setPopups((p) => p.slice(1)), 950);
    return () => clearTimeout(t);
  }, [popups]);

  return (
    <div
      className={`card-premium grain rounded-2xl p-5 sm:p-6 relative overflow-hidden ${shake ? "animate-shake" : ""}`}
      style={{ boxShadow: enraged ? "0 0 0 1px color-mix(in oklch, oklch(0.65 0.24 25) 45%, transparent), 0 8px 32px -4px color-mix(in oklch, oklch(0.65 0.24 25) 55%, transparent)" : undefined }}
    >
      {/* ambient boss-tinted glow blob */}
      <div
        className="ambient-orb -top-10 -right-10 size-40"
        style={{ background: enraged ? "oklch(0.65 0.24 25)" : "var(--sc, var(--primary))" }}
        aria-hidden
      />

      <div className="relative flex items-center gap-4">
        {/* Medallion */}
        <div className="relative shrink-0">
          <div
            className={`size-16 sm:size-20 rounded-full grid place-items-center text-3xl sm:text-4xl border-2 transition-all duration-300 ${
              defeated
                ? "grayscale opacity-50 border-muted"
                : enraged
                ? "border-red-500/60 animate-glow"
                : "border-subj glow-ring"
            }`}
            style={{ background: "var(--glass)" }}
          >
            {boss.emoji}
          </div>
          {/* floating damage numbers, anchored to the medallion */}
          <div className="pointer-events-none absolute inset-x-0 -top-2 flex flex-col items-center">
            {popups.map((p) => (
              <span
                key={p.id}
                className={`animate-xp-float absolute text-sm sm:text-base font-extrabold tabular-nums ${
                  p.kind === "hit" ? "text-red-400" : "text-muted-foreground"
                }`}
              >
                {p.kind === "hit" ? `-${p.amount}` : "BLOCKED"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="font-bold text-sm sm:text-base truncate">
              {defeated ? `${boss.name} — Defeated` : boss.name}
            </h3>
            {enraged && !defeated && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 animate-glow">
                Enraged
              </span>
            )}
          </div>
          {/* HP bar — deliberately red/orange regardless of subject theme; HP reads as HP */}
          <div className="meter-track">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${pct}%`,
                background: defeated
                  ? "var(--muted)"
                  : "linear-gradient(90deg, oklch(0.75 0.19 45), oklch(0.62 0.22 25))",
                boxShadow: defeated ? "none" : "0 0 12px oklch(0.65 0.22 25 / 0.6)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[11px] text-muted-foreground tabular-nums">
            <span>HP</span>
            <span>{Math.round(pct)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
