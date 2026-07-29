"use client";

import { useMemo } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GraduationCap, Users, TrendingUp, AlertTriangle, Award,
  ClipboardList, AlertCircle, BookMarked,
} from "lucide-react";

/* ---------- types ---------- */
type Status = "green" | "amber" | "red";
interface SimStudent {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  accuracy: number; // 0-100
  lastActive: string;
  status: Status;
  isYou?: boolean;
}

interface Assignment {
  id: string;
  title: string;
  subject: Track;
  due: string;
  completion: number; // 0-100
}

interface WeakTopic {
  topic: string;
  subject: Track;
  avg: number; // %
}

/* ---------- simulated data (stable across renders) ---------- */
const SIM_STUDENTS: SimStudent[] = [
  { id: "s1", name: "Aarav Mehta", avatar: "🦊", xp: 4820, accuracy: 92, lastActive: "2h ago", status: "green" },
  { id: "s2", name: "Diya Sharma", avatar: "🦢", xp: 4510, accuracy: 89, lastActive: "1h ago", status: "green" },
  { id: "s3", name: "Kabir Singh", avatar: "🦁", xp: 4180, accuracy: 86, lastActive: "30m ago", status: "green" },
  { id: "s4", name: "Ananya Iyer", avatar: "🦚", xp: 3920, accuracy: 84, lastActive: "3h ago", status: "green" },
  { id: "s5", name: "Vihaan Reddy", avatar: "🐯", xp: 3540, accuracy: 78, lastActive: "5h ago", status: "amber" },
  { id: "s6", name: "Ishaan Verma", avatar: "🐺", xp: 3120, accuracy: 75, lastActive: "1d ago", status: "amber" },
  { id: "s7", name: "Saanvi Nair", avatar: "🦌", xp: 2780, accuracy: 71, lastActive: "8h ago", status: "amber" },
  { id: "s8", name: "Aryan Gupta", avatar: "🐲", xp: 2310, accuracy: 64, lastActive: "2d ago", status: "red" },
  { id: "s9", name: "Myra Joshi", avatar: "🐰", xp: 1850, accuracy: 58, lastActive: "3d ago", status: "red" },
  { id: "s10", name: "Reyansh Rao", avatar: "🦉", xp: 1240, accuracy: 51, lastActive: "5d ago", status: "red" },
];

const ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Chemical Reactions — MCQ set", subject: "science", due: "Tomorrow", completion: 68 },
  { id: "a2", title: "Nationalism in India — short answers", subject: "ssc", due: "Fri 12 Jul", completion: 42 },
  { id: "a3", title: "Trigonometry — practice sheet", subject: "maths", due: "Mon 15 Jul", completion: 23 },
];

const WEAK_TOPICS: WeakTopic[] = [
  { topic: "Trigonometric identities", subject: "maths", avg: 48 },
  { topic: "Carbon & its compounds", subject: "science", avg: 54 },
  { topic: "Money & credit", subject: "ssc", avg: 57 },
];

const STATUS_META: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  green: { label: "On track", dot: "#22c55e", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  amber: { label: "Watch", dot: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10" },
  red: { label: "At risk", dot: "#ef4444", text: "text-rose-400", bg: "bg-rose-500/10" },
};

/* ---------- helpers ---------- */
function xpForTrack(s: { totalXp: number; ssc: { totalXp: number }; subjectStats: Record<string, { totalXp: number }> }, t: Track): number {
  if (t === "science") return s.totalXp;
  if (t === "ssc") return s.ssc.totalXp;
  return s.subjectStats[t]?.totalXp ?? 0;
}

/* ---------- main view ---------- */
export function TeacherView() {
  const mounted = useMounted();
  const _totalXp = useStudyStore((s) => s.totalXp);
  const _sscXp = useStudyStore((s) => s.ssc.totalXp);
  const _subjectStats = useStudyStore((s) => s.subjectStats);
  const _totalAnswered = useStudyStore((s) => s.totalAnswered);
  const _totalCorrect = useStudyStore((s) => s.totalCorrect);
  const store = { totalXp: _totalXp, ssc: { totalXp: _sscXp }, subjectStats: _subjectStats, totalAnswered: _totalAnswered, totalCorrect: _totalCorrect };

  const myTotalXp = useMemo(
    () => (["science", "ssc", "maths", "english", "sanskrit"] as Track[]).reduce((sum, t) => sum + xpForTrack(store, t), 0),
    [store],
  );
  const myAccuracy = store.totalAnswered > 0
    ? Math.round((store.totalCorrect / store.totalAnswered) * 100)
    : 0;

  // Insert "you" into the class list — find your position by XP
  const mergedStudents = useMemo(() => {
    const all: SimStudent[] = SIM_STUDENTS.map((s) => ({ ...s }));
    // determine your status by accuracy
    const myStatus: Status = myAccuracy >= 80 ? "green" : myAccuracy >= 65 ? "amber" : "red";
    all.push({
      id: "you",
      name: "You",
      avatar: "🧑‍🎓",
      xp: myTotalXp,
      accuracy: myAccuracy,
      lastActive: "now",
      status: myStatus,
      isYou: true,
    });
    return all.sort((a, b) => b.xp - a.xp);
  }, [myTotalXp, myAccuracy]);

  // class stats
  const avgScore = Math.round(
    mergedStudents.reduce((sum, s) => sum + s.accuracy, 0) / mergedStudents.length,
  );
  const topPerformer = mergedStudents[0];
  const needsAttention = mergedStudents.filter((s) => s.status === "red").length;

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/30 animate-pulse" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GraduationCap className="size-7 text-violet-400" />
          Teacher Portal <span aria-hidden>👨‍🏫</span>
        </h1>
        <p className="text-sm text-muted-foreground">Class overview · simulated data</p>
      </header>

      {/* Class stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Users className="size-4" />} label="Total students" value="32" tone="violet" />
        <StatCard icon={<TrendingUp className="size-4" />} label="Class average" value={`${avgScore}%`} tone="emerald" />
        <StatCard icon={<Award className="size-4" />} label="Top performer" value={topPerformer?.name ?? "—"} sub={`${topPerformer?.xp.toLocaleString() ?? 0} XP`} tone="amber" />
        <StatCard icon={<AlertTriangle className="size-4" />} label="Need attention" value={`${needsAttention}`} sub="at-risk students" tone="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student list */}
        <Card className="glass lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="size-4" /> Student roster
            </CardTitle>
            <CardDescription>Sorted by total XP — your row is highlighted</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[28rem] -mx-1 px-1">
              <ul className="space-y-1.5">
                {mergedStudents.map((s, i) => {
                  const sm = STATUS_META[s.status];
                  return (
                    <li
                      key={s.id}
                      className={`rounded-lg border p-2.5 flex items-center gap-3 ${
                        s.isYou ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30" : "border-border bg-muted/15"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground tabular-nums w-5 text-center">#{i + 1}</div>
                      <div className="size-9 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">{s.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{s.name}</span>
                          {s.isYou && <Badge variant="secondary" className="text-[10px] py-0 h-4">YOU</Badge>}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {s.xp.toLocaleString()} XP · {s.accuracy}% accuracy · {s.lastActive}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`size-2 rounded-full`} style={{ backgroundColor: sm.dot }} />
                        <span className={`text-[10px] ${sm.text} hidden sm:inline`}>{sm.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right column: assignments + weak topics */}
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="size-4" /> Assignments
              </CardTitle>
              <CardDescription>Current homework &amp; due dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ASSIGNMENTS.map((a) => (
                <div key={a.id} className="rounded-lg border bg-muted/15 p-2.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{a.title}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <span style={{ color: SUBJECT_META[a.subject].accent }}>
                          {SUBJECT_META[a.subject].icon} {SUBJECT_META[a.subject].label}
                        </span>
                        <span>· due {a.due}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold tabular-nums shrink-0">{a.completion}%</span>
                  </div>
                  <Progress value={a.completion} className="h-1.5" />
                  <div className="text-[10px] text-muted-foreground mt-1">Class completion</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="size-4 text-rose-400" /> Weak class topics
              </CardTitle>
              <CardDescription>Average below 60% — needs revision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {WEAK_TOPICS.map((w) => (
                <div key={w.topic} className="rounded-lg border bg-rose-500/5 border-rose-500/20 p-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{w.topic}</div>
                      <div className="text-[11px]" style={{ color: SUBJECT_META[w.subject].accent }}>
                        {SUBJECT_META[w.subject].icon} {SUBJECT_META[w.subject].label}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-rose-300 border-rose-400/40 bg-rose-400/10 shrink-0">
                      {w.avg}%
                    </Badge>
                  </div>
                  <Progress value={w.avg} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-2xl glass border p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <BookMarked className="size-4 shrink-0 text-violet-400 mt-0.5" />
        <p className="whitespace-pre-wrap">
          This Teacher Portal uses simulated class data for demonstration — 32 students are shown as a roster sample of 10 plus your own row. No real student information is collected or stored. The "You" row reflects your actual local XP and accuracy.
        </p>
      </div>
    </div>
  );
}

/* ---------- stat card ---------- */
function StatCard({
  icon, label, value, sub, tone,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  tone: "violet" | "emerald" | "amber" | "rose";
}) {
  const toneMap = {
    violet: { wrap: "from-violet-500/10 to-violet-500/5 border-violet-500/30", text: "text-violet-400", chip: "bg-violet-500/15 text-violet-400" },
    emerald: { wrap: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/30", text: "text-emerald-400", chip: "bg-emerald-500/15 text-emerald-400" },
    amber: { wrap: "from-amber-500/10 to-amber-500/5 border-amber-500/30", text: "text-amber-400", chip: "bg-amber-500/15 text-amber-400" },
    rose: { wrap: "from-rose-500/10 to-rose-500/5 border-rose-500/30", text: "text-rose-400", chip: "bg-rose-500/15 text-rose-400" },
  }[tone];
  return (
    <div className={`glass rounded-2xl p-4 bg-gradient-to-br ${toneMap.wrap} border`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className={`inline-flex size-6 items-center justify-center rounded-md ${toneMap.chip}`}>{icon}</span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${toneMap.text} truncate`}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
