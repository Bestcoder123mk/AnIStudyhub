"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

type PtElement = {
  sym: string;
  num: number;
  col: number; // 0..7
  period: number; // 1..3
  group: number; // 1, 2, 13..18
};

// Simplified 18-element periodic table — Groups 1, 2, 13-18 across Periods 1-3
const ELEMENTS: PtElement[] = [
  { sym: "H", num: 1, col: 0, period: 1, group: 1 },
  { sym: "He", num: 2, col: 7, period: 1, group: 18 },
  { sym: "Li", num: 3, col: 0, period: 2, group: 1 },
  { sym: "Be", num: 4, col: 1, period: 2, group: 2 },
  { sym: "B", num: 5, col: 2, period: 2, group: 13 },
  { sym: "C", num: 6, col: 3, period: 2, group: 14 },
  { sym: "N", num: 7, col: 4, period: 2, group: 15 },
  { sym: "O", num: 8, col: 5, period: 2, group: 16 },
  { sym: "F", num: 9, col: 6, period: 2, group: 17 },
  { sym: "Ne", num: 10, col: 7, period: 2, group: 18 },
  { sym: "Na", num: 11, col: 0, period: 3, group: 1 },
  { sym: "Mg", num: 12, col: 1, period: 3, group: 2 },
  { sym: "Al", num: 13, col: 2, period: 3, group: 13 },
  { sym: "Si", num: 14, col: 3, period: 3, group: 14 },
  { sym: "P", num: 15, col: 4, period: 3, group: 15 },
  { sym: "S", num: 16, col: 5, period: 3, group: 16 },
  { sym: "Cl", num: 17, col: 6, period: 3, group: 17 },
  { sym: "Ar", num: 18, col: 7, period: 3, group: 18 },
];

// Map a Group number to a selectable part id
const groupToPart = (g: number): string => {
  if (g === 1) return "alkali-metals";
  if (g === 2) return "alkaline-earth";
  if (g === 17) return "halogens";
  if (g === 18) return "noble-gases";
  return "other";
};

const groupColor = (sym: string, g: number): string => {
  // H is a non-metal — colour it grey even though it sits in Group 1
  if (sym === "H") return "#94a3b8";
  if (g === 1) return "#ef4444"; // alkali — red
  if (g === 2) return "#f97316"; // alkaline earth — orange
  if (g === 17) return "#22c55e"; // halogens — green
  if (g === 18) return "#06b6d4"; // noble gases — cyan
  return "#94a3b8"; // others — grey
};

const PART_LABELS: Record<string, string> = {
  "alkali-metals": "Group 1 · Alkali Metals",
  "alkaline-earth": "Group 2 · Alkaline Earth",
  halogens: "Group 17 · Halogens",
  "noble-gases": "Group 18 · Noble Gases",
  "periodic-trends": "Periodic Trends",
};

function PeriodicTableModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.08;
  });

  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const trendActive = selectedPart === "periodic-trends" || hover === "periodic-trends";
  const activeId = selectedPart || hover;
  const activeLabel = activeId ? PART_LABELS[activeId] : null;

  const xOf = (col: number) => (col - 3.5) * 0.9;
  const zOf = (period: number) => (period - 2) * 0.9;

  return (
    <group ref={group} scale={scale}>
      {/* Flat grid of element boxes on the XZ plane */}
      {ELEMENTS.map((el, i) => {
        const x = xOf(el.col);
        const z = zOf(el.period);
        const gid = groupToPart(el.group);
        const active = selectedPart === gid || hover === gid;
        const color = groupColor(el.sym, el.group);
        return (
          <mesh
            key={i}
            position={[x, 0, z]}
            castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart(pick(gid)); }}
            onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover(gid); }}
            onPointerOut={() => setHover(null)}
          >
            <boxGeometry args={[0.7, 0.18, 0.7]} />
            <meshStandardMaterial
              color={color}
              emissive={active ? color : "#000000"}
              emissiveIntensity={selectedPart === gid ? 0.85 : hover === gid ? 0.5 : 0.18}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
        );
      })}

      {/* Element symbol + atomic number labels on top face */}
      {!preview &&
        ELEMENTS.map((el, i) => {
          const x = xOf(el.col);
          const z = zOf(el.period);
          const gid = groupToPart(el.group);
          const active = selectedPart === gid || hover === gid;
          return (
            <Html key={i} position={[x, 0.18, z]} center distanceFactor={10}>
              <div
                style={{
                  color: active ? "#ffffff" : "#e5e7eb",
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: "sans-serif",
                  textAlign: "center",
                  lineHeight: 1.1,
                  textShadow: "0 1px 3px rgba(0,0,0,0.95)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                <div style={{ fontSize: 8, opacity: 0.85, fontWeight: 600 }}>{el.num}</div>
                <div>{el.sym}</div>
              </div>
            </Html>
          );
        })}

      {/* Trend arrow — atomic size decreases across a period (left → right) */}
      <group
        position={[0, 0.55, -1.45]}
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("periodic-trends")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("periodic-trends"); }}
        onPointerOut={() => setHover(null)}
      >
        {/* Shaft — cylinder laid along +X */}
        <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 6.4, 16]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive={trendActive ? "#a78bfa" : "#000000"}
            emissiveIntensity={selectedPart === "periodic-trends" ? 0.85 : hover === "periodic-trends" ? 0.55 : 0.25}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
        {/* Arrow head — cone pointing +X */}
        <mesh position={[3.35, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.16, 0.42, 20]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive={trendActive ? "#a78bfa" : "#000000"}
            emissiveIntensity={selectedPart === "periodic-trends" ? 0.85 : hover === "periodic-trends" ? 0.55 : 0.25}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
        {/* Tail anchor */}
        <mesh position={[-3.35, 0, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive={trendActive ? "#a78bfa" : "#000000"}
            emissiveIntensity={selectedPart === "periodic-trends" ? 0.85 : hover === "periodic-trends" ? 0.55 : 0.25}
          />
        </mesh>
        {/* "Atomic size" caption on the arrow */}
        {!preview && (
          <Html position={[0, 0.35, 0]} center distanceFactor={10}>
            <div
              style={{
                color: "#c4b5fd",
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "sans-serif",
                textShadow: "0 1px 2px rgba(0,0,0,0.95)",
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              Atomic size → decreases across a period
            </div>
          </Html>
        )}
      </group>

      {/* Active group / trend label */}
      {!preview && activeLabel && (
        <Html position={[0, 1.25, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(167,139,250,0.6)",
              pointerEvents: "none",
            }}
          >
            {activeLabel}
          </div>
        </Html>
      )}
    </group>
  );
}

export const PeriodicTableExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "periodic-table",
  chapterId: 5,
  track: "science",
  title: "Periodic Classification of Elements",
  subtitle: "Ch 5 · Periodic Table",
  description:
    "Mendeleev arranged elements by atomic mass; the modern table arranges them by atomic number into groups (columns) and periods (rows). This simplified 3-D table shows Groups 1, 2, and 13–18 across Periods 1–3. Elements in the same group share chemical properties because they have the same number of valence electrons. Click any element to highlight its whole group, or click the trend arrow to see how atomic size changes across a period.",
  accent: "#a78bfa",
  icon: "📊",
  parts: [
    { id: "alkali-metals", name: "Group 1 — Alkali Metals", info: "Members shown: Li, Na (plus K, Rb, Cs, Fr below). Soft, silvery, extremely reactive metals — so reactive they are stored under oil. They have 1 valence electron which they lose easily. React vigorously with water: 2Na + 2H₂O → 2NaOH + H₂↑. (H sits in Group 1 but is a non-metal.)" },
    { id: "alkaline-earth", name: "Group 2 — Alkaline Earth Metals", info: "Members shown: Be, Mg (plus Ca, Sr, Ba, Ra below). Harder and denser than Group 1, with 2 valence electrons. React with acids: Mg + 2HCl → MgCl₂ + H₂↑. Magnesium burns in air with dazzling white light — used in fireworks." },
    { id: "halogens", name: "Group 17 — Halogens", info: "Members shown: F, Cl (plus Br, I, At below). 'Salt-formers' — the most reactive non-metals because they need just 1 electron to complete their outer shell. Form acids with H: HCl, HF, HBr. Chlorine (Cl₂) is used to disinfect drinking water and swimming pools." },
    { id: "noble-gases", name: "Group 18 — Noble Gases", info: "Members shown: He, Ne, Ar (plus Kr, Xe, Rn below). Inert gases with a complete outer electron shell (octet) — almost no chemical reactivity. Helium fills balloons and airships; neon glows red-orange in discharge tubes (Ne signs); argon shields welding from air." },
    { id: "periodic-trends", name: "Periodic Trends", info: "Across a period (left → right), atomic size decreases — more protons pull the same shell tighter, and metallic character drops. Down a group, atomic size increases — extra electron shells are added. The arrow above the table shows size decreasing across Period 2 (Li → Ne)." },
  ],
  Model: PeriodicTableModel,
};
