"use client";

import { useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Users } from "lucide-react";

interface Rival {
  name: string;
  avatar: string;
  xp: number; // all-time total
  weekly: number; // this-week XP
}

const RIVALS: Rival[] = [
  { name: "Ananya", avatar: "👩‍🔬", xp: 5100, weekly: 410 },
  { name: "Priya", avatar: "👩‍🎓", xp: 4200, weekly: 320 },
  { name: "Arjun", avatar: "👨‍🎓", xp: 3800, weekly: 280 },
  { name: "Sneha", avatar: "👩‍🏫", xp: 3400, weekly: 240 },
  { name: "Mohammed", avatar: "🧑‍💻", xp: 2900, weekly: 190 },
];

const MEDAL = ["🥇", "🥈", "🥉"];

function recent7DateStrings(): string[] {
  const arr: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

type FilterKey = "all" | Track;

export function LeaderboardView() {
  const mounted = useMounted();
  const totalXp = useStudyStore((s) => s.totalXp);
  const sscXp = useStudyStore((s) => s.ssc.totalXp);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const heatmap = useStudyStore((s) => s.heatmap);

  const [tab, setTab] = useState<"all" | "week">("all");
  const [filter, setFilter] = useState<FilterKey>("all");

  // User XP per filter
  const userXp = useMemo(() => {
    if (filter === "all") {
      const subjSum = Object.values(subjectStats).reduce(
        (s, x) => s + (x.totalXp || 0),
        0
      );
      return totalXp + sscXp + subjSum;
    }
    if (filter === "science") return totalXp;
    if (filter === "ssc") return sscXp;
    return subjectStats[filter]?.totalXp ?? 0;
  }, [filter, totalXp, sscXp, subjectStats]);

  const userWeekly = useMemo(() => {
    const dates = recent7DateStrings();
    return dates.reduce((s, d) => s + (heatmap[d] || 0), 0);
  }, [heatmap]);

  type Entry = { name: string; avatar: string; xp: number; you: boolean };

  const entries: Entry[] = useMemo(() => {
    const base: Entry[] = RIVALS.map((r) => ({
      name: r.name,
      avatar: r.avatar,
      xp: tab === "all" ? r.xp : r.weekly,
      you: false,
    }));
    base.push({
      name: "You",
      avatar: "🧑‍🎓",
      xp: tab === "all" ? userXp : userWeekly,
      you: true,
    });
    return base.sort((a, b) => b.xp - a.xp);
  }, [tab, userXp, userWeekly]);

  const userRank = entries.findIndex((e) => e.you) + 1;

  const filterItems: { value: string; label: string }[] = [
    { value: "all", label: "All Subjects" },
    ...(Object.keys(SUBJECT_META) as Track[]).map((t) => ({
      value: t,
      label: `${SUBJECT_META[t].icon} ${SUBJECT_META[t].label}`,
    })),
  ];

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          Leaderboard <span aria-hidden>🏆</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Local + simulated rivals · updates daily
        </p>
      </header>

      {/* User rank summary */}
      <Card className="glass rounded-2xl">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Your position
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold tabular-nums text-primary">
                {mounted ? `#${userRank}` : "—"}
              </span>
              <span className="text-sm text-muted-foreground">
                of {entries.length} scholars
              </span>
            </div>
          </div>
          <div className="space-y-1 sm:text-right">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {tab === "all" ? "All-time XP" : "This week's XP"}
            </div>
            <div className="text-3xl font-bold tabular-nums text-amber-400">
              {mounted ? (tab === "all" ? userXp : userWeekly).toLocaleString() : "—"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "week")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="all">All-Time</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>

          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FilterKey)}
          >
            <SelectTrigger className="w-full sm:w-56 bg-background">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {filterItems.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="glass rounded-2xl mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {tab === "all" ? (
                <Trophy className="size-4 text-amber-400" />
              ) : (
                <Users className="size-4 text-primary" />
              )}
              {tab === "all"
                ? "All-Time Leaderboard"
                : "This Week's Top Scholars"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!mounted ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Loading leaderboard…
              </div>
            ) : (
              entries.map((e, i) => {
                const rank = i + 1;
                const isTop3 = rank <= 3;
                const isYou = e.you;
                const rankCls =
                  rank === 1
                    ? "bg-amber-500/20 text-amber-300"
                    : rank === 2
                    ? "bg-slate-400/20 text-slate-300"
                    : rank === 3
                    ? "bg-orange-700/20 text-orange-300"
                    : "bg-muted text-muted-foreground";
                return (
                  <div
                    key={e.name}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      isYou
                        ? "border-primary/60 bg-primary/10"
                        : isTop3
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border bg-card/40"
                    }`}
                  >
                    <span
                      className={`size-9 shrink-0 rounded-full grid place-items-center font-bold text-sm ${rankCls}`}
                    >
                      {isTop3 ? MEDAL[rank - 1] : rank}
                    </span>
                    <span className="text-2xl shrink-0">{e.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{e.name}</span>
                        {isYou && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] py-0 px-1.5"
                          >
                            You
                          </Badge>
                        )}
                        {rank === 1 && (
                          <Crown className="size-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tab === "all" ? "All-time XP" : "Earned this week"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold tabular-nums">
                        {e.xp.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground">
                        XP
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        Rivals are simulated locally. Keep studying to climb the ranks! 🚀
      </p>
    </div>
  );
}
