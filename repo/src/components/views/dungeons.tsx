"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted, fireConfetti } from "@/components/shared/helpers";
import { CHAPTERS, SSC_CHAPTERS } from "@/lib/study-data";
import { MATHS_CHAPTERS } from "@/lib/maths-data";
import { ENG_CHAPTERS } from "@/lib/english-data";
import { SKT_CHAPTERS } from "@/lib/sanskrit-data";
import { MCQS, SSC_MCQS } from "@/lib/study-data";
import { MATHS_MCQS } from "@/lib/maths-data";
import { ENG_MCQS } from "@/lib/english-data";
import { SKT_MCQS } from "@/lib/sanskrit-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Castle,
  CheckCircle2,
  RotateCcw,
  Star,
  Trophy,
  Sparkles,
} from "lucide-react";

type Diff = "easy" | "medium" | "hard";

interface NormChapter {
  id: number;
  num: string | number;
  title: string;
  subj: string;
}

interface NormMCQ {
  id: number;
  ch: number;
  subj: string;
  diff: Diff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

function getChaptersForTrack(track: Track): NormChapter[] {
  switch (track) {
    case "science":
      return CHAPTERS as unknown as NormChapter[];
    case "ssc":
      return SSC_CHAPTERS as unknown as NormChapter[];
    case "maths":
      return MATHS_CHAPTERS as unknown as NormChapter[];
    case "english":
      return ENG_CHAPTERS as unknown as NormChapter[];
    case "sanskrit":
      return SKT_CHAPTERS as unknown as NormChapter[];
  }
}

function getMcqsForTrack(track: Track): NormMCQ[] {
  switch (track) {
    case "science":
      return MCQS as unknown as NormMCQ[];
    case "ssc":
      return SSC_MCQS as unknown as NormMCQ[];
    case "maths":
      return MATHS_MCQS as unknown as NormMCQ[];
    case "english":
      return ENG_MCQS as unknown as NormMCQ[];
    case "sanskrit":
      return SKT_MCQS as unknown as NormMCQ[];
  }
}

const BOSSES = ["🐉", "👹", "🧙", "👻", "🦹", "🐲", "🧛", "🤖"];
const LETTERS = ["A", "B", "C", "D"];

const PASS_SCORE = 4; // need 4/5 to clear
const DUNGEON_QUESTIONS = 5;

function bossFor(idx: number): string {
  return BOSSES[idx % BOSSES.length];
}

function starsFor(idx: number): number {
  // 1-3 stars, ramping up across the chapter list
  return (idx % 3) + 1;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clearedKey(track: Track): string {
  return `dungeons-cleared-${track}`;
}

function readCleared(track: Track): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(clearedKey(track));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function writeCleared(track: Track, set: Set<number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      clearedKey(track),
      JSON.stringify(Array.from(set))
    );
  } catch {
    /* ignore */
  }
}

export function DungeonsView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);
  const chStats = useStudyStore((s) => s.chStats);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const addXp = useStudyStore((s) => s.addXp);

  const chapters = useMemo(() => getChaptersForTrack(track), [track]);
  const allMcqs = useMemo(() => getMcqsForTrack(track), [track]);

  const [cleared, setCleared] = useState<Set<number>>(new Set());
  const [activeCh, setActiveCh] = useState<number | null>(null);
  const [questions, setQuestions] = useState<NormMCQ[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Load cleared dungeons from localStorage when mounted or track changes
  useEffect(() => {
    setCleared(readCleared(track));
  }, [track, mounted]);

  // Per-chapter mastery approximation
  const masteryFor = (chId: number): number => {
    if (track === "science") {
      const cs = chStats[chId];
      if (!cs || cs.attempted === 0) return 0;
      return Math.round((cs.correct / cs.attempted) * 100);
    }
    // Approximate for non-science: distribute totalXp across chapters, capped at 100
    const stats = subjectStats[track];
    const totalXp = stats?.totalXp ?? 0;
    const perChapter = Math.round(totalXp / Math.max(1, chapters.length));
    return Math.min(100, Math.round((perChapter / 100) * 100));
  };

  const openDungeon = (chId: number) => {
    const pool = allMcqs.filter((m) => m.ch === chId);
    // Sort by difficulty descending (hard first), then take top N
    const order: Record<Diff, number> = { hard: 3, medium: 2, easy: 1 };
    const sorted = [...pool].sort(
      (a, b) => (order[b.diff] || 0) - (order[a.diff] || 0)
    );
    const picked = sorted.slice(0, DUNGEON_QUESTIONS);
    if (picked.length === 0) return;
    setQuestions(picked);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setActiveCh(chId);
  };

  const pickAnswer = (i: number) => {
    if (selected !== null) return;
    const correct = i === questions[qIdx].ans;
    setSelected(i);
    if (correct) setScore((s) => s + 1);
    window.setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        setFinished(true);
      } else {
        setQIdx((c) => c + 1);
        setSelected(null);
      }
    }, 800);
  };

  // On finish, if cleared threshold and not already cleared, award XP + persist
  useEffect(() => {
    if (!finished || activeCh === null) return;
    const passed = score >= PASS_SCORE;
    if (passed && !cleared.has(activeCh)) {
      const next = new Set(cleared);
      next.add(activeCh);
      setCleared(next);
      writeCleared(track, next);
      addXp(50, "Dungeon cleared");
      fireConfetti();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const closeDungeon = () => {
    setActiveCh(null);
    setQuestions([]);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const retryDungeon = () => {
    if (activeCh === null) return;
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    // Re-shuffle questions
    const pool = allMcqs.filter((m) => m.ch === activeCh);
    const order: Record<Diff, number> = { hard: 3, medium: 2, easy: 1 };
    const sorted = [...pool].sort(
      (a, b) => (order[b.diff] || 0) - (order[a.diff] || 0)
    );
    setQuestions(shuffle(sorted).slice(0, DUNGEON_QUESTIONS));
  };

  const clearedCount = cleared.size;
  const totalCount = chapters.length;
  const overallPct =
    totalCount > 0 ? Math.round((clearedCount / totalCount) * 100) : 0;

  const activeChapter =
    activeCh !== null ? chapters.find((c) => c.id === activeCh) : null;
  const current = questions[qIdx];

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          Knowledge Dungeons <span aria-hidden>🏰</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Master each chapter to clear the dungeon
        </p>
      </header>

      {/* Progress overview */}
      <Card className="glass rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Dungeon Conquest
              </div>
              <div className="text-2xl font-bold tabular-nums text-primary">
                {mounted ? clearedCount : "—"}
                <span className="text-base text-muted-foreground">
                  /{totalCount} cleared
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Overall
              </div>
              <div className="text-2xl font-bold tabular-nums text-amber-400">
                {mounted ? overallPct : "—"}%
              </div>
            </div>
          </div>
          <Progress value={overallPct} className="h-2" />
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {SUBJECT_META[track].icon} {SUBJECT_META[track].label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Pass: {PASS_SCORE}/{DUNGEON_QUESTIONS} · +50 XP each
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Dungeons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mounted &&
          chapters.map((ch, i) => {
            const isCleared = cleared.has(ch.id);
            const mastery = masteryFor(ch.id);
            const stars = starsFor(i);
            const boss = bossFor(i);
            const numLabel =
              typeof ch.num === "number"
                ? `Ch ${ch.num}`
                : ch.num || `Ch ${ch.id}`;
            return (
              <Card
                key={ch.id}
                className={`glass rounded-2xl overflow-hidden transition-all cursor-pointer hover:scale-[1.01] hover:shadow-lg ${
                  isCleared
                    ? "border-amber-500/60 ring-1 ring-amber-500/40"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => openDungeon(ch.id)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="size-8 rounded-lg bg-muted grid place-items-center text-xs font-bold">
                        {ch.id}
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {numLabel}
                        </div>
                        <div className="font-semibold text-sm leading-tight line-clamp-2">
                          {ch.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl">{boss}</div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${
                          s < stars
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">
                      Difficulty
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mastery</span>
                      <span className="tabular-nums font-medium">{mastery}%</span>
                    </div>
                    <Progress value={mastery} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isCleared ? (
                      <Badge
                        variant="secondary"
                        className="text-xs gap-1 bg-amber-500/15 text-amber-300 border-amber-500/30"
                      >
                        <CheckCircle2 className="size-3" /> Cleared
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Castle className="size-3" /> Uncleared
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Enter <span aria-hidden>→</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Dungeon challenge dialog */}
      <Dialog
        open={activeCh !== null}
        onOpenChange={(o) => {
          if (!o) closeDungeon();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Castle className="size-5 text-primary" />
              {activeChapter
                ? `${bossFor(chapters.findIndex((c) => c.id === activeCh))} Dungeon · ${
                    typeof activeChapter.num === "number"
                      ? `Ch ${activeChapter.num}`
                      : activeChapter.num || `Ch ${activeChapter.id}`
                  }`
                : "Dungeon"}
            </DialogTitle>
            <DialogDescription>
              {activeChapter?.title} · Defeat {DUNGEON_QUESTIONS} bosses (need{" "}
              {PASS_SCORE} correct to clear)
            </DialogDescription>
          </DialogHeader>

          {!finished && current ? (
            <div className="space-y-4">
              {/* Score & progress */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {qIdx + 1}/{questions.length}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Score: {score}
                </Badge>
              </div>
              <Progress
                value={((qIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}
                className="h-1.5"
              />

              <div className="text-base font-medium leading-relaxed">
                {current.q}
              </div>
              <div className="grid gap-2">
                {current.opts.map((opt, i) => {
                  const isCorrect = i === current.ans;
                  const isPicked = selected === i;
                  let cls =
                    "border-border bg-card/40 hover:border-primary/60 hover:bg-primary/5";
                  if (selected !== null) {
                    if (isCorrect)
                      cls = "border-emerald-500/60 bg-emerald-500/10";
                    else if (isPicked)
                      cls = "border-rose-500/60 bg-rose-500/10";
                    else cls = "border-border bg-card/30 opacity-60";
                  }
                  return (
                    <button
                      key={i}
                      disabled={selected !== null}
                      onClick={() => pickAnswer(i)}
                      className={`text-left rounded-lg border p-2.5 transition-all flex items-start gap-2 ${cls}`}
                    >
                      <span className="size-6 shrink-0 rounded-full bg-muted grid place-items-center text-[10px] font-bold">
                        {LETTERS[i]}
                      </span>
                      <span className="text-sm flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className="rounded-md bg-muted/60 p-2 text-xs">
                  <span className="font-medium">Explanation: </span>
                  <span className="text-muted-foreground">{current.exp}</span>
                </div>
              )}
            </div>
          ) : finished ? (
            <div className="space-y-4 text-center py-2">
              {score >= PASS_SCORE ? (
                <>
                  <div className="text-5xl">🏆</div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-2">
                      <Trophy className="size-5" /> Dungeon Cleared!
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You defeated the boss and earned{" "}
                      <span className="text-amber-400 font-medium">+50 XP</span>.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl">💀</div>
                  <div>
                    <div className="text-2xl font-bold text-rose-400">
                      Dungeon Failed
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      You needed {PASS_SCORE}/{DUNGEON_QUESTIONS} to clear. You
                      got {score}. Retry to claim victory!
                    </p>
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <div className="rounded-lg bg-muted/60 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    Score
                  </div>
                  <div className="text-xl font-bold tabular-nums">
                    {score}/{questions.length}
                  </div>
                </div>
                <div className="rounded-lg bg-muted/60 p-2">
                  <div className="text-[10px] uppercase text-muted-foreground">
                    XP Earned
                  </div>
                  <div className="text-xl font-bold tabular-nums text-amber-400">
                    +{score >= PASS_SCORE ? 50 : 0}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Preparing dungeon…
            </div>
          )}

          <DialogFooter className="gap-2">
            {finished && score < PASS_SCORE && (
              <Button onClick={retryDungeon} variant="default">
                <RotateCcw className="size-4 mr-1" /> Retry Dungeon
              </Button>
            )}
            <Button variant="outline" onClick={closeDungeon}>
              {finished ? "Close" : "Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hint footer */}
      <Card className="glass rounded-2xl">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="size-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <div className="font-medium">How dungeons work</div>
            <p className="text-xs text-muted-foreground">
              Each chapter is a dungeon guarded by a boss. Pick the 5 hardest
              MCQs for that chapter and answer at least {PASS_SCORE}/
              {DUNGEON_QUESTIONS} correctly to clear it. Cleared dungeons show a{" "}
              <span className="text-amber-300 font-medium">✓</span> and a gold
              border, and award <span className="text-amber-400">+50 XP</span>.
              Your progress is saved per-subject in your browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
