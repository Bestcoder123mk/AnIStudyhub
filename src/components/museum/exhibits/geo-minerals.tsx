"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#b45309";

const INDIA_PATH =
  "M 18,20 L 30,9 L 46,5 L 58,6 L 70,9 L 82,18 L 80,30 L 72,42 L 64,56 L 56,72 L 51,86 L 49,86 L 44,72 L 36,56 L 28,42 L 22,32 Z";

function GeoMineralsPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
          ⛏️ MINERALS &amp; ENERGY RESOURCES
        </div>

        {/* CENTER — India map with mineral symbols. Wrapped in TWO overlapping hotspots:
            metallic-minerals (left half of map) and non-metallic-minerals (right half). */}
        {/* Metallic overlay (covers most of the map) */}
        <Hotspot id="metallic-minerals" selected={is("metallic-minerals")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "18%", width: "24%", height: "60%" }}
          label="Metallic">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(20,12,4,0.4)" />
            {/* India silhouette cropped to left half */}
            <path d={INDIA_PATH} fill="#3a2a14" stroke="#1a1208" strokeWidth="0.5" opacity="0.7" />
            {/* Iron ore (east-central, Jharkhand-Odisha) */}
            <g transform="translate(58,42)">
              <circle cx="0" cy="0" r="3" fill="#dc2626" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="0.5" textAnchor="middle" fontSize="2.6" fill="#fff" fontWeight="800">Fe</text>
            </g>
            {/* Bauxite (center, MP - Amarkantak) */}
            <g transform="translate(35,40)">
              <polygon points="-3,2 3,2 0,-3" fill="#b45309" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="6" textAnchor="middle" fontSize="2.4" fill="#fff" fontWeight="800">Bx</text>
            </g>
            {/* Manganese (Balaghat) */}
            <g transform="translate(48,55)">
              <rect x="-3" y="-3" width="6" height="6" fill="#7c2d12" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="0.5" textAnchor="middle" fontSize="2.4" fill="#fff" fontWeight="800">Mn</text>
            </g>
            {/* Copper (Singhbhum) */}
            <g transform="translate(60,33)">
              <polygon points="0,-3 3,1 -3,1" fill="#ea580c" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="6" textAnchor="middle" fontSize="2.4" fill="#fff" fontWeight="800">Cu</text>
            </g>
            {/* Labels */}
            <text x="50" y="10" textAnchor="middle" fontSize="3.2" fill={ACCENT} fontWeight="700">Metallic</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.6" fill="#a89880">Fe · Mn · Cu · Bauxite</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={36} y={16} accent={ACCENT} selected={is("metallic-minerals")} preview={preview} onClick={sel("metallic-minerals")} />

        {/* Non-metallic overlay (right half of map) */}
        <Hotspot id="non-metallic-minerals" selected={is("non-metallic-minerals")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "54%", top: "18%", width: "16%", height: "60%" }}
          label="Non-metallic">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(20,12,4,0.4)" />
            <path d={INDIA_PATH} fill="#3a2a14" stroke="#1a1208" strokeWidth="0.5" opacity="0.7" />
            {/* Mica (Koderma, Jharkhand) */}
            <g transform="translate(20,42)">
              <polygon points="0,-3 3,-1 2,2 -2,2 -3,-1" fill="#facc15" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="7" textAnchor="middle" fontSize="2.4" fill="#fff" fontWeight="800">Mc</text>
            </g>
            {/* Limestone (sedimentary) */}
            <g transform="translate(35,55)">
              <polygon points="-3,-1 3,-1 3,2 -3,2" fill="#cbd5e1" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="0.5" textAnchor="middle" fontSize="2" fill="#0a0917" fontWeight="800">Ls</text>
            </g>
            {/* Rock salt (Mandi, HP) */}
            <g transform="translate(8,18)">
              <circle cx="0" cy="0" r="3" fill="#f1f5f9" stroke="#1a1208" strokeWidth="0.4" />
              <text x="0" y="0.8" textAnchor="middle" fontSize="2" fill="#0a0917" fontWeight="800">Na</text>
            </g>
            <text x="50" y="10" textAnchor="middle" fontSize="3.2" fill={ACCENT} fontWeight="700">Non-metallic</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.4" fill="#a89880">Mica · Limestone · Salt</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={62} y={16} accent={ACCENT} selected={is("non-metallic-minerals")} preview={preview} onClick={sel("non-metallic-minerals")} />

        {/* LEFT — Conventional energy icons */}
        <Hotspot id="conventional-energy" selected={is("conventional-energy")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "16%", width: "22%", height: "62%" }}
          label="Conventional Energy">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(20,12,4,0.7)" />
            <text x="50" y="8" textAnchor="middle" fontSize="4.4" fill={ACCENT} fontWeight="700">Conventional Energy</text>
            {/* Coal pile */}
            <g transform="translate(6,14)">
              <polygon points="0,18 24,18 18,4 6,4" fill="#1c1917" />
              <polygon points="6,4 12,2 18,4" fill="#27272a" />
              <text x="12" y="24" textAnchor="middle" fontSize="2.8" fill="#e5e7eb" fontWeight="600">Coal · Jharia</text>
            </g>
            {/* Petroleum barrel */}
            <g transform="translate(40,12)">
              <rect x="0" y="2" width="20" height="20" rx="2" fill="#0ea5e9" stroke="#1a1208" strokeWidth="0.4" />
              <rect x="0" y="9" width="20" height="2" fill="#1a1208" />
              <rect x="0" y="14" width="20" height="2" fill="#1a1208" />
              <text x="10" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Petroleum · Digboi</text>
            </g>
            {/* Natural gas flame */}
            <g transform="translate(72,12)">
              <path d="M 6,22 Q 0,12 6,4 Q 12,12 6,22 Z" fill="#f97316" />
              <path d="M 6,20 Q 3,14 6,8 Q 9,14 6,20 Z" fill="#fbbf24" />
              <text x="6" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Gas · KG basin</text>
            </g>
            {/* Hydro power */}
            <g transform="translate(6,40)">
              <rect x="0" y="6" width="22" height="14" fill="#0369a1" />
              <path d="M 0,6 L 22,6 L 22,2 L 0,2 Z" fill="#0c4a6e" />
              {/* Water fall */}
              <path d="M 4,20 L 4,28 M 11,20 L 11,28 M 18,20 L 18,28" stroke="#7dd3fc" strokeWidth="1.4" />
              <text x="11" y="34" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Hydro · Bhakra</text>
            </g>
            {/* Nuclear atom */}
            <g transform="translate(58,40)">
              <circle cx="12" cy="14" r="2" fill="#facc15" />
              <ellipse cx="12" cy="14" rx="9" ry="3.5" fill="none" stroke={ACCENT} strokeWidth="0.8" />
              <ellipse cx="12" cy="14" rx="9" ry="3.5" fill="none" stroke={ACCENT} strokeWidth="0.8" transform="rotate(60 12 14)" />
              <ellipse cx="12" cy="14" rx="9" ry="3.5" fill="none" stroke={ACCENT} strokeWidth="0.8" transform="rotate(120 12 14)" />
              <text x="12" y="34" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Nuclear · Tarapur</text>
            </g>
            {/* Bottom note */}
            <text x="50" y="82" textAnchor="middle" fontSize="3" fill={ACCENT} fontWeight="700">Exhaustible · Polluting</text>
            <text x="50" y="88" textAnchor="middle" fontSize="2.6" fill="#a89880">Coal · Petroleum · Gas · Hydro · Nuclear</text>
            <text x="50" y="94" textAnchor="middle" fontSize="2.6" fill="#a89880">Mumbai High · Dhanbad · Kalpakkam</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={16} y={14} accent={ACCENT} selected={is("conventional-energy")} preview={preview} onClick={sel("conventional-energy")} />

        {/* RIGHT — Non-conventional energy icons */}
        <Hotspot id="non-conventional-energy" selected={is("non-conventional-energy")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "16%", width: "22%", height: "62%" }}
          label="Non-Conventional">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(20,12,4,0.7)" />
            <text x="50" y="8" textAnchor="middle" fontSize="4" fill={ACCENT} fontWeight="700">Non-Conventional</text>
            {/* Solar panel */}
            <g transform="translate(6,14)">
              <polygon points="0,2 22,2 20,16 2,16" fill="#1e293b" stroke="#fde68a" strokeWidth="0.5" />
              <line x1="8" y1="2" x2="7" y2="16" stroke="#0a0917" strokeWidth="0.4" />
              <line x1="14" y1="2" x2="13" y2="16" stroke="#0a0917" strokeWidth="0.4" />
              <line x1="2" y1="6" x2="20" y2="6" stroke="#0a0917" strokeWidth="0.4" />
              <line x1="2" y1="11" x2="20" y2="11" stroke="#0a0917" strokeWidth="0.4" />
              <circle cx="11" cy="-1" r="3" fill="#fde68a" />
              <text x="11" y="22" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Solar · Bhadla RJ</text>
            </g>
            {/* Wind turbine */}
            <g transform="translate(40,12)">
              <rect x="10" y="10" width="2" height="14" fill="#94a3b8" />
              <circle cx="11" cy="9" r="1.2" fill="#1a1208" />
              <path d="M 11,9 L 11,1 M 11,9 L 19,12 M 11,9 L 3,12" stroke="#e5e7eb" strokeWidth="1.2" />
              <text x="11" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Wind · TN</text>
            </g>
            {/* Biogas digester */}
            <g transform="translate(68,12)">
              <ellipse cx="10" cy="14" rx="9" ry="6" fill="#3a2a14" stroke={ACCENT} strokeWidth="0.6" />
              <rect x="9" y="2" width="2" height="8" fill="#84cc16" />
              <path d="M 10,2 Q 8,-1 10,-3 Q 12,-1 10,2" fill="#facc15" />
              <text x="10" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Biogas · gobar</text>
            </g>
            {/* Tidal waves */}
            <g transform="translate(6,40)">
              <path d="M 0,12 Q 4,6 8,12 T 16,12 T 24,12" stroke="#0ea5e9" strokeWidth="1.4" fill="none" />
              <path d="M 0,18 Q 4,12 8,18 T 16,18 T 24,18" stroke="#7dd3fc" strokeWidth="1.4" fill="none" />
              <text x="12" y="26" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Tidal · Khambhat</text>
            </g>
            {/* Geothermal vent */}
            <g transform="translate(40,40)">
              <polygon points="4,22 8,4 12,22" fill="#92400e" />
              <path d="M 6,2 Q 8,-3 10,2 Q 9,4 8,2 Q 7,4 6,2" fill="#f97316" />
              <circle cx="8" cy="14" r="1.5" fill="#fbbf24" />
              <text x="8" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Geo · Manikaran</text>
            </g>
            {/* Bottom note */}
            <text x="50" y="82" textAnchor="middle" fontSize="3" fill={ACCENT} fontWeight="700">Renewable · Clean</text>
            <text x="50" y="88" textAnchor="middle" fontSize="2.6" fill="#a89880">Solar · Wind · Biogas · Tidal · Geo</text>
            <text x="50" y="94" textAnchor="middle" fontSize="2.6" fill="#a89880">Bhadla · Muppandal · Puga</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={84} y={14} accent={ACCENT} selected={is("non-conventional-energy")} preview={preview} onClick={sel("non-conventional-energy")} />

        {/* Conservation recycle (small, bottom-center) */}
        <Hotspot id="conservation" selected={is("conservation")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "82%", width: "40%", height: "14%" }}
          label="Conservation">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(20,12,4,0.7)" rx="4" />
            <text x="50" y="14" textAnchor="middle" fontSize="4.4" fill={ACCENT} fontWeight="700">Conservation</text>
            {/* Recycle triangle arrows */}
            <g transform="translate(38,22)">
              <polygon points="0,30 12,10 24,30 18,30 12,20 6,30" fill="none" stroke={ACCENT} strokeWidth="1.6" />
              <polygon points="12,4 18,12 6,12" fill={ACCENT} />
              <polygon points="24,30 18,30 12,20 18,18" fill={ACCENT} opacity="0.6" />
            </g>
            <text x="50" y="84" textAnchor="middle" fontSize="3" fill="#e5e7eb">Recycle metals · public transport</text>
            <text x="50" y="92" textAnchor="middle" fontSize="3" fill="#e5e7eb">renewables · energy efficiency</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={50} y={80} accent={ACCENT} selected={is("conservation")} preview={preview} onClick={sel("conservation")} />

        <Plaque title="Minerals and Energy Resources" caption="Metallic · Non-metallic · Conventional · Renewable · NCERT Geo Ch 9" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoMineralsExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-minerals",
  chapterId: 9,
  track: "ssc",
  title: "Minerals & Energy Resources",
  subtitle: "SSC Geo · Ch 9",
  description:
    "A stylized India map with mineral symbols (Fe, Mn, Cu, Bx, Mc, Ls, Na), conventional and non-conventional energy icons, and a conservation recycle symbol. Click each region to explore CBSE Class 10 Geography Chapter 9.",
  accent: "#b45309",
  icon: "⛏️",
  parts: [
    {
      id: "metallic-minerals",
      name: "Metallic Minerals",
      info: "Iron ore — magnetite (72% Fe, best quality, Karnataka) & hematite (50-60% Fe, Odisha-Jharkhand-Chhattisgarh, ~95% of output); Bailadila range (Chhattisgarh) exports to Japan. Manganese — Balaghat (MP), Nagpur, Odisha; used in steel-making. Copper — Singhbhum (Jharkhand), Khetri (Rajasthan). Bauxite — Amarkantak plateau (MP), Odisha — the ore of aluminium.",
    },
    {
      id: "non-metallic-minerals",
      name: "Non-metallic Minerals",
      info: "Mica — Koderma-Gaya-Hazaribagh belt (Jharkhand) is the world's leading producer; used in electrical & electronic industries. Limestone — found in sedimentary rocks (St. Maikur, Andhra Pradesh, Rajasthan, Madhya Pradesh, Gujarat); key raw material for cement. Rock salt — Mandi (Himachal Pradesh) & Gujarat coast (sea salt).",
    },
    {
      id: "conventional-energy",
      name: "Conventional Energy Sources",
      info: "Coal — primary commercial energy; Jharia, Raniganj, Bokaro, Dhanbad (Jharkhand-Bengal belt). Petroleum — Digboi (Assam, oldest), Mumbai High (offshore), Ankleshwar (Gujarat). Natural gas — KG basin, Mumbai High, Tripura. Hydropower — Bhakra-Nangal, Kopili. Nuclear — Tarapur (Maharashtra, oldest), Kalpakkam, Narora, Kakrapar.",
    },
    {
      id: "non-conventional-energy",
      name: "Non-Conventional Energy Sources",
      info: "Solar — Bhadla Solar Park (Rajasthan, world's largest). Wind — Muppandal (Tamil Nadu), Gujarat, Maharashtra. Biogas — gobar gas plants in rural India. Tidal — Gulf of Khambhat, Gulf of Kutch. Geothermal — Manikaran (Himachal), Puga Valley (Ladakh). India aims for 500 GW non-fossil capacity by 2030.",
    },
    {
      id: "conservation",
      name: "Conservation of Minerals & Energy",
      info: "Minerals are non-renewable. Conservation measures: (1) Recycle & reuse metals (steel, aluminium, copper) (2) Use public transport & fuel-efficient vehicles (3) Switch to renewable energy (solar, wind) (4) Improve energy efficiency (LEDs, BEE-star appliances) (5) Avoid wastage — 'reduce, reuse, recycle'. Sustainable mining and afforestation of mined land are also key.",
    },
  ],
  Panel: GeoMineralsPanel,
};
