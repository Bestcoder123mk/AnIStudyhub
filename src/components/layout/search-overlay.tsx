"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { CHAPTERS, MCQS, SHORT_QA, LONG_QA, SSC_CHAPTERS, SSC_MCQS, SSC_SHORT_QA, SSC_LONG_QA } from "@/lib/study-data";
import { Search, X, BookOpen, CircleDot, PenLine, Scroll } from "lucide-react";

interface SResult {
  type: "chapter" | "mcq" | "short" | "long";
  track: "science" | "ssc";
  title: string;
  sub: string;
  view: string;
}

export function SearchOverlay() {
  const open = useStudyStore((s) => s.searchOpen);
  const setOpen = useStudyStore((s) => s.setSearch);
  const setView = useStudyStore((s) => s.setView);
  const setTrack = useStudyStore((s) => s.setTrack);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) { setQ(""); return; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const results = useMemo<SResult[]>(() => {
    if (!q.trim() || q.length < 2) return [];
    const ql = q.toLowerCase();
    const out: SResult[] = [];
    const lim = 4;
    let c = 0;
    for (const ch of CHAPTERS) {
      if (c >= lim) break;
      if (ch.title.toLowerCase().includes(ql) || ch.keypts.some((k) => k.toLowerCase().includes(ql))) {
        out.push({ type: "chapter", track: "science", title: ch.title, sub: `${ch.num} · ${ch.subj}`, view: "chapters" });
        c++;
      }
    }
    c = 0;
    for (const ch of SSC_CHAPTERS) {
      if (c >= lim) break;
      if (ch.title.toLowerCase().includes(ql) || ch.keypts.some((k) => k.toLowerCase().includes(ql))) {
        out.push({ type: "chapter", track: "ssc", title: ch.title, sub: `${ch.num} · ${ch.subj}`, view: "ssc-chapters" });
        c++;
      }
    }
    c = 0;
    for (const m of MCQS) {
      if (c >= lim) break;
      if (m.q.toLowerCase().includes(ql)) {
        out.push({ type: "mcq", track: "science", title: m.q.slice(0, 70), sub: `MCQ · Ch ${m.ch} · ${m.subj}`, view: "mcq" });
        c++;
      }
    }
    c = 0;
    for (const m of SSC_MCQS) {
      if (c >= lim) break;
      if (m.q.toLowerCase().includes(ql)) {
        out.push({ type: "mcq", track: "ssc", title: m.q.slice(0, 70), sub: `MCQ · Ch ${m.ch} · ${m.subj}`, view: "ssc-mcq" });
        c++;
      }
    }
    c = 0;
    for (const s of SHORT_QA) {
      if (c >= lim) break;
      if (s.q.toLowerCase().includes(ql)) {
        out.push({ type: "short", track: "science", title: s.q.slice(0, 70), sub: `Short · Ch ${s.ch}`, view: "short" });
        c++;
      }
    }
    c = 0;
    for (const s of SSC_SHORT_QA) {
      if (c >= lim) break;
      if (s.q.toLowerCase().includes(ql)) {
        out.push({ type: "short", track: "ssc", title: s.q.slice(0, 70), sub: `Short · Ch ${s.ch}`, view: "ssc-short" });
        c++;
      }
    }
    c = 0;
    for (const l of LONG_QA) {
      if (c >= lim) break;
      if (l.q.toLowerCase().includes(ql)) {
        out.push({ type: "long", track: "science", title: l.q.slice(0, 70), sub: `Long · Ch ${l.ch}`, view: "long" });
        c++;
      }
    }
    c = 0;
    for (const l of SSC_LONG_QA) {
      if (c >= lim) break;
      if (l.q.toLowerCase().includes(ql)) {
        out.push({ type: "long", track: "ssc", title: l.q.slice(0, 70), sub: `Long · Ch ${l.ch}`, view: "ssc-long" });
        c++;
      }
    }
    return out.slice(0, 24);
  }, [q]);

  if (!open) return null;

  const icon = (t: SResult["type"]) => t === "chapter" ? <BookOpen className="size-4" /> : t === "mcq" ? <CircleDot className="size-4" /> : t === "short" ? <PenLine className="size-4" /> : <Scroll className="size-4" />;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl glass-strong rounded-2xl shadow-2xl overflow-hidden animate-float-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="size-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search chapters, MCQs, Q&A…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto scroll-thin">
          {q.length < 2 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Type 2+ characters to search across all chapters, MCQs, and Q&amp;A.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No matches for &ldquo;{q}&rdquo;.</div>
          ) : (
            results.map((r, i) => (
              <button
                key={i}
                onClick={() => { setTrack(r.track); setView(r.view as never); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition text-left border-b border-border/40 last:border-0"
              >
                <span className={`shrink-0 ${r.track === "ssc" ? "text-amber-400" : "text-primary"}`}>{icon(r.type)}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{r.title}</span>
                  <span className="block text-[11px] text-muted-foreground capitalize">{r.sub}</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {r.track}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
