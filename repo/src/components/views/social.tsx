"use client";
import { useEffect } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/components/shared/helpers";
import { Users, MessageCircle, Zap } from "lucide-react";

export function SocialView() {
  const mounted = useMounted();
  const studyBuddies = useStudyStore((s) => s.studyBuddies);
  const ensureStudyBuddies = useStudyStore((s) => s.ensureStudyBuddies);
  const setView = useStudyStore((s) => s.setView);
  const totalXp = useStudyStore((s) => s.totalXp + s.ssc.totalXp);

  useEffect(() => { ensureStudyBuddies(); }, [ensureStudyBuddies]);
  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Social Learning 👥</h1>
        <p className="text-sm text-muted-foreground mt-1">Study with friends · challenge peers · share progress</p>
      </header>

      <Card className="glass rounded-2xl">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4 text-primary" />
            <span className="font-semibold text-sm">Study Buddies</span>
            <Badge variant="secondary" className="text-[9px] ml-auto">{studyBuddies.filter(b => b.status === "online").length} online</Badge>
          </div>
          <div className="space-y-2">
            {studyBuddies.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition">
                <div className="relative">
                  <div className="size-10 rounded-xl bg-card flex items-center justify-center text-xl">{b.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background ${b.status === "online" ? "bg-emerald-400" : "bg-muted-foreground/40"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground">{b.xp} XP · {b.status}</div>
                </div>
                {b.status === "online" && (
                  <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => setView("battle")}>
                    <Zap className="size-3 mr-1" /> Challenge
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2">
                  <MessageCircle className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-sm font-semibold">Quick Battle</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Challenge a buddy to a 10-question rapid fire</p>
            <Button size="sm" className="mt-2 w-full" onClick={() => setView("battle")}>Start</Button>
          </CardContent>
        </Card>
        <Card className="glass rounded-2xl">
          <CardContent className="pt-4 pb-4 text-center">
            <div className="text-3xl mb-1">🏛️</div>
            <div className="text-sm font-semibold">Group Study</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Enter the museum together and explore</p>
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setView("museum")}>Enter</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass rounded-2xl">
        <CardContent className="pt-4 pb-4">
          <div className="text-sm font-semibold mb-2">Your Social Rank</div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{totalXp} XP</span>
            <Badge variant="secondary">Scholar</Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Study with friends to earn bonus XP and unlock group achievements.</p>
        </CardContent>
      </Card>
    </div>
  );
}
