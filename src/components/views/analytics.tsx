"use client";

import { useMemo, useState, useEffect } from "react";
import { useStudyStore, SUBJECT_META, DIFF_TIERS, type DiffTier, type ViewId } from "@/store/use-study-store";
import { CHAPTERS, SSC_CHAPTERS, type Chapter, type SscChapter } from "@/lib/study-data";
import { getTrackChapters, getAllTrackMcqs, getTrackShortQa, getTrackLongQa } from "@/lib/track-content";
import { tierMeta } from "@/lib/adaptive";
import { extractKeyPoints } from "@/components/shared/active-recall-panel";
import {
  computeChapterMastery, computeReadiness, recoverMyMarks,
  MASTERY_TIER_META, computeDangerZone, DANGER_LEVEL_META,
  computeConfusionPairs, computeCalibration,
  generateRevisionPlan, REVISION_MODES, REVISION_MODE_META, type RevisionMode,
  neglectedChapters, computeMasteryStreak, buildOneSheet,
} from "@/lib/mastery-engine";
import { fmtMins, useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CalendarDays, Target, Clock, Flame, Award, Layers, AlertTriangle, Gauge } from "lucide-react";

// Per-track view routing for Rapid Revision's "Start" buttons — module
// scope since it's static data, not per-render state.
const TRACK_VIEWS: Record<string, { mcq: string; short: string; mock: string }> = {
  science: { mcq: "mcq", short: "short", mock: "mock" },
  ssc: { mcq: "ssc-mcq", short: "ssc-short", mock: "ssc-mcq" }, // no dedicated SSC mock view yet
  maths: { mcq: "maths-mcq", short: "maths-short", mock: "maths-mock" },
  english: { mcq: "eng-mcq", short: "eng-short", mock: "eng-mock" },
  sanskrit: { mcq: "skt-mcq", short: "skt-short", mock: "skt-mock" },
};

const SUBJ_HEX: Record<string, string> = {
  chem: "var(--color-chem)",
  bio: "var(--color-bio)",
  phy: "var(--color-phy)",
  hist: "var(--color-hist)",
  geo: "var(--color-geo)",
  polsci: "var(--color-polsci)",
  eco: "var(--color-eco)",
};

const SUBJ_LABEL: Record<string, string> = {
  chem: "Chemistry",
  bio: "Biology",
  phy: "Physics",
  hist: "History",
  geo: "Geography",
  polsci: "Pol. Sci.",
  eco: "Economics",
};

const SUBJ_EMOJI: Record<string, string> = {
  chem: "🧪", bio: "🧬", phy: "⚡", hist: "🏛️", geo: "🌍", polsci: "⚖️", eco: "💰",
};

const DIFF_HEX: Record<DiffTier, string> = {
  easy: "#34d399",
  medium: "#fbbf24",
  hard: "#fb7185",
};

function Ring({ pct, color, label, sub, emoji }: { pct: number; color: string; label: string; sub?: string; emoji?: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="92" height="92" viewBox="0 0 92 92" className="-rotate-90">
          <circle cx="46" cy="46" r={r} fill="none" stroke="currentColor" strokeWidth="7" className="text-muted/40" />
          <circle
            cx="46"
            cy="46"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-700"
            style={{ filter: "drop-shadow(0 0 4px color-mix(in oklch, " + color + " 40%, transparent))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {emoji && <span className="text-base leading-none">{emoji}</span>}
          <span className="text-lg font-bold tabular-nums">{clamped}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function last35Days(): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const now = new Date();
  for (let i = 34; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
    });
  }
  return days;
}

function heatClass(mins: number): string {
  if (!mins || mins <= 0) return "bg-muted/40";
  if (mins <= 15) return "bg-primary/30";
  if (mins <= 30) return "bg-primary/60";
  return "bg-primary";
}

function pct(correct: number, attempted: number): number {
  return attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
}

export function AnalyticsView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);
  const setView = useStudyStore((s) => s.setView);

  // Science state (top-level fields)
  const sTotalCorrect = useStudyStore((s) => s.totalCorrect);
  const sTotalAnswered = useStudyStore((s) => s.totalAnswered);
  const sBestStreak = useStudyStore((s) => s.bestStreak);
  const chemCorrect = useStudyStore((s) => s.chemCorrect);
  const chemAttempted = useStudyStore((s) => s.chemAttempted);
  const bioCorrect = useStudyStore((s) => s.bioCorrect);
  const bioAttempted = useStudyStore((s) => s.bioAttempted);
  const phyCorrect = useStudyStore((s) => s.phyCorrect);
  const phyAttempted = useStudyStore((s) => s.phyAttempted);
  const chStats = useStudyStore((s) => s.chStats);

  // SSC state (dedicated slice)
  const ssc = useStudyStore((s) => s.ssc);
  // Maths/English/Sanskrit (generic subjectStats map)
  const subjectStats = useStudyStore((s) => s.subjectStats);

  // Difficulty accuracy — one shared shape across all 5 tracks.
  const diffStats = useStudyStore((s) => s.diffStats[track]);

  // Shared state
  const heatmap = useStudyStore((s) => s.heatmap);
  const pomoMins = useStudyStore((s) => s.pomoMins);
  const pomoSessions = useStudyStore((s) => s.pomoSessions);

  // ===== Mastery Engine inputs =====
  const chapterStatsByTrack = useStudyStore((s) => s.chapterStats[track]);
  const recallStatsByTrack = useStudyStore((s) => s.recallStats[track]);
  const mockHistoryAll = useStudyStore((s) => s.mockHistory);
  const mistakesAll = useStudyStore((s) => s.mistakes);
  const openedChaptersScience = useStudyStore((s) => s.openedChapters);


  const isScience = track === "science";
  const isSsc = track === "ssc";
  const generic = !isScience && !isSsc; // maths / english / sanskrit
  const genericStats = subjectStats[track];

  const totalCorrect = isScience ? sTotalCorrect : isSsc ? ssc.totalCorrect : (genericStats?.totalCorrect ?? 0);
  const totalAnswered = isScience ? sTotalAnswered : isSsc ? ssc.totalAnswered : (genericStats?.totalAnswered ?? 0);
  const bestStreak = isScience ? sBestStreak : isSsc ? ssc.bestStreak : (genericStats?.bestStreak ?? 0);
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const accuracyPct = Math.round(accuracy * 100);

  const scienceSubjects = [
    { subj: "chem", correct: chemCorrect, attempted: chemAttempted },
    { subj: "bio", correct: bioCorrect, attempted: bioAttempted },
    { subj: "phy", correct: phyCorrect, attempted: phyAttempted },
  ];
  const sscSubjects = [
    { subj: "hist", correct: ssc.histCorrect, attempted: ssc.histAnswered },
    { subj: "geo", correct: ssc.geoCorrect, attempted: ssc.geoAnswered },
    { subj: "polsci", correct: ssc.polsciCorrect, attempted: ssc.polsciAnswered },
    { subj: "eco", correct: ssc.ecoCorrect, attempted: ssc.ecoAnswered },
  ];
  // Only Science and SSC split into sub-subjects — Maths/English/Sanskrit
  // don't, so there's nothing meaningful to show here for them (the
  // difficulty-breakdown card below is their equivalent "where am I
  // strong/weak" view).
  const subjects = isScience ? scienceSubjects : isSsc ? sscSubjects : [];

  const trackChapters = generic ? getTrackChapters(track) : [];

  // ===== Exam Readiness Index + Chapter Mastery Map =====
  // Built from real evidence (chapterStats/recallStats/mockHistory/
  // mistakes) already sitting in the store — see lib/mastery-engine.ts for
  // why this replaces the old accuracy×0.95 predictor.
  const openedChaptersCount = isScience ? openedChaptersScience.length : (genericStats?.openedChapters?.length ?? ssc.openedChapters.length);
  const allChaptersForTrack = useMemo(() => getTrackChapters(track), [track]);
  const questionCountByChapter = useMemo(() => {
    const counts: Record<number, number> = {};
    const mcqs = getAllTrackMcqs(track);
    allChaptersForTrack.forEach((c) => {
      const mcqCount = mcqs.filter((m) => m.ch === c.id).length;
      const shortCount = getTrackShortQa(track, c.id).length;
      const longCount = getTrackLongQa(track, c.id).length;
      counts[c.id] = mcqCount + shortCount + longCount || 1;
    });
    return counts;
  }, [track, allChaptersForTrack]);
  const chapterMastery = useMemo(
    () => computeChapterMastery(allChaptersForTrack, chapterStatsByTrack ?? {}, questionCountByChapter, recallStatsByTrack ?? {}),
    [allChaptersForTrack, chapterStatsByTrack, questionCountByChapter, recallStatsByTrack]
  );
  const readiness = useMemo(
    () => computeReadiness({
      chapters: chapterMastery,
      diffStats,
      recallStats: recallStatsByTrack ?? {},
      mockHistory: mockHistoryAll.filter((m) => m.track === track),
      mistakes: mistakesAll.filter((m) => m.track === track),
      totalAttempted: totalAnswered,
      openedChapters: openedChaptersCount,
      totalChapters: allChaptersForTrack.length,
    }),
    [chapterMastery, diffStats, recallStatsByTrack, mockHistoryAll, mistakesAll, track, totalAnswered, openedChaptersCount, allChaptersForTrack.length]
  );

  // ===== Progress History / Mastery Streak =====
  const recordReadinessSnapshot = useStudyStore((s) => s.recordReadinessSnapshot);
  const readinessHistoryByTrack = useStudyStore((s) => s.readinessHistory[track]);
  useEffect(() => {
    if (readiness.readinessPct !== null) recordReadinessSnapshot(track, readiness.readinessPct);
  }, [readiness.readinessPct, track, recordReadinessSnapshot]);
  const masteryStreak = useMemo(() => computeMasteryStreak(readinessHistoryByTrack ?? []), [readinessHistoryByTrack]);

  const recoverList = useMemo(() => recoverMyMarks(chapterMastery, 4), [chapterMastery]);
  const dangerZone = useMemo(() => computeDangerZone(chapterMastery), [chapterMastery]);
  const neglectedList = useMemo(() => neglectedChapters(chapterMastery), [chapterMastery]);
  const confusionPairs = useMemo(
    () => computeConfusionPairs(mistakesAll.filter((m) => m.track === track)),
    [mistakesAll, track]
  );
  const confidenceStatsByTrack = useStudyStore((s) => s.confidenceStats[track]);
  const calibration = useMemo(() => computeCalibration(confidenceStatsByTrack), [confidenceStatsByTrack]);
  const pyqStatsByTrack = useStudyStore((s) => s.pyqStats[track]);

  // ===== Rapid Revision Modes =====
  const [revisionMode, setRevisionMode] = useState<RevisionMode>("15min");
  const [openOneSheet, setOpenOneSheet] = useState<number | null>(null);
  useEffect(() => setOpenOneSheet(null), [track]);
  const revisionPlan = useMemo(
    () => generateRevisionPlan(revisionMode, chapterMastery, mistakesAll.filter((m) => m.track === track).length, {
      ...TRACK_VIEWS[track], mistakes: "mistakes", review: "review",
    }),
    [revisionMode, chapterMastery, mistakesAll, track]
  );

  const days = mounted ? last35Days() : [];
  const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const weeks: { date: string; label: string }[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Analytics 📊</h1>
        <p className="text-sm text-muted-foreground">Track your mastery, study patterns, and projected board performance.</p>
      </header>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="gap-1.5">
          <span>{SUBJECT_META[track].icon}</span>
          Showing: {SUBJECT_META[track].label}
        </Badge>
        <span className="text-xs text-muted-foreground">Switch tracks from the sidebar to see the others.</span>
      </div>

      {/* Top row: Mastery rings (science/ssc) or Difficulty rings (generic) + Score predictor */}
      <div className="grid lg:grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          <Card className="glass lg:col-span-2 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="size-4 text-primary" /> Mastery Rings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                {subjects.map((s) => (
                  <Ring
                    key={s.subj}
                    pct={pct(s.correct, s.attempted)}
                    color={SUBJ_HEX[s.subj]}
                    emoji={SUBJ_EMOJI[s.subj]}
                    label={SUBJ_LABEL[s.subj]}
                    sub={`${s.correct}/${s.attempted}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Per-subject accuracy across all answered MCQs.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass lg:col-span-2 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><Layers className="size-4 text-primary" /> Accuracy by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-2">
                {DIFF_TIERS.map((tier) => {
                  const d = diffStats[tier];
                  return (
                    <Ring
                      key={tier}
                      pct={pct(d.correct, d.attempted)}
                      color={DIFF_HEX[tier]}
                      label={tierMeta(tier).label}
                      sub={`${d.correct}/${d.attempted}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {SUBJECT_META[track].label} doesn&apos;t split into sub-subjects, so this is your clearest mastery view — it&apos;s also what the Adaptive quiz mode uses to pick your next question.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Exam Readiness Index — replaces the old accuracy×0.95 predictor
            with a transparent, multi-factor breakdown. See
            lib/mastery-engine.ts for the scoring logic. */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Gauge className="size-4 text-foreground" /> Exam Readiness</CardTitle>
            <p className="text-xs text-muted-foreground">Raw MCQ accuracy: {accuracyPct}% · readiness below weighs in a lot more than that.</p>
          </CardHeader>
          <CardContent>
            {readiness.readinessPct !== null ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Ring pct={readiness.readinessPct} color="var(--foreground)" label="" />
                  <div>
                    <div className="text-3xl font-bold tabular-nums">{readiness.readinessPct}<span className="text-base text-muted-foreground">%</span></div>
                    {readiness.band && (
                      <div className="text-xs text-muted-foreground">Estimated safe band: {readiness.band[0]}–{readiness.band[1]}%</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  {readiness.components.map((c) => (
                    <div key={c.key} title={c.note}>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-muted-foreground">{c.label}</span>
                        <span className="tabular-nums text-muted-foreground">{c.score === null ? "no data" : `${c.score}%`}</span>
                      </div>
                      <Progress value={c.score ?? 0} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Components with &quot;no data&quot; are left out of the average rather than counted as zero — the wider your evidence, the tighter the band above.
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="text-4xl">🎯</div>
                <p className="text-sm text-muted-foreground">Answer some MCQs, write a few short answers, or save a mock test to unlock your Exam Readiness Index.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress History / Mastery Streak */}
      {readinessHistoryByTrack && readinessHistoryByTrack.length >= 2 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">📈 Progress History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">Daily Exam Readiness snapshots — last {Math.min(readinessHistoryByTrack.length, 14)} days</p>
              {masteryStreak >= 2 && (
                <Badge variant="outline" className="text-amber-400 border-amber-400/30">🔥 {masteryStreak}-day mastery streak</Badge>
              )}
            </div>
            <div className="flex items-end gap-1 h-20">
              {readinessHistoryByTrack.slice(-14).map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" title={`${h.date}: ${h.pct}%`}>
                  <div className="w-full rounded-t bg-foreground/70" style={{ height: `${Math.max(4, h.pct)}%` }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recover My Marks — the weakest chapters ranked by estimated marks
          at stake, not just raw accuracy. */}
      {recoverList.length > 0 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="size-4 text-foreground" /> Recover My Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Ranked by estimated marks at stake (assuming an 80-mark paper) — biggest opportunity first, not just lowest accuracy.
            </p>
            <div className="space-y-2">
              {recoverList.map((c) => {
                const tierMeta_ = MASTERY_TIER_META[c.tier];
                return (
                  <div key={c.chapterId} className="flex items-center justify-between gap-3 rounded-lg border border-border p-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">Ch {c.num}: {c.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.attempted === 0 ? "Not attempted yet" : `${c.masteryPct}% mastery · ${c.attempted} attempted`}
                      </div>
                    </div>
                    <Badge variant="outline" style={{ borderColor: tierMeta_.color + "55", color: tierMeta_.color }}>
                      {tierMeta_.label}
                    </Badge>
                    <div className="text-sm font-bold tabular-nums shrink-0">−{c.estMarksAtStake}m</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone — coarser, scannable risk buckets over the same
          mastery data (review doc's "live risk list"). */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">🚦 Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {(["danger", "watch", "safe"] as const).map((level) => {
              const meta = DANGER_LEVEL_META[level];
              const list = dangerZone[level];
              return (
                <div key={level} className="rounded-lg border border-border p-3">
                  <div className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: meta.color }}>
                    {meta.icon} {meta.label} <span className="text-muted-foreground font-normal">({list.length})</span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto scroll-thin pr-1">
                    {list.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nothing here.</p>
                    ) : list.slice(0, 8).map((c) => (
                      <div key={c.chapterId} className="text-xs truncate text-muted-foreground">Ch {c.num}: {c.title}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Confusion Pairs — concepts recurringly mixed up, detected purely
          from wrong-answer vs. correct-answer text already in the mistake
          log (no new tagging required). */}
      {confusionPairs.length > 0 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">🔀 Confusion Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Concepts you keep mixing up, detected from your mistake log.</p>
            <div className="space-y-2">
              {confusionPairs.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 text-sm">
                  <span className="truncate"><span className="font-medium">{p.a}</span> <span className="text-muted-foreground">vs</span> <span className="font-medium">{p.b}</span></span>
                  <Badge variant="outline" className="shrink-0">×{p.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Calibration */}
      {calibration.levels.some((l) => l.accuracy !== null) && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Gauge className="size-4 text-foreground" /> Confidence Calibration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {calibration.levels.map((l) => (
                <div key={l.level} className="rounded-lg border border-border p-2.5 text-center">
                  <div className="text-xs text-muted-foreground capitalize mb-1">{l.level} confidence</div>
                  <div className="text-xl font-bold tabular-nums">{l.accuracy === null ? "—" : `${l.accuracy}%`}</div>
                  <div className="text-[10px] text-muted-foreground">{l.total} rated</div>
                </div>
              ))}
            </div>
            {calibration.insight && (
              <p className="text-xs rounded-lg border border-border p-2.5 text-muted-foreground">{calibration.insight}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* PYQ Performance — accuracy specifically on board-exam-pattern
          (Previous Year Question style) items, tracked separately from
          overall MCQ accuracy since these are the highest-signal questions
          for what the actual exam looks like. */}
      {pyqStatsByTrack && pyqStatsByTrack.attempted >= 3 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">📄 PYQ Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold tabular-nums">
                {Math.round((pyqStatsByTrack.correct / pyqStatsByTrack.attempted) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {pyqStatsByTrack.correct}/{pyqStatsByTrack.attempted} correct on board-exam-pattern questions. Filter by PYQ in MCQ Practice to drill these specifically.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rapid Revision Modes */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">⏱️ Rapid Revision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {REVISION_MODES.map((m) => {
              const meta = REVISION_MODE_META[m];
              return (
                <Button
                  key={m}
                  size="sm"
                  variant={revisionMode === m ? "default" : "outline"}
                  onClick={() => setRevisionMode(m)}
                  className="h-8"
                >
                  {meta.icon} {meta.label}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mb-3">{revisionPlan.note}</p>
          <ul className="space-y-1.5">
            {revisionPlan.tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 text-sm rounded-lg border border-border/60 px-3 py-1.5">
                <span className="flex items-center gap-2 min-w-0">
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground tabular-nums">{t.minutes} min</span>
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs" onClick={() => setView(t.view as ViewId)}>Start</Button>
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* NCERT Neglected — chapters drilled via MCQ but never recall-tested */}
      {neglectedList.length > 0 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">🕳️ Neglected Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              You&apos;ve practiced these chapters through MCQs, but never once tested yourself with a written short/long answer — that&apos;s a different skill, and MCQ streaks can hide the gap.
            </p>
            <div className="space-y-2">
              {neglectedList.slice(0, 5).map((c) => (
                <div key={c.chapterId} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2.5 text-sm">
                  <span className="truncate">Ch {c.num}: {c.title}</span>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">{c.attempted} MCQs · 0 recall</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Mastery Map */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2"><Layers className="size-4 text-foreground" /> Chapter Mastery Map</CardTitle>
          <p className="text-xs text-muted-foreground">Tap 📋 on any chapter for a One Sheet — key answer points, essay topics, and PYQ count, compiled from your question bank.</p>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-2">
            {chapterMastery.map((c) => {
              const tierMeta_ = MASTERY_TIER_META[c.tier];
              const isOpen = openOneSheet === c.chapterId;
              const sheet = isOpen ? buildOneSheet(track, c.chapterId, c.title, extractKeyPoints) : null;
              return (
                <div key={c.chapterId} className={isOpen ? "sm:col-span-2" : ""}>
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 text-sm" title={c.trueMastery ? "Mastered: strong MCQ accuracy AND strong recall performance" : undefined}>
                    <span className="truncate flex-1" title={c.title}>{c.trueMastery && "✅ "}Ch {c.num}: {c.title}</span>
                    <span className="text-xs text-muted-foreground tabular-nums shrink-0">{c.masteryPct === null ? "—" : `${c.masteryPct}%`}</span>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px]"
                      style={{ borderColor: tierMeta_.color + "55", color: tierMeta_.color }}
                    >
                      {tierMeta_.label}
                    </Badge>
                    <button
                      onClick={() => setOpenOneSheet(isOpen ? null : c.chapterId)}
                      className="shrink-0 text-xs rounded px-1.5 py-0.5 border border-border hover:border-foreground/40"
                      title="One Sheet"
                      aria-label={`One Sheet for Ch ${c.num}`}
                    >
                      📋
                    </button>
                  </div>
                  {isOpen && sheet && (
                    <div className="mt-1.5 rounded-lg border border-border/60 p-3 space-y-3 text-sm animate-float-up">
                      {sheet.quickFacts.length > 0 ? (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Key answers</p>
                          <div className="space-y-2">
                            {sheet.quickFacts.map((qa, i) => (
                              <div key={i}>
                                <p className="font-medium text-xs">{qa.q} <span className="text-muted-foreground">({qa.marks}m)</span></p>
                                <ul className="list-disc pl-4 text-xs text-muted-foreground">
                                  {qa.points.map((p, j) => <li key={j}>{p}</li>)}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No short-answer content tagged to this chapter yet.</p>
                      )}
                      {sheet.essayTopics.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Must-know essay topics</p>
                          <ul className="list-disc pl-4 text-xs text-muted-foreground">
                            {sheet.essayTopics.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      )}
                      <p className="text-[11px] text-muted-foreground">{sheet.pyqCount} of {sheet.totalQuestions} questions in this chapter are board-exam-pattern (PYQ).</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Accuracy by Difficulty — shown as its own card for Science/SSC too,
          since they already got the sub-subject rings above. */}
      {subjects.length > 0 && (
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Layers className="size-4 text-primary" /> Accuracy by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 py-2 max-w-md">
              {DIFF_TIERS.map((tier) => {
                const d = diffStats[tier];
                return (
                  <Ring
                    key={tier}
                    pct={pct(d.correct, d.attempted)}
                    color={DIFF_HEX[tier]}
                    label={tierMeta(tier).label}
                    sub={`${d.correct}/${d.attempted}`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is what the ⚡ Adaptive quiz mode uses to decide whether to serve you easier or harder questions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Heatmap + Study time */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> Study Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 pt-0.5">
                {weekdayLabels.map((d, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground h-4 leading-4">{d}</span>
                ))}
              </div>
              <div className="flex-1 space-y-1 overflow-x-auto scroll-thin">
                {weeks.map((week, wi) => (
                  <div key={wi} className="grid grid-cols-7 gap-1">
                    {week.map((day) => {
                      const mins = mounted ? heatmap[day.date] || 0 : 0;
                      return (
                        <div
                          key={day.date}
                          title={`${day.date} · ${mins} min`}
                          className={`aspect-square rounded ${heatClass(mins)} transition-colors`}
                        />
                      );
                    })}
                  </div>
                ))}
                </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>{days[0]?.date} → {days[days.length - 1]?.date}</span>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="size-3 rounded bg-muted/40" />
                <span className="size-3 rounded bg-primary/30" />
                <span className="size-3 rounded bg-primary/60" />
                <span className="size-3 rounded bg-primary" />
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Time */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="size-4 text-primary" /> Study Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-primary tabular-nums">{fmtMins(pomoMins)}</span>
              <span className="text-muted-foreground mb-1 text-sm">focused</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" /> Sessions</div>
                <div className="text-xl font-bold tabular-nums">{pomoSessions}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="size-3" /> Best Streak</div>
                <div className="text-xl font-bold tabular-nums">{bestStreak}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Pomodoro minutes tracked across all 5 subjects.</p>
          </CardContent>
        </Card>
      </div>

      {/* Chapter-wise accuracy */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="size-4 text-primary" /> Chapter-wise Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          {isScience ? (
            <ScrollArea className="max-h-96 pr-3 scroll-thin">
              <ul className="space-y-2.5">
                {(CHAPTERS as Chapter[]).map((ch) => {
                  const cs = chStats[ch.id] || { correct: 0, attempted: 0 };
                  const p = pct(cs.correct, cs.attempted);
                  return (
                    <li key={ch.id} className={`subj-${ch.subj}`}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium truncate max-w-[70%]">
                          <span className="text-muted-foreground mr-1.5">{ch.num}</span>
                          {ch.title}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                          {cs.attempted > 0 ? (
                            <><span className="text-subj font-semibold">{p}%</span> · {cs.correct}/{cs.attempted}</>
                          ) : (
                            <span className="text-muted-foreground/60">Not attempted</span>
                          )}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${p}%`, backgroundColor: "var(--sc)" }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          ) : isSsc ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-border bg-card/40 p-3 text-sm text-muted-foreground flex items-center gap-2">
                <Award className="size-4 text-primary shrink-0" />
                <span>SSC tracks accuracy per subject. Answer more MCQs to build chapter-level insight.</span>
              </div>
              <ul className="space-y-3">
                {sscSubjects.map((s) => {
                  const p = pct(s.correct, s.attempted);
                  return (
                    <li key={s.subj} className={`subj-${s.subj}`}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium flex items-center gap-2">
                          <span>{SUBJ_EMOJI[s.subj]}</span>
                          {SUBJ_LABEL[s.subj]}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {s.attempted > 0 ? (
                            <><span className="text-subj font-semibold">{p}%</span> · {s.correct}/{s.attempted}</>
                          ) : (
                            <span className="text-muted-foreground/60">No data</span>
                          )}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${p}%`, backgroundColor: "var(--sc)" }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <ScrollArea className="max-h-72 pr-3 scroll-thin mt-3">
                <ul className="space-y-1.5 text-xs">
                  {(SSC_CHAPTERS as SscChapter[]).map((ch) => (
                    <li key={ch.id} className="flex items-center gap-2 text-muted-foreground">
                      <span className={`subj-${ch.subj} text-subj font-semibold w-12`}>{ch.num}</span>
                      <span className="truncate">{ch.title}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-dashed border-border bg-card/40 p-3 text-sm text-muted-foreground flex items-center gap-2">
                <Award className="size-4 text-primary shrink-0" />
                <span>{SUBJECT_META[track].label} doesn&apos;t track accuracy per chapter yet — the difficulty breakdown above is the closest equivalent. Here&apos;s the chapter list for reference.</span>
              </div>
              <ScrollArea className="max-h-96 pr-3 scroll-thin">
                <ul className="space-y-1.5 text-sm">
                  {trackChapters.map((ch) => (
                    <li key={ch.id} className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-semibold w-10 shrink-0" style={{ color: SUBJECT_META[track].accent }}>{ch.num}</span>
                      <span className="truncate text-foreground/90">{ch.title}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
