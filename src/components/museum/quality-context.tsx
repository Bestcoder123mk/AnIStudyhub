"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { PerformanceMonitor } from "@react-three/drei";

/**
 * One FPS watcher for the whole museum scene, shared via context so every
 * expensive material (right now: the reflective marble floors) can drop to
 * a cheaper variant together instead of each guessing independently.
 *
 * This directly targets the "budget Android phone will chug" note in
 * worklog.md — instead of a fixed low-end/high-end branch decided once,
 * it reacts to the actual sustained frame rate during the session.
 */
export type QualityTier = "high" | "low";

const QualityContext = createContext<QualityTier>("high");
export const useMuseumQuality = () => useContext(QualityContext);

export function MuseumQualityProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<QualityTier>("high");

  return (
    <QualityContext.Provider value={tier}>
      <PerformanceMonitor
        // 2 consecutive bad windows before downgrading, 3 good ones before
        // upgrading back — avoids flickering between tiers on borderline
        // hardware, which would be more distracting than just staying low.
        flipflops={3}
        onDecline={() => setTier("low")}
        onIncline={() => setTier("high")}
      />
      {children}
    </QualityContext.Provider>
  );
}
