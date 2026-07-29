"use client";

import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { XpBar } from "@/components/shared/xp-bar";
import { Menu, Search, Bot } from "lucide-react";

export function MobileHeader() {
  const setSidebar = useStudyStore((s) => s.setSidebar);
  const setSearch = useStudyStore((s) => s.setSearch);
  const setView = useStudyStore((s) => s.setView);
  const track = useStudyStore((s) => s.track);

  return (
    <header className="lg:hidden sticky top-0 z-30 glass-strong border-b border-border/50">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          onClick={() => setSidebar(true)}
          className="p-1.5 -ml-1 rounded-lg hover:bg-muted/50 transition"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="size-6 rounded-md bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center text-xs shrink-0">
            {SUBJECT_META[track].icon}
          </div>
          <span className="font-display font-bold text-[13px] truncate">StudyHub</span>
        </div>
        <button
          onClick={() => setSearch(true)}
          className="p-1.5 rounded-lg hover:bg-muted/50 transition"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
        <button
          onClick={() => setView("tutor")}
          className="p-1.5 rounded-lg hover:bg-muted/50 text-primary transition"
          aria-label="AI Tutor"
        >
          <Bot className="size-4" />
        </button>
      </div>
      <XpBar compact />
    </header>
  );
}
