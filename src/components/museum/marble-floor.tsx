"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useMuseumQuality } from "./quality-context";

type FloorShape =
  | { type: "circle"; radius: number }
  | { type: "plane"; width: number; length: number };

/**
 * Real-time reflective polished marble, tuned for "premium showroom" rather
 * than "wet parking lot." The previous lobby params (blur [300,80],
 * roughness 0.7) produced a genuinely soft/hazy reflection — likely a real
 * source of the "blurry" feedback, not just a perception issue. This is
 * meaningfully crisper, and now shared so the wings (which had no live
 * reflection at all, just a flat clearcoat material) match the lobby
 * instead of looking like a downgrade once you walk through a portal.
 *
 * Auto-downgrades to a plain (non-reflective) PBR material under sustained
 * low FPS via MuseumQualityProvider — the reflection pass (an extra render
 * of the scene into a texture every frame) is the single most expensive
 * thing in this scene, so it's the first thing to go on weak hardware.
 */
export function MarbleFloor({
  shape,
  color = "#1a1612",
  position,
}: {
  shape: FloorShape;
  color?: string;
  position?: [number, number, number];
}) {
  const quality = useMuseumQuality();

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      {shape.type === "circle" ? (
        <circleGeometry args={[shape.radius, 64]} />
      ) : (
        <planeGeometry args={[shape.width, shape.length]} />
      )}
      {quality === "high" ? (
        <MeshReflectorMaterial
          blur={[90, 30]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={12}
          roughness={0.28}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color={color}
          metalness={0.6}
          mirror={0.35}
        />
      ) : (
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.5} />
      )}
    </mesh>
  );
}
