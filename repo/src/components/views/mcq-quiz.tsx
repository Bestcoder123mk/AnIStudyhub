"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MCQS } from "@/lib/study-data";
import type { Subject } from "@/lib/study-data";
import { getSubjMeta, diffColor, fireConfetti, useMounted } from "@/components/shared/helpers";
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
} from "lucide-react";

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
  const chemCorrect = useStudyStore((s) => s.chemCorrect);
  const chemAttempted = useStudyStore((s) => s.chemAttempted);
  const bioCorrect = useStudyStore((s) => s.bioCorrect);
  const bioAttempted = useStudyStore((s) => s.bioAttempted);
  const phyCorrect = useStudyStore((s) => s.phyCorrect);
  const phyAttempted = useStudyStore((s) => s.phyAttempted);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subjectAccuracy = (subj: Subject): number => {
    const c = subj === "chem" ? chemCorrect : subj === "bio" ? bioCorrect : phyCorrect;
    const a = subj === "chem" ? chemAttempted : subj === "bio" ? bioAttempted : phyAttempted;
    return a > 0 ? c / a : 0.5;
  };

  const filtered = useMemo(() => {
    if (filter === "adaptive") {
      return [...MCQS].sort((a, b) => subjectAccuracy(a.subj) - subjectAccuracy(b.subj));
    }
    if (filter === "all") return [...MCQS];
    return MCQS.filter((m) => m.subj === (filter as Subject));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, chemCorrect, chemAttempted, bioCorrect, bioAttempted, phyCorrect, phyAttempted]);

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
    const next = filtered.find((q) => !answered.has(q.id));
    if (next) setShowingId(next.id);
    else if (filtered.length > 0) setShowingId(filtered[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

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
      current.diff
    );
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

  const handleNext = () => {
    setSelected(null);
    setShowXp(false);
    const next = filtered.find((q) => !answered.has(q.id));
    if (next) setShowingId(next.id);
  };

  const restart = () => {
    setAnswered(new Set());
    setSelected(null);
    setSessionCorrect(0);
    setSessionXp(0);
    setSessionAnswered(0);
    setShowXp(false);
    setShowingId(filtered[0]?.id ?? MCQS[0]?.id ?? 1);
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
            70 board-style questions · Earn XP · Build streaks for bonus rewards!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
            <span>🔥</span>
            <span className="font-semibold">{currentStreak}</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            <span className="font-semibold">{cappedDone} / {TOTAL}</span>
          </Badge>
        </div>
      </header>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
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
      </div>

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
                if (selected !== null) {
                  if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10";
                  else if (isSelected) cls = "border-rose-500 bg-rose-500/10";
                  else cls = "border-border opacity-60";
                }
                return (
                  <button
                    key={i}
                    disabled={selected !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${cls}`}
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {LETTERS[i]}
                    </span>
                    <span className="flex-1 text-sm sm:text-base">{opt}</span>
                    {selected !== null && isCorrect && (
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    {selected !== null && isSelected && !isCorrect && (
                      <X className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
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
                <p className="text-sm text-muted-foreground leading-relaxed">{current.exp}</p>
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
