"use client";
import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Energy Pyramid & Food Web — 4 trophic tiers + sun
function EcosystemModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
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

  const mat = (id: string, color: string) => ({
    color,
    emissive: isActive(id) ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.7 : hover === id ? 0.4 : 0.1,
    roughness: 0.45,
    metalness: 0.1,
  });

  const tiers = [
    { id: "producers", color: "#22c55e", bottom: 1.5, top: 1.1, y: -0.8, energy: "10 000 J", emoji: "🌿" },
    { id: "primary-consumers", color: "#eab308", bottom: 1.1, top: 0.8, y: -0.4, energy: "1 000 J", emoji: "🦌" },
    { id: "secondary-consumers", color: "#f97316", bottom: 0.8, top: 0.5, y: 0.0, energy: "100 J", emoji: "🦊" },
    { id: "top-carnivores", color: "#ef4444", bottom: 0.5, top: 0.2, y: 0.4, energy: "10 J", emoji: "🦁" },
  ] as const;

  return (
    <group ref={group} scale={scale}>
      {/* Pyramid tiers (4-sided frustums, rotated to face forward) */}
      {tiers.map((t) => {
        const lift = selectedPart === t.id ? 0.15 : 0;
        return (
          <group key={t.id} position={[0, t.y + lift, 0]} rotation={[0, Math.PI / 4, 0]}>
            <mesh
              castShadow
              scale={isActive(t.id) ? 1.05 : 1}
              onClick={click(t.id)}
              onPointerOver={over(t.id)}
              onPointerOut={out}
            >
              <cylinderGeometry args={[t.top, t.bottom, 0.4, 4]} />
              <meshStandardMaterial {...mat(t.id, t.color)} />
            </mesh>
            {/* Energy label on each tier (non-preview) */}
            {!preview && (
              <Html position={[0, 0, 0]} center distanceFactor={9}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    background: "rgba(10,9,23,0.85)",
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: `1px solid ${t.color}`,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  <span>{t.emoji}</span>
                  <span>{t.energy}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Tier side labels (10% law arrows on the right) */}
      {!preview &&
        tiers.slice(0, 3).map((t, i) => {
          const next = tiers[i + 1];
          const yMid = (t.y + next.y) / 2;
          return (
            <Html key={`arrow-${i}`} position={[1.7, yMid, 0]} center distanceFactor={9}>
              <span
                style={{
                  color: "#fde047",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  background: "rgba(10,9,23,0.85)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid #fde047",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                10% →
              </span>
            </Html>
          );
        })}

      {/* Sun in upper-left corner */}
      <group position={[-1.9, 1.5, 0.4]}>
        <mesh castShadow onClick={click("sun-energy")} onPointerOver={over("sun-energy")} onPointerOut={out}>
          <sphereGeometry args={[0.34, 24, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive={isActive("sun-energy") ? "#fde047" : "#92400e"}
            emissiveIntensity={selectedPart === "sun-energy" ? 1.0 : hover === "sun-energy" ? 0.6 : 0.35}
            roughness={0.3}
            metalness={0}
          />
        </mesh>
        {/* Sun rays */}
        {Array.from({ length: 10 }).map((_, i) => {
          const ang = (i / 10) * Math.PI * 2;
          const x = Math.cos(ang) * 0.5;
          const y = Math.sin(ang) * 0.5;
          return (
            <mesh key={`ray-${i}`} position={[x, y, 0]} rotation={[0, 0, ang - Math.PI / 2]}>
              <coneGeometry args={[0.05, 0.15, 6]} />
              <meshStandardMaterial
                color="#fde047"
                emissive={isActive("sun-energy") ? "#fde047" : "#92400e"}
                emissiveIntensity={selectedPart === "sun-energy" ? 0.7 : 0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* Arrow from sun down to producers (energy flow) */}
      <group position={[-1.0, 0.45, 0.3]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh
          castShadow
          onClick={click("sun-energy")}
          onPointerOver={over("sun-energy")}
          onPointerOut={out}
        >
          <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive={isActive("sun-energy") ? "#fde047" : "#92400e"} emissiveIntensity={selectedPart === "sun-energy" ? 0.6 : 0.3} />
        </mesh>
        {/* Arrowhead at producer end */}
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.08, 0.18, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive={isActive("sun-energy") ? "#fde047" : "#92400e"} emissiveIntensity={selectedPart === "sun-energy" ? 0.6 : 0.3} />
        </mesh>
      </group>

      {/* Ground / soil disc under the pyramid (visual) */}
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.04, 32]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>

      {/* Floating label */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 1.6, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(34,197,94,0.6)",
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
  producers: "Producers (Plants)",
  "primary-consumers": "Primary Consumers (Herbivores)",
  "secondary-consumers": "Secondary Consumers (Carnivores)",
  "top-carnivores": "Top Carnivores (Apex Predators)",
  "sun-energy": "Sun — Energy Source",
};

export const EcosystemExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "ecosystem",
  chapterId: 14,
  track: "science",
  title: "Energy Pyramid & Trophic Levels",
  subtitle: "Ch 14 · Our Environment",
  description:
    "Energy flows through an ecosystem in one direction — from the Sun to producers (plants) and then up through a series of consumers. At each trophic level only about 10% of the available energy is transferred to the next (Lindeman's 10% law); the rest is lost as heat through respiration and metabolic processes. This sharp energy loss explains why food chains rarely exceed 4–5 trophic levels and why top carnivores are naturally few in number. Click each tier to explore.",
  accent: "#22c55e",
  icon: "🌍",
  parts: [
    {
      id: "producers",
      name: "Producers (Autotrophs)",
      info: "Green plants, algae and some bacteria that make their own food by photosynthesis using sunlight, CO₂ and water. They form the broad base of the pyramid and capture roughly 1% of the solar energy falling on them. Energy available at this level: ~10 000 J.",
    },
    {
      id: "primary-consumers",
      name: "Primary Consumers (Herbivores)",
      info: "Plant-eating animals such as deer, rabbits, grasshoppers and cattle. They feed directly on producers. Only about 10% of the producer energy is transferred here (the 10% law); the rest is lost as heat. Energy available: ~1 000 J.",
    },
    {
      id: "secondary-consumers",
      name: "Secondary Consumers (Small Carnivores)",
      info: "Small carnivores that feed on herbivores — frogs, snakes, foxes, small birds. Again ~10% of the previous level's energy is passed on. Energy available: ~100 J. Their populations are smaller than herbivore populations.",
    },
    {
      id: "top-carnivores",
      name: "Top Carnivores (Apex Predators)",
      info: "Apex predators such as lions, tigers and eagles that sit at the very top of the food chain. Energy available: ~10 J. Their numbers are naturally very low because very little energy remains at this level — which is why ecosystems can support few top predators.",
    },
    {
      id: "sun-energy",
      name: "Sun (Ultimate Energy Source)",
      info: "The Sun is the ultimate source of energy for nearly all ecosystems. Sunlight is captured by producers during photosynthesis and converted into chemical energy stored in glucose. This energy then flows through the food chain. The flow is unidirectional — energy is not recycled, only materials (like carbon, nitrogen) are.",
    },
  ],
  Model: EcosystemModel,
};
