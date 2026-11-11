"use client";

/**
 * The concept-lesson player: a full-screen, one-idea-at-a-time walkthrough that explains a chapter the way a
 * teacher would — idea, key results, a worked example revealed step by step, the common trap, and a check.
 * It deliberately reads like a good textbook page rather than a game: calm type, no timers, no penalties.
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Lightbulb, PencilLine, Sigma, Sparkles, Target, TriangleAlert, X } from "lucide-react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { getTrackChapter } from "@/lib/track-content";
import { getConcept, oneShotSearchUrl, type ConceptLesson, type ConceptStep } from "@/lib/concepts";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";

const DONE_KEY = "studyhub-concepts-done";
const DONE_EVENT = "studyhub:concept-done";
/** Completed lessons live in their own small localStorage list, so they never touch the main store's schema. */
export function readDone(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as string[]); } catch { return new Set(); }
}
function markDone(track: Track, id: number) {
  try {
    const s = readDone(); s.add(`${track}:${id}`);
    localStorage.setItem(DONE_KEY, JSON.stringify([...s]));
    window.dispatchEvent(new Event(DONE_EVENT));
  } catch { /* progress ticks are a nicety */ }
}
export function useConceptsDone() {
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener(DONE_EVENT, sync);
    return () => window.removeEventListener(DONE_EVENT, sync);
  }, []);
  return done;
}

export function ConceptPlayer() {
  const open = useStudyStore((s) => s.conceptOpen);
  const setOpen = useStudyStore((s) => s.setConceptOpen);
  const data = open ? getConcept(open.track, open.id) : undefined;
  if (!open || !data) return null;
  return <Player key={`${open.track}:${data.chapterId}`} lesson={data} onClose={() => setOpen(null)} />;
}

const LABELS: Record<ConceptStep["k"], { text: string; icon: ReactNode; tone?: string }> = {
  idea: { text: "The idea", icon: <Lightbulb className="size-4" /> },
  analogy: { text: "Think of it like this", icon: <Sparkles className="size-4" /> },
  formula: { text: "Key results", icon: <Sigma className="size-4" /> },
  example: { text: "Worked example", icon: <PencilLine className="size-4" /> },
  trap: { text: "Watch out", icon: <TriangleAlert className="size-4" />, tone: "#f59e0b" },
  check: { text: "Check yourself", icon: <Target className="size-4" /> },
};

function Player({ lesson, onClose }: { lesson: ConceptLesson; onClose: () => void }) {
  const meta = SUBJECT_META[lesson.track];
  const chapter = getTrackChapter(lesson.track, lesson.chapterId);
  const openChapter = useStudyStore((s) => s.openChapter);
  const setView = useStudyStore((s) => s.setView);
  const setFocusChapter = useStudyStore((s) => s.setFocusChapter);

  const total = lesson.steps.length + 2; // intro + steps + recap
  const [i, setI] = useState(0);
  const [reveal, setReveal] = useState(0); // worked-example steps shown
  const [picked, setPicked] = useState<number | null>(null); // answer chosen on a check card
  const [firstTry, setFirstTry] = useState(0);
  const checks = useMemo(() => lesson.steps.filter((s) => s.k === "check").length, [lesson]);

  const step = i >= 1 && i <= lesson.steps.length ? lesson.steps[i - 1] : null;
  const isRecap = i === total - 1;
  const blocked = (step?.k === "example" && reveal < step.steps.length) || (step?.k === "check" && picked === null);

  const go = (n: number) => { setI(n); setReveal(0); setPicked(null); window.scrollTo?.(0, 0); };
  const next = () => {
    if (step?.k === "example" && reveal < step.steps.length) return setReveal(reveal + 1);
    if (!blocked && i < total - 1) go(i + 1);
  };
  const back = () => i > 0 && go(i - 1);

  useEffect(() => { if (isRecap) { markDone(lesson.track, lesson.chapterId); openChapter(lesson.track, lesson.chapterId); } }, [isRecap]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (step?.k === "check" && picked === null && "1234".includes(e.key) && Number(e.key) <= step.opts.length) return pick(Number(e.key) - 1);
      if (e.key === "ArrowRight" || e.key === "Enter") { if (!(e.target as HTMLElement | null)?.closest("button, a")) { e.preventDefault(); next(); } }
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pick = (n: number) => {
    if (step?.k !== "check" || picked !== null) return;
    setPicked(n);
    if (n === step.a) setFirstTry((v) => v + 1);
  };
  const practise = () => { setFocusChapter({ track: lesson.track, id: lesson.chapterId }); setView(meta.mcq); onClose(); };
  const accent = meta.accent;

  return (
    <div role="dialog" aria-modal="true" aria-label={`Concept lesson: ${chapter?.title ?? ""}`} className="fixed inset-0 z-[80] overflow-y-auto bg-background">
      {/* top bar */}
      <div className="sticky top-0 z-10 border-b border-[var(--edge)] bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={onClose} aria-label="Close lesson" className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none transition hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-5" />
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--edge)]" role="progressbar" aria-valuenow={i} aria-valuemin={0} aria-valuemax={total - 1} aria-label="Lesson progress">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(i / (total - 1)) * 100}%`, background: accent }} />
          </div>
          <span className="text-xs font-medium tabular-nums text-muted-foreground">{i + 1}/{total}</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-40 pt-8">
        {i === 0 && (
          <div className="animate-float-up text-center">
            <Mascot mood="happy" size={104} bounce className="mx-auto" />
            <div className="mt-3 text-xs font-semibold uppercase tracking-wider" style={{ color: `color-mix(in oklch, ${accent} var(--atm, 100%), black)` }}>{meta.label} · Chapter {lesson.chapterId}</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{chapter?.title}</h1>
            <p className="mx-auto mt-3 max-w-md text-[17px] leading-relaxed text-muted-foreground">{lesson.hook}</p>
            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[var(--edge)] px-4 py-1.5 text-sm text-muted-foreground">
              <span>{lesson.minutes} min</span><span aria-hidden>·</span><span>{lesson.steps.length} cards</span><span aria-hidden>·</span><span>{checks} quick check{checks === 1 ? "" : "s"}</span>
            </div>
          </div>
        )}

        {step && (
          <div key={i} className="animate-float-up">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: LABELS[step.k].tone ?? `color-mix(in oklch, ${accent} var(--atm, 100%), black)` }}>
              {LABELS[step.k].icon}{LABELS[step.k].text}
            </div>
            {"h" in step && <h2 className="text-2xl font-semibold leading-snug tracking-tight">{step.h}</h2>}
            {step.k === "check" && <h2 className="text-2xl font-semibold leading-snug tracking-tight">{step.q}</h2>}
            {(step.k === "idea" || step.k === "analogy" || step.k === "trap") && <p className="mt-4 text-[17px] leading-[1.75] text-foreground/90">{step.p}</p>}

            {step.k === "formula" && (
              <ul className="mt-4 space-y-2.5">
                {step.items.map((it, n) => (
                  <li key={n} className="rounded-xl border border-[var(--edge)] bg-card px-4 py-3 text-[16px] leading-relaxed" style={{ borderLeft: `3px solid ${accent}` }}>{it}</li>
                ))}
              </ul>
            )}

            {step.k === "example" && (
              <>
                <p className="mt-4 text-[17px] leading-[1.75] text-foreground/90">{step.p}</p>
                <ol className="mt-4 space-y-2.5">
                  {step.steps.slice(0, reveal).map((s, n) => (
                    <li key={n} className="animate-float-up flex gap-3 rounded-xl border border-[var(--edge)] bg-card px-4 py-3 text-[16px] leading-relaxed">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold" style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)`, color: accent }}>{n + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                {reveal < step.steps.length && (
                  <button onClick={() => setReveal(step.steps.length)} className="mt-3 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Show all steps</button>
                )}
              </>
            )}

            {step.k === "check" && (
              <div className="mt-5 space-y-2.5">
                {step.opts.map((o, n) => {
                  let cls = "choice";
                  if (picked !== null) cls += n === step.a ? " choice-correct" : n === picked ? " choice-wrong" : " choice-dim";
                  return (
                    <button key={n} onClick={() => pick(n)} disabled={picked !== null} className={`${cls} flex w-full items-center gap-3 p-3.5 text-left text-[16px]`}>
                      <span className="choice-key">{"ABCD"[n]}</span><span className="flex-1">{o}</span>
                      {picked !== null && n === step.a && <Check className="ink-success size-4" />}
                    </button>
                  );
                })}
                {picked !== null && (
                  <div className="animate-float-up rounded-xl border border-[var(--edge)] bg-card px-4 py-3 text-[16px] leading-relaxed">
                    <div className={`mb-1 font-semibold ${picked === step.a ? "ink-success" : "ink-danger"}`}>{picked === step.a ? "Right." : "Not quite."}</div>
                    {step.why}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isRecap && (
          <div className="animate-float-up">
            <div className="text-center">
              <Mascot mood="cheer" size={96} className="mx-auto" />
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">That&apos;s the concept.</h2>
              {checks > 0 && <p className="mt-1 text-sm text-muted-foreground">{firstTry} of {checks} check{checks === 1 ? "" : "s"} right on the first try.</p>}
            </div>
            <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Remember</div>
            <ul className="mt-2 space-y-2.5">
              {lesson.recap.map((r, n) => (
                <li key={n} className="flex gap-3 rounded-xl border border-[var(--edge)] bg-card px-4 py-3 text-[16px] leading-relaxed">
                  <Check className="mt-1 size-4 shrink-0" style={{ color: `color-mix(in oklch, ${accent} var(--atm, 100%), black)` }} /><span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button size="lg" onClick={practise}>Practise this chapter</Button>
              <Button asChild size="lg" variant="outline">
                <a href={oneShotSearchUrl(lesson.track, chapter?.title ?? "")} target="_blank" rel="noopener noreferrer">Watch a one-shot <ExternalLink className="size-4" /></a>
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Opens YouTube search results for &ldquo;Class 10 {meta.label} {chapter?.title} one shot&rdquo;.</p>
          </div>
        )}
      </div>

      {/* bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--edge)] bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button variant="outline" size="lg" onClick={back} disabled={i === 0} aria-label="Previous card"><ArrowLeft className="size-4" /></Button>
          {isRecap ? (
            <Button size="lg" variant="secondary" className="flex-1" onClick={onClose}>Done</Button>
          ) : (
            <Button size="lg" className="flex-1" onClick={next} disabled={step?.k === "check" ? picked === null : false}>
              {i === 0 ? "Start lesson" : step?.k === "example" && reveal < step.steps.length ? (reveal === 0 ? "Show the first step" : `Show step ${reveal + 1}`) : "Continue"} <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
