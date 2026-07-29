"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { CHAPTERS, SSC_CHAPTERS } from "@/lib/study-data";
import { MATHS_CHAPTERS } from "@/lib/maths-data";
import { ENG_CHAPTERS } from "@/lib/english-data";
import { SKT_CHAPTERS } from "@/lib/sanskrit-data";
import { levelProgress } from "@/lib/achievements";
import { OrbitControls } from "@react-three/drei";

const SUBJECTS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];

function getChapters(t: Track) {
  if (t === "science") return CHAPTERS;
  if (t === "ssc") return SSC_CHAPTERS;
  if (t === "maths") return MATHS_CHAPTERS;
  if (t === "english") return ENG_CHAPTERS;
  return SKT_CHAPTERS;
}

function getMastery(track: Track, chId: number, store: ReturnType<typeof useStudyStore.getState>) {
  if (track === "science") {
    const cs = store.chStats[chId];
    return cs && cs.attempted > 0 ? cs.correct / cs.attempted : 0;
  }
  // For generic subjects, we don't have per-chapter stats — return a base glow from totalXp
  const stats = track === "ssc" ? store.ssc : store.subjectStats[track];
  if (!stats) return 0.1;
  return Math.min(1, stats.totalXp / 500);
}

function GalaxyScene({ onPickSubject }: { onPickSubject: (t: Track) => void }) {
  const store = useStudyStore();
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.03;
  });

  // Arrange 5 galaxies in a large circle
  const galaxies = useMemo(() => {
    return SUBJECTS.map((s, i) => {
      const angle = (i / SUBJECTS.length) * Math.PI * 2;
      const radius = 8;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;
      const meta = SUBJECT_META[s];
      const chapters = getChapters(s);
      // Each chapter = a star orbiting the galaxy center
      const stars = chapters.map((ch, j) => {
        const sa = (j / chapters.length) * Math.PI * 2;
        const sr = 1.5 + (j % 3) * 0.4;
        const mastery = getMastery(s, ch.id, store);
        return {
          chId: ch.id,
          title: ch.title,
          num: ch.num,
          x: cx + Math.cos(sa) * sr,
          y: Math.sin(sa) * sr * 0.6,
          z: cz + Math.sin(sa) * sr,
          mastery,
          size: 0.06 + mastery * 0.12,
        };
      });
      // Galaxy-level mastery (average)
      const avgMastery = stars.reduce((a, b) => a + b.mastery, 0) / stars.length;
      return { track: s, meta, cx, cz, stars, avgMastery };
    });
  }, [store]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={30} decay={2} />

      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Html position={[0, 1.2, 0]} center distanceFactor={12}>
        <div style={{ textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase" }}>Knowledge Galaxy</div>
          <div style={{ fontSize: 9, color: "#6b6450", marginTop: 2 }}>Click a galaxy to enter</div>
        </div>
      </Html>

      <group ref={group}>
        {galaxies.map((g) => (
          <group key={g.track} position={[g.cx, 0, g.cz]}>
            {/* Galaxy core */}
            <mesh
              onClick={(e) => { e.stopPropagation(); onPickSubject(g.track); }}
              onPointerOver={() => { document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { document.body.style.cursor = "default"; }}
            >
              <sphereGeometry args={[0.35, 24, 24]} />
              <meshBasicMaterial color={g.meta.accent} transparent opacity={0.4 + g.avgMastery * 0.6} />
            </mesh>
            {/* Glow */}
            <mesh>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshBasicMaterial color={g.meta.accent} transparent opacity={0.15} />
            </mesh>
            {/* Label */}
            <Html position={[0, 0.9, 0]} center distanceFactor={10} occlude={false}>
              <div
                onClick={(e) => { e.stopPropagation(); onPickSubject(g.track); }}
                style={{ textAlign: "center", cursor: "pointer", pointerEvents: "auto", userSelect: "none" }}
              >
                <div style={{ fontSize: 20, lineHeight: 1 }}>{g.meta.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: g.meta.accent, marginTop: 4, textShadow: "0 0 8px rgba(0,0,0,0.8)" }}>{g.meta.label}</div>
                <div style={{ fontSize: 8, color: "#9a9080", marginTop: 1 }}>{Math.round(g.avgMastery * 100)}% mastery</div>
              </div>
            </Html>
            {/* Chapter stars */}
            {g.stars.map((st) => (
              <mesh key={st.chId} position={[st.x - g.cx, st.y, st.z - g.cz]}>
                <sphereGeometry args={[st.size, 12, 12]} />
                <meshBasicMaterial color={st.mastery > 0.5 ? "#fbbf24" : st.mastery > 0.1 ? g.meta.accent : "#4a4458"} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Background stars */}
      <BackgroundStars />

      <OrbitControls enablePan={false} minDistance={6} maxDistance={25} autoRotate autoRotateSpeed={0.3} enableZoom />
    </>
  );
}

function BackgroundStars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const r = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.01; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={400} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export function GalaxyView() {
  const setTrack = useStudyStore((s) => s.setTrack);
  const totalXp = useStudyStore((s) => s.totalXp + s.ssc.totalXp + Object.values(s.subjectStats).reduce((a, b) => a + b.totalXp, 0));
  const { level } = levelProgress(totalXp);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Knowledge Galaxy</h1>
          <p className="text-sm text-muted-foreground">Your mastery across all 5 subjects, visualized as a universe</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Cosmic Level</div>
          <div className="font-display font-bold text-lg text-primary">Lv {level}</div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border" style={{ height: "calc(100vh - 14rem)" }}>
        <Canvas camera={{ position: [0, 8, 16], fov: 55 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <GalaxyScene onPickSubject={(t) => setTrack(t)} />
        </Canvas>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {SUBJECTS.map((s) => {
          const meta = SUBJECT_META[s];
          return (
            <button
              key={s}
              onClick={() => setTrack(s)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/40 transition"
            >
              <span className="text-xl">{meta.icon}</span>
              <span className="text-[10px] font-semibold" style={{ color: meta.accent }}>{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
