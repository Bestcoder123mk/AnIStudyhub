"use client";

import { useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, NOTE_COLORS, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, Trash2, PenLine, Search, StickyNote } from "lucide-react";

const COLOR_BG: Record<string, string> = {
  default: "bg-muted/50 border-border/60",
  amber: "bg-amber-400/10 border-amber-400/30",
  sky: "bg-sky-400/10 border-sky-400/30",
  emerald: "bg-emerald-400/10 border-emerald-400/30",
  rose: "bg-rose-400/10 border-rose-400/30",
};
const COLOR_DOT: Record<string, string> = {
  default: "oklch(0.65 0 0)", amber: "oklch(0.75 0.15 80)", sky: "oklch(0.7 0.13 230)",
  emerald: "oklch(0.72 0.15 150)", rose: "oklch(0.68 0.18 20)",
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function NotesView() {
  const mounted = useMounted();
  const notes = useStudyStore((s) => s.notes);
  const deleteNote = useStudyStore((s) => s.deleteNote);
  const toggleNotePin = useStudyStore((s) => s.toggleNotePin);
  const setNoteColor = useStudyStore((s) => s.setNoteColor);
  const updateNote = useStudyStore((s) => s.updateNote);
  const setQuickNoteOpen = useStudyStore((s) => s.setQuickNoteOpen);

  const [query, setQuery] = useState("");
  const [filterTrack, setFilterTrack] = useState<Track | "all" | "none">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const filtered = useMemo(() => {
    let list = notes;
    if (filterTrack === "none") list = list.filter((n) => !n.track);
    else if (filterTrack !== "all") list = list.filter((n) => n.track === filterTrack);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => n.text.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => (Number(b.pinned) - Number(a.pinned)) || b.updatedAt - a.updatedAt);
  }, [notes, filterTrack, query]);

  const startEdit = (id: string, text: string) => { setEditingId(id); setDraft(text); };
  const saveEdit = () => { if (editingId) updateNote(editingId, draft); setEditingId(null); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 flex items-center gap-2">
            <StickyNote className="size-6" /> Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            {mounted ? notes.length : 0} saved · press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">N</kbd> anywhere to add one
          </p>
        </div>
        <Button onClick={() => setQuickNoteOpen(true)} className="gap-1.5">
          <PenLine className="size-4" /> New note
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes…" className="pl-9 h-9" />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-thin pb-1">
          <FilterChip active={filterTrack === "all"} onClick={() => setFilterTrack("all")}>All</FilterChip>
          {(Object.keys(SUBJECT_META) as Track[]).map((t) => (
            <FilterChip key={t} active={filterTrack === t} onClick={() => setFilterTrack(t)}>
              {SUBJECT_META[t].icon} {SUBJECT_META[t].short}
            </FilterChip>
          ))}
        </div>
      </div>

      {mounted && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl">
          <StickyNote className="size-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {notes.length === 0 ? "No notes yet — capture your first thought." : "No notes match that search."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mounted && filtered.map((n) => {
          const meta = n.track ? SUBJECT_META[n.track] : null;
          const editing = editingId === n.id;
          return (
            <div key={n.id} className={`tap-lift rounded-2xl border p-4 flex flex-col gap-2.5 ${COLOR_BG[n.color] || COLOR_BG.default}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {meta && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-background/60 truncate">
                      {meta.icon} {meta.short}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground/60">{timeAgo(n.updatedAt)}</span>
                </div>
                <button onClick={() => toggleNotePin(n.id)} aria-label="Pin" className={`p-1 rounded-full hover:bg-background/60 ${n.pinned ? "text-foreground" : "text-muted-foreground/40"}`}>
                  <Pin className="size-3.5" fill={n.pinned ? "currentColor" : "none"} />
                </button>
              </div>

              {editing ? (
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                  rows={4}
                  className="w-full bg-background/60 rounded-lg p-2 text-sm resize-none outline-none border border-border/60"
                />
              ) : (
                <p onClick={() => startEdit(n.id, n.text)} className="text-sm whitespace-pre-wrap leading-relaxed cursor-text line-clamp-6">
                  {n.text}
                </p>
              )}

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNoteColor(n.id, c)}
                      aria-label={c}
                      className={`size-3.5 rounded-full transition ${n.color === c ? "ring-2 ring-offset-1 ring-offset-background ring-foreground/60" : "opacity-50 hover:opacity-90"}`}
                      style={{ background: COLOR_DOT[c] }}
                    />
                  ))}
                </div>
                <button onClick={() => deleteNote(n.id)} aria-label="Delete note" className="p-1 rounded-full hover:bg-background/60 text-muted-foreground/50 hover:text-rose-500 transition">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition whitespace-nowrap ${
        active ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
