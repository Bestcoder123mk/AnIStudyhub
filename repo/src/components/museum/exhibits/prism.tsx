"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Prism with white light splitting into VIBGYOR spectrum
function PrismModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const spectrum = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.15;
    if (spectrum.current) {
      spectrum.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        m.emissiveIntensity = 0.5 + Math.sin(performance.now() * 0.002) * 0.2;
      });
    }
  });

  const mat = (id: string, color: string) => ({
    color,
    emissive: selectedPart === id || hover === id ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.8 : hover === id ? 0.45 : 0.1,
    roughness: 0.1, metalness: 0.0,
    transparent: true, opacity: 0.6,
  });
  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  return (
    <group ref={group} scale={scale}>
      {/* Triangular glass prism */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("prism")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("prism"); }}
        onPointerOut={() => setHover(null)}>
        <cylinderGeometry args={[1.3, 1.3, 1.6, 3]} />
        <meshStandardMaterial {...mat("prism", "#cbd5e1")} opacity={0.35} />
      </mesh>

      {/* Incoming white light beam */}
      <mesh position={[-2.2, 0.6, 0]} rotation={[0, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("white-light")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("white-light"); }}
        onPointerOut={() => setHover(null)}>
        <boxGeometry args={[2.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
      </mesh>

      {/* Outgoing spectrum — 7 colored beams fanning out */}
      <group ref={spectrum}>
        {SPECTRUM.map((s, i) => {
          const angle = -0.15 + i * 0.05; // fan
          return (
            <mesh key={i} position={[1.7, 0.5 - i * 0.04, 0]} rotation={[0, 0, angle]} castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart(pick("spectrum")); }}
              onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("spectrum"); }}
              onPointerOut={() => setHover(null)}>
              <boxGeometry args={[2.2, 0.08, 0.08]} />
              <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} />
            </mesh>
          );
        })}
      </group>

      {/* Wavelength labels (non-preview) */}
      {!preview && SPECTRUM.map((s, i) => (
        <Html key={i} position={[2.9, 0.5 - i * 0.12, 0]} center distanceFactor={10}>
          <span style={{ color: s.color, fontSize: 11, fontWeight: 700, fontFamily: "monospace", textShadow: "0 0 4px #000" }}>{s.label}</span>
        </Html>
      ))}

      {/* Screen on the right */}
      <mesh position={[3.1, -0.4, 0]}>
        <boxGeometry args={[0.06, 2.2, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {!preview && (selectedPart || hover) && (
        <Html position={[0, 2.0, 0]} center distanceFactor={9}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(96,165,250,0.5)", pointerEvents: "none",
          }}>
            {PART_LABELS[selectedPart || hover || ""]}
          </div>
        </Html>
      )}
    </group>
  );
}

const SPECTRUM = [
  { color: "#7c3aed", label: "V 400nm" }, // violet
  { color: "#3b82f6", label: "I 440nm" }, // indigo (slight — using blue; avoiding pure brand blue is fine here as it's physics spectrum)
  { color: "#06b6d4", label: "B 470nm" }, // blue
  { color: "#22c55e", label: "G 530nm" }, // green
  { color: "#eab308", label: "Y 580nm" }, // yellow
  { color: "#f97316", label: "O 610nm" }, // orange
  { color: "#ef4444", label: "R 700nm" }, // red
];

const PART_LABELS: Record<string, string> = {
  prism: "Glass Prism", "white-light": "White Light Beam", spectrum: "Visible Spectrum (VIBGYOR)",
};

export const PrismExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "prism",
  chapterId: 10,
  track: "science",
  title: "Prism & Light Dispersion",
  subtitle: "Ch 10 · Light — Reflection & Refraction",
  description:
    "When white light passes through a triangular glass prism, it splits into its constituent colours — the visible spectrum (VIBGYOR). This happens because each colour has a different wavelength and hence a slightly different refractive index in glass; violet bends the most, red the least. This revealed that white light is a mixture of seven colours. Click each part to explore.",
  accent: "#a78bfa",
  icon: "🌈",
  parts: [
    { id: "prism", name: "Glass Prism", info: "A transparent triangular medium. Light refracts (bends) at both faces. Since the two faces are not parallel, the deviations add up, separating the colours clearly." },
    { id: "white-light", name: "White Light Beam", info: "White light is a mixture of all visible wavelengths (400–700 nm). Newton showed this with a prism — and recombined the spectrum back into white light with a second prism." },
    { id: "spectrum", name: "Visible Spectrum (VIBGYOR)", info: "Violet (400 nm) bends the most; Red (700 nm) bends the least. Order: Violet, Indigo, Blue, Green, Yellow, Orange, Red. This is why rainbows form — water droplets act as tiny prisms." },
  ],
  Model: PrismModel,
};
