"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#a16207";

// Chapter 4 — Print Culture and the Modern World.
// A three-pane painting: LEFT Gutenberg press · CENTER manuscript scribe · RIGHT newspaper press,
// with corner medallions for East Asian woodblock and print in India (Bengal Gazette 1780).
function HistPrintCulturePanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        {/* Monastery / candlelit backdrop */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, #2a1a08 0%, #3a2410 35%, #4a2a14 65%, #1a1008 100%)",
        }} />
        {/* Candle-light speckle */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.22,
          backgroundImage:
            "radial-gradient(circle at 20% 25%, #fde68a 1px, transparent 1px), radial-gradient(circle at 75% 55%, #fbbf24 1px, transparent 1px)",
          backgroundSize: "80px 80px, 110px 110px",
        }} />
        {/* Dividers */}
        <div style={{ position: "absolute", left: "33.2%", top: "16%", bottom: "16%", width: 2, background: `linear-gradient(180deg, ${accent}, #3a2010, ${accent})`, opacity: 0.75 }} />
        <div style={{ position: "absolute", left: "66.4%", top: "16%", bottom: "16%", width: 2, background: `linear-gradient(180deg, ${accent}, #3a2010, ${accent})`, opacity: 0.75 }} />

        {/* ───────── LEFT: Gutenberg Press (1440s) ───────── */}
        <Hotspot
          id="gutenberg-press"
          selected={selectedPart === "gutenberg-press"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "4%", top: "18%", width: "27%", height: "64%" }}
          label="Gutenberg Press"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="gpGlow" cx="50%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gpWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7a4a18" />
                <stop offset="100%" stopColor="#3a2010" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#gpGlow)" />
            {/* Stone floor */}
            <rect x="0" y="100" width="100" height="20" fill="#1a1008" />
            <line x1="20" y1="100" x2="20" y2="120" stroke="#3a2010" strokeWidth="0.4" />
            <line x1="50" y1="100" x2="50" y2="120" stroke="#3a2010" strokeWidth="0.4" />
            <line x1="80" y1="100" x2="80" y2="120" stroke="#3a2010" strokeWidth="0.4" />

            {/* Press frame — two vertical posts */}
            <rect x="20" y="20" width="6" height="78" fill="url(#gpWood)" stroke="#2a1810" strokeWidth="0.4" />
            <rect x="74" y="20" width="6" height="78" fill="url(#gpWood)" stroke="#2a1810" strokeWidth="0.4" />
            {/* Top crossbeam */}
            <rect x="18" y="18" width="64" height="8" fill="url(#gpWood)" stroke="#2a1810" strokeWidth="0.4" />
            {/* Central screw + handle */}
            <line x1="50" y1="26" x2="50" y2="56" stroke="#9ca3af" strokeWidth="2.2" />
            {/* Handle bar */}
            <line x1="38" y1="40" x2="62" y2="40" stroke="#5a2a08" strokeWidth="2.4" />
            <circle cx="38" cy="40" r="2" fill="#5a2a08" />
            <circle cx="62" cy="40" r="2" fill="#5a2a08" />
            {/* Platen (the pressing plate) */}
            <rect x="28" y="54" width="44" height="6" fill="#9ca3af" stroke="#3a2010" strokeWidth="0.4" />

            {/* Type bed / paper being pressed */}
            <rect x="24" y="66" width="52" height="14" fill="#5a3a18" stroke="#2a1810" strokeWidth="0.4" />
            <rect x="28" y="68" width="44" height="10" fill="#fde68a" />
            {/* Tiny type lines on paper */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="30" y1={71 + i * 1.6} x2="70" y2={71 + i * 1.6} stroke="#3a2010" strokeWidth="0.3" />
            ))}

            {/* A book emerging below */}
            <path d="M 30 86 L 70 86 L 72 96 L 28 96 Z" fill="#7a2a08" stroke="#fbbf24" strokeWidth="0.5" />
            <path d="M 32 86 L 50 84 L 68 86 L 68 94 L 50 92 L 32 94 Z" fill="#fde68a" stroke="#5a2a08" strokeWidth="0.4" />
            <line x1="50" y1="84" x2="50" y2="92" stroke="#5a2a08" strokeWidth="0.4" />

            {/* Hanging leaf with date */}
            <line x1="50" y1="8" x2="50" y2="14" stroke="#5a2a08" strokeWidth="0.5" />
            <rect x="40" y="6" width="20" height="9" fill="#fde68a" stroke="#7a5a08" strokeWidth="0.4" />
            <text x="50" y="13" fontSize="4.5" textAnchor="middle" fill="#3a1a08" fontWeight="bold">1440</text>
            <text x="50" y="116" fontSize="3.4" textAnchor="middle" fill="#fde68a" fontStyle="italic">GUTENBERG · MAINZ</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={17} y={86} accent={accent} selected={selectedPart === "gutenberg-press"} onClick={() => onSelectPart("gutenberg-press")} preview={preview} />

        {/* ───────── CENTER: Hand-written Manuscript ───────── */}
        <Hotspot
          id="manuscript"
          selected={selectedPart === "manuscript"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "36%", top: "18%", width: "28%", height: "64%" }}
          label="Manuscript"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="msGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#msGlow)" />
            {/* Stone arch background */}
            <path d="M 10 110 L 10 50 Q 10 14 50 14 Q 90 14 90 50 L 90 110 Z" fill="#2a1810" stroke="#5a3a18" strokeWidth="0.6" />
            <path d="M 14 110 L 14 52 Q 14 18 50 18 Q 86 18 86 52 L 86 110 Z" fill="#1a1008" />

            {/* Candle on left ledge */}
            <rect x="20" y="60" width="3" height="2" fill="#3a2010" />
            <rect x="20" y="48" width="3" height="12" fill="#fde68a" />
            <path d="M 21.5 48 Q 21 44 21.5 40 Q 22 44 21.5 48 Z" fill="#fbbf24" />
            <path d="M 21.5 46 Q 21 43 21.5 41 Q 22 43 21.5 46 Z" fill="#fef3c7" />

            {/* Desk */}
            <rect x="22" y="84" width="56" height="4" fill="#5a3a18" />
            <rect x="26" y="88" width="3" height="20" fill="#5a3a18" />
            <rect x="71" y="88" width="3" height="20" fill="#5a3a18" />

            {/* Monk-scribe silhouette (hooded) */}
            {/* Hood */}
            <path d="M 40 36 Q 50 30 60 36 L 62 56 Q 60 60 50 60 Q 40 60 38 56 Z" fill="#1a0808" />
            {/* Face shadow */}
            <ellipse cx="50" cy="46" rx="5" ry="6" fill="#3a2010" />
            {/* Robe shoulders */}
            <path d="M 32 58 L 68 58 L 76 86 L 24 86 Z" fill="#1a0808" />
            {/* Arms reaching toward desk */}
            <path d="M 36 64 L 44 80 L 40 82 L 32 66 Z" fill="#1a0808" />
            <path d="M 64 64 L 56 80 L 60 82 L 68 66 Z" fill="#1a0808" />

            {/* Open manuscript on desk */}
            <path d="M 28 78 L 50 74 L 72 78 L 72 88 L 50 84 L 28 88 Z" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.5" />
            <line x1="50" y1="74" x2="50" y2="84" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Illuminated capital letter */}
            <rect x="32" y="78" width="5" height="6" fill="#dc2626" />
            <text x="34.5" y="83" fontSize="4" textAnchor="middle" fill="#fde68a" fontWeight="bold">I</text>
            {/* Text lines */}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`l${i}`} x1="40" y1={79 + i * 1.6} x2="48" y2={79 + i * 1.6} stroke="#5a2a08" strokeWidth="0.25" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`r${i}`} x1="52" y1={79 + i * 1.6} x2="68" y2={79 + i * 1.6} stroke="#5a2a08" strokeWidth="0.25" />
            ))}

            {/* Quill in right hand */}
            <line x1="60" y1="80" x2="68" y2="68" stroke="#fde68a" strokeWidth="0.8" />
            <path d="M 68 68 L 70 64 L 66 66 Z" fill="#fde68a" />
            {/* Inkwell */}
            <rect x="74" y="80" width="6" height="4" fill="#0a0a0a" stroke="#5a3a18" strokeWidth="0.3" />

            {/* Caption */}
            <text x="50" y="116" fontSize="3.4" textAnchor="middle" fill="#fde68a" fontStyle="italic">SCRIPTORIUM · HAND-COPIED</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={50} y={86} accent={accent} selected={selectedPart === "manuscript"} onClick={() => onSelectPart("manuscript")} preview={preview} />

        {/* ───────── RIGHT: Newspaper / Mass Print ───────── */}
        <Hotspot
          id="newspaper"
          selected={selectedPart === "newspaper"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "69%", top: "18%", width: "27%", height: "64%" }}
          label="Newspaper"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="npSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a2410" />
                <stop offset="100%" stopColor="#1a1008" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#npSky)" />

            {/* Floor */}
            <rect x="0" y="100" width="100" height="20" fill="#1a1008" />

            {/* Printing machine body */}
            <rect x="16" y="40" width="68" height="44" fill="#3a2010" stroke="#7a5a30" strokeWidth="0.6" />
            <rect x="20" y="44" width="60" height="36" fill="#5a3a18" />
            {/* Top drum / roller */}
            <circle cx="34" cy="34" r="8" fill="#9ca3af" stroke="#2a1810" strokeWidth="0.5" />
            <circle cx="66" cy="34" r="8" fill="#9ca3af" stroke="#2a1810" strokeWidth="0.5" />
            {/* Drive belt */}
            <path d="M 34 26 L 66 26" stroke="#2a1810" strokeWidth="0.6" />
            <path d="M 34 42 L 66 42" stroke="#2a1810" strokeWidth="0.6" />
            {/* Gear hint */}
            <circle cx="50" cy="58" r="6" fill="#9ca3af" stroke="#2a1810" strokeWidth="0.4" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line key={i} x1={50 + Math.cos(a) * 6} y1={58 + Math.sin(a) * 6} x2={50 + Math.cos(a) * 8} y2={58 + Math.sin(a) * 8} stroke="#9ca3af" strokeWidth="1" />
              );
            })}
            <circle cx="50" cy="58" r="1.5" fill="#2a1810" />
            {/* Output slot */}
            <rect x="22" y="76" width="56" height="4" fill="#1a0808" />

            {/* Stacked newspapers emerging */}
            <g transform="translate(28 82)">
              <rect x="0" y="0" width="44" height="6" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.3" />
              <rect x="0" y="6" width="44" height="6" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.3" />
              <rect x="0" y="12" width="44" height="6" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.3" />
              {/* Headlines */}
              <rect x="2" y="1.5" width="20" height="1.2" fill="#3a1a08" />
              <rect x="2" y="3.5" width="16" height="0.8" fill="#5a2a08" />
              <rect x="2" y="7.5" width="22" height="1.2" fill="#3a1a08" />
              <rect x="2" y="9.5" width="18" height="0.8" fill="#5a2a08" />
              <rect x="2" y="13.5" width="20" height="1.2" fill="#3a1a08" />
              <rect x="2" y="15.5" width="14" height="0.8" fill="#5a2a08" />
            </g>

            {/* Flying newspapers circulating */}
            <g transform="translate(14 18) rotate(-18)">
              <rect x="0" y="0" width="14" height="10" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.3" />
              <rect x="1.5" y="2" width="8" height="0.8" fill="#3a1a08" />
              <rect x="1.5" y="4" width="10" height="0.6" fill="#5a2a08" />
              <rect x="1.5" y="6" width="7" height="0.6" fill="#5a2a08" />
            </g>
            <g transform="translate(76 14) rotate(15)">
              <rect x="0" y="0" width="14" height="10" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.3" />
              <rect x="1.5" y="2" width="8" height="0.8" fill="#3a1a08" />
              <rect x="1.5" y="4" width="10" height="0.6" fill="#5a2a08" />
              <rect x="1.5" y="6" width="6" height="0.6" fill="#5a2a08" />
            </g>

            <text x="50" y="116" fontSize="3.2" textAnchor="middle" fill="#fde68a" fontStyle="italic">MASS PRINT · PUBLIC OPINION</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={83} y={86} accent={accent} selected={selectedPart === "newspaper"} onClick={() => onSelectPart("newspaper")} preview={preview} />

        {/* ───────── Bottom-left medallion: East Asian Print ───────── */}
        <Hotspot
          id="east-asia"
          selected={selectedPart === "east-asia"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "6%", top: "84%", width: "20%", height: "12%" }}
          label="East Asia Print"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="50" width="100" height="10" fill="#2a1810" />
            {/* Woodblock */}
            <rect x="14" y="20" width="40" height="20" fill="#7a4a18" stroke="#3a2010" strokeWidth="0.6" />
            <rect x="18" y="24" width="32" height="12" fill="#5a2a08" />
            {/* Carved character marks */}
            <rect x="20" y="26" width="6" height="3" fill="#1a0808" />
            <rect x="28" y="26" width="6" height="3" fill="#1a0808" />
            <rect x="36" y="26" width="6" height="3" fill="#1a0808" />
            <rect x="44" y="26" width="4" height="3" fill="#1a0808" />
            <rect x="20" y="31" width="6" height="3" fill="#1a0808" />
            <rect x="28" y="31" width="6" height="3" fill="#1a0808" />
            <rect x="36" y="31" width="6" height="3" fill="#1a0808" />
            {/* Brush */}
            <line x1="58" y1="36" x2="78" y2="22" stroke="#5a2a08" strokeWidth="1.4" />
            <path d="M 78 22 L 84 18 L 82 24 Z" fill="#1a0808" />
            {/* China/Korea badges */}
            <circle cx="64" cy="44" r="6" fill="#fde68a" stroke="#7a5a08" strokeWidth="0.6" />
            <text x="64" y="46" fontSize="4" textAnchor="middle" fill="#3a1a08" fontWeight="bold">CN</text>
            <circle cx="84" cy="40" r="6" fill="#fde68a" stroke="#7a5a08" strokeWidth="0.6" />
            <text x="84" y="42" fontSize="4" textAnchor="middle" fill="#3a1a08" fontWeight="bold">KR</text>
            <text x="50" y="58" fontSize="2.6" textAnchor="middle" fill="#fde68a" fontStyle="italic">WOODBLOCK · MOVABLE TYPE</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={15} y={82} accent={accent} selected={selectedPart === "east-asia"} onClick={() => onSelectPart("east-asia")} preview={preview} />

        {/* ───────── Bottom-right medallion: Print in India (Bengal Gazette 1780) ───────── */}
        <Hotspot
          id="print-india"
          selected={selectedPart === "print-india"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "74%", top: "84%", width: "20%", height: "12%" }}
          label="Bengal Gazette 1780"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="50" width="100" height="10" fill="#2a1810" />
            {/* Folded newspaper */}
            <rect x="14" y="14" width="44" height="34" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.5" />
            {/* Masthead */}
            <rect x="18" y="18" width="36" height="6" fill="#7a2a08" />
            <text x="36" y="22.5" fontSize="3.2" textAnchor="middle" fill="#fde68a" fontWeight="bold">BENGAL GAZETTE</text>
            {/* Date line */}
            <text x="36" y="27" fontSize="2" textAnchor="middle" fill="#3a1a08" fontStyle="italic">1780 · HICKY</text>
            {/* Columns of text */}
            <rect x="18" y="30" width="14" height="0.6" fill="#3a1a08" />
            <rect x="18" y="32" width="14" height="0.6" fill="#5a2a08" />
            <rect x="18" y="34" width="12" height="0.6" fill="#5a2a08" />
            <rect x="18" y="36" width="14" height="0.6" fill="#5a2a08" />
            <rect x="18" y="38" width="10" height="0.6" fill="#5a2a08" />
            <rect x="34" y="30" width="14" height="0.6" fill="#3a1a08" />
            <rect x="34" y="32" width="14" height="0.6" fill="#5a2a08" />
            <rect x="34" y="34" width="12" height="0.6" fill="#5a2a08" />
            <rect x="34" y="36" width="14" height="0.6" fill="#5a2a08" />
            <rect x="34" y="38" width="10" height="0.6" fill="#5a2a08" />
            <rect x="18" y="42" width="32" height="3" fill="#dc2626" opacity="0.6" />
            {/* Censorship stamp */}
            <circle cx="76" cy="32" r="11" fill="none" stroke="#dc2626" strokeWidth="1.2" />
            <text x="76" y="34" fontSize="3.4" textAnchor="middle" fill="#dc2626" fontWeight="bold">1878</text>
            <text x="76" y="38" fontSize="2.2" textAnchor="middle" fill="#dc2626" fontStyle="italic">VERNACULAR</text>
            <text x="76" y="41" fontSize="2.2" textAnchor="middle" fill="#dc2626" fontStyle="italic">PRESS ACT</text>
            <text x="50" y="58" fontSize="2.6" textAnchor="middle" fill="#fde68a" fontStyle="italic">HICKY · VERNACULAR · NATIONALIST</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={84} y={82} accent={accent} selected={selectedPart === "print-india"} onClick={() => onSelectPart("print-india")} preview={preview} />

        <Plaque title="Print Culture and the Modern World" caption="Gutenberg · Manuscript · Newspaper · East Asia · Bengal Gazette" accent={accent} />
      </PaintingFrame>
    </div>
  );
}

export const HistPrintCultureExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "hist-print-culture",
  chapterId: 4,
  track: "ssc",
  title: "Print Culture and the Modern World",
  subtitle: "SSC History Ch 4 · Print Revolution",
  description:
    "A painting tracing print from medieval scriptoria to mass newspapers — via Gutenberg's press, East Asian woodblocks, and Hicky's Bengal Gazette. Click each scene to see how print reshaped religion, ideas, and politics.",
  accent: "#a16207",
  icon: "🖨️",
  parts: [
    {
      id: "gutenberg-press",
      name: "Gutenberg Press (1440s)",
      info:
        "Johannes Gutenberg of Mainz, Germany, invented the movable-type printing press in the 1440s and printed the Gutenberg Bible around 1455. For the first time, books could be produced cheaply and in large numbers, fuelling the Renaissance, the Reformation, and a dramatic rise in literacy across Europe.",
    },
    {
      id: "manuscript",
      name: "Hand-written Manuscripts",
      info:
        "Before print, books were copied by hand — often by monks in monastery scriptoria. Each copy took months to produce, was expensive, and was accessible only to elites. The fragility and scarcity of manuscripts kept knowledge tightly controlled by the Church and aristocracy.",
    },
    {
      id: "newspaper",
      name: "Newspapers & Mass Print",
      info:
        "Periodicals appeared in 17th-century Europe; daily newspapers spread in the 18th. Cheap print created a new 'public sphere' where ideas, criticism and debate circulated widely — shaping the Enlightenment and the French Revolution. By the 19th century, penny papers reached every literate household.",
    },
    {
      id: "east-asia",
      name: "East Asian Print",
      info:
        "China was printing with woodblocks by the 6th century CE — far earlier than Europe. Korea developed movable metal type in the early 13th century, predating Gutenberg by two centuries. The technology spread across East Asia, producing Buddhist texts, calendars and civil-service exam books long before the European print revolution.",
    },
    {
      id: "print-india",
      name: "Print in India",
      info:
        "The printing press arrived in India with Portuguese missionaries at Goa in the mid-16th century. James Augustus Hicky started the Bengal Gazette in 1780 — India's first English newspaper. Vernacular and nationalist papers flourished in the 19th century; the British responded with the Vernacular Press Act of 1878 to censor anti-colonial writing.",
    },
  ],
  Panel: HistPrintCulturePanel,
};
