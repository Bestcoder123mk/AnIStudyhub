"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#fbbf24";

// Chapter 3 — Making of a Global World.
// A three-panel mural: LEFT silk routes · CENTER Bretton Woods 1944 · RIGHT modern globalization,
// flanked by small icons for Columbian Exchange (food transfer) and triangular slave trade.
function HistGlobalWorldPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        {/* Aged-map sepia backdrop */}
        <div style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, #2a1f0a 0%, #3a2a14 40%, #4a3a1a 70%, #1a1408 100%)",
        }} />
        {/* Parchment speckle */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.16,
          backgroundImage:
            "radial-gradient(circle at 25% 35%, #fde68a 1px, transparent 1px), radial-gradient(circle at 75% 65%, #fbbf24 1px, transparent 1px)",
          backgroundSize: "70px 70px, 100px 100px",
        }} />
        {/* Vertical dividers */}
        <div style={{ position: "absolute", left: "33.2%", top: "16%", bottom: "16%", width: 2, background: `linear-gradient(180deg, ${accent}, #7a5a08, ${accent})`, opacity: 0.7 }} />
        <div style={{ position: "absolute", left: "66.4%", top: "16%", bottom: "16%", width: 2, background: `linear-gradient(180deg, ${accent}, #7a5a08, ${accent})`, opacity: 0.7 }} />

        {/* ───────── LEFT: Silk Routes ───────── */}
        <Hotspot
          id="silk-routes"
          selected={selectedPart === "silk-routes"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "4%", top: "18%", width: "27%", height: "64%" }}
          label="Silk Routes"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <pattern id="silkParch" patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill="#e8d5a8" />
                <circle cx="3" cy="3" r="0.35" fill="#a89060" />
              </pattern>
            </defs>
            <rect x="2" y="2" width="96" height="116" fill="url(#silkParch)" />
            <rect x="2" y="2" width="96" height="116" fill="none" stroke="#7a5a30" strokeWidth="1.4" />

            {/* Continents — East Asia right, Europe/Africa left */}
            {/* Europe/Africa */}
            <path d="M 4 30 Q 10 26 18 30 L 24 40 L 22 56 L 18 70 L 24 80 L 30 92 L 24 100 L 14 96 L 8 80 L 4 60 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.6" />
            {/* Arabian peninsula / Persia */}
            <path d="M 24 50 L 36 48 L 40 60 L 34 70 L 26 64 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.6" />
            {/* India */}
            <path d="M 40 60 L 48 60 L 50 76 L 44 78 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.6" />
            {/* Central / East Asia */}
            <path d="M 50 30 L 90 30 L 96 50 L 90 64 L 70 66 L 56 56 L 48 44 Z" fill="#c9a878" stroke="#7a5a30" strokeWidth="0.6" />
            {/* China coast detail */}
            <path d="M 80 40 L 90 42 L 88 54 L 82 52 Z" fill="#a89060" stroke="#7a5a30" strokeWidth="0.4" />

            {/* Dotted trade route — caravan trail */}
            <path d="M 14 48 Q 28 46 40 52 Q 52 56 64 50 Q 78 44 90 46" stroke="#b91c1c" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
            {/* Maritime spice route */}
            <path d="M 30 96 Q 50 108 70 100 Q 84 92 92 76" stroke="#1e3a8a" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />

            {/* Camel caravan silhouette */}
            <g transform="translate(40 64)">
              {/* Camel 1 */}
              <path d="M 0 6 Q 1 0 3 0 L 4 -2 L 5 0 Q 7 0 8 6 L 8 8 L 0 8 Z" fill="#5a2a08" />
              <line x1="1" y1="8" x2="1" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="3" y1="8" x2="3" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="6" y1="8" x2="6" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="8" y1="8" x2="8" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <circle cx="0" cy="2" r="1.2" fill="#5a2a08" />
            </g>
            <g transform="translate(48 64)">
              <path d="M 0 6 Q 1 0 3 0 L 4 -2 L 5 0 Q 7 0 8 6 L 8 8 L 0 8 Z" fill="#5a2a08" />
              <line x1="1" y1="8" x2="1" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="3" y1="8" x2="3" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="6" y1="8" x2="6" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <line x1="8" y1="8" x2="8" y2="13" stroke="#5a2a08" strokeWidth="0.8" />
              <circle cx="0" cy="2" r="1.2" fill="#5a2a08" />
            </g>
            {/* Sailing ship on maritime route */}
            <g transform="translate(60 96)">
              <path d="M -5 0 L 5 0 L 4 3 L -4 3 Z" fill="#5a2a08" />
              <line x1="0" y1="0" x2="0" y2="-7" stroke="#5a2a08" strokeWidth="0.6" />
              <path d="M 0 -7 L 4 -4 L 0 -3 Z" fill="#fde68a" stroke="#5a2a08" strokeWidth="0.3" />
            </g>

            {/* Labels */}
            <text x="14" y="28" fontSize="3" fill="#3a1a08" fontWeight="bold">EUR</text>
            <text x="44" y="56" fontSize="3" fill="#3a1a08" fontWeight="bold">IND</text>
            <text x="76" y="40" fontSize="3" fill="#3a1a08" fontWeight="bold">CHINA</text>
            <text x="2" y="114" fontSize="3.2" fill="#5a2a08" fontStyle="italic" fontWeight="bold">PRE-MODERN SILK ROUTES</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={17} y={86} accent={accent} selected={selectedPart === "silk-routes"} onClick={() => onSelectPart("silk-routes")} preview={preview} />

        {/* ───────── CENTER: Bretton Woods 1944 ───────── */}
        <Hotspot
          id="bretton-woods"
          selected={selectedPart === "bretton-woods"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "36%", top: "18%", width: "28%", height: "64%" }}
          label="Bretton Woods"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="bwHall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a2a14" />
                <stop offset="100%" stopColor="#1a1408" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="120" fill="url(#bwHall)" />
            {/* Hall ceiling beams */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={5 + i * 18} y1="6" x2={5 + i * 18} y2="36" stroke="#7a5a30" strokeWidth="0.6" />
            ))}
            <line x1="0" y1="36" x2="100" y2="36" stroke="#7a5a30" strokeWidth="0.8" />
            {/* Big banner — "BRETTON WOODS 1944" */}
            <rect x="10" y="12" width="80" height="14" fill="#7a2a08" stroke="#fbbf24" strokeWidth="0.6" />
            <text x="50" y="22" fontSize="6" textAnchor="middle" fill="#fde68a" fontWeight="bold">BRETTON WOODS</text>
            <text x="50" y="25" fontSize="0" />
            <text x="50" y="26" fontSize="3" textAnchor="middle" fill="#fde68a" fontStyle="italic">JULY 1944</text>

            {/* Conference table */}
            <ellipse cx="50" cy="74" rx="42" ry="14" fill="#5a3a18" stroke="#7a5a30" strokeWidth="0.8" />
            <ellipse cx="50" cy="72" rx="40" ry="12" fill="#7a5a30" />
            {/* Gavel on table */}
            <rect x="44" y="68" width="12" height="3" fill="#3a2010" />
            <rect x="42" y="67" width="3" height="5" fill="#3a2010" />

            {/* Delegates around the table — head + shoulders silhouettes */}
            {[14, 28, 42, 56, 70, 84].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy={i % 2 === 0 ? 60 : 92} r="3.2" fill="#0a0a0a" />
                <path d={`M ${x - 4} ${i % 2 === 0 ? 64 : 96} L ${x + 4} ${i % 2 === 0 ? 64 : 96} L ${x + 5} ${i % 2 === 0 ? 72 : 104} L ${x - 5} ${i % 2 === 0 ? 72 : 104} Z`} fill="#0a0a0a" />
                {/* Flag poles behind */}
                <line x1={x} y1={i % 2 === 0 ? 56 : 88} x2={x} y2={i % 2 === 0 ? 40 : 72} stroke="#3a2010" strokeWidth="0.5" />
              </g>
            ))}
            {/* Tiny flag colors */}
            <rect x="12" y="40" width="5" height="3" fill="#1e3a8a" />
            <rect x="26" y="40" width="5" height="3" fill="#dc2626" />
            <rect x="40" y="40" width="5" height="3" fill="#15803d" />
            <rect x="54" y="40" width="5" height="3" fill="#f5f5f5" />
            <rect x="68" y="40" width="5" height="3" fill="#fbbf24" />
            <rect x="82" y="40" width="5" height="3" fill="#dc2626" />

            {/* Two institution plates */}
            <rect x="8" y="104" width="38" height="12" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.5" />
            <text x="27" y="112" fontSize="4.4" textAnchor="middle" fill="#3a1a08" fontWeight="bold">IMF</text>
            <rect x="54" y="104" width="38" height="12" fill="#fde68a" stroke="#7a5a30" strokeWidth="0.5" />
            <text x="73" y="112" fontSize="4.4" textAnchor="middle" fill="#3a1a08" fontWeight="bold">WORLD BANK</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={50} y={86} accent={accent} selected={selectedPart === "bretton-woods"} onClick={() => onSelectPart("bretton-woods")} preview={preview} />

        {/* ───────── RIGHT: Modern Globalization ───────── */}
        <Hotspot
          id="modern-globalization"
          selected={selectedPart === "modern-globalization"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "69%", top: "18%", width: "27%", height: "64%" }}
          label="Modern Globalization"
        >
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="mgSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a4a3a" />
                <stop offset="60%" stopColor="#3a2a14" />
                <stop offset="100%" stopColor="#1a1408" />
              </linearGradient>
              <linearGradient id="mgSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c4a6e" />
                <stop offset="100%" stopColor="#082030" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="60" fill="url(#mgSky)" />
            <rect x="0" y="60" width="100" height="36" fill="url(#mgSea)" />
            <rect x="0" y="96" width="100" height="24" fill="#1a1408" />

            {/* Factory skyline */}
            <rect x="6" y="34" width="22" height="26" fill="#3a2a14" stroke="#7a5a30" strokeWidth="0.4" />
            <rect x="28" y="28" width="14" height="32" fill="#3a2a14" stroke="#7a5a30" strokeWidth="0.4" />
            {/* Smokestacks */}
            <rect x="10" y="20" width="3" height="14" fill="#5a3a18" />
            <rect x="20" y="14" width="3" height="20" fill="#5a3a18" />
            <rect x="32" y="16" width="3" height="12" fill="#5a3a18" />
            {/* Smoke */}
            <ellipse cx="11.5" cy="16" rx="3" ry="1.4" fill="#9ca3af" opacity="0.5" />
            <ellipse cx="21.5" cy="10" rx="3.5" ry="1.6" fill="#9ca3af" opacity="0.4" />
            <ellipse cx="33.5" cy="12" rx="3" ry="1.4" fill="#9ca3af" opacity="0.5" />
            {/* Factory windows */}
            <rect x="9" y="40" width="3" height="3" fill="#fbbf24" opacity="0.7" />
            <rect x="14" y="40" width="3" height="3" fill="#fbbf24" opacity="0.7" />
            <rect x="19" y="40" width="3" height="3" fill="#fbbf24" opacity="0.7" />
            <rect x="30" y="34" width="3" height="3" fill="#fbbf24" opacity="0.7" />
            <rect x="35" y="34" width="3" height="3" fill="#fbbf24" opacity="0.7" />

            {/* Container ship hull */}
            <path d="M 44 70 L 96 70 L 92 80 L 48 80 Z" fill="#7a2a08" stroke="#fbbf24" strokeWidth="0.4" />
            {/* Containers stacked */}
            <rect x="50" y="62" width="8" height="8" fill="#dc2626" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="58" y="62" width="8" height="8" fill="#fbbf24" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="66" y="62" width="8" height="8" fill="#15803d" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="74" y="62" width="8" height="8" fill="#1e3a8a" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="50" y="54" width="8" height="8" fill="#fbbf24" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="58" y="54" width="8" height="8" fill="#dc2626" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="66" y="54" width="8" height="8" fill="#15803d" stroke="#1a0808" strokeWidth="0.3" />
            {/* Bridge */}
            <rect x="84" y="58" width="8" height="12" fill="#f5f5f5" stroke="#1a0808" strokeWidth="0.3" />
            <rect x="86" y="60" width="2" height="2" fill="#7dd3fc" />

            {/* Waves */}
            <path d="M 0 84 Q 14 82 28 84 T 56 84 T 84 84 T 100 84" stroke="#7dd3fc" strokeWidth="0.4" fill="none" opacity="0.5" />
            <path d="M 0 90 Q 14 88 28 90 T 56 90 T 84 90 T 100 90" stroke="#7dd3fc" strokeWidth="0.4" fill="none" opacity="0.3" />

            {/* Floating currency symbols */}
            <text x="50" y="106" fontSize="9" fill="#fbbf24" fontWeight="bold">$</text>
            <text x="62" y="112" fontSize="9" fill="#fbbf24" fontWeight="bold">€</text>
            <text x="74" y="106" fontSize="9" fill="#fbbf24" fontWeight="bold">¥</text>
            <text x="86" y="112" fontSize="9" fill="#fbbf24" fontWeight="bold">₹</text>
            <text x="38" y="114" fontSize="9" fill="#fbbf24" fontWeight="bold">$</text>
            <text x="26" y="108" fontSize="9" fill="#fbbf24" fontWeight="bold">€</text>

            {/* "MNCs" caption */}
            <text x="50" y="118" fontSize="3.2" textAnchor="middle" fill="#fde68a" fontStyle="italic">MNCs · TRADE · CAPITAL FLOWS</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={83} y={86} accent={accent} selected={selectedPart === "modern-globalization"} onClick={() => onSelectPart("modern-globalization")} preview={preview} />

        {/* ───────── Bottom-left medallion: Food Transfer (Columbian Exchange) ───────── */}
        <Hotspot
          id="food-transfer"
          selected={selectedPart === "food-transfer"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "6%", top: "84%", width: "20%", height: "12%" }}
          label="Columbian Exchange"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="50" width="100" height="10" fill="#2a1810" />
            {/* Potato */}
            <ellipse cx="22" cy="30" rx="9" ry="7" fill="#a16207" stroke="#5a2a08" strokeWidth="0.5" />
            <ellipse cx="22" cy="30" rx="9" ry="7" fill="none" stroke="#5a2a08" strokeWidth="0.3" />
            {/* Potato eyes */}
            <circle cx="18" cy="28" r="0.6" fill="#3a1808" />
            <circle cx="24" cy="32" r="0.6" fill="#3a1808" />
            <circle cx="26" cy="27" r="0.6" fill="#3a1808" />
            {/* Tomato */}
            <circle cx="52" cy="32" r="7" fill="#dc2626" stroke="#7a2a08" strokeWidth="0.5" />
            <path d="M 49 26 L 55 26 L 54 22 L 50 22 Z" fill="#15803d" />
            <line x1="52" y1="22" x2="52" y2="18" stroke="#15803d" strokeWidth="0.8" />
            {/* Chilli */}
            <path d="M 70 24 Q 78 22 86 30 Q 88 36 82 38 Q 74 36 72 30 Z" fill="#b91c1c" stroke="#5a0a08" strokeWidth="0.4" />
            <path d="M 70 24 L 68 18" stroke="#15803d" strokeWidth="0.8" />
            {/* Arrow showing Americas → Europe/Asia */}
            <path d="M 6 50 L 92 50" stroke="#fbbf24" strokeWidth="0.6" strokeDasharray="2 2" />
            <text x="50" y="58" fontSize="3" textAnchor="middle" fill="#fde68a" fontStyle="italic">AMERICAS → WORLD</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={15} y={82} accent={accent} selected={selectedPart === "food-transfer"} onClick={() => onSelectPart("food-transfer")} preview={preview} />

        {/* ───────── Bottom-right medallion: Slave Trade (anchor) ───────── */}
        <Hotspot
          id="slave-trade"
          selected={selectedPart === "slave-trade"}
          onSelect={onSelectPart}
          accent={accent}
          preview={preview}
          style={{ position: "absolute", left: "74%", top: "84%", width: "20%", height: "12%" }}
          label="Slave Trade"
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="50" width="100" height="10" fill="#2a1810" />
            {/* Anchor */}
            <circle cx="50" cy="14" r="3" fill="none" stroke="#9ca3af" strokeWidth="1.4" />
            <line x1="50" y1="17" x2="50" y2="42" stroke="#9ca3af" strokeWidth="1.6" />
            <line x1="42" y1="22" x2="58" y2="22" stroke="#9ca3af" strokeWidth="1.4" />
            {/* Anchor flukes */}
            <path d="M 38 38 Q 38 48 50 46 Q 62 48 62 38 L 60 38 Q 60 44 50 44 Q 40 44 40 38 Z" fill="#9ca3af" />
            {/* Triangular trade route diagram (mini) */}
            <g transform="translate(14 30)">
              <circle cx="0" cy="0" r="2" fill="#dc2626" />
              <circle cx="14" cy="6" r="2" fill="#fbbf24" />
              <circle cx="7" cy="-6" r="2" fill="#15803d" />
              <path d="M 0 0 L 14 6 L 7 -6 Z" stroke="#fde68a" strokeWidth="0.4" strokeDasharray="1 1" fill="none" />
            </g>
            <g transform="translate(72 30)">
              <circle cx="0" cy="0" r="2" fill="#dc2626" />
              <circle cx="14" cy="6" r="2" fill="#fbbf24" />
              <circle cx="7" cy="-6" r="2" fill="#15803d" />
              <path d="M 0 0 L 14 6 L 7 -6 Z" stroke="#fde68a" strokeWidth="0.4" strokeDasharray="1 1" fill="none" />
            </g>
            <text x="50" y="58" fontSize="3" textAnchor="middle" fill="#fde68a" fontStyle="italic">AFRICA → AMERICAS</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={84} y={82} accent={accent} selected={selectedPart === "slave-trade"} onClick={() => onSelectPart("slave-trade")} preview={preview} />

        <Plaque title="The Making of a Global World" caption="Silk Routes · Bretton Woods · Modern Globalization · Columbian Exchange · Slave Trade" accent={accent} />
      </PaintingFrame>
    </div>
  );
}

export const HistGlobalWorldExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "hist-global-world",
  chapterId: 3,
  track: "ssc",
  title: "Making of a Global World",
  subtitle: "SSC History Ch 3 · Globalization through History",
  description:
    "A mural tracing globalisation from pre-modern silk routes to today's container economy — through Bretton Woods, the Columbian Exchange, and the tragedy of the slave trade. Click each scene to see how the world was woven together.",
  accent: "#fbbf24",
  icon: "🌍",
  parts: [
    {
      id: "silk-routes",
      name: "Silk Routes",
      info:
        "Pre-modern trade routes linking Asia with the Mediterranean and Europe. Caravans carried silk, porcelain and spices west; gold, silver and wool moved east. They were also corridors for religion (Buddhism, Islam) and technology (paper, gunpowder), knitting distant civilisations together long before modern states.",
    },
    {
      id: "bretton-woods",
      name: "Bretton Woods Conference (1944)",
      info:
        "In July 1944, 44 Allied nations met at Bretton Woods, New Hampshire, to design a stable post-war financial order. They created the International Monetary Fund (IMF) and the International Bank for Reconstruction and Development (World Bank), and tied currencies to the US dollar, which was convertible to gold — anchoring global trade until 1971.",
    },
    {
      id: "modern-globalization",
      name: "Modern Globalization (post-1970s)",
      info:
        "From the 1970s the Bretton Woods system unravelled, finance was deregulated, and multinational corporations spread production across borders. China's rise after 1978 and the IT revolution shrank distance. Goods, capital and data now flow faster than ever — but benefits are unevenly shared.",
    },
    {
      id: "food-transfer",
      name: "Columbian Exchange",
      info:
        "After 1492, crops and animals crossed the Atlantic both ways. Potatoes, tomatoes, maize, chillies and tobacco travelled from the Americas to Europe, Africa and Asia — potatoes became a European staple; chillies reshaped Indian and Thai cuisine. The exchange transformed diets, populations and economies worldwide.",
    },
    {
      id: "slave-trade",
      name: "Triangular Slave Trade",
      info:
        "From the 16th to the 19th century, European merchants shipped manufactured goods to West Africa, transported enslaved Africans across the Atlantic to American plantations, and brought back sugar, cotton and tobacco. The brutal 'middle passage' uprooted millions. Britain abolished the slave trade in 1807 and slavery in 1833.",
    },
  ],
  Panel: HistGlobalWorldPanel,
};
