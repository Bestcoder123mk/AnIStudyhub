"use client";
import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Flower with reproductive parts — sepals, petals, stamens, pistil
function FlowerModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.15;
  });

  const isActive = (id: string) => selectedPart === id || hover === id;
  const mat = (id: string, color: string) => ({
    color,
    emissive: isActive(id) ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.85 : hover === id ? 0.45 : 0.12,
    roughness: 0.4,
    metalness: 0.05,
  });

  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  // shared handlers
  const click = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectPart(pick(id));
  };
  const over = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!preview) setHover(id);
  };
  const out = () => setHover(null);

  return (
    <group ref={group} scale={scale} rotation={[0.35, 0, 0]}>
      {/* Stem */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 2.2, 12]} />
        <meshStandardMaterial color="#16a34a" roughness={0.6} />
      </mesh>
      {/* Leaf on stem */}
      <mesh position={[0.18, -1.5, 0]} rotation={[0, 0, -0.7]} scale={[0.4, 0.12, 0.2]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>

      {/* Receptacle (base, green) — non-clickable visual */}
      <mesh position={[0, -0.55, 0]}>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>

      {/* Sepals — 4 small green cones angled outward from the receptacle */}
      {[0, 1, 2, 3].map((i) => {
        const ang = (i / 4) * Math.PI * 2 + Math.PI / 8;
        const r = 0.36;
        return (
          <group
            key={`sepal-${i}`}
            position={[Math.cos(ang) * r, -0.45, Math.sin(ang) * r]}
            rotation={[Math.sin(ang) * 0.85, 0, -Math.cos(ang) * 0.85]}
          >
            <mesh
              castShadow
              scale={isActive("sepal") ? 1.2 : 1}
              onClick={click("sepal")}
              onPointerOver={over("sepal")}
              onPointerOut={out}
            >
              <coneGeometry args={[0.13, 0.5, 12]} />
              <meshStandardMaterial {...mat("sepal", "#16a34a")} />
            </mesh>
          </group>
        );
      })}

      {/* Petals — 5 large pink flattened spheres radiating outward */}
      {Array.from({ length: 5 }).map((_, i) => {
        const ang = (i / 5) * Math.PI * 2;
        const r = 0.42;
        return (
          <group
            key={`petal-${i}`}
            position={[Math.cos(ang) * r, -0.12, Math.sin(ang) * r]}
            rotation={[0, -ang, 0]}
          >
            <group rotation={[0.55, 0, 0]} scale={[0.55, 0.12, 0.95]}>
              <mesh
                castShadow
                scale={isActive("petal") ? 1.2 : 1}
                onClick={click("petal")}
                onPointerOver={over("petal")}
                onPointerOut={out}
              >
                <sphereGeometry args={[0.85, 24, 16]} />
                <meshStandardMaterial {...mat("petal", "#f472b6")} />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* Stamens — 6 (filament + anther as one part) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * Math.PI * 2;
        const r = 0.28;
        const lift = isActive("stamen") ? 0.08 : 0;
        return (
          <group
            key={`stamen-${i}`}
            position={[Math.cos(ang) * r, -0.18 + lift, Math.sin(ang) * r]}
            rotation={[Math.sin(ang) * 0.18, 0, -Math.cos(ang) * 0.18]}
            scale={isActive("stamen") ? 1.15 : 1}
          >
            {/* Filament */}
            <mesh position={[0, 0.38, 0]} castShadow onClick={click("stamen")} onPointerOver={over("stamen")} onPointerOut={out}>
              <cylinderGeometry args={[0.028, 0.04, 0.72, 10]} />
              <meshStandardMaterial {...mat("stamen", "#fde68a")} />
            </mesh>
            {/* Anther */}
            <mesh position={[0, 0.78, 0]} castShadow onClick={click("stamen")} onPointerOver={over("stamen")} onPointerOut={out}>
              <sphereGeometry args={[0.1, 16, 12]} />
              <meshStandardMaterial {...mat("stamen", "#facc15")} />
            </mesh>
          </group>
        );
      })}

      {/* Pistil — central (ovary + style + stigma as one part) */}
      <group scale={isActive("pistil") ? 1.18 : 1} position={[0, isActive("pistil") ? 0.08 : 0, 0]}>
        {/* Ovary (swollen green base) */}
        <mesh position={[0, -0.12, 0]} castShadow onClick={click("pistil")} onPointerOver={over("pistil")} onPointerOut={out}>
          <sphereGeometry args={[0.24, 24, 16]} />
          <meshStandardMaterial {...mat("pistil", "#84cc16")} />
        </mesh>
        {/* Style */}
        <mesh position={[0, 0.4, 0]} castShadow onClick={click("pistil")} onPointerOver={over("pistil")} onPointerOut={out}>
          <cylinderGeometry args={[0.04, 0.05, 1.0, 12]} />
          <meshStandardMaterial {...mat("pistil", "#a3e635")} />
        </mesh>
        {/* Stigma (sticky knob on top) */}
        <mesh position={[0, 0.98, 0]} castShadow onClick={click("pistil")} onPointerOver={over("pistil")} onPointerOut={out}>
          <sphereGeometry args={[0.14, 20, 16]} />
          <meshStandardMaterial {...mat("pistil", "#facc15")} roughness={0.5} />
        </mesh>
      </group>

      {/* Floating label */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 1.7, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(244,114,182,0.6)",
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
  sepal: "Sepals (Calyx)",
  petal: "Petals (Corolla)",
  stamen: "Stamen — Male Part",
  pistil: "Pistil — Female Part",
};

export const FlowerExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "flower",
  chapterId: 8,
  track: "science",
  title: "Flower & Its Reproductive Parts",
  subtitle: "Ch 8 · How Do Organisms Reproduce",
  description:
    "A flower is the reproductive organ of angiosperms (flowering plants). The stamen (male) produces pollen grains carrying male gametes, while the pistil (female) houses the ovary containing ovules (female gametes). After pollination and double fertilisation, the ovule develops into a seed and the ovary into a fruit. Click each part to explore sexual reproduction in plants.",
  accent: "#f472b6",
  icon: "🌸",
  parts: [
    {
      id: "sepal",
      name: "Sepals (Calyx)",
      info: "The outermost whorl of small green leaf-like structures that protect the developing flower bud. Collectively they form the calyx. After blooming, sepals may remain at the base and photosynthesise.",
    },
    {
      id: "petal",
      name: "Petals (Corolla)",
      info: "Brightly coloured — often scented with nectar — to attract pollinators such as bees, butterflies and birds. Collectively called the corolla. Their colour and markings guide insects to the nectar and reproductive parts.",
    },
    {
      id: "stamen",
      name: "Stamen (Male Part)",
      info: "The male reproductive organ, made of a thin stalk called the filament and a knob-like anther on top. The anther produces pollen grains (containing male gametes) by meiosis. Collectively the stamens form the androecium.",
    },
    {
      id: "pistil",
      name: "Pistil (Female Part)",
      info: "The female reproductive organ: a swollen ovary at the base (containing ovules), a thin style, and a sticky stigma on top that catches pollen. After fertilisation the ovary becomes the fruit and ovules become seeds. Collectively called the gynoecium.",
    },
  ],
  Model: FlowerModel,
};
