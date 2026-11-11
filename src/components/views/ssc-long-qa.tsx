"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SSC_LONG_QA, SSC_CHAPTERS } from "@/lib/study-data";
import type { SscQA, SscSubject } from "@/lib/study-data";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bookmark, Eye, Sparkles, Brain } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";
import { ActiveRecallPanel } from "@/components/shared/active-recall-panel";

type Filter = "all" | SscSubject;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hist", label: "🏛️ History" },
  { id: "geo", label: "🌍 Geography" },
  { id: "polsci", label: "⚖️ Pol. Science" },
  { id: "eco", label: "💰 Economics" },
];

export function SscLongQaView() {
  const mounted = useMounted();
  const revealQA = useStudyStore((s) => s.revealQA);
  const recordRecall = useStudyStore((s) => s.recordRecall);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [filter, setFilter] = useState<Filter>("all");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [recallMode, setRecallMode] = useState(true);
  const [recallScored, setRecallScored] = useState<Set<number>>(new Set());

  const chapterTitle = (ch: number) =>
    SSC_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  const items = SSC_LONG_QA.filter((q) => filter === "all" || q.subj === filter);

  const toggleReveal = (qa: SscQA) => {
    if (!revealed[qa.id]) {
      revealQA("ssc", "long", qa.marks);
      setRevealed((r) => ({ ...r, [qa.id]: true }));
      pushToast("💡", `Model answer revealed — +${qa.marks} XP`, "success");
    } else {
      setRevealed((r) => ({ ...r, [qa.id]: false }));
    }
  };

  const handleRecallScore = (qa: SscQA, scored: number) => {
    recordRecall("ssc", qa.ch, qa.marks, scored);
    if (!recallScored.has(qa.id)) {
      revealQA("ssc", "long", qa.marks);
      setRecallScored((prev) => new Set(prev).add(qa.id));
      pushToast("🧠", `Logged ${scored}/${qa.marks} · +${qa.marks} XP`, "success");
    }
  };

  const toggleBookmark = (qa: SscQA) => {
    const refId = `ssc-long-${qa.id}`;
    if (isBookmarked("ssc", "qa", refId)) {
      removeBookmark(refId);
      pushToast("🔖", "Bookmark removed", "info");
    } else {
      addBookmark({
        track: "ssc",
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
          {SSC_LONG_QA.length} board-pattern questions (4–5 marks) · Detailed model answers, case-based included
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
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
        <label className="ml-auto flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">
          <Brain className="size-3.5" />
          Active Recall
          <Switch checked={recallMode} onCheckedChange={setRecallMode} />
        </label>
      </div>

      {/* Q&A list */}
      <div className="space-y-4">
        {items.map((qa) => {
          const meta = getSubjMeta(qa.subj);
          const isRevealed = !!revealed[qa.id];
          const refId = `ssc-long-${qa.id}`;
          const bookmarked = mounted && isBookmarked("ssc", "qa", refId);
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
                        {qa.marks}m
                      </Badge>
                      {qa.pyq && (
                        <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-400">
                          Board pattern
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-lg leading-snug whitespace-pre-wrap">{qa.q}</p>
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
                  {recallMode ? (
                    <ActiveRecallPanel
                      key={qa.id}
                      marksMax={qa.marks}
                      modelAnswer={qa.a}
                      onScore={(scored) => handleRecallScore(qa, scored)}
                    />
                  ) : !isRevealed ? (
                    <Button onClick={() => toggleReveal(qa)} variant="default" size="sm">
                      <Eye /> Reveal Model Answer
                    </Button>
                  ) : (
                    <div className="space-y-3 animate-float-up">
                      <div className="rounded-lg border border-border bg-muted/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Model Answer
                        </div>
                        <Markdown text={qa.a} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <Sparkles className="size-3.5" /> +{qa.marks} XP earned
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => toggleReveal(qa)}>
                          Hide answer
                        </Button>
                      </div>
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
