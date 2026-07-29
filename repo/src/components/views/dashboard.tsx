"use client";

import { useEffect, useState } from "react";
import { useStudyStore, type ViewId } from "@/store/use-study-store";
import { MCQS } from "@/lib/study-data";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { daysUntil, useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Trophy,
  Target,
  Flame,
  CalendarClock,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";

type Tone = "gold" | "emerald" | "sky" | "orange";

const TONE_CLASS: Record<Tone, { wrap: string; chip: string; text: string }> = {
  gold: { wrap: "from-amber-500/15 to-amber-500/5", chip: "bg-amber-500/15 text-amber-400", text: "text-amber-400" },
  emerald: { wrap: "from-emerald-500/15 to-emerald-500/5", chip: "bg-emerald-500/15 text-emerald-400", text: "text-emerald-400" },
  sky: { wrap: "from-sky-500/15 to-sky-500/5", chip: "bg-sky-500/15 text-sky-400", text: "text-sky-400" },
  orange: { wrap: "from-orange-500/15 to-orange-500/5", chip: "bg-orange-500/15 text-orange-400", text: "text-orange-400" },
};

/** Smooth eased count-up. Gated on `active` (post-hydration) so SSR output stays stable. */
function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function StatCard({
  icon,
  label,
  value,
  tone,
  mounted,
  suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: Tone;
  mounted: boolean;
  suffix?: string;
}) {
  const t = TONE_CLASS[tone];
  const shown = useCountUp(value, mounted);
  return (
    <div className={`tone-${tone} card-premium grain tap-lift rounded-2xl p-4 bg-gradient-to-br ${t.wrap} overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`inline-flex size-8 items-center justify-center rounded-full ${t.chip} shadow-elevate-1`}>{icon}</span>
      </div>
      <div className={`mt-2 text-2xl sm:text-3xl font-bold tabular-nums animate-numeral ${t.text}`}>
        {shown}
        {suffix}
      </div>
    </div>
  );
}

function SubjectRow({ subj, label, emoji, attempted, total }: { subj: string; label: string; emoji: string; attempted: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((attempted / total) * 100)) : 0;
  return (
    <div className={`subj-${subj} group`}>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium flex items-center gap-2">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-subj-dim text-sm transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
          <span>{label}</span>
        </span>
        <span className="text-muted-foreground tabular-nums">
          {attempted}/{total} · <span className="text-subj font-semibold">{pct}%</span>
        </span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MissionRow({ emoji, label, done, target }: { emoji: string; label: string; done: number; target: number }) {
  const pct = Math.min(100, Math.round((done / target) * 100));
  const complete = done >= target;
  return (
    <div className={complete ? "tone-emerald space-y-1.5" : "space-y-1.5"}>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span className={complete ? "" : "opacity-80"}>{emoji}</span>
          <span className={complete ? "line-through text-muted-foreground" : ""}>{label}</span>
        </span>
        <span className={`text-xs tabular-nums ${complete ? "text-emerald-400 font-medium" : "text-muted-foreground"}`}>
          {done}/{target} {complete && "✓"}
        </span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const QUICK_ACTIONS: { view: ViewId; emoji: string; label: string; tone: string }[] = [
  { view: "mcq", emoji: "🎯", label: "MCQ Quiz", tone: "chem" },
  { view: "flash", emoji: "⚡", label: "Flashcards", tone: "phy" },
  { view: "chapters", emoji: "📚", label: "Chapters", tone: "bio" },
  { view: "mock", emoji: "📝", label: "Mock Test", tone: "hist" },
  { view: "formulas", emoji: "🧮", label: "Formulas", tone: "geo" },
  { view: "museum", emoji: "🏛️", label: "3D Museum", tone: "polsci" },
  { view: "tutor", emoji: "🤖", label: "AI Tutor", tone: "eco" },
];

export function DashboardView() {
  const mounted = useMounted();

  const totalXp = useStudyStore((s) => s.totalXp);
  const totalCorrect = useStudyStore((s) => s.totalCorrect);
  const totalAnswered = useStudyStore((s) => s.totalAnswered);
  const bestStreak = useStudyStore((s) => s.bestStreak);
  const chemAttempted = useStudyStore((s) => s.chemAttempted);
  const bioAttempted = useStudyStore((s) => s.bioAttempted);
  const phyAttempted = useStudyStore((s) => s.phyAttempted);
  const examDate = useStudyStore((s) => s.examDate);
  const setExamDate = useStudyStore((s) => s.setExamDate);
  const setView = useStudyStore((s) => s.setView);
  const daily = useStudyStore((s) => s.daily);
  const goals = useStudyStore((s) => s.goals);
  const addGoal = useStudyStore((s) => s.addGoal);
  const toggleGoal = useStudyStore((s) => s.toggleGoal);
  const removeGoal = useStudyStore((s) => s.removeGoal);
  const unlockedAch = useStudyStore((s) => s.unlockedAch);

  const accuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const mcqCountBySubj = {
    chem: MCQS.filter((m) => m.subj === "chem").length,
    bio: MCQS.filter((m) => m.subj === "bio").length,
    phy: MCQS.filter((m) => m.subj === "phy").length,
  };

  const streakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(bestStreak, 7));

  const examDays = mounted && examDate ? daysUntil(examDate) : null;

  const missions = [
    { emoji: "🎯", label: "Solve 5 MCQs", done: Math.min(daily.mcqDone, 5), target: 5 },
    { emoji: "⚡", label: "Review 3 flashcards", done: Math.min(daily.flashDone, 3), target: 3 },
    { emoji: "📖", label: "Read 1 chapter", done: Math.min(daily.chapRead, 1), target: 1 },
  ];

  const recentAch = unlockedAch
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(-6)
    .reverse();

  const [goalText, setGoalText] = useState("");
  const [goalDue, setGoalDue] = useState("");

  const handleAddGoal = () => {
    if (!goalText.trim()) return;
    addGoal(goalText.trim(), goalDue);
    setGoalText("");
    setGoalDue("");
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-3xl border border-border/60 p-6 sm:p-8 animate-rise">
        <div className="ambient-orb tone-sky size-56 -top-20 -left-10 bg-[var(--sc)]" />
        <div className="ambient-orb tone-emerald size-64 -bottom-24 -right-16 bg-[var(--sc)]" />
        <div className="spotlight absolute inset-0" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            <Sparkles className="size-3 text-primary" /> Adaptive · Spaced Repetition · v7
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient-primary">Welcome back, Scholar! 🚀</h1>
          <p className="text-sm text-muted-foreground max-w-md">Class 10 NCERT Science — pick up right where you left off, or dive into today&apos;s missions.</p>
        </div>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-rise stagger-1">
          <StatCard icon={<Zap className="size-4" />} label="Total XP" value={totalXp} tone="gold" mounted={mounted} />
        </div>
        <div className="animate-rise stagger-2">
          <StatCard icon={<Trophy className="size-4" />} label="Correct Answers" value={totalCorrect} tone="emerald" mounted={mounted} />
        </div>
        <div className="animate-rise stagger-3">
          <StatCard icon={<Target className="size-4" />} label="Accuracy" value={accuracyPct} tone="sky" mounted={mounted} suffix="%" />
        </div>
        <div className="animate-rise stagger-4">
          <StatCard icon={<Flame className="size-4" />} label="Best Streak" value={bestStreak} tone="orange" mounted={mounted} />
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Subject Progress */}
        <Card className="card-premium grain lg:col-span-2 rounded-2xl animate-rise stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <SubjectRow subj="chem" label="Chemistry" emoji="🧪" attempted={chemAttempted} total={mcqCountBySubj.chem} />
            <SubjectRow subj="bio" label="Biology" emoji="🧬" attempted={bioAttempted} total={mcqCountBySubj.bio} />
            <SubjectRow subj="phy" label="Physics" emoji="⚡" attempted={phyAttempted} total={mcqCountBySubj.phy} />
            <p className="text-xs text-muted-foreground pt-1">
              70 MCQs total across the Science track · keep grinding to complete each subject.
            </p>
          </CardContent>
        </Card>

        {/* Daily Streak */}
        <Card className="card-premium grain rounded-2xl animate-rise stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Flame className="size-4 text-orange-400" /> Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="tone-orange relative">
              <div className="spotlight absolute -inset-4 -z-10" />
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-orange-400 tabular-nums drop-shadow-[0_0_18px_color-mix(in_oklch,var(--sc)_50%,transparent)]">{bestStreak}</span>
                <span className="text-muted-foreground mb-1.5 text-sm">day best</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {streakDots.map((on, i) => (
                <span
                  key={i}
                  className={`size-6 rounded-full grid place-items-center text-[10px] transition-all duration-300 ${
                    on ? "tone-orange bg-[var(--sc)] text-white shadow-[0_0_10px_var(--sc)]" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">7-day rolling window · keep the streak alive!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Exam Countdown */}
        <Card className="card-premium grain rounded-2xl animate-rise stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarClock className="size-4 text-primary" /> Exam Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && examDays !== null ? (
              <div className="relative space-y-2">
                <div className="spotlight absolute -inset-4 -z-10" />
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold tabular-nums text-gradient-primary">{examDays}</span>
                  <span className="text-muted-foreground mb-1.5 text-sm">days to go</span>
                </div>
                <p className="text-xs text-muted-foreground">Target: {new Date(examDate + "T00:00:00").toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                <Button variant="outline" size="sm" className="tap-lift mt-2" onClick={() => setExamDate("")}>
                  Change date
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Set your board exam date to start the countdown.</p>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="bg-background"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Missions */}
        <Card className="card-premium grain rounded-2xl animate-rise stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Target className="size-4 text-primary" /> Today&apos;s Missions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions.map((m) => (
              <MissionRow key={m.label} {...m} />
            ))}
            <p className="text-xs text-muted-foreground pt-1">Resets daily · complete all to earn bonus XP.</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-premium grain rounded-2xl animate-rise stagger-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Zap className="size-4 text-primary" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((qa, i) => (
                <button
                  key={qa.view}
                  onClick={() => setView(qa.view)}
                  className={`subj-${qa.tone} tap-lift glow-ring-hover group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/60 p-3 text-center animate-rise stagger-${Math.min(i + 1, 7)}`}
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{qa.emoji}</span>
                  <span className="text-[11px] font-medium leading-tight">{qa.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Goals */}
        <Card className="card-premium grain lg:col-span-2 rounded-2xl animate-rise stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Trophy className="size-4 text-primary" /> Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Add a study goal…"
                onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                className="bg-background flex-1"
              />
              <Input
                type="date"
                value={goalDue}
                onChange={(e) => setGoalDue(e.target.value)}
                className="bg-background sm:w-44"
              />
              <Button onClick={handleAddGoal} className="tap-lift shrink-0">
                <Plus className="size-4 mr-1" /> Add
              </Button>
            </div>

            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No goals yet. Add one above to start tracking.</p>
            ) : (
              <ScrollArea className="max-h-72 pr-3">
                <ul className="space-y-2">
                  {goals.map((g) => {
                    const overdue = mounted && g.due && !g.done && daysUntil(g.due) !== null && (daysUntil(g.due) as number) < 0;
                    return (
                      <li
                        key={g.id}
                        className={`${overdue ? "tone-rose glow-ring" : ""} tap-lift flex items-center gap-3 rounded-lg border border-border bg-card/50 p-2.5`}
                      >
                        <Checkbox checked={g.done} onCheckedChange={() => toggleGoal(g.id)} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${g.done ? "line-through text-muted-foreground" : ""}`}>{g.text}</div>
                          {g.due && (
                            <div className={`text-xs ${overdue ? "text-rose-400 font-medium" : "text-muted-foreground"}`}>
                              {overdue ? "Overdue · " : "Due: "}
                              {new Date(g.due + "T00:00:00").toLocaleDateString(undefined, { dateStyle: "medium" })}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-rose-400" onClick={() => removeGoal(g.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Recently unlocked achievements */}
        <Card className="card-premium grain rounded-2xl animate-rise stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAch.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-4xl">🏆</div>
                <p className="text-sm text-muted-foreground">No achievements unlocked yet. Answer MCQs, complete chapters, and earn XP to start collecting badges!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentAch.map((a) => (
                  <Badge key={a.id} variant="secondary" className="shine-sweep tap-lift gap-1.5 py-1.5 px-2.5 text-xs">
                    <span className="text-base">{a.icon}</span>
                    <span className="font-medium">{a.title}</span>
                    <span className="text-amber-400">+{a.xp}</span>
                  </Badge>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="tap-lift mt-4 w-full" onClick={() => setView("ach")}>
              View all achievements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
