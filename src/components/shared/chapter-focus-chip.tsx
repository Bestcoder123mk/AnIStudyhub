"use client";

import { X } from "lucide-react";
import type { Track } from "@/store/use-study-store";
import { chapterLabel, getTrackChapter } from "@/lib/track-content";

/** Shown in a practice screen when it was opened from the learning path for one chapter. */
export function ChapterFocusChip({ track, id, onClear }: { track: Track; id: number; onClear: () => void }) {
  const title = getTrackChapter(track, id)?.title;
  return (
    <button
      onClick={onClear}
      aria-label={`Practicing ${chapterLabel(track, id)}${title ? `, ${title}` : ""}. Clear chapter filter`}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border-2 border-primary bg-primary/15 px-3 py-1 text-xs font-extrabold text-foreground outline-none transition active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span aria-hidden>📍</span>
      <span className="truncate">{chapterLabel(track, id)}{title ? ` · ${title}` : ""}</span>
      <X className="size-3.5 shrink-0" strokeWidth={3} />
    </button>
  );
}
