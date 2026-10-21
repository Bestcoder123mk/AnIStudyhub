"use client";

import { useEffect, useRef } from "react";
import { useStudyStore, ROOMS } from "@/store/use-study-store";

// Animated aurora gradient background — a fixed canvas layer behind the 2D UI.
// Uses the current room's hue. Respects prefers-reduced-motion.
//
// This light is what makes the glass read as glass: backdrop-filter has nothing
// to blur, saturate or bend over a flat dark page, so panels would just look
// like grey boxes. Three soft blobs spread across the colour wheel (the room's
// hue, a step toward violet, and a step toward rose) give every pane something
// to pick colour up from. Reduced motion keeps the light but holds it still.
//
// PERFORMANCE — this canvas sits behind every blurred panel, so every time it
// changes, every panel has to be re-blurred. The old version redrew the full
// viewport at 60 fps forever, which alone kept a CPU core busy while the app
// was doing nothing. Now:
//   • it is drawn at a quarter of the screen size and stretched by CSS — the
//     light is smooth, so it looks identical with 1/16th of the pixels;
//   • it is capped at 24 fps (15 on the Balanced level) — drift this slow
//     doesn't need more;
//   • it only moves for a few seconds after the last pointer / scroll / key
//     input, then holds still, so an idle page costs nothing;
//   • it pauses when the tab is hidden; and on the Lite level (or with reduced
//     motion) it is drawn once and never animated.
const SCALE = 0.25;
const AMBIENT_MS = 5000;

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomId = useStudyStore((s) => s.room);
  const theme = useStudyStore((s) => s.theme);
  const view = useStudyStore((s) => s.view);
  const gfxQuality = useStudyStore((s) => s.gfxQuality);
  const gfxLevel = useStudyStore((s) => s.gfxLevel);
  const level = gfxQuality === "auto" ? gfxLevel : gfxQuality;

  const isMuseum = view === "museum";
  const room = ROOMS.find((r) => r.id === roomId) || ROOMS[0];
  const hue = room.ambientHue;

  useEffect(() => {
    if (isMuseum) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = reduced || level === "lite";
    const frameGap = level === "balanced" ? 1000 / 15 : 1000 / 24;

    let t = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMX = 0.5;
    let targetMY = 0.5;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastInput = performance.now();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (room.bg) {
        ctx.fillStyle = `hsl(${hue}, 30%, 6%)`;
      } else {
        ctx.fillStyle = theme === "daylight" || theme === "sepia" ? `hsl(${hue}, 20%, 92%)` : `hsl(${hue}, 25%, 5%)`;
      }
      ctx.fillRect(0, 0, w, h);

      // 3 blobs — the first follows the pointer, the others drift (all still when motion is reduced)
      const light = theme === "daylight" || theme === "sepia";
      const k = light ? 0.5 : 1; // on a pale canvas the same alpha reads as muddy, not luminous
      const blobs = [
        { x: mouseX, y: mouseY, r: 0.5, hueOff: 0, alpha: 0.27 * k },
        { x: 0.74 + Math.cos(t * 1.1) * 0.12, y: 0.62 + Math.sin(t * 0.9) * 0.08, r: 0.5, hueOff: 78, alpha: 0.24 * k },
        { x: 0.26 + Math.sin(t * 0.7) * 0.1, y: 0.36 + Math.cos(t * 1.2) * 0.12, r: 0.52, hueOff: 165, alpha: 0.2 * k },
      ];
      blobs.forEach((b) => {
        const cx = b.x * w;
        const cy = b.y * h;
        const radius = b.r * Math.max(w, h);
        const hh = (hue + b.hueOff + 360) % 360;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `hsla(${hh}, 70%, 55%, ${b.alpha})`);
        grad.addColorStop(1, `hsla(${hh}, 70%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    };

    const resize = () => {
      canvas.width = Math.max(160, Math.round(window.innerWidth * SCALE));
      canvas.height = Math.max(100, Math.round(window.innerHeight * SCALE));
      draw(); // resizing a canvas clears it
    };

    const loop = (now: number) => {
      if (document.hidden || still) {
        running = false;
        return;
      }
      const dt = now - last;
      if (dt >= frameGap) {
        last = now;
        const frames = Math.min(dt / 16.7, 4); // keep drift speed independent of the frame cap
        t += 0.003 * frames;
        const ease = 1 - Math.pow(0.95, frames);
        mouseX += (targetMX - mouseX) * ease;
        mouseY += (targetMY - mouseY) * ease;
        draw();
      }
      if (now - lastInput < AMBIENT_MS) raf = requestAnimationFrame(loop);
      else running = false;
    };

    const wake = () => {
      lastInput = performance.now();
      if (running || still || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      targetMX = e.clientX / window.innerWidth;
      targetMY = e.clientY / window.innerHeight;
      wake();
    };

    resize();
    window.addEventListener("resize", resize);
    const passive = { passive: true } as const;
    window.addEventListener("pointermove", onMove, passive);
    window.addEventListener("keydown", wake, passive);
    window.addEventListener("wheel", wake, passive);
    window.addEventListener("scroll", wake, { passive: true, capture: true });
    document.addEventListener("visibilitychange", wake);
    wake(); // drift briefly on load, then settle

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("scroll", wake, { capture: true });
      document.removeEventListener("visibilitychange", wake);
    };
  }, [hue, theme, room.bg, isMuseum, level]);

  if (isMuseum) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      style={{ background: room.bg || undefined }}
      aria-hidden
    />
  );
}
