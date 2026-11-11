"use client";

/**
 * The learning path — Duolingo's signature screen, rebuilt on this app's own mastery engine.
 *
 * Design notes (from the research pass):
 *  - One winding path with a clearly marked "next" node reduces choice overload, but Duolingo's
 *    forced single route drew real backlash ("learning isn't linear"). So the path RECOMMENDS and
 *    never locks: every node is tappable.
 *  - Gold = done. Duolingo's own convention, and it surfaces *competence* (mastery %), which the
 *    gamification meta-analyses found points/badges alone barely move.
 *  - A node that was practiced but is still weak/developing is flagged "needs review" — spaced
 *    retrieval beats massed practice (g≈0.74), and a plain schedule is as good as an expanding one.
 *  - Tapping a node opens a Liquid Glass sheet (it floats over the path = functional layer) with the
 *    two things you can do: Learn (notes) or Practice (a lesson filtered to that chapter).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, Play, RotateCcw } from "lucide-react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { getTrackChapters } from "@/lib/track-content";
import { getConcept } from "@/lib/concepts";
import { computeChapterMastery, trackQuestionCountByChapter, MASTERY_TIER_META } from "@/lib/mastery-engine";
import { readableTextColor, useMounted } from "@/components/shared/helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MIN_W = 300; // the path canvas adapts to its card; it winds wider on desktop
const MAX_W = 640;
const STEP = 118; // vertical distance between nodes
const TOP = 88;
const R = 34; // node radius
const RING = 39; // progress ring radius
const EMPTY: number[] = [];

type NodeState = "done" | "next" | "doing" | "new";

/** Everything about a track's path that more than one screen needs (the path itself and the dashboard hero). */
export function useTrackPath(track: Track) {
  const mounted = useMounted();
  const chapterStats = useStudyStore((s) => s.chapterStats[track]);
  const opened = useStudyStore((s) =>
    track === "ssc" ? s.ssc.openedChapters : track === "science" ? s.openedChapters : (s.subjectStats[track]?.openedChapters ?? EMPTY)
  );
  const chapters = useMemo(() => getTrackChapters(track), [track]);
  const rows = useMemo(() => {
    const m = computeChapterMastery(chapters, mounted ? (chapterStats ?? {}) : {}, trackQuestionCountByChapter(track));
    return m.map((r) => {
      const done = r.tier === "mastered" || r.tier === "exam-ready";
      const started = r.attempted > 0 || (mounted && opened.includes(r.chapterId));
      const review = !done && r.attempted >= 3 && (r.tier === "weak" || r.tier === "developing");
      return { ...r, done, started, review };
    });
  }, [chapters, chapterStats, opened, track, mounted]);
  const nextIdx = rows.findIndex((r) => !r.done);
  const doneCount = rows.filter((r) => r.done).length;
  return { rows, nextIdx, doneCount, target: rows[nextIdx >= 0 ? nextIdx : 0] };
}

export function LearningPath({ track }: { track: Track }) {
  const meta = SUBJECT_META[track];
  const accent = meta.accent;
  const { rows, nextIdx, doneCount } = useTrackPath(track);
  const openChapter = useStudyStore((s) => s.openChapter);
  const setConceptOpen = useStudyStore((s) => s.setConceptOpen);
  const setFocusChapter = useStudyStore((s) => s.setFocusChapter);
  const setView = useStudyStore((s) => s.setView);

  const [sel, setSel] = useState<number | null>(null);
  const [W, setW] = useState(320);
  const [showAll, setShowAll] = useState(false);
  const [earlier, setEarlier] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(Math.max(MIN_W, Math.min(MAX_W, e.contentRect.width)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const states: NodeState[] = rows.map((r, i) => (r.done ? "done" : i === nextIdx ? "next" : r.started ? "doing" : "new"));

  const AMP = Math.min(150, (W / 2 - R - 30) * 0.85);
  // The path shows a window around where you are (2 behind, 5 ahead) — no nested scroll box, which on a
  // phone steals your swipe from the page. "Show earlier" / "Show all" grow it inline instead.
  const focus = nextIdx >= 0 ? nextIdx : 0;
  const lo = showAll ? 0 : earlier ? 0 : Math.max(0, focus - 2);
  const hi = showAll ? rows.length : Math.min(rows.length, focus + 6);
  const visible = rows.map((_, i) => i).filter((i) => i >= lo && i < hi);
  const pos = useMemo(() => rows.map((_, i) => ({ x: W / 2 + Math.sin((i * Math.PI) / 4) * AMP, y: TOP + (i - lo) * STEP })), [rows, W, AMP, lo]);
  const H = TOP + Math.max(0, visible.length - 1) * STEP + 130;
  const trail = visible
    .map((i, k) => (k === 0 ? `M ${pos[i].x} ${pos[i].y}` : `C ${pos[i - 1].x} ${pos[i - 1].y + STEP / 2}, ${pos[i].x} ${pos[i].y - STEP / 2}, ${pos[i].x} ${pos[i].y}`))
    .join(" ");
  const hiddenBefore = lo;
  const hiddenAfter = rows.length - hi;

  useEffect(() => {
    if (sel === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const practice = (id: number) => { setFocusChapter({ track, id }); setView(meta.mcq); };
  const learn = (id: number) => {
    if (getConcept(track, id)) { setConceptOpen({ track, id }); return; } // a teacher-style lesson exists — start there
    openChapter(track, id); setFocusChapter({ track, id }); setView(meta.chapters); };
  const target = rows[nextIdx >= 0 ? nextIdx : 0];
  const pct = rows.length ? Math.round((doneCount / rows.length) * 100) : 0;
  const ledgeOf = (c: string) => `color-mix(in oklch, ${c} 62%, black)`;

  const face = (s: NodeState) =>
    s === "done" ? { f: "var(--gold)", l: "var(--gold-ledge)", fg: "oklch(0.25 0.06 85)" }
    : s === "new" ? { f: "color-mix(in oklch, var(--edge) 55%, var(--card))", l: "var(--edge)", fg: "var(--muted-foreground)" }
    : { f: accent, l: ledgeOf(accent), fg: readableTextColor(accent) };

  if (rows.length === 0) return null;
  const selRow = sel !== null ? rows[sel] : null;

  return (
    <Card className="glass gap-0 overflow-hidden py-0" style={{ "--sc": accent } as React.CSSProperties}>
      <div className="flex items-center justify-between gap-3 p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-extrabold leading-tight">Your path</h2>
          <p className="text-xs font-bold text-muted-foreground">
            {doneCount} of {rows.length} chapters exam-ready
          </p>
        </div>
        <Button size="sm" onClick={() => practice(target.chapterId)} aria-label={`Continue with chapter ${target.chapterId}`}>
          {nextIdx >= 0 ? <Play className="size-3.5" fill="currentColor" /> : <RotateCcw className="size-3.5" />}
          {nextIdx >= 0 ? "Continue" : "Review"}
        </Button>
      </div>
      <div className="meter-track mx-4 mb-3 sm:mx-5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Path progress">
        <div className="meter-fill" style={{ width: `${Math.max(pct, 3)}%` }} />
      </div>

      {hiddenBefore > 0 && (
        <button onClick={() => setEarlier(true)} className="w-full border-t-2 border-[var(--edge)] py-2.5 text-xs font-extrabold text-muted-foreground outline-none transition hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
          ↑ Show {hiddenBefore} earlier {hiddenBefore === 1 ? "chapter" : "chapters"}
        </button>
      )}
      <div ref={scroller} className="relative border-t-2 border-[var(--edge)]" onClick={() => setSel(null)}>
        <div className="relative mx-auto" style={{ width: W, height: H }}>
          <svg className="pointer-events-none absolute inset-0" width={W} height={H} aria-hidden>
            <path d={trail} fill="none" stroke="var(--edge)" strokeWidth={6} strokeLinecap="round" strokeDasharray="1 14" />
          </svg>

          {visible.map((i) => {
            const r = rows[i];
            const p = pos[i];
            const st = states[i];
            const c = face(st);
            const ringPct = r.masteryPct ?? 0;
            const circ = 2 * Math.PI * RING;
            return (
              <div key={r.chapterId}>
                {st === "next" && (
                  // Beside the node, on whichever side has room — above it, the bubble collided with the
                  // previous chapter's label.
                  <span
                    data-side={p.x > W / 2 + 2 ? "left" : "right"}
                    className="path-start glass-strong absolute z-10 rounded-2xl px-3 py-1 text-center text-xs font-extrabold uppercase tracking-wider"
                    style={{ width: 68, top: p.y - 15, left: p.x > W / 2 + 2 ? p.x - R - 14 - 68 : p.x + R + 14, color: "var(--foreground)" }}
                  >
                    Start
                  </span>
                )}
                {st === "next" && (
                  <span aria-hidden className="path-pulse absolute rounded-full" style={{ left: p.x - R, top: p.y - R, width: R * 2, height: R * 2, background: accent }} />
                )}
                {(st === "doing" || st === "next") && r.attempted > 0 && (
                  <svg aria-hidden className="pointer-events-none absolute" style={{ left: p.x - RING - 3, top: p.y - RING - 3 }} width={(RING + 3) * 2} height={(RING + 3) * 2}>
                    <circle cx={RING + 3} cy={RING + 3} r={RING} fill="none" stroke="var(--edge)" strokeWidth={5} />
                    <circle cx={RING + 3} cy={RING + 3} r={RING} fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round"
                      strokeDasharray={`${(ringPct / 100) * circ} ${circ}`} transform={`rotate(-90 ${RING + 3} ${RING + 3})`} />
                  </svg>
                )}
                <button
                  className="path-node absolute grid place-items-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring"
                  style={{ left: p.x - R, top: p.y - R, width: R * 2, height: R * 2, "--nf": c.f, "--nl": c.l, "--nfg": c.fg } as React.CSSProperties}
                  aria-expanded={sel === i}
                  aria-label={`Chapter ${r.chapterId}: ${r.title}. ${r.done ? "Exam ready" : r.attempted ? `${r.masteryPct}% accuracy` : "Not started"}${r.review ? ". Needs review" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSel(sel === i ? null : i); }}
                >
                  {st === "done" ? <Check className="size-7" strokeWidth={4.5} /> : st === "next" ? <Play className="size-6" fill="currentColor" strokeWidth={0} /> : r.chapterId}
                </button>
                {r.review && (
                  <span className="absolute z-[1] grid size-6 place-items-center rounded-full border-2 border-[var(--card)] bg-[#ff9600] text-[#1a1000]" style={{ left: p.x + R - 14, top: p.y - R - 4 }} title="Needs review">
                    <RotateCcw className="size-3" strokeWidth={3.5} />
                  </span>
                )}
                <span
                  className={`pointer-events-none absolute line-clamp-2 rounded-lg bg-[var(--card)]/85 px-1.5 py-0.5 text-center text-[12px] font-bold leading-tight ${st === "next" ? "text-foreground" : "text-muted-foreground"}`}
                  style={{ left: p.x - 72, top: p.y + R + 12, width: 144 }}
                >
                  {r.title}
                </span>
              </div>
            );
          })}

          {selRow && sel !== null && sel >= lo && sel < hi && (
            <div
              role="dialog"
              aria-label={`Chapter ${selRow.chapterId}: ${selRow.title}`}
              className="glass-strong animate-float-up absolute z-20 rounded-[24px] p-4"
              style={{ left: (W - 268) / 2, top: Math.min(pos[sel].y + R + 46, H - 190), width: 268 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: selRow.attempted > 0 ? MASTERY_TIER_META[selRow.tier].color : "var(--muted-foreground)" }}>
                Chapter {selRow.chapterId} · {selRow.done ? "Exam ready" : selRow.attempted > 0 ? MASTERY_TIER_META[selRow.tier].label : "Not started"}
              </div>
              <div className="mt-1 font-display text-base font-extrabold leading-snug">{selRow.title}</div>
              <div className="mt-1 text-xs font-semibold text-muted-foreground">
                {selRow.attempted > 0 ? `${selRow.masteryPct}% accuracy · ${selRow.correct}/${selRow.attempted} correct` : "Not practiced yet"}
                {selRow.review ? " · needs review" : ""}
              </div>
              {getConcept(track, selRow.chapterId) && <div className="mt-0.5 text-xs text-muted-foreground">Concept lesson · {getConcept(track, selRow.chapterId)!.minutes} min</div>}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => learn(selRow.chapterId)}>
                  <BookOpen className="size-3.5" /> Learn
                </Button>
                <Button size="sm" onClick={() => practice(selRow.chapterId)}>
                  <Play className="size-3.5" fill="currentColor" /> Practice
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {hiddenAfter > 0 && (
        <button onClick={() => { setShowAll(true); setEarlier(true); }} className="w-full border-t-2 border-[var(--edge)] py-2.5 text-xs font-extrabold text-muted-foreground outline-none transition hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
          ↓ Show all {rows.length} chapters ({hiddenAfter} more)
        </button>
      )}
    </Card>
  );
}
