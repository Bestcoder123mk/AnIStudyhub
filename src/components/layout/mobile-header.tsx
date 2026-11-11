"use client";

import { useStudyStore } from "@/store/use-study-store";
import { XpBar } from "@/components/shared/xp-bar";
import { StatPills } from "@/components/shared/stat-pills";
import { Menu, Search, Bot } from "lucide-react";

// Floats over content as a pane of Liquid Glass: what scrolls underneath stays visible through it.
export function MobileHeader() {
  const setSidebar = useStudyStore((s) => s.setSidebar);
  const setSearch = useStudyStore((s) => s.setSearch);
  const setView = useStudyStore((s) => s.setView);

  const iconBtn = "grid size-10 place-items-center rounded-2xl text-foreground outline-none transition active:scale-90 hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <header className="lg:hidden sticky top-0 z-30 glass-strong border-b pt-safe" style={{ borderRadius: 0 }}>
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button onClick={() => setSidebar(true)} className={iconBtn} aria-label="Open menu">
          <Menu className="size-5" strokeWidth={2.4} />
        </button>
        <div className="flex min-w-0 flex-1 justify-center">
          <StatPills />
        </div>
        <button onClick={() => setSearch(true)} className={iconBtn} aria-label="Search">
          <Search className="size-5" strokeWidth={2.4} />
        </button>
        <button onClick={() => setView("tutor")} className={iconBtn} aria-label="AI Tutor">
          <Bot className="size-5" strokeWidth={2.4} />
        </button>
      </div>
      <XpBar compact />
    </header>
  );
}
