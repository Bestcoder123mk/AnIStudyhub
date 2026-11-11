"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#15803d";

// Stylized triangular tree silhouettes — original art
function TreeShape({ x, y, h, w, fill }: { x: number; y: number; h: number; w: number; fill: string }) {
  const half = w / 2;
  return (
    <g>
      <rect x={x - half * 0.12} y={y + h * 0.7} width={w * 0.24} height={h * 0.3} fill="#3b2410" />
      <polygon points={`${x - half},${y + h * 0.7} ${x + half},${y + h * 0.7} ${x},${y}`} fill={fill} />
      <polygon points={`${x - half * 0.85},${y + h * 0.5} ${x + half * 0.85},${y + h * 0.5} ${x},${y - h * 0.15}`} fill={fill} opacity="0.92" />
    </g>
  );
}

function GeoForestWildlifePanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const is = (id: string) => selectedPart === id;
  const sel = (id: string) => () => onSelectPart(is(id) ? null : id);

  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Title */}
        <div style={{
          position: "absolute", top: "2%", left: 0, width: "100%", textAlign: "center",
          fontSize: 11, fontWeight: 800, color: ACCENT, letterSpacing: 3, fontFamily: "Georgia, serif",
        }}>
          🌳 FOREST &amp; WILDLIFE RESOURCES
        </div>

        {/* CENTER — Forest cross-section with three management bands */}
        {/* Reserve (top band) */}
        <Hotspot id="reserve-forest" selected={is("reserve-forest")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "14%", width: "40%", height: "20%" }}
          label="Reserve Forest">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#0a1a0e" />
            <TreeShape x={12} y={6} h={92} w={16} fill="#14532d" />
            <TreeShape x={30} y={4} h={96} w={18} fill="#166534" />
            <TreeShape x={50} y={6} h={92} w={16} fill="#14532d" />
            <TreeShape x={70} y={4} h={96} w={18} fill="#166534" />
            <TreeShape x={88} y={6} h={92} w={16} fill="#14532d" />
            <rect x="0" y="0" width="100" height="100" fill={ACCENT} opacity="0.06" />
          </svg>
        </Hotspot>
        <Tag n={1} x={33} y={12} accent={ACCENT} selected={is("reserve-forest")} preview={preview} onClick={sel("reserve-forest")} />

        {/* Protected (middle band) */}
        <Hotspot id="protected-forest" selected={is("protected-forest")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "36%", width: "40%", height: "20%" }}
          label="Protected Forest">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#0c1f13" />
            <TreeShape x={18} y={12} h={80} w={16} fill="#15803d" />
            <TreeShape x={42} y={14} h={78} w={15} fill="#166534" />
            <TreeShape x={62} y={12} h={80} w={16} fill="#15803d" />
            <TreeShape x={85} y={16} h={74} w={14} fill="#166534" />
            {/* Gaps — thinned forest */}
            <rect x="30" y="70" width="6" height="20" fill="#3b2410" opacity="0.4" />
            <rect x="74" y="70" width="6" height="20" fill="#3b2410" opacity="0.4" />
          </svg>
        </Hotspot>
        <Tag n={2} x={33} y={34} accent={ACCENT} selected={is("protected-forest")} preview={preview} onClick={sel("protected-forest")} />

        {/* Unclassed (bottom band) */}
        <Hotspot id="unclassed-forest" selected={is("unclassed-forest")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "58%", width: "40%", height: "18%" }}
          label="Unclassed Forest">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#10180f" />
            <TreeShape x={20} y={28} h={62} w={13} fill="#1f7a3d" />
            <TreeShape x={70} y={30} h={60} w={12} fill="#1f7a3d" />
            {/* Stumps — degraded */}
            <rect x={45} y="74" width="8" height="14" fill="#3b2410" />
            <rect x={58} y="76" width="7" height="12" fill="#3b2410" />
            <rect x={8} y="78" width="7" height="10" fill="#3b2410" />
            <rect x={86} y="76" width="7" height="12" fill="#3b2410" />
            <rect x="33" y="80" width="6" height="8" fill="#3b2410" />
          </svg>
        </Hotspot>
        <Tag n={3} x={33} y={56} accent={ACCENT} selected={is("unclassed-forest")} preview={preview} onClick={sel("unclassed-forest")} />

        {/* LEFT — Endangered species silhouettes */}
        <Hotspot id="endangered-species" selected={is("endangered-species")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "16%", width: "22%", height: "62%" }}
          label="Endangered Species">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(6,18,12,0.6)" />
            <text x="50" y="9" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Endangered Species</text>
            {/* Tiger (silhouette) */}
            <g transform="translate(8,16) scale(0.42)">
              <ellipse cx="40" cy="30" rx="34" ry="13" fill="#b45309" />
              <circle cx="10" cy="22" r="10" fill="#b45309" />
              <polygon points="4,14 8,4 12,14" fill="#b45309" />
              <polygon points="12,14 16,4 20,14" fill="#b45309" />
              <path d="M 70,30 Q 90,30 95,18 L 88,24 L 82,18 L 80,28 Z" fill="#b45309" />
              <line x1="10" y1="40" x2="10" y2="54" stroke="#b45309" strokeWidth="4" />
              <line x1="30" y1="40" x2="30" y2="54" stroke="#b45309" strokeWidth="4" />
              <line x1="50" y1="40" x2="50" y2="54" stroke="#b45309" strokeWidth="4" />
            </g>
            <text x="22" y="42" textAnchor="middle" fontSize="4" fill="#e5e7eb">Tiger · VU</text>
            {/* Rhino (silhouette) */}
            <g transform="translate(50,30) scale(0.40)">
              <ellipse cx="40" cy="30" rx="36" ry="14" fill="#6b7280" />
              <path d="M 5,28 L 0,20 L 8,28 Z" fill="#6b7280" />
              <ellipse cx="3" cy="22" rx="10" ry="8" fill="#6b7280" />
              <line x1="10" y1="42" x2="10" y2="58" stroke="#6b7280" strokeWidth="5" />
              <line x1="32" y1="42" x2="32" y2="58" stroke="#6b7280" strokeWidth="5" />
              <line x1="55" y1="42" x2="55" y2="58" stroke="#6b7280" strokeWidth="5" />
              <line x1="72" y1="42" x2="72" y2="58" stroke="#6b7280" strokeWidth="5" />
            </g>
            <text x="66" y="58" textAnchor="middle" fontSize="4" fill="#e5e7eb">Rhino · VU</text>
            {/* Snow Leopard */}
            <g transform="translate(8,58) scale(0.40)">
              <ellipse cx="40" cy="30" rx="32" ry="11" fill="#9ca3af" />
              <circle cx="10" cy="24" r="9" fill="#9ca3af" />
              <polygon points="4,16 7,8 11,16" fill="#9ca3af" />
              <polygon points="11,16 14,8 18,16" fill="#9ca3af" />
              <path d="M 66,30 Q 88,28 92,14 L 84,22 L 80,16 L 76,28 Z" fill="#9ca3af" />
              <line x1="14" y1="38" x2="14" y2="52" stroke="#9ca3af" strokeWidth="4" />
              <line x1="36" y1="38" x2="36" y2="52" stroke="#9ca3af" strokeWidth="4" />
              <line x1="56" y1="38" x2="56" y2="52" stroke="#9ca3af" strokeWidth="4" />
            </g>
            <text x="22" y="80" textAnchor="middle" fontSize="4" fill="#e5e7eb">Snow Leopard</text>
            {/* Great Indian Bustard */}
            <g transform="translate(55,68) scale(0.40)">
              <ellipse cx="40" cy="32" rx="24" ry="9" fill="#d4a373" />
              <circle cx="22" cy="26" r="7" fill="#d4a373" />
              <polygon points="15,26 4,28 16,30" fill="#92400e" />
              <line x1="40" y1="40" x2="40" y2="54" stroke="#d4a373" strokeWidth="3" />
              <line x1="50" y1="40" x2="50" y2="54" stroke="#d4a373" strokeWidth="3" />
              <path d="M 56,28 L 76,18 L 64,30 Z" fill="#d4a373" />
            </g>
            <text x="68" y="92" textAnchor="middle" fontSize="3.8" fill="#e5e7eb">Bustard · CR</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={16} y={14} accent={ACCENT} selected={is("endangered-species")} preview={preview} onClick={sel("endangered-species")} />

        {/* RIGHT — Conservation icons */}
        <Hotspot id="conservation" selected={is("conservation")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "16%", width: "22%", height: "62%" }}
          label="Conservation">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(6,18,12,0.6)" />
            <text x="50" y="9" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Conservation</text>
            {/* Project Tiger logo — stylized tiger head in circle */}
            <circle cx="50" cy="32" r="18" fill="none" stroke={ACCENT} strokeWidth="2" />
            <ellipse cx="50" cy="34" rx="12" ry="9" fill="#b45309" />
            <polygon points="38,28 40,18 44,26" fill="#b45309" />
            <polygon points="62,28 60,18 56,26" fill="#b45309" />
            <circle cx="44" cy="32" r="1.6" fill="#0a0917" />
            <circle cx="56" cy="32" r="1.6" fill="#0a0917" />
            <path d="M 44,40 Q 50,44 56,40" stroke="#0a0917" strokeWidth="1" fill="none" />
            <text x="50" y="58" textAnchor="middle" fontSize="4" fill={ACCENT} fontWeight="700">Project Tiger · 1973</text>
            {/* Biosphere Reserve icon — globe with leaves */}
            <circle cx="50" cy="78" r="14" fill="#1f3d28" stroke={ACCENT} strokeWidth="1.4" />
            <path d="M 36,78 Q 64,72 64,78 Q 64,84 36,78 Z" fill={ACCENT} opacity="0.4" />
            <path d="M 50,64 C 42,64 38,72 38,80 C 38,86 44,88 50,86 C 56,88 62,86 62,80 C 62,72 58,64 50,64 Z" fill={ACCENT} opacity="0.78" />
            <text x="50" y="98" textAnchor="middle" fontSize="3.6" fill="#e5e7eb">Biosphere Reserve</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={84} y={14} accent={ACCENT} selected={is("conservation")} preview={preview} onClick={sel("conservation")} />

        {/* Biodiversity Hotspots marker (small, bottom-center) */}
        <Hotspot id="hotspots" selected={is("hotspots")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "32%", top: "78%", width: "36%", height: "14%" }}
          label="Hotspots">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(6,18,12,0.7)" rx="4" />
            <text x="50" y="14" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Biodiversity Hotspots</text>
            {/* Pin markers */}
            <g>
              <path d="M 18,42 C 18,30 28,30 28,42 C 28,52 23,62 23,62 C 23,62 18,52 18,42 Z" fill="#ef4444" />
              <circle cx="23" cy="42" r="3" fill="#fff" />
              <text x="23" y="78" textAnchor="middle" fontSize="3.6" fill="#e5e7eb">W. Ghats</text>
            </g>
            <g>
              <path d="M 44,42 C 44,30 54,30 54,42 C 54,52 49,62 49,62 C 49,62 44,52 44,42 Z" fill="#ef4444" />
              <circle cx="49" cy="42" r="3" fill="#fff" />
              <text x="49" y="78" textAnchor="middle" fontSize="3.6" fill="#e5e7eb">Himalayas</text>
            </g>
            <g>
              <path d="M 70,42 C 70,30 80,30 80,42 C 80,52 75,62 75,62 C 75,62 70,52 70,42 Z" fill="#ef4444" />
              <circle cx="75" cy="42" r="3" fill="#fff" />
              <text x="75" y="78" textAnchor="middle" fontSize="3.6" fill="#e5e7eb">Indo-Burma</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={6} x={50} y={76} accent={ACCENT} selected={is("hotspots")} preview={preview} onClick={sel("hotspots")} />

        <Plaque title="Forest and Wildlife Resources" caption="Reserve · Protected · Unclassed · IUCN · Project Tiger · NCERT Geo Ch 6" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoForestWildlifeExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-forest-wildlife",
  chapterId: 6,
  track: "ssc",
  title: "Forest & Wildlife Resources",
  subtitle: "SSC Geo · Ch 6",
  description:
    "A forest cross-section with three management bands, endangered species silhouettes, conservation icons and biodiversity hotspot markers. Click each region to explore CBSE Class 10 Geography Chapter 6.",
  accent: "#15803d",
  icon: "🌳",
  parts: [
    {
      id: "reserve-forest",
      name: "Reserved Forests",
      info: "More than half of India's forests are 'Reserved' — the Forest Department strictly protects them and no local rights (grazing, fuelwood collection) are permitted. These forests are the most conserved and are critical habitat. India has ~22% forest cover (Forest Survey of India).",
    },
    {
      id: "protected-forest",
      name: "Protected Forests",
      info: "Protected Forests are managed by the Forest Department but some local rights (limited grazing, collection of minor forest produce) are allowed and restricted. They form about one-third of India's forest area.",
    },
    {
      id: "unclassed-forest",
      name: "Unclassed Forests",
      info: "Unclassed Forests include forests and degraded forest lands (often with wasteland and scrub). They are managed by local communities, individuals or government departments other than the Forest Department. About one-sixth of India's forests fall in this category.",
    },
    {
      id: "endangered-species",
      name: "Endangered Species & Project Tiger",
      info: "Critically Endangered (CR): pink-headed duck (possibly extinct), Himalayan quail. Vulnerable (VU): tiger, one-horned rhinoceros. Project Tiger was launched in 1973 — flagship conservation programme with ~53 tiger reserves (2023). Other projects: Project Rhino, Project Elephant (1992), Great Indian Bustard (Rajasthan).",
    },
    {
      id: "conservation",
      name: "Conservation — Biosphere Reserves",
      info: "Biosphere Reserves (UNESCO MAB): Nilgiri, Nanda Devi, Sundarbans, Gulf of Mannar, Simlipal, Pachmarhi — protect large ecosystems with core, buffer and transition zones. National Parks (no rights — e.g., Corbett, Kanha) and Wildlife Sanctuaries (some rights allowed) are IUCN Category II / IV protected areas. The Wildlife (Protection) Act, 1972 is the key law.",
    },
    {
      id: "hotspots",
      name: "Biodiversity Hotspots",
      info: "India hosts three of the world's 36 biodiversity hotspots: the Western Ghats, the Himalayas, and the Indo-Burma region (NE India). Hotspots have exceptionally high endemism (species found nowhere else) and are under severe threat. The Western Ghats alone host ~5,000 flowering plant species, ~500 bird species and ~179 amphibian species.",
    },
  ],
  Panel: GeoForestWildlifePanel,
};
