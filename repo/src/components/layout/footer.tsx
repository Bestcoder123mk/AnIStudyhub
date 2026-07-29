"use client";

import { useStudyStore } from "@/store/use-study-store";
import { Sparkles } from "lucide-react";

export function Footer() {
  const setView = useStudyStore((s) => s.setView);
  const track = useStudyStore((s) => s.track);
  const totalXp = useStudyStore((s) => (s.track === "ssc" ? s.ssc.totalXp : s.totalXp));

  return (
    <footer className="mt-auto border-t border-border/40 bg-card/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-display font-bold text-[11px]">StudyHub</span>
            <span className="text-muted-foreground/50 text-[10px]">· NCERT Class 10</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
            <button onClick={() => setView("tutor")} className="hover:text-primary transition flex items-center gap-1">
              <Sparkles className="size-3" /> AI Tutor
            </button>
            <span className="tabular-nums">{totalXp} XP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
