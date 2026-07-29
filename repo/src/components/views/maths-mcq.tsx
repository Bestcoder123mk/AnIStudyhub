"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MATHS_MCQS } from "@/lib/maths-data";
import { MATHS_CHAPTERS } from "@/lib/maths-data";
import { diffColor, fireConfetti, useMounted } from "@/components/shared/helpers";
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

// Maths accent (cyan) — local constant.
const ACCENT = "#22d3ee";

// Chapter groups for filtering — like subjects in the science track.
type GroupKey = "all" | "algebra" | "geometry" | "coordTrig" | "mensuration" | "statsProb" | "adaptive";

const GROUP_TO_CHAPTERS: Record<Exclude<GroupKey, "all" | "adaptive">, number[]> = {
  algebra: [1, 2, 3, 4, 5],
  geometry: [6, 9],
  coordTrig: [7, 8],
  mensuration: [10, 11],
  statsProb: [12, 13],
};

const FILTERS: { key: GroupKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "algebra", label: "🔢 Algebra" },
  { key: "geometry", label: "📐 Geometry" },
  { key: "coordTrig", label: "🧭 Coord & Trig" },
  { key: "mensuration", label: "🌀 Mensuration" },
  { key: "statsProb", label: "📊 Stats & Prob" },
  { key: "adaptive", label: "⚡ Adaptive" },
];

const LETTERS = ["A", "B", "C", "D"];
const TOTAL = MATHS_MCQS.length;

const chapterTitle = (ch: number) =>
  MATHS_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

function groupOfCh(ch: number): "algebra" | "geometry" | "coordTrig" | "mensuration" | "statsProb" | "other" {
  for (const k of Object.keys(GROUP_TO_CHAPTERS) as (keyof typeof GROUP_TO_CHAPTERS)[]) {
    if (GROUP_TO_CHAPTERS[k].includes(ch)) return k;
  }
  return "other";
}

export function MathsMcqView() {
  const mounted = useMounted();
  const recordAnswer = useStudyStore((s) => s.recordAnswer);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const subjectStats = useStudyStore((s) => s.subjectStats);

  const stats = subjectStats["maths"];
  const currentStreak = stats?.currentStreak ?? 0;
  const mcqDone = stats?.mcqDone ?? 0;

  const [filter, setFilter] = useState<GroupKey>("all");
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(MATHS_MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (filter === "adaptive") {
      // Adaptive: surface unanswered first, then easier ones (group by chapter variety).
      return [...MATHS_MCQS].sort((a, b) => {
        const aDone = answered.has(a.id) ? 1 : 0;
        const bDone = answered.has(b.id) ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        const aRank = a.diff === "easy" ? 0 : a.diff === "medium" ? 1 : 2;
        const bRank = b.diff === "easy" ? 0 : b.diff === "medium" ? 1 : 2;
        return aRank - bRank;
      });
    }
    if (filter === "all") return [...MATHS_MCQS];
    const chs = GROUP_TO_CHAPTERS[filter];
    return MATHS_MCQS.filter((m) => chs.includes(m.ch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, answered]);

  const remaining = useMemo(
    () => filtered.filter((q) => !answered.has(q.id)),
    [filtered, answered]
  );

  const current = MATHS_MCQS.find((q) => q.id === showingId) || null;
  const done = remaining.length === 0 && answered.size > 0;
  const showCompletion = done && selected === null;

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
      "maths",
      "maths",
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
      const gain = 10 + (currentStreak >= 5 ? 5 : 0);
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
    setShowingId(filtered[0]?.id ?? MATHS_MCQS[0]?.id ?? 1);
  };

  const bookmarkObj = current
    ? bookmarks.find(
        (b) => b.track === "maths" && b.type === "mcq" && b.refId === String(current.id)
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: ACCENT }}>
            Maths MCQ Quiz 🎯
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {TOTAL} board-pattern questions · Earn XP · Build streaks for bonus rewards!
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
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
              style={
                active
                  ? { backgroundColor: ACCENT, color: "#06121a", borderColor: ACCENT }
                  : undefined
              }
              aria-pressed={active}
            >
              <span
                className={
                  active
                    ? ""
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {f.label}
              </span>
            </button>
          );
        })}
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
              <div className="text-xl sm:text-2xl font-bold" style={{ color: ACCENT }}>{scorePct}%</div>
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
        <div>
          <div
            className="bg-card rounded-2xl p-5 sm:p-6 border-2 relative"
            style={{ borderColor: ACCENT }}
          >
            {showXp && (
              <span
                key={xpKey}
                className="absolute left-1/2 -translate-x-1/2 top-6 text-emerald-400 font-bold text-xl pointer-events-none z-10"
                style={{ animation: "xp-float 1.2s ease-out forwards" }}
              >
                +{xpGain} XP
              </span>
            )}

            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-md"
                  style={{ backgroundColor: `${ACCENT}22`, color: ACCENT }}
                >
                  Ch {current.ch}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground">
                  🔢 {chapterTitle(current.ch)}
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
                      track: "maths",
                      type: "mcq",
                      refId: String(current.id),
                      title: current.q.slice(0, 60),
                      ch: current.ch,
                      subj: "maths",
                    });
                  }
                }}
                aria-label={bookmarkObj ? "Remove bookmark" : "Add bookmark"}
              >
                {bookmarkObj ? (
                  <BookmarkCheck className="h-4 w-4" style={{ color: ACCENT }} />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Question text */}
            <p className="text-base sm:text-lg font-semibold mb-5 leading-relaxed whitespace-pre-wrap">
              {current.q}
            </p>

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
                    <span className="flex-1 text-sm sm:text-base whitespace-pre-wrap">{opt}</span>
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
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{current.exp}</p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Group: {groupOfCh(current.ch)}
                </p>
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
