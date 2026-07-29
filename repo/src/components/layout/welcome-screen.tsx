"use client";

import { useEffect, useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { Rocket, Globe, Clock, Calendar, Sparkles } from "lucide-react";

export function WelcomeScreen({ onEnter }: { onEnter: () => void }) {
  const setTrack = useStudyStore((s) => s.setTrack);
  const pick = (t: "science" | "ssc") => { setTrack(t); onEnter(); };
  const [now, setNow] = useState<Date | null>(null);
  const [sessionSec, setSessionSec] = useState(0);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => {
      setNow(new Date());
      setSessionSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
    : "--:--:--";
  const dateStr = now
    ? now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Loading...";
  const ss = `${Math.floor(sessionSec / 60)}:${String(sessionSec % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* animated bg orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-fuchsia-500/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 size-64 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl animate-float-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-5">
            <Sparkles className="size-3.5" /> NCERT Class 10 · v7 Upgrade
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 leading-tight">
            Study Smart.
            <br />
            <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              Score High.
            </span>
          </h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Your complete board exam companion — notes, PYQ-style MCQs, flashcards, formulas, mock tests, and an AI tutor that explains anything.
          </p>

          <div className="flex items-center justify-center gap-6 mb-7 py-4 rounded-2xl bg-muted/40 border border-border/60">
            <div className="text-center">
              <div className="font-mono text-lg font-bold tabular-nums">{timeStr}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Time</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="font-mono text-lg font-bold tabular-nums">{ss}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Session</div>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1.5">
            <Calendar className="size-3" /> {dateStr}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => pick("science")}
              className="group w-full p-4 rounded-2xl glass border border-border hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center gap-4 text-left"
            >
              <div className="size-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                ⚛️
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-base">Science</div>
                <div className="text-xs text-muted-foreground">Chemistry · Biology · Physics · 14 chapters</div>
              </div>
              <Rocket className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </button>
            <button
              onClick={() => pick("ssc")}
              className="group w-full p-4 rounded-2xl glass border border-border hover:border-amber-400/50 transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center gap-4 text-left"
            >
              <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                📚
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-base">Social Science</div>
                <div className="text-xs text-muted-foreground">History · Geo · Pol. Sci · Eco · 20 chapters</div>
              </div>
              <Globe className="size-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-muted-foreground">
            <Clock className="size-3" /> Progress saves automatically to this device
          </div>
        </div>
      </div>
    </div>
  );
}
