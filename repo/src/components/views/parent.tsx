"use client";

import { useMemo } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted, fmtMins } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  HeartHandshake, Zap, ListChecks, Target, Clock, Flame, TrendingUp,
  BarChart3, Lightbulb, Award, AlertCircle, BookOpen, Info,
} from "lucide-react";

/* ---------- helpers ---------- */
function xpForTrack(s: { totalXp: number; ssc: { totalXp: number }; subjectStats: Record<string, { totalXp: number }> }, t: Track): number {
  if (t === "science") return s.totalXp;
  if (t === "ssc") return s.ssc.totalXp;
  return s.subjectStats[t]?.totalXp ?? 0;
}

/* ---------- weekly activity ---------- */
function last7Days(): { date: string; label: string; short: string }[] {
  const out: { date: string; label: string; short: string }[] = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({ date: iso, label: days[d.getDay()], short: String(d.getDate()) });
  }
  return out;
}

/* ---------- main view ---------- */
export function ParentView() {
  const mounted = useMounted();
  const _totalXp = useStudyStore((s) => s.totalXp);
  const _sscXp = useStudyStore((s) => s.ssc.totalXp);
  const _subjectStats = useStudyStore((s) => s.subjectStats);
  const _totalAnswered = useStudyStore((s) => s.totalAnswered);
  const _totalCorrect = useStudyStore((s) => s.totalCorrect);
  const _pomoMins = useStudyStore((s) => s.pomoMins);
  const _pomoSessions = useStudyStore((s) => s.pomoSessions);
  const _bestStreak = useStudyStore((s) => s.bestStreak);
  const _currentStreak = useStudyStore((s) => s.currentStreak);
  const _level = useStudyStore((s) => s.level);
  const _mistakes = useStudyStore((s) => s.mistakes);
  const _heatmap = useStudyStore((s) => s.heatmap);
  const store = { totalXp: _totalXp, ssc: { totalXp: _sscXp }, subjectStats: _subjectStats, totalAnswered: _totalAnswered, totalCorrect: _totalCorrect, pomoMins: _pomoMins, pomoSessions: _pomoSessions, bestStreak: _bestStreak, currentStreak: _currentStreak, level: _level, mistakes: _mistakes, heatmap: _heatmap };

  const tracks: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
  const trackXps = tracks.map((t) => ({ t, xp: xpForTrack(store, t) }));
  const sortedTracks = [...trackXps].sort((a, b) => b.xp - a.xp);
  const strongest = sortedTracks[0];
  const weakest = sortedTracks[sortedTracks.length - 1];
  const totalXp = trackXps.reduce((s, x) => s + x.xp, 0);
  const accuracy = store.totalAnswered > 0
    ? Math.round((store.totalCorrect / store.totalAnswered) * 100)
    : 0;

  // weekly activity from heatmap (last 7 days)
  const week = useMemo(() => {
    const days = last7Days();
    return days.map((d) => ({
      ...d,
      count: store.heatmap[d.date] ?? 0,
    }));
  }, [store.heatmap]);
  const maxWeek = Math.max(1, ...week.map((d) => d.count));

  // mistakes by subject
  const mistakesBySubject = useMemo(() => {
    const map: Record<string, number> = {};
    store.mistakes.forEach((m) => {
      map[m.track] = (map[m.track] ?? 0) + 1;
    });
    return map;
  }, [store.mistakes]);
  const mistakeEntries = (Object.entries(mistakesBySubject) as [Track, number][]).sort((a, b) => b[1] - a[1]);
  const topMistakeSubject = mistakeEntries[0]?.[0];

  // recommendations
  const recommendations: string[] = [];
  if (weakest && weakest.xp < strongest.xp * 0.5 && weakest.xp >= 0) {
    recommendations.push(`Focus more on ${SUBJECT_META[weakest.t].label} — it's lagging behind your strongest subject.`);
  } else {
    recommendations.push(`Keep your practice balanced across all 5 subjects.`);
  }
  if (store.currentStreak === 0) {
    recommendations.push(`Start a new study streak today — even 15 minutes counts.`);
  } else {
    recommendations.push(`Maintain your ${store.currentStreak}-day streak — don't break the chain!`);
  }
  if (store.totalAnswered < 50) {
    recommendations.push(`Try a mock test this week to build exam confidence.`);
  } else if (accuracy < 70) {
    recommendations.push(`Your accuracy is ${accuracy}% — review your mistakes bank and revise weak topics.`);
  } else {
    recommendations.push(`Great accuracy (${accuracy}%)! Challenge yourself with harder mock tests this week.`);
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/30 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
          <div className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <HeartHandshake className="size-7 text-pink-400" />
          Parent Dashboard <span aria-hidden>👨‍👩‍👧</span>
        </h1>
        <p className="text-sm text-muted-foreground">Weekly progress digest</p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <SummaryCard icon={<Zap className="size-4" />} label="Total XP" value={totalXp.toLocaleString()} tone="amber" />
        <SummaryCard icon={<ListChecks className="size-4" />} label="Questions answered" value={String(store.totalAnswered)} tone="violet" />
        <SummaryCard icon={<Target className="size-4" />} label="Accuracy" value={`${accuracy}%`} tone="emerald" />
        <SummaryCard icon={<Clock className="size-4" />} label="Study time" value={fmtMins(store.pomoMins)} sub={`${store.pomoSessions} sessions`} tone="cyan" />
        <SummaryCard icon={<Flame className="size-4" />} label="Best streak" value={`${store.bestStreak} d`} sub={`current: ${store.currentStreak} d`} tone="rose" />
        <SummaryCard icon={<Award className="size-4" />} label="Current level" value={`Lv ${store.level}`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly activity */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="size-4" /> Weekly activity
            </CardTitle>
            <CardDescription>Study actions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40 px-1">
              {week.map((d) => {
                const h = (d.count / maxWeek) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="text-[10px] tabular-nums text-muted-foreground">{d.count}</div>
                    <div className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary/80 transition-all duration-500"
                      style={{ height: `${Math.max(4, h)}%`, minHeight: 4 }}
                    />
                    <div className="text-[10px] text-muted-foreground">{d.label}</div>
                    <div className="text-[9px] text-muted-foreground/70 tabular-nums">{d.short}</div>
                  </div>
                );
              })}
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-md bg-muted/40 p-2">
                <div className="text-muted-foreground">This week total</div>
                <div className="font-bold tabular-nums">{week.reduce((s, d) => s + d.count, 0)}</div>
              </div>
              <div className="rounded-md bg-muted/40 p-2">
                <div className="text-muted-foreground">Active days</div>
                <div className="font-bold tabular-nums">{week.filter((d) => d.count > 0).length} / 7</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject progress */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="size-4" /> Subject progress
            </CardTitle>
            <CardDescription>XP per subject (5 subjects)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedTracks.map(({ t, xp }) => {
              const max = Math.max(1, ...trackXps.map((x) => x.xp));
              const pct = Math.round((xp / max) * 100);
              return (
                <div key={t}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>{SUBJECT_META[t].icon}</span> {SUBJECT_META[t].label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: SUBJECT_META[t].accent }}
                    />
                  </div>
                </div>
              );
            })}
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 p-2">
                <div className="text-emerald-300 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide">
                  <TrendingUp className="size-3" /> Strength
                </div>
                <div className="font-bold mt-0.5 flex items-center justify-center gap-1">
                  <span>{SUBJECT_META[strongest.t].icon}</span> {SUBJECT_META[strongest.t].label}
                </div>
              </div>
              <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-2">
                <div className="text-rose-300 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide">
                  <AlertCircle className="size-3" /> Weakness
                </div>
                <div className="font-bold mt-0.5 flex items-center justify-center gap-1">
                  <span>{SUBJECT_META[weakest.t].icon}</span> {SUBJECT_META[weakest.t].label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mistakes summary */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-400" /> Mistakes summary
            </CardTitle>
            <CardDescription>Questions you've gotten wrong — useful for revision</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-3 text-center">
                <div className="text-3xl font-bold tabular-nums text-rose-300">{store.mistakes.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total mistakes</div>
              </div>
              <div className="rounded-md bg-muted/40 border p-3 text-center">
                {topMistakeSubject ? (
                  <>
                    <div className="text-2xl font-bold" style={{ color: SUBJECT_META[topMistakeSubject].accent }}>
                      {SUBJECT_META[topMistakeSubject].icon}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Most in</div>
                    <div className="text-xs font-medium mt-0.5">{SUBJECT_META[topMistakeSubject].label}</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl">🎉</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">No mistakes</div>
                    <div className="text-xs font-medium mt-0.5">Keep it up!</div>
                  </>
                )}
              </div>
            </div>
            {mistakeEntries.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Breakdown by subject</div>
                {mistakeEntries.map(([t, n]) => {
                  const max = mistakeEntries[0][1];
                  const pct = Math.round((n / max) * 100);
                  return (
                    <div key={t} className="flex items-center gap-2">
                      <span className="text-xs w-32 flex items-center gap-1.5 shrink-0">
                        <span>{SUBJECT_META[t].icon}</span> {SUBJECT_META[t].label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: SUBJECT_META[t].accent }}
                        />
                      </div>
                      <span className="text-xs tabular-nums w-6 text-right">{n}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-400" /> Recommendations
            </CardTitle>
            <CardDescription>3 auto-generated tips for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recommendations.map((r, i) => (
              <div key={i} className="rounded-lg border bg-muted/20 p-3 flex items-start gap-2">
                <span className="size-5 shrink-0 rounded-md bg-amber-400/15 text-amber-400 text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm whitespace-pre-wrap">{r}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Privacy note */}
      <div className="rounded-2xl glass border p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <Info className="size-4 shrink-0 text-cyan-400 mt-0.5" />
        <p className="whitespace-pre-wrap">
          This is a read-only view. Data is stored locally on the student&apos;s device — no information is uploaded to any server. Parents can review progress here together with the student. Clearing browser storage will reset this data.
        </p>
      </div>
    </div>
  );
}

/* ---------- summary card ---------- */
function SummaryCard({
  icon, label, value, sub, tone,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  tone: "amber" | "violet" | "emerald" | "cyan" | "rose";
}) {
  const toneMap = {
    amber: { wrap: "from-amber-500/10 to-amber-500/5 border-amber-500/30", text: "text-amber-400", chip: "bg-amber-500/15 text-amber-400" },
    violet: { wrap: "from-violet-500/10 to-violet-500/5 border-violet-500/30", text: "text-violet-400", chip: "bg-violet-500/15 text-violet-400" },
    emerald: { wrap: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/30", text: "text-emerald-400", chip: "bg-emerald-500/15 text-emerald-400" },
    cyan: { wrap: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/30", text: "text-cyan-400", chip: "bg-cyan-500/15 text-cyan-400" },
    rose: { wrap: "from-rose-500/10 to-rose-500/5 border-rose-500/30", text: "text-rose-400", chip: "bg-rose-500/15 text-rose-400" },
  }[tone];
  return (
    <div className={`glass rounded-2xl p-4 bg-gradient-to-br ${toneMap.wrap} border`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={`inline-flex size-6 items-center justify-center rounded-md ${toneMap.chip}`}>{icon}</span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${toneMap.text}`}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
