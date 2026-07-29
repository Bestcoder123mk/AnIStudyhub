"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { LONG_QA, CHAPTERS } from "@/lib/study-data";
import type { QA, Subject } from "@/lib/study-data";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bookmark, Eye, CheckCircle2, CircleDot, AlertTriangle } from "lucide-react";

type Filter = "all" | Subject;
type Grade = "full" | "partial" | "need";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "chem", label: "🧪 Chemistry" },
  { id: "bio", label: "🧬 Biology" },
  { id: "phy", label: "⚡ Physics" },
];

export function LongQaView() {
  const mounted = useMounted();
  const revealQA = useStudyStore((s) => s.revealQA);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [filter, setFilter] = useState<Filter>("all");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [grades, setGrades] = useState<Record<number, Grade>>({});

  const chapterTitle = (ch: number) =>
    CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  const items = LONG_QA.filter((q) => filter === "all" || q.subj === filter);

  const toggleReveal = (qa: QA) => {
    if (!revealed[qa.id]) {
      revealQA("science", "long", 5);
      setRevealed((r) => ({ ...r, [qa.id]: true }));
      pushToast("💡", "Model answer revealed — +5 XP", "success");
    } else {
      setRevealed((r) => ({ ...r, [qa.id]: false }));
    }
  };

  const setGrade = (id: number, g: Grade) => {
    setGrades((s) => ({ ...s, [id]: g }));
    const xp = g === "full" ? 5 : g === "partial" ? 3 : 1;
    const label = g === "full" ? "Full marks" : g === "partial" ? "Partial" : "Needs work";
    pushToast(
      g === "full" ? "🎉" : g === "partial" ? "👍" : "💪",
      `Self-graded: ${label} (${xp} XP)`,
      g === "full" ? "success" : "info"
    );
  };

  const toggleBookmark = (qa: QA) => {
    const refId = `long-${qa.id}`;
    if (isBookmarked("science", "qa", refId)) {
      removeBookmark(refId);
      pushToast("🔖", "Bookmark removed", "info");
    } else {
      addBookmark({
        track: "science",
        type: "qa",
        refId,
        title: qa.q.slice(0, 80),
        ch: qa.ch,
        subj: qa.subj,
        note: `Long answer · ${qa.marks} marks`,
      });
      pushToast("🔖", "Bookmarked", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Long Answer Questions 📝</h1>
        <p className="text-muted-foreground text-sm mt-1">
          14 five-mark questions · Detailed model answers · Self-grade to earn XP
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? "default" : "outline"}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Q&A list */}
      <div className="space-y-4">
        {items.map((qa) => {
          const meta = getSubjMeta(qa.subj);
          const isRevealed = !!revealed[qa.id];
          const grade = grades[qa.id];
          const refId = `long-${qa.id}`;
          const bookmarked = mounted && isBookmarked("science", "qa", refId);
          return (
            <div key={qa.id} className={meta.cls}>
              <Card className="glass p-5 gap-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-subj border-subj bg-subj-dim">
                        {meta.emoji} {meta.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Ch {qa.ch} · {chapterTitle(qa.ch)}
                      </Badge>
                      <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                        5m
                      </Badge>
                    </div>
                    <p className="font-semibold text-lg leading-snug">{qa.q}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleBookmark(qa)}
                    aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark className={bookmarked ? "fill-current text-primary" : ""} />
                  </Button>
                </div>

                <div className="mt-4">
                  {!isRevealed ? (
                    <Button onClick={() => toggleReveal(qa)} variant="default" size="sm">
                      <Eye /> Reveal Model Answer
                    </Button>
                  ) : (
                    <div className="space-y-4 animate-float-up">
                      <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Model Answer
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{qa.a}</p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Self-grade your attempt
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={grade === "full" ? "default" : "outline"}
                            onClick={() => setGrade(qa.id, "full")}
                          >
                            <CheckCircle2 /> ✅ Full marks
                          </Button>
                          <Button
                            size="sm"
                            variant={grade === "partial" ? "default" : "outline"}
                            onClick={() => setGrade(qa.id, "partial")}
                          >
                            <CircleDot /> 🟡 Partial
                          </Button>
                          <Button
                            size="sm"
                            variant={grade === "need" ? "default" : "outline"}
                            onClick={() => setGrade(qa.id, "need")}
                          >
                            <AlertTriangle /> ❌ Need work
                          </Button>
                        </div>
                      </div>

                      <Button size="sm" variant="ghost" onClick={() => toggleReveal(qa)}>
                        Hide answer
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No questions for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
