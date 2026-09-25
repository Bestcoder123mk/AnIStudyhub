"use client";
import type { ReactNode } from "react";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

// A shared three-region "triptych" layout: one wide region up top, two
// smaller ones below. Every Maths/English/Sanskrit exhibit is built from
// this shell so the new wings feel like a coherent set rather than 42
// one-off layouts — same chrome, frame and interaction model as the
// existing SSC "painting" exhibits, just with a fixed, safe region grid.
export interface TriRegion {
  id: string;
  label: string;
  tagN: number;
  tagX: number;
  tagY: number;
  children: ReactNode; // small self-contained <svg> for this region
}

const AREAS = [
  { left: "5%", top: "13%", width: "90%", height: "45%" }, // main / top
  { left: "5%", top: "62%", width: "42%", height: "32%" }, // bottom-left
  { left: "53%", top: "62%", width: "42%", height: "32%" }, // bottom-right
];

export function TriPanel({
  accent,
  kicker,
  title,
  caption,
  regions,
  selectedPart,
  onSelectPart,
  preview,
}: {
  accent: string;
  kicker: string;
  title: string;
  caption: string;
  regions: TriRegion[]; // expects exactly 3, in main/bottom-left/bottom-right order
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
  preview?: boolean;
}) {
  const is = (id: string) => selectedPart === id;
  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        <div
          style={{
            position: "absolute", top: "2%", left: 0, width: "100%", textAlign: "center",
            fontSize: 11, fontWeight: 800, color: accent, letterSpacing: 3, fontFamily: "Georgia, serif",
          }}
        >
          {kicker}
        </div>

        {regions.map((r, i) => (
          <Hotspot
            key={r.id}
            id={r.id}
            selected={is(r.id)}
            onSelect={onSelectPart}
            accent={accent}
            preview={preview}
            style={{ position: "absolute", ...AREAS[i] }}
            label={r.label}
          >
            {r.children}
          </Hotspot>
        ))}

        {regions.map((r) => (
          <Tag
            key={r.id + "-tag"}
            n={r.tagN}
            x={r.tagX}
            y={r.tagY}
            accent={accent}
            selected={is(r.id)}
            preview={preview}
            onClick={() => onSelectPart(is(r.id) ? null : r.id)}
          />
        ))}

        <Plaque title={title} caption={caption} accent={accent} />
      </PaintingFrame>
    </div>
  );
}
