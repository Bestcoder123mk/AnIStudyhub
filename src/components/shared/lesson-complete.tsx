"use client";

/**
 * "Lesson complete" — the payoff screen. Duolingo's loop is short lesson → celebration → next, so practice is
 * chunked into 10-question lessons (LESSON_SIZE) and ends here, with real stats, a mascot reaction and the day
 * streak, instead of an endless question feed.
 */

import { useEffect, useMemo } from "react";
import { Flame } from "lucide-react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";
import { dayStreak } from "@/components/shared/stat-pills";
import { readableTextColor } from "@/components/shared/helpers";
import { playComplete } from "@/lib/sfx";

export const LESSON_SIZE = 10;

function Tile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: color }}>
      <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider" style={{ background: color, color: readableTextColor(color) }}>
        {label}
      </div>
      <div className="grid place-items-center bg-card py-3.5 text-2xl font-black tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

const CONFETTI = ["#34d399", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#fb923c"];

export function LessonComplete({ track, accuracy, correct, answered, xp, onContinue, continueLabel = "Continue" }: {
  track: Track; accuracy: number; correct: number; answered: number; xp: number; onContinue: () => void; continueLabel?: string;
}) {
  const setView = useStudyStore((s) => s.setView);
  const heatmap = useStudyStore((s) => s.heatmap);
  const streak = useMemo(() => dayStreak(heatmap ?? {}), [heatmap]);
  const mood = accuracy >= 70 ? "cheer" : accuracy >= 40 ? "happy" : "sad";
  const title = accuracy >= 90 ? "Perfect lesson!" : accuracy >= 70 ? "Lesson complete!" : accuracy >= 40 ? "Good effort!" : "Keep going!";
  const sub = accuracy >= 70 ? "That's how it sticks. Nice work." : accuracy >= 40 ? "Every question you review makes the next one easier." : "Mistakes are how this works. Try this chapter again.";
  const pieces = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({ c: CONFETTI[i % CONFETTI.length], l: (i * 37) % 100, dx: ((i * 53) % 120) - 60, r: ((i * 97) % 720) - 360, d: 2.2 + ((i * 13) % 14) / 10, dl: ((i * 29) % 9) / 10 })),
    []
  );

  useEffect(() => { playComplete(); }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[70] overflow-y-auto bg-background animate-float-up">
    <div className="relative mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-8 text-center">
      {accuracy >= 70 && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {pieces.map((p, i) => (
            <span key={i} className="confetti-piece" style={{ left: `${p.l}%`, background: p.c, ["--dx" as string]: `${p.dx}px`, ["--r" as string]: `${p.r}deg`, ["--d" as string]: `${p.d}s`, ["--dl" as string]: `${p.dl}s` }} />
          ))}
        </div>
      )}
      <Mascot mood={mood} size={150} bounce className="mx-auto" />
      <h2 className="mt-1 font-display text-3xl font-black tracking-tight">{title}</h2>
      <p className="mx-auto mt-1 max-w-xs text-sm font-bold text-muted-foreground">{sub}</p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Tile label="Total XP" value={`+${xp}`} color="#fbbf24" />
        <Tile label="Accuracy" value={`${accuracy}%`} color="#34d399" />
        <Tile label="Correct" value={`${correct}/${answered}`} color="#60a5fa" />
      </div>

      {streak > 0 && (
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border-2 border-[var(--fire)] bg-[var(--fire)]/12 px-4 py-1.5 text-sm font-extrabold text-[var(--fire)]">
          <Flame className="flame-flicker size-4" fill="currentColor" /> {streak} day streak{streak === 1 ? " — come back tomorrow!" : ""}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={onContinue} autoFocus>{continueLabel}</Button>
        {correct < answered && <Button size="lg" variant="outline" className="w-full" onClick={() => setView("mistakes")}>Review mistakes</Button>}
        <Button size="lg" variant="outline" className="w-full" onClick={() => setView(SUBJECT_META[track].dash)}>Back to path</Button>
      </div>
    </div>
    </div>
  );
}
