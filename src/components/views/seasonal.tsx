"use client";
import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/components/shared/helpers";
import { Gift, Calendar } from "lucide-react";

export function SeasonalView() {
  const mounted = useMounted();
  const seasonalEvent = useStudyStore((s) => s.seasonalEvent);
  const ensureSeasonal = useStudyStore((s) => s.ensureSeasonal);
  const claimSeasonal = useStudyStore((s) => s.claimSeasonal);
  const mcqDone = useStudyStore((s) => s.mcqDone + s.ssc.mcqDone);
  const bestStreak = useStudyStore((s) => Math.max(s.bestStreak, s.ssc.bestStreak));
  const chaptersOpened = useStudyStore((s) => s.chaptersOpened + s.ssc.chaptersOpened);

  useEffect(() => { ensureSeasonal(); }, [ensureSeasonal]);
  if (!mounted || !seasonalEvent) return null;

  // Update progress based on event type
  const progress = seasonalEvent.id === "weekly-mcq" ? Math.min(seasonalEvent.target, mcqDone)
    : seasonalEvent.id === "streak-week" ? Math.min(seasonalEvent.target, bestStreak)
    : Math.min(seasonalEvent.target, chaptersOpened);
  const pct = Math.round((progress / seasonalEvent.target) * 100);
  const done = progress >= seasonalEvent.target;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Seasonal Events 🎉</h1>
        <p className="text-sm text-muted-foreground mt-1">Limited-time challenges with bonus rewards</p>
      </header>

      <Card className="glass rounded-2xl overflow-hidden">
        <div className="h-2" style={{ background: `linear-gradient(90deg, #fbbf24, #f97316)` }} />
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="size-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-3xl shrink-0">
              {seasonalEvent.icon}
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Active Event</div>
              <div className="font-display font-bold text-lg">{seasonalEvent.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Complete to earn {seasonalEvent.reward} XP + {Math.floor(seasonalEvent.reward / 5)} coins</div>
            </div>
            {seasonalEvent.claimed && <Badge variant="secondary" className="gap-1 bg-emerald-400/15 text-emerald-400">✓ Claimed</Badge>}
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold tabular-nums">{progress} / {seasonalEvent.target}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {done && !seasonalEvent.claimed ? (
            <Button onClick={claimSeasonal} className="w-full bg-amber-400 text-black hover:bg-amber-300 gap-2">
              <Gift className="size-4" /> Claim {seasonalEvent.reward} XP
            </Button>
          ) : seasonalEvent.claimed ? (
            <div className="text-center text-sm text-emerald-400 font-medium py-2">✓ Event completed! Come back next week for a new challenge.</div>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-2">Keep studying to reach the goal!</div>
          )}
        </CardContent>
      </Card>

      <Card className="glass rounded-2xl">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="size-4 text-muted-foreground" /><span className="text-sm font-semibold">How it works</span></div>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• A new event appears every week with a fresh challenge</li>
            <li>• Progress is tracked automatically as you study</li>
            <li>• Claim your reward once the goal is reached</li>
            <li>• Events rotate: MCQ challenges, streak goals, and chapter mastery</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
