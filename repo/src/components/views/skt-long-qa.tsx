"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SKT_LONG_QA, SKT_CHAPTERS, type SKTQA } from "@/lib/sanskrit-data";
import { useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bookmark, Eye, CheckCircle2, CircleDot, AlertTriangle } from "lucide-react";

const ACCENT = "#fbbf24";

type Grade = "full" | "partial" | "need";

export function SktLongQaView() {
  const mounted = useMounted();
  const revealQA = useStudyStore((s) => s.revealQA);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [grades, setGrades] = useState<Record<number, Grade>>({});

  const chapterTitle = (ch: number) =>
    SKT_CHAPTERS.find((c) => c.id === ch)?.title ?? `Chapter ${ch}`;

  const toggleReveal = (qa: SKTQA) => {
    if (!revealed[qa.id]) {
      revealQA("sanskrit", "long", qa.marks);
      setRevealed((r) => ({ ...r, [qa.id]: true }));
      pushToast("💡", `Model answer revealed — +${qa.marks} XP`, "success");
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

  const toggleBookmark = (qa: SKTQA) => {
    const refId = `skt-long-${qa.id}`;
    if (isBookmarked("sanskrit", "qa", refId)) {
      removeBookmark(refId);
      pushToast("🔖", "Bookmark removed", "info");
    } else {
      addBookmark({
        track: "sanskrit",
        type: "qa",
        refId,
        title: qa.q.slice(0, 80),
        ch: qa.ch,
        subj: "sanskrit",
        note: `Long answer · ${qa.marks} marks`,
      });
      pushToast("🔖", "Bookmarked", "success");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          Long Answer Questions <span style={{ color: ACCENT }}>📜</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {SKT_LONG_QA.length} five-mark questions · Detailed Sanskrit model answers with English + Hindi summaries · Self-grade to earn XP
        </p>
      </div>

      <div className="space-y-4">
        {SKT_LONG_QA.map((qa) => {
          const isRevealed = !!revealed[qa.id];
          const grade = grades[qa.id];
          const refId = `skt-long-${qa.id}`;
          const bookmarked = mounted && isBookmarked("sanskrit", "qa", refId);
          return (
            <Card
              key={qa.id}
              className="glass p-5 gap-0 rounded-2xl"
              style={{ borderColor: isRevealed ? ACCENT + "40" : undefined }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="gap-1"
                      style={{ borderColor: ACCENT + "60", color: ACCENT, backgroundColor: ACCENT + "10" }}
                    >
                      🕉️ शेमुषी
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Ch {qa.ch} · {chapterTitle(qa.ch)}
                    </Badge>
                    <Badge variant="outline" style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "10", color: ACCENT }}>
                      {qa.marks}m
                    </Badge>
                  </div>
                  <p className="font-semibold text-base sm:text-lg leading-snug" dir="auto" style={{ lineHeight: 1.6 }}>
                    {qa.q}
                  </p>
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
                  <Button onClick={() => toggleReveal(qa)} variant="default" size="sm" style={{ backgroundColor: ACCENT, color: "#000" }}>
                    <Eye /> Reveal Model Answer
                  </Button>
                ) : (
                  <div className="space-y-4 animate-float-up">
                    <div
                      className="rounded-lg border p-4"
                      style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "08" }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: ACCENT }}>
                        Model Answer (Sanskrit + हिंदी + English)
                      </div>
                      <p
                        className="whitespace-pre-wrap text-sm leading-relaxed"
                        dir="auto"
                        style={{ lineHeight: 1.75 }}
                      >
                        {qa.a}
                      </p>
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
                          style={grade === "full" ? { backgroundColor: ACCENT, color: "#000" } : undefined}
                        >
                          <CheckCircle2 /> ✅ Full marks
                        </Button>
                        <Button
                          size="sm"
                          variant={grade === "partial" ? "default" : "outline"}
                          onClick={() => setGrade(qa.id, "partial")}
                          style={grade === "partial" ? { backgroundColor: ACCENT, color: "#000" } : undefined}
                        >
                          <CircleDot /> 🟡 Partial
                        </Button>
                        <Button
                          size="sm"
                          variant={grade === "need" ? "destructive" : "outline"}
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
          );
        })}

        {SKT_LONG_QA.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No questions available.
          </div>
        )}
      </div>
    </div>
  );
}
