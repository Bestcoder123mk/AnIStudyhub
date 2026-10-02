"use client";

// A tiny synthesized sound-effect engine — everything here is generated via
// Web Audio API oscillators, so there are no asset files to fetch and it
// works offline. Mirrors the pattern in ambient-sound.tsx (procedural,
// no dependencies) but for short, one-shot feedback instead of a drone.
//
// Respects the store's `soundEnabled` flag by reading it lazily at call
// time via a plain getter injected from the store module — these are
// imperative functions called from event handlers, not hooks.

let getEnabled: () => boolean = () => true;
export function bindSfxToggle(fn: () => boolean) {
  getEnabled = fn;
}

let sharedCtx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!getEnabled()) return null;
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    sharedCtx = new Ctx();
  }
  if (sharedCtx.state === "suspended") sharedCtx.resume();
  return sharedCtx;
}

function tone(c: AudioContext, freq: number, start: number, dur: number, opts: { type?: OscillatorType; gain?: number; glideTo?: number } = {}) {
  const osc = c.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  if (opts.glideTo) {
    osc.frequency.exponentialRampToValueAtTime(opts.glideTo, c.currentTime + start + dur);
  }
  const gain = c.createGain();
  const peak = opts.gain ?? 0.18;
  gain.gain.setValueAtTime(0, c.currentTime + start);
  gain.gain.linearRampToValueAtTime(peak, c.currentTime + start + Math.min(0.02, dur / 4));
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

/** A bright, quick two-note lift — for a correct answer. */
export function playCorrect() {
  const c = ctx();
  if (!c) return;
  tone(c, 880, 0, 0.12, { type: "triangle", gain: 0.15 });
  tone(c, 1318.5, 0.08, 0.16, { type: "triangle", gain: 0.14 });
}

/** A soft, low, brief tone — deliberately gentle, not punishing. */
export function playWrong() {
  const c = ctx();
  if (!c) return;
  tone(c, 220, 0, 0.16, { type: "sine", gain: 0.1, glideTo: 175 });
}

/** A short rising arpeggio — for level-ups and XP milestones. */
export function playLevelUp() {
  const c = ctx();
  if (!c) return;
  [523.25, 659.25, 784, 1046.5].forEach((f, i) => tone(c, f, i * 0.07, 0.18, { type: "triangle", gain: 0.13 }));
}

/** A sparkly, slightly detuned chime — for achievement unlocks. */
export function playAchievement() {
  const c = ctx();
  if (!c) return;
  [659.25, 987.77, 1318.5].forEach((f, i) => {
    tone(c, f, i * 0.05, 0.4, { type: "sine", gain: 0.1 });
    tone(c, f * 1.005, i * 0.05, 0.4, { type: "sine", gain: 0.06 });
  });
}
