"use client";

import { useEffect, useRef, useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MCQS } from "@/lib/study-data";
import type { MCQ } from "@/lib/study-data";
import { fireConfetti, getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, RotateCcw, Trophy, Gauge, Zap, Clock } from "lucide-react";

type Stage = "setup" | "live" | "result";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtMs(ms: number): string {
  const totalSec = ms / 1000;
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function fmtShort(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const BEST_KEY = "sr_best_all";
const TARGET = 20;

export function SpeedrunView() {
  const mounted = useMounted();
  const addXp = useStudyStore((s) => s.addXp);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [stage, setStage] = useState<Stage>("setup");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [elapsedMs, setElapsedMs] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [bestMs, setBestMs] = useState<number | null>(null);

  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const xpAwardedRef = useRef(false);
  const newBestRef = useRef(false);
  const finalElapsedRef = useRef(0);

  // Load best time on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(BEST_KEY);
    if (raw) {
      const n = parseInt(raw, 10);
      if (!isNaN(n) && n > 0) setBestMs(n);
    }
  }, []);

  const start = () => {
    const picked = shuffle(MCQS).slice(0, Math.min(TARGET, MCQS.length));
    setQuestions(picked);
    setCurrentIdx(0);
    setAnswers({});
    setElapsedMs(0);
    setWrongFlash(null);
    xpAwardedRef.current = false;
    newBestRef.current = false;
    finalElapsedRef.current = 0;
    startRef.current = performance.now();
    setStage("live");
  };

  // Live timer with requestAnimationFrame
  useEffect(() => {
    if (stage !== "live") return;
    const tick = () => {
      setElapsedMs(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  const finish = () => {
    const elapsed = performance.now() - startRef.current;
    finalElapsedRef.current = elapsed;
    setElapsedMs(elapsed);
    setStage("result");
  };

  const advance = (nextIdx: number) => {
    if (nextIdx >= questions.length) {
      finish();
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  const pickAnswer = (optIdx: number) => {
    if (wrongFlash !== null) return; // block during flash
    const q = questions[currentIdx];
    if (!q) return;
    const correct = optIdx === q.ans;
    setAnswers((a) => ({ ...a, [currentIdx]: optIdx }));
    if (correct) {
      advance(currentIdx + 1);
    } else {
      setWrongFlash(optIdx);
      window.setTimeout(() => {
        setWrongFlash(null);
        advance(currentIdx + 1);
      }, 480);
    }
  };

  // On entering result stage: award XP, save best, maybe confetti
  useEffect(() => {
    if (stage !== "result") return;
    if (xpAwardedRef.current) return;
    xpAwardedRef.current = true;

    const correct = questions.filter((q, i) => answers[i] === q.ans).length;
    const total = questions.length || 1;
    const accuracy = correct / total;
    const speedBonus = elapsedMs < 60000 ? 50 : elapsedMs < 120000 ? 25 : 10;
    const xp = correct * 5 + speedBonus;
    addXp(xp, "Speedrun");

    const finalMs = finalElapsedRef.current || elapsedMs;
    if (bestMs === null || finalMs < bestMs) {
      newBestRef.current = true;
      setBestMs(finalMs);
      try {
        localStorage.setItem(BEST_KEY, String(Math.round(finalMs)));
      } catch {
        /* ignore quota errors */
      }
      pushToast("🏆", "New personal best!", "ach");
    }

    if (accuracy >= 0.9) {
      fireConfetti();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const reset = () => {
    setStage("setup");
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setElapsedMs(0);
    setWrongFlash(null);
  };

  // ===== SETUP STAGE =====
  if (stage === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">⚡ Speedrun Mode</h1>
          <p className="text-muted-foreground text-sm mt-1">
            20 questions, as fast as you can. Race your personal best!
          </p>
        </div>

        <Card className="glass p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="size-20 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center animate-glow">
              <Zap className="size-10 text-amber-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Ready to Race?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Answer 20 MCQs as fast as possible. Wrong answers cost time — but no XP penalty during the run.
          </p>

          {mounted && bestMs !== null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm mb-6">
              <Trophy className="size-4 text-amber-400" />
              <span className="text-amber-300 font-medium">Your best: {fmtShort(bestMs)}</span>
            </div>
          )}
          {mounted && bestMs === null && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Clock className="size-4" /> No record yet — set your first time!
            </div>
          )}

          <div>
            <Button size="lg" onClick={start} className="w-full sm:w-auto">
              <Play /> Start Speedrun
            </Button>
          </div>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="glass p-4 gap-0">
            <Gauge className="size-5 text-primary mb-2" />
            <div className="font-semibold text-sm">20 Questions</div>
            <p className="text-xs text-muted-foreground">Random MCQs across all Science chapters.</p>
          </Card>
          <Card className="glass p-4 gap-0">
            <Zap className="size-5 text-amber-400 mb-2" />
            <div className="font-semibold text-sm">Speed Bonus</div>
            <p className="text-xs text-muted-foreground">Under 1 min = +50 XP, under 2 min = +25 XP.</p>
          </Card>
          <Card className="glass p-4 gap-0">
            <Trophy className="size-5 text-amber-400 mb-2" />
            <div className="font-semibold text-sm">Personal Best</div>
            <p className="text-xs text-muted-foreground">Beat your record and chase 90%+ accuracy for confetti.</p>
          </Card>
        </div>
      </div>
    );
  }

  // ===== LIVE STAGE =====
  if (stage === "live") {
    const q = questions[currentIdx];
    if (!q) return null;
    const meta = getSubjMeta(q.subj);
    const answeredCount = Object.keys(answers).length;
    const progressPct = (answeredCount / TARGET) * 100;
    const ghostPct =
      bestMs !== null ? Math.min(100, (elapsedMs / bestMs) * 100) : 0;

    return (
      <div className="space-y-4">
        {/* Timer */}
        <Card className="glass p-4 gap-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-amber-400" />
              <span className="font-mono text-2xl font-bold tabular-nums">{fmtMs(elapsedMs)}</span>
            </div>
            <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
              Q {currentIdx + 1}/{TARGET}
            </Badge>
          </div>

          {/* Progress bar with ghost marker */}
          <div className="mt-3 relative">
            <Progress value={progressPct} className="h-3" />
            {bestMs !== null && ghostPct > 0 && ghostPct < 100 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                style={{ left: `${ghostPct}%` }}
                title="Ghost: your best-run pace"
              >
                <div className="h-5 w-1 rounded-full bg-amber-400 shadow-[0_0_6px] shadow-amber-400/60" />
              </div>
            )}
            {bestMs !== null && (
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>Your pace</span>
                <span className="text-amber-400/80">👻 Ghost (best-run pace)</span>
              </div>
            )}
          </div>
        </Card>

        {/* Question */}
        <div className={meta.cls}>
          <Card className="glass p-5 gap-0 animate-pop-in" key={currentIdx}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="text-subj border-subj bg-subj-dim">
                {meta.emoji} {meta.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">Ch {q.ch}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{q.diff}</Badge>
            </div>

            <p className="font-semibold text-lg leading-snug mb-4">{q.q}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {q.opts.map((opt, i) => {
                const isWrong = wrongFlash === i;
                return (
                  <button
                    key={i}
                    onClick={() => pickAnswer(i)}
                    disabled={wrongFlash !== null}
                    className={`text-left rounded-lg border p-3 text-sm transition-all ${
                      isWrong
                        ? "border-rose-500 bg-rose-500/20 text-rose-200 animate-pop-in"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent"
                    }`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Tap an option to lock it in — you'll jump to the next question instantly.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ===== RESULT STAGE =====
  const correct = questions.filter((q, i) => answers[i] === q.ans).length;
  const total = questions.length || 1;
  const accuracy = Math.round((correct / total) * 100);
  const speedBonus = elapsedMs < 60000 ? 50 : elapsedMs < 120000 ? 25 : 10;
  const xpEarned = correct * 5 + speedBonus;
  const isNewBest = newBestRef.current;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">⚡ Speedrun Result</h1>
        <p className="text-muted-foreground text-sm mt-1">Race complete — here's how you did.</p>
      </div>

      <Card className="glass p-6 text-center">
        {isNewBest && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-1.5 text-sm text-amber-300 font-semibold mb-4 animate-pop-in">
            <Trophy className="size-4" /> 🏆 New Record!
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time</div>
            <div className="text-3xl font-bold tabular-nums flex items-center justify-center gap-2">
              <Clock className="size-5 text-amber-400" /> {fmtMs(elapsedMs)}
            </div>
            {bestMs !== null && (
              <div className="text-xs text-muted-foreground mt-1">
                Best: {fmtShort(bestMs)}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accuracy</div>
            <div className="text-3xl font-bold tabular-nums">
              {correct}<span className="text-xl text-muted-foreground">/{questions.length}</span>
            </div>
            <Badge
              variant="outline"
              className={
                accuracy >= 90
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 mt-1"
                  : accuracy >= 60
                  ? "text-amber-400 border-amber-500/30 bg-amber-500/10 mt-1"
                  : "text-rose-400 border-rose-500/30 bg-rose-500/10 mt-1"
              }
            >
              {accuracy}%
            </Badge>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">XP earned</div>
            <div className="text-3xl font-bold tabular-nums text-primary">+{xpEarned}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {correct} × 5 + {speedBonus} speed bonus
            </div>
          </div>
        </div>
      </Card>

      {/* Question review */}
      <Card className="glass p-5 gap-0">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Quick review
        </h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {questions.map((qq, i) => {
            const ok = answers[i] === qq.ans;
            return (
              <div
                key={i}
                className={`h-8 rounded-md border text-xs font-semibold flex items-center justify-center ${
                  ok
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                }`}
                title={ok ? "Correct" : "Wrong / skipped"}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={reset}>
          <RotateCcw /> Race Again
        </Button>
      </div>

      {!mounted ? null : null}
    </div>
  );
}
