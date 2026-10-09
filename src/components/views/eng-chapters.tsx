"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ENG_CHAPTERS, type ENGChapter, type EngBook } from "@/lib/english-data";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Check, Lightbulb, ChevronDown, BookOpen, Notebook } from "lucide-react";

const ACCENT = SUBJECT_META.english.accent;

type FilterKey = "all" | EngBook;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "First Flight", label: "📚 First Flight" },
  { key: "Footprints", label: "📓 Footprints" },
];

export function EngChaptersView() {
  const mounted = useMounted();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<number | null>(null);

  const openChapter = useStudyStore((s) => s.openChapter);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const openedChapters = subjectStats["english"]?.openedChapters || [];

  const counts: Record<FilterKey, number> = {
    all: ENG_CHAPTERS.length,
    "First Flight": ENG_CHAPTERS.filter((c) => c.book === "First Flight").length,
    "Footprints": ENG_CHAPTERS.filter((c) => c.book === "Footprints").length,
  };

  const filtered = filter === "all" ? ENG_CHAPTERS : ENG_CHAPTERS.filter((c) => c.book === filter);

  const toggleBookmark = (ch: ENGChapter) => {
    const refId = String(ch.id);
    if (isBookmarked("english", "chapter", refId)) {
      const bm = bookmarks.find((b) => b.track === "english" && b.type === "chapter" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({ track: "english", type: "chapter", refId, title: ch.title, ch: ch.id, subj: "english" });
      pushToast("⭐", `Bookmarked: ${ch.title}`, "success");
    }
  };

  const handleHeaderClick = (ch: ENGChapter) => {
    openChapter("english", ch.id);
    setOpenId((prev) => (prev === ch.id ? null : ch.id));
  };

  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ACCENT }}>
          English Chapters 📚
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          First Flight (prose + poetry) &amp; Footprints Without Feet — One-Shot summaries, themes &amp; exam tips
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
            style={filter === f.key ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
          >
            {f.label} ({counts[f.key]})
          </Button>
        ))}
      </div>

      <div className="max-h-[72vh] space-y-3 overflow-y-auto scroll-thin pr-1">
        {filtered.map((ch) => {
          const isOpened = mounted && openedChapters.includes(ch.id);
          const isExpanded = openId === ch.id;
          const isBm = mounted && isBookmarked("english", "chapter", String(ch.id));
          const isFF = ch.book === "First Flight";
          return (
            <Card className="gap-0 rounded-2xl py-0" style={{ borderColor: `${ACCENT}40` }} key={ch.id}>
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
                className="flex cursor-pointer items-start gap-3 p-4 outline-none transition-colors hover:bg-pink-500/5 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}
                  >
                    {ch.num}
                  </span>
                  {isOpened && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
                      <Check className="size-3" /> opened
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-snug md:text-base">{ch.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" style={{ borderColor: `${ACCENT}66`, color: ACCENT }}>
                      {isFF ? <BookOpen className="size-3.5" /> : <Notebook className="size-3.5" />}
                      {ch.book}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">by {ch.author}</span>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">
                      {ch.oneshot.length} oneshot · {ch.keypts.length} pts · {ch.exam.length} tips
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
                      <TabsTrigger value="oneshot">One-Shot</TabsTrigger>
                      <TabsTrigger value="keypts">Themes &amp; Points</TabsTrigger>
                      <TabsTrigger value="exam">Exam Tips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="oneshot" className="mt-3">
                      <ul className="space-y-2">
                        {ch.oneshot.map((o, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                            <span>{o}</span>
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
                            style={{ borderLeftColor: ACCENT, borderLeftWidth: 3 }}
                          >
                            {k}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="exam" className="mt-3">
                      <ul className="space-y-2">
                        {ch.exam.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-400" />
                            <span>{e}</span>
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

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No chapters in this filter.
          </div>
        )}
      </div>
    </div>
  );
}
