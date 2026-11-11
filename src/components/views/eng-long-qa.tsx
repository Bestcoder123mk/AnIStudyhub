"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ENG_LONG_QA, ENG_CHAPTERS } from "@/lib/english-data";
import type { ENGQA, EngBook } from "@/lib/english-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Star, Eye, EyeOff, BookOpen, Notebook, ScrollText, Sparkles, Brain } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";
import { ActiveRecallPanel } from "@/components/shared/active-recall-panel";

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

export function EngLongQaView() {
  const mounted = useMounted();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [awarded, setAwarded] = useState<Set<number>>(new Set());
  const [recallMode, setRecallMode] = useState(true);
  const [recallScored, setRecallScored] = useState<Set<number>>(new Set());

  const revealQA = useStudyStore((s) => s.revealQA);
  const recordRecall = useStudyStore((s) => s.recordRecall);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const counts: Record<FilterKey, number> = {
    all: ENG_LONG_QA.length,
    "First Flight": ENG_LONG_QA.filter((q) => bookOf(q.ch) === "First Flight").length,
    "Footprints": ENG_LONG_QA.filter((q) => bookOf(q.ch) === "Footprints").length,
  };

  const filtered = filter === "all" ? ENG_LONG_QA : ENG_LONG_QA.filter((q) => bookOf(q.ch) === filter);

  const toggleReveal = (qa: ENGQA) => {
    const wasRevealed = revealed.has(qa.id);
    setRevealed((prev) => {
      const next = new Set(prev);
      if (wasRevealed) next.delete(qa.id);
      else next.add(qa.id);
      return next;
    });
    if (!wasRevealed && !awarded.has(qa.id)) {
      revealQA("english", "long", qa.marks);
      setAwarded((prev) => new Set(prev).add(qa.id));
      pushToast("📜", `+${qa.marks} XP earned`, "success");
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

  const handleRecallScore = (qa: ENGQA, scored: number) => {
    recordRecall("english", qa.ch, qa.marks, scored);
    if (!recallScored.has(qa.id)) {
      revealQA("english", "long", qa.marks);
      setRecallScored((prev) => new Set(prev).add(qa.id));
      pushToast("🧠", `Logged ${scored}/${qa.marks} · +${qa.marks} XP`, "success");
    }
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2" style={{ color: ACCENT }}>
          <ScrollText className="size-7" style={{ color: ACCENT }} /> Long Answer Q&amp;A 📜
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {ENG_LONG_QA.length} five-mark essay questions · Detailed model answers · Reveal to earn XP
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
        <label className="ml-auto flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">
          <Brain className="size-3.5" />
          Active Recall
          <Switch checked={recallMode} onCheckedChange={setRecallMode} />
        </label>
      </div>

      <div className="max-h-[72vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {filtered.map((qa) => {
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("english", "qa", String(qa.id));
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
                      <Badge variant="outline" className="border-pink-500/30 bg-pink-500/10 text-pink-400">
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

                {recallMode ? (
                  <ActiveRecallPanel
                    key={qa.id}
                    marksMax={qa.marks}
                    modelAnswer={qa.a}
                    onScore={(scored) => handleRecallScore(qa, scored)}
                  />
                ) : (
                  <>
                    <Button
                      variant={isRevealed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleReveal(qa)}
                      className="h-8"
                      style={!isRevealed ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
                    >
                      {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      {isRevealed ? "Hide Model Answer" : "Reveal Model Answer"}
                    </Button>

                    {isRevealed && (
                      <div className="animate-float-up space-y-2">
                        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed">
                          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Model Essay · {qa.marks} marks
                          </span>
                          <Markdown text={qa.a} />
                        </div>
                        {awarded.has(qa.id) && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <Sparkles className="size-3.5" /> +{qa.marks} XP earned
                          </div>
                        )}
                      </div>
                    )}
                  </>
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
