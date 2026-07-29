"use client";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface TourPose { x: number; z: number; yaw: number; }

// Room bounds passed in by each scene, since the old hardcoded values
// (maxX=4.2, maxZ=100) didn't match any actual room: too narrow for the
// circular lobby (blocked reaching 4 of 5 subject portals) and far longer
// than any chapter room's real length (let you walk straight through the
// far wall into the void beyond).
export type WalkBounds =
  | { kind: "rect"; maxX: number; minZ: number; maxZ: number }
  | { kind: "radial"; radius: number };

// Minimal first-person controller: drag to look, WASD/arrows to move, click to inspect.
export function WalkControls({
  onPick,
  pickTargets,
  enabled = true,
  spawnPose,
  bounds,
}: {
  onPick?: (id: string) => void;
  pickTargets?: React.RefObject<THREE.Object3D[]>;
  enabled?: boolean;
  spawnPose?: TourPose | null;
  bounds?: WalkBounds;
}) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, moved: false });
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const didSpawn = useRef(false);
  const bobPhase = useRef(0);

  useEffect(() => {
    const dom = gl.domElement;
    const EYE = 1.7;

    if (spawnPose && !didSpawn.current) {
      camera.position.set(spawnPose.x, EYE, spawnPose.z);
      yaw.current = spawnPose.yaw;
      pitch.current = 0;
      didSpawn.current = true;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };

    const onPointerDown = (e: PointerEvent) => {
      dragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY, moved: false };
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragStart.current.moved = true;
      yaw.current -= dx * 0.004;
      pitch.current -= dy * 0.004;
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
      dragStart.current.x = e.clientX;
      dragStart.current.y = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (!dragStart.current.moved && onPick && pickTargets?.current?.length) {
        const rect = dom.getBoundingClientRect();
        pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(pointer.current, camera);
        const hits = raycaster.current.intersectObjects(pickTargets.current, true);
        if (hits.length > 0) {
          let obj: THREE.Object3D | null = hits[0].object;
          while (obj) {
            if (obj.userData?.exhibitId || obj.userData?.stationId) {
              onPick(obj.userData.exhibitId || obj.userData.stationId);
              break;
            }
            obj = obj.parent;
          }
        }
      }
    };

    if (!didSpawn.current) {
      camera.position.set(0, EYE, 0.5);
    }
    dom.style.touchAction = "none";
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [camera, gl, onPick, pickTargets, enabled, spawnPose]);

  useFrame((_, dt) => {
    if (!enabled) return;
    const EYE = 1.7;
    const speed = 4 * dt;
    const k = keys.current;
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const isMoving = k["w"] || k["s"] || k["a"] || k["d"] || k["arrowup"] || k["arrowdown"] || k["arrowleft"] || k["arrowright"];
    if (k["w"] || k["arrowup"]) camera.position.addScaledVector(forward, speed);
    if (k["s"] || k["arrowdown"]) camera.position.addScaledVector(forward, -speed);
    if (k["a"] || k["arrowleft"]) camera.position.addScaledVector(right, -speed);
    if (k["d"] || k["arrowright"]) camera.position.addScaledVector(right, speed);
    // Clamp to the room this scene actually built, not a guess
    if (bounds?.kind === "radial") {
      const r = Math.hypot(camera.position.x, camera.position.z);
      if (r > bounds.radius) {
        const s = bounds.radius / r;
        camera.position.x *= s;
        camera.position.z *= s;
      }
    } else {
      const maxX = bounds?.maxX ?? 4.2;
      const minZ = bounds?.minZ ?? -100;
      const maxZ = bounds?.maxZ ?? 100;
      camera.position.x = Math.max(-maxX, Math.min(maxX, camera.position.x));
      camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
    }
    // Subtle head-bob when walking — adds huge immersion
    if (isMoving) {
      bobPhase.current += dt * 9;
      camera.position.y = EYE + Math.sin(bobPhase.current) * 0.035;
    } else {
      // Settle back to eye level smoothly
      bobPhase.current = 0;
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, EYE, Math.min(1, dt * 8));
    }
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);
  });

  return null;
}
