"use client";

import { BookOpen, Check, ExternalLink, GraduationCap, Play, Youtube } from "lucide-react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { getTrackChapters } from "@/lib/track-content";
import { VIDEO_SERIES, conceptCount, getConcept, oneShotSearchUrl } from "@/lib/concepts";
import { useConceptsDone } from "@/components/shared/concept-player";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Every chapter of the current subject, with a teacher-style lesson where one exists, an AI-tutor lesson where it
 *  doesn't yet, and a one-shot video search for all of them. */
export function ConceptsView() {
  const track = useStudyStore((s) => s.track);
  const meta = SUBJECT_META[track];
  const setConceptOpen = useStudyStore((s) => s.setConceptOpen);
  const setFocusChapter = useStudyStore((s) => s.setFocusChapter);
  const setView = useStudyStore((s) => s.setView);
  const setPendingTutorContext = useStudyStore((s) => s.setPendingTutorContext);
  const done = useConceptsDone();
  const chapters = getTrackChapters(track);
  const ready = conceptCount(track);

  const teachWithTutor = (title: string) => {
    setPendingTutorContext(`Teach me the Class 10 CBSE ${meta.label} chapter "${title}" like a teacher. Start with the core idea in simple words, give one everyday analogy, then solve one worked example step by step, and finish by asking me one check question.`);
    setView("tutor");
  };
  const practise = (id: number) => { setFocusChapter({ track, id }); setView(meta.mcq); };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="flex items-center gap-2.5 text-3xl font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
          <GraduationCap className="size-7" style={{ color: `color-mix(in oklch, ${meta.accent} var(--atm, 100%), black)` }} /> Concept lessons
        </h1>
        <p className="mt-1 text-muted-foreground">
          Learn each chapter the way a teacher explains it — idea, worked example, common trap, quick check — then practise it. {meta.label}: {ready} of {chapters.length} chapters have a lesson.
        </p>
      </header>

      <Card className="glass gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold"><Youtube className="size-4 text-[#f43f5e]" /> One-shot &amp; full-course videos (Class 10)</div>
        <ul className="space-y-1.5">
          {VIDEO_SERIES[track].map((v) => (
            <li key={v.url}>
              <a href={v.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] text-foreground underline-offset-4 hover:underline">
                {v.label} <ExternalLink className="size-3.5 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">Third-party sites — availability and content can change. Each chapter below also has a live YouTube search for its one-shot revision video.</p>
      </Card>

      <ul className="space-y-3">
        {chapters.map((ch) => {
          const lesson = getConcept(track, ch.id);
          const isDone = done.has(`${track}:${ch.id}`);
          return (
            <li key={ch.id}>
              <Card className="glass gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5" style={{ "--sc": meta.accent } as React.CSSProperties}>
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-sm font-semibold" style={{ background: `color-mix(in oklch, ${meta.accent} 16%, transparent)`, color: `color-mix(in oklch, ${meta.accent} var(--atm, 100%), black)` }}>{ch.id}</span>
                  <div className="min-w-0">
                    <div className="font-semibold leading-snug">{ch.title}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      {lesson ? (<><span>Concept lesson · {lesson.minutes} min</span>{isDone && <span className="ink-success inline-flex items-center gap-1"><Check className="size-3.5" /> Completed</span>}</>) : <span>Lesson coming — the AI tutor can teach it now</span>}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {lesson ? (
                    <Button size="sm" onClick={() => setConceptOpen({ track, id: ch.id })}><Play className="size-3.5" fill="currentColor" /> {isDone ? "Review" : "Start lesson"}</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => teachWithTutor(ch.title)}><BookOpen className="size-3.5" /> Teach me with AI</Button>
                  )}
                  <Button asChild size="sm" variant="outline">
                    <a href={oneShotSearchUrl(track, ch.title)} target="_blank" rel="noopener noreferrer" aria-label={`Search one-shot videos for ${ch.title}`}><Youtube className="size-3.5" /> One-shot</a>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => practise(ch.id)}>Practise</Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
