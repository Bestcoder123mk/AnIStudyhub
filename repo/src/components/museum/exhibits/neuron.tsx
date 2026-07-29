"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Neuron (nerve cell) — soma, dendrites, axon, myelin, terminal
function NeuronModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);
  useFrame((_, dt) => { if (group.current && !preview) group.current.rotation.y += dt * 0.12; });

  const mat = (id: string, color: string) => ({
    color,
    emissive: selectedPart === id || hover === id ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.8 : hover === id ? 0.45 : 0,
    roughness: 0.4, metalness: 0.1,
  });
  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => preview ? null : id;

  return (
    <group ref={group} scale={scale}>
      {/* Soma (cell body) */}
      <mesh position={[0, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("soma")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("soma"); }}
        onPointerOut={() => setHover(null)}>
        <icosahedronGeometry args={[0.7, 2]} />
        <meshStandardMaterial {...mat("soma", "#fbbf24")} />
      </mesh>

      {/* Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>

      {/* Dendrites — branching inputs */}
      {DEGEN_DIRS.map((d, i) => (
        <mesh key={i} position={[d.x * 0.9, d.y * 0.9, d.z * 0.9]} rotation={[0, 0, Math.atan2(d.y, d.x)]}
          onClick={(e) => { e.stopPropagation(); onSelectPart(pick("dendrites")); }}
          onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("dendrites"); }}
          onPointerOut={() => setHover(null)}>
          <cylinderGeometry args={[0.06, 0.12, 1.1, 12]} />
          <meshStandardMaterial {...mat("dendrites", "#fcd34d")} />
        </mesh>
      ))}

      {/* Axon — long cylinder to the right */}
      <mesh position={[2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("axon")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("axon"); }}
        onPointerOut={() => setHover(null)}>
        <cylinderGeometry args={[0.16, 0.16, 3.2, 24]} />
        <meshStandardMaterial {...mat("axon", "#fb923c")} />
      </mesh>

      {/* Myelin sheaths — bead-like segments along axon */}
      {MYELIN_POS.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}
          onClick={(e) => { e.stopPropagation(); onSelectPart(pick("myelin")); }}
          onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("myelin"); }}
          onPointerOut={() => setHover(null)}>
          <cylinderGeometry args={[0.3, 0.3, 0.35, 20]} />
          <meshStandardMaterial {...mat("myelin", "#a78bfa")} />
        </mesh>
      ))}

      {/* Axon terminal — branching end */}
      <group position={[4.0, 0, 0]}>
        <mesh castShadow
          onClick={(e) => { e.stopPropagation(); onSelectPart(pick("terminal")); }}
          onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("terminal"); }}
          onPointerOut={() => setHover(null)}>
          <coneGeometry args={[0.3, 0.6, 16]} />
          <meshStandardMaterial {...mat("terminal", "#f472b6")} />
        </mesh>
        {[-0.5, 0.5].map((dy, i) => (
          <mesh key={i} position={[0.4, dy, 0]} rotation={[0, 0, Math.PI / 2 + (dy > 0 ? -0.5 : 0.5)]}
            onClick={(e) => { e.stopPropagation(); onSelectPart(pick("terminal")); }}>
            <cylinderGeometry args={[0.05, 0.1, 0.6, 12]} />
            <meshStandardMaterial {...mat("terminal", "#f472b6")} />
          </mesh>
        ))}
      </group>

      {!preview && (selectedPart || hover) && (
        <Html position={[0, 1.5, 0]} center distanceFactor={8}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(251,191,36,0.5)", pointerEvents: "none",
          }}>
            {PART_LABELS[selectedPart || hover || ""]}
          </div>
        </Html>
      )}
    </group>
  );
}

const DEGEN_DIRS = [
  { x: -0.9, y: 0.8, z: 0 }, { x: -0.9, y: -0.8, z: 0.2 },
  { x: -0.8, y: 0.3, z: -0.7 }, { x: -0.8, y: -0.3, z: 0.7 },
  { x: -0.5, y: 1.0, z: 0.3 },
];
const MYELIN_POS = [1.4, 1.95, 2.5, 3.05, 3.6];
const PART_LABELS: Record<string, string> = {
  soma: "Cell Body (Soma)", dendrites: "Dendrites", axon: "Axon",
  myelin: "Myelin Sheath", terminal: "Axon Terminal",
};

export const NeuronExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "neuron",
  chapterId: 7,
  track: "science",
  title: "The Neuron",
  subtitle: "Ch 7 · Control & Coordination",
  description:
    "The structural and functional unit of the nervous system. Neurons carry electrical impulses (action potentials) from receptors to the brain and spinal cord, and back to effectors. Myelin sheaths insulate the axon and speed up signal conduction. Click each part to learn its function.",
  accent: "#fbbf24",
  icon: "🧠",
  parts: [
    { id: "soma", name: "Cell Body (Soma)", info: "Contains the nucleus and cytoplasm. Integrates signals arriving from dendrites and decides whether to fire an impulse." },
    { id: "dendrites", name: "Dendrites", info: "Short, branched extensions that receive chemical messages from other neurons or sensory receptors and pass them toward the soma." },
    { id: "axon", name: "Axon", info: "A long, single fibre that carries the electrical impulse away from the soma toward the synapse. Can be over a metre long in some neurons." },
    { id: "myelin", name: "Myelin Sheath", info: "A fatty insulating layer around the axon (made by Schwann cells). Allows saltatory conduction — the impulse jumps between gaps (Nodes of Ranvier), greatly increasing speed." },
    { id: "terminal", name: "Axon Terminal", info: "The branched ending of the axon. Releases neurotransmitters into the synapse to pass the signal to the next neuron or an effector (muscle/gland)." },
  ],
  Model: NeuronModel,
};
