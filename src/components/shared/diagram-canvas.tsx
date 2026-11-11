"use client";

// A small, dependency-free drawing surface for the diagram-practice
// feature. Works with mouse, touch, and pen via the Pointer Events API
// (one code path for all input types, no separate touch handlers needed).
// Strokes are kept as data (points + color + width) rather than baked into
// the canvas pixels, so undo/clear just replay the remaining strokes
// instead of needing any pixel-buffer trickery.

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Eraser, Undo2, Trash2 } from "lucide-react";

export interface DiagramCanvasHandle {
  clear: () => void;
  isEmpty: () => boolean;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

const PALETTE = ["#111111", "#dc2626", "#2563eb", "#16a34a", "#f59e0b"];
const WIDTHS = [3, 6, 11];

export const DiagramCanvas = forwardRef<DiagramCanvasHandle, { className?: string; height?: number }>(
  function DiagramCanvas({ className, height = 380 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const strokesRef = useRef<Stroke[]>([]);
    const drawingRef = useRef(false);
    const [color, setColor] = useState(PALETTE[0]);
    const [width, setWidth] = useState(WIDTHS[1]);
    const [erasing, setErasing] = useState(false);
    const [, forceRender] = useState(0);

    const redraw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const stroke of strokesRef.current) {
        if (stroke.points.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (const p of stroke.points.slice(1)) ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    // Size the backing store to the element's real pixel size (accounting for
    // devicePixelRatio) so lines are crisp on high-DPI screens, then redraw.
    useEffect(() => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = wrap.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        const ctx = canvas.getContext("2d");
        ctx?.scale(dpr, dpr);
        redraw();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);
      return () => ro.disconnect();
       
    }, [height]);

    useImperativeHandle(ref, () => ({
      clear: () => { strokesRef.current = []; redraw(); forceRender((n) => n + 1); },
      isEmpty: () => strokesRef.current.length === 0,
    }));

    const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drawingRef.current = true;
      strokesRef.current = [...strokesRef.current, { points: [getPos(e)], color: erasing ? "#ffffff" : color, width: erasing ? 22 : width }];
    };
    const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const last = strokesRef.current[strokesRef.current.length - 1];
      last.points.push(getPos(e));
      redraw();
    };
    const onUp = () => { drawingRef.current = false; forceRender((n) => n + 1); };

    const undo = () => { strokesRef.current = strokesRef.current.slice(0, -1); redraw(); forceRender((n) => n + 1); };
    const clearAll = () => { strokesRef.current = []; redraw(); forceRender((n) => n + 1); };

    return (
      <div className={className}>
        <div ref={wrapRef} className="rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-white" style={{ touchAction: "none" }}>
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height, display: "block", cursor: "crosshair" }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/50">
            {PALETTE.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setErasing(false); }}
                aria-label={c}
                className={`size-6 rounded-full transition ${!erasing && color === c ? "ring-2 ring-offset-1 ring-offset-background ring-foreground" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
            {WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setWidth(w)}
                aria-label={`Brush size ${w}`}
                className={`size-7 rounded-lg flex items-center justify-center transition ${width === w && !erasing ? "bg-background shadow-sm" : ""}`}
              >
                <span className="rounded-full bg-foreground" style={{ width: w, height: w }} />
              </button>
            ))}
          </div>

          <button
            onClick={() => setErasing((v) => !v)}
            className={`tap-lift size-9 rounded-xl flex items-center justify-center border transition ${erasing ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground"}`}
            aria-label="Eraser"
          >
            <Eraser className="size-4" />
          </button>
          <button onClick={undo} className="tap-lift size-9 rounded-xl flex items-center justify-center border border-border/50 bg-muted/50 text-muted-foreground hover:text-foreground transition" aria-label="Undo">
            <Undo2 className="size-4" />
          </button>
          <button onClick={clearAll} className="tap-lift size-9 rounded-xl flex items-center justify-center border border-border/50 bg-muted/50 text-muted-foreground hover:text-rose-500 transition" aria-label="Clear">
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    );
  }
);
