"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// 15 colours for pH 0 (red, bottom) → pH 14 (purple, top)
const PH_COLORS: string[] = [
  "#b91c1c", // 0  dark red
  "#dc2626", // 1
  "#ef4444", // 2  red
  "#f97316", // 3
  "#f97316", // 4  orange
  "#f59e0b", // 5
  "#fbbf24", // 6  amber
  "#22c55e", // 7  green (neutral)
  "#14b8a6", // 8  teal
  "#06b6d4", // 9  cyan
  "#0ea5e9", // 10 sky
  "#3b82f6", // 11 blue
  "#4f46e5", // 12 indigo
  "#7c3aed", // 13 violet
  "#9333ea", // 14 purple
];

type Zone = {
  id: string;
  y: number;
  color: string;
  name: string;
};

const ZONES: Zone[] = [
  { id: "strong-acid", y: -2.14, color: "#dc2626", name: "Strong Acid · pH 0–2" },
  { id: "weak-acid", y: -0.71, color: "#f59e0b", name: "Weak Acid · pH 4–6" },
  { id: "neutral", y: 0, color: "#22c55e", name: "Neutral · pH 7" },
  { id: "weak-base", y: 0.71, color: "#0ea5e9", name: "Weak Base · pH 8–10" },
  { id: "strong-base", y: 2.14, color: "#9333ea", name: "Strong Base · pH 12–14" },
];

function PhScaleModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.1;
  });

  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const SEG_H = 5 / 14;

  // Litmus colour logic — coloured by the selected zone
  const isAcid = selectedPart === "strong-acid" || selectedPart === "weak-acid";
  const isBase = selectedPart === "weak-base" || selectedPart === "strong-base";
  const redLitmusColor = isBase ? "#3b82f6" : "#dc2626"; // turns blue in base
  const blueLitmusColor = isAcid ? "#dc2626" : "#3b82f6"; // turns red in acid

  const activeZone = ZONES.find((z) => z.id === (selectedPart || hover)) ?? null;

  return (
    <group ref={group} scale={scale}>
      {/* Vertical pH bar — stack 14 thin coloured segments */}
      {PH_COLORS.slice(0, 14).map((c, i) => {
        const y = -2.5 + (i + 0.5) * SEG_H;
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.7, SEG_H + 0.005, 0.7]} />
            <meshStandardMaterial color={c} roughness={0.4} metalness={0.05} />
          </mesh>
        );
      })}

      {/* Clickable zone rings (halos) around the bar */}
      {ZONES.map((z) => {
        const active = selectedPart === z.id || hover === z.id;
        return (
          <mesh
            key={z.id}
            position={[0, z.y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart(pick(z.id)); }}
            onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover(z.id); }}
            onPointerOut={() => setHover(null)}
          >
            <torusGeometry args={[0.72, 0.09, 16, 48]} />
            <meshStandardMaterial
              color={z.color}
              emissive={active ? z.color : "#000000"}
              emissiveIntensity={selectedPart === z.id ? 1.0 : hover === z.id ? 0.6 : 0.25}
              roughness={0.3}
              metalness={0.25}
            />
          </mesh>
        );
      })}

      {/* pH number labels (0, 7, 14) on the right */}
      {!preview && (
        <>
          <Html position={[1.05, -2.5, 0]} center distanceFactor={10}>
            <div
              style={{
                background: "rgba(10,9,23,0.92)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "sans-serif",
                whiteSpace: "nowrap",
                border: "1px solid #dc2626",
                pointerEvents: "none",
              }}
            >
              pH 0
            </div>
          </Html>
          <Html position={[1.05, 0, 0]} center distanceFactor={10}>
            <div
              style={{
                background: "rgba(10,9,23,0.92)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "sans-serif",
                whiteSpace: "nowrap",
                border: "1px solid #22c55e",
                pointerEvents: "none",
              }}
            >
              pH 7
            </div>
          </Html>
          <Html position={[1.05, 2.5, 0]} center distanceFactor={10}>
            <div
              style={{
                background: "rgba(10,9,23,0.92)",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "sans-serif",
                whiteSpace: "nowrap",
                border: "1px solid #9333ea",
                pointerEvents: "none",
              }}
            >
              pH 14
            </div>
          </Html>
        </>
      )}

      {/* Active zone name label on the left */}
      {!preview && activeZone && (
        <Html position={[-1.25, activeZone.y, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: `1px solid ${activeZone.color}`,
              pointerEvents: "none",
            }}
          >
            {activeZone.name}
          </div>
        </Html>
      )}

      {/* Litmus paper strips on the left side of the bar */}
      {/* Red litmus — placed in the base range (top); clicking it selects weak-base to demo the colour change */}
      <mesh
        position={[-0.95, 1.5, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("weak-base")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("red-litmus"); }}
        onPointerOut={() => setHover(null)}
      >
        <boxGeometry args={[0.2, 1.2, 0.05]} />
        <meshStandardMaterial
          color={redLitmusColor}
          emissive={hover === "red-litmus" ? redLitmusColor : "#000000"}
          emissiveIntensity={hover === "red-litmus" ? 0.45 : 0}
          roughness={0.7}
        />
      </mesh>
      {/* Blue litmus — placed in the acid range (bottom); clicking it selects weak-acid */}
      <mesh
        position={[-0.95, -1.5, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("weak-acid")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("blue-litmus"); }}
        onPointerOut={() => setHover(null)}
      >
        <boxGeometry args={[0.2, 1.2, 0.05]} />
        <meshStandardMaterial
          color={blueLitmusColor}
          emissive={hover === "blue-litmus" ? blueLitmusColor : "#000000"}
          emissiveIntensity={hover === "blue-litmus" ? 0.45 : 0}
          roughness={0.7}
        />
      </mesh>

      {/* Litmus labels */}
      {!preview && (
        <>
          <Html position={[-0.95, 2.25, 0]} center distanceFactor={10}>
            <div
              style={{
                color: "#fca5a5",
                fontSize: 9,
                fontWeight: 600,
                fontFamily: "sans-serif",
                textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              Red litmus
            </div>
          </Html>
          <Html position={[-0.95, -0.75, 0]} center distanceFactor={10}>
            <div
              style={{
                color: "#93c5fd",
                fontSize: 9,
                fontWeight: 600,
                fontFamily: "sans-serif",
                textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              Blue litmus
            </div>
          </Html>
          {(hover === "red-litmus" || hover === "blue-litmus") && (
            <Html
              position={[-0.95, hover === "red-litmus" ? 0.8 : -2.25, 0]}
              center
              distanceFactor={9}
            >
              <div
                style={{
                  background: "rgba(10,9,23,0.92)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 10,
                  fontFamily: "sans-serif",
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(52,211,153,0.55)",
                  pointerEvents: "none",
                }}
              >
                {hover === "red-litmus"
                  ? "Red litmus → turns blue in base"
                  : "Blue litmus → turns red in acid"}
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  );
}

export const PhScaleExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "ph-scale",
  chapterId: 2,
  track: "science",
  title: "The pH Scale",
  subtitle: "Ch 2 · Acids, Bases & Salts",
  description:
    "The pH scale (0–14) measures how acidic or basic a solution is. Strong acids sit at the bottom (pH 0, red), pure water is neutral (pH 7, green), and strong bases sit at the top (pH 14, purple). Click each coloured ring on the tower to learn the pH range and real-world examples. Try the litmus strips on the left — red litmus turns blue in bases, blue litmus turns red in acids.",
  accent: "#34d399",
  icon: "🧪",
  parts: [
    { id: "strong-acid", name: "Strong Acid (pH 0–2)", info: "pH range 0–2 — strong acids ionise completely in water. Examples: gastric juice in our stomach (pH ~1.5), HCl used in labs, lemon juice (pH ~2). Strong acids are highly corrosive and conduct electricity well." },
    { id: "weak-acid", name: "Weak Acid (pH 4–6)", info: "pH range 4–6 — weak acids only partially ionise in water. Examples: black coffee (pH 5), tomato juice (pH 4.2), curd/lactic acid. Acids turn blue litmus red and have a sour taste." },
    { id: "neutral", name: "Neutral (pH 7)", info: "pH 7 — neither acidic nor basic. Pure water is neutral. Human blood is tightly regulated around pH 7.4. Salts of a strong acid + strong base (e.g. NaCl) give neutral aqueous solutions." },
    { id: "weak-base", name: "Weak Base (pH 8–10)", info: "pH range 8–10 — weak bases partially ionise. Examples: baking soda (NaHCO₃) solution (pH ~8.3), seawater (pH ~8), eggs (pH ~7.6). Bases turn red litmus blue and feel soapy to touch." },
    { id: "strong-base", name: "Strong Base (pH 12–14)", info: "pH range 12–14 — strong bases (alkalis) ionise completely. Examples: NaOH used in drain cleaners (pH 14), Ca(OH)₂ limewater, bleach (NaOCl, pH ~12). Strong bases are caustic and damage skin." },
  ],
  Model: PhScaleModel,
};
