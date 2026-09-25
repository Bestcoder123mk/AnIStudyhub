"use client";
import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Human Eye — 3D cross-section showing internal optical parts
function EyeModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.15;
  });

  const isActive = (id: string) => selectedPart === id || hover === id;
  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const click = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectPart(pick(id));
  };
  const over = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!preview) setHover(id);
  };
  const out = () => setHover(null);

  // Standard mat with emissive glow on selected/hover
  const mat = (id: string, color: string) => ({
    color,
    emissive: isActive(id) ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.8 : hover === id ? 0.45 : 0.12,
    roughness: 0.35,
    metalness: 0.05,
  });

  return (
    <group ref={group} scale={scale}>
      {/* Sclera — white outer coat, semi-transparent so interior is visible (visual only) */}
      <mesh>
        <sphereGeometry args={[1.0, 48, 32]} />
        <meshStandardMaterial
          color="#fafafa"
          emissive={isActive("retina") ? "#fafafa" : "#0a0a0a"}
          emissiveIntensity={0.05}
          roughness={0.3}
          metalness={0}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Retina — back-half inner lining, reddish-orange */}
      <mesh castShadow onClick={click("retina")} onPointerOver={over("retina")} onPointerOut={out}>
        <sphereGeometry args={[0.92, 48, 32, Math.PI / 2, Math.PI, 0, Math.PI]} />
        <meshStandardMaterial {...mat("retina", "#ea580c")} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Optic disc — small bright spot where optic nerve attaches */}
      <mesh position={[-0.78, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.12, 24]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={0.3} />
      </mesh>

      {/* Cornea — transparent bulge at front (+Z) */}
      <mesh position={[0, 0, 0.78]} castShadow onClick={click("cornea")} onPointerOver={over("cornea")} onPointerOut={out}>
        <sphereGeometry args={[0.5, 32, 24]} />
        <meshStandardMaterial
          color="#bae6fd"
          emissive={isActive("cornea") ? "#60a5fa" : "#0c4a6e"}
          emissiveIntensity={selectedPart === "cornea" ? 0.7 : hover === "cornea" ? 0.4 : 0.05}
          roughness={0.05}
          metalness={0}
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* Iris — colored ring (brown) */}
      <mesh position={[0, 0, 0.62]} castShadow onClick={click("iris")} onPointerOver={over("iris")} onPointerOut={out}>
        <torusGeometry args={[0.27, 0.13, 16, 32]} />
        <meshStandardMaterial {...mat("iris", "#92400e")} roughness={0.45} />
      </mesh>

      {/* Pupil — black circle in iris center */}
      <mesh position={[0, 0, 0.635]} castShadow onClick={click("pupil")} onPointerOver={over("pupil")} onPointerOut={out}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial
          color="#030712"
          emissive={isActive("pupil") ? "#1e293b" : "#000000"}
          emissiveIntensity={selectedPart === "pupil" ? 0.6 : hover === "pupil" ? 0.3 : 0}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lens — biconvex transparent behind iris */}
      <mesh position={[0, 0, 0.42]} scale={[0.55, 0.55, 0.32]} castShadow onClick={click("lens")} onPointerOver={over("lens")} onPointerOut={out}>
        <sphereGeometry args={[0.45, 32, 24]} />
        <meshStandardMaterial
          color="#dbeafe"
          emissive={isActive("lens") ? "#60a5fa" : "#1e3a8a"}
          emissiveIntensity={selectedPart === "lens" ? 0.65 : hover === "lens" ? 0.35 : 0.05}
          roughness={0.05}
          metalness={0}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Suspensory ligaments — thin lines from lens to ciliary muscle (decorative) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ang = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`lig-${i}`}
            position={[Math.cos(ang) * 0.5, Math.sin(ang) * 0.5, 0.5]}
            rotation={[0, 0, ang + Math.PI / 2]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
            <meshStandardMaterial color="#fef3c7" />
          </mesh>
        );
      })}

      {/* Optic nerve — cylinder exiting the back (-Z) */}
      <mesh position={[0, 0, -1.25]} rotation={[Math.PI / 2, 0, 0]} castShadow onClick={click("optic-nerve")} onPointerOver={over("optic-nerve")} onPointerOut={out}>
        <cylinderGeometry args={[0.14, 0.16, 0.55, 24]} />
        <meshStandardMaterial {...mat("optic-nerve", "#fef3c7")} roughness={0.55} />
      </mesh>
      {/* Optic nerve cross-striations */}
      <mesh position={[0, 0, -1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#fde68a" roughness={0.5} />
      </mesh>

      {/* Floating label */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 1.5, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(96,165,250,0.6)",
              pointerEvents: "none",
            }}
          >
            {PART_LABELS[selectedPart || hover || ""]}
          </div>
        </Html>
      )}
    </group>
  );
}

const PART_LABELS: Record<string, string> = {
  cornea: "Cornea",
  iris: "Iris",
  pupil: "Pupil",
  lens: "Eye Lens",
  retina: "Retina",
  "optic-nerve": "Optic Nerve",
};

export const EyeExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "eye",
  chapterId: 11,
  track: "science",
  title: "The Human Eye — Cross-Section",
  subtitle: "Ch 11 · The Human Eye & The Colourful World",
  description:
    "The human eye is a remarkable biological camera. Light enters through the transparent cornea, passes through the pupil (a hole in the coloured iris), and is focused by the biconvex lens onto the retina at the back. The retina converts light into electrical signals that travel along the optic nerve to the brain. The eye can change its focal length (accommodation) to focus on near or far objects. Click each part to learn its function.",
  accent: "#60a5fa",
  icon: "👁️",
  parts: [
    {
      id: "cornea",
      name: "Cornea",
      info: "The transparent, dome-shaped front surface of the eye. It carries out most of the refraction of incoming light (~70%) because light bends sharply when passing from air into the denser corneal tissue. It has no blood vessels and is nourished by tears and aqueous humour.",
    },
    {
      id: "iris",
      name: "Iris",
      info: "The coloured muscular diaphragm behind the cornea. It controls the size of the pupil — contracting in bright light (pupil shrinks) and relaxing in dim light (pupil widens), regulating the amount of light entering the eye. Brown eyes have more melanin; blue eyes have less.",
    },
    {
      id: "pupil",
      name: "Pupil",
      info: "The small black circular opening in the centre of the iris through which light enters the eye. It appears black because most light entering is absorbed by the dark tissues inside. Its size is adjusted by the iris muscles — a reflex called the pupillary reflex.",
    },
    {
      id: "lens",
      name: "Eye Lens",
      info: "A flexible biconvex crystalline lens behind the iris that fine-focuses light onto the retina. Made of protein fibres, it changes shape via the ciliary muscles: thicker (more curved) to focus on near objects and thinner (flatter) for distant objects. This ability is called accommodation.",
    },
    {
      id: "retina",
      name: "Retina",
      info: "The light-sensitive inner lining at the back of the eye. It contains millions of photoreceptor cells — rods (for dim-light, black-and-white vision) and cones (for bright-light, colour vision). The retina converts light into electrical impulses sent to the brain via the optic nerve.",
    },
    {
      id: "optic-nerve",
      name: "Optic Nerve",
      info: "A bundle of ~1 million nerve fibres that transmits electrical signals from the retina to the brain's visual cortex. The point where it exits the eye (optic disc) has no photoreceptors, creating the eye's 'blind spot'. The brain fills in this gap from surrounding information.",
    },
  ],
  Model: EyeModel,
};
