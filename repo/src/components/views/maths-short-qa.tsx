"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MATHS_SHORT_QA, MATHS_CHAPTERS, type MATHSQA } from "@/lib/maths-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Check, X, Eye, EyeOff } from "lucide-react";

// Maths accent (cyan) — local constant.
const ACCENT = "#22d3ee";

export function MathsShortQaView() {
  const mounted = useMounted();
  const [filter, setFilter] = useState<string>("all"); // "all" or chapter id string
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [graded, setGraded] = useState<Set<number>>(new Set());
  const [grades, setGrades] = useState<Record<number, "got" | "need">>({});

  const revealQA = useStudyStore((s) => s.revealQA);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const filtered =
    filter === "all"
      ? MATHS_SHORT_QA
      : MATHS_SHORT_QA.filter((q) => q.ch === Number(filter));

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGrade = (qa: MATHSQA, grade: "got" | "need") => {
    setGrades((prev) => ({ ...prev, [qa.id]: grade }));
    if (!graded.has(qa.id)) {
      revealQA("maths", "short", qa.marks);
      setGraded((prev) => {
        const next = new Set(prev);
        next.add(qa.id);
        return next;
      });
      pushToast(
        "✍️",
        grade === "got" ? `Nice! +${qa.marks} XP — keep it up!` : `Marked for review · +${qa.marks} XP`,
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

  const toggleBm = (qa: MATHSQA) => {
    const refId = String(qa.id);
    if (isBookmarked("maths", "qa", refId)) {
      const bm = bookmarks.find((b) => b.track === "maths" && b.type === "qa" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "maths",
        type: "qa",
        refId,
        title: qa.q,
        ch: qa.ch,
        subj: "maths",
      });
      pushToast("⭐", "Question bookmarked", "success");
    }
  };

  const chapterTitle = (ch: number) =>
    MATHS_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ACCENT }}>
          Maths Short Answer Q&amp;A ✍️
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {MATHS_SHORT_QA.length} two- & three-mark questions · Reveal model answers · Self-grade to earn XP
        </p>
      </div>

      {/* Chapter filter dropdown */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground whitespace-nowrap">Chapter:</label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-72 bg-background">
            <SelectValue placeholder="All chapters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All chapters ({MATHS_SHORT_QA.length})</SelectItem>
            {MATHS_CHAPTERS.map((c) => {
              const cnt = MATHS_SHORT_QA.filter((q) => q.ch === c.id).length;
              if (cnt === 0) return null;
              return (
                <SelectItem key={c.id} value={String(c.id)}>
                  Ch {c.id} · {c.title} ({cnt})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="max-h-[72vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {filtered.map((qa) => {
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("maths", "qa", String(qa.id));
          const myGrade = grades[qa.id];
          return (
            <Card
              key={qa.id}
              className="gap-0 rounded-2xl py-0"
              style={{ borderColor: isRevealed ? ACCENT : undefined }}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug md:text-base">
                      <span className="mr-1.5 text-muted-foreground">Q{qa.id}.</span>
                      {qa.q}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
                      >
                        🔢 Maths
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Ch {qa.ch} · {chapterTitle(qa.ch)}
                      </Badge>
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                        {qa.marks}m
                      </Badge>
                    </div>
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
                  style={isRevealed ? undefined : { backgroundColor: ACCENT, color: "#06121a" }}
                >
                  {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {isRevealed ? "Hide Answer" : "Reveal Answer"}
                </Button>

                {isRevealed && (
                  <div className="animate-float-up space-y-3">
                    <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed font-mono">
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground font-sans">
                        Model Answer
                      </span>
                      {qa.a}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Self-grade:</span>
                      <Button
                        variant={myGrade === "got" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGrade(qa, "got")}
                        className="h-8"
                      >
                        <Check className="size-4" /> Got it
                      </Button>
                      <Button
                        variant={myGrade === "need" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleGrade(qa, "need")}
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
            No short-answer questions in this chapter.
          </div>
        )}
      </div>
    </div>
  );
}
