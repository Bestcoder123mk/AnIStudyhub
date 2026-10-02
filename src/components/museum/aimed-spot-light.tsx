"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

type SpotProps = Omit<ThreeElements["spotLight"], "target">;

/**
 * A spotlight that actually points where you tell it to.
 *
 * In three.js a SpotLight aims at `light.target`, and that target's WORLD
 * position is only ever updated if the target object is itself part of the
 * scene graph. Setting `target-position={[x, y, z]}` on a <spotLight> moves
 * the target object but never adds it to the scene, so the renderer keeps
 * reading an identity matrix and the light silently aims at (0, 0, 0) — the
 * aim you wrote is ignored. (Verified against three@0.185: with the target
 * detached its world position stays [0,0,0]; adding it puts it at the set
 * position.)
 *
 * That is what was going wrong in the museum: every per-alcove light in a
 * subject wing and every per-portal light in the lobby was pointing at the
 * room's centre instead of at its own exhibit, so their cones landed as
 * bright round pools on walls and floor wherever they happened to cross —
 * the "glowing ball of light on the walls" — while the exhibits they were
 * meant to light got almost nothing. Intensity tuning alone could never
 * fully fix that, only push the pools dimmer.
 *
 * This puts the target in the scene (as a sibling primitive) so `aim` is
 * honoured.
 */
export function AimedSpotLight({ aim, ...props }: SpotProps & { aim: [number, number, number] }) {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <>
      <primitive object={target} position={aim} />
      <spotLight {...props} target={target} />
    </>
  );
}
