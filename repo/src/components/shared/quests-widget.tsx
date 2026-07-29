"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { Check, Gift } from "lucide-react";

export function QuestsWidget() {
  const quests = useStudyStore((s) => s.quests);
  const ensureQuests = useStudyStore((s) => s.ensureQuests);
  const claimQuest = useStudyStore((s) => s.claimQuest);

  useEffect(() => { ensureQuests(); }, [ensureQuests]);

  if (quests.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="size-4 text-amber-400" />
        <span className="font-display font-bold text-sm">Daily Quests</span>
        <span className="ml-auto text-[10px] text-muted-foreground">Resets daily</span>
      </div>
      <div className="space-y-2">
        {quests.map((q) => {
          const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
          const done = q.progress >= q.target;
          return (
            <div key={q.id} className={`rounded-xl p-3 transition ${q.claimed ? "opacity-40" : done ? "bg-amber-400/10 border border-amber-400/30" : "bg-muted/30 border border-border"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-medium ${q.claimed ? "line-through" : ""}`}>{q.label}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{q.progress}/{q.target}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${q.claimed ? "bg-muted-foreground" : done ? "bg-amber-400" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-medium">+{q.reward} XP</span>
                {q.claimed ? (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Check className="size-3" /> Claimed</span>
                ) : done ? (
                  <button
                    onClick={() => claimQuest(q.id)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-400 text-black hover:opacity-90 transition"
                  >
                    Claim
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
