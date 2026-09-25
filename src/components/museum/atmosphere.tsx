"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Volumetric god-ray light shaft — a cone of additive-blended planes
export function GodRays({
  position = [0, 8, 0] as [number, number, number],
  target = [0, 0, 0] as [number, number, number],
  color = "#ffd9a0",
  radius = 3,
  intensity = 0.4,
}: {
  position?: [number, number, number];
  target?: [number, number, number];
  color?: string;
  radius?: number;
  intensity?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = intensity * (0.6 + Math.sin(performance.now() * 0.0008 + i * 0.5) * 0.3);
      });
    }
  });

  const shafts = useMemo(() => {
    const arr: { rot: [number, number, number]; pos: [number, number, number] }[] = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push({
        rot: [0, angle, 0],
        pos: [0, 0, 0],
      });
    }
    return arr;
  }, []);

  const dir = useMemo(() => {
    const d = new THREE.Vector3(target[0] - position[0], target[1] - position[1], target[2] - position[2]);
    return d;
  }, [position, target]);

  const length = dir.length();
  const midY = position[1] + dir.y * 0.5;

  return (
    <group ref={ref} position={[position[0] + dir.x * 0.5, midY, position[2] + dir.z * 0.5]}>
      {shafts.map((s, i) => (
        <mesh key={i} rotation={s.rot}>
          <planeGeometry args={[radius * 2, length, 1, 4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      ))}
      {/* Central glow beam */}
      <mesh>
        <cylinderGeometry args={[radius * 0.3, radius * 0.8, length, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity * 0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Floating dust motes — Points system drifting slowly
export function DustParticles({
  count = 200,
  bounds = [12, 7, 12] as [number, number, number],
  color = "#ffd9a0",
  size = 0.04,
}: {
  count?: number;
  bounds?: [number, number, number];
  color?: string;
  size?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * bounds[0] * 2;
      pos[i * 3 + 1] = Math.random() * bounds[1];
      pos[i * 3 + 2] = (Math.random() - 0.5) * bounds[2] * 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = Math.random() * 0.002 + 0.001;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions: pos, velocities: vel };
  }, [count, bounds]);

  useFrame(() => {
    if (!ref.current) return;
    const geom = ref.current.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      // Wrap around
      if (pos[i * 3 + 1] > bounds[1]) pos[i * 3 + 1] = 0;
      if (pos[i * 3] > bounds[0]) pos[i * 3] = -bounds[0];
      if (pos[i * 3] < -bounds[0]) pos[i * 3] = bounds[0];
      if (pos[i * 3 + 2] > bounds[2]) pos[i * 3 + 2] = -bounds[2];
      if (pos[i * 3 + 2] < -bounds[2]) pos[i * 3 + 2] = bounds[2];
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
