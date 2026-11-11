"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#f97316";

// Chapter 2 — Nationalism in India.
// A painted diorama of the freedom struggle: Dandi March centre-hero,
// Non-Cooperation top-left, Rowlatt/Jallianwala top-right, Civil Disobedience bottom,
// plus a "Quit India 1942" star medallion.
function HistNationalismIndiaPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        {/* Sky + earth backdrop */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, #1a1230 0%, #3a2050 30%, #6b3a18 60%, #2a1808 100%)",
        }} />
        {/* Sun glow */}
        <div style={{
          position: "absolute", left: "50%", top: "30%", transform: "translate(-50%,-50%)",
          width: "40%", height: "40%", borderRadius: "50%",
          background: "radial-gradient(circle, #fbbf2488 0%, transparent 70%)", filter: "blur(4px)",
        }} />

        {/* ───────── TOP-LEFT: Non-Cooperation Movement ───────── */}
        <Hotspot
          id="non-cooperation"
          selected={selectedPart === "non-cooperation"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "5%", top: "5%", width: "26%", height: "30%" }}
          label="Non-Cooperation"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="ncGlow" cx="50%" cy="60%" r="60%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100" height="60" fill="url(#ncGlow)" />
            {/* Spinning wheel (charkha) */}
            <ellipse cx="50" cy="32" rx="26" ry="4" fill="#92400e" />
            <ellipse cx="50" cy="32" rx="26" ry="4" fill="none" stroke="#fde68a" strokeWidth="0.5" />
            {/* Wheel rim */}
            <circle cx="50" cy="32" r="10" fill="none" stroke="#fde68a" strokeWidth="0.8" />
            <circle cx="50" cy="32" r="1.5" fill="#fde68a" />
            {/* Spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line
                  key={i}
                  x1={50 + Math.cos(a) * 1.5}
                  y1={32 + Math.sin(a) * 1.5}
                  x2={50 + Math.cos(a) * 10}
                  y2={32 + Math.sin(a) * 10}
                  stroke="#fde68a"
                  strokeWidth="0.3"
                />
              );
            })}
            {/* Stand legs */}
            <line x1="34" y1="34" x2="30" y2="50" stroke="#5a2a08" strokeWidth="1.4" />
            <line x1="66" y1="34" x2="70" y2="50" stroke="#5a2a08" strokeWidth="1.4" />
            {/* Burning foreign-cloth bonfire beside charkha */}
            <path d="M 12 48 Q 14 36 18 34 Q 20 38 22 36 Q 24 42 22 48 Z" fill="#dc2626" />
            <path d="M 14 48 Q 15 40 18 38 Q 20 42 21 40 Q 22 44 20 48 Z" fill="#fbbf24" />
            <path d="M 16 48 Q 17 42 18 40 Q 19 44 19 48 Z" fill="#fef3c7" />
            {/* Smoke */}
            <path d="M 18 34 Q 16 30 18 26 Q 20 28 19 22" stroke="#9ca3af" strokeWidth="0.5" fill="none" opacity="0.7" />
            {/* "1920" caption */}
            <text x="80" y="14" fontSize="5" fill="#fde68a" fontWeight="bold" fontStyle="italic">1920</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={18} y={36} accent={accent} selected={selectedPart === "non-cooperation"} onClick={() => onSelectPart("non-cooperation")} preview={preview} />

        {/* ───────── TOP-RIGHT: Rowlatt / Jallianwala Bagh ───────── */}
        <Hotspot
          id="rowlatt-jallianwala"
          selected={selectedPart === "rowlatt-jallianwala"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "69%", top: "5%", width: "26%", height: "30%" }}
          label="Jallianwala Bagh"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="jbSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a1818" />
                <stop offset="100%" stopColor="#1a0808" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="60" fill="url(#jbSky)" />
            {/* Walled enclosure (the Bagh) */}
            <rect x="10" y="20" width="80" height="32" fill="#3a2010" stroke="#7a5a30" strokeWidth="0.6" />
            {/* Brick courses */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="10" y1={26 + i * 5} x2="90" y2={26 + i * 5} stroke="#5a3a18" strokeWidth="0.3" />
            ))}
            {/* Narrow entrance (left gap) */}
            <rect x="10" y="40" width="8" height="12" fill="#1a0808" />
            {/* Memorial flame in centre */}
            <ellipse cx="50" cy="48" rx="14" ry="3" fill="#1a0808" />
            <path d="M 50 48 Q 46 36 50 28 Q 54 36 50 48 Z" fill="#dc2626" />
            <path d="M 50 48 Q 48 38 50 32 Q 52 38 50 48 Z" fill="#fbbf24" />
            <path d="M 50 48 Q 49 42 50 36 Q 51 42 50 48 Z" fill="#fef3c7" />
            {/* Memorial obelisk */}
            <rect x="48" y="14" width="4" height="20" fill="#92400e" stroke="#fbbf24" strokeWidth="0.3" />
            <polygon points="48,14 52,14 50,10" fill="#fbbf24" />
            {/* Bullet scars on wall */}
            <circle cx="22" cy="28" r="0.8" fill="#0a0a0a" />
            <circle cx="32" cy="32" r="0.8" fill="#0a0a0a" />
            <circle cx="68" cy="30" r="0.8" fill="#0a0a0a" />
            <circle cx="78" cy="34" r="0.8" fill="#0a0a0a" />
            <circle cx="58" cy="26" r="0.8" fill="#0a0a0a" />
            {/* "13 Apr 1919" caption */}
            <text x="50" y="58" fontSize="3.4" textAnchor="middle" fill="#fde68a" fontWeight="bold">13 APR 1919</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={82} y={36} accent={accent} selected={selectedPart === "rowlatt-jallianwala"} onClick={() => onSelectPart("rowlatt-jallianwala")} preview={preview} />

        {/* ───────── CENTER HERO: Dandi March ───────── */}
        <Hotspot
          id="dandi-march"
          selected={selectedPart === "dandi-march"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "18%", top: "38%", width: "64%", height: "44%" }}
          label="Dandi March 1930"
        >
          <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="dandiSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="dandiSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c4a6e" />
                <stop offset="100%" stopColor="#0e2a4a" />
              </linearGradient>
              <linearGradient id="dandiSand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Sky */}
            <rect x="0" y="0" width="200" height="55" fill="url(#dandiSky)" />
            {/* Sun */}
            <circle cx="160" cy="20" r="9" fill="#fbbf24" opacity="0.9" />
            <circle cx="160" cy="20" r="14" fill="#fbbf24" opacity="0.25" />
            {/* Sea */}
            <rect x="0" y="40" width="200" height="22" fill="url(#dandiSea)" />
            {/* Wave crests */}
            <path d="M 0 44 Q 20 42 40 44 T 80 44 T 120 44 T 160 44 T 200 44" stroke="#7dd3fc" strokeWidth="0.4" fill="none" opacity="0.6" />
            <path d="M 0 50 Q 20 48 40 50 T 80 50 T 120 50 T 160 50 T 200 50" stroke="#7dd3fc" strokeWidth="0.4" fill="none" opacity="0.4" />
            {/* Sand path */}
            <path d="M 0 60 Q 40 64 100 62 Q 160 60 200 64 L 200 100 L 0 100 Z" fill="url(#dandiSand)" />
            {/* Coastline curve */}
            <path d="M 0 62 Q 40 66 100 64 Q 160 62 200 66" stroke="#fef3c7" strokeWidth="0.6" fill="none" opacity="0.6" />

            {/* Gandhi leading with staff — front of the line */}
            <g transform="translate(36 50)">
              {/* Loincloth silhouette */}
              <circle cx="0" cy="0" r="3" fill="#1a0a08" />
              <path d="M -3 2 L 3 2 L 4 16 L -4 16 Z" fill="#1a0a08" />
              {/* Walking legs */}
              <line x1="-1" y1="16" x2="-3" y2="24" stroke="#1a0a08" strokeWidth="1.4" />
              <line x1="1" y1="16" x2="3" y2="24" stroke="#1a0a08" strokeWidth="1.4" />
              {/* Staff */}
              <line x1="5" y1="-2" x2="9" y2="22" stroke="#5a2a08" strokeWidth="1" />
              {/* Shawl hint */}
              <path d="M -3 4 L 3 4 L 4 8 L -4 8 Z" fill="#3a2010" />
            </g>

            {/* Followers — line of marchers */}
            {[58, 78, 98, 118, 138, 158, 178].map((x, i) => (
              <g key={i} transform={`translate(${x} ${52 + (i % 2) * 2})`}>
                <circle cx="0" cy="0" r="2.4" fill="#1a0a08" />
                <path d="M -2 2 L 2 2 L 3 14 L -3 14 Z" fill="#1a0a08" />
                <line x1="-1" y1="14" x2="-2" y2="22" stroke="#1a0a08" strokeWidth="1" />
                <line x1="1" y1="14" x2="2" y2="22" stroke="#1a0a08" strokeWidth="1" />
              </g>
            ))}

            {/* Salt mounds ahead at coast */}
            <ellipse cx="180" cy="50" rx="10" ry="2" fill="#fef3c7" />
            <ellipse cx="186" cy="48" rx="6" ry="1.6" fill="#ffffff" opacity="0.8" />

            {/* Path footprints */}
            {[20, 28, 36, 44, 52, 60].map((x, i) => (
              <ellipse key={i} cx={x} cy={72 + (i % 2) * 2} rx="1.2" ry="0.6" fill="#5a2a08" opacity="0.5" />
            ))}

            {/* Caption ribbon */}
            <rect x="60" y="86" width="80" height="10" fill="#1a0808" stroke="#fbbf24" strokeWidth="0.4" rx="2" />
            <text x="100" y="93" fontSize="5" textAnchor="middle" fill="#fbbf24" fontWeight="bold" fontStyle="italic">DANDI · 240 mi · 1930</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={50} y={40} accent={accent} selected={selectedPart === "dandi-march"} onClick={() => onSelectPart("dandi-march")} preview={preview} />

        {/* ───────── BOTTOM-LEFT: Civil Disobedience (tricolor raised) ───────── */}
        <Hotspot
          id="civil-disobedience"
          selected={selectedPart === "civil-disobedience"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "6%", top: "82%", width: "26%", height: "14%" }}
          label="Civil Disobedience"
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            {/* Ground */}
            <rect x="0" y="40" width="100" height="10" fill="#2a1810" />
            {/* Flagpole */}
            <line x1="50" y1="40" x2="50" y2="4" stroke="#3a2010" strokeWidth="1.6" />
            {/* Tricolor hoisted — saffron / white / green with chakra */}
            <rect x="50" y="4" width="34" height="10" fill="#fb923c" />
            <rect x="50" y="14" width="34" height="10" fill="#f5f5f5" />
            <rect x="50" y="24" width="34" height="10" fill="#15803d" />
            {/* Ashoka chakra */}
            <circle cx="67" cy="19" r="3.5" fill="none" stroke="#1e3a8a" strokeWidth="0.5" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line key={i} x1={67} y1={19} x2={67 + Math.cos(a) * 3.5} y2={19 + Math.sin(a) * 3.5} stroke="#1e3a8a" strokeWidth="0.3" />
              );
            })}
            {/* Crowd silhouette at base */}
            <circle cx="14" cy="34" r="2" fill="#0a0a0a" />
            <rect x="12" y="36" width="4" height="6" fill="#0a0a0a" />
            <circle cx="22" cy="34" r="2" fill="#0a0a0a" />
            <rect x="20" y="36" width="4" height="6" fill="#0a0a0a" />
            <circle cx="30" cy="34" r="2" fill="#0a0a0a" />
            <rect x="28" y="36" width="4" height="6" fill="#0a0a0a" />
            <circle cx="38" cy="34" r="2" fill="#0a0a0a" />
            <rect x="36" y="36" width="4" height="6" fill="#0a0a0a" />
          </svg>
        </Hotspot>
        <Tag n={4} x={19} y={82} accent={accent} selected={selectedPart === "civil-disobedience"} onClick={() => onSelectPart("civil-disobedience")} preview={preview} />

        {/* ───────── BOTTOM-RIGHT: Quit India 1942 star medallion ───────── */}
        <Hotspot
          id="quit-india"
          selected={selectedPart === "quit-india"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "68%", top: "82%", width: "26%", height: "14%" }}
          label="Quit India 1942"
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="40" width="100" height="10" fill="#2a1810" />
            {/* Medallion */}
            <circle cx="30" cy="22" r="18" fill="#1a0808" stroke="#fbbf24" strokeWidth="1.4" />
            {/* Star */}
            <polygon
              points="30,8 33,18 44,18 35,25 38,36 30,29 22,36 25,25 16,18 27,18"
              fill="#fbbf24"
              stroke="#92400e"
              strokeWidth="0.4"
            />
            {/* "1942" + slogan */}
            <text x="60" y="16" fontSize="6" fill="#fbbf24" fontWeight="bold">1942</text>
            <text x="60" y="26" fontSize="4.4" fill="#fde68a" fontStyle="italic">"Do or Die"</text>
            {/* Masses silhouette */}
            <circle cx="62" cy="36" r="1.6" fill="#0a0a0a" />
            <rect x="60.5" y="37" width="3" height="4" fill="#0a0a0a" />
            <circle cx="70" cy="36" r="1.6" fill="#0a0a0a" />
            <rect x="68.5" y="37" width="3" height="4" fill="#0a0a0a" />
            <circle cx="78" cy="36" r="1.6" fill="#0a0a0a" />
            <rect x="76.5" y="37" width="3" height="4" fill="#0a0a0a" />
            <circle cx="86" cy="36" r="1.6" fill="#0a0a0a" />
            <rect x="84.5" y="37" width="3" height="4" fill="#0a0a0a" />
            {/* Raised fist */}
            <rect x="92" y="28" width="3" height="8" fill="#0a0a0a" />
            <circle cx="93.5" cy="27" r="2" fill="#0a0a0a" />
          </svg>
        </Hotspot>
        <Tag n={5} x={81} y={82} accent={accent} selected={selectedPart === "quit-india"} onClick={() => onSelectPart("quit-india")} preview={preview} />

        <Plaque title="Nationalism in India · 1919–1942" caption="Dandi · Non-Cooperation · Jallianwala · Civil Disobedience · Quit India" accent={accent} />
      </PaintingFrame>
    </div>
  );
}

export const HistNationalismIndiaExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "hist-nationalism-india",
  chapterId: 2,
  track: "ssc",
  title: "Nationalism in India",
  subtitle: "SSC History Ch 2 · 1919–1942",
  description:
    "A diorama of the Indian freedom struggle — from Gandhi's 1930 Dandi March to the 1942 Quit India call. Click each scene to trace how non-violent mass mobilisation shook the British Raj.",
  accent: "#f97316",
  icon: "🇮🇳",
  parts: [
    {
      id: "dandi-march",
      name: "Dandi Salt March (1930)",
      info:
        "On 12 March 1930 Gandhi set out from Sabarmati Ashram with 78 companions on a 240-mile march to the Arabian Sea at Dandi. On 6 April he picked up a handful of natural salt, breaking the British salt monopoly and launching the Civil Disobedience movement.",
    },
    {
      id: "non-cooperation",
      name: "Non-Cooperation Movement (1920–22)",
      info:
        "Launched by Gandhi in 1920, it called for the boycott of British schools, courts, councils, goods and titles, and the spinning of khadi. It drew millions into nationalism for the first time. Gandhi called it off in February 1922 after the violent mob burning of the police station at Chauri Chaura.",
    },
    {
      id: "rowlatt-jallianwala",
      name: "Rowlatt Act & Jallianwala Bagh (1919)",
      info:
        "The 1919 Rowlatt Act allowed detention without trial. On 13 April 1919, General Reginald Dyer ordered troops to fire on a peaceful crowd at Jallianwala Bagh in Amritsar, killing hundreds. The massacre turned millions of Indians from loyal subjects into determined nationalists.",
    },
    {
      id: "civil-disobedience",
      name: "Civil Disobedience Movement (1930–34)",
      info:
        "Following the Salt March, millions broke colonial laws — making salt, boycotting cloth, refusing taxes. The Gandhi–Irwin Pact of March 1931 paused the movement; it resumed in 1932 and shaped the second Round Table Conference. It was the first truly mass satyagraha.",
    },
    {
      id: "quit-india",
      name: "Quit India Movement (1942)",
      info:
        "On 8 August 1942 the Bombay session of the Congress passed the 'Quit India' resolution. Gandhi's slogan was 'Karenge ya marenge' — Do or Die. With leaders arrested, mass uprisings erupted across India, signalling that British rule could not survive the war's end.",
    },
  ],
  Panel: HistNationalismIndiaPanel,
};
