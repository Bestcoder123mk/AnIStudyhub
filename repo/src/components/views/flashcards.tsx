"use client";

import { useState, useMemo } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { FLASHCARDS, CHAPTERS } from "@/lib/study-data";
import type { Subject } from "@/lib/study-data";
import { speak } from "@/lib/tts";
import { Volume2 } from "lucide-react";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FlashcardsView() {
  const mounted = useMounted();
  const reviewFlash = useStudyStore((s) => s.reviewFlash);
  const rateSrCard = useStudyStore((s) => s.rateSrCard);

  const [deck, setDeck] = useState<string>("0"); // "0" = all, else ch id
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Build deck cards, keeping each card's original index in FLASHCARDS for SR key
  const deckCards = useMemo(() => {
    const items =
      deck === "0" ? FLASHCARDS : FLASHCARDS.filter((c) => c.ch === parseInt(deck, 10));
    return items.map((c) => ({ card: c, origIdx: FLASHCARDS.indexOf(c) }));
  }, [deck]);

  const safeIdx = deckCards.length > 0 ? Math.min(idx, deckCards.length - 1) : 0;
  const current = deckCards[safeIdx];

  const subj: Subject = useMemo(() => {
    if (!current) return "chem";
    const ch = CHAPTERS.find((c) => c.id === current.card.ch);
    return (ch?.subj as Subject) || "chem";
  }, [current]);

  const meta = getSubjMeta(subj);

  const goPrev = () => {
    if (deckCards.length <= 1) return;
    setFlipped(false);
    setIdx((i) => (i - 1 + deckCards.length) % deckCards.length);
  };
  const goNext = () => {
    if (deckCards.length <= 1) return;
    setFlipped(false);
    setIdx((i) => (i + 1) % deckCards.length);
  };

  const rate = (quality: 2 | 3 | 5) => {
    if (!current) return;
    reviewFlash("science");
    rateSrCard(`flash-${current.card.ch}-${current.origIdx}`, quality);
    setTimeout(() => {
      setFlipped(false);
      setIdx((i) => (i + 1) % deckCards.length);
    }, 220);
  };

  const changeDeck = (v: string) => {
    setDeck(v);
    setIdx(0);
    setFlipped(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
        <div className="h-72 bg-muted/30 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Flashcards ⚡</h1>
        <p className="text-sm text-muted-foreground mt-1">
          28 cards · Click to flip · Rate yourself · +5 XP per review
        </p>
      </header>

      {/* Deck selector + counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-72">
          <Select value={deck} onValueChange={changeDeck}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select deck" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">📚 All Topics (Mixed)</SelectItem>
              {CHAPTERS.map((ch) => (
                <SelectItem key={ch.id} value={String(ch.id)}>
                  {getSubjMeta(ch.subj).emoji} Ch{ch.id} — {ch.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5 text-sm self-start sm:self-auto">
          Card {current ? safeIdx + 1 : 0} of {deckCards.length}
        </Badge>
      </div>

      {current ? (
        <div className={meta.cls}>
          {/* 3D flip card */}
          <div
            className={`flip-3d ${flipped ? "flipped" : ""} h-72 sm:h-80 max-w-2xl mx-auto cursor-pointer select-none`}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            aria-label={flipped ? "Flashcard answer — tap to flip back" : "Flashcard question — tap to flip"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
          >
            <div className="flip-3d-inner h-full w-full">
              {/* Front — question */}
              <div className="flip-3d-face h-full w-full rounded-2xl border-2 border-subj bg-card p-5 sm:p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-subj-dim text-subj">
                    {meta.emoji} Ch {current.card.ch}
                  </span>
                  <span className="text-xs text-muted-foreground">Tap to flip ↩</span>
                </div>
                <div className="flex-1 flex items-center justify-center px-2">
                  <p className="text-lg sm:text-xl font-semibold text-center">{current.card.q}</p>
                  <button onClick={() => speak(current.card.q)} className="absolute top-3 right-3 text-muted-foreground/40 hover:text-primary transition" aria-label="Read aloud">
                    <Volume2 className="size-4" />
                  </button>
                </div>
                <div className="text-center text-xs text-muted-foreground uppercase tracking-wide">
                  Question
                </div>
              </div>
              {/* Back — answer */}
              <div className="flip-3d-face flip-3d-back h-full w-full rounded-2xl border-2 border-subj bg-muted/30 p-5 sm:p-6 flex flex-col overflow-y-auto scroll-thin">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-md bg-subj-dim text-subj">
                    {meta.emoji} Answer
                  </span>
                  <span className="text-xs text-muted-foreground">Tap to flip back ↩</span>
                </div>
                <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {current.card.a}
                </p>
              </div>
            </div>
          </div>

          {/* Rating buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto mt-5">
            <Button
              variant="outline"
              className="border-emerald-500/40 hover:bg-emerald-500/10 text-xs sm:text-sm"
              onClick={() => rate(5)}
            >
              ✅ Know it! (+5 XP)
            </Button>
            <Button variant="outline" className="text-xs sm:text-sm" onClick={() => rate(3)}>
              ⏭ Skip
            </Button>
            <Button
              variant="outline"
              className="border-rose-500/40 hover:bg-rose-500/10 text-xs sm:text-sm"
              onClick={() => rate(2)}
            >
              ❌ Need practice
            </Button>
          </div>

          {/* Card navigation */}
          <div className="flex items-center justify-between max-w-2xl mx-auto mt-4">
            <Button variant="ghost" size="sm" onClick={goPrev} disabled={deckCards.length <= 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {safeIdx + 1} / {deckCards.length}
            </span>
            <Button variant="ghost" size="sm" onClick={goNext} disabled={deckCards.length <= 1}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
          No flashcards in this deck.
        </div>
      )}
    </div>
  );
}
