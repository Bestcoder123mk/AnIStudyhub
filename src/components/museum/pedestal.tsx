"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition } from "./exhibits/types";

export function Pedestal({
  exhibit,
  angle,
  radius,
  index,
  registerPick,
  active,
  marble = true,
}: {
  exhibit: ExhibitDefinition;
  angle: number;
  radius: number;
  index: number;
  registerPick: (obj: THREE.Object3D) => void;
  active: boolean;
  marble?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const previewRef = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const x = radius === 0 ? 0 : Math.cos(angle) * radius;
  const z = radius === 0 ? 0 : Math.sin(angle) * radius;

  useFrame((_, dt) => {
    if (previewRef.current && exhibit.kind === "3d") previewRef.current.rotation.y += dt * 0.4;
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.opacity = active ? 0.6 + Math.sin(performance.now() * 0.004) * 0.2 : 0.28;
    }
  });

  const Model = exhibit.Model;
  // Marble palette
  const baseColor = marble ? "#f4efe4" : "#1a1825";
  const topColor = marble ? "#ede5d3" : "#2a2638";

  return (
    <group
      ref={(g) => {
        group.current = g;
        if (g) {
          g.userData.exhibitId = exhibit.id;
          registerPick(g);
        }
      }}
      position={[x, 0, z]}
    >
      {/* Base — marble pedestal */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshPhysicalMaterial color={baseColor} roughness={0.22} metalness={0.05} clearcoat={0.55} clearcoatRoughness={0.25} reflectivity={0.4} />
      </mesh>
      {/* Pedestal cap */}
      <mesh position={[0, 1.22, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.08, 1.8]} />
        <meshPhysicalMaterial color={topColor} roughness={0.18} metalness={0.15} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      {/* Decorative base molding */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[1.75, 0.12, 1.75]} />
        <meshPhysicalMaterial color={marble ? "#d9ceb5" : "#2a2638"} roughness={0.28} metalness={0.2} clearcoat={0.4} />
      </mesh>

      {/* Glowing accent ring on cap */}
      <mesh ref={glow} position={[0, 1.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.75, 32]} />
        <meshBasicMaterial color={exhibit.accent} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Preview: 3D model (rotating) OR framed painting (for panels) */}
      {exhibit.kind === "3d" && Model ? (
        <group ref={previewRef} position={[0, 2.1, 0]} scale={0.42}>
          <Model selectedPart={null} onSelectPart={() => {}} preview />
        </group>
      ) : (
        <Html position={[0, 2.15, 0]} center distanceFactor={6} occlude={false} zIndexRange={[15, 0]}>
          <div style={{
            width: 110, height: 130, borderRadius: 6, overflow: "hidden",
            border: `3px solid ${exhibit.accent}`,
            boxShadow: `0 0 20px ${exhibit.accent}66, inset 0 0 0 1px rgba(0,0,0,0.4)`,
            background: `linear-gradient(160deg, ${exhibit.accent}33, #1a1410 70%)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 6, pointerEvents: "none",
          }}>
            <div style={{ fontSize: 38, lineHeight: 1, filter: `drop-shadow(0 0 8px ${exhibit.accent})` }}>{exhibit.icon}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: exhibit.accent, textAlign: "center", padding: "0 6px", lineHeight: 1.1 }}>
              {exhibit.title}
            </div>
          </div>
        </Html>
      )}

      {/* Floating label */}
      <Html position={[0, 3.5, 0]} center distanceFactor={11} occlude={false} zIndexRange={[20, 0]}>
        <div style={{
          background: marble ? "rgba(40,32,20,0.88)" : "rgba(10,9,23,0.85)",
          border: `1px solid ${exhibit.accent}80`,
          borderRadius: 10,
          padding: "8px 14px",
          color: "#fff",
          fontFamily: "var(--font-sans), sans-serif",
          textAlign: "center",
          pointerEvents: "none",
          boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 18px ${exhibit.accent}40`,
          minWidth: 140,
        }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>{exhibit.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, color: exhibit.accent }}>{exhibit.title}</div>
          <div style={{ fontSize: 9, opacity: 0.75, marginTop: 2 }}>{exhibit.subtitle}</div>
        </div>
      </Html>

      {/* Number plate */}
      <Html position={[0, 0.6, 0.81]} center distanceFactor={10} occlude={false}>
        <div style={{
          color: exhibit.accent, fontFamily: "monospace", fontSize: 11, fontWeight: 700,
          background: "rgba(20,15,8,0.5)", padding: "2px 8px", borderRadius: 4, border: `1px solid ${exhibit.accent}60`,
          pointerEvents: "none",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </Html>
    </group>
  );
}
