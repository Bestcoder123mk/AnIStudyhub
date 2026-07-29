"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SSC_SHORT_QA, type SscQA, type SscSubject } from "@/lib/study-data";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Eye, EyeOff, Landmark, Globe, Scale, Coins } from "lucide-react";

type FilterKey = "all" | SscSubject;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hist", label: "🏛️ History" },
  { key: "geo", label: "🌍 Geography" },
  { key: "polsci", label: "⚖️ Pol. Science" },
  { key: "eco", label: "💰 Economics" },
];

function subjIcon(subj: SscSubject) {
  if (subj === "hist") return <Landmark className="size-3.5" />;
  if (subj === "geo") return <Globe className="size-3.5" />;
  if (subj === "polsci") return <Scale className="size-3.5" />;
  return <Coins className="size-3.5" />;
}

export function SscShortQaView() {
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
    all: SSC_SHORT_QA.length,
    hist: SSC_SHORT_QA.filter((q) => q.subj === "hist").length,
    geo: SSC_SHORT_QA.filter((q) => q.subj === "geo").length,
    polsci: SSC_SHORT_QA.filter((q) => q.subj === "polsci").length,
    eco: SSC_SHORT_QA.filter((q) => q.subj === "eco").length,
  };

  const filtered = filter === "all" ? SSC_SHORT_QA : SSC_SHORT_QA.filter((q) => q.subj === filter);

  const toggleReveal = (id: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGrade = (id: number, grade: "got" | "need") => {
    setGrades((prev) => ({ ...prev, [id]: grade }));
    if (!graded.has(id)) {
      revealQA("ssc", "short", 2);
      setGraded((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      pushToast(
        "✍️",
        grade === "got" ? "Nice! +2 XP — keep it up!" : "Marked for review · +2 XP",
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

  const toggleBm = (qa: SscQA) => {
    const refId = String(qa.id);
    if (isBookmarked("ssc", "qa", refId)) {
      const bm = bookmarks.find((b) => b.track === "ssc" && b.type === "qa" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "ssc",
        type: "qa",
        refId,
        title: qa.q,
        ch: qa.ch,
        subj: qa.subj,
      });
      pushToast("⭐", "Question bookmarked", "success");
    }
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Short Answer Q&amp;A ✍️</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          16 two-mark questions · Reveal model answers · Self-grade to earn XP
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
          >
            {f.label} ({counts[f.key]})
          </Button>
        ))}
      </div>

      <div className="max-h-[72vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {filtered.map((qa) => {
          const meta = getSubjMeta(qa.subj);
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("ssc", "qa", String(qa.id));
          const myGrade = grades[qa.id];
          return (
            <div key={qa.id} className={meta.cls}>
              <Card className="border-subj gap-0 rounded-2xl py-0">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug md:text-base">
                        <span className="mr-1.5 text-muted-foreground">Q{qa.id}.</span>
                        {qa.q}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="border-subj text-subj">
                          {subjIcon(qa.subj)}
                          {meta.label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Ch {qa.ch}
                        </Badge>
                        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                          2m
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
                  >
                    {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {isRevealed ? "Hide Answer" : "Reveal Answer"}
                  </Button>

                  {isRevealed && (
                    <div className="animate-float-up space-y-3">
                      <div className="whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed">
                        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Model Answer
                        </span>
                        {qa.a}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">Self-grade:</span>
                        <Button
                          variant={myGrade === "got" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGrade(qa.id, "got")}
                          className="h-8"
                        >
                          <Check className="size-4" /> Got it
                        </Button>
                        <Button
                          variant={myGrade === "need" ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleGrade(qa.id, "need")}
                          className="h-8"
                        >
                          <X className="size-4" /> Need work
                        </Button>
                        {graded.has(qa.id) && (
                          <span className="text-xs text-emerald-400">+2 XP earned</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
