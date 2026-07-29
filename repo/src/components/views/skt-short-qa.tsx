"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SKT_SHORT_QA, type SKTQA } from "@/lib/sanskrit-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Eye, EyeOff } from "lucide-react";

const ACCENT = "#fbbf24";

export function SktShortQaView() {
  const mounted = useMounted();
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [graded, setGraded] = useState<Set<number>>(new Set());
  const [grades, setGrades] = useState<Record<number, "got" | "need">>({});

  const revealQA = useStudyStore((s) => s.revealQA);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

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
    const marks = SKT_SHORT_QA.find((q) => q.id === id)?.marks ?? 2;
    if (!graded.has(id)) {
      revealQA("sanskrit", "short", marks);
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

      <div className="max-h-[74vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {SKT_SHORT_QA.map((qa) => {
          const isRevealed = revealed.has(qa.id);
          const isBm = mounted && isBookmarked("sanskrit", "qa", String(qa.id));
          const myGrade = grades[qa.id];
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

                <Button
                  variant={isRevealed ? "secondary" : "default"}
                  size="sm"
                  onClick={() => toggleReveal(qa.id)}
                  className="h-8"
                  style={isRevealed ? undefined : { backgroundColor: ACCENT, color: "#000" }}
                >
                  {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {isRevealed ? "Hide Answer" : "Reveal Answer"}
                </Button>

                {isRevealed && (
                  <div className="animate-float-up space-y-3">
                    <div
                      className="whitespace-pre-wrap rounded-lg border p-3 text-sm leading-relaxed"
                      dir="auto"
                      style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "08", lineHeight: 1.7 }}
                    >
                      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
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
                        style={myGrade === "got" ? { backgroundColor: ACCENT, color: "#000" } : undefined}
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
                        <span className="text-xs" style={{ color: ACCENT }}>+{qa.marks} XP earned</span>
                      )}
                    </div>
                  </div>
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
