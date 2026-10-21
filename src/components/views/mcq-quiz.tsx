"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore, type ConfidenceLevel } from "@/store/use-study-store";
import { MCQS } from "@/lib/study-data";
import type { Subject } from "@/lib/study-data";
import { getSubjMeta, diffColor, fireConfetti, useMounted } from "@/components/shared/helpers";
import { pickAdaptiveQuestion } from "@/lib/adaptive";
import { AdaptiveTierBadge } from "@/components/shared/adaptive-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { playCorrect, playWrong } from "@/lib/sfx";
import {
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  Gauge,
} from "lucide-react";
import { Markdown } from "@/components/shared/markdown";

type FilterKey = "all" | "chem" | "bio" | "phy" | "adaptive";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "chem", label: "🧪 Chemistry" },
  { key: "bio", label: "🧬 Biology" },
  { key: "phy", label: "⚡ Physics" },
  { key: "adaptive", label: "⚡ Adaptive" },
];

const LETTERS = ["A", "B", "C", "D"];
const TOTAL = 70;

export function McqQuizView() {
  const mounted = useMounted();
  const recordAnswer = useStudyStore((s) => s.recordAnswer);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const currentStreak = useStudyStore((s) => s.currentStreak);
  const mcqDone = useStudyStore((s) => s.mcqDone);
  const adaptive = useStudyStore((s) => s.adaptive.science);
  const advanceAdaptiveTier = useStudyStore((s) => s.advanceAdaptiveTier);
  const logConfidence = useStudyStore((s) => s.logConfidence);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [pyqOnly, setPyqOnly] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [confidenceLogged, setConfidenceLogged] = useState<Set<number>>(new Set());
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adaptive mode draws from the whole pool (like "All") — the tier engine
  // below picks *which* question within it, rather than pre-sorting the list.
  const filtered = useMemo(() => {
    const base = filter === "all" || filter === "adaptive" ? [...MCQS] : MCQS.filter((m) => m.subj === (filter as Subject));
    return pyqOnly ? base.filter((m) => m.pyq) : base;
  }, [filter, pyqOnly]);

  const pickNext = (pool: typeof MCQS): typeof MCQS[number] | null => {
    if (filter === "adaptive") return pickAdaptiveQuestion(pool, adaptive.tier);
    return pool[0] ?? null;
  };

  const remaining = useMemo(
    () => filtered.filter((q) => !answered.has(q.id)),
    [filtered, answered]
  );

  const current = MCQS.find((q) => q.id === showingId) || null;
  const done = remaining.length === 0 && answered.size > 0;
  const showCompletion = done && selected === null;

  // When filter changes, reset session stats and jump to first remaining
  useEffect(() => {
    setSelected(null);
    setSessionCorrect(0);
    setSessionXp(0);
    setSessionAnswered(0);
    setShowXp(false);
    const pool = filtered.filter((q) => !answered.has(q.id));
    const next = pickNext(pool);
    if (next) setShowingId(next.id);
    else if (filtered.length > 0) setShowingId(filtered[0].id);
     
  }, [filter, pyqOnly]);

  useEffect(() => {
    return () => {
      if (xpTimeoutRef.current) clearTimeout(xpTimeoutRef.current);
    };
  }, []);

  const handleAnswer = (optIdx: number) => {
    if (!current || selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === current.ans;
    if (correct) playCorrect(); else playWrong();
    setAnswered((prev) => new Set(prev).add(current.id));
    setSessionAnswered((n) => n + 1);
    recordAnswer(
      "science",
      current.subj,
      current.ch,
      correct,
      current.id,
      current.q,
      current.opts[optIdx],
      current.opts[current.ans],
      current.exp,
      current.diff,
      current.pyq
    );
    if (filter === "adaptive") advanceAdaptiveTier("science", correct);
    if (correct) {
      const newStreak = currentStreak + 1;
      const gain = 10 + (currentStreak >= 4 ? 5 : 0);
      setSessionCorrect((n) => n + 1);
      setSessionXp((x) => x + gain);
      setXpGain(gain);
      setXpKey((k) => k + 1);
      setShowXp(true);
      if (xpTimeoutRef.current) clearTimeout(xpTimeoutRef.current);
      xpTimeoutRef.current = setTimeout(() => setShowXp(false), 1300);
      if (newStreak === 5 || newStreak === 10) fireConfetti();
    }
  };

  const handleConfidence = (level: ConfidenceLevel) => {
    if (!current || selected === null || confidenceLogged.has(current.id)) return;
    logConfidence("science", level, selected === current.ans);
    setConfidenceLogged((prev) => new Set(prev).add(current.id));
  };

  const handleNext = () => {
    setSelected(null);
    setShowXp(false);
    const pool = filtered.filter((q) => !answered.has(q.id));
    const next = pickNext(pool);
    if (next) setShowingId(next.id);
  };

  const restart = () => {
    setAnswered(new Set());
    setSelected(null);
    setSessionCorrect(0);
    setSessionXp(0);
    setSessionAnswered(0);
    setShowXp(false);
    setShowingId(pickNext(filtered)?.id ?? MCQS[0]?.id ?? 1);
  };

  const bookmarkObj = current
    ? bookmarks.find(
        (b) => b.track === "science" && b.type === "mcq" && b.refId === String(current.id)
      )
    : undefined;

  const cappedDone = Math.min(mcqDone, TOTAL);
  const scorePct = sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0;

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 bg-muted/50 rounded animate-pulse" />
        <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">MCQ Quiz 🎯</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {MCQS.length} board-style questions · Earn XP · Build streaks for bonus rewards!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`gap-1.5 px-3 py-1.5 text-sm transition-all duration-300 ${
              currentStreak >= 10 ? "bg-amber-400/20 text-amber-600 dark:text-amber-300 ring-1 ring-amber-400/50 animate-glow" :
              currentStreak >= 5 ? "bg-amber-400/15 text-amber-600 dark:text-amber-300" :
              currentStreak >= 3 ? "bg-orange-400/10 text-orange-600 dark:text-orange-300" : ""
            }`}
          >
            <span className={currentStreak >= 3 ? "animate-pulse" : ""}>🔥</span>
            <span key={currentStreak} className="font-semibold animate-correct-pop inline-block">{currentStreak}</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            <span className="font-semibold">{cappedDone} / {TOTAL}</span>
          </Badge>
        </div>
      </header>

      {currentStreak >= 5 && (
        <div className="text-center -mt-1 animate-float-up">
          <span className="text-xs font-bold tracking-wide uppercase text-amber-600 dark:text-amber-300">
            {currentStreak >= 10 ? `🔥 ${currentStreak}-streak — unstoppable!` : `🔥 ${currentStreak} in a row — on fire!`}
          </span>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setPyqOnly((v) => !v)}
          className={`ml-auto px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            pyqOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          }`}
        >
          📄 PYQ only
        </button>
      </div>

      {filter === "adaptive" && (
        <AdaptiveTierBadge tier={adaptive.tier} correctRun={adaptive.correctRun} wrongRun={adaptive.wrongRun} />
      )}

      {showCompletion ? (
        <div className="glass rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">
            {scorePct >= 80 ? "🏆" : scorePct >= 50 ? "🎉" : "💪"}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You answered {sessionAnswered} question{sessionAnswered !== 1 ? "s" : ""} in this category.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 rounded-xl bg-muted/50">
              <div className="text-xl sm:text-2xl font-bold text-primary">{scorePct}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-muted/50">
              <div className="text-xl sm:text-2xl font-bold text-emerald-500">{sessionCorrect}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-muted/50">
              <div className="text-xl sm:text-2xl font-bold text-amber-500">+{sessionXp}</div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </div>
          </div>
          <Button onClick={restart} size="lg">
            <RotateCcw className="h-4 w-4 mr-2" /> Restart Quiz
          </Button>
        </div>
      ) : current ? (
        <div className={getSubjMeta(current.subj).cls}>
          <div className="bg-card rounded-2xl p-5 sm:p-6 border-2 border-subj relative">
            {showXp && (
              <span
                key={xpKey}
                className="absolute left-1/2 -translate-x-1/2 top-6 text-emerald-400 font-bold text-xl pointer-events-none z-10"
                style={{ animation: "xp-float 1.2s ease-out forwards" }}
              >
                +{xpGain} XP
              </span>
            )}

            {/* Header row: chapter + subject + difficulty + bookmark */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-subj-dim text-subj">
                  Ch {current.ch}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground">
                  {getSubjMeta(current.subj).emoji} {getSubjMeta(current.subj).label}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-md border ${diffColor(current.diff)}`}
                >
                  {current.diff}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => {
                  if (bookmarkObj) {
                    removeBookmark(bookmarkObj.id);
                  } else if (current) {
                    addBookmark({
                      track: "science",
                      type: "mcq",
                      refId: String(current.id),
                      title: current.q.slice(0, 60),
                      ch: current.ch,
                      subj: current.subj,
                    });
                  }
                }}
                aria-label={bookmarkObj ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarkObj ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Question text */}
            <p className="text-lg font-semibold mb-5 leading-relaxed">{current.q}</p>

            {/* Options */}
            <div className="space-y-2.5">
              {current.opts.map((opt, i) => {
                const isCorrect = i === current.ans;
                const isSelected = i === selected;
                let cls = "border-border hover:border-primary hover:bg-primary/5";
                let motion = "";
                if (selected !== null) {
                  if (isCorrect) { cls = "border-emerald-500 bg-emerald-500/10"; motion = "animate-correct-pop"; }
                  else if (isSelected) { cls = "border-rose-500 bg-rose-500/10"; motion = "animate-shake"; }
                  else cls = "border-border opacity-60";
                }
                return (
                  <button
                    key={i}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${cls} ${motion}`}
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{opt}</span>
                    {selected !== null && isCorrect && (
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5 animate-check-in" />
                    )}
                    {selected !== null && isSelected && !isCorrect && (
                      <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5 animate-check-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {selected !== null && (
              <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold text-sm">Explanation</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border ml-auto ${
                      selected === current.ans
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : "text-rose-400 border-rose-500/30 bg-rose-500/10"
                    }`}
                  >
                    {selected === current.ans ? "✓ Correct" : "✗ Wrong"}
                  </span>
                </div>
                <Markdown text={current.exp} className="text-muted-foreground" />
              </div>
            )}

            {/* Confidence calibration prompt — optional, additive, never
                blocks the next-question flow. See lib/mastery-engine.ts's
                computeCalibration for how this becomes an insight. */}
            {selected !== null && current && !confidenceLogged.has(current.id) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Gauge className="size-3.5" /> How confident were you?</span>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("low")}>Low</Button>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("medium")}>Medium</Button>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("high")}>High</Button>
              </div>
            )}

            {/* Next button */}
            {selected !== null && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleNext} size="lg">
                  Next Question <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
          No questions available.
        </div>
      )}

      {/* Session progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Session progress</span>
          <span>
            {sessionAnswered} / {filtered.length}
          </span>
        </div>
        <Progress
          value={filtered.length > 0 ? (sessionAnswered / filtered.length) * 100 : 0}
          className="h-1.5"
        />
      </div>
    </div>
  );
}
