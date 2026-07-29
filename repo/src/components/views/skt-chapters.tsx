"use client";

import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { SKT_CHAPTERS, type SKTChapter } from "@/lib/sanskrit-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Check, Lightbulb, ChevronDown, BookOpen, Sparkles } from "lucide-react";

const ACCENT = "#fbbf24";

export function SktChaptersView() {
  const mounted = useMounted();
  const [openId, setOpenId] = useState<number | null>(null);

  const openChapter = useStudyStore((s) => s.openChapter);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const skt = subjectStats["sanskrit"];
  const openedChapters = skt?.openedChapters ?? [];

  const toggleBookmark = (ch: SKTChapter) => {
    const refId = String(ch.id);
    if (isBookmarked("sanskrit", "chapter", refId)) {
      const bm = bookmarks.find((b) => b.track === "sanskrit" && b.type === "chapter" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({ track: "sanskrit", type: "chapter", refId, title: ch.title, ch: ch.id, subj: "sanskrit" });
      pushToast("⭐", `Bookmarked: ${ch.title}`, "success");
    }
  };

  const handleHeaderClick = (ch: SKTChapter) => {
    openChapter("sanskrit", ch.id);
    setOpenId((prev) => (prev === ch.id ? null : ch.id));
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          Shemushi Chapters
          <span style={{ color: ACCENT }}>🕉️</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          12 Shemushi chapters · One-shot themes, key vocabulary, grammar notes &amp; board exam tips
        </p>
      </div>

      <div className="max-h-[74vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {SKT_CHAPTERS.map((ch) => {
          const isOpened = mounted && openedChapters.includes(ch.id);
          const isExpanded = openId === ch.id;
          const isBm = mounted && isBookmarked("sanskrit", "chapter", String(ch.id));
          return (
            <Card
              key={ch.id}
              className="rounded-2xl py-0 transition-all"
              style={{ borderColor: isExpanded ? ACCENT + "60" : undefined }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleHeaderClick(ch)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleHeaderClick(ch);
                  }
                }}
                className="flex cursor-pointer items-start gap-3 p-4 outline-none transition-colors hover:bg-amber-500/5 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ backgroundColor: ACCENT + "20", color: ACCENT }}
                  >
                    {ch.num.replace("Ch ", "")}
                  </span>
                  {isOpened && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
                      <Check className="size-3" /> opened
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="text-base sm:text-lg font-semibold leading-snug"
                    dir="auto"
                    style={{ lineHeight: 1.5 }}
                  >
                    {ch.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="gap-1"
                      style={{ borderColor: ACCENT + "60", color: ACCENT }}
                    >
                      <BookOpen className="size-3" /> शेमुषी
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {ch.oneshot.length} oneshot · {ch.keypts.length} key pts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={isBm ? "Remove bookmark" : "Add bookmark"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(ch);
                    }}
                  >
                    <Star className={isBm ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
                  </Button>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              {isExpanded && (
                <CardContent className="animate-float-up border-t border-border px-4 pb-4 pt-3">
                  <Tabs defaultValue="oneshot">
                    <TabsList className="h-9 w-full justify-start overflow-x-auto">
                      <TabsTrigger value="oneshot">Summary</TabsTrigger>
                      <TabsTrigger value="keypts">Key Points</TabsTrigger>
                      <TabsTrigger value="grammar">Grammar Notes</TabsTrigger>
                      <TabsTrigger value="exam">Exam Tips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="oneshot" className="mt-3">
                      <ul className="space-y-2">
                        {ch.oneshot.map((o, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                            <span dir="auto">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="keypts" className="mt-3">
                      <ul className="space-y-2">
                        {ch.keypts.map((k, i) => (
                          <li
                            key={i}
                            className="rounded-lg border border-border bg-muted/30 p-3 text-sm"
                            dir="auto"
                          >
                            {k}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="grammar" className="mt-3">
                      <div className="rounded-lg border p-4" style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "08" }}>
                        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>
                          <Sparkles className="size-3" /> Key Grammar — सन्धि / शब्दरूप / धातुरूप / समास
                        </div>
                        <pre
                          dir="auto"
                          className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90"
                          style={{ fontFamily: "'Noto Sans Devanagari', 'Cascadia Mono', ui-monospace, monospace" }}
                        >
                          {ch.formulas}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="exam" className="mt-3">
                      <ul className="space-y-2">
                        {ch.exam.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="mt-0.5 size-4 shrink-0" style={{ color: ACCENT }} />
                            <span dir="auto">{e}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
