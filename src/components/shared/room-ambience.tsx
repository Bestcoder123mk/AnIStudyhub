"use client";

import { useEffect, useRef } from "react";
import { useStudyStore, ROOMS } from "@/store/use-study-store";

// Every focus Room already carries a `soundPreset` (rain / cafe / forest /
// space / ocean / fire / wind) — until now that field was only ever read
// to populate the picker in Settings, and the museum had its own separate,
// fixed "library" drone that played nowhere else. This makes the room's
// sound real, and plays it wherever you are in the app (not just the
// museum), fading between presets when you switch rooms or navigate.
//
// Fully procedural (Web Audio oscillators + filtered noise) — no asset
// files, so it works offline and needs no network.

type Preset = "none" | "rain" | "cafe" | "forest" | "space" | "ocean" | "fire" | "wind";

function makeNoiseBuffer(ctx: AudioContext, seconds = 2) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function RoomAmbience() {
  const room = useStudyStore((s) => s.room);
  const soundEnabled = useStudyStore((s) => s.soundEnabled);
  const preset: Preset = (ROOMS.find((r) => r.id === room)?.soundPreset ?? "none") as Preset;

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Ambient audio needs a user gesture before browsers allow it to start.
    // We lazily create the AudioContext on the first click/keydown anywhere,
    // then let the preset effect (below) drive it from then on.
    const start = () => { startedRef.current = true; };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  useEffect(() => {
    // Tear down whatever preset was playing before building the next one.
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!soundEnabled || preset === "none") {
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.6);
      }
      return;
    }

    let cancelled = false;
    const tryStart = () => {
      if (cancelled) return;
      if (!startedRef.current) {
        // Not interacted yet — try again shortly rather than looping tight.
        const t = setTimeout(tryStart, 400);
        cleanupRef.current = () => clearTimeout(t);
        return;
      }
      try {
        if (!ctxRef.current) {
          const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          ctxRef.current = new Ctx();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        if (!masterRef.current) {
          const master = ctx.createGain();
          master.gain.value = 0;
          master.connect(ctx.destination);
          masterRef.current = master;
        }
        const master = masterRef.current;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(0.22, ctx.currentTime, 1.2);

        const nodes: { stop?: () => void }[] = [];
        const timers: ReturnType<typeof setInterval>[] = [];

        const noise = ctx.createBufferSource();
        noise.buffer = makeNoiseBuffer(ctx, 3);
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        const noiseGain = ctx.createGain();
        noise.connect(filter).connect(noiseGain).connect(master);

        const cfg: Record<Exclude<Preset, "none">, { type: BiquadFilterType; freq: number; gain: number }> = {
          rain: { type: "highpass", freq: 900, gain: 0.16 },
          cafe: { type: "lowpass", freq: 700, gain: 0.1 },
          forest: { type: "bandpass", freq: 1400, gain: 0.05 },
          space: { type: "lowpass", freq: 260, gain: 0.06 },
          ocean: { type: "lowpass", freq: 500, gain: 0.14 },
          fire: { type: "bandpass", freq: 900, gain: 0.09 },
          wind: { type: "lowpass", freq: 650, gain: 0.13 },
        };
        const c = cfg[preset as Exclude<Preset, "none">];
        filter.type = c.type;
        filter.frequency.value = c.freq;
        noiseGain.gain.value = c.gain;
        noise.start();
        nodes.push(noise);

        // A slow filter-cutoff LFO gives ocean swells / wind gusts / cafe murmur
        // their sense of movement instead of sounding like a flat hiss.
        if (preset === "ocean" || preset === "wind" || preset === "cafe") {
          const lfo = ctx.createOscillator();
          lfo.frequency.value = preset === "ocean" ? 0.12 : preset === "wind" ? 0.07 : 0.2;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = c.freq * 0.5;
          lfo.connect(lfoGain).connect(filter.frequency);
          lfo.start();
          nodes.push(lfo);
        }

        // A low drone underlays space and ocean for a sense of depth.
        if (preset === "space" || preset === "ocean") {
          const drone = ctx.createOscillator();
          drone.type = "sine";
          drone.frequency.value = preset === "space" ? 48 : 65;
          const droneGain = ctx.createGain();
          droneGain.gain.value = 0.05;
          drone.connect(droneGain).connect(master);
          drone.start();
          nodes.push(drone);
        }

        // Fire crackle — quick random amplitude flicker on a second noise layer.
        if (preset === "fire") {
          const flick = ctx.createGain();
          flick.gain.value = 0.06;
          const t = setInterval(() => {
            if (ctx.state !== "running") return;
            flick.gain.setTargetAtTime(0.02 + Math.random() * 0.08, ctx.currentTime, 0.03);
          }, 90);
          filter.connect(flick).connect(master);
          timers.push(t);
        }

        // Rain drips / forest chirps — sparse, quiet one-shot blips.
        if (preset === "rain" || preset === "forest") {
          const t = setInterval(() => {
            if (ctx.state !== "running") return;
            const osc = ctx.createOscillator();
            osc.type = "sine";
            const base = preset === "rain" ? 1200 + Math.random() * 900 : 1800 + Math.random() * 1200;
            osc.frequency.setValueAtTime(base, ctx.currentTime);
            if (preset === "forest") osc.frequency.exponentialRampToValueAtTime(base * 1.4, ctx.currentTime + 0.12);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
            osc.connect(g).connect(master);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          }, preset === "rain" ? 260 : 3200 + Math.random() * 2600);
          timers.push(t);
        }

        cleanupRef.current = () => {
          timers.forEach(clearInterval);
          nodes.forEach((n) => { try { n.stop?.(); } catch { /* already stopped */ } });
          try { noise.stop(); } catch { /* already stopped */ }
        };
      } catch {
        // Web Audio unavailable — ambience just stays silent.
      }
    };
    tryStart();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [preset, soundEnabled]);

  return null;
}
