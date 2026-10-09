"use client";
import { useRef, useState, useMemo, type JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

type V3 = [number, number, number];

// Atom colour palette — chemistry conventions
const C_A = "#22c55e"; // green — abstract element A
const C_B = "#3b82f6"; // blue — abstract element B
const C_C = "#f97316"; // orange — abstract element C
const C_D = "#a78bfa"; // purple — abstract element D
const C_H = "#f8fafc"; // white — Hydrogen
const C_O = "#ef4444"; // red — Oxygen
const C_Cu = "#b45309"; // copper brown

function Atom({ position, color }: { position: V3; color: string }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

function Bond({ p1, p2, color = "#cbd5e1" }: { p1: V3; p2: V3; color?: string }) {
  const { mid, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const m = a.clone().add(b).multiplyScalar(0.5);
    const d = b.clone().sub(a);
    const length = d.length();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return { mid: m, quat: q, len: length };
  }, [p1, p2]);
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.04, 0.04, len, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

// ---- Reaction scenes (local coords, centred at origin) ----
// Combination: A + B → AB
function CombinationScene() {
  const A1: V3 = [-0.35, 0.18, 0];
  const B1: V3 = [-0.35, -0.18, 0];
  const A2: V3 = [0.35, 0.15, 0];
  const B2: V3 = [0.35, -0.15, 0];
  return (
    <group>
      <Atom position={A1} color={C_A} />
      <Atom position={B1} color={C_B} />
      <Atom position={A2} color={C_A} />
      <Atom position={B2} color={C_B} />
      <Bond p1={A2} p2={B2} />
    </group>
  );
}

// Decomposition: AB → A + B
function DecompositionScene() {
  const A1: V3 = [-0.35, 0.15, 0];
  const B1: V3 = [-0.35, -0.15, 0];
  const A2: V3 = [0.35, 0.18, 0];
  const B2: V3 = [0.35, -0.18, 0];
  return (
    <group>
      <Atom position={A1} color={C_A} />
      <Atom position={B1} color={C_B} />
      <Bond p1={A1} p2={B1} />
      <Atom position={A2} color={C_A} />
      <Atom position={B2} color={C_B} />
    </group>
  );
}

// Displacement: A + BC → AC + B
function DisplacementScene() {
  const A1: V3 = [-0.42, 0.3, 0];
  const B1: V3 = [-0.42, 0.0, 0];
  const Cc1: V3 = [-0.42, -0.3, 0];
  const A2: V3 = [0.42, 0.3, 0];
  const Cc2: V3 = [0.42, 0.0, 0];
  const B2: V3 = [0.42, -0.3, 0];
  return (
    <group>
      <Atom position={A1} color={C_A} />
      <Atom position={B1} color={C_B} />
      <Atom position={Cc1} color={C_C} />
      <Bond p1={B1} p2={Cc1} />
      <Atom position={A2} color={C_A} />
      <Atom position={Cc2} color={C_C} />
      <Atom position={B2} color={C_B} />
      <Bond p1={A2} p2={Cc2} />
    </group>
  );
}

// Double Displacement: AB + CD → AD + CB
function DoubleDisplacementScene() {
  const A1: V3 = [-0.45, 0.35, 0];
  const B1: V3 = [-0.45, 0.1, 0];
  const Cc1: V3 = [-0.45, -0.15, 0];
  const D1: V3 = [-0.45, -0.4, 0];
  const A2: V3 = [0.45, 0.35, 0];
  const D2: V3 = [0.45, 0.1, 0];
  const Cc2: V3 = [0.45, -0.15, 0];
  const B2: V3 = [0.45, -0.4, 0];
  return (
    <group>
      <Atom position={A1} color={C_A} />
      <Atom position={B1} color={C_B} />
      <Bond p1={A1} p2={B1} />
      <Atom position={Cc1} color={C_C} />
      <Atom position={D1} color={C_D} />
      <Bond p1={Cc1} p2={D1} />
      <Atom position={A2} color={C_A} />
      <Atom position={D2} color={C_D} />
      <Bond p1={A2} p2={D2} />
      <Atom position={Cc2} color={C_C} />
      <Atom position={B2} color={C_B} />
      <Bond p1={Cc2} p2={B2} />
    </group>
  );
}

// Redox: CuO + H₂ → Cu + H₂O  (CuO reduced, H₂ oxidised)
function RedoxScene() {
  // Top row: reactants (CuO on left, H₂ on right)
  const Cu1: V3 = [-0.4, 0.35, 0];
  const O1: V3 = [-0.4, 0.1, 0];
  const H1: V3 = [0.4, 0.35, 0];
  const H2: V3 = [0.4, 0.15, 0];
  // Bottom row: products (Cu on left, H₂O on right)
  const Cu2: V3 = [-0.4, -0.4, 0];
  const O2: V3 = [0.4, -0.15, 0];
  const H3: V3 = [0.55, -0.4, 0];
  const H4: V3 = [0.25, -0.4, 0];
  return (
    <group>
      <Atom position={Cu1} color={C_Cu} />
      <Atom position={O1} color={C_O} />
      <Bond p1={Cu1} p2={O1} />
      <Atom position={Cu2} color={C_Cu} />
      <Atom position={H1} color={C_H} />
      <Atom position={H2} color={C_H} />
      <Bond p1={H1} p2={H2} />
      <Atom position={O2} color={C_O} />
      <Atom position={H3} color={C_H} />
      <Atom position={H4} color={C_H} />
      <Bond p1={O2} p2={H3} />
      <Bond p1={O2} p2={H4} />
    </group>
  );
}

const GROUPS: {
  id: string;
  name: string;
  x: number;
  Scene: () => JSX.Element;
}[] = [
  { id: "combination", name: "Combination", x: -3.6, Scene: CombinationScene },
  { id: "decomposition", name: "Decomposition", x: -1.8, Scene: DecompositionScene },
  { id: "displacement", name: "Displacement", x: 0, Scene: DisplacementScene },
  { id: "double-displacement", name: "Double Displacement", x: 1.8, Scene: DoubleDisplacementScene },
  { id: "redox", name: "Redox", x: 3.6, Scene: RedoxScene },
];

function ReactionModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.12;
  });

  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const activeName =
    GROUPS.find((g) => g.id === (selectedPart || hover))?.name ?? null;

  return (
    <group ref={group} scale={scale}>
      {/* Central glass reaction vessel (beaker) */}
      <group position={[0, -1.6, 0]}>
        <mesh>
          <cylinderGeometry args={[1.3, 1.0, 1.8, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#fef3c7"
            transparent
            opacity={0.18}
            roughness={0.08}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Base disc */}
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.06, 32]} />
          <meshPhysicalMaterial color="#fbbf24" transparent opacity={0.22} roughness={0.15} />
        </mesh>
        {/* Liquid inside */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[1.15, 0.95, 0.7, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            transparent
            opacity={0.45}
            emissive="#fbbf24"
            emissiveIntensity={0.25}
            roughness={0.2}
          />
        </mesh>
        {/* Spout (small wedge) */}
        <mesh position={[1.15, 0.85, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.35, 0.08, 0.3]} />
          <meshPhysicalMaterial color="#fef3c7" transparent opacity={0.22} roughness={0.1} />
        </mesh>
      </group>

      {/* Reaction groups arranged in a row above the vessel */}
      {GROUPS.map((g) => {
        const active = selectedPart === g.id || hover === g.id;
        const Scene = g.Scene;
        return (
          <group
            key={g.id}
            position={[g.x, 0.55, 0]}
            onClick={(e) => { e.stopPropagation(); onSelectPart(pick(g.id)); }}
            onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover(g.id); }}
            onPointerOut={() => setHover(null)}
          >
            {/* Glow halo when active */}
            <mesh visible={active}>
              <sphereGeometry args={[0.95, 16, 16]} />
              <meshBasicMaterial
                color="#fbbf24"
                transparent
                opacity={selectedPart === g.id ? 0.2 : 0.1}
              />
            </mesh>
            <Scene />
            {/* Per-group floating label */}
            {!preview && active && (
              <Html position={[0, 0.85, 0]} center distanceFactor={10}>
                <div
                  style={{
                    background: "rgba(10,9,23,0.92)",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "sans-serif",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(251,191,36,0.55)",
                    pointerEvents: "none",
                  }}
                >
                  {g.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Main floating label — selected reaction name */}
      {!preview && activeName && (
        <Html position={[0, 2.35, 0]} center distanceFactor={9}>
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
              border: "1px solid rgba(251,191,36,0.6)",
              pointerEvents: "none",
            }}
          >
            Reaction: {activeName}
          </div>
        </Html>
      )}
    </group>
  );
}

export const ReactionExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "reaction",
  chapterId: 1,
  track: "science",
  title: "Chemical Reactions & Equations",
  subtitle: "Ch 1 · Chemical Reactions",
  description:
    "A chemical reaction rearranges atoms to form new substances. This exhibit shows the five major reaction types as molecule clusters — combination, decomposition, single displacement, double displacement, and redox — all reacting inside a central glass vessel. Atoms are colour-coded spheres; bonds are thin cylinders. Click each cluster to learn the type and a balanced example.",
  accent: "#fbbf24",
  icon: "⚗️",
  parts: [
    { id: "combination", name: "Combination Reaction", info: "Two or more reactants combine to form a single product: A + B → AB. Example: 2Mg + O₂ → 2MgO (magnesium burns in air with dazzling white light). Also CaO + H₂O → Ca(OH)₂ (slaking of lime, used in cement) — exothermic." },
    { id: "decomposition", name: "Decomposition Reaction", info: "A single compound breaks into two or more simpler substances: AB → A + B. Requires heat, light, or electricity. Example: 2H₂O →(electrolysis) 2H₂↑ + O₂↑. Thermal decomposition: CaCO₃ →(heat) CaO + CO₂↑ (limestone in lime kilns)." },
    { id: "displacement", name: "Displacement Reaction", info: "A more reactive element displaces a less reactive one from its compound: A + BC → AC + B. Example: Fe + CuSO₄ → FeSO₄ + Cu (iron displaces copper; the blue solution turns green and a reddish-brown Cu deposit forms on the iron)." },
    { id: "double-displacement", name: "Double Displacement Reaction", info: "Two compounds exchange ions to form two new compounds: AB + CD → AD + CB. Often produces a precipitate, gas, or water. Example: AgNO₃(aq) + NaCl(aq) → AgCl↓(white) + NaNO₃(aq) — the white AgCl precipitate confirms chloride ions." },
    { id: "redox", name: "Redox Reaction", info: "Oxidation and reduction occur simultaneously. Oxidation = gain of O (or loss of e⁻); Reduction = loss of O (or gain of e⁻). Example: CuO + H₂ →(heat) Cu + H₂O. Here CuO is reduced (loses O → Cu) and H₂ is oxidised (gains O → H₂O)." },
  ],
  Model: ReactionModel,
};
