"use client";

// Instant note capture, available from anywhere in the app — press "N" or
// tap the floating button, jot something down, and it's saved. No
// navigating away from what you're doing. The full list lives in the
// dedicated Notes view (sidebar → Notes), but capturing one never requires
// going there.

import { useEffect, useRef, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { NOTE_COLORS } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { PenLine, X } from "lucide-react";

const COLOR_DOT: Record<string, string> = {
  default: "oklch(0.65 0 0)",
  amber: "oklch(0.75 0.15 80)",
  sky: "oklch(0.7 0.13 230)",
  emerald: "oklch(0.72 0.15 150)",
  rose: "oklch(0.68 0.18 20)",
};

export function QuickNoteFab() {
  const open = useStudyStore((s) => s.quickNoteOpen);
  const setOpen = useStudyStore((s) => s.setQuickNoteOpen);
  const view = useStudyStore((s) => s.view);

  // Hidden on the shop/notes/settings-style utility views where it'd just be clutter,
  // and on the full-bleed museum where nothing else floats on screen either.
  const hidden = view === "museum" || view === "notes";

  if (hidden) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick note"
        title="Quick note (press N)"
        className="glass-interactive fixed z-40 right-4 sm:right-6 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:bottom-6 size-13 sm:size-14 rounded-full bg-primary text-primary-foreground shadow-[0_4px_16px_-2px_rgba(0,0,0,0.35)] flex items-center justify-center overflow-hidden"
      >
        <PenLine className="size-5 sm:size-[22px]" />
      </button>
      {open && <QuickNoteModal onClose={() => setOpen(false)} />}
    </>
  );
}

function QuickNoteModal({ onClose }: { onClose: () => void }) {
  const addNote = useStudyStore((s) => s.addNote);
  const track = useStudyStore((s) => s.track);
  const [text, setText] = useState("");
  const [tagTrack, setTagTrack] = useState<Track | null>(track);
  const [color, setColor] = useState<string>("default");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
     
  }, [text]);

  const save = () => {
    if (!text.trim()) { onClose(); return; }
    addNote(text, tagTrack, color);
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-float-up" onClick={onClose}>
      <div
        className="glass-strong w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5 pb-safe border border-border/60 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PenLine className="size-4" /> Quick note
          </div>
          <button onClick={onClose} className="p-1.5 -m-1 rounded-full hover:bg-accent text-muted-foreground" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Jot it down before you forget…"
          rows={4}
          className="w-full rounded-2xl bg-muted/40 border border-border/60 p-3.5 text-sm resize-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 placeholder:text-muted-foreground/50"
        />

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={c}
                className={`size-6 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-background ring-foreground" : "opacity-60 hover:opacity-100"}`}
                style={{ background: COLOR_DOT[c] }}
              />
            ))}
          </div>
          <select
            value={tagTrack ?? ""}
            onChange={(e) => setTagTrack((e.target.value || null) as Track | null)}
            className="text-xs bg-muted/40 border border-border/60 rounded-lg px-2 py-1.5 outline-none text-muted-foreground"
          >
            <option value="">No subject</option>
            {(Object.keys(SUBJECT_META) as Track[]).map((t) => (
              <option key={t} value={t}>{SUBJECT_META[t].label}</option>
            ))}
          </select>
        </div>

        <Button onClick={save} className="w-full mt-4" size="lg">
          Save note
        </Button>
      </div>
    </div>
  );
}
