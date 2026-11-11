"use client";

/** The top of every dashboard: what to do next, in one big button. Mascot + daily goal + this week's streak. */

import { useMemo } from "react";
import { Check, Flame, GraduationCap, Play } from "lucide-react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";
import { useTrackPath } from "@/components/shared/learning-path";
import { dayStreak } from "@/components/shared/stat-pills";
import { useMounted } from "@/components/shared/helpers";
import { getConcept } from "@/lib/concepts";

const GOAL = 10; // questions (or other activities) per day
const keyOf = (d: Date) => d.toISOString().slice(0, 10);

export function DailyHero({ track }: { track: Track }) {
  const meta = SUBJECT_META[track];
  const mounted = useMounted();
  const heatmap = useStudyStore((s) => s.heatmap);
  const setView = useStudyStore((s) => s.setView);
  const setFocusChapter = useStudyStore((s) => s.setFocusChapter);
  const setConceptOpen = useStudyStore((s) => s.setConceptOpen);
  const { rows, nextIdx, target } = useTrackPath(track);

  const today = new Date();
  const todayKey = keyOf(today);
  const done = mounted ? (heatmap?.[todayKey] ?? 0) : 0;
  const pct = Math.min(100, Math.round((done / GOAL) * 100));
  const goalMet = done >= GOAL;
  const streak = useMemo(() => dayStreak(heatmap ?? {}), [heatmap]);
  const week = useMemo(() => {
    const mon = new Date(today);
    mon.setUTCDate(mon.getUTCDate() - ((mon.getUTCDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setUTCDate(mon.getUTCDate() + i); return { k: keyOf(d), l: "MTWTFSS"[i] }; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  if (rows.length === 0) return null;
  const go = () => { setFocusChapter({ track, id: target.chapterId }); setView(meta.mcq); };
  const headline = goalMet ? "Daily goal complete! 🎉" : done > 0 ? "Keep it rolling!" : "Ready for today's lesson?";

  return (
    <Card className="glass gap-0 p-4 sm:p-5" style={{ "--sc": meta.accent } as React.CSSProperties}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Mascot mood={goalMet ? "cheer" : "happy"} size={84} bounce={!goalMet && done === 0} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-black leading-tight sm:text-2xl">{headline}</h2>
          <p className="mt-0.5 truncate text-sm font-bold text-muted-foreground">
            {nextIdx >= 0 ? <>Up next: <span className="text-foreground">Ch {target.chapterId} · {target.title}</span></> : "All chapters exam-ready — review to keep them sharp."}
          </p>
        </div>
      </div>

      {(() => {
        const concept = getConcept(track, target.chapterId);
        return (
          <div className={`mt-4 grid gap-2 ${concept ? "sm:grid-cols-2" : ""}`}>
            {concept && (
              <Button size="lg" variant="outline" onClick={() => setConceptOpen({ track, id: target.chapterId })}>
                <GraduationCap className="size-4" /> Learn the concept · {concept.minutes} min
              </Button>
            )}
            <Button size="lg" onClick={go}>
              <Play className="size-4" fill="currentColor" /> {nextIdx >= 0 ? "Continue" : "Review"}
            </Button>
          </div>
        );
      })()}

      <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:items-center">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs font-extrabold">
            <span className="text-muted-foreground">Daily goal</span>
            <span className="tabular-nums" style={{ color: goalMet ? "var(--success)" : "var(--foreground)" }}>{Math.min(done, GOAL)} / {GOAL}</span>
          </div>
          <div className="meter-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Daily goal">
            <div className="meter-fill" style={{ width: `${Math.max(pct, 4)}%`, background: goalMet ? "var(--success)" : "#fbbf24" }} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-1 sm:justify-end sm:gap-1.5" aria-label={`${streak} day streak this week`}>
          {week.map((d) => {
            const on = mounted && (heatmap?.[d.k] ?? 0) > 0;
            const isToday = d.k === todayKey;
            return (
              <div key={d.k} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-extrabold text-muted-foreground">{d.l}</span>
                <span
                  className="grid size-8 place-items-center rounded-full border"
                  style={on ? { background: "#fb923c", borderColor: "#fb923c", color: "#1a1000" } : { borderColor: isToday ? "var(--primary)" : "var(--edge)", color: "var(--muted-foreground)" }}
                >
                  {on ? <Check className="size-4" strokeWidth={4} /> : isToday ? <Flame className="size-3.5" /> : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
