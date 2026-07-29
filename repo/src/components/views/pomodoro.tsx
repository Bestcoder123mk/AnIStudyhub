"use client";

import { useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  Play,
  Pause,
  StepForward,
  Brain,
  PersonStanding,
  Pen,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fmtMins, fireConfetti, useMounted } from "@/components/shared/helpers";

interface PomoMode {
  label: string;
  focusMin: number;
  breakMin: number;
}

const MODES: PomoMode[] = [
  { label: "🍅 Pomodoro (25/5)", focusMin: 25, breakMin: 5 },
  { label: "🧠 Long Focus (45/10)", focusMin: 45, breakMin: 10 },
  { label: "⚡ Sprint (15/3)", focusMin: 15, breakMin: 3 },
];

const TIPS = [
  { icon: Brain, title: "Single-task", text: "Phone on DND. One chapter, one problem, one mind." },
  { icon: PersonStanding, title: "Move on break", text: "Stand, stretch, look at something 20ft away for 20s." },
  { icon: Pen, title: "Write to remember", text: "Jot a 1-line summary after each focus block." },
  { icon: Trophy, title: "Stack sessions", text: "Aim for 3–4 pomodoros on a hard topic, then reward yourself." },
];

const CIRC = 659.73; // 2 * π * 105

export function PomodoroView() {
  const mounted = useMounted();
  const recordPomo = useStudyStore((s) => s.recordPomo);
  const pushToast = useStudyStore((s) => s.pushToast);
  const pomoSessions = useStudyStore((s) => s.pomoSessions);
  const pomoMins = useStudyStore((s) => s.pomoMins);
  const pomoXp = useStudyStore((s) => s.pomoXp);

  const [mode, setMode] = useState<PomoMode>(MODES[0]);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState<number>(MODES[0].focusMin * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = (phase === "focus" ? mode.focusMin : mode.breakMin) * 60;

  // Reset timer when mode changes
  const switchMode = (m: PomoMode) => {
    setMode(m);
    setPhase("focus");
    setTimeLeft(m.focusMin * 60);
    setRunning(false);
  };

  // Tick logic
  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 1) return t - 1;
        // hit zero — handle phase transition
        if (phase === "focus") {
          pushToast("☕", "Focus done! Take a break.", "success");
          setPhase("break");
          return mode.breakMin * 60;
        }
        // break ended → record session
        recordPomo(mode.focusMin);
        setSessions((n) => n + 1);
        fireConfetti();
        pushToast("🎉", `Session complete! +20 XP`, "ach");
        setPhase("focus");
        return mode.focusMin * 60;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, phase, mode, recordPomo, pushToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setTimeLeft(mode.focusMin * 60);
  };

  const skip = () => {
    if (phase === "focus") {
      setPhase("break");
      setTimeLeft(mode.breakMin * 60);
    } else {
      recordPomo(mode.focusMin);
      setSessions((n) => n + 1);
      fireConfetti();
      pushToast("🎉", `Session complete! +20 XP`, "ach");
      setPhase("focus");
      setTimeLeft(mode.focusMin * 60);
    }
  };

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  // Progress: ring depletes as time runs out (full ring at start)
  const elapsedFrac = total > 0 ? 1 - timeLeft / total : 0;
  const offset = CIRC * elapsedFrac;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Pomodoro Timer <span className="inline-block">⏱️</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          25 min focus → 5 min break → repeat. Earn <span className="text-primary font-semibold">+20 XP</span> per session!
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => {
          const active = m.label === mode.label;
          return (
            <Button
              key={m.label}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => switchMode(m)}
              className={active ? "shadow-md" : ""}
            >
              {m.label}
            </Button>
          );
        })}
      </div>

      {/* Timer + controls */}
      <Card className="glass">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          {/* Phase + session label */}
          <div className="flex items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                phase === "focus"
                  ? "bg-primary/15 text-primary"
                  : "bg-emerald-500/15 text-emerald-500"
              }`}
            >
              {phase === "focus" ? "🎯 FOCUS TIME" : "☕ BREAK TIME"}
            </span>
            <span className="text-muted-foreground">
              Session #{mounted ? sessions + 1 : 1}
            </span>
          </div>

          {/* SVG ring */}
          <div className="relative">
            <svg width="240" height="240" viewBox="0 0 240 240" className="block">
              {/* Track */}
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="currentColor"
                strokeWidth="14"
                className="text-muted/30"
              />
              {/* Progress */}
              <circle
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="currentColor"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={offset}
                className={`text-primary transition-[stroke-dashoffset] duration-500 ease-linear ${
                  phase === "break" ? "text-emerald-500" : ""
                }`}
                transform="rotate(-90 120 120)"
              />
            </svg>
            {/* Center display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-5xl sm:text-6xl font-bold tabular-nums tracking-tight">
                {mm}:{ss}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {phase === "focus" ? "Focus" : "Break"} · {mode.focusMin}/{mode.breakMin} min
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={reset} aria-label="Reset timer" className="h-11 w-11 rounded-full">
              <RotateCcw className="size-5" />
            </Button>
            <Button
              size="lg"
              onClick={() => setRunning((r) => !r)}
              className="h-14 w-14 rounded-full p-0"
              aria-label={running ? "Pause" : "Start"}
            >
              {running ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
            </Button>
            <Button variant="outline" size="icon" onClick={skip} aria-label="Skip phase" className="h-11 w-11 rounded-full">
              <StepForward className="size-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold">{mounted ? pomoSessions : 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Sessions Done</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold">{mounted ? fmtMins(pomoMins) : "0m"}</div>
            <div className="text-xs text-muted-foreground mt-1">Mins Studied</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-primary">{mounted ? pomoXp : 0}</div>
            <div className="text-xs text-muted-foreground mt-1">XP Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="glass">
        <CardContent className="py-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-semibold">Study tips for deeper focus</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Zen mode */}
      <div className="flex justify-center pb-4">
        <Button variant="outline" onClick={() => pushToast("🧘", "Zen mode coming soon", "info")}>
          <Sparkles className="size-4" /> Enter Zen Mode
        </Button>
      </div>
    </div>
  );
}
