"use client";

import type { ReactNode } from "react";

export type MascotMood = "happy" | "cheer" | "sad";

// "Ash" — an original geometric wolf. Steel-grey fur and a pale muzzle stay constant; the glowing eyes,
// forehead mark and inner ears take the accent colour, so it re-themes with the rest of the app.
const FUR = "#8197a6", FUR_LIGHT = "#b2c3ce", FUR_DARK = "#5b7080", LEDGE = "#34444f", MUZZLE = "#e6eef2", INK = "#0b1a22";
const ACCENT_DEEP = "color-mix(in oklch, var(--primary) 55%, black)";

/** Draw the children once, then again mirrored across the vertical centre line — the face is symmetric. */
const Mirror = ({ children }: { children: ReactNode }) => (
  <>
    <g>{children}</g>
    <g transform="translate(120 0) scale(-1 1)">{children}</g>
  </>
);

export function Mascot({ mood = "happy", size = 120, bounce = false, decorative = false, className = "" }: { mood?: MascotMood; size?: number; bounce?: boolean; decorative?: boolean; className?: string }) {
  const earTilt = mood === "sad" ? "rotate(-22 40 44)" : undefined; // ears fold back when it's down
  const brow = mood === "cheer" ? "26,52 46,54 46,57 28,56" : mood === "sad" ? "24,64 46,55 46,59 25,68" : "25,56 47,60 47,64 27,61";
  const headPts = "60,26 80,34 106,52 100,76 82,92 70,104 60,110 50,104 38,92 20,76 14,52 40,34";
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={`${bounce ? "mascot-float" : ""} ${className}`}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": `Ash the wolf looks ${mood}` })}>
      <ellipse cx="60" cy="116" rx="30" ry="4" fill="rgb(0 0 0 / 0.28)" />
      {/* chunky ledge under the whole head */}
      <g transform="translate(0 5)" fill={LEDGE}>
        <Mirror><polygon transform={earTilt} points="17,4 7,54 46,33" /></Mirror>
        <polygon points={headPts} />
      </g>
      {/* ears */}
      <Mirror>
        <g transform={earTilt}>
          <polygon points="17,4 7,54 46,33" fill={FUR} />
          <polygon points="19,19 14,45 36,35" style={{ fill: ACCENT_DEEP }} />
        </g>
      </Mirror>
      {/* head + fur facets */}
      <polygon points={headPts} fill={FUR} />
      <Mirror>
        <polygon points="40,34 60,26 60,48 47,50" fill={FUR_LIGHT} opacity="0.3" />
        <polygon points="15,53 40,36 47,58 31,77 21,76" fill={FUR_LIGHT} opacity="0.5" />
        <polygon points="21,76 31,77 49,91 50,103 38,92" fill={FUR_DARK} opacity="0.55" />
      </Mirror>
      {/* muzzle + nose */}
      <polygon points="47,64 60,58 73,64 71,88 60,99 49,88" fill={MUZZLE} />
      <polygon points="49,88 60,99 71,88 60,92" fill="#c7d6dd" />
      <polygon points="53,68 67,68 60,77" fill={INK} />
      <ellipse cx="57" cy="70" rx="2.2" ry="1" fill="#fff" opacity="0.5" />
      {/* forehead mark */}
      <polygon points="60,30 56,45 60,53 64,45" style={{ fill: "var(--primary)" }} />
      {/* eyes */}
      <Mirror>
        {mood === "cheer" ? (
          <path d="M28 68 Q37 57 46 66" stroke={INK} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        ) : (
          <>
            <polygon points="26,60 47,63 43,72 29,69" fill={INK} />
            <polygon points="30,62.6 45,64.6 42,70 32,67.6" style={{ fill: "var(--primary)", filter: "drop-shadow(0 0 2.5px var(--primary))" }} />
            <rect x="37" y="63.5" width="2.6" height="6.2" rx="1.2" fill={INK} />
            <circle cx="34" cy="65.5" r="1.1" fill="#fff" />
          </>
        )}
        <polygon points={brow} fill={LEDGE} />
      </Mirror>
      {/* mouth */}
      {mood === "happy" && (
        <>
          <path d="M60 77 V85" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M52 87 Q60 93 68 87" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "cheer" && (
        <>
          <path d="M60 77 V83" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M51 85 Q60 101 69 85 Z" fill={INK} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="60" cy="94.5" rx="5" ry="3" fill="#ff6b8a" />
          <polygon points="52.5,85.5 56,85.5 54.2,90.5" fill="#fff" />
          <polygon points="64,85.5 67.5,85.5 65.8,90.5" fill="#fff" />
        </>
      )}
      {mood === "sad" && (
        <>
          <path d="M60 77 V85" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M53 94 Q60 87 67 94" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M35 73 q4.5 6.5 0 10 q-4.5 -3.5 0 -10 Z" fill="#8fd8ff" />
        </>
      )}
    </svg>
  );
}
