"use client";

import { useMemo } from "react";
import { useStudyStore, type Track } from "@/store/use-study-store";
import { FLASHCARDS, SSC_FLASHCARDS } from "@/lib/study-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, CheckCircle2, AlertCircle, Gauge } from "lucide-react";
import { useMounted } from "@/components/shared/helpers";
import { computeMemoryStrength } from "@/lib/mastery-engine";

interface DueCard {
  key: string;
  question: string;
  answer: string;
  subject: string;
  chapter: number;
  interval: number;
  ef: number;
  reviews: number;
  nextReview: number;
  overdue: boolean;
  track: Track;
  isRetest?: boolean;
}

export function ReviewView() {
  const mounted = useMounted();
  const srCards = useStudyStore((s) => s.srCards);
  const mistakes = useStudyStore((s) => s.mistakes);
  const rateSrCard = useStudyStore((s) => s.rateSrCard);
  const reviewFlash = useStudyStore((s) => s.reviewFlash);
  const setView = useStudyStore((s) => s.setView);
  const setTrack = useStudyStore((s) => s.setTrack);

  const dueCards: DueCard[] = useMemo(() => {
    if (!mounted) return [];
    const now = Date.now();
    const all: DueCard[] = [];

    // Science flashcards
    FLASHCARDS.forEach((fc, i) => {
      const key = `flash-${fc.ch}-${i}`;
      const card = srCards[key];
      if (!card) {
        // Never reviewed — counts as "new"
        const ch = fc;
        all.push({
          key, question: fc.q, answer: fc.a, subject: "Science",
          chapter: fc.ch, interval: 0, ef: 2.5, reviews: 0,
          nextReview: 0, overdue: true, track: "science",
        });
        void ch;
      } else if (card.nextReview <= now) {
        all.push({
          key, question: fc.q, answer: fc.a, subject: "Science",
          chapter: fc.ch, interval: card.interval, ef: card.ef,
          reviews: card.reviews, nextReview: card.nextReview, overdue: true, track: "science",
        });
      }
    });

    // SSC flashcards
    SSC_FLASHCARDS.forEach((fc, i) => {
      const key = `sscflash-${fc.ch}-${i}`;
      const card = srCards[key];
      if (!card) {
        all.push({
          key, question: fc.q, answer: fc.a, subject: "SSC",
          chapter: fc.ch, interval: 0, ef: 2.5, reviews: 0,
          nextReview: 0, overdue: true, track: "ssc",
        });
      } else if (card.nextReview <= now) {
        all.push({
          key, question: fc.q, answer: fc.a, subject: "SSC",
          chapter: fc.ch, interval: card.interval, ef: card.ef,
          reviews: card.reviews, nextReview: card.nextReview, overdue: true, track: "ssc",
        });
      }
    });

    // Smart Retests — every logged mistake automatically becomes a spaced-
    // repetition card (review doc item #61's immediate → 1hr → next-day →
    // 3-day → 1-week chain, powered by the existing SM-2 engine rather than
    // a separate scheduler). Capped to the most recent 40 so the queue
    // doesn't balloon for a student with a long mistake history.
    mistakes.slice(0, 40).forEach((m) => {
      const key = `mistake-${m.id}`;
      const card = srCards[key];
      const subjectLabel = m.track.charAt(0).toUpperCase() + m.track.slice(1);
      const answer = m.exp ? `${m.correctAns}\n\n${m.exp}` : m.correctAns;
      if (!card) {
        all.push({
          key, question: m.q, answer, subject: subjectLabel, chapter: m.ch,
          interval: 0, ef: 2.5, reviews: 0, nextReview: 0, overdue: true,
          track: m.track, isRetest: true,
        });
      } else if (card.nextReview <= now) {
        all.push({
          key, question: m.q, answer, subject: subjectLabel, chapter: m.ch,
          interval: card.interval, ef: card.ef, reviews: card.reviews,
          nextReview: card.nextReview, overdue: true, track: m.track, isRetest: true,
        });
      }
    });

    return all;
  }, [mounted, srCards, mistakes]);

  // Cards that are NOT due yet — i.e., successfully learned and currently
  // decaying on a schedule — shown as "Memory Strength" so the forgetting
  // curve (review doc item #24-25) is visible before a card lapses, not
  // just after.
  const healthyCards = useMemo(() => {
    if (!mounted) return [];
    const now = Date.now();
    const all: (DueCard & { strength: number; daysLeft: number })[] = [];
    const push = (key: string, q: string, a: string, subject: string, chapter: number, track: Track) => {
      const card = srCards[key];
      if (!card || card.reviews === 0 || card.nextReview <= now) return;
      all.push({
        key, question: q, answer: a, subject, chapter, track,
        interval: card.interval, ef: card.ef, reviews: card.reviews, nextReview: card.nextReview, overdue: false,
        strength: computeMemoryStrength(card.ef, card.interval),
        daysLeft: Math.max(1, Math.round((card.nextReview - now) / 86400000)),
      });
    };
    FLASHCARDS.forEach((fc, i) => push(`flash-${fc.ch}-${i}`, fc.q, fc.a, "Science", fc.ch, "science"));
    SSC_FLASHCARDS.forEach((fc, i) => push(`sscflash-${fc.ch}-${i}`, fc.q, fc.a, "SSC", fc.ch, "ssc"));
    return all.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [mounted, srCards]);

  const newCount = dueCards.filter((c) => c.reviews === 0).length;
  const learningCount = dueCards.filter((c) => c.reviews > 0 && c.reviews < 3).length;
  const matureCount = dueCards.filter((c) => c.reviews >= 3).length;

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Spaced Repetition</h1>
        <p className="text-sm text-muted-foreground mt-1">Review cards before you forget them — powered by SM-2 algorithm</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4 text-center">
            <AlertCircle className="size-5 mx-auto text-rose-400 mb-1" />
            <div className="text-2xl font-bold text-rose-400">{newCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">New</div>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4 text-center">
            <Clock className="size-5 mx-auto text-amber-400 mb-1" />
            <div className="text-2xl font-bold text-amber-400">{learningCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Learning</div>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4 text-center">
            <CheckCircle2 className="size-5 mx-auto text-emerald-400 mb-1" />
            <div className="text-2xl font-bold text-emerald-400">{matureCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Mature</div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Strength — forgetting curve for cards not yet due */}
      {healthyCards.length > 0 && (
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Gauge className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Memory Strength</span>
              <span className="text-xs text-muted-foreground ml-auto">{healthyCards.length} cards on schedule</span>
            </div>
            <div className="space-y-2.5">
              {healthyCards.slice(0, 6).map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate text-muted-foreground max-w-[70%]">{c.question}</span>
                    <span className="tabular-nums text-muted-foreground shrink-0">
                      {c.strength}% · forgets in ~{c.daysLeft}d
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.strength}%`, backgroundColor: c.strength >= 70 ? "#34d399" : c.strength >= 40 ? "#fbbf24" : "#fb7185" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dueCards.length === 0 ? (
        <Card className="glass rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <Brain className="size-10 mx-auto text-emerald-400 mb-3" />
            <p className="text-sm font-semibold text-emerald-400">All caught up!</p>
            <p className="text-xs text-muted-foreground mt-1">No cards due for review right now. Come back later or study new flashcards.</p>
            <div className="flex gap-2 justify-center mt-4">
              <Button size="sm" variant="outline" onClick={() => { setTrack("science"); setView("flash"); }}>Science Flashcards</Button>
              <Button size="sm" variant="outline" onClick={() => { setTrack("ssc"); setView("ssc-flash"); }}>SSC Flashcards</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{dueCards.length} cards due</span>
            <Badge variant="secondary" className="text-[10px]">SM-2 Algorithm</Badge>
          </div>

          {dueCards.slice(0, 20).map((card) => (
            <ReviewCard key={card.key} card={card} onRate={(q) => {
              rateSrCard(card.key, q);
              reviewFlash(card.track);
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ card, onRate }: { card: DueCard; onRate: (q: 1 | 2 | 3 | 4 | 5) => void }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="glass rounded-2xl overflow-hidden">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[9px]">{card.subject} · Ch {card.chapter}</Badge>
          {card.isRetest && <Badge variant="outline" className="text-[9px] text-sky-400 border-sky-400/30">🔁 Retest</Badge>}
          {card.reviews === 0 && <Badge variant="outline" className="text-[9px] text-rose-400 border-rose-400/30">New</Badge>}
          {card.reviews > 0 && card.reviews < 3 && <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-400/30">Learning</Badge>}
          {card.reviews >= 3 && <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-400/30">Mature</Badge>}
          <span className="text-[9px] text-muted-foreground ml-auto">Reviews: {card.reviews}</span>
        </div>
        <p className="text-sm font-medium mb-2 whitespace-pre-wrap">{card.question}</p>
        {revealed ? (
          <>
            <div className="rounded-lg bg-muted/40 border border-border p-3 mb-3">
              <Markdown text={card.answer} className="text-muted-foreground" compact />
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              <Button size="sm" variant="outline" className="text-[10px] py-1 h-auto border-rose-400/30 text-rose-400 hover:bg-rose-400/10" onClick={() => onRate(1)}>Again</Button>
              <Button size="sm" variant="outline" className="text-[10px] py-1 h-auto border-orange-400/30 text-orange-400 hover:bg-orange-400/10" onClick={() => onRate(2)}>Hard</Button>
              <Button size="sm" variant="outline" className="text-[10px] py-1 h-auto border-amber-400/30 text-amber-400 hover:bg-amber-400/10" onClick={() => onRate(3)}>Good</Button>
              <Button size="sm" variant="outline" className="text-[10px] py-1 h-auto border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10" onClick={() => onRate(4)}>Easy</Button>
              <Button size="sm" variant="outline" className="text-[10px] py-1 h-auto border-sky-400/30 text-sky-400 hover:bg-sky-400/10" onClick={() => onRate(5)}>Perfect</Button>
            </div>
          </>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setRevealed(true)} className="w-full">Show Answer</Button>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Markdown } from "@/components/shared/markdown";
