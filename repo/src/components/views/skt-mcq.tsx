"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SKT_CHAPTERS, SKT_MCQS } from "@/lib/sanskrit-data";
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

const ACCENT = "#fbbf24";
const LETTERS = ["A", "B", "C", "D"];
const TOTAL = SKT_MCQS.length;

export function SktMcqView() {
  const mounted = useMounted();
  const recordAnswer = useStudyStore((s) => s.recordAnswer);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const subjectStats = useStudyStore((s) => s.subjectStats);

  const skt = subjectStats["sanskrit"] ?? {
    totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0,
    bestStreak: 0, currentStreak: 0, mcqDone: 0, chaptersOpened: 0,
    shortRevealed: 0, longRevealed: 0, flashDone: 0, unlockedAch: [],
    openedChapters: [], histAnswered: 0, histCorrect: 0,
    geoAnswered: 0, geoCorrect: 0, polsciAnswered: 0, polsciCorrect: 0,
    ecoAnswered: 0, ecoCorrect: 0,
  };

  // Filter: chapter id, "all", or "grammar"
  const [filter, setFilter] = useState<string>("all");
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [showingId, setShowingId] = useState<number>(SKT_MCQS[0]?.id ?? 1);
  const [selected, setSelected] = useState<number | null>(null);
  const [showXp, setShowXp] = useState(false);
  const [xpGain, setXpGain] = useState(10);
  const [xpKey, setXpKey] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const xpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filters: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    ...SKT_CHAPTERS.map((c) => ({ key: String(c.id), label: `Ch ${c.id} · ${c.title.slice(0, 18)}${c.title.length > 18 ? "…" : ""}` })),
  ];

  const filtered = useMemo(() => {
    if (filter === "all") return [...SKT_MCQS];
    const chId = Number(filter);
    return SKT_MCQS.filter((m) => m.ch === chId);
  }, [filter]);

  const remaining = useMemo(
    () => filtered.filter((q) => !answered.has(q.id)),
    [filtered, answered]
  );

  const current = SKT_MCQS.find((q) => q.id === showingId) || null;
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
      "sanskrit",
      "sanskrit",
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
      const newStreak = skt.currentStreak + 1;
      const gain = 10 + (skt.currentStreak >= 5 ? 5 : 0);
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
    setShowingId(filtered[0]?.id ?? SKT_MCQS[0]?.id ?? 1);
  };

  const bookmarkObj = current
    ? bookmarks.find(
        (b) => b.track === "sanskrit" && b.type === "mcq" && b.refId === String(current.id)
      )
    : undefined;

  const cappedDone = Math.min(skt.mcqDone, TOTAL);
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            Sanskrit MCQ Quiz <span style={{ color: ACCENT }}>🕉️</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {TOTAL} board-pattern questions · Shemushi + Vyakaran (sandhi/samas/shabdarupa/dhaturoopa) · earn XP!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
            <span>🔥</span>
            <span className="font-semibold">{skt.currentStreak}</span>
          </Badge>
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            <span className="font-semibold">{cappedDone} / {TOTAL}</span>
          </Badge>
        </div>
      </header>

      {/* Filter — chapter dropdown */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground mr-1">Filter:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 max-w-full"
          aria-label="Filter by chapter"
        >
          {filters.map((f) => (
            <option key={f.key} value={f.key} className="bg-background">
              {f.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} Q in this filter</span>
      </div>

      {showCompletion ? (
        <div className="glass rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">
            {scorePct >= 80 ? "🏆" : scorePct >= 50 ? "🎉" : "💪"}
          </div>
          <h2 className="text-2xl font-bold mb-2">Quiz Complete! 🕉️</h2>
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
              <div className="text-xl sm:text-2xl font-bold" style={{ color: ACCENT }}>+{sessionXp}</div>
              <div className="text-xs text-muted-foreground">XP Earned</div>
            </div>
          </div>
          <Button onClick={restart} size="lg" style={{ backgroundColor: ACCENT, color: "#000" }}>
            <RotateCcw className="h-4 w-4 mr-2" /> Restart Quiz
          </Button>
        </div>
      ) : current ? (
        <div
          className="bg-card rounded-2xl p-5 sm:p-6 border-2 relative"
          style={{ borderColor: ACCENT + "40" }}
        >
          {showXp && (
            <span
              key={xpKey}
              className="absolute left-1/2 -translate-x-1/2 top-6 font-bold text-xl pointer-events-none z-10"
              style={{ color: ACCENT, animation: "xp-float 1.2s ease-out forwards" }}
            >
              +{xpGain} XP
            </span>
          )}

          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-md"
                style={{ backgroundColor: ACCENT + "20", color: ACCENT }}
              >
                Ch {current.ch}
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground">
                🕉️ शेमुषी
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
                    track: "sanskrit",
                    type: "mcq",
                    refId: String(current.id),
                    title: current.q.slice(0, 60),
                    ch: current.ch,
                    subj: "sanskrit",
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

          <p
            className="text-base sm:text-lg font-semibold mb-5 leading-relaxed"
            dir="auto"
          >
            {current.q}
          </p>

          <div className="space-y-2.5">
            {current.opts.map((opt, i) => {
              const isCorrect = i === current.ans;
              const isSelected = i === selected;
              let cls = "border-border hover:border-amber-400 hover:bg-amber-500/5";
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
                  <span className="flex-1 text-sm sm:text-base" dir="auto">{opt}</span>
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
                <Lightbulb className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
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
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" dir="auto">
                {current.exp}
              </p>
            </div>
          )}

          {selected !== null && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleNext} size="lg" style={{ backgroundColor: ACCENT, color: "#000" }}>
                Next Question <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
          No questions available.
        </div>
      )}

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
