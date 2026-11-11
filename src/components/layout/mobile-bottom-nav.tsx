"use client";

// The dock: a floating Liquid Glass tab bar. The selection is a single glass bubble that slides
// (spring) from tab to tab instead of cross-fading — the "morph" the material is known for.
// Corners are concentric: 30px dock − 6px padding = 24px bubble (see .dock / .dock-bubble).
// The five most common destinations are one tap away; everything else is behind "More", which
// opens the existing drawer.

import { motion } from "framer-motion";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Home, CircleDot, ShoppingBag, Trophy, Menu } from "lucide-react";

export function MobileBottomNav() {
  const track = useStudyStore((s) => s.track);
  const view = useStudyStore((s) => s.view);
  const setView = useStudyStore((s) => s.setView);
  const setSidebar = useStudyStore((s) => s.setSidebar);
  const meta = SUBJECT_META[track];

  const items = [
    { id: meta.dash, label: "Learn", icon: Home },
    { id: meta.mcq, label: "Practice", icon: CircleDot },
    { id: "shop" as const, label: "Shop", icon: ShoppingBag },
    { id: meta.ach, label: "Awards", icon: Trophy },
  ];

  return (
    <nav className="dock lg:hidden glass-strong" aria-label="Primary">
      <div className="grid grid-cols-5 gap-1">
        {items.map((it) => {
          const active = view === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id as never)}
              className="relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="dock-bubble"
                  className="dock-bubble"
                  transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.9 }}
                />
              )}
              <Icon
                className={`relative size-[22px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={active ? 2.7 : 2.2}
                fill={active ? "color-mix(in oklch, currentColor 22%, transparent)" : "none"}
              />
              <span className={`relative text-[11px] font-extrabold leading-none ${active ? "text-foreground" : "text-muted-foreground"}`}>
                {it.label}
              </span>
            </button>
          );
        })}
        <button
          onClick={() => setSidebar(true)}
          className="relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[24px] text-muted-foreground outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="More"
        >
          <Menu className="size-[22px]" strokeWidth={2.2} />
          <span className="text-[11px] font-extrabold leading-none">More</span>
        </button>
      </div>
    </nav>
  );
}
