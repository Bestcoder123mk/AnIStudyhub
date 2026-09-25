"use client";

import { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA, BrightnessContrast } from "@react-three/postprocessing";
import * as THREE from "three";
import { SUBJECT_META, useStudyStore, type Track } from "@/store/use-study-store";
import { WalkControls } from "./walk-controls";
import { GodRays, DustParticles } from "./atmosphere";
import { MarbleFloor } from "./marble-floor";

const R = 12;
const PORTAL_R = 10;
const SUBJECTS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];

export function LibraryLobby({
  onPickSubject,
  currentTrack,
}: {
  onPickSubject: (t: Track) => void;
  currentTrack: Track;
}) {
  const { scene } = useThree();
  const pickTargets = useRef<THREE.Object3D[]>([]);
  // The architectural "signature" colour — the museum's own black-marble-
  // and-energy palette (portals/wings keep their own per-subject colour for
  // wayfinding). Reuses Settings → Accent Colour so "cyan accents... can be
  // customised to any colour" (and the pure-black shell can flip to white
  // via the Daylight theme) applies to the 3D space too, not just the 2D UI.
  const accent = useStudyStore((s) => s.accentColor);
  // Real per-subject engagement, reusing the exact accessor pattern
  // leaderboard.tsx already established for "this track's totalXp" (science
  // is a top-level field; SSC and the other three tracks are nested).
  // Feeds the portal glow + progress arc below so the lobby is a genuine
  // reflection of where you've actually been studying, not just scenery.
  const scienceXp = useStudyStore((s) => s.totalXp);
  const sscXp = useStudyStore((s) => s.ssc.totalXp);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const xpByTrack: Record<Track, number> = {
    science: scienceXp,
    ssc: sscXp,
    maths: subjectStats.maths?.totalXp ?? 0,
    english: subjectStats.english?.totalXp ?? 0,
    sanskrit: subjectStats.sanskrit?.totalXp ?? 0,
  };
  // Square-root curve: early XP still shows a visible arc instead of the
  // portal staying dark until some threshold, but it still tapers off
  // rather than maxing out after one session. Purely decorative, so the
  // 400 "full glow" reference point doesn't need to be exact.
  const progressByTrack: Record<Track, number> = Object.fromEntries(
    (Object.entries(xpByTrack) as [Track, number][]).map(([t, xp]) => [t, Math.min(1, Math.sqrt(xp / 400))])
  ) as Record<Track, number>;

  useMemo(() => {
    scene.fog = new THREE.FogExp2("#050608", 0.032);
    scene.background = new THREE.Color("#050608");
    return null;
  }, [scene]);

  const registerPick = (obj: THREE.Object3D) => {
    if (!pickTargets.current.includes(obj)) pickTargets.current.push(obj);
  };

  const portals = useMemo(() => {
    return SUBJECTS.map((s, i) => {
      const angle = (i / SUBJECTS.length) * Math.PI * 2 - Math.PI / 2;
      return { track: s, meta: SUBJECT_META[s], x: Math.cos(angle) * PORTAL_R, z: Math.sin(angle) * PORTAL_R, angle, rotY: -angle + Math.PI / 2 };
    });
  }, []);

  return (
    <>
      {/* Rich IBL environment — cool, futuristic: near-black with the
          accent colour doing the work instead of warm gold-hour light. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={0.55} color="#e8f4f7" position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 16, 1]} />
        <Lightformer intensity={1.3} color={accent} position={[-8, 3, -4]} rotation={[0, Math.PI / 2, 0]} scale={[10, 8, 1]} />
        <Lightformer intensity={0.9} color={accent} position={[8, 3, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 8, 1]} />
        <Lightformer intensity={0.4} color="#05070a" position={[0, 2, -10]} scale={[12, 6, 1]} />
      </Environment>

      {/* Dramatic lighting — cool key light + accent fills */}
      <ambientLight intensity={0.14} color="#dff2f7" />
      <directionalLight position={[5, 15, 5]} intensity={1.4} color="#eef8fb" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <spotLight position={[0, 8, 0]} angle={0.6} penumbra={0.5} intensity={32} color={accent} distance={30} decay={2} />
      {/* Per-portal accent lights */}
      {portals.map((p, i) => (
        <spotLight key={i} position={[p.x * 0.6, 5, p.z * 0.6]} target-position={[p.x, 1.5, p.z]} angle={0.45} penumbra={0.8} intensity={30} color={p.meta.accent} distance={14} decay={2} />
      ))}

      {/* Reflective black marble floor — real scene reflections carry the
          accent-tinted lights, which reads as the "cyan veins" without a
          custom vein shader. */}
      <MarbleFloor shape={{ type: "circle", radius: R }} color="#0a0c0f" />
      {/* Subtle floor accent ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[PORTAL_R - 0.2, PORTAL_R + 0.2, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 2.7, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Dark walls — polished black marble/basalt, not warm stone */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <cylinderGeometry args={[R, R, 8, 64, 1, true]} />
        <meshPhysicalMaterial color="#0d1013" roughness={0.4} metalness={0.35} clearcoat={0.5} clearcoatRoughness={0.5} side={THREE.BackSide} />
      </mesh>

      {/* Ceiling — dark with cool skylight */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial color="#0a0c0f" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Skylight glow */}
      <mesh position={[0, 7.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * 0.5, 48]} />
        <meshBasicMaterial color="#eaf7fb" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Marble pillars — pale cool marble with accent-lit trim */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
        const px = Math.cos(a) * (R - 0.5);
        const pz = Math.sin(a) * (R - 0.5);
        return (
          <group key={i}>
            <MarblePillar x={px} z={pz} accent={accent} />
            {/* Wall light strip on each pillar */}
            <WallSconce x={Math.cos(a) * (R - 0.2)} z={Math.sin(a) * (R - 0.2)} accent={accent} />
          </group>
        );
      })}

      {/* Central dais */}
      <CentralDais accent={accent} />

      {/* Volumetric god rays from skylight */}
      <GodRays position={[0, 8, 0]} target={[0, 0, 0]} color="#dff2f7" radius={2.5} intensity={0.25} />

      {/* Floating dust motes in the light */}
      <DustParticles count={150} bounds={[R - 1, 7, R - 1]} color={accent} size={0.03} />

      {/* Subject portals */}
      {portals.map((p) => (
        <SubjectPortal key={p.track} portal={p} isCurrent={p.track === currentTrack} progress={progressByTrack[p.track]} onPick={() => onPickSubject(p.track)} registerPick={registerPick} />
      ))}

      <WalkControls
        onPick={(id) => { if (id.startsWith("portal-")) onPickSubject(id.replace("portal-", "") as Track); }}
        pickTargets={pickTargets}
        enabled
        spawnPose={{ x: 0, z: 0, yaw: 0 }}
        bounds={{ kind: "radial", radius: R - 0.8 }}
      />

      {/* Post-processing — cinematic */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.35} intensity={0.4} mipmapBlur radius={0.6} />
        <BrightnessContrast brightness={-0.03} contrast={0.18} />
        <Vignette eskil={false} offset={0.1} darkness={0.82} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

function SubjectPortal({
  portal, isCurrent, progress, onPick, registerPick,
}: {
  portal: { track: Track; meta: typeof SUBJECT_META[Track]; x: number; z: number; angle: number; rotY: number };
  isCurrent: boolean;
  progress: number;
  onPick: () => void;
  registerPick: (obj: THREE.Object3D) => void;
}) {
  const { meta, x, z, rotY } = portal;
  const archRef = useRef<THREE.Mesh>(null);
  // `isCurrent` was being computed by the caller (`p.track === currentTrack`)
  // and threaded all the way down here, but nothing ever read it — every
  // portal glowed identically regardless of which subject you were
  // actually in. Give the current one a brighter, steadier glow so the
  // lobby actually shows "you are here." Real per-subject progress now
  // also lifts the floor — a subject you've put real time into glows
  // richer even when it isn't the one you're standing in.
  const baseGlow = (isCurrent ? 0.55 : 0.3) + progress * 0.25;
  const glowAmplitude = isCurrent ? 0.2 : 0.15;
  useFrame(() => { if (archRef.current) { const m = archRef.current.material as THREE.MeshStandardMaterial; m.emissiveIntensity = baseGlow + Math.sin(performance.now() * 0.002) * glowAmplitude; } });

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Glowing portal — emissive arch */}
      <mesh
        ref={(g) => {
          archRef.current = g;
          if (g) { g.userData.exhibitId = `portal-${portal.track}`; registerPick(g); }
        }}
        position={[0, 3, -0.3]}
        castShadow
      >
        <torusGeometry args={[2.2, 0.15, 16, 32, Math.PI]} />
        <meshStandardMaterial color={meta.accent} emissive={meta.accent} emissiveIntensity={baseGlow} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Progress-fill arc — same arch, a bright inlaid line that sweeps
          further round as real per-subject XP grows, so "how far along
          you are in this subject" is something you can see across the
          room, not just a number on a dashboard. Clamped off zero so an
          untouched subject still gets a visible sliver rather than a
          degenerate zero-length arc. */}
      <mesh position={[0, 3, -0.28]}>
        <torusGeometry args={[2.2, 0.045, 12, 32, Math.max(0.06, Math.PI * progress)]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Pillars of the arch */}
      <mesh position={[-2.2, 1.5, -0.3]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color={meta.accent} emissive={meta.accent} emissiveIntensity={0.2} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[2.2, 1.5, -0.3]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color={meta.accent} emissive={meta.accent} emissiveIntensity={0.2} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Inner glow plane */}
      <mesh position={[0, 1.5, -0.35]}>
        <planeGeometry args={[4.2, 3]} />
        <meshBasicMaterial color={meta.accent} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating label */}
      <Html position={[0, 2.2, -0.2]} center distanceFactor={7} occlude={false} zIndexRange={[15, 0]}>
        <div onClick={(e) => { e.stopPropagation(); onPick(); }} style={{ textAlign: "center", cursor: "pointer", pointerEvents: "auto", userSelect: "none" }}>
          <div style={{ fontSize: 40, lineHeight: 1, filter: `drop-shadow(0 0 16px ${meta.accent})` }}>{meta.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginTop: 8, fontFamily: "var(--font-display), sans-serif", textShadow: `0 0 12px ${meta.accent}88` }}>{meta.label}</div>
          <div style={{ fontSize: 10, color: meta.accent, marginTop: 3, opacity: 0.8 }}>Enter →</div>
        </div>
      </Html>
    </group>
  );
}

function MarblePillar({ x, z, accent }: { x: number; z: number; accent: string }) {
  return (
    <group position={[x, 0, z]}>
      {/* Shaft — pale cool marble, not warm cream */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 6, 24]} />
        <meshPhysicalMaterial color="#c8cdd2" roughness={0.3} metalness={0.08} clearcoat={0.5} clearcoatRoughness={0.25} />
      </mesh>
      {/* Accent-lit capital */}
      <mesh position={[0, 6.1, 0]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.0]} />
        <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.75} emissive={accent} emissiveIntensity={0.35} />
      </mesh>
      {/* Accent-lit base */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.0]} />
        <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.75} emissive={accent} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function WallSconce({ x, z, accent }: { x: number; z: number; accent: string }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.intensity = 2 + Math.sin(performance.now() * 0.004 + x) * 0.3 + Math.random() * 0.08;
    }
  });
  // direction toward center
  const angle = Math.atan2(-z, -x);
  return (
    <group position={[x, 3.5, z]}>
      {/* Sconce fixture — dark metal, not brass */}
      <mesh castShadow rotation={[0, angle, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.1]} />
        <meshStandardMaterial color="#14181c" roughness={0.25} metalness={0.75} />
      </mesh>
      {/* Energy glow — the accent colour, not a flame */}
      <mesh position={[Math.cos(angle) * 0.08, 0.15, Math.sin(angle) * 0.08]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={accent} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={ref} position={[Math.cos(angle) * 0.15, 0.15, Math.sin(angle) * 0.15]} color={accent} intensity={2} distance={5} decay={2} />
    </group>
  );
}

function CentralDais({ accent }: { accent: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.1; });
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 32]} />
        <meshPhysicalMaterial color="#0d1013" roughness={0.2} metalness={0.7} clearcoat={0.7} emissive={accent} emissiveIntensity={0.06} />
      </mesh>
      <group ref={ref} position={[0, 1.8, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} wireframe transparent opacity={0.4} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} transparent opacity={0.15} />
        </mesh>
      </group>
      <Html position={[0, 3.5, 0]} center distanceFactor={9} occlude={false} zIndexRange={[12, 0]}>
        <div style={{ textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: accent, letterSpacing: 3, textTransform: "uppercase" }}>StudyHub Library</div>
          <div style={{ fontSize: 8, color: "#8a97a3", marginTop: 3, letterSpacing: 1 }}>Choose a subject</div>
        </div>
      </Html>
    </group>
  );
}
