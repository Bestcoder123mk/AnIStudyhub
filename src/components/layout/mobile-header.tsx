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
    <header
      className="lg:hidden sticky top-0 z-30 glass-strong glass-interactive border-b pt-safe"
      style={{ borderBottomColor: "color-mix(in oklch, var(--primary) 18%, var(--border))" }}
    >
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          onClick={() => setSidebar(true)}
          className="group p-2.5 rounded-xl hover:bg-primary/10 active:scale-90 transition"
          aria-label="Open menu"
        >
          <Menu className="icon-nudge size-5 group-hover:text-primary transition-colors" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
          <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0 shadow-[0_0_10px_-1px_color-mix(in_oklch,var(--primary)_70%,transparent)]">
            {SUBJECT_META[track].icon}
          </div>
          <span className="font-display font-bold text-[13px] truncate">StudyHub</span>
        </div>
        <button
          onClick={() => setSearch(true)}
          className="group p-2.5 rounded-xl hover:bg-primary/10 active:scale-90 transition"
          aria-label="Search"
        >
          <Search className="icon-nudge size-5 group-hover:text-primary transition-colors" />
        </button>
        <button
          onClick={() => setView("tutor")}
          className="group p-2.5 rounded-xl hover:bg-primary/10 active:scale-90 text-foreground transition"
          aria-label="AI Tutor"
        >
          <Bot className="icon-nudge size-5 group-hover:text-primary transition-colors" />
        </button>
      </div>
      <XpBar compact />
    </header>
  );
}
