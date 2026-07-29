"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ENG_SHORT_QA, ENG_CHAPTERS } from "@/lib/english-data";
import type { ENGQA, EngBook } from "@/lib/english-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Eye, EyeOff, BookOpen, Notebook } from "lucide-react";

const ACCENT = SUBJECT_META.english.accent;

type FilterKey = "all" | EngBook;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "First Flight", label: "📚 First Flight" },
  { key: "Footprints", label: "📓 Footprints" },
];

function bookOf(ch: number): EngBook {
  const found = ENG_CHAPTERS.find((c) => c.id === ch);
  return found ? found.book : "First Flight";
}

export function EngShortQaView() {
  const mounted = useMounted();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [graded, setGraded] = useState<Set<number>>(new Set());
  const [grades, setGrades] = useState<Record<number, "got" | "need">>({});

  const revealQA = useStudyStore((s) => s.revealQA);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const counts: Record<FilterKey, number> = {
    all: ENG_SHORT_QA.length,
    "First Flight": ENG_SHORT_QA.filter((q) => bookOf(q.ch) === "First Flight").length,
    "Footprints": ENG_SHORT_QA.filter((q) => bookOf(q.ch) === "Footprints").length,
  };

  const filtered = filter === "all" ? ENG_SHORT_QA : ENG_SHORT_QA.filter((q) => bookOf(q.ch) === filter);

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGrade = (id: number, grade: "got" | "need", marks: number) => {
    setGrades((prev) => ({ ...prev, [id]: grade }));
    if (!graded.has(id)) {
      revealQA("english", "short", marks);
      setGraded((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      pushToast(
        "✍️",
        grade === "got" ? `Nice! +${marks} XP — keep it up!` : `Marked for review · +${marks} XP`,
        "success",
      );
    } else {
      pushToast(
        "📝",
        grade === "got" ? "Marked: got it" : "Marked: need work",
        "info",
      );
    }
  };

  const toggleBm = (qa: ENGQA) => {
    const refId = String(qa.id);
    if (isBookmarked("english", "qa", refId)) {
      const bm = bookmarks.find((b) => b.track === "english" && b.type === "qa" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "english",
        type: "qa",
        refId,
        title: qa.q,
        ch: qa.ch,
        subj: "english",
      });
      pushToast("⭐", "Question bookmarked", "success");
    }
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ACCENT }}>
          Short Answer Q&amp;A ✍️
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {ENG_SHORT_QA.length} two &amp; three-mark questions · Reveal model answers · Self-grade to earn XP
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.key)}
            className="h-9"
            style={filter === f.key ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
          >
            {f.label} ({counts[f.key]})
          </Button>
        ))}
      </div>

      <div className="max-h-[72vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {filtered.map((qa) => {
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("english", "qa", String(qa.id));
          const myGrade = grades[qa.id];
          const book = bookOf(qa.ch);
          const chTitle = ENG_CHAPTERS.find((c) => c.id === qa.ch)?.title ?? "";
          return (
            <Card className="gap-0 rounded-2xl py-0" style={{ borderColor: `${ACCENT}40` }} key={qa.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug md:text-base">
                      <span className="mr-1.5 text-muted-foreground">Q{qa.id}.</span>
                      {qa.q}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" style={{ borderColor: `${ACCENT}66`, color: ACCENT }}>
                        {book === "First Flight" ? <BookOpen className="size-3.5" /> : <Notebook className="size-3.5" />}
                        {book}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Ch {qa.ch}
                      </Badge>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                        {qa.marks}m
                      </Badge>
                    </div>
                    {chTitle && (
                      <p className="mt-1 text-[11px] text-muted-foreground">About: {chTitle}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    aria-label={isBm ? "Remove bookmark" : "Add bookmark"}
                    onClick={() => toggleBm(qa)}
                  >
                    <Star className={isBm ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
                  </Button>
                </div>

                <Button
                  variant={isRevealed ? "secondary" : "default"}
                  size="sm"
                  onClick={() => toggleReveal(qa.id)}
                  className="h-8"
                  style={!isRevealed ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
                >
                  {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {isRevealed ? "Hide Answer" : "Reveal Answer"}
                </Button>

                {isRevealed && (
                  <div className="animate-float-up space-y-3">
                    <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Model Answer · {qa.marks} marks
                      </span>
                      {qa.a}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Self-grade:</span>
                      <Button
                        variant={myGrade === "got" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGrade(qa.id, "got", qa.marks)}
                        className="h-8"
                        style={myGrade === "got" ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
                      >
                        <Check className="size-4" /> Got it
                      </Button>
                      <Button
                        variant={myGrade === "need" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleGrade(qa.id, "need", qa.marks)}
                        className="h-8"
                      >
                        <X className="size-4" /> Need work
                      </Button>
                      {graded.has(qa.id) && (
                        <span className="text-xs text-emerald-400">+{qa.marks} XP earned</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No questions in this filter.
          </div>
        )}
      </div>
    </div>
  );
}
