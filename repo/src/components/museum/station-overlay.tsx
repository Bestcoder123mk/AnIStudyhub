"use client";
import { X, ChevronLeft, BookOpen, ArrowRight, Check } from "lucide-react";

interface StationData {
  stationId: string;
  title: string;
  icon: string;
  items: string[];
  accent: string;
  chapterTitle: string;
  chapterNum: string;
  isFormula?: boolean;
  onContinueTour?: () => void;
  isLastStop?: boolean;
}

export function StationOverlay({
  data,
  onClose,
}: {
  data: StationData;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[85] bg-background/95 backdrop-blur-md flex flex-col animate-float-up">
      {/* top bar */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border glass-strong">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="size-4" /> Room
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="size-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: `${data.accent}22`, border: `1px solid ${data.accent}55` }}
          >
            {data.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {data.chapterNum} · {data.chapterTitle}
            </div>
            <h2 className="font-display font-bold text-base sm:text-lg leading-tight truncate" style={{ color: data.accent }}>
              {data.title}
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${data.accent}1a`, color: data.accent }}>
            <BookOpen className="size-3" /> {data.items.length} items
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {data.items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No content recorded for this section yet.</p>
            </div>
          ) : data.isFormula ? (
            // Formula / Key Dates — render as a styled monospace block (preserves line structure)
            <div
              className="rounded-2xl p-5 sm:p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap glass"
              style={{ borderLeft: `3px solid ${data.accent}`, color: "var(--foreground)" }}
            >
              {data.items.join("\n")}
            </div>
          ) : (
            // List items — each a card
            <div className="space-y-3">
              {data.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 glass border-border animate-float-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="size-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `${data.accent}1f`, color: data.accent, border: `1px solid ${data.accent}40` }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/90 flex-1 whitespace-pre-wrap">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-3">
            <div className="text-[11px] text-muted-foreground">
              {data.items.length} items · {data.title}
            </div>
            {data.onContinueTour ? (
              <button
                onClick={data.onContinueTour}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90 flex items-center gap-1.5"
                style={{ background: data.accent }}
              >
                {data.isLastStop ? (<><Check className="size-3.5" /> Finish Tour</>) : (<>Continue Tour <ArrowRight className="size-3.5" /></>)}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
