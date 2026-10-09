"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { SKT_SHORT_QA, type SKTQA } from "@/lib/sanskrit-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Star, Eye, EyeOff, Sparkles, Brain } from "lucide-react";
import { Markdown } from "@/components/shared/markdown";
import { ActiveRecallPanel } from "@/components/shared/active-recall-panel";

const ACCENT = SUBJECT_META.sanskrit.accent; // single source of truth — was a duplicated hex literal

export function SktShortQaView() {
  const mounted = useMounted();
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

  const toggleReveal = (qa: SKTQA) => {
    const wasRevealed = revealed.has(qa.id);
    setRevealed((prev) => {
      const next = new Set(prev);
      if (wasRevealed) next.delete(qa.id);
      else next.add(qa.id);
      return next;
    });
    if (!wasRevealed && !awarded.has(qa.id)) {
      revealQA("sanskrit", "short", qa.marks);
      setAwarded((prev) => new Set(prev).add(qa.id));
      pushToast("✍️", `+${qa.marks} XP earned`, "success");
    }
  };

  const handleRecallScore = (qa: SKTQA, scored: number) => {
    recordRecall("sanskrit", qa.ch, qa.marks, scored);
    if (!recallScored.has(qa.id)) {
      revealQA("sanskrit", "short", qa.marks);
      setRecallScored((prev) => new Set(prev).add(qa.id));
      pushToast("🧠", `Logged ${scored}/${qa.marks} · +${qa.marks} XP`, "success");
    }
  };

  const toggleBm = (qa: SKTQA) => {
    const refId = String(qa.id);
    if (isBookmarked("sanskrit", "qa", refId)) {
      const bm = bookmarks.find((b) => b.track === "sanskrit" && b.type === "qa" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "sanskrit",
        type: "qa",
        refId,
        title: qa.q,
        ch: qa.ch,
        subj: "sanskrit",
      });
      pushToast("⭐", "Question bookmarked", "success");
    }
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          Short Answer Q&amp;A <span style={{ color: ACCENT }}>✍️</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {SKT_SHORT_QA.length} short-answer questions (2-3 marks) — अनूद्यताम् (translate), सन्धिविग्रहः (sandhi split), theme, grammar
        </p>
      </div>

      <div className="flex justify-end">
        <label className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">
          <Brain className="size-3.5" />
          Active Recall
          <Switch checked={recallMode} onCheckedChange={setRecallMode} />
        </label>
      </div>

      <div className="max-h-[74vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {SKT_SHORT_QA.map((qa) => {
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("sanskrit", "qa", String(qa.id));
          return (
            <Card
              key={qa.id}
              className="rounded-2xl py-0"
              style={{ borderColor: isRevealed ? ACCENT + "40" : undefined }}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold leading-snug md:text-base"
                      dir="auto"
                      style={{ lineHeight: 1.6 }}
                    >
                      <span className="mr-1.5 text-muted-foreground">Q{qa.id}.</span>
                      {qa.q}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="gap-1"
                        style={{ borderColor: ACCENT + "60", color: ACCENT }}
                      >
                        🕉️ शेमुषी
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Ch {qa.ch}
                      </Badge>
                      <Badge variant="outline" style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "10", color: ACCENT }}>
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
                      style={isRevealed ? undefined : { backgroundColor: ACCENT, color: "#000" }}
                    >
                      {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      {isRevealed ? "Hide Answer" : "Reveal Answer"}
                    </Button>

                    {isRevealed && (
                      <div className="animate-float-up space-y-2">
                        <div
                          className="rounded-lg border p-3 text-sm leading-relaxed"
                          dir="auto"
                          style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "08", lineHeight: 1.7 }}
                        >
                          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
                            Model Answer
                          </span>
                          <Markdown text={qa.a} accent={ACCENT} />
                        </div>
                        {awarded.has(qa.id) && (
                          <div className="flex items-center gap-1.5 text-xs" style={{ color: ACCENT }}>
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

        {SKT_SHORT_QA.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No questions available.
          </div>
        )}
      </div>
    </div>
  );
}
