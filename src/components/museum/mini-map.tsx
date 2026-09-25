"use client";

import { useEffect, useState } from "react";
import { playerPose } from "./player-pose";
import { SUBJECT_META, type Track } from "@/store/use-study-store";
import { getTrackChapters } from "@/lib/track-content";
import { Navigation } from "lucide-react";

const SUBJECTS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
const PORTAL_R = 10; // world units — must match gallery.tsx's PORTAL_R
const SPACING = 7; // world units — must match chapter-room.tsx's SPACING

/**
 * Reads playerPose on a 120ms poll rather than every R3F frame — a minimap
 * doesn't need 60fps precision, and setState-per-frame would mean a full
 * React re-render 60x/second for a corner widget. The two constants above
 * are intentionally duplicated from the scene files rather than imported,
 * since those live inside the Canvas tree and this renders outside it —
 * kept as plain numbers (not computed geometry) specifically so this stays
 * a cheap, obviously-correct duplication instead of silently drifting.
 */
export function MiniMap({ mode, track }: { mode: "lobby" | "wing"; track: Track }) {
  const [pose, setPose] = useState({ x: 0, z: 0, yaw: 0 });

  useEffect(() => {
    const id = setInterval(() => setPose({ ...playerPose }), 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="glass-clear glass-interactive absolute top-4 right-4 z-20 rounded-2xl p-2.5"
    >
      {mode === "lobby" ? <LobbyMap pose={pose} track={track} /> : <WingMap pose={pose} track={track} />}
    </div>
  );
}

function LobbyMap({ pose, track }: { pose: { x: number; z: number; yaw: number }; track: Track }) {
  const SIZE = 96;
  const R = SIZE / 2 - 10;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const scale = R / PORTAL_R;

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} className="absolute inset-0">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--glass-border)" strokeWidth="1" strokeDasharray="2 3" />
        {SUBJECTS.map((s, i) => {
          const angle = (i / SUBJECTS.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * R;
          const y = cy + Math.sin(angle) * R;
          const meta = SUBJECT_META[s];
          return (
            <g key={s}>
              <circle cx={x} cy={y} r={s === track ? 5 : 3.5} fill={s === track ? meta.accent : "var(--muted-foreground)"} opacity={s === track ? 1 : 0.55} />
            </g>
          );
        })}
      </svg>
      {SUBJECTS.map((s, i) => {
        const angle = (i / SUBJECTS.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * (R + 9);
        const y = cy + Math.sin(angle) * (R + 9);
        return (
          <span key={s} className="absolute text-[9px] leading-none" style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}>
            {SUBJECT_META[s].icon}
          </span>
        );
      })}
      {/* Player marker — world x/z map directly onto this circle since the
          lobby's portal ring and this SVG use the same radius formula. */}
      <div
        className="absolute grid place-items-center rounded-full"
        style={{
          left: cx + pose.x * scale,
          top: cy + pose.z * scale,
          width: 14,
          height: 14,
          marginLeft: -7,
          marginTop: -7,
          background: "var(--primary)",
          boxShadow: "0 0 8px var(--primary)",
          transform: `rotate(${(-pose.yaw * 180) / Math.PI}deg)`,
        }}
      >
        <Navigation className="size-2.5 text-background" fill="currentColor" />
      </div>
    </div>
  );
}

function WingMap({ pose, track }: { pose: { x: number; z: number; yaw: number }; track: Track }) {
  const chapters = getTrackChapters(track);
  const perSide = Math.max(1, Math.ceil(chapters.length / 2));
  const totalLen = perSide * SPACING;
  const spawnZ = totalLen / 2 + 3;
  const railLen = totalLen + 6;

  const HEIGHT = 150;
  const topPad = 12;
  const usableH = HEIGHT - topPad * 2;
  // z runs from +spawnZ (entrance, top of the strip) down to -spawnZ-ish
  // (far end, bottom) as the player walks in — flip so "forward" reads
  // as "down the strip," matching how the corridor is actually walked.
  const zToY = (z: number) => topPad + ((spawnZ - z) / railLen) * usableH;

  return (
    <div className="relative" style={{ width: 34, height: HEIGHT }}>
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full" style={{ background: "var(--glass-border)" }} />
      {chapters.map((c, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        // Mirrors chapter-room.tsx's own `startZ + idx * SPACING` alcove
        // placement exactly — the previous `spawnZ - 3 - idx * SPACING` here
        // was a different, inverted formula that put every chapter dot on
        // the wrong side of the strip.
        const startZ = -totalLen / 2 + SPACING / 2;
        const rowZ = startZ + Math.floor(i / 2) * SPACING;
        const y = zToY(rowZ);
        return (
          <div
            key={c.id}
            title={c.title}
            className="absolute rounded-full"
            style={{
              left: `calc(50% + ${side * 9}px)`,
              top: y,
              width: 6,
              height: 6,
              marginLeft: -3,
              marginTop: -3,
              background: SUBJECT_META[track].accent,
              opacity: 0.75,
            }}
          />
        );
      })}
      <div
        className="absolute left-1/2 rounded-full grid place-items-center"
        style={{
          top: Math.max(6, Math.min(HEIGHT - 6, zToY(pose.z))),
          width: 12,
          height: 12,
          marginLeft: -6,
          marginTop: -6,
          background: "var(--primary)",
          boxShadow: "0 0 8px var(--primary)",
        }}
      >
        <Navigation className="size-2 text-background" fill="currentColor" style={{ transform: `rotate(${(-pose.yaw * 180) / Math.PI}deg)` }} />
      </div>
    </div>
  );
}
