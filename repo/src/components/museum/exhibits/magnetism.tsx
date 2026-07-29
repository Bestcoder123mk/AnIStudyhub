"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

// Magnetic effects of electric current — bar magnet, field lines, electromagnet, compass, right-hand rule
function MagnetismModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.12;
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
    emissiveIntensity: selectedPart === id ? 0.75 : hover === id ? 0.4 : 0.1,
    roughness: 0.35,
    metalness: 0.2,
  });

  // Bar magnet placement
  const magnetPos: [number, number, number] = [-0.7, 0.4, 0];
  const magnetLen = 1.6;

  // Build 7 field-line tubes arcing from N to S around the magnet axis
  const fieldLines = useMemo(() => {
    const geos: THREE.TubeGeometry[] = [];
    const arcCount = 7;
    const nR = magnetLen / 2;
    for (let i = 0; i < arcCount; i++) {
      const phi = (i / arcCount) * Math.PI * 2;
      const radii = [0.55, 0.95, 1.35];
      for (let r = 0; r < radii.length; r++) {
        const rad = radii[r];
        const pts: THREE.Vector3[] = [];
        const seg = 28;
        for (let j = 0; j <= seg; j++) {
          const t = j / seg;
          const ang = t * Math.PI; // 0 (N) to PI (S)
          const x = nR * Math.cos(ang);
          const rDist = rad * Math.sin(ang);
          const y = rDist * Math.cos(phi);
          const z = rDist * Math.sin(phi);
          pts.push(new THREE.Vector3(x + magnetPos[0], y + magnetPos[1], z + magnetPos[2]));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        geos.push(new THREE.TubeGeometry(curve, 60, 0.016, 8, false));
      }
    }
    return geos;
  }, []);

  // 8 coil rings (toruses) around an iron core, with arrow direction markers when active
  const coilRings = 8;
  const coilRadius = 0.22;
  const coilTube = 0.04;

  return (
    <group ref={group} scale={scale}>
      {/* ===== Bar magnet (N + S halves) ===== */}
      <group position={magnetPos}>
        <mesh position={[magnetLen / 4, 0, 0]} castShadow onClick={click("bar-magnet")} onPointerOver={over("bar-magnet")} onPointerOut={out}>
          <boxGeometry args={[magnetLen / 2, 0.35, 0.35]} />
          <meshStandardMaterial {...mat("bar-magnet", "#ef4444")} />
        </mesh>
        <mesh position={[-magnetLen / 4, 0, 0]} castShadow onClick={click("bar-magnet")} onPointerOver={over("bar-magnet")} onPointerOut={out}>
          <boxGeometry args={[magnetLen / 2, 0.35, 0.35]} />
          <meshStandardMaterial {...mat("bar-magnet", "#1d4ed8")} />
        </mesh>
        {!preview && (
          <>
            <Html position={[magnetLen / 2 + 0.18, 0.16, 0]} center distanceFactor={8}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "sans-serif", background: "#ef4444", padding: "1px 6px", borderRadius: 4, border: "1px solid #fff", pointerEvents: "none" }}>N</span>
            </Html>
            <Html position={[-magnetLen / 2 - 0.18, 0.16, 0]} center distanceFactor={8}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "sans-serif", background: "#1d4ed8", padding: "1px 6px", borderRadius: 4, border: "1px solid #fff", pointerEvents: "none" }}>S</span>
            </Html>
          </>
        )}
      </group>

      {/* ===== Magnetic field lines (arcs from N to S) ===== */}
      {fieldLines.map((geo, i) => (
        <mesh
          key={`fl-${i}`}
          geometry={geo}
          castShadow
          onClick={click("field-lines")}
          onPointerOver={over("field-lines")}
          onPointerOut={out}
        >
          <meshStandardMaterial {...mat("field-lines", "#c084fc")} roughness={0.4} transparent opacity={0.85} />
        </mesh>
      ))}

      {/* ===== Electromagnet (iron core + copper coil) ===== */}
      <group position={[1.9, -0.4, 0.3]}>
        {/* Iron core (vertical cylinder) */}
        <mesh castShadow onClick={click("electromagnet")} onPointerOver={over("electromagnet")} onPointerOut={out}>
          <cylinderGeometry args={[0.14, 0.14, 1.25, 24]} />
          <meshStandardMaterial {...mat("electromagnet", "#9ca3af")} roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Coil — 8 stacked torus rings around the iron core */}
        {Array.from({ length: coilRings }).map((_, i) => {
          const y = -0.55 + i * 0.16;
          return (
            <mesh
              key={`coil-${i}`}
              position={[0, y, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
              onClick={click("electromagnet")}
              onPointerOver={over("electromagnet")}
              onPointerOut={out}
            >
              <torusGeometry args={[coilRadius, coilTube, 10, 32]} />
              <meshStandardMaterial {...mat("electromagnet", "#d97706")} roughness={0.35} metalness={0.5} />
            </mesh>
          );
        })}
        {/* Current-direction arrows — only when electromagnet is selected */}
        {selectedPart === "electromagnet" && !preview && (
          <>
            {Array.from({ length: 4 }).map((_, i) => {
              const y = -0.45 + i * 0.32;
              return (
                <group key={`arrow-${i}`} position={[coilRadius + 0.04, y, 0]}>
                  <mesh position={[0, 0.1, 0]}>
                    <coneGeometry args={[0.04, 0.12, 8]} />
                    <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.7} />
                  </mesh>
                </group>
              );
            })}
            <Html position={[0, 0.85, 0]} center distanceFactor={7}>
              <span style={{ color: "#fde047", fontSize: 11, fontWeight: 700, fontFamily: "monospace", background: "rgba(10,9,23,0.85)", padding: "2px 6px", borderRadius: 4, border: "1px solid #fde047", pointerEvents: "none" }}>
                I →
              </span>
            </Html>
          </>
        )}
      </group>

      {/* ===== Compass needle (red/blue diamond) ===== */}
      <group position={[0, -1.1, 0.9]}>
        {/* Compass base disc */}
        <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
        {/* Pivot pin */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Needle — red half + blue half (4-sided diamonds) */}
        <group rotation={[0, 0, Math.PI / 7]}>
          <mesh position={[0.18, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow onClick={click("compass")} onPointerOver={over("compass")} onPointerOut={out}>
            <coneGeometry args={[0.08, 0.34, 4]} />
            <meshStandardMaterial {...mat("compass", "#ef4444")} />
          </mesh>
          <mesh position={[-0.18, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow onClick={click("compass")} onPointerOver={over("compass")} onPointerOut={out}>
            <coneGeometry args={[0.08, 0.34, 4]} />
            <meshStandardMaterial {...mat("compass", "#1d4ed8")} />
          </mesh>
        </group>
      </group>

      {/* ===== Right-hand rule indicator (3 coloured axes) ===== */}
      <group position={[1.0, 1.4, -0.4]}>
        {/* X axis — purple = current (thumb) */}
        <group position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh castShadow onClick={click("right-hand-rule")} onPointerOver={over("right-hand-rule")} onPointerOut={out}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 10]} />
            <meshStandardMaterial {...mat("right-hand-rule", "#c084fc")} />
          </mesh>
        </group>
        <mesh position={[0.62, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.13, 12]} />
          <meshStandardMaterial {...mat("right-hand-rule", "#c084fc")} />
        </mesh>
        {/* Y axis — green = field (fingers) */}
        <group position={[0, 0.3, 0]}>
          <mesh castShadow onClick={click("right-hand-rule")} onPointerOver={over("right-hand-rule")} onPointerOut={out}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 10]} />
            <meshStandardMaterial {...mat("right-hand-rule", "#22c55e")} />
          </mesh>
        </group>
        <mesh position={[0, 0.62, 0]}>
          <coneGeometry args={[0.06, 0.13, 12]} />
          <meshStandardMaterial {...mat("right-hand-rule", "#22c55e")} />
        </mesh>
        {/* Z axis — orange = force (palm) */}
        <group position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow onClick={click("right-hand-rule")} onPointerOver={over("right-hand-rule")} onPointerOut={out}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 10]} />
            <meshStandardMaterial {...mat("right-hand-rule", "#f97316")} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.13, 12]} />
          <meshStandardMaterial {...mat("right-hand-rule", "#f97316")} />
        </mesh>
        {/* Centre sphere */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color="#fafafa" emissive="#a78bfa" emissiveIntensity={0.3} />
        </mesh>
        {!preview && (
          <>
            <Html position={[0.8, -0.15, 0]} center distanceFactor={7}>
              <span style={{ color: "#c084fc", fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: "rgba(10,9,23,0.85)", padding: "2px 5px", borderRadius: 4, border: "1px solid #c084fc", pointerEvents: "none" }}>I</span>
            </Html>
            <Html position={[0, 0.85, 0]} center distanceFactor={7}>
              <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: "rgba(10,9,23,0.85)", padding: "2px 5px", borderRadius: 4, border: "1px solid #22c55e", pointerEvents: "none" }}>B</span>
            </Html>
            <Html position={[0, -0.15, 0.8]} center distanceFactor={7}>
              <span style={{ color: "#f97316", fontSize: 10, fontWeight: 700, fontFamily: "monospace", background: "rgba(10,9,23,0.85)", padding: "2px 5px", borderRadius: 4, border: "1px solid #f97316", pointerEvents: "none" }}>F</span>
            </Html>
          </>
        )}
      </group>

      {/* Floating label */}
      {!preview && (selectedPart || hover) && (
        <Html position={[0, 2.0, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(192,132,252,0.6)",
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
  "bar-magnet": "Bar Magnet",
  "field-lines": "Magnetic Field Lines",
  electromagnet: "Electromagnet (Coil + Iron Core)",
  compass: "Compass Needle",
  "right-hand-rule": "Right-Hand Rule Axes",
};

export const MagnetismExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "magnetism",
  chapterId: 13,
  track: "science",
  title: "Magnetic Effects of Electric Current",
  subtitle: "Ch 13 · Magnetic Effects of Electric Current",
  description:
    "A magnetic field surrounds every magnet, flowing from the North pole to the South pole in closed loops. When electric current flows through a conductor (like a coil wound around an iron core), it generates a magnetic field — this is an electromagnet. The direction of force on a current-carrying wire in a magnetic field is given by Fleming's left-hand rule. Click each element to explore the relationship between electricity and magnetism.",
  accent: "#c084fc",
  icon: "🧲",
  parts: [
    {
      id: "bar-magnet",
      name: "Bar Magnet",
      info: "A permanent magnet with two poles — North (red) and South (blue). Like poles repel, unlike poles attract. The magnetic field is strongest at the poles. A freely suspended bar magnet always rests in the geographic North-South direction because Earth itself acts as a giant magnet.",
    },
    {
      id: "field-lines",
      name: "Magnetic Field Lines",
      info: "Imaginary curved lines showing the path a north pole would take in the field. They emerge from the N pole, curve through space, and enter the S pole, forming closed loops. They never intersect. The density of lines indicates field strength — closer lines mean a stronger field.",
    },
    {
      id: "electromagnet",
      name: "Electromagnet (Coil + Iron Core)",
      info: "A solenoid (cylindrical coil) wound around a soft iron core. When current flows, the coil produces a magnetic field — making the iron core a strong magnet. Unlike permanent magnets, electromagnets can be switched on/off and their strength can be varied by changing the current or number of turns. Used in cranes, electric bells, MRI machines.",
    },
    {
      id: "compass",
      name: "Compass Needle",
      info: "A small magnetic needle pivoted to rotate freely. Its north-seeking end (red) points along the local magnetic field direction — toward geographic North on Earth (which is a magnetic south pole). Near a bar magnet, the compass aligns along the magnetic field lines, revealing their direction.",
    },
    {
      id: "right-hand-rule",
      name: "Right-Hand Rule (3 Axes)",
      info: "Fleming's left-hand rule gives the direction of force on a current-carrying conductor in a magnetic field: stretch thumb, forefinger and middle finger mutually perpendicular — Forefinger = Field (B, green), Middle finger = Current (I, purple), Thumb = Force/Motion (F, orange). Used in electric motors. (Fleming's right-hand rule is the converse for generators.)",
    },
  ],
  Model: MagnetismModel,
};
