"use client";

import { useState } from "react";
import { Trash2, ArrowRight, BookmarkX } from "lucide-react";
import { useStudyStore, type Bookmark, type ViewId } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";

type Filter = "all" | "chapter" | "mcq" | "qa" | "formula";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "chapter", label: "Chapters" },
  { id: "mcq", label: "MCQs" },
  { id: "qa", label: "Q&A" },
  { id: "formula", label: "Formulas" },
];

const TYPE_META: Record<Bookmark["type"], { label: string; emoji: string }> = {
  chapter: { label: "Chapter", emoji: "📖" },
  mcq: { label: "MCQ", emoji: "❓" },
  qa: { label: "Q&A", emoji: "✍️" },
  formula: { label: "Formula", emoji: "🧮" },
};

function targetView(b: Bookmark): ViewId {
  const ssc = b.track === "ssc";
  switch (b.type) {
    case "chapter":
      return ssc ? "ssc-chapters" : "chapters";
    case "mcq":
      return ssc ? "ssc-mcq" : "mcq";
    case "qa":
      return ssc ? "ssc-short" : "short";
    case "formula":
      return ssc ? "ssc-formulas" : "formulas";
  }
}

export function BookmarksView() {
  const mounted = useMounted();
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const setView = useStudyStore((s) => s.setView);

  const [filter, setFilter] = useState<Filter>("all");

  const filtered = bookmarks.filter((b) => filter === "all" || b.type === filter);

  // Group by type for display
  const groups: { type: Bookmark["type"]; items: Bookmark[] }[] = (
    ["chapter", "mcq", "qa", "formula"] as Bookmark["type"][]
  )
    .map((type) => ({
      type,
      items: filtered.filter((b) => b.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Bookmarks <span className="inline-block">⭐</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Your saved chapters, questions, and formulas.
        </p>
      </div>

      {/* Count + filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{mounted ? bookmarks.length : 0}</span> bookmark{bookmarks.length === 1 ? "" : "s"} saved
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Empty state */}
      {mounted && filtered.length === 0 && (
        <Card className="glass">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold">No bookmarks yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Tap the star icon on any chapter, question, or formula to save it here for quick revision.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grouped lists */}
      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.type}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{TYPE_META[g.type].emoji}</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {TYPE_META[g.type].label}s
              </h2>
              <span className="text-xs text-muted-foreground">({g.items.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {g.items.map((b) => (
                <BookmarkCard
                  key={b.id}
                  b={b}
                  onJump={() => setView(targetView(b))}
                  onDelete={() => removeBookmark(b.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {!mounted && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarkCard({
  b,
  onJump,
  onDelete,
}: {
  b: Bookmark;
  onJump: () => void;
  onDelete: () => void;
}) {
  const meta = getSubjMeta(b.subj);
  return (
    <Card className="glass">
      <CardContent className="py-4">
        <div className={meta.cls}>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <Badge variant="outline" className="border-subj/40 bg-subj-dim/60 text-subj">
                  {meta.emoji} {meta.label}
                </Badge>
                <Badge variant="secondary">{TYPE_META[b.type].label}</Badge>
                {b.ch > 0 && <Badge variant="outline">Ch {b.ch}</Badge>}
                <Badge variant="outline" className="capitalize">
                  {b.track === "ssc" ? "SSC" : "Science"}
                </Badge>
              </div>
              {/* Title */}
              <h3 className="font-medium leading-snug line-clamp-2">{b.title}</h3>
              {b.note && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{b.note}</p>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                {new Date(b.date).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="default" onClick={onJump}>
              Jump to <ArrowRight className="size-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
              aria-label="Remove bookmark"
            >
              <BookmarkX className="size-3.5" /> Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
