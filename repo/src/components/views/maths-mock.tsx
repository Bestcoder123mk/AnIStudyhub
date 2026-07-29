"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MATHS_MCQS, MATHS_CHAPTERS } from "@/lib/maths-data";
import { fireConfetti, fmtMins, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  Gauge,
  Eye,
} from "lucide-react";

const ACCENT = "#22d3ee";
const TEST_MINS = 30;
const LETTERS = ["A", "B", "C", "D"];

type GroupKey = "all" | "algebra" | "geometry" | "coordTrig" | "mensuration" | "statsProb";
type Count = 10 | 20;
type Stage = "setup" | "test" | "results";

interface TestQ {
  idx: number;
  qid: number;
  ch: number;
  diff: "easy" | "medium" | "hard";
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

const GROUP_TO_CHAPTERS: Record<Exclude<GroupKey, "all">, number[]> = {
  algebra: [1, 2, 3, 4, 5],
  geometry: [6, 9],
  coordTrig: [7, 8],
  mensuration: [10, 11],
  statsProb: [12, 13],
};

const PRESETS: { key: GroupKey; label: string }[] = [
  { key: "all", label: "📚 Full Syllabus" },
  { key: "algebra", label: "🔢 Algebra" },
  { key: "geometry", label: "📐 Geometry" },
  { key: "coordTrig", label: "🧭 Coord & Trig" },
  { key: "mensuration", label: "🌀 Mensuration" },
  { key: "statsProb", label: "📊 Stats & Prob" },
];

const COUNT_OPTIONS: { id: Count; label: string }[] = [
  { id: 10, label: "10 Q · Quick" },
  { id: 20, label: "20 Q · Full" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtHMS(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return [m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function chapterTitle(ch: number) {
  return MATHS_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;
}

export function MathsMockView() {
  const mounted = useMounted();
  const recordAnswer = useStudyStore((s) => s.recordAnswer);
  const addXp = useStudyStore((s) => s.addXp);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [stage, setStage] = useState<Stage>("setup");
  const [group, setGroup] = useState<GroupKey>("all");
  const [count, setCount] = useState<Count>(10);

  const [questions, setQuestions] = useState<TestQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [takenSec, setTakenSec] = useState(0);

  const submittedRef = useRef(false);
  const confettiRef = useRef(false);

  // Build the question pool and enter the test stage.
  const startTest = () => {
    const pool =
      group === "all"
        ? MATHS_MCQS
        : MATHS_MCQS.filter((m) => GROUP_TO_CHAPTERS[group].includes(m.ch));
    if (pool.length === 0) {
      pushToast("⚠️", "No questions available for this preset.", "error");
      return;
    }
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    const qs: TestQ[] = picked.map((m, i) => ({
      idx: i,
      qid: m.id,
      ch: m.ch,
      diff: m.diff,
      q: m.q,
      opts: m.opts,
      ans: m.ans,
      exp: m.exp,
    }));

    setQuestions(qs);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(TEST_MINS * 60);
    setTotalTime(TEST_MINS * 60);
    setTakenSec(0);
    submittedRef.current = false;
    confettiRef.current = false;
    setStage("test");
  };

  const submitTest = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    // Record each answered question against the store.
    let correctCount = 0;
    questions.forEach((q) => {
      const a = answers[q.idx];
      if (typeof a === "number") {
        const correct = a === q.ans;
        if (correct) correctCount += 1;
        recordAnswer(
          "maths",
          "maths",
          q.ch,
          correct,
          q.qid,
          q.q,
          q.opts[a],
          q.opts[q.ans],
          q.exp,
          q.diff
        );
      }
    });

    const xpGain = correctCount * 10;
    if (xpGain > 0) addXp(xpGain, "Maths mock test");

    pushToast(
      "📝",
      `Mock test submitted! Scored ${correctCount}/${questions.length}. +${xpGain} XP`,
      correctCount / Math.max(questions.length, 1) >= 0.5 ? "success" : "info"
    );
    setStage("results");
  };

  // Countdown timer
  useEffect(() => {
    if (stage !== "test") return;
    const t = setInterval(() => {
      setTimeLeft((tl) => Math.max(0, tl - 1));
      setTakenSec((ts) => ts + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (stage === "test" && timeLeft === 0 && totalTime > 0) {
      submitTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timeLeft, totalTime]);

  const correctCount = useMemo(
    () =>
      questions.reduce((acc, q) => {
        const a = answers[q.idx];
        return typeof a === "number" && a === q.ans ? acc + 1 : acc;
      }, 0),
    [questions, answers]
  );

  const answeredCount = useMemo(
    () => questions.filter((q) => typeof answers[q.idx] === "number").length,
    [questions, answers]
  );

  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const scorePct =
    questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // Confetti when crossing 80% in results
  useEffect(() => {
    if (stage !== "results") return;
    if (scorePct >= 80 && !confettiRef.current) {
      confettiRef.current = true;
      fireConfetti();
    }
  }, [stage, scorePct]);

  const reset = () => {
    setStage("setup");
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(0);
    setTakenSec(0);
    submittedRef.current = false;
    confettiRef.current = false;
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 bg-muted/50 rounded animate-pulse" />
        <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const accentStyle = { color: ACCENT } as CSSProperties;

  // ===== SETUP STAGE =====
  if (stage === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={accentStyle}>
            Maths Mock Test 📝
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {MATHS_MCQS.length} MCQs available · Timed {fmtMins(TEST_MINS)} · Auto-graded · CBSE pattern
          </p>
        </div>

        {/* Chapter group preset */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Chapter range
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = group === p.key;
              return (
                <Button
                  key={p.key}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setGroup(p.key)}
                  style={
                    active
                      ? { backgroundColor: ACCENT, color: "#06121a", borderColor: ACCENT }
                      : undefined
                  }
                >
                  {p.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Question count */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Number of questions
          </h2>
          <div className="flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((c) => {
              const active = count === c.id;
              return (
                <Button
                  key={c.id}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setCount(c.id)}
                  style={
                    active
                      ? { backgroundColor: ACCENT, color: "#06121a", borderColor: ACCENT }
                      : undefined
                  }
                >
                  {c.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Test summary bar */}
        <Card className="glass p-5 gap-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{count} MCQ · 1 mark each</Badge>
              <Badge variant="outline" style={{ color: ACCENT, borderColor: `${ACCENT}66` }}>
                Total: {count} marks
              </Badge>
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                <Clock className="size-3" /> {fmtMins(TEST_MINS)}
              </Badge>
            </div>
            <Button onClick={startTest} size="lg" style={{ backgroundColor: ACCENT, color: "#06121a" }}>
              <Play /> Start Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ===== TEST STAGE =====
  if (stage === "test") {
    const q = questions[currentIdx];
    if (!q) return null;
    const timePct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    const lowTime = timeLeft <= 60;
    const currentAns = answers[q.idx];
    const isAnswered = typeof currentAns === "number";

    return (
      <div className="space-y-4">
        {/* Timer bar */}
        <Card className="glass p-4 gap-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className={`size-5 ${lowTime ? "text-rose-400 animate-pulse" : ""}`} style={!lowTime ? { color: ACCENT } : undefined} />
              <span className={`font-mono text-xl font-bold tabular-nums ${lowTime ? "text-rose-400" : ""}`} style={!lowTime ? { color: ACCENT } : undefined}>
                {fmtHMS(timeLeft)}
              </span>
              {lowTime && <Badge variant="destructive" className="text-xs">Time up soon!</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {answeredCount}/{questions.length} answered
              </Badge>
              <Button size="sm" variant="destructive" onClick={submitTest}>
                <Flag /> Submit
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Progress
              value={timePct}
              className={`h-1.5 ${lowTime ? "[&>[data-slot=progress-indicator]]:bg-rose-500" : ""}`}
            />
          </div>
        </Card>

        {/* Question palette */}
        <Card className="glass p-4 gap-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Question palette
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-32 overflow-y-auto scroll-thin">
            {questions.map((qq) => {
              const ans = typeof answers[qq.idx] === "number";
              const isCurrent = qq.idx === currentIdx;
              return (
                <button
                  key={qq.idx}
                  onClick={() => setCurrentIdx(qq.idx)}
                  className="h-8 rounded-md border text-xs font-semibold transition-all"
                  style={
                    isCurrent
                      ? { backgroundColor: ACCENT, borderColor: ACCENT, color: "#06121a" }
                      : ans
                      ? { backgroundColor: `${ACCENT}33`, borderColor: `${ACCENT}66`, color: ACCENT }
                      : undefined
                  }
                  aria-label={`Jump to question ${qq.idx + 1}`}
                >
                  {qq.idx + 1}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Question area */}
        <div style={{ "--sc": ACCENT } as CSSProperties}>
          <Card className="glass p-5 gap-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="text-subj border-subj bg-subj-dim">
                🔢 Maths
              </Badge>
              <Badge variant="outline" className="text-xs">Ch {q.ch} · {chapterTitle(q.ch)}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{q.diff}</Badge>
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                1m
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                Q {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <p className="font-semibold text-lg leading-snug mb-4">{q.q}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {q.opts.map((opt, i) => {
                const selected = currentAns === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers((a) => ({ ...a, [q.idx]: i }))}
                    className="text-left rounded-lg border p-3 text-sm transition-all"
                    style={
                      selected
                        ? { borderColor: ACCENT, backgroundColor: `${ACCENT}1a`, boxShadow: `0 0 0 1px ${ACCENT}` }
                        : undefined
                    }
                  >
                    <span className="font-semibold mr-2">{LETTERS[i]}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                <ArrowLeft /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                {isAnswered ? "✓ Answered" : "Unanswered"}
              </span>
              <Button
                size="sm"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIdx === questions.length - 1}
                style={{ backgroundColor: ACCENT, color: "#06121a" }}
              >
                Next <ArrowRight />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ===== RESULTS STAGE =====
  const wrongQs = questions.filter((q) => {
    const a = answers[q.idx];
    return typeof a === "number" && a !== q.ans;
  });
  const unanswered = questions.filter((q) => typeof answers[q.idx] !== "number").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={accentStyle}>
            Maths Mock Test Results 🎯
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {group === "all" ? "Full Syllabus" : PRESETS.find((p) => p.key === group)?.label} · {count} questions
          </p>
        </div>
        <Button variant="outline" onClick={reset}>
          <RotateCcw /> Back to Setup
        </Button>
      </div>

      {/* Score summary */}
      <Card className="glass p-6 gap-0">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score</div>
            <div className="text-4xl font-bold tabular-nums" style={accentStyle}>
              {correctCount}
              <span className="text-xl text-muted-foreground">/{questions.length}</span>
            </div>
            <Badge
              variant="outline"
              className={
                scorePct >= 80
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : scorePct >= 50
                  ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                  : "text-rose-400 border-rose-500/30 bg-rose-500/10"
              }
            >
              {scorePct}%
            </Badge>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold tabular-nums flex items-center gap-2">
              <Gauge className="size-5" style={accentStyle} /> {accuracy}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">{correctCount} of {answeredCount} answered</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time taken</div>
            <div className="text-2xl font-bold tabular-nums flex items-center gap-2">
              <Clock className="size-5" style={accentStyle} /> {fmtHMS(takenSec)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">of {fmtMins(TEST_MINS)}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Answered</div>
            <div className="text-2xl font-bold tabular-nums">{answeredCount}/{questions.length}</div>
            {unanswered > 0 ? (
              <div className="text-xs text-rose-400 mt-1">{unanswered} skipped</div>
            ) : scorePct >= 80 ? (
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <Trophy className="size-3" /> Excellent!
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Review wrong answers */}
      {wrongQs.length > 0 ? (
        <Card className="glass p-5 gap-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Review wrong answers ({wrongQs.length})
          </h2>
          <div className="space-y-4 max-h-[32rem] overflow-y-auto scroll-thin pr-1">
            {wrongQs.map((q) => {
              const yourAns = answers[q.idx];
              return (
                <div
                  key={q.idx}
                  className="rounded-lg border border-border p-4"
                  style={{ borderLeft: `3px solid ${ACCENT}` }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Ch {q.ch}</Badge>
                    <Badge variant="outline" className="text-xs capitalize">{q.diff}</Badge>
                    <Badge variant="destructive" className="text-xs">
                      <XCircle className="size-3" /> Wrong
                    </Badge>
                  </div>
                  <p className="font-medium text-sm mb-3 whitespace-pre-wrap">{q.q}</p>
                  <div className="grid gap-2 mb-3">
                    {q.opts.map((opt, i) => {
                      const isCorrect = i === q.ans;
                      const isYours = i === yourAns;
                      return (
                        <div
                          key={i}
                          className={`rounded-md border p-2 text-xs flex items-start gap-2 ${
                            isCorrect
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                              : isYours
                              ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                              : "border-border"
                          }`}
                        >
                          <span className="font-semibold">{LETTERS[i]}.</span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && <CheckCircle2 className="size-3.5 mt-0.5 text-emerald-400" />}
                          {isYours && !isCorrect && <XCircle className="size-3.5 mt-0.5 text-rose-400" />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-md bg-muted/40 border border-border p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                      <Eye className="size-3" /> Explanation
                    </div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed">{q.exp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="glass p-6 gap-0 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold mb-1">No wrong answers!</h2>
          <p className="text-sm text-muted-foreground">
            {unanswered > 0
              ? `You skipped ${unanswered} question(s) — try attempting all next time.`
              : "Perfect score on attempted questions."}
          </p>
        </Card>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={reset}>
          <RotateCcw /> Back to Setup
        </Button>
      </div>
    </div>
  );
}
