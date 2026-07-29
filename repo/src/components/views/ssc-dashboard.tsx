"use client";

import { useState } from "react";
import { useStudyStore, type ViewId } from "@/store/use-study-store";
import { SSC_ACHIEVEMENTS } from "@/lib/achievements";
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
  Globe2,
} from "lucide-react";

type Tone = "gold" | "emerald" | "sky" | "orange";

const TONE_CLASS: Record<Tone, { wrap: string; chip: string; text: string }> = {
  gold: { wrap: "from-amber-500/10 to-amber-500/5 border-amber-500/30", chip: "bg-amber-500/15 text-amber-400", text: "text-amber-400" },
  emerald: { wrap: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/30", chip: "bg-emerald-500/15 text-emerald-400", text: "text-emerald-400" },
  sky: { wrap: "from-sky-500/10 to-sky-500/5 border-sky-500/30", chip: "bg-sky-500/15 text-sky-400", text: "text-sky-400" },
  orange: { wrap: "from-orange-500/10 to-orange-500/5 border-orange-500/30", chip: "bg-orange-500/15 text-orange-400", text: "text-orange-400" },
};

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string | number; tone: Tone }) {
  const t = TONE_CLASS[tone];
  return (
    <div className={`glass rounded-2xl p-4 bg-gradient-to-br ${t.wrap} border`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className={`inline-flex size-7 items-center justify-center rounded-lg ${t.chip}`}>{icon}</span>
      </div>
      <div className={`mt-2 text-2xl sm:text-3xl font-bold tabular-nums ${t.text}`}>{value}</div>
    </div>
  );
}

function SubjectRow({ subj, label, emoji, attempted, total }: { subj: string; label: string; emoji: string; attempted: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((attempted / total) * 100)) : 0;
  return (
    <div className={`subj-${subj}`}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium flex items-center gap-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className="text-muted-foreground tabular-nums">
          {attempted}/{total} · <span className="text-subj font-semibold">{pct}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "var(--sc)" }} />
      </div>
    </div>
  );
}

function MissionRow({ emoji, label, done, target }: { emoji: string; label: string; done: number; target: number }) {
  const pct = Math.min(100, Math.round((done / target) * 100));
  const complete = done >= target;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span>{emoji}</span>
          <span className={complete ? "line-through text-muted-foreground" : ""}>{label}</span>
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {done}/{target} {complete && "✓"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-500" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const QUICK_ACTIONS: { view: ViewId; emoji: string; label: string }[] = [
  { view: "ssc-mcq", emoji: "🎯", label: "MCQ Quiz" },
  { view: "ssc-flash", emoji: "⚡", label: "Flashcards" },
  { view: "ssc-chapters", emoji: "📚", label: "Chapters" },
  { view: "ssc-short", emoji: "✍️", label: "Short QA" },
  { view: "ssc-long", emoji: "📜", label: "Long QA" },
  { view: "tutor", emoji: "🤖", label: "AI Tutor" },
];

const SSC_SUBJECTS = [
  { subj: "hist", label: "History", emoji: "🏛️" },
  { subj: "geo", label: "Geography", emoji: "🌍" },
  { subj: "polsci", label: "Pol. Science", emoji: "⚖️" },
  { subj: "eco", label: "Economics", emoji: "💰" },
] as const;

const TARGET_PER_SUBJECT = 10;

export function SscDashboardView() {
  const mounted = useMounted();

  const ssc = useStudyStore((s) => s.ssc);
  const examDate = useStudyStore((s) => s.examDate);
  const setExamDate = useStudyStore((s) => s.setExamDate);
  const setView = useStudyStore((s) => s.setView);
  const daily = useStudyStore((s) => s.daily);
  const goals = useStudyStore((s) => s.goals);
  const addGoal = useStudyStore((s) => s.addGoal);
  const toggleGoal = useStudyStore((s) => s.toggleGoal);
  const removeGoal = useStudyStore((s) => s.removeGoal);

  const accuracy = ssc.totalAnswered > 0 ? Math.round((ssc.totalCorrect / ssc.totalAnswered) * 100) + "%" : "0%";

  const streakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(ssc.bestStreak, 7));

  const examDays = mounted && examDate ? daysUntil(examDate) : null;

  const missions = [
    { emoji: "🎯", label: "Solve 5 MCQs", done: Math.min(daily.mcqDone, 5), target: 5 },
    { emoji: "⚡", label: "Review 3 flashcards", done: Math.min(daily.flashDone, 3), target: 3 },
    { emoji: "📖", label: "Read 1 chapter", done: Math.min(daily.chapRead, 1), target: 1 },
  ];

  const recentAch = ssc.unlockedAch
    .map((id) => SSC_ACHIEVEMENTS.find((a) => a.id === id))
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

  const subjAnswered: Record<string, number> = {
    hist: ssc.histAnswered,
    geo: ssc.geoAnswered,
    polsci: ssc.polsciAnswered,
    eco: ssc.ecoAnswered,
  };

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">SSC Dashboard 🌏</h1>
        <p className="text-sm text-muted-foreground">Class 10 Social Science — History · Geography · Political Science · Economics</p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Zap className="size-4" />} label="Total XP" value={ssc.totalXp} tone="gold" />
        <StatCard icon={<Trophy className="size-4" />} label="Correct Answers" value={ssc.totalCorrect} tone="emerald" />
        <StatCard icon={<Target className="size-4" />} label="Accuracy" value={accuracy} tone="sky" />
        <StatCard icon={<Flame className="size-4" />} label="Best Streak" value={ssc.bestStreak} tone="orange" />
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Subject Progress */}
        <Card className="glass lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Globe2 className="size-4 text-primary" /> Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SSC_SUBJECTS.map((s) => (
              <SubjectRow
                key={s.subj}
                subj={s.subj}
                label={s.label}
                emoji={s.emoji}
                attempted={subjAnswered[s.subj]}
                total={TARGET_PER_SUBJECT}
              />
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              40 MCQs total · 10 per subject across History, Geography, Pol. Science, Economics.
            </p>
          </CardContent>
        </Card>

        {/* Daily Streak */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Flame className="size-4 text-orange-400" /> Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-orange-400 tabular-nums">{ssc.bestStreak}</span>
              <span className="text-muted-foreground mb-1.5 text-sm">day best</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {streakDots.map((on, i) => (
                <span
                  key={i}
                  className={`size-6 rounded-full grid place-items-center text-[10px] ${
                    on ? "bg-orange-500/80 text-white" : "bg-muted text-muted-foreground"
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
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarClock className="size-4 text-primary" /> Exam Countdown</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && examDays !== null ? (
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-primary tabular-nums">{examDays}</span>
                  <span className="text-muted-foreground mb-1.5 text-sm">days to go</span>
                </div>
                <p className="text-xs text-muted-foreground">Target: {new Date(examDate + "T00:00:00").toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setExamDate("")}>
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
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Target className="size-4 text-primary" /> Today&apos;s Missions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missions.map((m) => (
              <MissionRow key={m.label} {...m} />
            ))}
            <p className="text-xs text-muted-foreground pt-1">Resets daily · complete all to earn bonus XP.</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Zap className="size-4 text-primary" /> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.view}
                  onClick={() => setView(qa.view)}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/60 p-3 text-center transition-all hover:border-primary/60 hover:bg-primary/5 active:scale-95"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">{qa.emoji}</span>
                  <span className="text-[11px] font-medium leading-tight">{qa.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Goals */}
        <Card className="glass lg:col-span-2 rounded-2xl">
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
              <Button onClick={handleAddGoal} className="shrink-0">
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
                        className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-2.5"
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

        {/* Recent achievements */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAch.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-4xl">🌏</div>
                <p className="text-sm text-muted-foreground">No SSC achievements unlocked yet. Answer Social Science MCQs to earn your first badge!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentAch.map((a) => (
                  <Badge key={a.id} variant="secondary" className="gap-1.5 py-1.5 px-2.5 text-xs">
                    <span className="text-base">{a.icon}</span>
                    <span className="font-medium">{a.title}</span>
                    <span className="text-amber-400">+{a.xp}</span>
                  </Badge>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setView("ssc-ach")}>
              View all SSC achievements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
