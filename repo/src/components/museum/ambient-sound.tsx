"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Procedural ambient library sound — generated via Web Audio API, no files.
// A low warm drone + occasional distant tones + subtle air hiss.
export function AmbientSound({ active }: { active: boolean }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!active) {
      // stop sound when leaving museum
      if (masterRef.current) {
        masterRef.current.gain.setTargetAtTime(0, (ctxRef.current?.currentTime || 0), 0.5);
      }
      return;
    }
    if (!enabled) return;
    if (ctxRef.current) {
      // resume if suspended
      if (ctxRef.current.state === "suspended") ctxRef.current.resume();
      masterRef.current?.gain.setTargetAtTime(0.3, ctxRef.current.currentTime, 1);
      return;
    }

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      masterRef.current = master;

      // Fade in
      master.gain.setTargetAtTime(0.3, ctx.currentTime, 1.5);

      // 1. Low warm drone (two detuned oscillators)
      const drone1 = ctx.createOscillator();
      drone1.type = "sine";
      drone1.frequency.value = 55; // A1
      const drone2 = ctx.createOscillator();
      drone2.type = "sine";
      drone2.frequency.value = 82.5; // perfect fifth
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.15;
      drone1.connect(droneGain);
      drone2.connect(droneGain);
      droneGain.connect(master);
      drone1.start();
      drone2.start();

      // Slow LFO on drone gain for breathing effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.06;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      lfo.start();

      // 2. Air hiss — filtered noise
      const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 400;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.025;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      // 3. Occasional distant tones (like a quiet bell or page turn)
      const toneInterval = setInterval(() => {
        if (!ctxRef.current || ctxRef.current.state !== "running") return;
        const freqs = [220, 277, 330, 440]; // A3, C#4, E4, A4
        const freq = freqs[Math.floor(Math.random() * freqs.length)];
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = 0;
        const now = ctx.currentTime;
        g.gain.setTargetAtTime(0.04, now, 0.5);
        g.gain.setTargetAtTime(0, now + 2, 1.5);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + 6);
      }, 8000 + Math.random() * 6000);

      nodesRef.current = [drone1, drone2, lfo, noise];

      return () => {
        clearInterval(toneInterval);
        if (masterRef.current) {
          masterRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
        }
        setTimeout(() => {
          nodesRef.current.forEach((n) => { try { (n as OscillatorNode).stop?.(); } catch { /* already stopped */ } });
          ctx.close();
          ctxRef.current = null;
        }, 1000);
      };
    } catch {
      // AudioContext not available
    }
  }, [active, enabled]);

  const toggle = () => setEnabled((e) => !e);

  if (!active) return null;

  return (
    <button
      onClick={toggle}
      className="absolute top-4 right-4 z-20 glass-strong rounded-full size-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition opacity-50 hover:opacity-100"
      aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
      title={enabled ? "Ambient sound ON — click to mute" : "Ambient sound OFF — click to enable"}
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
    </button>
  );
}
