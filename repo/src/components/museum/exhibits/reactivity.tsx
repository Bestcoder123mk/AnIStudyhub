"use client";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExhibitDefinition, ExhibitModelProps } from "./types";

type Element = {
  sym: string;
  name: string;
  color: string;
  info: string;
};

// Reactivity series — most reactive (K, top) → least reactive (Au, bottom).
// H is the reference non-metal between reactive and noble metals.
const ELEMENTS: Element[] = [
  { sym: "K", name: "Potassium", color: "#dc2626", info: "Position 1 (most reactive). Reacts violently with cold water: 2K + 2H₂O → 2KOH + H₂↑ — the hydrogen ignites spontaneously with a lilac flame. Stored under kerosene to keep moisture and air away." },
  { sym: "Na", name: "Sodium", color: "#ef4444", info: "Position 2. Reacts vigorously with cold water: 2Na + 2H₂O → 2NaOH + H₂↑. So soft it can be cut with a knife. Used in street-vapour lamps (yellow glow) and as a coolant in nuclear reactors." },
  { sym: "Ca", name: "Calcium", color: "#f97316", info: "Position 3. Reacts steadily with cold water: Ca + 2H₂O → Ca(OH)₂ + H₂↑. Essential for bones and teeth; used in cement manufacture (CaCO₃ → CaO → Ca(OH)₂ → mortar)." },
  { sym: "Mg", name: "Magnesium", color: "#f59e0b", info: "Position 4. Reacts with steam: Mg + 2H₂O → Mg(OH)₂ + H₂↑. Burns in air with dazzling white light: 2Mg + O₂ → 2MgO. Used in fireworks, flares, and lightweight alloys." },
  { sym: "Al", name: "Aluminium", color: "#fbbf24", info: "Position 5. Reacts with dilute HCl: 2Al + 6HCl → 2AlCl₃ + 3H₂↑. Forms a protective Al₂O₃ layer that prevents further corrosion. Used in aircraft, cookware, and electrical cables." },
  { sym: "Zn", name: "Zinc", color: "#eab308", info: "Position 6. Reacts with dilute acids: Zn + H₂SO₄ → ZnSO₄ + H₂↑. Used to galvanise iron (prevents rusting) and as the negative electrode in dry cells." },
  { sym: "Fe", name: "Iron", color: "#a16207", info: "Position 7. Reacts with steam and dilute acids: Fe + 2HCl → FeCl₂ + H₂↑. Rusts in moist air: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃. Used to make steel — the backbone of construction." },
  { sym: "Pb", name: "Lead", color: "#7c5a14", info: "Position 8. Reacts slowly with hot dilute HCl: Pb + 2HCl → PbCl₂ + H₂↑. Dense and malleable; used in car batteries and radiation shielding. Toxic — banned from petrol and water pipes." },
  { sym: "H", name: "Hydrogen (reference)", color: "#22c55e", info: "The reference non-metal in the series. Metals above H (K…Pb) displace it from dilute acids; metals below H (Cu, Hg, Ag, Au) cannot. Hydrogen itself reduces metal oxides: CuO + H₂ → Cu + H₂O." },
  { sym: "Cu", name: "Copper", color: "#b45309", info: "Position 10 (below H). Does NOT react with dilute HCl/H₂SO₄. Reacts only with concentrated HNO₃ and hot conc. H₂SO₄. Excellent conductor — used in electrical wiring, motors, and plumbing." },
  { sym: "Hg", name: "Mercury", color: "#94a3b8", info: "Position 11. Liquid metal at room temperature — below H, so does not displace H from acids. Used in thermometers and barometers; highly toxic, now being phased out." },
  { sym: "Ag", name: "Silver", color: "#cbd5e1", info: "Position 12. Very low reactivity — does not react with dilute acids. Tarnishes slowly in air forming black Ag₂S. Used in jewellery, silverware, mirrors, and electrical contacts." },
  { sym: "Au", name: "Gold", color: "#d4af37", info: "Position 13 (least reactive). Does not react with air, water, or any single acid. Dissolves only in aqua regia (3HCl + 1HNO₃). Used in jewellery, electronics, and as a monetary standard." },
];

const TOP_Y = 2.5;
const STEP = 0.42;
const INGOT_W = 1.1;
const INGOT_H = 0.36;
const INGOT_D = 0.5;

function ReactivityModel({ selectedPart, onSelectPart, preview }: ExhibitModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<string | null>(null);

  useFrame((_, dt) => {
    if (group.current && !preview) group.current.rotation.y += dt * 0.1;
  });

  const scale = preview ? 0.5 : 1;
  const pick = (id: string) => (preview ? null : id);

  const activeSym = selectedPart || hover;
  const activeEl = activeSym ? ELEMENTS.find((e) => e.sym === activeSym) ?? null : null;

  // Reference line sits between H (index 8) and Cu (index 9)
  const refY = TOP_Y - 8.5 * STEP;

  return (
    <group ref={group} scale={scale}>
      {ELEMENTS.map((el, i) => {
        const y = TOP_Y - i * STEP;
        const active = selectedPart === el.sym || hover === el.sym;
        return (
          <group key={el.sym}>
            <mesh
              position={[0, y, 0]}
              castShadow
              onClick={(e) => { e.stopPropagation(); onSelectPart(pick(el.sym)); }}
              onPointerOver={(e) => { e.stopPropagation(); if (!preview) setHover(el.sym); }}
              onPointerOut={() => setHover(null)}
            >
              <boxGeometry args={[INGOT_W, INGOT_H, INGOT_D]} />
              <meshStandardMaterial
                color={el.color}
                emissive={active ? el.color : "#000000"}
                emissiveIntensity={selectedPart === el.sym ? 0.85 : hover === el.sym ? 0.5 : 0.15}
                roughness={0.4}
                metalness={0.5}
              />
            </mesh>
            {/* Element symbol on the front face */}
            {!preview && (
              <Html position={[0, y, INGOT_D / 2 + 0.01]} center distanceFactor={9}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "sans-serif",
                    textShadow: "0 1px 3px rgba(0,0,0,0.95)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {el.sym}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Hydrogen reference separator — thin green slab between H and Cu */}
      <mesh position={[0, refY, 0]}>
        <boxGeometry args={[INGOT_W + 0.5, 0.025, INGOT_D + 0.25]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.55} />
      </mesh>
      {!preview && (
        <Html position={[INGOT_W / 2 + 0.6, refY, 0]} center distanceFactor={10}>
          <div
            style={{
              color: "#86efac",
              fontSize: 9,
              fontWeight: 600,
              fontFamily: "sans-serif",
              textShadow: "0 1px 2px rgba(0,0,0,0.9)",
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            ↑ displaces H from acids │ no reaction ↓
          </div>
        </Html>
      )}

      {/* Active element info label */}
      {!preview && activeEl && (
        <Html position={[1.4, TOP_Y - ELEMENTS.findIndex((e) => e.sym === activeEl.sym) * STEP, 0]} center distanceFactor={9}>
          <div
            style={{
              background: "rgba(10,9,23,0.92)",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              border: `1px solid ${activeEl.color}`,
              pointerEvents: "none",
            }}
          >
            {activeEl.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export const ReactivityExhibit: ExhibitDefinition = {
  kind: "3d",
  id: "reactivity",
  chapterId: 3,
  track: "science",
  title: "Reactivity Series of Metals",
  subtitle: "Ch 3 · Metals & Non-Metals",
  description:
    "Metals arranged in order of decreasing reactivity — potassium (K) at the top is the most reactive, gold (Au) at the bottom the least. The green hydrogen marker is the reference: metals above H displace it from dilute acids, those below cannot. A more reactive metal also displaces a less reactive one from its compound. Click each ingot to learn its reactions with water/acid and a real-world use.",
  accent: "#94a3b8",
  icon: "🔩",
  parts: ELEMENTS.map((e) => ({ id: e.sym, name: e.name, info: e.info })),
  Model: ReactivityModel,
};
