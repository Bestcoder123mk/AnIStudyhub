"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { LibraryLobby } from "./gallery";
import { LibraryWing } from "./chapter-room";
import { ChapterWalkthrough } from "./chapter-walkthrough";
import type { Track } from "@/store/use-study-store";

export function MuseumCanvas({
  mode,
  track,
  walkthroughChapter,
  onPickSubject,
  onBack,
  onEnterWalkthrough,
  onExitWalkthrough,
  onProgress,
}: {
  mode: "lobby" | "wing" | "walkthrough";
  track: Track;
  walkthroughChapter?: number | null;
  onPickSubject: (t: Track) => void;
  onBack: () => void;
  onEnterWalkthrough: (chapterId: number) => void;
  onExitWalkthrough: () => void;
  onProgress?: (p: { index: number; total: number; label: string } | null) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.7, 8], fov: 55, near: 0.1, far: 120 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
    >
      {mode === "lobby" ? (
        <LibraryLobby onPickSubject={onPickSubject} currentTrack={track} />
      ) : mode === "walkthrough" && walkthroughChapter != null ? (
        <ChapterWalkthrough track={track} chapterId={walkthroughChapter} onBack={onExitWalkthrough} onProgress={onProgress} />
      ) : (
        <LibraryWing track={track} onBack={onBack} onEnterWalkthrough={onEnterWalkthrough} />
      )}
    </Canvas>
  );
}
