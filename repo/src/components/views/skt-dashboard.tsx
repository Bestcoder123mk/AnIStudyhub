"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META, type ViewId } from "@/store/use-study-store";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { SKT_CHAPTERS, SKT_MCQS, SKT_SHORT_QA, SKT_LONG_QA } from "@/lib/sanskrit-data";
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
  BookOpen,
  Languages,
} from "lucide-react";

const ACCENT = "#fbbf24";

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
          className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-500" : ""}`}
          style={{ width: `${pct}%`, backgroundColor: complete ? undefined : ACCENT }}
        />
      </div>
    </div>
  );
}

const QUICK_ACTIONS: { view: ViewId; emoji: string; label: string }[] = [
  { view: "skt-mcq", emoji: "🎯", label: "MCQ Quiz" },
  { view: "skt-chapters", emoji: "📚", label: "Chapters" },
  { view: "skt-translator", emoji: "🔄", label: "Translator" },
  { view: "skt-short", emoji: "✍️", label: "Short QA" },
  { view: "skt-long", emoji: "📜", label: "Long QA" },
  { view: "tutor", emoji: "🤖", label: "AI Tutor" },
];

export function SktDashboardView() {
  const mounted = useMounted();

  const subjectStats = useStudyStore((s) => s.subjectStats);
  const examDate = useStudyStore((s) => s.examDate);
  const setExamDate = useStudyStore((s) => s.setExamDate);
  const setView = useStudyStore((s) => s.setView);
  const daily = useStudyStore((s) => s.daily);
  const goals = useStudyStore((s) => s.goals);
  const addGoal = useStudyStore((s) => s.addGoal);
  const toggleGoal = useStudyStore((s) => s.toggleGoal);
  const removeGoal = useStudyStore((s) => s.removeGoal);

  const skt = subjectStats["sanskrit"] ?? {
    totalXp: 0, level: 1, totalCorrect: 0, totalAnswered: 0,
    bestStreak: 0, currentStreak: 0, mcqDone: 0, chaptersOpened: 0,
    shortRevealed: 0, longRevealed: 0, flashDone: 0, unlockedAch: [],
    openedChapters: [], histAnswered: 0, histCorrect: 0,
    geoAnswered: 0, geoCorrect: 0, polsciAnswered: 0, polsciCorrect: 0,
    ecoAnswered: 0, ecoCorrect: 0,
  };

  const accuracy = skt.totalAnswered > 0 ? Math.round((skt.totalCorrect / skt.totalAnswered) * 100) + "%" : "0%";

  const streakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(skt.bestStreak, 7));

  const examDays = mounted && examDate ? daysUntil(examDate) : null;

  const missions = [
    { emoji: "🎯", label: "Solve 5 MCQs", done: Math.min(daily.mcqDone, 5), target: 5 },
    { emoji: "📖", label: "Read 1 chapter", done: Math.min(daily.chapRead, 1), target: 1 },
    { emoji: "🔄", label: "Translate 1 shloka", done: Math.min(daily.mcqDone >= 1 ? 1 : 0, 1), target: 1 },
  ];

  const recentAch = skt.unlockedAch
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

  const TOTAL_CHAPTERS = SKT_CHAPTERS.length;
  const TOTAL_MCQS = SKT_MCQS.length;
  const chapterPct = TOTAL_CHAPTERS > 0 ? Math.round((skt.chaptersOpened / TOTAL_CHAPTERS) * 100) : 0;
  const mcqPct = TOTAL_MCQS > 0 ? Math.round((Math.min(skt.mcqDone, TOTAL_MCQS) / TOTAL_MCQS) * 100) : 0;

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          Sanskrit
          <span className="inline-block" style={{ filter: "drop-shadow(0 0 10px " + ACCENT + ")" }}>🕉️</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          शेमुषी · व्याकरणम् · PYQ pattern — Shemushi chapters, grammar (sandhi/samas/shabdarupa), and a Sanskrit→English translator.
        </p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Zap className="size-4" />} label="Total XP" value={skt.totalXp} tone="gold" />
        <StatCard icon={<Trophy className="size-4" />} label="Correct Answers" value={skt.totalCorrect} tone="emerald" />
        <StatCard icon={<Target className="size-4" />} label="Accuracy" value={accuracy} tone="sky" />
        <StatCard icon={<Flame className="size-4" />} label="Best Streak" value={skt.bestStreak} tone="orange" />
      </section>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Progress */}
        <Card className="glass lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="size-4" style={{ color: ACCENT }} /> Sanskrit Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressRow
              label="Chapters opened"
              emoji="📚"
              done={skt.chaptersOpened}
              total={TOTAL_CHAPTERS}
              pct={chapterPct}
              accent={ACCENT}
            />
            <ProgressRow
              label="MCQs answered"
              emoji="🎯"
              done={Math.min(skt.mcqDone, TOTAL_MCQS)}
              total={TOTAL_MCQS}
              pct={mcqPct}
              accent={ACCENT}
            />
            <ProgressRow
              label="Short Q&A revealed"
              emoji="✍️"
              done={skt.shortRevealed}
              total={SKT_SHORT_QA.length}
              pct={Math.round((skt.shortRevealed / Math.max(1, SKT_SHORT_QA.length)) * 100)}
              accent={ACCENT}
            />
            <ProgressRow
              label="Long Q&A revealed"
              emoji="📜"
              done={skt.longRevealed}
              total={SKT_LONG_QA.length}
              pct={Math.round((skt.longRevealed / Math.max(1, SKT_LONG_QA.length)) * 100)}
              accent={ACCENT}
            />
            <p className="text-xs text-muted-foreground pt-1">
              {TOTAL_CHAPTERS} Shemushi chapters · {TOTAL_MCQS} board-pattern MCQs · {SKT_SHORT_QA.length} short · {SKT_LONG_QA.length} long.
            </p>
          </CardContent>
        </Card>

        {/* Daily Streak */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="size-4 text-orange-400" /> Daily Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-orange-400 tabular-nums">{skt.bestStreak}</span>
              <span className="text-muted-foreground mb-1.5 text-sm">day best</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {streakDots.map((on, i) => (
                <span
                  key={i}
                  className={`size-6 rounded-full grid place-items-center text-[10px] ${
                    on ? "text-white" : "bg-muted text-muted-foreground"
                  }`}
                  style={on ? { backgroundColor: ACCENT } : undefined}
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
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="size-4" style={{ color: ACCENT }} /> Exam Countdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && examDays !== null ? (
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold tabular-nums" style={{ color: ACCENT }}>{examDays}</span>
                  <span className="text-muted-foreground mb-1.5 text-sm">days to go</span>
                </div>
                <p className="text-xs text-muted-foreground">Target: {new Date(examDate + "T00:00:00").toLocaleDateString(undefined, { dateStyle: "long" })}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setExamDate("")}>
                  Change date
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Set your Sanskrit board exam date to start the countdown.</p>
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="size-4" style={{ color: ACCENT }} /> Today&apos;s Missions
            </CardTitle>
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="size-4" style={{ color: ACCENT }} /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.view}
                  onClick={() => setView(qa.view)}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/60 p-3 text-center transition-all hover:bg-amber-500/5 active:scale-95"
                  style={{ borderColor: undefined }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT + "60")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">{qa.emoji}</span>
                  <span className="text-[11px] font-medium leading-tight">{qa.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Translator feature card */}
      <Card
        className="glass rounded-2xl overflow-hidden relative"
        style={{ borderColor: ACCENT + "40" }}
      >
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Languages className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              Sanskrit → English Translator
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: ACCENT + "20", color: ACCENT }}>AI</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Paste any Sanskrit shloka or sentence — get word-by-word meanings, a fluent translation, Hindi, and grammar notes (sandhi/samas/shabdarupa).
            </p>
          </div>
          <Button
            onClick={() => setView("skt-translator")}
            className="shrink-0 text-black"
            style={{ backgroundColor: ACCENT }}
          >
            Try it →
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Goals */}
        <Card className="glass lg:col-span-2 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="size-4" style={{ color: ACCENT }} /> Goals
            </CardTitle>
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
              <Button onClick={handleAddGoal} className="shrink-0" style={{ backgroundColor: ACCENT, color: "#000" }}>
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
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="size-4" style={{ color: ACCENT }} /> Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAch.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-4xl">🕉️</div>
                <p className="text-sm text-muted-foreground">No achievements unlocked yet. Answer MCQs and reveal answers to earn badges!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recentAch.map((a) => (
                  <Badge key={a.id} variant="secondary" className="gap-1.5 py-1.5 px-2.5 text-xs">
                    <span className="text-base">{a.icon}</span>
                    <span className="font-medium">{a.title}</span>
                    <span style={{ color: ACCENT }}>+{a.xp}</span>
                  </Badge>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setView("skt-ach")}>
              View all achievements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProgressRow({ label, emoji, done, total, pct, accent }: { label: string; emoji: string; done: number; total: number; pct: number; accent: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className="text-muted-foreground tabular-nums">
          {done}/{total} · <span className="font-semibold" style={{ color: accent }}>{pct}%</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}
