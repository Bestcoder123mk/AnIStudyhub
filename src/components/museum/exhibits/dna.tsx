"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// DNA Double Helix — two sugar-phosphate strands + base pairs
function DnaModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);
  useFrame((_, dt) => { if (group.current && !preview) group.current.rotation.y += dt * 0.25; });

  const mat = (id: string, color: string) => ({
    color,
    emissive: selectedPart === id || hover === id ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.8 : hover === id ? 0.45 : 0.1,
    roughness: 0.3, metalness: 0.2,
  });

  const scale = preview ? 0.45 : 1;
  const pick = (id: string) => (preview ? null : id);

  // Build helix points
  const { strandA, strandB, rungs } = useMemo(() => {
    const a: THREE.Vector3[] = [];
    const b: THREE.Vector3[] = [];
    const rgs: { pos: THREE.Vector3; len: number; rotY: number; pair: [string, string] }[] = [];
    const radius = 1.1;
    const turns = 2.5;
    const steps = 60;
    const height = 5.4;
    const bases: [string, string][] = [["A", "T"], ["T", "A"], ["G", "C"], ["C", "G"]];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ang = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      a.push(new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius));
      b.push(new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius));
    }
    // rungs every 5 steps
    for (let i = 0; i <= steps; i += 5) {
      const t = i / steps;
      const ang = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;
      const pa = new THREE.Vector3(Math.cos(ang) * radius, y, Math.sin(ang) * radius);
      const pb = new THREE.Vector3(Math.cos(ang + Math.PI) * radius, y, Math.sin(ang + Math.PI) * radius);
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      const len = pa.distanceTo(pb);
      rgs.push({ pos: mid, len, rotY: -ang, pair: bases[(i / 5) % bases.length] });
    }
    return { strandA: a, strandB: b, rungs: rgs };
  }, []);

  // Build tube geometries
  const strandAGeo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandA), 120, 0.09, 12, false), [strandA]);
  const strandBGeo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandB), 120, 0.09, 12, false), [strandB]);

  return (
    <group ref={group} scale={scale}>
      {/* Strand A (sugar-phosphate backbone) */}
      <mesh geometry={strandAGeo} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("backbone")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("backbone"); }}
        onPointerOut={() => setHover(null)}>
        <meshStandardMaterial {...mat("backbone", "#60a5fa")} />
      </mesh>
      <mesh geometry={strandBGeo} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("backbone")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("backbone"); }}
        onPointerOut={() => setHover(null)}>
        <meshStandardMaterial {...mat("backbone", "#60a5fa")} />
      </mesh>

      {/* Base pair rungs */}
      {rungs.map((r, i) => {
        const baseColorA = r.pair[0] === "A" || r.pair[0] === "G" ? "#fbbf24" : "#34d399"; // purine=gold, pyrimidine=emerald
        const baseColorB = r.pair[1] === "A" || r.pair[1] === "G" ? "#fbbf24" : "#34d399";
        return (
          <group key={i} position={r.pos} rotation={[0, r.rotY, 0]}>
            <mesh castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart(pick("base-pair")); }}
              onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("base-pair"); }}
              onPointerOut={() => setHover(null)}>
              <cylinderGeometry args={[0.07, 0.07, r.len, 12]} />
              <meshStandardMaterial {...mat("base-pair", "#c084fc")} />
            </mesh>
            {/* base markers */}
            <mesh position={[r.len / 2 - 0.15, 0, 0]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={baseColorA} emissive={baseColorA} emissiveIntensity={0.3} roughness={0.3} />
            </mesh>
            <mesh position={[-r.len / 2 + 0.15, 0, 0]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={baseColorB} emissive={baseColorB} emissiveIntensity={0.3} roughness={0.3} />
            </mesh>
            {/* base letters (non-preview) */}
            {!preview && (
              <Html position={[r.len / 2 - 0.15, 0.22, 0]} center distanceFactor={7}>
                <span style={{ color: baseColorA, fontSize: 14, fontWeight: 700, fontFamily: "monospace", textShadow: "0 0 4px #000" }}>{r.pair[0]}</span>
              </Html>
            )}
            {!preview && (
              <Html position={[-r.len / 2 + 0.15, 0.22, 0]} center distanceFactor={7}>
                <span style={{ color: baseColorB, fontSize: 14, fontWeight: 700, fontFamily: "monospace", textShadow: "0 0 4px #000" }}>{r.pair[1]}</span>
              </Html>
            )}
          </group>
        );
      })}

      {/* Top + bottom caps to show it's a helix molecule */}
      <mesh position={[0, 3.0, 0]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
      <mesh position={[0, -3.0, 0]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color="#1e3a8a" /></mesh>

      {!preview && (selectedPart || hover) && (
        <Html position={[0, 3.5, 0]} center distanceFactor={8}>
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

const PART_LABELS: Record<string, string> = {
  backbone: "Sugar-Phosphate Backbone", "base-pair": "Nitrogenous Base Pair",
};

export const DnaExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "dna",
  chapterId: 9,
  track: "science",
  title: "DNA Double Helix",
  subtitle: "Ch 9 · Heredity & Evolution",
  description:
    "Deoxyribonucleic acid — the molecule of heredity. Two anti-parallel strands wind around each other in a right-handed helix, held together by complementary base pairs: A–T (2 hydrogen bonds) and G–C (3 hydrogen bonds). The sequence of bases encodes genetic information. Click the parts to explore.",
  accent: "#60a5fa",
  icon: "🧬",
  parts: [
    { id: "backbone", name: "Sugar-Phosphate Backbone", info: "Alternating deoxyribose sugar and phosphate groups form the outer rails of the helix. The phosphate makes the strand acidic and gives DNA its negative charge. Directionality runs 5'→3'." },
    { id: "base-pair", name: "Nitrogenous Base Pair", info: "The rungs: Adenine pairs with Thymine (2 H-bonds), Guanine pairs with Cytosine (3 H-bonds). This complementary pairing is the basis of accurate DNA replication. Purines (A,G) = gold; Pyrimidines (T,C) = green." },
  ],
  Model: DnaModel,
};
