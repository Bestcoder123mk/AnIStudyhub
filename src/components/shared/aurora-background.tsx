"use client";

import { useEffect, useRef } from "react";
import { useStudyStore, ROOMS } from "@/store/use-study-store";

// Animated aurora gradient background — a fixed canvas layer behind the 2D UI.
// Uses the current room's hue. Respects prefers-reduced-motion.
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomId = useStudyStore((s) => s.room);
  const theme = useStudyStore((s) => s.theme);
  const view = useStudyStore((s) => s.view);

  const isMuseum = view === "museum";
  const room = ROOMS.find((r) => r.id === roomId) || ROOMS[0];
  const hue = room.ambientHue;

  useEffect(() => {
    if (isMuseum) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMX = 0.5;
    let targetMY = 0.5;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      targetMX = e.clientX / window.innerWidth;
      targetMY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const render = () => {
      t += reduced ? 0 : 0.003;
      mouseX += (targetMX - mouseX) * 0.05;
      mouseY += (targetMY - mouseY) * 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (room.bg) {
        ctx.fillStyle = `hsl(${hue}, 30%, 6%)`;
      } else {
        ctx.fillStyle = theme === "daylight" || theme === "sepia" ? `hsl(${hue}, 20%, 92%)` : `hsl(${hue}, 25%, 5%)`;
      }
      ctx.fillRect(0, 0, w, h);

      if (!reduced) {
        // 3 blobs — first follows mouse, others drift
        const blobs = [
          { x: mouseX, y: mouseY, r: 0.45, hueOff: 0, alpha: 0.14 },
          { x: 0.7 + Math.cos(t * 1.1) * 0.12, y: 0.6 + Math.sin(t * 0.9) * 0.08, r: 0.4, hueOff: 30, alpha: 0.10 },
          { x: 0.3 + Math.sin(t * 0.7) * 0.1, y: 0.4 + Math.cos(t * 1.2) * 0.12, r: 0.45, hueOff: -20, alpha: 0.08 },
        ];
        blobs.forEach((b) => {
          const cx = b.x * w;
          const cy = b.y * h;
          const radius = b.r * Math.max(w, h);
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          grad.addColorStop(0, `hsla(${(hue + b.hueOff + 360) % 360}, 70%, 55%, ${b.alpha})`);
          grad.addColorStop(1, `hsla(${(hue + b.hueOff + 360) % 360}, 70%, 55%, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        });
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [hue, theme, room.bg, isMuseum]);

  if (isMuseum) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: room.bg || undefined }}
      aria-hidden
    />
  );
}
