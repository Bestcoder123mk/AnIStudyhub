"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Electric circuit — battery, wires, switch, bulb; animated electron flow
function CircuitModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const dots = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);
  const tRef = useRef(0);

  useFrame((_, dt) => {
    tRef.current += dt;
    if (dots.current) {
      dots.current.children.forEach((c, i) => {
        const m = c as THREE.Mesh;
        const t = (tRef.current * 0.5 + i * 0.12) % 1;
        // path: rectangle around the circuit
        const p = rectPath(t, 2.4, 1.5);
        m.position.set(p.x, p.y, 0);
      });
    }
  });

  const mat = (id: string, color: string) => ({
    color,
    emissive: selectedPart === id || hover === id ? color : "#000000",
    emissiveIntensity: selectedPart === id ? 0.8 : hover === id ? 0.45 : 0.1,
    roughness: 0.4, metalness: 0.3,
  });
  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const W = 2.4, H = 1.5;

  return (
    <group scale={scale}>
      {/* Wires — 4 sides of a rectangle */}
      {/* top */}
      <mesh position={[0, H / 2, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("wire")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("wire"); }}
        onPointerOut={() => setHover(null)}>
        <cylinderGeometry args={[0.07, 0.07, W - 0.6, 16]} rotation-z={Math.PI / 2} />
        <meshStandardMaterial {...mat("wire", "#fbbf24")} />
      </mesh>
      {/* bottom (split for battery) */}
      <mesh position={[-(W / 4 + 0.25), -H / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("wire")); }}>
        <cylinderGeometry args={[0.07, 0.07, W / 2 - 0.6, 16]} />
        <meshStandardMaterial {...mat("wire", "#fbbf24")} />
      </mesh>
      <mesh position={[(W / 4 + 0.25), -H / 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("wire")); }}>
        <cylinderGeometry args={[0.07, 0.07, W / 2 - 0.6, 16]} />
        <meshStandardMaterial {...mat("wire", "#fbbf24")} />
      </mesh>
      {/* left side (with switch on top half, bulb on top) */}
      <mesh position={[-W / 2, 0, 0]} rotation={[0, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("wire")); }}>
        <cylinderGeometry args={[0.07, 0.07, H - 0.3, 16]} />
        <meshStandardMaterial {...mat("wire", "#fbbf24")} />
      </mesh>
      {/* right side */}
      <mesh position={[W / 2, 0, 0]} castShadow
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("wire")); }}>
        <cylinderGeometry args={[0.07, 0.07, H - 0.3, 16]} />
        <meshStandardMaterial {...mat("wire", "#fbbf24")} />
      </mesh>

      {/* Battery — center bottom */}
      <group position={[0, -H / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("battery")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("battery"); }}
        onPointerOut={() => setHover(null)}>
        <mesh castShadow><cylinderGeometry args={[0.22, 0.22, 0.7, 20]} rotation-z={Math.PI / 2} /><meshStandardMaterial {...mat("battery", "#1e293b")} /></mesh>
        <mesh position={[-0.42, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.1, 12]} rotation-z={Math.PI / 2} /><meshStandardMaterial color="#ef4444" /></mesh>
        <mesh position={[0.42, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.1, 12]} rotation-z={Math.PI / 2} /><meshStandardMaterial color="#111" /></mesh>
      </group>

      {/* Switch — left side */}
      <group position={[-W / 2, H / 4, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("switch")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("switch"); }}
        onPointerOut={() => setHover(null)}>
        <mesh><boxGeometry args={[0.18, 0.18, 0.18]} /><meshStandardMaterial {...mat("switch", "#a855f7")} /></mesh>
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.6]}><boxGeometry args={[0.08, 0.4, 0.08]} /><meshStandardMaterial color="#7c3aed" /></mesh>
      </group>

      {/* Bulb — top center */}
      <group position={[0, H / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onSelectPart(pick("bulb")); }}
        onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover("bulb"); }}
        onPointerOut={() => setHover(null)}>
        <mesh castShadow><sphereGeometry args={[0.3, 24, 24]} /><meshStandardMaterial {...mat("bulb", "#fef08a")} emissiveIntensity={selectedPart === "bulb" ? 1.2 : 0.6} /></mesh>
        <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.12, 0.12, 0.2, 16]} /><meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} /></mesh>
      </group>

      {/* Animated electrons */}
      <group ref={dots}>
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} />
          </mesh>
        ))}
      </group>

      {!preview && (selectedPart || hover) && (
        <Html position={[0, H / 2 + 0.7, 0]} center distanceFactor={8}>
          <div style={{
            background: "rgba(10,9,23,0.92)", color: "#fff", padding: "6px 12px",
            borderRadius: 8, fontSize: 12, fontFamily: "sans-serif", whiteSpace: "nowrap",
            border: "1px solid rgba(251,191,36,0.5)", pointerEvents: "none",
          }}>
            {PART_LABELS[selectedPart || hover || ""]}
          </div>
        </Html>
      )}
    </group>
  );
}

function rectPath(t: number, w: number, h: number) {
  const perim = 2 * (w + h);
  const d = t * perim;
  const halfW = w / 2, halfH = h / 2;
  if (d < w) return { x: -halfW + d, y: halfH };
  if (d < w + h) return { x: halfW, y: halfH - (d - w) };
  if (d < 2 * w + h) return { x: halfW - (d - w - h), y: -halfH };
  return { x: -halfW, y: -halfH + (d - 2 * w - h) };
}

const PART_LABELS: Record<string, string> = {
  wire: "Conducting Wire", battery: "Battery (Cell)", switch: "Switch", bulb: "Bulb (Load)",
};

export const CircuitExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "circuit",
  chapterId: 12,
  track: "science",
  title: "Electric Circuit",
  subtitle: "Ch 12 · Electricity",
  description:
    "A closed loop through which electric current flows. The battery provides the potential difference (voltage) that drives electrons; the wires conduct them; the switch opens/closes the loop; the bulb is a load that converts electrical energy into heat and light. Watch the electrons flow around the loop. Click each component to learn the physics.",
  accent: "#fbbf24",
  icon: "💡",
  parts: [
    { id: "battery", name: "Battery (Cell)", info: "Maintains a potential difference (e.g. 1.5 V per cell) between its terminals, pushing electrons from the negative terminal through the external circuit to the positive terminal. V = IR (Ohm's Law)." },
    { id: "wire", name: "Conducting Wire", info: "Usually copper (low resistivity). Electrons drift from the negative terminal to the positive terminal. Conventional current is taken as flowing the opposite way (＋ to －)." },
    { id: "switch", name: "Switch", info: "A device that opens (breaks) or closes (makes) the circuit. When open, no current flows. Always place the switch on the live side, near the load." },
    { id: "bulb", name: "Bulb (Load)", info: "A resistor with a thin tungsten filament that heats up and glows. Power dissipated: P = VI = I²R = V²/R. The filament's high resistance converts electrical energy into heat and light." },
  ],
  Model: CircuitModel,
};
