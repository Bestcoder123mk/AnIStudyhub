"use client";

import { useMemo, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA, BrightnessContrast, HueSaturation } from "@react-three/postprocessing";
import * as THREE from "three";
import { SUBJECT_META, type Track } from "@/store/use-study-store";
import { getTrackChapters, type TrackChapter } from "@/lib/track-content";
import { EXHIBITS } from "./exhibits/registry";
import { MarbleFloor } from "./marble-floor";
import type { ExhibitDefinition } from "./exhibits/types";
import type { ExhibitTour } from "./exhibit-overlay";
import { WalkControls } from "./walk-controls";
import { GodRays, DustParticles } from "./atmosphere";

const HW = 5;
const HH = 7;
const SPACING = 7;

type ChapterData = TrackChapter;

export function LibraryWing({ track, onEnterWalkthrough, onFocusExhibit }: { track: Track; onEnterWalkthrough: (chapterId: number) => void; onFocusExhibit?: (exhibit: ExhibitDefinition, tour?: ExhibitTour) => void }) {
  const { scene } = useThree();
  const [activeAlcove, setActiveAlcove] = useState(-1);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const chapters: ChapterData[] = useMemo(() => getTrackChapters(track), [track]);

  const exhibitMap = useMemo(() => {
    const m: Record<string, ExhibitDefinition> = {};
    EXHIBITS.forEach((e) => { m[`${e.track}-${e.chapterId}`] = e; });
    return m;
  }, []);

  const meta = SUBJECT_META[track];

  const alcoves = useMemo(() => {
    const perSide = Math.ceil(chapters.length / 2);
    const totalLen = perSide * SPACING;
    const startZ = -totalLen / 2 + SPACING / 2;
    return chapters.map((ch, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const idx = Math.floor(i / 2);
      const z = startZ + idx * SPACING;
      return { ch, i, side, x: side * (HW - 0.5), z, exhibit: exhibitMap[`${track}-${ch.id}`] };
    });
  }, [chapters, exhibitMap, track]);

  const totalLen = Math.ceil(chapters.length / 2) * SPACING;

  useMemo(() => {
    scene.fog = new THREE.FogExp2("#050608", 0.03);
    scene.background = new THREE.Color("#050608");
    return null;
  }, [scene]);

  const alcovePositions = useMemo(() => alcoves.map((a) => new THREE.Vector3(a.x * 0.6, 1.7, a.z)), [alcoves]);
  useFrame(({ camera }) => {
    let nearest = -1, minDist = Infinity;
    for (let i = 0; i < alcovePositions.length; i++) {
      const d = camera.position.distanceTo(alcovePositions[i]);
      if (d < minDist) { minDist = d; nearest = i; }
    }
    if (minDist < 7 && nearest !== activeAlcove) {
      setActiveAlcove(nearest);
      setSelectedPart(null);
    } else if (minDist >= 7 && activeAlcove !== -1) {
      setActiveAlcove(-1);
      setSelectedPart(null);
    }
  });

  const spawnZ = totalLen / 2 + 3;

  return (
    <>
      {/* Rich IBL — warm golden hour from above, cool fill from sides.
          NOTE: the overhead Lightformer's intensity was 3 — combined with
          the walls' clearcoat (a mirror-like specular layer, extremely
          sensitive to strong environment lighting via IBL), this was very
          likely the real source of the blown-out white ceiling/walls, more
          so than the direct spot/point lights tuned in an earlier pass.
          The cool-fill Lightformer's color was hardcoded to cyan (Maths'
          own accent) rather than reading meta.accent, so every other
          subject's room lit itself in cyan anyway and then fought the
          alcove spotlights' real per-subject accent — worst for accents
          far from cyan on the wheel (Science's violet chief among them),
          where the mix reads as a muddy, low-contrast haze that's exactly
          what made the alcove panels hard to read there. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={0.55} color="#e8f4f7" position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, totalLen / 2, 1]} />
        <Lightformer intensity={0.7} color={meta.accent} position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[totalLen, 5, 1]} />
        <Lightformer intensity={0.35} color="#0a0d12" position={[5, 3, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[totalLen, 5, 1]} />
      </Environment>

      {/* Dramatic lighting — strong warm key + cool fill for cinematic contrast.
          NOTE: intensities tuned down from an earlier pass that stacked an
          always-on overhead spotlight with one spotlight PER alcove (all
          simultaneously lit, not just the nearby one) — in a corridor this
          narrow (10 units wide) that additive stacking was blowing the
          ceiling/walls out to flat white once Bloom amplified it, washing
          out bookshelf/molding detail entirely. Same fix as above: the fill
          light and main spotlight now follow meta.accent instead of a
          hardcoded cyan, so the room reads as one coherent material per
          subject instead of a cyan room with a differently-coloured alcove
          spotlight fighting it. */}
      <ambientLight intensity={0.12} color="#dff2f7" />
      <directionalLight position={[3, 12, 6]} intensity={1.2} color="#eef8fb" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <directionalLight position={[-4, 6, -3]} intensity={0.3} color={meta.accent} />
      <spotLight position={[0, 6, 0]} angle={0.7} penumbra={0.5} intensity={6} color={meta.accent} distance={25} decay={2} />

      {/* Per-alcove accent spotlights */}
      {alcoves.map((a, i) => (
        <spotLight key={i} position={[a.x * 0.5, 5.5, a.z]} target-position={[a.x * 0.75, 1.5, a.z]} angle={0.38} penumbra={0.8} intensity={i === activeAlcove ? 16 : 4} color={a.exhibit?.accent || meta.accent} distance={11} decay={2} />
      ))}

      {/* Dark polished marble floor — same live-reflection material as the lobby now, so walking through a portal doesn't feel like a downgrade */}
      <MarbleFloor shape={{ type: "plane", width: HW * 2, length: totalLen + 6 }} color="#0a0c0f" />
      {/* Rug runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[2.2, totalLen + 4]} />
        <meshStandardMaterial color={track === "ssc" ? "#3a2410" : "#1a1428"} roughness={0.85} metalness={0} />
      </mesh>
      {/* Accent center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[0.06, totalLen + 4]} />
        <meshBasicMaterial color={meta.accent} transparent opacity={0.2} />
      </mesh>

      {/* Walls */}
      <Wall x={-HW} length={totalLen + 6} />
      <Wall x={HW} length={totalLen + 6} flip />
      {/* End wall */}
      <mesh position={[0, HH / 2, -(totalLen / 2 + 3)]} receiveShadow>
        <planeGeometry args={[HW * 2, HH]} />
        <meshPhysicalMaterial color="#12151a" roughness={0.5} metalness={0.25} clearcoat={0.22} clearcoatRoughness={0.68} side={THREE.DoubleSide} />
      </mesh>
      {/* Doorway walls (spawn end) */}
      <mesh position={[-HW + 1.5, HH / 2, totalLen / 2 + 3]} receiveShadow>
        <planeGeometry args={[3, HH]} />
        <meshPhysicalMaterial color="#12151a" roughness={0.5} metalness={0.25} clearcoat={0.22} clearcoatRoughness={0.68} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[HW - 1.5, HH / 2, totalLen / 2 + 3]} receiveShadow>
        <planeGeometry args={[3, HH]} />
        <meshPhysicalMaterial color="#12151a" roughness={0.5} metalness={0.25} clearcoat={0.22} clearcoatRoughness={0.68} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, HH - 0.8, totalLen / 2 + 3]} receiveShadow>
        <planeGeometry args={[4, 1.6]} />
        <meshPhysicalMaterial color="#12151a" roughness={0.5} metalness={0.25} clearcoat={0.22} clearcoatRoughness={0.68} side={THREE.DoubleSide} />
      </mesh>

      {/* Coffered ceiling */}
      <mesh position={[0, HH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HW * 2, totalLen + 6]} />
        <meshStandardMaterial color="#0a0c0f" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Skylight strip — warm glow */}
      <mesh position={[0, HH - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, totalLen + 4]} />
        <meshBasicMaterial color="#eaf7fb" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Gold moldings */}
      {[-HW, HW].map((wx) => (
        <group key={wx}>
          <mesh position={[wx, 0.1, 0]} castShadow>
            <boxGeometry args={[0.12, 0.2, totalLen + 6]} />
            <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.8} emissive={meta.accent} emissiveIntensity={0.25} />
          </mesh>
          <mesh position={[wx, HH - 0.15, 0]} castShadow>
            <boxGeometry args={[0.15, 0.2, totalLen + 6]} />
            <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.8} emissive={meta.accent} emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}

      {/* Wall sconces between alcoves — warm flickering lights */}
      {alcoves.map((a, i) => {
        if (i % 2 !== 0) return null;
        const perSide = Math.ceil(chapters.length / 2);
        const startZ = -perSide * SPACING / 2 + SPACING / 2;
        const sconceZ = startZ + (Math.floor(i / 2) + 0.5) * SPACING;
        return <WallSconce key={"ws" + i} side={a.side} z={sconceZ} accent={meta.accent} />;
      })}

      {/* Bookshelves between alcoves */}
      {alcoves.map((a, i) => {
        if (i % 2 !== 0) return null;
        const perSide = Math.ceil(chapters.length / 2);
        const startZ = -perSide * SPACING / 2 + SPACING / 2;
        const shelfZ = startZ + (Math.floor(i / 2) + 0.5) * SPACING;
        return <Bookshelf key={"bs" + i} side={a.side} z={shelfZ} />;
      })}

      {/* God rays + dust */}
      <GodRays position={[0, HH, 0]} target={[0, 0, 0]} color="#dff2f7" radius={1.5} intensity={0.25} />
      <DustParticles count={100} bounds={[HW, HH, totalLen / 2]} color={meta.accent} size={0.03} />

      {/* Chapter alcoves */}
      {alcoves.map((a, i) => (
        <Alcove
          key={a.i}
          alcove={a}
          meta={meta}
          active={i === activeAlcove}
          selectedPart={i === activeAlcove ? selectedPart : null}
          onSelectPart={(id) => setSelectedPart(id === selectedPart ? null : id)}
          onEnterWalkthrough={track === "science" ? onEnterWalkthrough : undefined}
          onFocusExhibit={onFocusExhibit}
        />
      ))}

      {/* Walk controls */}
      <WalkControls
        enabled
        spawnPose={{ x: 0, z: spawnZ, yaw: 0 }}
        bounds={{ kind: "rect", maxX: HW - 0.8, minZ: -(totalLen / 2 + 2.5), maxZ: totalLen / 2 + 2.5 }}
      />

      {/* Filmic post-processing — absolute cinema */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.3} mipmapBlur radius={0.5} />
        <BrightnessContrast brightness={-0.03} contrast={0.2} />
        <HueSaturation saturation={0.08} hue={0} />
        <Vignette eskil={false} offset={0.1} darkness={0.75} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

function Wall({ x, length, flip }: { x: number; length: number; flip?: boolean }) {
  return (
    <mesh position={[x, HH / 2, 0]} rotation={[0, flip ? -Math.PI / 2 : Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[length, HH]} />
      <meshPhysicalMaterial color="#12151a" roughness={0.5} metalness={0.25} clearcoat={0.22} clearcoatRoughness={0.68} side={THREE.DoubleSide} />
    </mesh>
  );
}

function WallSconce({ side, z, accent }: { side: number; z: number; accent: string }) {
  const ref = useRef<THREE.PointLight>(null);
  const x = side * (HW - 0.1);
  useFrame(() => {
    if (ref.current) {
      ref.current.intensity = 2.5 + Math.sin(performance.now() * 0.005 + z) * 0.3 + Math.random() * 0.1;
    }
  });
  return (
    <group position={[x, 3.5, z]}>
      {/* Sconce fixture */}
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.4, 0.1]} />
        <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Energy glow */}
      <mesh position={[side * -0.05, 0.15, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={ref} position={[side * -0.1, 0.15, 0]} color={accent} intensity={2.5} distance={4} decay={2} />
    </group>
  );
}

function Bookshelf({ side, z }: { side: number; z: number }) {
  const x = side * (HW - 0.15);
  const rotY = side === -1 ? Math.PI / 2 : -Math.PI / 2;
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 1.8, -0.1]} castShadow>
        <boxGeometry args={[2.5, 3.6, 0.3]} />
        <meshStandardMaterial color="#1a0e06" roughness={0.6} metalness={0.1} />
      </mesh>
      {[0.6, 1.6, 2.6].map((sy, si) => (
        <group key={si} position={[0, sy, 0]}>
          <mesh position={[0, 0.35, 0.02]}>
            <boxGeometry args={[2.4, 0.04, 0.2]} />
            <meshStandardMaterial color="#0a0604" roughness={0.5} />
          </mesh>
          {Array.from({ length: 7 }, (_, bi) => {
            const colors = ["#8b4513", "#a0522d", "#cd853f", "#daa520", "#bc8f8f", "#bdb76b", "#556b2f"];
            const h = 0.25 + Math.random() * 0.1;
            return (
              <mesh key={bi} position={[-1.0 + bi * 0.3, 0.15, 0.02]} castShadow>
                <boxGeometry args={[0.22, h, 0.16]} />
                <meshStandardMaterial color={colors[bi % colors.length]} roughness={0.7} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function Alcove({
  alcove, meta, active, selectedPart, onSelectPart, onEnterWalkthrough, onFocusExhibit,
}: {
  alcove: { ch: ChapterData; i: number; side: number; x: number; z: number; exhibit?: ExhibitDefinition };
  meta: typeof SUBJECT_META[Track];
  active: boolean;
  selectedPart: string | null;
  onSelectPart: (id: string | null) => void;
  onEnterWalkthrough?: (chapterId: number) => void;
  onFocusExhibit?: (exhibit: ExhibitDefinition, tour?: ExhibitTour) => void;
}) {
  const { ch, side, z, exhibit } = alcove;
  const faceYaw = side === -1 ? Math.PI / 2 : -Math.PI / 2;
  const accent = exhibit?.accent || meta.accent;
  const Model = exhibit?.Model;
  const Panel = exhibit?.Panel;

  return (
    <group>
      {/* Title plaque on wall (always visible) */}
      <Html position={[side * (HW - 0.05), 5.8, z]} rotation={[0, faceYaw, 0]} center distanceFactor={7} occlude={false} zIndexRange={[12, 0]}>
        <div style={{ textAlign: "center", pointerEvents: "none", userSelect: "none" }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: accent, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8 }}>{ch.num}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#eef4f7", marginTop: 2, fontFamily: "var(--font-display), sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{ch.title}</div>
        </div>
      </Html>

      {/* Pedestal + exhibit (3D model, or a mounted painting panel for SSC chapters) */}
      {exhibit && (Model || Panel) && (
        <group position={[side * (HW - 1.5), 0, z]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.2, 1.4]} />
            <meshPhysicalMaterial color="#12151a" roughness={0.18} metalness={0.3} clearcoat={0.7} clearcoatRoughness={0.2} />
          </mesh>
          <mesh position={[0, 1.22, 0]} receiveShadow>
            <boxGeometry args={[1.55, 0.08, 1.55]} />
            <meshPhysicalMaterial color="#0d0a08" roughness={0.18} metalness={0.15} clearcoat={0.6} />
          </mesh>
          <mesh position={[0, 1.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.68, 28]} />
            <meshBasicMaterial color={accent} transparent opacity={active ? 0.6 : 0.2} side={THREE.DoubleSide} />
          </mesh>

          {Model && (
            <group position={[0, 2.0, 0]} scale={0.5}>
              <Model selectedPart={active ? selectedPart : null} onSelectPart={active ? onSelectPart : () => {}} preview={!active} />
            </group>
          )}

          {Panel && !Model && (
            <Html transform position={[0, 2.15, 0]} distanceFactor={1.8} zIndexRange={[8, 0]} occlude={false}>
              <div
                style={{
                  width: 300,
                  height: 220,
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                  border: `2px solid ${accent}60`,
                }}
              >
                <Panel selectedPart={active ? selectedPart : null} onSelectPart={active ? onSelectPart : () => {}} preview={!active} />
              </div>
            </Html>
          )}

          {/* Focus button — opens the dedicated full-screen Model Focus
              Viewer (bigger canvas, proper orbit distance, Explode slider
              for exhibits that support it) instead of straining to inspect
              the small in-place pedestal statue. */}
          {active && Model && onFocusExhibit && (
            <Html position={[0, 2.85, 0]} center distanceFactor={7} occlude={false} zIndexRange={[14, 0]}>
              <button
                onClick={() => onFocusExhibit(alcove.exhibit!)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 10, fontWeight: 700, padding: "5px 11px", borderRadius: 999,
                  border: `1px solid ${accent}80`, background: "rgba(6,8,10,0.85)", color: "#eef4f6",
                  cursor: "pointer", whiteSpace: "nowrap", backdropFilter: "blur(6px)",
                }}
              >
                🔍 Focus view
              </button>
            </Html>
          )}
        </group>
      )}

      {/* Full content board — ALL content, scrollable, in-world.
          Deliberately NOT using the `transform` prop here: that renders the
          panel as a real plane glued to the wall in 3D, which foreshortens
          /skews hard (and can end up mostly off-screen) unless the camera
          happens to be square-on to it. A screen-space billboard — same
          anchor point, always facing the camera — stays legible from any
          angle you're walking past it at. */}
      {active && (
        <Html
          position={[side * (HW - 0.08), 3.0, z]}
          center
          distanceFactor={8}
          zIndexRange={[15, 0]}
        >
          <ContentBoard chapter={ch} exhibit={exhibit} selectedPart={selectedPart} accent={accent} onEnterWalkthrough={onEnterWalkthrough} />
        </Html>
      )}

      {!active && exhibit && (
        <Html position={[side * (HW - 1.5), 3.2, z]} center distanceFactor={6} occlude={false} zIndexRange={[10, 0]}>
          <div style={{ fontSize: 9, color: "#7a8794", fontStyle: "italic", pointerEvents: "none", opacity: 0.5 }}>walk closer to read</div>
        </Html>
      )}
    </group>
  );
}

function ContentBoard({
  chapter, exhibit, selectedPart, accent, onEnterWalkthrough,
}: {
  chapter: ChapterData;
  exhibit?: ExhibitDefinition;
  selectedPart: string | null;
  accent: string;
  onEnterWalkthrough?: (chapterId: number) => void;
}) {
  const part = exhibit?.parts.find((p) => p.id === selectedPart);
  return (
    <div style={{
      width: 580,
      maxHeight: 520,
      overflowY: "auto",
      background: "linear-gradient(180deg, #12151a 0%, #06080a 100%)",
      borderRadius: 4,
      padding: "20px 24px",
      color: "#e7edf0",
      fontFamily: "var(--font-sans), sans-serif",
      border: `1px solid ${accent}35`,
      boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
    }}>
      <style>{`::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${accent}40; border-radius: 2px; }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 8, fontWeight: 800, color: accent, letterSpacing: 2, textTransform: "uppercase" }}>{chapter.num}</div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display), sans-serif", marginTop: 2, marginBottom: 14, color: "#eef4f7" }}>{chapter.title}</div>
        </div>
        {onEnterWalkthrough && (
          <button
            onClick={() => onEnterWalkthrough(chapter.id)}
            style={{
              flexShrink: 0,
              fontSize: 10.5,
              fontWeight: 700,
              padding: "7px 12px",
              borderRadius: 6,
              border: `1px solid ${accent}70`,
              background: `${accent}20`,
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: "#eef4f7",
            }}
          >
            Enter Full Walkthrough
          </button>
        )}
      </div>

      {/* Selected part info */}
      {part && (
        <div style={{
          background: `${accent}15`,
          border: `1px solid ${accent}50`,
          borderRadius: 4,
          padding: "10px 12px",
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: accent }}>{part.name}</div>
          <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5, color: "#c7d1d8" }}>{part.info}</div>
        </div>
      )}

      {/* Content sections — FULL content, not truncated */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
        <Section title="One-Shot" items={chapter.oneshot} accent={accent} />
        <Section title="Key Points" items={chapter.keypts} accent={accent} />
        {chapter.formulas && chapter.formulas.trim() && (
          <Section title={chapter.formulas.startsWith("KEY") ? "Key Dates" : "Formulas"} text={chapter.formulas} accent={accent} />
        )}
        <Section title="Exam Tips" items={chapter.exam} accent={accent} />
      </div>
    </div>
  );
}

function Section({ title, items, text, accent }: { title: string; items?: string[]; text?: string; accent: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.95 }}>
        {title}
      </div>
      <div style={{ width: 20, height: 2, background: accent, opacity: 0.85, margin: "6px 0 8px" }} />
      {items ? (
        items.map((it, i) => (
          <div
            key={i}
            style={{
              borderTop: i === 0 ? "none" : "1px solid rgba(232,220,200,0.08)",
              padding: "7px 0",
              fontSize: 10.5,
              lineHeight: 1.55,
              color: "#b7c2c9",
            }}
          >
            {it}
          </div>
        ))
      ) : text ? (
        <pre style={{ fontSize: 10, lineHeight: 1.6, color: "#b7c2c9", fontFamily: "var(--font-mono), monospace", whiteSpace: "pre-wrap", margin: 0 }}>
          {text}
        </pre>
      ) : null}
    </div>
  );
}
