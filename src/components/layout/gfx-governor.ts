"use client";

import { useEffect } from "react";
import { useStudyStore, type GfxLevel } from "@/store/use-study-store";

/**
 * Adaptive visual quality.
 *
 * Liquid glass is genuinely expensive: every blurred panel has to be re-blurred
 * whenever the pixels behind it change. A fast desktop GPU shrugs that off; a
 * modest laptop or a phone doesn't, and the symptom is exactly "it feels
 * jittery". We can't know in advance which machine this is running on, so
 * rather than guess, this watches the page's real frame times — but only while
 * the student is actually scrolling or moving the pointer, never while idle —
 * and steps the effects down one notch at a time (high → balanced → lite) if
 * it genuinely can't keep up. The level it settles on is saved, so the next
 * visit starts there instead of re-learning.
 *
 * It never steps back UP on its own (no flapping); that's what the Visual
 * quality control in Settings is for.
 */

const ORDER: GfxLevel[] = ["high", "balanced", "lite"];
const LABEL: Record<GfxLevel, string> = { high: "High", balanced: "Balanced", lite: "Lite" };

const INIT_KEY = "studyhub-gfx-init";
const WARMUP_MS = 4000;   // page load / hydration is always janky — don't judge it
const IDLE_MS = 700;      // stop sampling this long after the last input
const WINDOW_MS = 2200;   // of ACTIVE interaction per verdict (a slow device only manages ~7 fps, so a
                          // fixed frame count would take 10+ seconds of scrolling to ever decide)
const MIN_SAMPLES = 12;
const MAX_SAMPLES = 120;
const SLOW_MS = 42;       // a 75th-percentile frame slower than this ≈ under 24 fps
const STRIKES = 2;        // consecutive slow verdicts before stepping down

export function useGfxGovernor() {
  const quality = useStudyStore((s) => s.gfxQuality);
  const level = useStudyStore((s) => s.gfxLevel);
  const setGfxLevel = useStudyStore((s) => s.setGfxLevel);
  const pushToast = useStudyStore((s) => s.pushToast);

  // First run on a device: start weaker hardware a notch down instead of making
  // it fail in front of the student first.
  useEffect(() => {
    if (quality !== "auto") return;
    try {
      if (window.localStorage.getItem(INIT_KEY)) return;
      window.localStorage.setItem(INIT_KEY, "1");
    } catch {
      return;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak =
      (nav.hardwareConcurrency || 8) <= 4 ||
      (nav.deviceMemory || 8) <= 4 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (weak && useStudyStore.getState().gfxLevel === "high") setGfxLevel("balanced");
  }, [quality, setGfxLevel]);

  useEffect(() => {
    if (quality !== "auto" || level === "lite") return;

    let samples: number[] = [];
    let activeMs = 0;
    let strikes = 0;
    let lastInput = 0;
    let prev = 0;
    let raf = 0;
    let running = false;
    const quietUntil = performance.now() + WARMUP_MS;

    const verdict = () => {
      const sorted = [...samples].sort((a, b) => a - b);
      const p75 = sorted[Math.floor(sorted.length * 0.75)];
      samples = [];
      activeMs = 0;
      strikes = p75 > SLOW_MS ? strikes + 1 : 0;
      if (strikes < STRIKES) return;
      const next = ORDER[ORDER.indexOf(level) + 1];
      if (!next) return;
      setGfxLevel(next); // re-runs this effect: fresh counters, fresh warm-up
      pushToast("⚡", `Switched to ${LABEL[next]} visuals for smoother scrolling — change it in Settings → Appearance`, "info");
    };

    const loop = (t: number) => {
      if (document.hidden) {
        running = false;
        return;
      }
      const dt = t - prev;
      prev = t;
      if (t >= quietUntil && dt > 0 && dt < 400) {
        samples.push(dt);
        activeMs += dt;
        if ((activeMs >= WINDOW_MS && samples.length >= MIN_SAMPLES) || samples.length >= MAX_SAMPLES) verdict();
      }
      if (t - lastInput < IDLE_MS) raf = requestAnimationFrame(loop);
      else running = false;
    };

    const poke = () => {
      lastInput = performance.now();
      if (!running && !document.hidden) {
        running = true;
        prev = lastInput;
        raf = requestAnimationFrame(loop);
      }
    };

    const opts = { passive: true, capture: true } as const;
    const events = ["pointermove", "wheel", "scroll", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, poke, opts));
    return () => {
      events.forEach((e) => window.removeEventListener(e, poke, opts));
      cancelAnimationFrame(raf);
    };
  }, [quality, level, setGfxLevel, pushToast]);
}
