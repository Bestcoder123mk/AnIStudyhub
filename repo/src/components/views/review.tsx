"use client";

import { useMemo } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { FLASHCARDS, SSC_FLASHCARDS } from "@/lib/study-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";

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
}

export function ReviewView() {
  const mounted = useMounted();
  const srCards = useStudyStore((s) => s.srCards);
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
          nextReview: 0, overdue: true,
        });
        void ch;
      } else if (card.nextReview <= now) {
        all.push({
          key, question: fc.q, answer: fc.a, subject: "Science",
          chapter: fc.ch, interval: card.interval, ef: card.ef,
          reviews: card.reviews, nextReview: card.nextReview, overdue: true,
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
          nextReview: 0, overdue: true,
        });
      } else if (card.nextReview <= now) {
        all.push({
          key, question: fc.q, answer: fc.a, subject: "SSC",
          chapter: fc.ch, interval: card.interval, ef: card.ef,
          reviews: card.reviews, nextReview: card.nextReview, overdue: true,
        });
      }
    });

    return all;
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
              reviewFlash(card.subject === "Science" ? "science" : "ssc");
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ card, onRate }: { card: DueCard; onRate: (q: 1 | 2 | 3 | 4 | 5) => void }) {
  const [revealed, setRevealed] = useState(false);
  const meta = getSubjMeta(card.subject === "Science" ? "chem" : "hist"); // generic

  return (
    <Card className="glass rounded-2xl overflow-hidden">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[9px]">{card.subject} · Ch {card.chapter}</Badge>
          {card.reviews === 0 && <Badge variant="outline" className="text-[9px] text-rose-400 border-rose-400/30">New</Badge>}
          {card.reviews > 0 && card.reviews < 3 && <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-400/30">Learning</Badge>}
          {card.reviews >= 3 && <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-400/30">Mature</Badge>}
          <span className="text-[9px] text-muted-foreground ml-auto">Reviews: {card.reviews}</span>
        </div>
        <p className="text-sm font-medium mb-2 whitespace-pre-wrap">{card.question}</p>
        {revealed ? (
          <>
            <div className="rounded-lg bg-muted/40 border border-border p-3 mb-3">
              <p className="text-xs whitespace-pre-wrap text-muted-foreground">{card.answer}</p>
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
