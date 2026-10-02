"use client";
import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ExplodablePart — wraps one part of a 3D exhibit so it can smoothly slide
 * from its assembled `base` position out along `dir` (a unit-ish direction
 * vector, doesn't need to be normalized) by up to `distance` world units,
 * driven by the Focus Viewer's Explode slider (`explode`, 0 = assembled,
 * 1 = fully separated). Used by the heart (4 chambers + septum + great
 * vessels) and the neuron (myelin sheath peeling off the axon) so a student
 * can pull the model apart to see what's normally hidden inside/behind.
 *
 * Position is lerped every frame rather than snapping, so dragging the
 * slider reads as the model coming apart/together instead of teleporting.
 */
export function ExplodablePart({
  base,
  dir,
  distance,
  explode,
  children,
}: {
  base: [number, number, number];
  dir: [number, number, number];
  distance: number;
  explode: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    target.current.set(
      base[0] + dir[0] * distance * explode,
      base[1] + dir[1] * distance * explode,
      base[2] + dir[2] * distance * explode
    );
    // Critically-damped-ish lerp — fast enough to feel responsive to a
    // dragged slider, slow enough not to snap on a stepped/discrete change.
    const t = Math.min(1, dt * 6);
    g.position.lerp(target.current, t);
  });
  return (
    <group ref={ref} position={base}>
      {children}
    </group>
  );
}
