"use client";

import { useStudyStore } from "@/store/use-study-store";
import { fireConfetti } from "./helpers";
import { useEffect } from "react";
import { X, Sparkles, Rocket, Coins } from "lucide-react";

export function ToastContainer() {
  const toasts = useStudyStore((s) => s.toasts);
  const dismiss = useStudyStore((s) => s.dismissToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-none pt-safe">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto glass-strong glass-interactive rounded-2xl px-4 py-3 flex items-start gap-3 shadow-lg animate-float-up border border-border/60 ${
            t.type === "success" ? "border-l-4 border-l-emerald-500"
            : t.type === "error" ? "border-l-4 border-l-rose-500"
            : t.type === "ach" ? "border-l-4 border-l-amber-400"
            : "border-l-4 border-l-foreground/40"
          }`}
        >
          <span className="text-lg leading-none mt-0.5">{t.icon}</span>
          <span className="text-sm flex-1 leading-snug font-medium">{t.msg}</span>
          <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground transition shrink-0 rounded-full p-0.5 hover:bg-accent">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function PopupLayer() {
  const popup = useStudyStore((s) => s.popup);
  const close = useStudyStore((s) => s.closePopup);

  useEffect(() => {
    if (popup.type) fireConfetti();
  }, [popup.type]);

  if (!popup.type) return null;
  const isAch = popup.type === "ach";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-float-up"
      onClick={close}
    >
      <div
        className="glass-strong rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in border border-border/60 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 size-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: isAch ? "oklch(0.8 0.15 80 / 35%)" : "var(--glow)" }}
        />
        <div className="relative">
          <div className="text-6xl mb-3 animate-pop-in drop-shadow-sm">{popup.data.icon || (isAch ? "🏆" : "🚀")}</div>
          <div className={`text-xs font-bold tracking-[0.2em] uppercase mb-1.5 ${isAch ? "text-amber-400" : "text-foreground"}`}>
            {isAch ? "Achievement Unlocked" : "Level Up"}
          </div>
          <div className="font-display text-2xl font-bold mb-1 text-balance">
            {isAch ? popup.data.title : `Level ${popup.data.level}`}
          </div>
          <div className="text-sm text-muted-foreground mb-5">
            {isAch ? popup.data.sub : popup.data.sub || "Keep going — you're on a roll."}
          </div>
          {isAch && popup.data.xp ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-300 font-bold text-sm mb-6">
              <Sparkles className="size-4" /> +{popup.data.xp} XP
            </div>
          ) : !isAch ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-foreground font-bold text-sm mb-6">
              <Coins className="size-4" /> Bonus coins earned
            </div>
          ) : null}
          <button
            onClick={close}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-lg"
          >
            {isAch ? <Sparkles className="size-4" /> : <Rocket className="size-4" />}
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
