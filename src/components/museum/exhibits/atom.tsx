"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Atom — nucleus (protons+neutrons) + electron shells with orbiting electrons
function AtomModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const shell1 = useRef<THREE.Group>(null);
  const shell2 = useRef<THREE.Group>(null);
  const shell3 = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.1;
    if (shell1.current) shell1.current.rotation.z += dt * 1.6;
    if (shell2.current) shell2.current.rotation.x += dt * 1.1;
    if (shell3.current) shell3.current.rotation.y += dt * 0.8;
  });

  const mat = (id: string, color: string) => ({
    color,
    emissive: selectedPart === id || hover === id ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.9 : hover === id ? 0.5 : 0.15,
    roughness: 0.3, metalness: 0.3,
  });
  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  return (
    <group ref={group} scale={scale}>
      {/* Nucleus — cluster of protons + neutrons */}
      <group
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("nucleus")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("nucleus"); }}
        onPointerOut={() => setHover(null)}
      >
        {NUCLEUS.map((n, i) => (
          <mesh key={i} position={[n.x, n.y, n.z]} castShadow>
            <sphereGeometry args={[0.28, 20, 20]} />
            <meshStandardMaterial {...mat("nucleus", n.c)} />
          </mesh>
        ))}
      </group>

      {/* Shell 1 (K shell) — 2 electrons */}
      <group ref={shell1}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.1, 0.015, 8, 64]} />
          <meshStandardMaterial color="#475569" emissive="#1e293b" />
        </mesh>
        {[0, Math.PI].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1]} castShadow
            onClick={(e) => { e.stopPropagation(); onSelectPart(pick("electron")); }}
            onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("electron"); }}
            onPointerOut={() => setHover(null)}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial {...mat("electron", "#22d3ee")} />
          </mesh>
        ))}
      </group>

      {/* Shell 2 (L shell) — 8 electrons */}
      <group ref={shell2}>
        <mesh><torusGeometry args={[1.9, 0.015, 8, 64]} /><meshStandardMaterial color="#475569" /></mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.9, Math.sin(a) * 1.9, 0]} castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart(pick("electron")); }}
              onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("electron"); }}
              onPointerOut={() => setHover(null)}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial {...mat("electron", "#22d3ee")} />
            </mesh>
          );
        })}
      </group>

      {/* Shell 3 (M shell) — orbit at different plane */}
      <group ref={shell3}>
        <mesh rotation={[0, Math.PI / 3, 0]}><torusGeometry args={[2.7, 0.015, 8, 64]} /><meshStandardMaterial color="#475569" /></mesh>
        {Array.from({ length: 4 }).map((_, i) => {
          const a = (i / 4) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 2.7, 0, Math.sin(a) * 2.7]} castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart(pick("electron")); }}
              onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("electron"); }}
              onPointerOut={() => setHover(null)}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial {...mat("electron", "#22d3ee")} />
            </mesh>
          );
        })}
      </group>

      {!preview && (selectedPart || hover) && (
        <Html position={[0, 3.2, 0]} center distanceFactor={9}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(34,211,238,0.5)", pointerEvents: "none",
          }}>
            {PART_LABELS[selectedPart || hover || ""]}
          </div>
        </Html>
      )}
    </group>
  );
}

const NUCLEUS = [
  { x: 0.12, y: 0.1, z: 0.05, c: "#ef4444" },   // proton
  { x: -0.1, y: 0.12, z: -0.08, c: "#94a3b8" }, // neutron
  { x: 0.05, y: -0.12, z: 0.1, c: "#ef4444" },
  { x: -0.13, y: -0.05, z: 0.06, c: "#94a3b8" },
  { x: 0.08, y: 0.05, z: -0.13, c: "#ef4444" },
  { x: 0, y: 0, z: 0, c: "#94a3b8" },
];
const PART_LABELS: Record<string, string> = { nucleus: "Nucleus", electron: "Electron" };

export const AtomExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "atom",
  chapterId: 4,
  track: "science",
  title: "The Atom",
  subtitle: "Ch 4 · Carbon & Its Compounds",
  description:
    "The basic building block of all matter. A dense central nucleus (protons + neutrons) is surrounded by electrons in discrete energy shells (K, L, M…). The arrangement of electrons — especially valence electrons — determines how an element bonds. Carbon's 4 valence electrons make it uniquely versatile. Click the parts to explore.",
  accent: "#22d3ee",
  icon: "⚛️",
  parts: [
    { id: "nucleus", name: "Nucleus", info: "The dense centre of the atom, containing protons (positive, red) and neutrons (neutral, grey). It carries nearly all the atom's mass. Number of protons = atomic number, which defines the element." },
    { id: "electron", name: "Electron", info: "Negatively charged particles that orbit the nucleus in energy shells (K=2, L=8, M=18 max). Valence electrons (outermost shell) determine chemical bonding. Carbon has 4 valence electrons → forms 4 covalent bonds." },
  ],
  Model: AtomModel,
};
