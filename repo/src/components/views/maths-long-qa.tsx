"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { MATHS_LONG_QA, MATHS_CHAPTERS, type MATHSQA } from "@/lib/maths-data";
import { useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, Eye, CheckCircle2, CircleDot, AlertTriangle } from "lucide-react";

// Maths accent (cyan) — local constant.
const ACCENT = "#22d3ee";

type Grade = "full" | "partial" | "need";

export function MathsLongQaView() {
  const mounted = useMounted();
  const revealQA = useStudyStore((s) => s.revealQA);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [filter, setFilter] = useState<string>("all");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [grades, setGrades] = useState<Record<number, Grade>>({});

  const chapterTitle = (ch: number) =>
    MATHS_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  const items =
    filter === "all"
      ? MATHS_LONG_QA
      : MATHS_LONG_QA.filter((q) => q.ch === Number(filter));

  const toggleReveal = (qa: MATHSQA) => {
    if (!revealed[qa.id]) {
      revealQA("maths", "long", qa.marks);
      setRevealed((r) => ({ ...r, [qa.id]: true }));
      pushToast("💡", `Model answer revealed — +${qa.marks} XP`, "success");
    } else {
      setRevealed((r) => ({ ...r, [qa.id]: false }));
    }
  };

  const setGrade = (qa: MATHSQA, g: Grade) => {
    setGrades((s) => ({ ...s, [qa.id]: g }));
    const xp = g === "full" ? qa.marks : g === "partial" ? Math.max(2, qa.marks - 2) : 1;
    const label = g === "full" ? "Full marks" : g === "partial" ? "Partial" : "Needs work";
    pushToast(
      g === "full" ? "🎉" : g === "partial" ? "👍" : "💪",
      `Self-graded: ${label} (${xp} XP)`,
      g === "full" ? "success" : "info",
    );
  };

  const toggleBookmark = (qa: MATHSQA) => {
    const refId = `maths-long-${qa.id}`;
    if (isBookmarked("maths", "qa", refId)) {
      removeBookmark(refId);
      pushToast("🔖", "Bookmark removed", "info");
    } else {
      addBookmark({
        track: "maths",
        type: "qa",
        refId,
        title: qa.q.slice(0, 80),
        ch: qa.ch,
        subj: "maths",
        note: `Long answer · ${qa.marks} marks`,
      });
      pushToast("🔖", "Bookmarked", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: ACCENT }}>
          Maths Long Answer Questions 📝
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {MATHS_LONG_QA.length} four- & five-mark questions · Detailed step-by-step model answers · Self-grade to earn XP
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
            <SelectItem value="all">All chapters ({MATHS_LONG_QA.length})</SelectItem>
            {MATHS_CHAPTERS.map((c) => {
              const cnt = MATHS_LONG_QA.filter((q) => q.ch === c.id).length;
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

      {/* Q&A list */}
      <div className="space-y-4">
        {items.map((qa) => {
          const isRevealed = !!revealed[qa.id];
          const grade = grades[qa.id];
          const refId = `maths-long-${qa.id}`;
          const bookmarked = mounted && isBookmarked("maths", "qa", refId);
          return (
            <Card
              key={qa.id}
              className="glass p-5 gap-0"
              style={isRevealed ? { borderColor: `${ACCENT}66` } : undefined}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      style={{ borderColor: `${ACCENT}55`, color: ACCENT, backgroundColor: `${ACCENT}11` }}
                    >
                      🔢 Maths
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Ch {qa.ch} · {chapterTitle(qa.ch)}
                    </Badge>
                    <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                      {qa.marks}m
                    </Badge>
                  </div>
                  <p className="font-semibold text-base sm:text-lg leading-snug whitespace-pre-wrap">{qa.q}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleBookmark(qa)}
                  aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark className={bookmarked ? "fill-current" : ""} style={bookmarked ? { color: ACCENT } : undefined} />
                </Button>
              </div>

              <div className="mt-4">
                {!isRevealed ? (
                  <Button
                    onClick={() => toggleReveal(qa)}
                    variant="default"
                    size="sm"
                    style={{ backgroundColor: ACCENT, color: "#06121a" }}
                  >
                    <Eye /> Reveal Model Answer
                  </Button>
                ) : (
                  <div className="space-y-4 animate-float-up">
                    <div className="rounded-lg border border-border bg-muted/40 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Model Answer
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{qa.a}</p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Self-grade your attempt
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={grade === "full" ? "default" : "outline"}
                          onClick={() => setGrade(qa, "full")}
                          style={grade === "full" ? { backgroundColor: ACCENT, color: "#06121a" } : undefined}
                        >
                          <CheckCircle2 /> ✅ Full marks
                        </Button>
                        <Button
                          size="sm"
                          variant={grade === "partial" ? "default" : "outline"}
                          onClick={() => setGrade(qa, "partial")}
                          style={grade === "partial" ? { backgroundColor: ACCENT, color: "#06121a" } : undefined}
                        >
                          <CircleDot /> 🟡 Partial
                        </Button>
                        <Button
                          size="sm"
                          variant={grade === "need" ? "default" : "outline"}
                          onClick={() => setGrade(qa, "need")}
                          style={grade === "need" ? { backgroundColor: ACCENT, color: "#06121a" } : undefined}
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
          );
        })}

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No long-answer questions for this chapter.
          </div>
        )}
      </div>
    </div>
  );
}
