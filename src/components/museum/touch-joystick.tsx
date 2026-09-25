"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { touchMoveVector, resetTouchMove } from "./touch-input";

const PAD_RADIUS = 46; // px — half the pad's visual diameter, minus knob margin

/**
 * Bottom-left virtual joystick for the 3D museum. Only meant to be mounted
 * when hasTouchSupport() is true (see museum-view.tsx) — on desktop this
 * would just be visual noise sitting over WASD users' screens.
 *
 * Deliberately a sibling of <Canvas>, not inside it: R3F's Canvas can only
 * contain Object3D-ish children, and pointer events starting on this div
 * never reach the canvas underneath anyway (different element, no shared
 * bubble path) — so this can't fight WalkControls' own drag-to-look
 * handling on the canvas. See touch-input.ts for how the two talk.
 */
export function TouchJoystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  // touchMoveVector is a module-level singleton (see touch-input.ts) that
  // outlives this component — pointerup/cancel already zero it out on a
  // normal release, but if this unmounts mid-drag (e.g. leaving the museum
  // while still touching the pad) neither fires, and the next thing that
  // reads touchMoveVector inherits a stuck, nonzero value.
  useEffect(() => () => resetTouchMove(), []);

  const updateFromPoint = useCallback((clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > PAD_RADIUS) {
      const s = PAD_RADIUS / dist;
      dx *= s;
      dy *= s;
    }
    setKnob({ x: dx, y: dy });
    // Screen-down (dy > 0) should mean "backward", so forward is negated.
    touchMoveVector.forward = -dy / PAD_RADIUS;
    touchMoveVector.strafe = dx / PAD_RADIUS;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    activePointerId.current = e.pointerId;
    setActive(true);
    updateFromPoint(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;
    e.stopPropagation();
    updateFromPoint(e.clientX, e.clientY);
  };
  const endTouch = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;
    e.stopPropagation();
    activePointerId.current = null;
    setActive(false);
    setKnob({ x: 0, y: 0 });
    resetTouchMove();
  };

  return (
    <div
      ref={padRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endTouch}
      onPointerCancel={endTouch}
      className="glass-clear glass-interactive absolute z-30 rounded-full touch-none select-none"
      style={{
        left: "max(1.25rem, env(safe-area-inset-left))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        width: 104,
        height: 104,
        boxShadow: active ? "0 0 0 1px color-mix(in oklch, var(--primary) 40%, transparent)" : undefined,
      }}
      aria-label="Move — drag to walk"
    >
      <div
        className="absolute rounded-full transition-transform"
        style={{
          left: "50%",
          top: "50%",
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          background: active ? "var(--primary)" : "color-mix(in oklch, var(--foreground) 25%, transparent)",
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transitionDuration: active ? "0ms" : "180ms",
          opacity: active ? 0.9 : 0.55,
        }}
      />
    </div>
  );
}
