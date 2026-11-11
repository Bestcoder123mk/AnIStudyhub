"use client";

import { CheckBar } from "@/components/shared/check-bar";
import { LessonComplete, LESSON_SIZE } from "@/components/shared/lesson-complete";
import { useQuizKeys } from "@/components/shared/use-quiz-keys";
import { SessionBar } from "@/components/shared/session-bar";
import { ChapterFocusChip } from "@/components/shared/chapter-focus-chip";
import { readableTextColor } from "@/components/shared/helpers";
import { AnswerSheet } from "@/components/shared/answer-sheet";
import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore, SUBJECT_META, type ConfidenceLevel } from "@/store/use-study-store";
import { ENG_MCQS, ENG_CHAPTERS } from "@/lib/english-data";
import type { EngBook } from "@/lib/english-data";
import { diffColor, fireConfetti, useMounted } from "@/components/shared/helpers";
import { pickAdaptiveQuestion } from "@/lib/adaptive";
import { AdaptiveTierBadge } from "@/components/shared/adaptive-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const ACCENT = SUBJECT_META.english.accent;

type FilterKey = "all" | EngBook | "adaptive";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "First Flight", label: "📚 First Flight" },
  { key: "Footprints", label: "📓 Footprints" },
  { key: "adaptive", label: "⚡ Adaptive" },
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
  const adaptive = useStudyStore((s) => s.adaptive.english);
  const advanceAdaptiveTier = useStudyStore((s) => s.advanceAdaptiveTier);
  const logConfidence = useStudyStore((s) => s.logConfidence);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [pyqOnly, setPyqOnly] = useState(false);
  // Opened from the learning path for one chapter? Scope the whole session to it.
  const [chapterFocus, setChapterFocus] = useState<number | null>(() => {
    const fc = useStudyStore.getState().focusChapter;
    return fc && fc.track === "english" ? fc.id : null;
  });
  useEffect(() => {
    if (useStudyStore.getState().focusChapter) useStudyStore.getState().setFocusChapter(null);
  }, []);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(ENG_MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [extra, setExtra] = useState(false); // kept going past the first lesson
  const [picked, setPicked] = useState<number | null>(null); // selected, not yet checked
  const [confidenceLogged, setConfidenceLogged] = useState<Set<number>>(new Set());
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const base = filter === "all" || filter === "adaptive" ? [...ENG_MCQS] : ENG_MCQS.filter((m) => bookOf(m.ch) === filter);
    const scoped = chapterFocus === null ? base : base.filter((m) => m.ch === chapterFocus);
    return pyqOnly ? scoped.filter((m) => m.pyq) : scoped;
  }, [filter, pyqOnly, chapterFocus]);

  const pickNext = (pool: typeof ENG_MCQS): typeof ENG_MCQS[number] | null => {
    if (filter === "adaptive") return pickAdaptiveQuestion(pool, adaptive.tier);
    return pool[0] ?? null;
  };

  const remaining = useMemo(
    () => filtered.filter((q) => !answered.has(q.id)),
    [filtered, answered]
  );

  const current = ENG_MCQS.find((q) => q.id === showingId) || null;
  const done = remaining.length === 0 && answered.size > 0;
  const lessonOver = !extra && sessionAnswered >= LESSON_SIZE; // a lesson is 10 questions, then a celebration
  const showCompletion = (done || lessonOver) && selected === null;
  const lessonTotal = extra ? filtered.length : Math.min(filtered.length, LESSON_SIZE);

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
     
  }, [filter, pyqOnly, chapterFocus]);

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
      current.diff,
      current.pyq
    );
    if (filter === "adaptive") advanceAdaptiveTier("english", correct);
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

  const handleConfidence = (level: ConfidenceLevel) => {
    if (!current || selected === null || confidenceLogged.has(current.id)) return;
    logConfidence("english", level, selected === current.ans);
    setConfidenceLogged((prev) => new Set(prev).add(current.id));
  };

  const handleNext = () => {
    setPicked(null);
    setSelected(null);
    setShowXp(false);
    const pool = filtered.filter((q) => !answered.has(q.id));
    const next = pickNext(pool);
    if (next) setShowingId(next.id);
  };
  useQuizKeys({ answered: selected !== null, optionCount: current?.opts.length ?? 0, picked, onPick: setPicked, onCheck: () => picked !== null && handleAnswer(picked), onNext: handleNext });

  const restart = () => {
    setExtra(false);
    setPicked(null);
    setAnswered(new Set());
    setSelected(null);
    setSessionCorrect(0);
    setSessionXp(0);
    setSessionAnswered(0);
    setShowXp(false);
    setShowingId(pickNext(filtered)?.id ?? ENG_MCQS[0]?.id ?? 1);
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
      <SessionBar answered={sessionAnswered} total={lessonTotal} />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === f.key
                ? "border-transparent"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
            style={filter === f.key ? { backgroundColor: ACCENT, color: readableTextColor(ACCENT) } : undefined}
          >
            {f.label}
          </button>
        ))}
        {chapterFocus !== null && <ChapterFocusChip track="english" id={chapterFocus} onClear={() => setChapterFocus(null)} />}
          <button
          onClick={() => setPyqOnly((v) => !v)}
          className={`ml-auto px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
            pyqOnly
              ? "border-transparent"
              : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          }`}
          style={pyqOnly ? { backgroundColor: ACCENT, color: readableTextColor(ACCENT) } : undefined}
        >
          📄 PYQ only
        </button>
      </div>

      {filter === "adaptive" && (
        <AdaptiveTierBadge tier={adaptive.tier} correctRun={adaptive.correctRun} wrongRun={adaptive.wrongRun} />
      )}

      {showCompletion ? (
        <LessonComplete track="english" accuracy={scorePct} correct={sessionCorrect} answered={sessionAnswered} xp={sessionXp} continueLabel={done ? "Play again" : "Continue"} onContinue={() => (done ? restart() : setExtra(true))} />
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
                let cls = picked === i && selected === null ? "choice choice-picked" : "choice";
                if (selected !== null) {
                  if (isCorrect) cls = "choice choice-correct";
                  else if (isSelected) cls = "choice choice-wrong";
                  else cls = "choice choice-dim";
                }
                return (
                  <button
                    key={i}
                    disabled={selected !== null}
                    aria-pressed={picked === i}
                    onClick={() => setPicked(i)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${cls}`}
                  >
                    <span className="choice-key">
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

            {selected === null && current && !showCompletion && <CheckBar disabled={picked === null} onCheck={() => picked !== null && handleAnswer(picked)} />}
{selected !== null && current && (
<AnswerSheet correct={selected === current.ans}>
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

            {selected !== null && current && !confidenceLogged.has(current.id) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Gauge className="size-3.5" /> How confident were you?</span>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("low")}>Low</Button>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("medium")}>Medium</Button>
                <Button size="sm" variant="outline" className="h-7 px-2.5" onClick={() => handleConfidence("high")}>High</Button>
              </div>
            )}

            {selected !== null && (
              <div className="mt-4 flex justify-end">
                <Button onClick={handleNext} size="lg" style={{ backgroundColor: ACCENT, color: readableTextColor(ACCENT), ["--primary-ledge" as string]: `color-mix(in oklch, ${ACCENT} 62%, black)` }}>
                  Next Question <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
</AnswerSheet>
)}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
          No questions available.
        </div>
      )}

    </div>
  );
}
