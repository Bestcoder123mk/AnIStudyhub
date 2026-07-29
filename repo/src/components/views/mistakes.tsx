"use client";

import { useState } from "react";
import { Trash2, Sparkles, X, Check, BookOpen } from "lucide-react";
import { useStudyStore, type Mistake, SUBJECT_META } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSubjMeta,
  diffColor,
  useMounted,
} from "@/components/shared/helpers";

type Filter = "all" | "science" | "ssc" | "maths" | "english" | "sanskrit";

export function MistakesView() {
  const mounted = useMounted();
  const mistakes = useStudyStore((s) => s.mistakes);
  const removeMistake = useStudyStore((s) => s.removeMistake);
  const setView = useStudyStore((s) => s.setView);
  const setPendingTutorContext = useStudyStore((s) => s.setPendingTutorContext);

  const [filter, setFilter] = useState<Filter>("all");

  const filtered = mistakes.filter((m) => {
    if (filter === "all") return true;
    return m.track === filter;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "science", label: "Science" },
    { id: "ssc", label: "SSC" },
    { id: "maths", label: "Maths" },
    { id: "english", label: "English" },
    { id: "sanskrit", label: "Sanskrit" },
  ];

  const askTutor = (m: Mistake) => {
    setPendingTutorContext(
      `I got this question wrong and want to understand it properly:\n\n` +
      `Question: ${m.q}\n` +
      `My answer: ${m.yourAns}\n` +
      `Correct answer: ${m.correctAns}` +
      (m.exp ? `\nExplanation given: ${m.exp}` : "") +
      `\n\nCan you explain this concept clearly so I don't make the same mistake again?`
    );
    setView("tutor");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Mistake Notebook <span className="inline-block">❌</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Learn from your wrong answers — review, retry, and don&apos;t repeat!
        </p>
      </div>

      {/* Count + filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{mounted ? mistakes.length : 0}</span> mistake{mistakes.length === 1 ? "" : "s"} logged
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
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
      </div>

      {/* Empty state */}
      {mounted && filtered.length === 0 && (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold">No mistakes yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              That&apos;s either great or you haven&apos;t started! Go answer some MCQs.
            </p>
            <Button className="mt-5" onClick={() => setView("mcq")}>
              <BookOpen className="size-4" /> Practice MCQs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mistake list */}
      <div className="space-y-3">
        {filtered.map((m) => (
          <MistakeCard
            key={m.id}
            m={m}
            onDelete={() => removeMistake(m.id)}
            onAskTutor={() => askTutor(m)}
          />
        ))}
      </div>

      {!mounted && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

function MistakeCard({
  m,
  onDelete,
  onAskTutor,
}: {
  m: Mistake;
  onDelete: () => void;
  onAskTutor: () => void;
}) {
  const meta = getSubjMeta(m.subj);
  return (
    <Card className="glass overflow-hidden">
      <CardContent className="py-5">
        <div className={meta.cls}>
          {/* Top row: badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="border-subj/40 bg-subj-dim/60 text-subj">
              {meta.emoji} {meta.label}
            </Badge>
            <Badge variant="secondary">Ch {m.ch}</Badge>
            <Badge variant="outline" className={diffColor(m.diff)}>
              {m.diff}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {SUBJECT_META[m.track].label}
            </Badge>
            <span className="ml-auto text-xs text-muted-foreground">
              {new Date(m.date).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Question */}
          <p className="font-medium leading-relaxed mb-3">{m.q}</p>

          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 mb-1">
                <X className="size-3.5" /> Your answer
              </div>
              <div className="text-sm text-rose-200/90">{m.yourAns}</div>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 mb-1">
                <Check className="size-3.5" /> Correct answer
              </div>
              <div className="text-sm text-emerald-200/90">{m.correctAns}</div>
            </div>
          </div>

          {/* Explanation */}
          {m.exp && (
            <div className="rounded-lg bg-muted/40 p-3 mb-3">
              <div className="text-xs font-semibold text-muted-foreground mb-1">💡 Explanation</div>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{m.exp}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onAskTutor}>
              <Sparkles className="size-3.5" /> Ask AI Tutor
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
