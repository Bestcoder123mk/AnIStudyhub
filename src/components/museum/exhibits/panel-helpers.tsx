"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

// Shared helpers for building interactive "painting" panels (SSC + Maths/
// English/Sanskrit exhibits). A Panel is a full-bleed SVG/CSS scene with
// clickable hotspot regions.

let sharedAudioCtx: AudioContext | null = null;
function playSoftClick() {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(720, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch {
    // Audio is a nicety — never let it break interaction.
  }
}

export interface HotspotStyle {
  stroke: string;
  fill: string;
  glow: string;
}

export function panelContainerStyle(accent: string, preview = false): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(ellipse at 50% 30%, ${accent}22 0%, #0a0917 60%, #050409 100%)`,
    overflow: "hidden",
    cursor: preview ? "default" : "pointer",
  };
}

// A clickable hotspot region. Renders a glowing outline + label, a gentle
// idle "breathing" pulse to invite exploration, and — on click — a quick
// expanding ripple plus a soft audio blip for tactile feedback.
export function Hotspot({
  id,
  selected,
  onSelect,
  accent,
  children,
  label,
  style,
  labelStyle,
  preview = false,
}: {
  id: string;
  selected: boolean;
  onSelect: (id: string | null) => void;
  accent: string;
  children?: ReactNode;
  label?: string;
  style: CSSProperties;
  labelStyle?: CSSProperties;
  preview?: boolean;
}) {
  const [ripples, setRipples] = useState<number[]>([]);
  const rippleId = useRef(0);

  if (preview) {
    // In pedestal preview, hotspots are non-interactive
    return <div style={{ ...style, pointerEvents: "none" }}>{children}</div>;
  }
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        const key = ++rippleId.current;
        setRipples((r) => [...r, key]);
        window.setTimeout(() => setRipples((r) => r.filter((k) => k !== key)), 550);
        playSoftClick();
        onSelect(selected ? null : id);
      }}
      style={{
        ...style,
        cursor: "pointer",
        outline: selected ? `2px solid ${accent}` : `1.5px solid ${accent}80`,
        outlineOffset: 2,
        boxShadow: selected ? `0 0 24px ${accent}, inset 0 0 16px ${accent}40` : `0 0 8px ${accent}40`,
        transition: "outline 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: selected ? "scale(1.02)" : "scale(1)",
        animation: selected ? "none" : "hotspot-breathe 2.6s ease-in-out infinite",
      }}
      onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${accent}80`; }}
      onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.boxShadow = `0 0 8px ${accent}40`; }}
    >
      {children}
      {ripples.map((k) => (
        <span
          key={k}
          style={{
            position: "absolute", inset: 0, borderRadius: "inherit",
            border: `2px solid ${accent}`, pointerEvents: "none",
            animation: "hotspot-ripple 0.55s ease-out forwards",
          }}
        />
      ))}
      {label && (
        <div style={{
          position: "absolute",
          bottom: -18,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          fontWeight: 700,
          color: accent,
          background: "rgba(0,0,0,0.7)",
          padding: "2px 6px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          ...labelStyle,
        }}>
          {label}
        </div>
      )}
      <style>{`
        @keyframes hotspot-breathe {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes hotspot-ripple {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}

// Floating annotation tag with a number badge
export function Tag({
  n,
  x,
  y,
  accent,
  selected,
  onClick,
  preview = false,
}: {
  n: number;
  x: number;
  y: number;
  accent: string;
  selected: boolean;
  onClick?: () => void;
  preview?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: selected ? accent : "rgba(0,0,0,0.75)",
        border: `2px solid ${accent}`,
        color: selected ? "#000" : accent,
        fontSize: 10,
        fontWeight: 800,
        cursor: preview ? "default" : "pointer",
        boxShadow: selected ? `0 0 16px ${accent}` : `0 0 6px ${accent}80`,
        transition: "all 0.2s",
        zIndex: 10,
        animation: !preview && !selected ? "tag-pulse-ring 2.2s ease-out infinite" : "none",
      }}
    >
      {n}
      {!preview && (
        <style>{`
          @keyframes tag-pulse-ring {
            0% { box-shadow: 0 0 6px ${accent}80, 0 0 0 0 ${accent}55; }
            70% { box-shadow: 0 0 6px ${accent}80, 0 0 0 8px ${accent}00; }
            100% { box-shadow: 0 0 6px ${accent}80, 0 0 0 0 ${accent}00; }
          }
        `}</style>
      )}
    </button>
  );
}

// Decorative frame for the "painting" feel
export function PaintingFrame({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div style={{
      position: "absolute",
      inset: "6%",
      borderRadius: 8,
      border: `8px solid ${accent}`,
      boxShadow: `0 0 0 2px #2a1f15, 0 0 40px ${accent}40, inset 0 0 60px rgba(0,0,0,0.4)`,
      overflow: "hidden",
      background: "linear-gradient(160deg, rgba(255,240,220,0.05), rgba(20,15,8,0.6))",
    }}>
      {children}
    </div>
  );
}

// Caption plaque at the bottom of a painting
export function Plaque({ title, caption, accent }: { title: string; caption: string; accent: string }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "2%",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(20,15,8,0.85)",
      border: `1px solid ${accent}60`,
      borderRadius: 8,
      padding: "6px 16px",
      textAlign: "center",
      maxWidth: "80%",
      pointerEvents: "none",
      zIndex: 5,
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: accent, fontFamily: "Georgia, serif" }}>{title}</div>
      <div style={{ fontSize: 9, color: "#a89880", marginTop: 2, fontStyle: "italic" }}>{caption}</div>
    </div>
  );
}
