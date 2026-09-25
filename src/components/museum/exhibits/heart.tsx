"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";
import { ExplodablePart } from "./explode";

// Human heart — built from ellipsoids + curved tube vessels rather than
// four bare spheres in a grid, so the silhouette actually reads as a heart:
// a tapered ventricular mass at the bottom narrowing to an apex, two atria
// sitting on top of it, and the great vessels arching up out of the top.
// Every part is wrapped in <ExplodablePart> so the Focus Viewer's Explode
// slider can pull the 4 chambers, the septum, and the vessels apart to
// reveal the inside.

function curvedTube(points: [number, number, number][], radiusStart: number, radiusEnd = radiusStart) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  // TubeGeometry doesn't taper natively — approximate a taper by averaging
  // start/end radii into one uniform tube (the common case is equal anyway).
  if (Math.abs(radiusStart - radiusEnd) < 0.001) {
    return new THREE.TubeGeometry(curve, 24, radiusStart, 12, false);
  }
  return new THREE.TubeGeometry(curve, 24, (radiusStart + radiusEnd) / 2, 12, false);
}

function HeartModel({ selectedPart, onSelectPart, preview, explode = 0 }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);
  const ex = preview ? 0 : explode;

  useFrame((_, dt) => {
    if (group.current && !preview) {
      group.current.rotation.y += dt * 0.15;
    }
  });

  const partMat = (id: string, color: string, emissive = "#1a0505") => ({
    color,
    emissive: selectedPart === id || hover === id ? color : emissive,
    emissiveIntensity: selectedPart === id ? 0.85 : hover === id ? 0.45 : 0.12,
    roughness: 0.32,
    metalness: 0.12,
    transparent: true,
    opacity: 0.94,
  });

  const handlers = (id: string) => ({
    onClick: (e: { stopPropagation: () => void }) => { e.stopPropagation(); onSelectPart(preview ? null : selectedPart === id ? null : id); },
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); if (!preview) setHover(id); },
    onPointerOut: () => setHover(null),
  });

  const scale = preview ? 0.5 : 1;

  // Curved vessel geometries, built once.
  const aortaGeo = useMemo(() => curvedTube([[-0.28, 1.05, 0.05], [-0.15, 1.55, -0.1], [0.35, 1.62, -0.15], [0.85, 1.3, -0.2]], 0.16), []);
  const pulmArteryGeo = useMemo(() => curvedTube([[0.35, 1.0, 0.15], [0.42, 1.4, 0.35], [0.3, 1.6, 0.6], [-0.1, 1.55, 0.75]], 0.14), []);
  const pulmVeinLGeo = useMemo(() => curvedTube([[-0.75, 1.05, -0.35], [-0.95, 0.95, -0.55], [-1.05, 0.75, -0.7]], 0.07), []);
  const pulmVeinRGeo = useMemo(() => curvedTube([[-0.55, 1.25, -0.45], [-0.65, 1.15, -0.7], [-0.65, 0.95, -0.9]], 0.07), []);
  const svcGeo = useMemo(() => curvedTube([[0.75, 1.75, -0.2], [0.72, 1.35, -0.15], [0.68, 1.05, -0.1]], 0.13), []);
  const ivcGeo = useMemo(() => curvedTube([[0.55, -0.55, -0.25], [0.6, -0.15, -0.15], [0.65, 0.4, -0.05]], 0.14), []);

  return (
    <group ref={group} scale={scale} rotation={[0.12, 0, 0.18]}>
      {/* Left Atrium — top-left-back, oxygenated */}
      <ExplodablePart base={[-0.5, 1.05, -0.15]} dir={[-0.6, 0.55, -0.4]} distance={1.1} explode={ex}>
        <mesh castShadow scale={[0.62, 0.5, 0.58]} {...handlers("left-atrium")}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial {...partMat("left-atrium", "#ef4444")} />
        </mesh>
      </ExplodablePart>

      {/* Right Atrium — top-right-front, deoxygenated, with a small auricle */}
      <ExplodablePart base={[0.5, 1.1, 0.05]} dir={[0.6, 0.55, 0.35]} distance={1.1} explode={ex}>
        <mesh castShadow scale={[0.58, 0.52, 0.55]} {...handlers("right-atrium")}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial {...partMat("right-atrium", "#3b82f6")} />
        </mesh>
        <mesh castShadow position={[0.35, 0.3, 0.25]} scale={[0.28, 0.22, 0.26]} {...handlers("right-atrium")}>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial {...partMat("right-atrium", "#3b82f6")} />
        </mesh>
      </ExplodablePart>

      {/* Tricuspid valve — between right atrium & right ventricle */}
      <ExplodablePart base={[0.42, 0.55, 0.1]} dir={[0.35, 0.15, 0.3]} distance={0.7} explode={ex}>
        <mesh rotation={[Math.PI / 2, 0, 0]} {...handlers("tricuspid-valve")}>
          <torusGeometry args={[0.32, 0.05, 12, 24]} />
          <meshStandardMaterial {...partMat("tricuspid-valve", "#93c5fd", "#0a1a33")} />
        </mesh>
      </ExplodablePart>

      {/* Mitral (bicuspid) valve — between left atrium & left ventricle */}
      <ExplodablePart base={[-0.42, 0.5, -0.05]} dir={[-0.35, 0.15, -0.25]} distance={0.7} explode={ex}>
        <mesh rotation={[Math.PI / 2, 0, 0]} {...handlers("mitral-valve")}>
          <torusGeometry args={[0.34, 0.05, 12, 24]} />
          <meshStandardMaterial {...partMat("mitral-valve", "#fca5a5", "#330a0a")} />
        </mesh>
      </ExplodablePart>

      {/* Left Ventricle — bottom-left, thick-walled, tapers toward the apex */}
      <ExplodablePart base={[-0.35, -0.3, 0]} dir={[-0.65, -0.45, 0.15]} distance={1.15} explode={ex}>
        <mesh castShadow scale={[0.72, 1.05, 0.7]} {...handlers("left-ventricle")}>
          <coneGeometry args={[0.62, 1.5, 32]} />
          <meshStandardMaterial {...partMat("left-ventricle", "#dc2626")} />
        </mesh>
      </ExplodablePart>

      {/* Right Ventricle — bottom-right, thinner-walled, sits slightly higher/forward */}
      <ExplodablePart base={[0.42, -0.15, 0.15]} dir={[0.65, -0.35, 0.35]} distance={1.15} explode={ex}>
        <mesh castShadow scale={[0.62, 0.85, 0.62]} {...handlers("right-ventricle")}>
          <coneGeometry args={[0.55, 1.25, 32]} />
          <meshStandardMaterial {...partMat("right-ventricle", "#2563eb")} />
        </mesh>
      </ExplodablePart>

      {/* Interventricular septum — the centre dividing wall, hidden inside
          the ventricular mass until you explode the model apart */}
      <ExplodablePart base={[0.05, -0.25, 0]} dir={[0.1, 0.1, -0.9]} distance={1.3} explode={ex}>
        <mesh rotation={[0, 0.15, 0]} {...handlers("septum")}>
          <boxGeometry args={[0.09, 1.75, 0.85]} />
          <meshStandardMaterial {...partMat("septum", "#991b1b", "#220505")} />
        </mesh>
        <Html position={[0, 0.95, 0]} center distanceFactor={10} occlude={false} style={{ pointerEvents: "none", display: !preview && ex > 0.35 ? "block" : "none" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#fca5a5", background: "rgba(20,4,4,0.85)", padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap" }}>Septum</div>
        </Html>
      </ExplodablePart>

      {/* Aorta */}
      <ExplodablePart base={[0, 0, 0]} dir={[-0.3, 0.5, -0.2]} distance={0.9} explode={ex}>
        <mesh geometry={aortaGeo} castShadow {...handlers("aorta")}>
          <meshStandardMaterial {...partMat("aorta", "#b91c1c")} />
        </mesh>
      </ExplodablePart>

      {/* Pulmonary Artery — only artery carrying deoxygenated blood */}
      <ExplodablePart base={[0, 0, 0]} dir={[0.2, 0.5, 0.6]} distance={0.9} explode={ex}>
        <mesh geometry={pulmArteryGeo} castShadow {...handlers("pulmonary-artery")}>
          <meshStandardMaterial {...partMat("pulmonary-artery", "#1d4ed8")} />
        </mesh>
      </ExplodablePart>

      {/* Pulmonary veins — the only veins carrying oxygenated blood, into the left atrium */}
      <ExplodablePart base={[0, 0, 0]} dir={[-0.6, 0.15, -0.5]} distance={0.85} explode={ex}>
        <mesh geometry={pulmVeinLGeo} castShadow {...handlers("pulmonary-vein")}>
          <meshStandardMaterial {...partMat("pulmonary-vein", "#f87171")} />
        </mesh>
        <mesh geometry={pulmVeinRGeo} castShadow {...handlers("pulmonary-vein")}>
          <meshStandardMaterial {...partMat("pulmonary-vein", "#f87171")} />
        </mesh>
      </ExplodablePart>

      {/* Superior Vena Cava — upper-body deoxygenated blood, into right atrium */}
      <ExplodablePart base={[0, 0, 0]} dir={[0.35, 0.55, -0.3]} distance={0.85} explode={ex}>
        <mesh geometry={svcGeo} castShadow {...handlers("vena-cava")}>
          <meshStandardMaterial {...partMat("vena-cava", "#1e40af")} />
        </mesh>
      </ExplodablePart>

      {/* Inferior Vena Cava — lower-body deoxygenated blood, into right atrium */}
      <ExplodablePart base={[0, 0, 0]} dir={[0.45, -0.55, -0.3]} distance={0.85} explode={ex}>
        <mesh geometry={ivcGeo} castShadow {...handlers("inferior-vena-cava")}>
          <meshStandardMaterial {...partMat("inferior-vena-cava", "#1e3a8a")} />
        </mesh>
      </ExplodablePart>

      {/* Floating labels (non-preview only) */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 2.2, 0]} center distanceFactor={8} occlude={false}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(239,68,68,0.5)", pointerEvents: "none",
          }}>
            {PART_LABELS[selectedPart || hover || ""] || ""}
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
  "septum": "Interventricular Septum",
  "tricuspid-valve": "Tricuspid Valve",
  "mitral-valve": "Mitral (Bicuspid) Valve",
  "aorta": "Aorta",
  "pulmonary-artery": "Pulmonary Artery",
  "pulmonary-vein": "Pulmonary Veins",
  "vena-cava": "Superior Vena Cava",
  "inferior-vena-cava": "Inferior Vena Cava",
};

export const HeartExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "heart",
  chapterId: 6,
  track: "science",
  title: "The Human Heart",
  subtitle: "Ch 6 · Life Processes — Circulation",
  description:
    "A four-chambered muscular pump that drives double circulation. Deoxygenated blood enters the right side and is sent to the lungs; oxygenated blood returns to the left side and is pumped to the whole body. Click each chamber or vessel to learn its role — or use Explode to pull the model apart and see the septum and valves that sit hidden inside.",
  accent: "#ef4444",
  icon: "🫀",
  explodable: true,
  parts: [
    { id: "left-atrium", name: "Left Atrium", info: "Receives oxygenated blood from the lungs via the pulmonary veins. Pumps it into the left ventricle through the mitral valve." },
    { id: "right-atrium", name: "Right Atrium", info: "Receives deoxygenated blood from the body via the superior and inferior vena cavae. Pumps it into the right ventricle through the tricuspid valve." },
    { id: "left-ventricle", name: "Left Ventricle", info: "The thickest-walled chamber. Pumps oxygenated blood into the aorta at high pressure to supply the entire body. Its wall is ~3× thicker than the right ventricle." },
    { id: "right-ventricle", name: "Right Ventricle", info: "Pumps deoxygenated blood to the lungs via the pulmonary artery. Lower pressure than the left since the lungs are close by." },
    { id: "septum", name: "Interventricular Septum", info: "The thick muscular wall separating the left and right halves of the heart. It stops oxygenated and deoxygenated blood from mixing — Explode the model to see it sitting between the two ventricles." },
    { id: "tricuspid-valve", name: "Tricuspid Valve", info: "A three-flapped (\"tri-cuspid\") valve between the right atrium and right ventricle. It shuts after the ventricle fills, stopping blood flowing backward." },
    { id: "mitral-valve", name: "Mitral (Bicuspid) Valve", info: "A two-flapped valve between the left atrium and left ventricle. Prevents backflow into the atrium during ventricular contraction." },
    { id: "aorta", name: "Aorta", info: "The largest artery in the body. Carries oxygenated blood from the left ventricle to all organs. Walls are thick and elastic to withstand high pressure." },
    { id: "pulmonary-artery", name: "Pulmonary Artery", info: "The only artery that carries deoxygenated blood. Transports blood from the right ventricle to the lungs for oxygenation." },
    { id: "pulmonary-vein", name: "Pulmonary Veins", info: "The only veins that carry oxygenated blood — they bring freshly oxygenated blood from the lungs back into the left atrium." },
    { id: "vena-cava", name: "Superior Vena Cava", info: "Brings deoxygenated blood from the upper body (head, arms) into the right atrium." },
    { id: "inferior-vena-cava", name: "Inferior Vena Cava", info: "Brings deoxygenated blood from the lower body (trunk, legs) into the right atrium." },
  ],
  Model: HeartModel,
};
