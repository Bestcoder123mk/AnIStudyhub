"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useStudyStore, type Track } from "@/store/use-study-store";
import { ChevronLeft, MousePointer2, Move } from "lucide-react";

const MuseumCanvas = dynamic(
  () => import("./museum-canvas").then((m) => m.MuseumCanvas),
  { ssr: false, loading: () => <MuseumLoading /> }
);

import { AmbientSound } from "./ambient-sound";

function MuseumLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl mb-2 animate-pulse opacity-50">🏛️</div>
        <div className="text-xs text-muted-foreground">Opening the library…</div>
      </div>
    </div>
  );
}

interface WalkthroughProgress { index: number; total: number; label: string; }

export function MuseumView() {
  const storeTrack = useStudyStore((s) => s.track);
  const [mode, setMode] = useState<"lobby" | "wing" | "walkthrough">("lobby");
  const [wingTrack, setWingTrack] = useState<Track>(storeTrack);
  const [walkthroughChapter, setWalkthroughChapter] = useState<number | null>(null);
  const [progress, setProgress] = useState<WalkthroughProgress | null>(null);

  const enterWing = (t: Track) => { setWingTrack(t); setMode("wing"); };
  const backToLobby = () => { setMode("lobby"); setWalkthroughChapter(null); setProgress(null); };
  const enterWalkthrough = (chapterId: number) => { setWalkthroughChapter(chapterId); setMode("walkthrough"); };
  const exitWalkthrough = () => { setWalkthroughChapter(null); setMode("wing"); setProgress(null); };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 1rem)" }}>
      <MuseumCanvas
        mode={mode}
        track={wingTrack}
        walkthroughChapter={walkthroughChapter}
        onPickSubject={enterWing}
        onBack={backToLobby}
        onEnterWalkthrough={enterWalkthrough}
        onExitWalkthrough={exitWalkthrough}
        onProgress={setProgress}
      />

      {/* Ambient sound toggle (top-right) */}
      <AmbientSound active={true} />

      {/* Minimal UI — a tiny back button in wing/walkthrough mode */}
      {mode === "wing" && (
        <button
          onClick={backToLobby}
          className="absolute top-4 left-4 z-20 glass-strong rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 opacity-70 hover:opacity-100"
        >
          <ChevronLeft className="size-3" /> Library
        </button>
      )}
      {mode === "walkthrough" && (
        <button
          onClick={exitWalkthrough}
          className="absolute top-4 left-4 z-20 glass-strong rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 opacity-70 hover:opacity-100"
        >
          <ChevronLeft className="size-3" /> Wing
        </button>
      )}

      {/* Walkthrough progress stepper — a quiet stadium pill, top-center,
          only present while inside a chapter walkthrough. Dots fill in as
          you pass each station so the walk always reads as "N of M", the
          same visual grammar as a well-made onboarding flow. */}
      {mode === "walkthrough" && progress && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-strong rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2.5 pointer-events-none">
          <div className="flex items-center gap-1">
            {Array.from({ length: progress.total }, (_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === progress.index - 1 ? 12 : 4,
                  height: 4,
                  background: i < progress.index ? "var(--primary)" : "color-mix(in oklch, var(--foreground) 18%, transparent)",
                }}
              />
            ))}
          </div>
          <span className="text-[10.5px] font-medium text-muted-foreground whitespace-nowrap">{progress.label}</span>
        </div>
      )}

      {/* Tiny controls hint — bottom center, auto-fades */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><MousePointer2 className="size-2.5" /> Drag</span>
          <span className="flex items-center gap-1"><Move className="size-2.5" /> WASD</span>
        </div>
      </div>
    </div>
  );
}
