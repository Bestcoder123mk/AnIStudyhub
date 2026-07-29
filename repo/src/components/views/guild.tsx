"use client";
import { useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/components/shared/helpers";
import { Shield, Crown, Users } from "lucide-react";

const GUILD_NAMES = ["The Scholars", "Quantum Quasars", "Newton's Apprentices", "Aristotle's Army", "Curie's Crew"];

export function GuildView() {
  const mounted = useMounted();
  const guild = useStudyStore((s) => s.guild);
  const joinGuild = useStudyStore((s) => s.joinGuild);
  const totalXp = useStudyStore((s) => s.totalXp + s.ssc.totalXp);
  const [name, setName] = useState("");

  if (!mounted) return null;

  if (!guild) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Guilds 🛡️</h1>
          <p className="text-sm text-muted-foreground mt-1">Join a guild to collaborate and climb the ranks together</p>
        </header>
        <Card className="glass rounded-2xl">
          <CardContent className="pt-6 pb-6">
            <div className="text-center mb-4">
              <Shield className="size-12 mx-auto text-primary mb-2" />
              <div className="font-semibold text-sm">You're not in a guild yet</div>
              <p className="text-xs text-muted-foreground mt-1">Join or create a guild to unlock group quests and guild rewards</p>
            </div>
            <div className="space-y-2">
              {GUILD_NAMES.map((gn) => (
                <button key={gn} onClick={() => joinGuild(gn)} className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition text-left">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <span className="text-sm font-medium">{gn}</span>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">Join</Badge>
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Or create your own..." value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
              <Button onClick={() => name.trim() && joinGuild(name.trim())}>Create</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedMembers = [...guild.members].sort((a, b) => b.xp - a.xp);
  const userRank = sortedMembers.findIndex((m) => m.name === "You") + 1;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{guild.name} 🛡️</h1>
          <p className="text-sm text-muted-foreground mt-1">{guild.members.length} members · You rank #{userRank}</p>
        </div>
        <Badge variant="secondary" className="gap-1"><Crown className="size-3" /> Rank {userRank}</Badge>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <Card className="glass rounded-xl"><CardContent className="pt-3 pb-3 text-center"><div className="text-lg font-bold text-primary">{guild.members.reduce((a, b) => a + b.xp, 0)}</div><div className="text-[9px] text-muted-foreground uppercase">Guild XP</div></CardContent></Card>
        <Card className="glass rounded-xl"><CardContent className="pt-3 pb-3 text-center"><div className="text-lg font-bold text-amber-400">{guild.members.length}</div><div className="text-[9px] text-muted-foreground uppercase">Members</div></CardContent></Card>
        <Card className="glass rounded-xl"><CardContent className="pt-3 pb-3 text-center"><div className="text-lg font-bold text-emerald-400">{userRank}</div><div className="text-[9px] text-muted-foreground uppercase">Your Rank</div></CardContent></Card>
      </div>

      <Card className="glass rounded-2xl">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3"><Users className="size-4 text-primary" /><span className="font-semibold text-sm">Members</span></div>
          <div className="space-y-2">
            {sortedMembers.map((m, i) => (
              <div key={m.name} className={`flex items-center gap-3 p-2.5 rounded-xl ${m.name === "You" ? "bg-primary/10 border border-primary/30" : "bg-muted/30"}`}>
                <div className="text-sm font-bold tabular-nums w-5 text-center text-muted-foreground">{i + 1}</div>
                <div className="size-8 rounded-lg bg-card flex items-center justify-center text-base">{m.avatar}</div>
                <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{m.name}</div><div className="text-[10px] text-muted-foreground">{m.xp} XP</div></div>
                {i === 0 && <Crown className="size-4 text-amber-400" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
