"use client";

import { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Html, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA, BrightnessContrast } from "@react-three/postprocessing";
import * as THREE from "three";
import { SUBJECT_META, type Track } from "@/store/use-study-store";
import { WalkControls } from "./walk-controls";
import { GodRays, DustParticles } from "./atmosphere";

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

  useMemo(() => {
    // Warmer, richer atmosphere — not flat beige
    scene.fog = new THREE.FogExp2("#0d0a06", 0.032);
    scene.background = new THREE.Color("#0d0a06");
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
      {/* Rich IBL environment — warm golden hour */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} color="#ffd9a0" position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 16, 1]} />
        <Lightformer intensity={1.2} color="#ff9a50" position={[-8, 3, -4]} rotation={[0, Math.PI / 2, 0]} scale={[10, 8, 1]} />
        <Lightformer intensity={0.8} color="#5a4060" position={[8, 3, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 8, 1]} />
        <Lightformer intensity={0.6} color="#3a2a1a" position={[0, 2, -10]} scale={[12, 6, 1]} />
      </Environment>

      {/* Dramatic lighting — strong key light + warm fills */}
      <ambientLight intensity={0.15} color="#ffe0b0" />
      <directionalLight position={[5, 15, 5]} intensity={1.5} color="#fff0d0" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <spotLight position={[0, 8, 0]} angle={0.6} penumbra={0.5} intensity={40} color="#ffd9a0" distance={30} decay={2} />
      {/* Per-portal accent lights */}
      {portals.map((p, i) => (
        <spotLight key={i} position={[p.x * 0.6, 5, p.z * 0.6]} target-position={[p.x, 1.5, p.z]} angle={0.45} penumbra={0.8} intensity={30} color={p.meta.accent} distance={14} decay={2} />
      ))}

      {/* Reflective marble floor — real scene reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[R, 64]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={512}
          mixBlur={1}
          mixStrength={20}
          roughness={0.7}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#1a1612"
          metalness={0.5}
          mirror={0.4}
        />
      </mesh>
      {/* Subtle floor accent ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[PORTAL_R - 0.2, PORTAL_R + 0.2, 64]} />
        <meshBasicMaterial color="#c9a96a" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[2.5, 2.7, 48]} />
        <meshBasicMaterial color="#c9a96a" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Dark walls — warm dark marble */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <cylinderGeometry args={[R, R, 8, 64, 1, true]} />
        <meshPhysicalMaterial color="#2a2218" roughness={0.5} metalness={0.1} clearcoat={0.3} clearcoatRoughness={0.6} side={THREE.BackSide} />
      </mesh>

      {/* Ceiling — dark with warm skylight */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R, 64]} />
        <meshStandardMaterial color="#1a1410" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Skylight glow */}
      <mesh position={[0, 7.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[R * 0.5, 48]} />
        <meshBasicMaterial color="#ffe8c0" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Marble pillars — warm cream with gold caps */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
        const px = Math.cos(a) * (R - 0.5);
        const pz = Math.sin(a) * (R - 0.5);
        return (
          <group key={i}>
            <MarblePillar x={px} z={pz} />
            {/* Wall sconce on each pillar */}
            <WallSconce x={Math.cos(a) * (R - 0.2)} z={Math.sin(a) * (R - 0.2)} />
          </group>
        );
      })}

      {/* Central dais */}
      <CentralDais />

      {/* Volumetric god rays from skylight */}
      <GodRays position={[0, 8, 0]} target={[0, 0, 0]} color="#ffd9a0" radius={2.5} intensity={0.3} />

      {/* Floating dust motes in the light */}
      <DustParticles count={150} bounds={[R - 1, 7, R - 1]} color="#ffd9a0" size={0.035} />

      {/* Subject portals */}
      {portals.map((p) => (
        <SubjectPortal key={p.track} portal={p} isCurrent={p.track === currentTrack} onPick={() => onPickSubject(p.track)} registerPick={registerPick} />
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
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.5} intensity={1.0} mipmapBlur radius={0.8} />
        <BrightnessContrast brightness={-0.05} contrast={0.15} />
        <Vignette eskil={false} offset={0.1} darkness={0.78} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

function SubjectPortal({
  portal, isCurrent, onPick, registerPick,
}: {
  portal: { track: Track; meta: typeof SUBJECT_META[Track]; x: number; z: number; angle: number; rotY: number };
  isCurrent: boolean;
  onPick: () => void;
  registerPick: (obj: THREE.Object3D) => void;
}) {
  const { meta, x, z, rotY } = portal;
  const archRef = useRef<THREE.Mesh>(null);
  useFrame(() => { if (archRef.current) { const m = archRef.current.material as THREE.MeshStandardMaterial; m.emissiveIntensity = 0.3 + Math.sin(performance.now() * 0.002) * 0.15; } });

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
        <meshStandardMaterial color={meta.accent} emissive={meta.accent} emissiveIntensity={0.4} roughness={0.2} metalness={0.8} />
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

function MarblePillar({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Shaft — warm cream marble */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 6, 24]} />
        <meshPhysicalMaterial color="#d4c4a8" roughness={0.35} metalness={0.05} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      {/* Gold capital */}
      <mesh position={[0, 6.1, 0]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.0]} />
        <meshStandardMaterial color="#c9a96a" roughness={0.3} metalness={0.7} emissive="#c9a96a" emissiveIntensity={0.05} />
      </mesh>
      {/* Gold base */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[1.0, 0.25, 1.0]} />
        <meshStandardMaterial color="#c9a96a" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

function WallSconce({ x, z }: { x: number; z: number }) {
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
      {/* Sconce fixture */}
      <mesh castShadow rotation={[0, angle, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.1]} />
        <meshStandardMaterial color="#c9a96a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Flame glow */}
      <mesh position={[Math.cos(angle) * 0.08, 0.15, Math.sin(angle) * 0.08]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ffd070" transparent opacity={0.9} />
      </mesh>
      <pointLight ref={ref} position={[Math.cos(angle) * 0.15, 0.15, Math.sin(angle) * 0.15]} color="#ffb050" intensity={2} distance={5} decay={2} />
    </group>
  );
}

function CentralDais() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.1; });
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.3, 32]} />
        <meshPhysicalMaterial color="#c9a96a" roughness={0.25} metalness={0.6} clearcoat={0.5} />
      </mesh>
      <group ref={ref} position={[0, 1.8, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={0.6} wireframe transparent opacity={0.4} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#a78bfa" emissiveIntensity={0.8} transparent opacity={0.15} />
        </mesh>
      </group>
      <Html position={[0, 3.5, 0]} center distanceFactor={9} occlude={false} zIndexRange={[12, 0]}>
        <div style={{ textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#c9a96a", letterSpacing: 3, textTransform: "uppercase" }}>StudyHub Library</div>
          <div style={{ fontSize: 8, color: "#8a7050", marginTop: 3, letterSpacing: 1 }}>Choose a subject</div>
        </div>
      </Html>
    </group>
  );
}
