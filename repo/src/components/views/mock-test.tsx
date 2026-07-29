"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MCQS, SHORT_QA, LONG_QA, CHAPTERS } from "@/lib/study-data";
import type { Subject } from "@/lib/study-data";
import { getSubjMeta, fireConfetti, fmtMins, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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

type TestType = "full" | "half" | "chapter";
type Preset = "all" | Subject;
type Stage = "setup" | "test" | "results";

interface TestQ {
  idx: number;
  section: "A" | "B" | "C" | "D";
  type: "mcq" | "vsa" | "sa" | "la";
  marks: number;
  q: string;
  opts?: string[];
  ans?: number;
  modelAns?: string;
  subj: string;
  ch: number;
  qid: number;
}

const TEST_TYPES: {
  id: TestType;
  title: string;
  desc: string;
  mcq: number;
  vsa: number;
  sa: number;
  la: number;
  mins: number;
}[] = [
  { id: "full", title: "Full Board Exam", desc: "20 MCQ + 6 VSA + 7 SA + 3 LA", mcq: 20, vsa: 6, sa: 7, la: 3, mins: 180 },
  { id: "half", title: "Half Test", desc: "10 MCQ + 3 VSA + 4 SA + 1 LA", mcq: 10, vsa: 3, sa: 4, la: 1, mins: 90 },
  { id: "chapter", title: "Chapter Test", desc: "10 MCQ only · rapid revision", mcq: 10, vsa: 0, sa: 0, la: 0, mins: 30 },
];

const PRESETS: { id: Preset; label: string }[] = [
  { id: "all", label: "Full Syllabus" },
  { id: "chem", label: "🧪 Chemistry Only" },
  { id: "bio", label: "🧬 Biology Only" },
  { id: "phy", label: "⚡ Physics Only" },
];

const SECTION_META: Record<string, { label: string; type: string }> = {
  A: { label: "Section A", type: "MCQ · 1 mark each" },
  B: { label: "Section B", type: "VSA · 2 marks each" },
  C: { label: "Section C", type: "SA · 3 marks each" },
  D: { label: "Section D", type: "LA · 5 marks each" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmtHMS(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function MockTestView() {
  const mounted = useMounted();
  const pushToast = useStudyStore((s) => s.pushToast);

  const [stage, setStage] = useState<Stage>("setup");
  const [testType, setTestType] = useState<TestType>("full");
  const [preset, setPreset] = useState<Preset>("all");

  const [questions, setQuestions] = useState<TestQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [revealedScheme, setRevealedScheme] = useState<Record<number, boolean>>({});
  const [awarded, setAwarded] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [takenSec, setTakenSec] = useState(0);

  const submittedRef = useRef(false);
  const confettiRef = useRef(false);

  const tt = TEST_TYPES.find((t) => t.id === testType)!;
  const totalMarks = tt.mcq * 1 + tt.vsa * 2 + tt.sa * 3 + tt.la * 5;

  const chapterTitle = (ch: number) =>
    CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  // Build question pool & enter test stage
  const startTest = () => {
    const subjFilter = (s: string) => preset === "all" || s === preset;
    const mcqPool = shuffle(MCQS.filter((m) => subjFilter(m.subj))).slice(0, tt.mcq);
    const vsaPool = shuffle(SHORT_QA.filter((q) => subjFilter(q.subj))).slice(0, tt.vsa);
    const saPool = shuffle(SHORT_QA.filter((q) => subjFilter(q.subj))).slice(0, tt.sa);
    const laPool = shuffle(LONG_QA.filter((q) => subjFilter(q.subj))).slice(0, tt.la);

    const qs: TestQ[] = [];
    let idx = 0;
    mcqPool.forEach((m) => {
      qs.push({
        idx: idx++, section: "A", type: "mcq", marks: 1, q: m.q,
        opts: m.opts, ans: m.ans, subj: m.subj, ch: m.ch, qid: m.id,
      });
    });
    vsaPool.forEach((q) => {
      qs.push({
        idx: idx++, section: "B", type: "vsa", marks: 2, q: q.q,
        modelAns: q.a, subj: q.subj, ch: q.ch, qid: q.id,
      });
    });
    saPool.forEach((q) => {
      qs.push({
        idx: idx++, section: "C", type: "sa", marks: 3, q: q.q,
        modelAns: q.a, subj: q.subj, ch: q.ch, qid: q.id,
      });
    });
    laPool.forEach((q) => {
      qs.push({
        idx: idx++, section: "D", type: "la", marks: 5, q: q.q,
        modelAns: q.a, subj: q.subj, ch: q.ch, qid: q.id,
      });
    });

    if (qs.length === 0) {
      pushToast("⚠️", "No questions available for this preset.", "error");
      return;
    }

    setQuestions(qs);
    setAnswers({});
    setRevealedScheme({});
    setAwarded({});
    setCurrentIdx(0);
    setTimeLeft(tt.mins * 60);
    setTotalTime(tt.mins * 60);
    setTakenSec(0);
    submittedRef.current = false;
    confettiRef.current = false;
    setStage("test");
  };

  const submitTest = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    // compute MCQ score for the toast
    let mcqScored = 0;
    questions.forEach((q) => {
      if (q.type === "mcq") {
        const a = answers[q.idx];
        if (typeof a === "number" && a === q.ans) mcqScored += q.marks;
      }
    });
    const mcqMax = tt.mcq * 1;
    pushToast(
      "📝",
      `Test submitted! MCQ auto-graded: ${mcqScored}/${mcqMax}. Self-grade written answers below.`,
      "info"
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

  // Derived score
  const score = useMemo(() => {
    let s = 0;
    questions.forEach((q) => {
      if (q.type === "mcq") {
        const a = answers[q.idx];
        if (typeof a === "number" && a === q.ans) s += q.marks;
      } else {
        s += awarded[q.idx] || 0;
      }
    });
    return s;
  }, [questions, answers, awarded]);

  const pct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  // Confetti when crossing 80% in results
  useEffect(() => {
    if (stage !== "results") return;
    if (pct >= 80 && !confettiRef.current) {
      confettiRef.current = true;
      fireConfetti();
    }
  }, [stage, pct]);

  const sectionScores = useMemo(() => {
    const sec: Record<string, { score: number; max: number }> = {
      A: { score: 0, max: 0 },
      B: { score: 0, max: 0 },
      C: { score: 0, max: 0 },
      D: { score: 0, max: 0 },
    };
    questions.forEach((q) => {
      const s = sec[q.section];
      s.max += q.marks;
      if (q.type === "mcq") {
        const a = answers[q.idx];
        if (typeof a === "number" && a === q.ans) s.score += q.marks;
      } else {
        s.score += awarded[q.idx] || 0;
      }
    });
    return sec;
  }, [questions, answers, awarded]);

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => {
        const a = answers[q.idx];
        if (q.type === "mcq") return typeof a === "number";
        return typeof a === "string" && a.trim().length > 0;
      }).length,
    [questions, answers]
  );

  const reset = () => {
    setStage("setup");
    setQuestions([]);
    setAnswers({});
    setAwarded({});
    setRevealedScheme({});
    setCurrentIdx(0);
    setTimeLeft(0);
    setTakenSec(0);
    submittedRef.current = false;
    confettiRef.current = false;
  };

  // ===== SETUP STAGE =====
  if (stage === "setup") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mock Test 📝</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Board-exam structure · Timed · Sections A–D · CBSE Pattern · Auto-grade MCQs
          </p>
        </div>

        {/* Test type selector */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Test type
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {TEST_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTestType(t.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  testType === t.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="size-4 text-primary" />
                  <span className="font-semibold">{t.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
                <p className="text-xs text-primary mt-2 font-medium flex items-center gap-1">
                  <Clock className="size-3" /> {fmtMins(t.mins)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chapter preset row */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Syllabus preset
          </h2>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.id}
                size="sm"
                variant={preset === p.id ? "default" : "outline"}
                onClick={() => setPreset(p.id)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Test summary bar */}
        <Card className="glass p-5 gap-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">A: {tt.mcq} MCQ × 1</Badge>
              {tt.vsa > 0 && <Badge variant="secondary">B: {tt.vsa} VSA × 2</Badge>}
              {tt.sa > 0 && <Badge variant="secondary">C: {tt.sa} SA × 3</Badge>}
              {tt.la > 0 && <Badge variant="secondary">D: {tt.la} LA × 5</Badge>}
              <Badge variant="outline" className="text-primary border-primary/40">
                Total: {totalMarks} marks
              </Badge>
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                <Clock className="size-3" /> {fmtMins(tt.mins)}
              </Badge>
            </div>
            <Button onClick={startTest} size="lg">
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
    const meta = getSubjMeta(q.subj);
    const timePct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    const lowTime = timeLeft <= 60;
    const currentAns = answers[q.idx];
    const isAnswered =
      q.type === "mcq"
        ? typeof currentAns === "number"
        : typeof currentAns === "string" && currentAns.trim().length > 0;
    const schemeOpen = !!revealedScheme[q.idx];

    return (
      <div className="space-y-4">
        {/* Timer bar */}
        <Card className="glass p-4 gap-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className={`size-5 ${lowTime ? "text-rose-400 animate-pulse" : "text-primary"}`} />
              <span className={`font-mono text-xl font-bold tabular-nums ${lowTime ? "text-rose-400" : ""}`}>
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
            <Progress value={timePct} className={`h-1.5 ${lowTime ? "[&>[data-slot=progress-indicator]]:bg-rose-500" : ""}`} />
          </div>
        </Card>

        {/* Question palette */}
        <Card className="glass p-4 gap-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Question palette
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-32 overflow-y-auto scroll-thin">
            {questions.map((qq) => {
              const a = answers[qq.idx];
              const ans =
                qq.type === "mcq"
                  ? typeof a === "number"
                  : typeof a === "string" && a.trim().length > 0;
              const isCurrent = qq.idx === currentIdx;
              return (
                <button
                  key={qq.idx}
                  onClick={() => setCurrentIdx(qq.idx)}
                  className={`h-8 rounded-md border text-xs font-semibold transition-all ${
                    isCurrent
                      ? "ring-2 ring-primary border-primary text-primary-foreground bg-primary"
                      : ans
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-muted border-border text-muted-foreground hover:bg-muted/70"
                  }`}
                  aria-label={`Jump to question ${qq.idx + 1}`}
                >
                  {qq.idx + 1}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Question area */}
        <div className={meta.cls}>
          <Card className="glass p-5 gap-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="text-subj border-subj bg-subj-dim">
                {meta.emoji} {meta.label}
              </Badge>
              <Badge variant="secondary">{SECTION_META[q.section].label}</Badge>
              <Badge variant="outline" className="text-xs">Ch {q.ch}</Badge>
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                {q.marks}m
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                Q {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <p className="font-semibold text-lg leading-snug mb-4">{q.q}</p>

            {q.type === "mcq" && q.opts && (
              <div className="grid gap-2 sm:grid-cols-2">
                {q.opts.map((opt, i) => {
                  const selected = currentAns === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers((a) => ({ ...a, [q.idx]: i }))}
                      className={`text-left rounded-lg border p-3 text-sm transition-all ${
                        selected
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type !== "mcq" && (
              <div className="space-y-3">
                <Textarea
                  value={typeof currentAns === "string" ? currentAns : ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.idx]: e.target.value }))}
                  placeholder="Write your answer here…"
                  className="min-h-32"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRevealedScheme((r) => ({ ...r, [q.idx]: !r[q.idx] }))}
                >
                  <Eye /> {schemeOpen ? "Hide" : "Reveal"} marking scheme
                </Button>
                {schemeOpen && q.modelAns && (
                  <div className="rounded-lg border border-border bg-muted/40 p-4 animate-float-up">
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Model answer · marking scheme
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{q.modelAns}</p>
                  </div>
                )}
              </div>
            )}

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
  const writtenQs = questions.filter((q) => q.type !== "mcq");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mock Test Results 🎯</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {tt.title} · {preset === "all" ? "Full Syllabus" : getSubjMeta(preset).label}
          </p>
        </div>
        <Button variant="outline" onClick={reset}>
          <RotateCcw /> Back to Setup
        </Button>
      </div>

      {/* Score summary */}
      <Card className="glass p-6 gap-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score</div>
            <div className="text-4xl font-bold tabular-nums">
              {score}
              <span className="text-xl text-muted-foreground">/{totalMarks}</span>
            </div>
            <Badge
              variant="outline"
              className={
                pct >= 80
                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                  : pct >= 50
                  ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                  : "text-rose-400 border-rose-500/30 bg-rose-500/10"
              }
            >
              {pct}%
            </Badge>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time taken</div>
            <div className="text-2xl font-bold tabular-nums flex items-center gap-2">
              <Clock className="size-5 text-primary" /> {fmtHMS(takenSec)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">of {fmtMins(tt.mins)}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Answered</div>
            <div className="text-2xl font-bold tabular-nums">{answeredCount}/{questions.length}</div>
            {pct >= 80 && (
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <Trophy className="size-3" /> Excellent!
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Section-wise breakdown */}
      <Card className="glass p-5 gap-0">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Section-wise breakdown
        </h2>
        <div className="space-y-3">
          {(["A", "B", "C", "D"] as const).map((sec) => {
            const s = sectionScores[sec];
            if (s.max === 0) return null;
            const secPct = s.max > 0 ? (s.score / s.max) * 100 : 0;
            return (
              <div key={sec}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">
                    {SECTION_META[sec].label}{" "}
                    <span className="text-muted-foreground text-xs">· {SECTION_META[sec].type}</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.score}/{s.max}
                  </span>
                </div>
                <Progress value={secPct} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Grade my answers flow */}
      {writtenQs.length > 0 && (
        <Card className="glass p-5 gap-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Grade my answers
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Compare your written answer to the model, then award yourself marks.
          </p>
          <div className="space-y-4 max-h-[28rem] overflow-y-auto scroll-thin pr-1">
            {writtenQs.map((q) => {
              const meta = getSubjMeta(q.subj);
              const yourAns = typeof answers[q.idx] === "string" ? (answers[q.idx] as string) : "";
              const aw = awarded[q.idx] || 0;
              return (
                <div key={q.idx} className={meta.cls}>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-subj border-subj bg-subj-dim">
                        {meta.emoji} {meta.label}
                      </Badge>
                      <Badge variant="secondary">{SECTION_META[q.section].label}</Badge>
                      <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                        {q.marks}m
                      </Badge>
                    </div>
                    <p className="font-medium text-sm mb-2">{q.q}</p>
                    {yourAns.trim() ? (
                      <div className="rounded-md bg-muted/40 p-2 mb-2">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Your answer
                        </div>
                        <p className="whitespace-pre-wrap text-xs">{yourAns}</p>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic mb-2">No answer written.</div>
                    )}
                    <div className="rounded-md bg-primary/5 border border-primary/20 p-2 mb-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1">
                        Model answer
                      </div>
                      <p className="whitespace-pre-wrap text-xs leading-relaxed">{q.modelAns}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground mr-1">Award:</span>
                      {Array.from({ length: q.marks + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setAwarded((a) => ({ ...a, [q.idx]: i }))}
                          className={`h-7 w-9 rounded-md border text-xs font-semibold transition-all ${
                            aw === i
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          {i}/{q.marks}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={reset}>
          <RotateCcw /> Back to Setup
        </Button>
      </div>

      {!mounted ? null : null}
    </div>
  );
}
