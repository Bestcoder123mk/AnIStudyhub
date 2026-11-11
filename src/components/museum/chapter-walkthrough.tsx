"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Environment, Lightformer } from "@react-three/drei";
import {
  BookOpen, ListChecks, Sigma, Calendar, Target, HelpCircle,
  CheckCircle2, XCircle, ArrowRight, GraduationCap, Lightbulb, Award, Maximize2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WalkControls } from "./walk-controls";
import { DustParticles } from "./atmosphere";
import { EXHIBITS } from "./exhibits/registry";
import type { ExhibitDefinition } from "./exhibits/types";
import type { StationData } from "./station-overlay";
import type { ExhibitTour } from "./exhibit-overlay";
import {
  getTrackChapter, getTrackMcqs, getTrackShortQa, getTrackLongQa,
  type TrackMCQ,
} from "@/lib/track-content";
import { SUBJECT_META, type Track } from "@/store/use-study-store";

// Spacing between stations along the walk (world units)
const STEP = 9;
const CW = 4.6; // corridor half-width
// How close the camera needs to be (in world Z) for a panel to be fully
// in focus. Panels beyond this fade, blur, and settle — so walking the
// corridor reads as things resolving into focus as you approach, the way
// a well-made product page reveals a section as it scrolls into view.
const FOCUS_RANGE = 6.5;

// Shared visual language for every station placard. Restrained: the accent
// colour lives in a small icon chip and thin rules, never washed across
// backgrounds or type. Everything else is a calm, layered near-black glass
// so the content — not the chrome — carries the design.
const INK = "#f5f5f7";
const INK_DIM = "rgba(245,245,247,0.62)";
const INK_FAINT = "rgba(245,245,247,0.42)";
const PANEL_BORDER = "rgba(255,255,255,0.09)";
const SANS = "var(--font-sans, sans-serif)";
const DISPLAY = "var(--font-display, sans-serif)";
const MONO = "var(--font-mono, monospace)";

function panelStyle(width: number, height: number): React.CSSProperties {
  return {
    position: "relative",
    width,
    height,
    borderRadius: 22,
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(30,29,35,0.86) 0%, rgba(15,15,18,0.92) 100%)",
    backdropFilter: "blur(36px) saturate(160%)",
    WebkitBackdropFilter: "blur(36px) saturate(160%)",
    border: `1px solid ${PANEL_BORDER}`,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 70px -18px rgba(0,0,0,0.65)",
    color: INK,
    padding: "28px 30px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    willChange: "transform, opacity, filter",
  };
}

// Drives a panel's focus state directly via the DOM ref rather than React
// state — this runs every frame, so pushing it through setState would mean
// 60 renders/sec for something that's purely a style side-effect.
function useProximity(z: number, range: number = FOCUS_RANGE) {
  const ref = useRef<HTMLDivElement>(null);
  useFrame(({ camera }) => {
    const el = ref.current;
    if (!el) return;
    const d = Math.abs(camera.position.z - z);
    const c = Math.max(0, Math.min(1, 1 - d / range));
    const eased = c * c * (3 - 2 * c); // smoothstep
    el.style.opacity = (0.3 + 0.7 * eased).toFixed(3);
    el.style.filter = `blur(${((1 - eased) * 5).toFixed(2)}px)`;
    el.style.transform = `translateY(${((1 - eased) * 10).toFixed(2)}px) scale(${(0.955 + 0.045 * eased).toFixed(3)})`;
  });
  return ref;
}

function Kicker({ icon: Icon, label, accent, onExpand }: { icon: LucideIcon; label: string; accent: string; onExpand?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexShrink: 0 }}>
      <div
        style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: `${accent}20`, border: `1px solid ${accent}38`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon size={13} color={accent} strokeWidth={2.25} />
      </div>
      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: INK_FAINT, flex: 1 }}>
        {label}
      </div>
      {onExpand && (
        <button
          onClick={onExpand}
          className="press-scale"
          title="Read full screen"
          style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center", color: INK_FAINT,
            background: "rgba(255,255,255,0.05)", border: `1px solid ${PANEL_BORDER}`,
          }}
        >
          <Maximize2 size={11} />
        </button>
      )}
    </div>
  );
}

// One line of a fact list — a quiet leading dot and a hairline divider,
// generous line height. Reads like a well-set list, not an app card.
function Fact({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: first ? "none" : "1px solid rgba(255,255,255,0.055)" }}>
      <div style={{ width: 5, height: 5, borderRadius: 99, background: "rgba(245,245,247,0.28)", marginTop: 7, flexShrink: 0 }} />
      <div style={{ fontSize: 12.5, lineHeight: 1.62, color: INK_DIM, fontFamily: SANS }}>{children}</div>
    </div>
  );
}

// A single teaching paragraph — read as prose, not scanned as a bullet.
// Deliberately roomier line-height and a touch more size than Fact, since
// this is the station meant to be *read*, not skimmed for revision.
function Paragraph({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      style={{
        padding: "13px 0",
        borderTop: first ? "none" : "1px solid rgba(255,255,255,0.055)",
        fontSize: 13, lineHeight: 1.75, color: INK_DIM, fontFamily: SANS,
      }}
    >
      {children}
    </div>
  );
}

function QARow({ q, accent, first }: { q: { marks: number; q: string }; accent: string; first?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderTop: first ? "none" : "1px solid rgba(255,255,255,0.055)" }}>
      <span
        style={{
          fontSize: 10, fontWeight: 700, color: accent, background: `${accent}18`,
          border: `1px solid ${accent}30`, borderRadius: 6, padding: "2px 6px",
          flexShrink: 0, marginTop: 1, fontFamily: SANS,
        }}
      >
        {q.marks}m
      </span>
      <span style={{ fontSize: 12.5, lineHeight: 1.6, color: INK_DIM, fontFamily: SANS }}>{q.q}</span>
    </div>
  );
}

function FormulaRow({ text, first }: { text: string; first?: boolean }) {
  return (
    <div
      style={{
        padding: "9px 0",
        borderTop: first ? "none" : "1px solid rgba(255,255,255,0.05)",
        fontFamily: MONO, fontSize: 12, lineHeight: 1.7,
        color: INK_DIM, whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}

function Corridor({ length, accent }: { length: number; accent: string }) {
  const stripRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const mat = stripRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.opacity = 0.28 + Math.sin(clock.elapsedTime * 0.8) * 0.1;
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -length / 2 + 4]} receiveShadow>
        <planeGeometry args={[CW * 2, length + 12]} />
        <meshPhysicalMaterial color="#141019" roughness={0.35} metalness={0.15} clearcoat={0.4} />
      </mesh>
      {/* A soft, slowly-breathing accent guide-line down the centre of the
          floor — a small "runway" cue that draws the eye (and the visitor)
          forward through every subject's walkthrough. */}
      <mesh ref={stripRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -length / 2 + 4]}>
        <planeGeometry args={[0.06, length + 12]} />
        <meshBasicMaterial color={accent} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 4, -length / 2 + 4]}>
        <boxGeometry args={[CW * 2, 0.2, length + 12]} />
        <meshStandardMaterial color="#0a0810" roughness={0.9} side={THREE.BackSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * CW, 2, -length / 2 + 4]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 4, length + 12]} />
          <meshPhysicalMaterial color="#1a1420" roughness={0.4} metalness={0.1} clearcoat={0.3} />
        </mesh>
      ))}
      {Array.from({ length: Math.ceil(length / STEP) + 1 }, (_, i) => (
        <pointLight key={i} position={[0, 3.6, -i * STEP]} color={accent} intensity={6} distance={STEP * 1.4} decay={2} />
      ))}
    </group>
  );
}

// The ring glows brighter as the camera nears its station — the physical
// scene now answers to the same "walk up, it resolves" logic as the panels.
function StationPlinth({ z, accent }: { z: number; accent: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    const mesh = ringRef.current;
    if (!mesh) return;
    const mat = mesh.material as THREE.MeshBasicMaterial;
    const d = Math.abs(camera.position.z - z);
    const c = Math.max(0, Math.min(1, 1 - d / FOCUS_RANGE));
    mat.opacity = 0.16 + c * 0.62;
  });
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.9, 1.05, 0.7, 24]} />
        <meshPhysicalMaterial color="#181220" roughness={0.25} metalness={0.1} clearcoat={0.5} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.78, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function StationPanel({
  z, accent, icon, label, width = 460, height = 320, onExpand, children,
}: {
  z: number; accent: string; icon: LucideIcon; label: string; width?: number; height?: number; onExpand?: () => void; children: React.ReactNode;
}) {
  const ref = useProximity(z);
  return (
    <Html transform position={[0, 2.05, z]} distanceFactor={2.1} zIndexRange={[8, 0]} occlude={false}>
      <div ref={ref} style={panelStyle(width, height)}>
        <Kicker icon={icon} label={label} accent={accent} onExpand={onExpand} />
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>{children}</div>
      </div>
    </Html>
  );
}

function QuizStation({ z, accent, questions }: { z: number; accent: string; questions: TrackMCQ[] }) {
  const ref = useProximity(z);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = questions[i % questions.length];
  if (!q) return null;
  const dots = Math.min(questions.length, 8);

  return (
    <Html transform position={[0, 2.05, z]} distanceFactor={2.1} zIndexRange={[8, 0]} occlude={false}>
      <div ref={ref} style={{ ...panelStyle(480, 400), gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Kicker icon={HelpCircle} label="Practice Check" accent={accent} />
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
            {Array.from({ length: dots }, (_, di) => (
              <div
                key={di}
                style={{ width: 5, height: 5, borderRadius: 99, background: di === i % dots ? accent : "rgba(255,255,255,0.16)", transition: "background 0.2s ease" }}
              />
            ))}
          </div>
        </div>

        <div style={{ fontFamily: DISPLAY, fontSize: 15.5, fontWeight: 600, lineHeight: 1.45, marginBottom: 16, color: INK, flexShrink: 0 }}>
          {q.q}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", minHeight: 0 }}>
          {q.opts.map((opt, oi) => {
            const isAns = oi === q.ans;
            const shown = picked !== null;
            const wrongPick = shown && oi === picked && !isAns;
            const border = shown && isAns ? `${accent}80` : wrongPick ? "rgba(240,110,110,0.55)" : "rgba(255,255,255,0.09)";
            const bg = shown && isAns ? `${accent}14` : wrongPick ? "rgba(240,110,110,0.08)" : "rgba(255,255,255,0.035)";
            return (
              <button
                key={oi}
                onClick={() => setPicked(oi)}
                disabled={picked !== null}
                style={{
                  textAlign: "left", padding: "11px 14px", borderRadius: 12,
                  border: `1px solid ${border}`, background: bg, color: INK,
                  fontFamily: SANS, fontSize: 12.5, cursor: picked === null ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  transition: "border-color 0.2s ease, background 0.2s ease",
                }}
              >
                <span>{opt}</span>
                {shown && isAns && <CheckCircle2 size={15} color={accent} style={{ flexShrink: 0 }} />}
                {wrongPick && <XCircle size={15} color="rgba(240,120,120,0.9)" style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div
            style={{
              fontSize: 11.5, lineHeight: 1.6, color: INK_DIM, marginTop: 12,
              padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)",
              borderLeft: `2px solid ${accent}70`, fontFamily: SANS, flexShrink: 0,
            }}
          >
            {q.exp}
          </div>
        )}

        <button
          onClick={() => { setI((v) => v + 1); setPicked(null); }}
          style={{
            marginTop: "auto", paddingTop: 14, alignSelf: "flex-end", fontSize: 11.5, fontWeight: 600,
            color: accent, background: `${accent}14`, border: `1px solid ${accent}30`,
            borderRadius: 100, padding: "8px 16px", cursor: "pointer", flexShrink: 0,
            fontFamily: SANS, display: "flex", alignItems: "center", gap: 6,
          }}
        >
          Next question <ArrowRight size={13} />
        </button>
      </div>
    </Html>
  );
}

function HeroPanel({ chapter, subjectLabel, accent, stopCount }: { chapter: { num: string; title: string }; subjectLabel: string; accent: string; stopCount: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <Html transform position={[0, 2.05, 0]} distanceFactor={2.1} zIndexRange={[8, 0]} occlude={false}>
      <div
        style={{
          ...panelStyle(500, 250),
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0px)" : "translateY(14px)",
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11, fontWeight: 700, color: accent, background: `${accent}18`,
              border: `1px solid ${accent}35`, borderRadius: 100, padding: "3px 10px", fontFamily: SANS,
            }}
          >
            {chapter.num}
          </span>
          <span style={{ fontSize: 11, color: INK_FAINT, fontFamily: SANS }}>{subjectLabel} · {stopCount} stops</span>
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 27, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.14, marginBottom: 12, color: INK }}>
          {chapter.title}
        </div>
        <div style={{ fontSize: 12.5, color: INK_DIM, lineHeight: 1.6, fontFamily: SANS, display: "flex", alignItems: "center", gap: 8 }}>
          Concept, deep dive, key points, formulas, board-pattern PYQs, and practice.
        </div>
        <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: INK_FAINT, fontFamily: SANS }}>
          <ArrowRight size={11} style={{ animation: "shWalkHint 1.6s ease-in-out infinite" }} />
          Walk forward to begin
        </div>
        <style>{`@keyframes shWalkHint { 0%, 100% { transform: translateX(0); opacity: 0.4; } 50% { transform: translateX(4px); opacity: 0.9; } }`}</style>
      </div>
    </Html>
  );
}

export function ChapterWalkthrough({
  track,
  chapterId,
  onBack,
  onProgress,
  onFocusExhibit,
  onFocusStation,
}: {
  track: Track;
  chapterId: number;
  onBack: () => void;
  onProgress?: (p: { index: number; total: number; label: string } | null) => void;
  onFocusExhibit?: (exhibit: ExhibitDefinition, tour?: ExhibitTour) => void;
  onFocusStation?: (data: StationData) => void;
}) {
  const meta = SUBJECT_META[track];
  const accent = meta.accent;

  // Track-aware lookups — resolves against whichever of the 5 subjects'
  // datasets `track` points at, instead of always reading Science.
  const chapter = useMemo(() => getTrackChapter(track, chapterId), [track, chapterId]);
  const mcqs = useMemo(() => getTrackMcqs(track, chapterId), [track, chapterId]);
  const shortQa = useMemo(() => getTrackShortQa(track, chapterId), [track, chapterId]);
  const longQa = useMemo(() => getTrackLongQa(track, chapterId), [track, chapterId]);
  const exhibit = useMemo(() => EXHIBITS.find((e) => e.track === track && e.chapterId === chapterId), [track, chapterId]);
  const Model = exhibit?.Model;
  const Panel = exhibit?.Panel;

  // Board-pattern items (Section A-style MCQs/Assertion-Reason at 1 mark,
  // plus the flagged VSA/SA/LA/case-based questions) — written in the style
  // of CBSE 2020–2026 papers, surfaced as their own stop so a student can
  // see exactly what the exam actually asks, not just the underlying theory.
  const pyqMcqs = useMemo(() => mcqs.filter((m) => m.pyq), [mcqs]);
  const pyqQa = useMemo(() => [...shortQa, ...longQa].filter((q) => q.pyq), [shortQa, longQa]);
  const pyqRows = useMemo(
    () => [...pyqMcqs.map((m) => ({ marks: 1, q: m.q })), ...pyqQa],
    [pyqMcqs, pyqQa]
  );
  const hasPyqStation = pyqRows.length > 0;

  const stationCount = 9;
  const length = stationCount * STEP;
  const zAt = (n: number) => -n * STEP;
  const isDates = (chapter?.formulas ?? "").trim().toUpperCase().startsWith("KEY");
  const formulaLines = useMemo(() => (chapter?.formulas ?? "").split("\n").map((l) => l.trim()).filter(Boolean), [chapter]);
  const hasFormulaStation = formulaLines.length > 0;
  const hasDeepDive = (chapter?.deepDive?.length ?? 0) > 0;

  // Named stops for the progress overlay — a subset of the physical stations
  // (the ones that actually carry content for this chapter). Formula/Key
  // Dates is skipped for chapters that genuinely have none (e.g. English
  // literature chapters carry no formula sheet) so the tour never parks on
  // an empty panel.
  const stops = useMemo(() => {
    if (!chapter) return [];
    const list = [
      { z: 0, label: "Welcome" },
      { z: zAt(1), label: "Core Concept" },
    ];
    if (hasDeepDive) list.push({ z: zAt(2), label: "Deep Dive" });
    list.push({ z: zAt(3), label: "Key Points" });
    if (hasFormulaStation) list.push({ z: zAt(4), label: isDates ? "Key Dates" : "Formula Sheet" });
    list.push({ z: zAt(5), label: "Exam Tips" });
    if (hasPyqStation) list.push({ z: zAt(6), label: "Board Pattern (PYQ)" });
    if (mcqs.length > 0) list.push({ z: zAt(7), label: "Practice Check" });
    if (shortQa.length > 0 || longQa.length > 0) list.push({ z: zAt(7) - 6, label: "Short & Long Answer" });
    return list;
  }, [chapter, mcqs.length, shortQa.length, longQa.length, isDates, hasFormulaStation, hasDeepDive, hasPyqStation]);

  // Full-screen "read this station" data — a parallel list to `stops` above,
  // but carrying the actual content instead of just a label, so each panel's
  // expand button can open StationOverlay with real text and a working
  // Continue Tour that steps to the next entry in this same list. Quiz is
  // deliberately excluded: it's an interactive check, not a reading list,
  // so it doesn't fit StationOverlay's read-and-continue shape.
  const readStations = useMemo(() => {
    if (!chapter) return [] as { id: string; title: string; icon: string; items: string[]; isFormula?: boolean }[];
    const list: { id: string; title: string; icon: string; items: string[]; isFormula?: boolean }[] = [
      { id: "concept", title: "Core Concept", icon: "📘", items: chapter.oneshot },
    ];
    if (hasDeepDive) list.push({ id: "deepdive", title: "Deep Dive", icon: "💡", items: chapter.deepDive ?? [] });
    list.push({ id: "keypoints", title: "Key Points", icon: "✅", items: chapter.keypts });
    if (hasFormulaStation) list.push({ id: "formula", title: isDates ? "Key Dates" : "Formula Sheet", icon: isDates ? "📅" : "➗", items: formulaLines, isFormula: true });
    list.push({ id: "examtips", title: "Exam Tips & Common Traps", icon: "🎯", items: chapter.exam });
    if (hasPyqStation) list.push({ id: "pyq", title: "Board Pattern · CBSE 2020–26 style", icon: "🏅", items: pyqRows.map((r) => `[${r.marks}m] ${r.q}`) });
    if (shortQa.length > 0 || longQa.length > 0) {
      list.push({ id: "practice", title: "Short & Long Answer Practice", icon: "🎓", items: [...shortQa, ...longQa].map((r) => `[${r.marks}m] ${r.q}`) });
    }
    return list;
  }, [chapter, hasDeepDive, hasFormulaStation, hasPyqStation, isDates, formulaLines, pyqRows, shortQa, longQa]);

  const buildStationData = (id: string): StationData | null => {
    if (!chapter) return null;
    const idx = readStations.findIndex((s) => s.id === id);
    const st = readStations[idx];
    if (!st) return null;
    return {
      stationId: st.id,
      title: st.title,
      icon: st.icon,
      items: st.items,
      accent,
      chapterTitle: chapter.title,
      chapterNum: chapter.num,
      isFormula: st.isFormula,
      isLastStop: idx === readStations.length - 1,
      onContinueTour: () => {
        const next = readStations[idx + 1];
        if (next) onFocusStation?.(buildStationData(next.id)!);
      },
    };
  };
  const expand = (id: string) => () => {
    const d = buildStationData(id);
    if (d) onFocusStation?.(d);
  };

  const lastStop = useRef(-1);
  useFrame(({ camera }) => {
    if (stops.length === 0) return;
    let nearest = 0, min = Infinity;
    stops.forEach((s, i) => {
      const d = Math.abs(camera.position.z - s.z);
      if (d < min) { min = d; nearest = i; }
    });
    if (nearest !== lastStop.current) {
      lastStop.current = nearest;
      onProgress?.({ index: nearest + 1, total: stops.length, label: stops[nearest].label });
    }
  });

  useEffect(() => {
    return () => onProgress?.(null);
  }, [chapterId, onProgress]);

  if (!chapter) {
    return (
      <Html center>
        <div style={{ color: "#fff", fontSize: 14 }}>Chapter not found.</div>
      </Html>
    );
  }

  return (
    <>
      {/* Procedural IBL — no network fetch (a hardcoded `preset="night"` here
          used to pull an HDRI from a CDN at runtime; on a blocked/slow
          connection that silently fails and every reflective/metal surface
          in the corridor renders flat and dark — the "textures don't load"
          bug). Built entirely from in-scene Lightformers instead, matching
          the pattern already used in gallery.tsx / exhibit-overlay.tsx. */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.1} color={accent} position={[0, 6, -length / 2]} rotation={[Math.PI / 2, 0, 0]} scale={[CW * 2, length, 1]} />
        <Lightformer intensity={0.5} color="#0a0d12" position={[0, 3, 0]} scale={[CW * 3, 6, 1]} />
        <Lightformer intensity={0.7} color={accent} position={[-CW * 1.4, 3, -length / 2]} rotation={[0, Math.PI / 2, 0]} scale={[length, 5, 1]} />
        <Lightformer intensity={0.7} color={accent} position={[CW * 1.4, 3, -length / 2]} rotation={[0, -Math.PI / 2, 0]} scale={[length, 5, 1]} />
      </Environment>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#3a3050", "#0a0810", 0.4]} />
      <Corridor length={length} accent={accent} />
      <group position={[0, 0, -length / 2]}>
        <DustParticles count={90} bounds={[CW * 0.8, 4.2, length / 2]} color={accent} size={0.03} />
      </group>

      {/* Station 0 — Welcome */}
      <StationPlinth z={0} accent={accent} />
      <HeroPanel chapter={chapter} subjectLabel={meta.label} accent={accent} stopCount={stops.length} />

      {/* Station 1 — Concept, with the existing exhibit as centerpiece if one exists
          (a 3D statue for Science, or a mounted interactive painting panel for
          SSC/Maths/English/Sanskrit) */}
      <StationPlinth z={zAt(1)} accent={accent} />
      {Model && (
        <group position={[0, 2.3, zAt(1)]} scale={0.55}>
          <Model selectedPart={null} onSelectPart={() => {}} preview />
        </group>
      )}
      {Model && exhibit && onFocusExhibit && (
        <Html position={[0, 3.35, zAt(1)]} center distanceFactor={7} occlude={false} zIndexRange={[14, 0]}>
          <button
            onClick={() => {
              // The exhibit is the physical centerpiece of the "Concept" stop
              // (same z as readStations[0]) — continuing from it should jump
              // to whatever comes after Concept, exactly like continuing
              // from the Concept station's own panel would.
              const concept = buildStationData("concept");
              onFocusExhibit(exhibit, concept ? { onContinueTour: concept.onContinueTour, isLastStop: concept.isLastStop } : undefined);
            }}
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
      {Panel && !Model && (
        <Html transform position={[0, 2.35, zAt(1)]} distanceFactor={1.9} zIndexRange={[8, 0]} occlude={false}>
          <div
            style={{
              width: 340, height: 250, position: "relative", borderRadius: 8, overflow: "hidden",
              boxShadow: `0 14px 40px rgba(0,0,0,0.6), 0 0 0 1px ${accent}55`,
            }}
          >
            <Panel selectedPart={null} onSelectPart={() => {}} preview />
          </div>
        </Html>
      )}
      <StationPanel z={zAt(1) - 2.6} accent={accent} icon={BookOpen} label="Core Concept" width={440} height={260} onExpand={expand("concept")}>
        {chapter.oneshot.map((line, i) => (
          <Fact key={i} first={i === 0}>{line}</Fact>
        ))}
      </StationPanel>

      {/* Station 2 — Deep Dive: real teaching prose (why/how, worked intuition,
          misconceptions) rather than the quick-recall bullets above and below it.
          Skipped only for the rare chapter with no deep-dive content yet. */}
      {hasDeepDive && (
        <>
          <StationPlinth z={zAt(2)} accent={accent} />
          <StationPanel z={zAt(2)} accent={accent} icon={Lightbulb} label="Deep Dive" width={520} height={380} onExpand={expand("deepdive")}>
            {chapter.deepDive.map((para, i) => (
              <Paragraph key={i} first={i === 0}>{para}</Paragraph>
            ))}
          </StationPanel>
        </>
      )}

      {/* Station 3 — Key points */}
      <StationPlinth z={zAt(3)} accent={accent} />
      <StationPanel z={zAt(3)} accent={accent} icon={ListChecks} label="Key Points" width={480} height={340} onExpand={expand("keypoints")}>
        {chapter.keypts.map((line, i) => (
          <Fact key={i} first={i === 0}>{line}</Fact>
        ))}
      </StationPanel>

      {/* Station 4 — Formulas / key dates (skipped when a chapter has none, e.g. English literature) */}
      {hasFormulaStation && (
        <>
          <StationPlinth z={zAt(4)} accent={accent} />
          <StationPanel z={zAt(4)} accent={accent} icon={isDates ? Calendar : Sigma} label={isDates ? "Key Dates" : "Formula Sheet"} width={460} height={280} onExpand={expand("formula")}>
            {formulaLines.map((line, i) => (
              <FormulaRow key={i} text={line} first={i === 0} />
            ))}
          </StationPanel>
        </>
      )}

      {/* Station 5 — Exam tips */}
      <StationPlinth z={zAt(5)} accent={accent} />
      <StationPanel z={zAt(5)} accent={accent} icon={Target} label="Exam Tips & Common Traps" width={460} height={280} onExpand={expand("examtips")}>
        {chapter.exam.map((line, i) => (
          <Fact key={i} first={i === 0}>{line}</Fact>
        ))}
      </StationPanel>

      {/* Station 6 — Board Pattern / PYQ Bank: the flagged exam-style items,
          shown as a browsable wall (question + marks only) so a student can
          feel the shape of the real paper before diving into full practice. */}
      {hasPyqStation && (
        <>
          <StationPlinth z={zAt(6)} accent={accent} />
          <StationPanel z={zAt(6)} accent={accent} icon={Award} label="Board Pattern · CBSE 2020–26 style" width={500} height={360} onExpand={expand("pyq")}>
            {pyqRows.map((q, i) => (
              <QARow key={i} q={q} accent={accent} first={i === 0} />
            ))}
            <div style={{ fontSize: 10.5, color: "rgba(245,245,247,0.32)", marginTop: 14, lineHeight: 1.5, fontFamily: SANS }}>
              Written in the pattern of real CBSE board papers — not a transcript of any one year&apos;s exact paper. Full attempts live in MCQ Quiz, Short Answer, and Long Answer.
            </div>
          </StationPanel>
        </>
      )}

      {/* Station 7 — Interactive practice quiz, pulling from the real MCQ bank */}
      <StationPlinth z={zAt(7)} accent={accent} />
      {mcqs.length > 0 && <QuizStation z={zAt(7)} accent={accent} questions={mcqs} />}

      {/* Practice corner — short & long answer, past-paper style */}
      {(shortQa.length > 0 || longQa.length > 0) && (
        <>
          <StationPlinth z={zAt(7) - 6} accent={accent} />
          <StationPanel z={zAt(7) - 6} accent={accent} icon={GraduationCap} label="Short & Long Answer Practice" width={500} height={360} onExpand={expand("practice")}>
            {[...shortQa, ...longQa].map((q, i) => (
              <QARow key={q.id} q={q} accent={accent} first={i === 0} />
            ))}
            <div style={{ fontSize: 10.5, color: "rgba(245,245,247,0.32)", marginTop: 14, lineHeight: 1.5, fontFamily: SANS }}>
              Full model answers are in the Short/Long Answer practice screens — this wall is for a quick self-check on what you remember first.
            </div>
          </StationPanel>
        </>
      )}

      {/* Exit */}
      <group position={[0, 0, zAt(7) - 6 - 12]}>
        <Html transform distanceFactor={2.1} position={[0, 1.8, 0]} occlude={false}>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              borderRadius: 100,
              border: `1px solid ${PANEL_BORDER}`,
              background: "rgba(20,20,24,0.86)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              color: INK,
              fontFamily: SANS,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 20px 50px -14px rgba(0,0,0,0.6)",
            }}
          >
            ← Back to {meta.label} Wing
          </button>
        </Html>
      </group>

      {/* Corridor content recedes toward -Z (Welcome at z=0 down to the Exit
          at the far end), so — same as the lobby and chapter-wing spawns —
          yaw must be 0 to face into it. This was Math.PI (facing +Z): every
          walkthrough used to open on an empty stretch of floor behind the
          spawn point instead of the tour ahead. */}
      <WalkControls
        enabled
        spawnPose={{ x: 0, z: 3, yaw: 0 }}
        bounds={{ kind: "rect", maxX: CW - 0.6, minZ: zAt(7) - 6 - 15, maxZ: 6 }}
      />
    </>
  );
}
