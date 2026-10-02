"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#fb923c";

// Chapter 1 — Rise of Nationalism in Europe.
// A triptych "painting" panel: LEFT allegory · CENTER unification map · RIGHT 1848 revolutions,
// with two top-corner medallions (Napoleon's Code · Romanticism).
function HistNationalismEuropePanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        {/* Aged canvas backdrop */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, #3a2410 0%, #5a3218 35%, #6b3a20 60%, #2a1808 100%)",
        }} />
        {/* Subtle texture specks */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.18,
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #fde68a 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fbbf24 1px, transparent 1px), radial-gradient(circle at 45% 80%, #d97706 1px, transparent 1px)",
          backgroundSize: "60px 60px, 90px 90px, 70px 70px",
        }} />

        {/* Triptych dividers (gilded columns) */}
        <div style={{ position: "absolute", left: "33.2%", top: "16%", bottom: "18%", width: 3, background: `linear-gradient(180deg, ${accent}, #7a3a08, ${accent})`, boxShadow: `0 0 6px ${accent}80` }} />
        <div style={{ position: "absolute", left: "66.4%", top: "16%", bottom: "18%", width: 3, background: `linear-gradient(180deg, ${accent}, #7a3a08, ${accent})`, boxShadow: `0 0 6px ${accent}80` }} />

        {/* ───────── LEFT: Allegory of Marianne/Germania ───────── */}
        <Hotspot
          id="allegory"
          selected={selectedPart === "allegory"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "4%", top: "18%", width: "27%", height: "64%" }}
          label="Allegory"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="aleHalo" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="aleRobe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#aleHalo)" />
            {/* Pedestal */}
            <rect x="28" y="98" width="44" height="14" fill="#2a1810" />
            <rect x="24" y="110" width="52" height="6" fill="#3a2010" />
            {/* Robed body — flowing gown silhouette */}
            <path d="M 50 36 C 40 36 36 44 36 54 L 33 78 L 26 100 L 74 100 L 67 78 L 64 54 C 64 44 60 36 50 36 Z" fill="url(#aleRobe)" />
            {/* Robe folds */}
            <path d="M 50 42 L 48 100 L 52 100 L 50 42 Z" fill="#7a3a08" opacity="0.4" />
            <path d="M 42 56 L 40 100" stroke="#7a3a08" strokeWidth="0.5" opacity="0.4" fill="none" />
            <path d="M 58 56 L 60 100" stroke="#7a3a08" strokeWidth="0.5" opacity="0.4" fill="none" />
            {/* Head */}
            <circle cx="50" cy="28" r="8" fill="#fde68a" />
            {/* Flowing hair */}
            <path d="M 42 28 Q 36 36 40 50 L 44 40 Z" fill="#92400e" />
            <path d="M 58 28 Q 64 36 60 50 L 56 40 Z" fill="#92400e" />
            {/* Crown of oak leaves / rays */}
            <path d="M 42 18 L 45 22 L 47 14 L 50 20 L 53 14 L 55 22 L 58 18 L 56 24 L 44 24 Z" fill="#fbbf24" stroke="#7a3a08" strokeWidth="0.4" />
            {/* Right arm raised with tricolor flag */}
            <path d="M 36 48 L 18 30 L 21 27 L 39 44 Z" fill="url(#aleRobe)" />
            <line x1="18" y1="30" x2="18" y2="4" stroke="#2a1810" strokeWidth="1.5" />
            <rect x="18" y="4" width="16" height="9" fill="#1e3a8a" />
            <rect x="18" y="13" width="16" height="9" fill="#f5f5f5" />
            <rect x="18" y="22" width="16" height="9" fill="#dc2626" />
            {/* Left arm holding broken chains */}
            <path d="M 64 48 L 82 56" stroke="url(#aleRobe)" strokeWidth="4" fill="none" />
            <circle cx="80" cy="55" r="3" fill="none" stroke="#7a3a08" strokeWidth="1.4" />
            <circle cx="86" cy="58" r="3" fill="none" stroke="#7a3a08" strokeWidth="1.4" />
            <line x1="83" y1="56" x2="86" y2="58" stroke="#7a3a08" strokeWidth="1.2" />
            {/* Sword (Germania hint) */}
            <line x1="50" y1="60" x2="50" y2="92" stroke="#cbd5e1" strokeWidth="1.4" />
            <line x1="46" y1="60" x2="54" y2="60" stroke="#92400e" strokeWidth="1.4" />
            {/* Breastplate shimmer */}
            <path d="M 44 44 L 56 44 L 54 56 L 46 56 Z" fill="#fbbf24" opacity="0.35" />
          </svg>
        </Hotspot>
        <Tag n={1} x={17} y={86} accent={accent} selected={selectedPart === "allegory"} onClick={() => onSelectPart("allegory")} preview={preview} />

        {/* ───────── CENTER: Map of Unification 1871 ───────── */}
        <Hotspot
          id="unification-map"
          selected={selectedPart === "unification-map"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "36%", top: "18%", width: "28%", height: "64%" }}
          label="Unification"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <pattern id="parch" patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill="#e8d5a8" />
                <circle cx="3" cy="3" r="0.35" fill="#a89060" />
              </pattern>
              <marker id="mapArr" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
                <path d="M 0 0 L 4 2.5 L 0 5 Z" fill="#dc2626" />
              </marker>
            </defs>
            <rect x="2" y="2" width="96" height="116" fill="url(#parch)" />
            <rect x="2" y="2" width="96" height="116" fill="none" stroke="#7a5a30" strokeWidth="1.6" />
            {/* Compass rose */}
            <g transform="translate(88 12)">
              <circle r="5" fill="none" stroke="#7a5a30" strokeWidth="0.6" />
              <path d="M 0 -5 L 1 0 L 0 5 L -1 0 Z" fill="#7a5a30" />
              <text x="0" y="-6" fontSize="2.4" textAnchor="middle" fill="#5a3a18" fontWeight="bold">N</text>
            </g>
            {/* Stylized Europe landmass */}
            <path d="M 22 38 Q 18 50 24 64 Q 28 76 36 84 Q 48 90 60 88 Q 76 90 84 74 Q 92 58 86 42 Q 80 28 64 26 Q 48 24 36 28 Q 24 30 22 38 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.8" />
            {/* UK */}
            <ellipse cx="28" cy="46" rx="3.2" ry="5.5" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Iberia */}
            <path d="M 18 58 L 28 58 L 28 70 L 22 72 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Scandinavia */}
            <path d="M 46 24 L 56 22 L 58 34 L 50 36 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Italy highlighted 1861 — boot */}
            <path d="M 40 62 Q 38 66 42 72 L 45 86 Q 48 92 50 88 L 47 74 Q 51 68 48 62 Z" fill="#fb923c" stroke="#7a2a08" strokeWidth="0.6" />
            {/* Germany highlighted 1871 — block */}
            <path d="M 52 44 L 66 44 L 68 56 L 62 62 L 53 60 L 51 50 Z" fill="#facc15" stroke="#7a5a08" strokeWidth="0.6" />
            {/* France */}
            <path d="M 30 50 L 42 48 L 44 60 L 34 62 Z" fill="#a89060" stroke="#7a5a30" strokeWidth="0.4" />
            {/* Spread-of-nationalism arrows */}
            <path d="M 38 54 L 46 60" stroke="#dc2626" strokeWidth="1" markerEnd="url(#mapArr)" fill="none" />
            <path d="M 44 52 L 54 52" stroke="#dc2626" strokeWidth="1" markerEnd="url(#mapArr)" fill="none" />
            <path d="M 50 44 L 58 48" stroke="#dc2626" strokeWidth="1" markerEnd="url(#mapArr)" fill="none" />
            {/* Labels */}
            <text x="46" y="80" fontSize="3" fill="#3a1a08" fontWeight="bold">ITA</text>
            <text x="52" y="54" fontSize="3" fill="#3a2a08" fontWeight="bold">GER</text>
            <text x="32" y="56" fontSize="2.4" fill="#3a2a08">FRA</text>
            <text x="24" y="44" fontSize="2.2" fill="#3a2a08">UK</text>
            {/* Bottom cartouche */}
            <rect x="22" y="100" width="56" height="12" fill="#f5e8c8" stroke="#7a5a30" strokeWidth="0.6" />
            <text x="50" y="108" fontSize="3.4" textAnchor="middle" fill="#3a1a08" fontWeight="bold" fontStyle="italic">EUROPE · 1871</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={50} y={86} accent={accent} selected={selectedPart === "unification-map"} onClick={() => onSelectPart("unification-map")} preview={preview} />

        {/* ───────── RIGHT: 1848 Revolutions ───────── */}
        <Hotspot
          id="revolutions-1848"
          selected={selectedPart === "revolutions-1848"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "69%", top: "18%", width: "27%", height: "64%" }}
          label="1848"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="revSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c2d12" />
                <stop offset="50%" stopColor="#dc2626" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#1c0a08" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#revSky)" />
            {/* Smoke columns */}
            <ellipse cx="28" cy="22" rx="16" ry="7" fill="#3a1a08" opacity="0.6" />
            <ellipse cx="72" cy="16" rx="18" ry="6" fill="#3a1a08" opacity="0.5" />
            <ellipse cx="50" cy="10" rx="22" ry="5" fill="#3a1a08" opacity="0.4" />
            {/* Cobblestone barricade */}
            <rect x="8" y="86" width="84" height="4" fill="#2a1810" />
            <rect x="12" y="80" width="14" height="8" fill="#5a3a18" stroke="#2a1810" strokeWidth="0.4" />
            <rect x="28" y="78" width="18" height="10" fill="#6a4420" stroke="#2a1810" strokeWidth="0.4" />
            <rect x="48" y="80" width="16" height="8" fill="#5a3a18" stroke="#2a1810" strokeWidth="0.4" />
            <rect x="66" y="78" width="20" height="10" fill="#6a4420" stroke="#2a1810" strokeWidth="0.4" />
            {/* Flagpoles planted in barricade */}
            <line x1="32" y1="78" x2="32" y2="40" stroke="#2a1810" strokeWidth="1" />
            <line x1="72" y1="78" x2="72" y2="38" stroke="#2a1810" strokeWidth="1" />
            {/* Tricolor flags waving */}
            <path d="M 32 40 L 46 38 L 44 46 L 32 48 Z" fill="#1e3a8a" />
            <path d="M 32 48 L 44 50 L 42 58 L 32 56 Z" fill="#f5f5f5" />
            <path d="M 32 56 L 42 58 L 40 66 L 32 64 Z" fill="#dc2626" />
            <path d="M 72 38 L 86 40 L 84 48 L 72 46 Z" fill="#1e3a8a" />
            <path d="M 72 46 L 84 48 L 82 56 L 72 54 Z" fill="#f5f5f5" />
            <path d="M 72 54 L 82 56 L 80 64 L 72 62 Z" fill="#dc2626" />
            {/* Revolutionary silhouettes */}
            {/* Person 1 - raising fist */}
            <circle cx="22" cy="62" r="3.4" fill="#0a0a0a" />
            <path d="M 18 66 L 26 66 L 28 86 L 16 86 Z" fill="#0a0a0a" />
            <rect x="20.5" y="48" width="3" height="18" fill="#0a0a0a" />
            <circle cx="22" cy="46" r="2.2" fill="#0a0a0a" />
            {/* Person 2 - holding torch */}
            <circle cx="50" cy="60" r="3.4" fill="#0a0a0a" />
            <path d="M 46 64 L 54 64 L 56 86 L 44 86 Z" fill="#0a0a0a" />
            <line x1="50" y1="58" x2="50" y2="40" stroke="#0a0a0a" strokeWidth="1.6" />
            <path d="M 46 40 Q 50 28 54 40 Q 50 34 46 40 Z" fill="#fbbf24" />
            <path d="M 48 38 Q 50 30 52 38 Z" fill="#fef3c7" />
            {/* Person 3 - cap raised */}
            <circle cx="78" cy="62" r="3.4" fill="#0a0a0a" />
            <path d="M 74 66 L 82 66 L 84 86 L 72 86 Z" fill="#0a0a0a" />
            <line x1="78" y1="58" x2="84" y2="46" stroke="#0a0a0a" strokeWidth="1.4" />
            <path d="M 82 42 L 90 44 L 88 50 L 80 48 Z" fill="#dc2626" />
            {/* "1848" caption in smoke */}
            <text x="50" y="18" fontSize="8" textAnchor="middle" fill="#fde68a" fontWeight="bold" fontStyle="italic" opacity="0.7">1848</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={83} y={86} accent={accent} selected={selectedPart === "revolutions-1848"} onClick={() => onSelectPart("revolutions-1848")} preview={preview} />

        {/* ───────── Top-left medallion: Napoleon's Code ───────── */}
        <Hotspot
          id="napoleon-code"
          selected={selectedPart === "napoleon-code"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "6%", top: "3%", width: "14%", height: "13%" }}
          label="Napoleonic Code"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="napBg" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#5a3218" />
                <stop offset="100%" stopColor="#1a0a08" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#napBg)" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
            {/* Bicorne hat */}
            <path d="M 22 38 Q 50 26 78 38 L 72 46 L 28 46 Z" fill="#0a0a0a" stroke="#fbbf24" strokeWidth="0.4" />
            {/* Head */}
            <circle cx="50" cy="52" r="8" fill="#d4a574" />
            {/* Coat with high collar */}
            <path d="M 34 60 L 66 60 L 72 84 L 28 84 Z" fill="#1a4a3a" stroke="#fbbf24" strokeWidth="0.4" />
            <path d="M 44 60 L 50 70 L 56 60 Z" fill="#f5f5f5" />
            {/* Hand-in-waistcoat */}
            <line x1="44" y1="64" x2="42" y2="74" stroke="#0a0a0a" strokeWidth="0.6" />
            {/* 1804 badge */}
            <circle cx="76" cy="24" r="9" fill="#fbbf24" stroke="#7a5a08" strokeWidth="0.8" />
            <text x="76" y="27" fontSize="6" textAnchor="middle" fill="#1a0a08" fontWeight="bold">1804</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={20} y={15} accent={accent} selected={selectedPart === "napoleon-code"} onClick={() => onSelectPart("napoleon-code")} preview={preview} />

        {/* ───────── Top-right medallion: Romanticism ───────── */}
        <Hotspot
          id="romanticism"
          selected={selectedPart === "romanticism"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "80%", top: "3%", width: "14%", height: "13%" }}
          label="Romanticism"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="romBg" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#5a3218" />
                <stop offset="100%" stopColor="#1a0a08" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#romBg)" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.6" />
            {/* Lyre */}
            <path d="M 36 30 Q 50 18 64 30 L 60 36 Q 50 28 40 36 Z" fill="#fbbf24" stroke="#7a5a08" strokeWidth="0.4" />
            <line x1="42" y1="36" x2="42" y2="58" stroke="#7a5a08" strokeWidth="0.5" />
            <line x1="46" y1="36" x2="46" y2="58" stroke="#7a5a08" strokeWidth="0.5" />
            <line x1="50" y1="36" x2="50" y2="58" stroke="#7a5a08" strokeWidth="0.5" />
            <line x1="54" y1="36" x2="54" y2="58" stroke="#7a5a08" strokeWidth="0.5" />
            <line x1="58" y1="36" x2="58" y2="58" stroke="#7a5a08" strokeWidth="0.5" />
            <ellipse cx="50" cy="60" rx="14" ry="3.5" fill="#92400e" stroke="#7a5a08" strokeWidth="0.4" />
            {/* Open book below */}
            <path d="M 28 70 L 50 66 L 72 70 L 72 82 L 50 78 L 28 82 Z" fill="#f5e8c8" stroke="#7a5a30" strokeWidth="0.5" />
            <line x1="50" y1="66" x2="50" y2="78" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Folk-song notes */}
            <circle cx="22" cy="40" r="1.8" fill="#fbbf24" />
            <line x1="23.8" y1="40" x2="23.8" y2="32" stroke="#fbbf24" strokeWidth="0.5" />
            <circle cx="78" cy="38" r="1.8" fill="#fbbf24" />
            <line x1="79.8" y1="38" x2="79.8" y2="30" stroke="#fbbf24" strokeWidth="0.5" />
          </svg>
        </Hotspot>
        <Tag n={5} x={80} y={15} accent={accent} selected={selectedPart === "romanticism"} onClick={() => onSelectPart("romanticism")} preview={preview} />

        <Plaque title="The Rise of Nationalism in Europe · 1789–1871" caption="Allegory · Unification Map · 1848 Revolutions · Napoleonic Code · Romanticism" accent={accent} />
      </PaintingFrame>
    </div>
  );
}

export const HistNationalismEuropeExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "hist-nationalism-europe",
  chapterId: 1,
  track: "ssc",
  title: "Rise of Nationalism in Europe",
  subtitle: "SSC History Ch 1 · 1789–1871",
  description:
    "A triptych depicting the rise of nationalism in Europe — from revolutionary allegories and the unification of Italy and Germany to the 1848 revolts. Click each figure, map, and medallion to learn how the modern nation-state was forged.",
  accent: "#fb923c",
  icon: "🏛️",
  parts: [
    {
      id: "allegory",
      name: "Marianne & Germania",
      info:
        "Female allegories personified the nation. Marianne (France) wore the red Phrygian cap of liberty and the tricolor; Germania wore a crown of oak leaves and held a sword. They gave the abstract idea of the nation a concrete, emotional image that united citizens.",
    },
    {
      id: "unification-map",
      name: "Unification of Italy & Germany",
      info:
        "Italy was unified in 1861 under King Victor Emmanuel II of Sardinia-Piedmont, guided by Chief Minister Cavour and the revolutionary Garibaldi. Germany was unified in 1871 under Kaiser Wilhelm I, engineered by Otto von Bismarck through 'blood and iron' — three wars against Denmark, Austria, and France.",
    },
    {
      id: "revolutions-1848",
      name: "The 1848 Revolutions",
      info:
        "The 'Springtime of Peoples' — liberals and nationalists across France, Germany, Italy, and the Austrian Empire rose up demanding constitutions, parliaments, and nation-states. Though most revolts were crushed, they forced monarchs to concede constitutions and set the agenda for later unification.",
    },
    {
      id: "napoleon-code",
      name: "Napoleonic Code (1804)",
      info:
        "Napoleon's Civil Code of 1804 swept away feudal privileges, established equality before the law, secured property rights, and standardized administration across conquered Europe. It spread revolutionary ideals even as Napoleon's empire fell, becoming a model for legal reform worldwide.",
    },
    {
      id: "romanticism",
      name: "Romanticism",
      info:
        "A cultural movement that emphasized emotion, folklore, and national identity over cold Enlightenment reason. Herder collected folk songs; the Grimm brothers recorded fairy tales. Romanticism celebrated vernacular languages and local traditions, fueling nationalist feeling across Europe.",
    },
  ],
  Panel: HistNationalismEuropePanel,
};
