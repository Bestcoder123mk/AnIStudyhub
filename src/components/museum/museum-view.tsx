"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStudyStore, type Track } from "@/store/use-study-store";
import { ChevronLeft, MousePointer2, Move } from "lucide-react";
import { ExhibitOverlay, type ExhibitTour } from "./exhibit-overlay";
import { StationOverlay, type StationData } from "./station-overlay";
import { TouchJoystick } from "./touch-joystick";
import { MiniMap } from "./mini-map";
import { hasTouchSupport } from "./touch-input";
import type { ExhibitDefinition } from "./exhibits/types";

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
  const [focusExhibit, setFocusExhibit] = useState<ExhibitDefinition | null>(null);
  const [exhibitTour, setExhibitTour] = useState<ExhibitTour | null>(null);
  const [focusStation, setFocusStation] = useState<StationData | null>(null);
  // Checked client-side only (touch APIs don't exist during SSR) — gates
  // the on-screen joystick so desktop/mouse users never see it, matching
  // touch-joystick.tsx's own doc comment on how it's meant to be mounted.
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(hasTouchSupport()); }, []);

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
        onEnterWalkthrough={enterWalkthrough}
        onExitWalkthrough={exitWalkthrough}
        onProgress={setProgress}
        onFocusExhibit={(exhibit, tour) => { setFocusExhibit(exhibit); setExhibitTour(tour ?? null); }}
        onFocusStation={setFocusStation}
      />

      {/* Model Focus Viewer — a dedicated full-screen inspector, opened by
          clicking the "Focus" pill next to any 3D exhibit (in the wing or
          the walkthrough). Lives outside the R3F <Canvas> since it mounts
          its own Canvas for the close-up view. */}
      {focusExhibit && (
        <ExhibitOverlay
          exhibit={focusExhibit}
          onClose={() => { setFocusExhibit(null); setExhibitTour(null); }}
          onContinueTour={exhibitTour ? () => { setFocusExhibit(null); setExhibitTour(null); exhibitTour.onContinueTour?.(); } : undefined}
          isLastStop={exhibitTour?.isLastStop}
        />
      )}

      {/* Station Focus Viewer — the walkthrough's text-heavy stations (Core
          Concept, Key Points, Formula Sheet, Exam Tips, PYQ, Short/Long
          Answer) had no way to read at full size; the small in-world panel
          was the only view, cramped on a phone especially. StationOverlay
          existed fully built but was never wired to anything — this is
          that wiring. Continue Tour steps to the next station in the same
          list rather than closing back to 3D each time. */}
      {focusStation && <StationOverlay data={focusStation} onClose={() => setFocusStation(null)} />}

      {/* Ambient sound toggle (bottom-right, see ambient-sound.tsx) */}
      <AmbientSound active={true} />

      {/* Minimap — was built (mini-map.tsx) but never actually mounted, so
          it never rendered. Skipped during walkthrough: that mode already
          has its own "station N of M" stepper below, which is a more
          useful progress readout for a single-chapter walk than a map of
          the whole wing would be. */}
      {mode !== "walkthrough" && <MiniMap mode={mode} track={wingTrack} />}

      {/* Touch joystick — same story as the minimap: fully built
          (touch-joystick.tsx) but never mounted, so on a phone there was
          drag-to-look and no way at all to move. Renders in every mode
          WalkControls is active in. */}
      {isTouch && <TouchJoystick />}

      {/* Minimal UI — a tiny back button in wing/walkthrough mode */}
      {mode === "wing" && (
        <button
          onClick={backToLobby}
          className="glass-clear glass-interactive glass-refract-sm absolute top-4 left-4 z-20 rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 opacity-90 hover:opacity-100"
        >
          <ChevronLeft className="size-3" /> Library
        </button>
      )}
      {mode === "walkthrough" && (
        <button
          onClick={exitWalkthrough}
          className="glass-clear glass-interactive glass-refract-sm absolute top-4 left-4 z-20 rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 opacity-90 hover:opacity-100"
        >
          <ChevronLeft className="size-3" /> Wing
        </button>
      )}

      {/* Walkthrough progress stepper — a quiet stadium pill, top-center,
          only present while inside a chapter walkthrough. Dots fill in as
          you pass each station so the walk always reads as "N of M", the
          same visual grammar as a well-made onboarding flow. */}
      {mode === "walkthrough" && progress && (
        <div className="glass-clear glass-refract-sm absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full pl-3 pr-4 py-1.5 flex items-center gap-2.5 pointer-events-none">
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
          <span className="flex items-center gap-1"><MousePointer2 className="size-2.5" /> Drag to look</span>
          {isTouch ? (
            <span className="flex items-center gap-1"><Move className="size-2.5" /> Joystick to move</span>
          ) : (
            <span className="flex items-center gap-1"><Move className="size-2.5" /> WASD to move</span>
          )}
        </div>
      </div>
    </div>
  );
}
