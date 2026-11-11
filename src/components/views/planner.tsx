"use client";

import { useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted, fmtMins } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  CalendarPlus,
  ListChecks,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface PlannerSession {
  id: string;
  date: string;
  subject: Track;
  topic: string;
  duration: number;
  done: boolean;
}

function getWeekStart(dateStr: string): Date {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return new Date();
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekKey(dateStr: string): string {
  return getWeekStart(dateStr).toISOString().slice(0, 10);
}

function weekLabel(dateStr: string): string {
  const d = getWeekStart(dateStr);
  return `Week of ${d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}

export function PlannerView() {
  const mounted = useMounted();
  const planner = useStudyStore((s) => s.planner);
  const addPlannerSession = useStudyStore((s) => s.addPlannerSession);
  const togglePlannerSession = useStudyStore((s) => s.togglePlannerSession);
  const removePlannerSession = useStudyStore((s) => s.removePlannerSession);

  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [subject, setSubject] = useState<Track>("science");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<number>(30);

  const handleAdd = () => {
    if (!date || !topic.trim() || duration <= 0) return;
    addPlannerSession(date, subject, topic.trim(), duration);
    setTopic("");
    setDuration(30);
  };

  const sorted = useMemo(
    () =>
      [...planner].sort((a, b) => a.date.localeCompare(b.date)) as PlannerSession[],
    [planner]
  );

  const weeklyGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        sessions: PlannerSession[];
        totals: Record<string, number>;
        totalMins: number;
      }
    >();
    for (const s of sorted) {
      const k = weekKey(s.date);
      if (!map.has(k))
        map.set(k, { sessions: [], totals: {}, totalMins: 0 });
      const g = map.get(k)!;
      g.sessions.push(s);
      g.totals[s.subject] = (g.totals[s.subject] || 0) + s.duration;
      g.totalMins += s.duration;
    }
    return Array.from(map.entries());
  }, [sorted]);

  const totalMins = sorted.reduce((s, x) => s + x.duration, 0);
  const doneCount = sorted.filter((s) => s.done).length;

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          Study Planner <span aria-hidden>📅</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Plan your study sessions and track progress
        </p>
      </header>

      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Sessions
          </div>
          <div className="text-2xl font-bold tabular-nums text-primary">
            {mounted ? sorted.length : "—"}
          </div>
        </Card>
        <Card className="glass rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Completed
          </div>
          <div className="text-2xl font-bold tabular-nums text-emerald-400">
            {mounted ? `${doneCount}/${sorted.length}` : "—"}
          </div>
        </Card>
        <Card className="glass rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Total Time
          </div>
          <div className="text-2xl font-bold tabular-nums text-amber-400">
            {mounted ? fmtMins(totalMins) : "—"}
          </div>
        </Card>
      </div>

      {/* Add form */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarPlus className="size-4 text-primary" /> Add Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-date" className="text-xs">
                Date
              </Label>
              <Input
                id="p-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Select
                value={subject}
                onValueChange={(v) => setSubject(v as Track)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SUBJECT_META) as Track[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {SUBJECT_META[t].icon} {SUBJECT_META[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-topic" className="text-xs">
                Topic
              </Label>
              <Input
                id="p-topic"
                placeholder="e.g. Chemical Reactions"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-dur" className="text-xs">
                Duration (min)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="p-dur"
                  type="number"
                  min={5}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-background"
                />
                <Button onClick={handleAdd} className="shrink-0">
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {mounted && sorted.length === 0 ? (
        <Card className="glass rounded-2xl">
          <CardContent className="p-10 text-center space-y-3">
            <div className="text-5xl">🗓️</div>
            <h3 className="font-semibold text-lg">No sessions yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Add your first study session above to start planning your week.
              Track topics, durations, and check them off as you complete them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Week view */}
          <Card className="glass rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" /> Weekly Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mounted &&
                weeklyGroups.map(([wk, g]) => (
                  <div
                    key={wk}
                    className="rounded-xl border border-border bg-card/40 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{weekLabel(wk)}</div>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="size-3 mr-1" /> {fmtMins(g.totalMins)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(g.totals).map(([subj, mins]) => (
                        <Badge
                          key={subj}
                          variant="outline"
                          className="text-xs"
                        >
                          {SUBJECT_META[subj as Track]?.icon}{" "}
                          {SUBJECT_META[subj as Track]?.short} · {fmtMins(mins)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Sessions list */}
          <Card className="glass rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="size-4 text-primary" /> All Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {mounted &&
                  sorted.map((s) => {
                    const meta = SUBJECT_META[s.subject];
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 transition-all ${
                          s.done ? "opacity-60" : ""
                        }`}
                      >
                        <Checkbox
                          checked={s.done}
                          onCheckedChange={() => togglePlannerSession(s.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base">{meta.icon}</span>
                            <span className="font-medium text-sm">
                              {meta.short}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ·
                            </span>
                            <span
                              className={`text-sm ${
                                s.done ? "line-through" : ""
                              }`}
                            >
                              {s.topic}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>
                              {new Date(s.date + "T00:00:00").toLocaleDateString(
                                undefined,
                                { dateStyle: "medium" }
                              )}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" /> {fmtMins(s.duration)}
                            </span>
                            {s.done && (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="size-3" /> done
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-rose-400 shrink-0"
                          onClick={() => removePlannerSession(s.id)}
                          aria-label="Delete session"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
