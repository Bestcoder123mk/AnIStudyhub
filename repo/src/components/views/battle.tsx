"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted, fireConfetti } from "@/components/shared/helpers";
import { MCQS, SSC_MCQS } from "@/lib/study-data";
import { MATHS_MCQS } from "@/lib/maths-data";
import { ENG_MCQS } from "@/lib/english-data";
import { SKT_MCQS } from "@/lib/sanskrit-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Clock,
  Zap,
  Trophy,
  Skull,
  RotateCcw,
  History,
  Flame,
  Target,
} from "lucide-react";

type Diff = "easy" | "medium" | "hard";
type Phase = "setup" | "battle" | "result";

interface NormMCQ {
  id: number;
  ch: number;
  subj: string;
  diff: Diff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

function getMcqsForTrack(track: Track): NormMCQ[] {
  switch (track) {
    case "science":
      return MCQS as unknown as NormMCQ[];
    case "ssc":
      return SSC_MCQS as unknown as NormMCQ[];
    case "maths":
      return MATHS_MCQS as unknown as NormMCQ[];
    case "english":
      return ENG_MCQS as unknown as NormMCQ[];
    case "sanskrit":
      return SKT_MCQS as unknown as NormMCQ[];
  }
}

const QUESTION_TIME = 6; // seconds per question
const TOTAL_QUESTIONS = 10;
const LETTERS = ["A", "B", "C", "D"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function BattleView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);
  const setTrack = useStudyStore((s) => s.setTrack);
  const recordBattle = useStudyStore((s) => s.recordBattle);
  const battles = useStudyStore((s) => s.battles);

  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<Diff>("medium");
  const [questions, setQuestions] = useState<NormMCQ[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [recorded, setRecorded] = useState(false);

  const allMcqs = useMemo(() => getMcqsForTrack(track), [track]);

  const startBattle = () => {
    const pool = allMcqs.filter((m) => m.diff === difficulty);
    const source =
      pool.length >= TOTAL_QUESTIONS ? pool : allMcqs;
    const picked = shuffle(source).slice(
      0,
      Math.min(TOTAL_QUESTIONS, source.length)
    );
    setQuestions(picked);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(QUESTION_TIME);
    setStartTime(Date.now());
    setEndTime(0);
    setRecorded(false);
    setPhase("battle");
  };

  const advance = (correct: boolean) => {
    setStreak((prev) => {
      const ns = correct ? prev + 1 : 0;
      setBestStreak((b) => Math.max(b, ns));
      return ns;
    });
    if (correct) setScore((s) => s + 1);
    window.setTimeout(() => {
      setQIdx((cur) => {
        if (cur + 1 >= questions.length) {
          setEndTime(Date.now());
          setPhase("result");
          return cur;
        }
        setSelected(null);
        setTimeLeft(QUESTION_TIME);
        return cur + 1;
      });
    }, 800);
  };

  // Timer effect — only ticks when battle is active and no answer picked
  useEffect(() => {
    if (phase !== "battle") return;
    if (selected !== null) return;
    if (timeLeft <= 0) {
      advance(false);
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft, selected]);

  // Record battle once when result phase is reached
  useEffect(() => {
    if (phase === "result" && !recorded) {
      setRecorded(true);
      recordBattle(track, score, TOTAL_QUESTIONS);
      if (score >= 7) fireConfetti();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const current = questions[qIdx];
  const timeTakenSec =
    startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0;
  const won = score >= 7;
  const accuracy =
    TOTAL_QUESTIONS > 0
      ? Math.round((score / TOTAL_QUESTIONS) * 100)
      : 0;

  const reset = () => {
    setPhase("setup");
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
  };

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          Battle Arena <span aria-hidden>⚔️</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {TOTAL_QUESTIONS} questions · {QUESTION_TIME} seconds each · beat the
          boss
        </p>
      </header>

      {phase === "setup" && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Swords className="size-4 text-primary" /> Battle Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Subject (current track)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(SUBJECT_META) as Track[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrack(t)}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      track === t
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/40 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl">{SUBJECT_META[t].icon}</div>
                    <div className="text-xs mt-1 font-medium">
                      {SUBJECT_META[t].label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Difficulty
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["easy", "medium", "hard"] as Diff[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`rounded-xl border p-3 text-center capitalize transition-all ${
                      difficulty === d
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card/40 hover:border-primary/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Falls back to all difficulties if fewer than{" "}
                {TOTAL_QUESTIONS} match.
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm space-y-1">
              <div className="flex items-center gap-2 font-medium">
                <Zap className="size-4 text-amber-400" /> Battle Rules
              </div>
              <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
                <li>
                  {TOTAL_QUESTIONS} multiple-choice questions from{" "}
                  {SUBJECT_META[track].label}
                </li>
                <li>
                  {QUESTION_TIME} seconds per question · auto-advance on answer
                </li>
                <li>Score ≥ 7/10 to win · XP = score × 10</li>
                <li>Best streak also tracked — keep the momentum!</li>
              </ul>
            </div>

            <Button
              onClick={startBattle}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Swords className="size-4 mr-2" /> Start Battle
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "battle" && current && (
        <div className="space-y-4">
          {/* Top stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Score
              </div>
              <div className="text-2xl font-bold tabular-nums text-emerald-400">
                {score}
              </div>
            </Card>
            <Card className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Streak
              </div>
              <div className="text-2xl font-bold tabular-nums text-orange-400 flex items-center justify-center gap-1">
                <Flame className="size-4" />
                {streak}
              </div>
            </Card>
            <Card className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Question
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {qIdx + 1}
                <span className="text-sm text-muted-foreground">
                  /{questions.length}
                </span>
              </div>
            </Card>
          </div>

          {/* Timer bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> Time left
              </span>
              <span className="tabular-nums">{timeLeft}s</span>
            </div>
            <Progress
              value={(timeLeft / QUESTION_TIME) * 100}
              className={`h-2 ${
                timeLeft <= 2 ? "[&_[data-slot=progress-indicator]]:bg-rose-500" : ""
              }`}
            />
          </div>

          {/* Question */}
          <Card className="glass rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {current.diff}
                </Badge>
                <Badge variant="secondary">
                  {SUBJECT_META[track].icon} {SUBJECT_META[track].short}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-base sm:text-lg font-medium leading-relaxed">
                {current.q}
              </div>
              <div className="grid gap-2">
                {current.opts.map((opt, i) => {
                  const isCorrect = i === current.ans;
                  const isPicked = selected === i;
                  let cls =
                    "border-border bg-card/40 hover:border-primary/60 hover:bg-primary/5";
                  if (selected !== null) {
                    if (isCorrect)
                      cls = "border-emerald-500/60 bg-emerald-500/10";
                    else if (isPicked)
                      cls = "border-rose-500/60 bg-rose-500/10";
                    else cls = "border-border bg-card/30 opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      disabled={selected !== null}
                      onClick={() => {
                        if (selected !== null) return;
                        setSelected(i);
                        advance(i === current.ans);
                      }}
                      className={`text-left rounded-xl border p-3 transition-all flex items-start gap-3 ${cls}`}
                    >
                      <span className="size-7 shrink-0 rounded-full bg-muted grid place-items-center text-xs font-bold">
                        {LETTERS[i]}
                      </span>
                      <span className="text-sm flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className="rounded-lg bg-muted/60 p-3 text-xs">
                  <span className="font-medium">Explanation: </span>
                  <span className="text-muted-foreground">{current.exp}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {phase === "result" && (
        <Card
          className={`glass rounded-2xl ${
            won ? "border-emerald-500/40" : "border-rose-500/40"
          }`}
        >
          <CardContent className="p-6 sm:p-8 text-center space-y-4">
            <div className="text-6xl">{won ? "🏆" : "💀"}</div>
            <div>
              <div
                className={`text-3xl sm:text-4xl font-bold ${
                  won ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {won ? "VICTORY" : "DEFEAT"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {won
                  ? "You beat the boss! Glorious triumph."
                  : "Better luck next time, scholar. Train harder!"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="rounded-xl bg-muted/60 p-3">
                <div className="text-xs text-muted-foreground uppercase">
                  Score
                </div>
                <div className="text-2xl font-bold tabular-nums">
                  {score}/{TOTAL_QUESTIONS}
                </div>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <div className="text-xs text-muted-foreground uppercase">
                  Accuracy
                </div>
                <div className="text-2xl font-bold tabular-nums">
                  {accuracy}%
                </div>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <div className="text-xs text-muted-foreground uppercase">
                  Time
                </div>
                <div className="text-2xl font-bold tabular-nums">
                  {timeTakenSec}s
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-1.5 text-amber-300 text-sm font-medium">
                <Zap className="size-4" /> +{score * 10} XP earned
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-1.5 text-orange-300 text-sm font-medium">
                <Flame className="size-4" /> Best streak: {bestStreak}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={startBattle}>
                <RotateCcw className="size-4 mr-1" /> Battle Again
              </Button>
              <Button variant="outline" onClick={reset}>
                Back to Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Battle history */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="size-4 text-primary" /> Battle History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!mounted || battles.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="text-4xl">⚔️</div>
              <p className="text-sm text-muted-foreground">
                No battles yet. Start your first battle above!
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {battles.slice(0, 10).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card/40 p-3"
                >
                  <div
                    className={`size-9 rounded-full grid place-items-center ${
                      b.won
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {b.won ? (
                      <Trophy className="size-4" />
                    ) : (
                      <Skull className="size-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">
                        {SUBJECT_META[b.subject]?.icon}
                      </span>
                      <span className="font-medium text-sm">
                        {SUBJECT_META[b.subject]?.label}
                      </span>
                      <Badge
                        variant={b.won ? "secondary" : "outline"}
                        className="text-[10px]"
                      >
                        {b.won ? "WON" : "LOST"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Target className="size-3" />
                        {b.score}/{b.total}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(b.date).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums text-amber-400">
                      +{b.score * 10} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
