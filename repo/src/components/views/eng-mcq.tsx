"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ENG_MCQS, ENG_CHAPTERS } from "@/lib/english-data";
import type { EngBook } from "@/lib/english-data";
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

const ACCENT = SUBJECT_META.english.accent;

type FilterKey = "all" | EngBook;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "First Flight", label: "📚 First Flight" },
  { key: "Footprints", label: "📓 Footprints" },
];

const LETTERS = ["A", "B", "C", "D"];
const TOTAL = ENG_MCQS.length;

function bookOf(ch: number): EngBook {
  const found = ENG_CHAPTERS.find((c) => c.id === ch);
  return found ? found.book : "First Flight";
}

export function EngMcqView() {
  const mounted = useMounted();
  const recordAnswer = useStudyStore((s) => s.recordAnswer);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const eng = subjectStats["english"];

  const currentStreak = eng?.currentStreak || 0;
  const bestStreak = eng?.bestStreak || 0;
  const mcqDone = eng?.mcqDone || 0;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(ENG_MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return [...ENG_MCQS];
    return ENG_MCQS.filter((m) => bookOf(m.ch) === filter);
  }, [filter]);

  const remaining = useMemo(
    () => filtered.filter((q) => !answered.has(q.id)),
    [filtered, answered]
  );

  const current = ENG_MCQS.find((q) => q.id === showingId) || null;
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
      "english",
      "english",
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
    setShowingId(filtered[0]?.id ?? ENG_MCQS[0]?.id ?? 1);
  };

  const bookmarkObj = current
    ? bookmarks.find((b) => b.track === "english" && b.type === "mcq" && b.refId === String(current.id))
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

  const curBook = current ? bookOf(current.ch) : "First Flight";
  const curChTitle = ENG_CHAPTERS.find((c) => c.id === current?.ch)?.title ?? "";

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: ACCENT }}>
            English MCQ Quiz 🎯
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
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === f.key
                ? "text-white border-transparent"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
            style={filter === f.key ? { backgroundColor: ACCENT } : undefined}
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
          <Button onClick={restart} size="lg" style={{ backgroundColor: ACCENT, borderColor: ACCENT }}>
            <RotateCcw className="h-4 w-4 mr-2" /> Restart Quiz
          </Button>
        </div>
      ) : current ? (
        <div>
          <div className="bg-card rounded-2xl p-5 sm:p-6 border-2 relative" style={{ borderColor: `${ACCENT}66` }}>
            {showXp && (
              <span
                key={xpKey}
                className="absolute left-1/2 -translate-x-1/2 top-6 text-emerald-400 font-bold text-xl pointer-events-none z-10"
                style={{ animation: "xp-float 1.2s ease-out forwards" }}
              >
                +{xpGain} XP
              </span>
            )}

            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-md"
                  style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
                >
                  Ch {current.ch}
                </span>
                <span className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground">
                  {curBook}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${diffColor(current.diff)}`}>
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
                      track: "english",
                      type: "mcq",
                      refId: String(current.id),
                      title: current.q.slice(0, 60),
                      ch: current.ch,
                      subj: "english",
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

            {curChTitle && (
              <p className="text-[11px] text-muted-foreground mb-3">About: {curChTitle}</p>
            )}

            <p className="text-lg font-semibold mb-5 leading-relaxed">{current.q}</p>

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
              </div>
            )}

            {selected !== null && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleNext} size="lg" style={{ backgroundColor: ACCENT, borderColor: ACCENT }}>
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Session progress · Best streak: {bestStreak}</span>
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
