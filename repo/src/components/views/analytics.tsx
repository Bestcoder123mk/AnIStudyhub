"use client";

import { useStudyStore } from "@/store/use-study-store";
import { CHAPTERS, SSC_CHAPTERS, type Chapter, type SscChapter } from "@/lib/study-data";
import { fmtMins, useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CalendarDays, Target, Clock, Flame, TrendingUp, Award } from "lucide-react";

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

  // Science state
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

  // SSC state
  const ssc = useStudyStore((s) => s.ssc);

  // Shared state
  const heatmap = useStudyStore((s) => s.heatmap);
  const pomoMins = useStudyStore((s) => s.pomoMins);
  const pomoSessions = useStudyStore((s) => s.pomoSessions);

  const isScience = track === "science";
  const totalCorrect = isScience ? sTotalCorrect : ssc.totalCorrect;
  const totalAnswered = isScience ? sTotalAnswered : ssc.totalAnswered;
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const accuracyPct = Math.round(accuracy * 100);
  const predictedScore = totalAnswered > 0 ? Math.round(accuracy * 0.95 * 100) : 0;

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
  const subjects = isScience ? scienceSubjects : sscSubjects;

  const days = mounted ? last35Days() : [];
  const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  // Group 35 days into 5 rows of 7
  const weeks: { date: string; label: string }[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Analytics 📊</h1>
        <p className="text-sm text-muted-foreground">Track your mastery, study patterns, and projected board performance.</p>
      </header>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          Showing: {isScience ? "Science" : "Social Science"}
        </Badge>
        <span className="text-xs text-muted-foreground">Switch tracks from the sidebar to see the other side.</span>
      </div>

      {/* Top row: Mastery rings + Score predictor */}
      <div className="grid lg:grid-cols-3 gap-4">
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

        {/* Score Predictor */}
        <Card className="glass rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="size-4 text-primary" /> Score Predictor</CardTitle>
          </CardHeader>
          <CardContent>
            {totalAnswered > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Ring pct={predictedScore} color="var(--primary, oklch(0.7 0.16 280))" label="" />
                <div className="text-center -mt-1">
                  <div className="text-3xl font-bold text-primary tabular-nums">{predictedScore}<span className="text-base text-muted-foreground">/100</span></div>
                  <div className="text-xs text-muted-foreground mt-1">Projected board score</div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Based on <span className="font-semibold text-foreground">{totalAnswered}</span> answers · {accuracyPct}% accuracy × 0.95 confidence factor
                </p>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="text-4xl">🎯</div>
                <p className="text-sm text-muted-foreground">Answer a few MCQs to unlock your projected board score.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                <div className="text-xl font-bold tabular-nums">{isScience ? sBestStreak : ssc.bestStreak}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Pomodoro minutes tracked across both tracks.</p>
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
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
