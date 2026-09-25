"use client";

// A real bottom tab bar for mobile — before this, the only way to move
// around the app on a phone was the hamburger menu opening a ~35-item
// drawer across 8 collapsible sections. That works fine on desktop where
// the sidebar is always visible, but on mobile it meant every navigation
// action was at least 2 taps (open drawer, find section, tap item). This
// puts the five most common destinations one tap away, iOS/Apple-app style,
// and routes everything else through "More" (which just opens the existing
// drawer — no new navigation model to maintain).

import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Home, CircleDot, ShoppingBag, Trophy, Menu } from "lucide-react";

export function MobileBottomNav() {
  const track = useStudyStore((s) => s.track);
  const view = useStudyStore((s) => s.view);
  const setView = useStudyStore((s) => s.setView);
  const setSidebar = useStudyStore((s) => s.setSidebar);
  const meta = SUBJECT_META[track];

  const items = [
    { id: meta.dash, label: "Home", icon: Home },
    { id: meta.mcq, label: "Practice", icon: CircleDot },
    { id: "shop" as const, label: "Shop", icon: ShoppingBag },
    { id: meta.ach, label: "Awards", icon: Trophy },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong glass-interactive border-t border-border/50 pb-safe"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 h-14">
        {items.map((it) => {
          const active = view === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id as never)}
              className="relative flex flex-col items-center justify-center gap-0.5 active:scale-90 transition-transform duration-200"
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary animate-pop-in" />}
              <Icon
                className={`size-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${active ? "text-foreground scale-110" : "text-muted-foreground/60"}`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className={`text-[10px] leading-none transition-colors ${active ? "text-foreground font-semibold" : "text-muted-foreground/60"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setSidebar(true)}
          className="press-scale relative flex flex-col items-center justify-center gap-0.5 text-muted-foreground/60"
          aria-label="More"
        >
          <Menu className="size-5" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
