"use client";

import { useStudyStore } from "@/store/use-study-store";
import { fireConfetti } from "./helpers";
import { useEffect } from "react";
import { X, Sparkles, Rocket } from "lucide-react";

export function ToastContainer() {
  const toasts = useStudyStore((s) => s.toasts);
  const dismiss = useStudyStore((s) => s.dismissToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto glass-strong rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg animate-float-up ${
            t.type === "success" ? "border-l-4 border-l-emerald-500"
            : t.type === "error" ? "border-l-4 border-l-rose-500"
            : t.type === "ach" ? "border-l-4 border-l-amber-400"
            : "border-l-4 border-l-sky-400"
          }`}
        >
          <span className="text-lg leading-none mt-0.5">{t.icon}</span>
          <span className="text-sm flex-1 leading-snug">{t.msg}</span>
          <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground transition shrink-0">
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

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-float-up"
      onClick={close}
    >
      <div
        className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {popup.type === "ach" ? (
          <>
            <div className="text-6xl mb-3 animate-pop-in">{popup.data.icon}</div>
            <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-1">Achievement Unlocked</div>
            <div className="font-display text-2xl font-bold mb-1">{popup.data.title}</div>
            <div className="text-sm text-muted-foreground mb-4">{popup.data.sub}</div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-300 font-bold text-sm mb-6">
              <Sparkles className="size-4" /> +{popup.data.xp} XP
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-3">🚀</div>
            <div className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Level Up</div>
            <div className="font-display text-2xl font-bold mb-1">Level {popup.data.level} Unlocked!</div>
            <div className="text-sm text-muted-foreground mb-6">Keep going — you&apos;re on a roll.</div>
          </>
        )}
        <button
          onClick={close}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          {popup.type === "ach" ? <Sparkles className="size-4" /> : <Rocket className="size-4" />}
          Awesome!
        </button>
      </div>
    </div>
  );
}
