"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Human heart — 4 chambers + major vessels, clickable parts
function HeartModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) {
      group.current.rotation.y += dt * 0.15;
    }
  });

  const partMat = (id: string, color: string, emissive = "#220000") => ({
    color,
    emissive: selectedPart === id || hover === id ? color : emissive,
    emissiveIntensity: selectedPart === id ? 0.9 : hover === id ? 0.5 : 0.15,
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  const scale = preview ? 0.5 : 1;

  return (
    <group ref={group} scale={scale}>
      {/* Left Atrium (top-left, oxygenated) */}
      <mesh
        position={[-0.55, 0.55, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "left-atrium"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("left-atrium"); }}
        onPointerOut={() => setHover(null)}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial {...partMat("left-atrium", "#ef4444")} />
      </mesh>

      {/* Right Atrium (top-right, deoxygenated) */}
      <mesh
        position={[0.55, 0.55, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "right-atrium"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("right-atrium"); }}
        onPointerOut={() => setHover(null)}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial {...partMat("right-atrium", "#3b82f6")} />
      </mesh>

      {/* Left Ventricle (bottom-left, thick wall) */}
      <mesh
        position={[-0.5, -0.55, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "left-ventricle"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("left-ventricle"); }}
        onPointerOut={() => setHover(null)}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial {...partMat("left-ventricle", "#dc2626")} />
      </mesh>

      {/* Right Ventricle (bottom-right) */}
      <mesh
        position={[0.5, -0.55, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "right-ventricle"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("right-ventricle"); }}
        onPointerOut={() => setHover(null)}
      >
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial {...partMat("right-ventricle", "#2563eb")} />
      </mesh>

      {/* Aorta — arching up from left ventricle */}
      <mesh position={[-0.3, 1.15, 0]} rotation={[0, 0, 0.5]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "aorta"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("aorta"); }}
        onPointerOut={() => setHover(null)}
      >
        <cylinderGeometry args={[0.18, 0.18, 1.1, 24]} />
        <meshStandardMaterial {...partMat("aorta", "#b91c1c")} />
      </mesh>

      {/* Pulmonary Artery — from right ventricle */}
      <mesh position={[0.3, 1.15, 0.1]} rotation={[0, 0, -0.5]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "pulmonary-artery"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("pulmonary-artery"); }}
        onPointerOut={() => setHover(null)}
      >
        <cylinderGeometry args={[0.16, 0.16, 1.0, 24]} />
        <meshStandardMaterial {...partMat("pulmonary-artery", "#1d4ed8")} />
      </mesh>

      {/* Superior Vena Cava — into right atrium */}
      <mesh position={[0.62, 1.2, -0.1]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(preview ? null : "vena-cava"); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("vena-cava"); }}
        onPointerOut={() => setHover(null)}
      >
        <cylinderGeometry args={[0.15, 0.15, 0.9, 24]} />
        <meshStandardMaterial {...partMat("vena-cava", "#1e40af")} />
      </mesh>

      {/* Septum divider (subtle) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 1.6, 0.7]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.6} transparent opacity={0.4} />
      </mesh>

      {/* Floating labels (non-preview only) */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 1.9, 0]} center distanceFactor={8} occlude={false}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(239,68,68,0.5)", pointerEvents: "none",
          }}>
            {selectedPart || hover ? PART_LABELS[selectedPart || hover || ""] || "" : ""}
          </div>
        </Html>
      )}
    </group>
  );
}

const PART_LABELS: Record<string, string> = {
  "left-atrium": "Left Atrium",
  "right-atrium": "Right Atrium",
  "left-ventricle": "Left Ventricle",
  "right-ventricle": "Right Ventricle",
  "aorta": "Aorta",
  "pulmonary-artery": "Pulmonary Artery",
  "vena-cava": "Superior Vena Cava",
};

export const HeartExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "heart",
  chapterId: 6,
  track: "science",
  title: "The Human Heart",
  subtitle: "Ch 6 · Life Processes — Circulation",
  description:
    "A four-chambered muscular pump that drives double circulation. Deoxygenated blood enters the right side and is sent to the lungs; oxygenated blood returns to the left side and is pumped to the whole body. Click each chamber or vessel to learn its role.",
  accent: "#ef4444",
  icon: "🫀",
  parts: [
    { id: "left-atrium", name: "Left Atrium", info: "Receives oxygenated blood from the lungs via the pulmonary veins. Pumps it into the left ventricle through the mitral valve." },
    { id: "right-atrium", name: "Right Atrium", info: "Receives deoxygenated blood from the body via the superior and inferior vena cavae. Pumps it into the right ventricle." },
    { id: "left-ventricle", name: "Left Ventricle", info: "The thickest-walled chamber. Pumps oxygenated blood into the aorta at high pressure to supply the entire body. Its wall is ~3× thicker than the right ventricle." },
    { id: "right-ventricle", name: "Right Ventricle", info: "Pumps deoxygenated blood to the lungs via the pulmonary artery. Lower pressure than the left since lungs are close by." },
    { id: "aorta", name: "Aorta", info: "The largest artery in the body. Carries oxygenated blood from the left ventricle to all organs. Walls are thick and elastic to withstand high pressure." },
    { id: "pulmonary-artery", name: "Pulmonary Artery", info: "The only artery that carries deoxygenated blood. Transports blood from the right ventricle to the lungs for oxygenation." },
    { id: "vena-cava", name: "Superior Vena Cava", info: "Brings deoxygenated blood from the upper body (head, arms) to the right atrium. The inferior vena cava brings it from the lower body." },
  ],
  Model: HeartModel,
};
