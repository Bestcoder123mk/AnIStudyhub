"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#0891b2";

const INDIA_PATH =
  "M 18,20 L 30,9 L 46,5 L 58,6 L 70,9 L 82,18 L 80,30 L 72,42 L 64,56 L 56,72 L 51,86 L 49,86 L 44,72 L 36,56 L 28,42 L 22,32 Z";

function GeoManufacturingPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
          🏭 MANUFACTURING INDUSTRIES
        </div>

        {/* CENTER — Factory complex on India map base */}
        <Hotspot id="industrial-location" selected={is("industrial-location")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "18%", width: "40%", height: "60%" }}
          label="Industrial Location">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#0a1820" />
            {/* India silhouette as backdrop */}
            <path d={INDIA_PATH} fill="#102b36" stroke="#155e6b" strokeWidth="0.6" opacity="0.6" />
            {/* Factory complex (centered) */}
            {/* Main shed */}
            <g transform="translate(20,38)">
              {/* Saw-tooth roof */}
              <polygon points="0,12 8,4 16,12 24,4 32,12 40,4 48,12" fill="#475569" stroke="#0a0917" strokeWidth="0.5" />
              <rect x="0" y="12" width="48" height="22" fill="#64748b" stroke="#0a0917" strokeWidth="0.5" />
              {/* Windows */}
              <rect x="4" y="18" width="5" height="5" fill="#fde68a" opacity="0.8" />
              <rect x="13" y="18" width="5" height="5" fill="#fde68a" opacity="0.8" />
              <rect x="22" y="18" width="5" height="5" fill="#fde68a" opacity="0.8" />
              <rect x="31" y="18" width="5" height="5" fill="#fde68a" opacity="0.8" />
              <rect x="40" y="18" width="5" height="5" fill="#fde68a" opacity="0.8" />
              {/* Door */}
              <rect x="20" y="26" width="8" height="8" fill="#1a1208" />
            </g>
            {/* Chimneys with smoke */}
            <g transform="translate(28,24)">
              <rect x="0" y="0" width="4" height="16" fill="#1c1917" stroke="#0a0917" strokeWidth="0.4" />
              <rect x="6" y="0" width="4" height="16" fill="#1c1917" stroke="#0a0917" strokeWidth="0.4" />
              <path d="M 1,0 Q -2,-4 -1,-7 Q 1,-9 -1,-11" stroke="#94a3b8" strokeWidth="1.4" fill="none" opacity="0.6" />
              <path d="M 7,0 Q 10,-4 9,-7 Q 11,-9 9,-11" stroke="#94a3b8" strokeWidth="1.4" fill="none" opacity="0.6" />
            </g>
            {/* Second shed */}
            <g transform="translate(60,48)">
              <polygon points="0,8 12,2 24,8" fill="#334155" stroke="#0a0917" strokeWidth="0.4" />
              <rect x="0" y="8" width="24" height="14" fill="#475569" stroke="#0a0917" strokeWidth="0.4" />
              <rect x="3" y="11" width="4" height="4" fill="#fde68a" opacity="0.7" />
              <rect x="10" y="11" width="4" height="4" fill="#fde68a" opacity="0.7" />
              <rect x="17" y="11" width="4" height="4" fill="#fde68a" opacity="0.7" />
            </g>
            {/* Trucks on road */}
            <g transform="translate(18,68)">
              <rect x="0" y="0" width="14" height="6" fill="#b45309" />
              <rect x="14" y="2" width="4" height="4" fill="#94a3b8" />
              <circle cx="4" cy="6" r="2" fill="#0a0917" />
              <circle cx="12" cy="6" r="2" fill="#0a0917" />
              <circle cx="16" cy="6" r="2" fill="#0a0917" />
            </g>
            <g transform="translate(60,72)">
              <rect x="0" y="0" width="14" height="6" fill="#0891b2" />
              <rect x="14" y="2" width="4" height="4" fill="#94a3b8" />
              <circle cx="4" cy="6" r="2" fill="#0a0917" />
              <circle cx="12" cy="6" r="2" fill="#0a0917" />
            </g>
            {/* Road */}
            <rect x="14" y="64" width="72" height="3" fill="#1c1917" />
            <line x1="14" y1="65.5" x2="86" y2="65.5" stroke="#facc15" strokeWidth="0.3" strokeDasharray="2 2" />
            {/* Labels */}
            <text x="50" y="14" textAnchor="middle" fontSize="3.2" fill={ACCENT} fontWeight="700">Factory Complex</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.6" fill="#a89880">8 factors of location</text>
            <text x="50" y="96" textAnchor="middle" fontSize="2.4" fill="#a89880">raw material · market · labor · power</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={50} y={16} accent={ACCENT} selected={is("industrial-location")} preview={preview} onClick={sel("industrial-location")} />

        {/* LEFT — Agro-based industries */}
        <Hotspot id="agro-based" selected={is("agro-based")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "16%", width: "22%", height: "62%" }}
          label="Agro-based">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,20,0.65)" />
            <text x="50" y="8" textAnchor="middle" fontSize="4.6" fill={ACCENT} fontWeight="700">Agro-based</text>
            {/* Cotton textile (bale of cotton) */}
            <g transform="translate(8,12)">
              <rect x="0" y="6" width="22" height="14" rx="2" fill="#fff" stroke="#1a1208" strokeWidth="0.5" />
              <rect x="2" y="8" width="18" height="3" fill="#fbbf24" />
              <text x="11" y="18" textAnchor="middle" fontSize="2.4" fill="#0a0917" fontWeight="700">COTTON</text>
              <text x="11" y="26" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Mumbai · Ahmedabad</text>
            </g>
            {/* Jute (jute bag) */}
            <g transform="translate(40,12)">
              <polygon points="0,4 22,4 20,22 2,22" fill="#a16207" stroke="#1a1208" strokeWidth="0.5" />
              <line x1="0" y1="4" x2="22" y2="4" stroke="#7c2d12" strokeWidth="0.6" />
              <text x="11" y="14" textAnchor="middle" fontSize="2.2" fill="#fff" fontWeight="700">JUTE</text>
              <text x="11" y="26" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Hooghly basin</text>
            </g>
            {/* Sugar mill (sugarcane) */}
            <g transform="translate(72,12)">
              <rect x="2" y="2" width="3" height="20" fill="#65a30d" />
              <rect x="6" y="4" width="3" height="18" fill="#65a30d" />
              <rect x="10" y="2" width="3" height="20" fill="#65a30d" />
              <rect x="14" y="4" width="3" height="18" fill="#65a30d" />
              <text x="10" y="26" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Sugar · UP/MH</text>
            </g>
            {/* Silk (cocoon) */}
            <g transform="translate(10,40)">
              <ellipse cx="10" cy="10" rx="8" ry="6" fill="#fef3c7" stroke="#1a1208" strokeWidth="0.5" />
              <path d="M 2,10 Q 10,4 18,10 M 2,12 Q 10,6 18,12" stroke="#f59e0b" strokeWidth="0.4" fill="none" />
              <text x="10" y="24" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Silk · Bangalore</text>
            </g>
            {/* Coffee (cup) */}
            <g transform="translate(46,40)">
              <path d="M 0,4 L 0,16 Q 0,22 6,22 L 16,22 Q 22,22 22,16 L 22,4 Z" fill="#92400e" stroke="#1a1208" strokeWidth="0.5" />
              <ellipse cx="11" cy="4" rx="11" ry="2" fill="#3b2410" />
              <path d="M 22,8 Q 28,8 28,14 Q 28,18 22,18" fill="none" stroke="#1a1208" strokeWidth="0.6" />
              <text x="11" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Coffee · Karnataka</text>
            </g>
            {/* Tea (leaf) */}
            <g transform="translate(78,40)">
              <path d="M 10,2 Q 4,8 4,16 Q 4,22 10,22 Q 16,22 16,16 Q 16,8 10,2 Z" fill="#166534" stroke="#0a0917" strokeWidth="0.4" />
              <line x1="10" y1="2" x2="10" y2="22" stroke="#0a0917" strokeWidth="0.4" />
              <text x="10" y="28" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Tea · Assam</text>
            </g>
            {/* Bottom note */}
            <text x="50" y="80" textAnchor="middle" fontSize="3" fill={ACCENT} fontWeight="700">Agricultural raw materials</text>
            <text x="50" y="86" textAnchor="middle" fontSize="2.6" fill="#a89880">Cotton · Jute · Sugar · Silk · Tea</text>
            <text x="50" y="94" textAnchor="middle" fontSize="2.6" fill="#a89880">Coir · Edible oil · Food processing</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={16} y={14} accent={ACCENT} selected={is("agro-based")} preview={preview} onClick={sel("agro-based")} />

        {/* RIGHT — Mineral-based industries */}
        <Hotspot id="mineral-based" selected={is("mineral-based")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "16%", width: "22%", height: "62%" }}
          label="Mineral-based">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,20,0.65)" />
            <text x="50" y="8" textAnchor="middle" fontSize="4.6" fill={ACCENT} fontWeight="700">Mineral-based</text>
            {/* Iron & steel — I-beam */}
            <g transform="translate(8,12)">
              <polygon points="0,2 22,2 22,6 14,6 14,18 22,18 22,22 0,22 0,18 8,18 8,6 0,6" fill="#64748b" stroke="#0a0917" strokeWidth="0.5" />
              <text x="11" y="28" textAnchor="middle" fontSize="2.4" fill="#e5e7eb" fontWeight="600">Steel · Jamshedpur</text>
              <text x="11" y="32" textAnchor="middle" fontSize="2" fill="#a89880">TISCO 1912 · Bhilai · Rourkela</text>
            </g>
            {/* Aluminum — ingots */}
            <g transform="translate(40,18)">
              <polygon points="0,0 16,0 18,6 -2,6" fill="#cbd5e1" stroke="#0a0917" strokeWidth="0.4" />
              <polygon points="0,8 16,8 18,14 -2,14" fill="#cbd5e1" stroke="#0a0917" strokeWidth="0.4" />
              <text x="8" y="22" textAnchor="middle" fontSize="2.6" fill="#e5e7eb" fontWeight="600">Al · Renukoot</text>
              <text x="8" y="26" textAnchor="middle" fontSize="2" fill="#a89880">NALCO · BALCO</text>
            </g>
            {/* Cement bag */}
            <g transform="translate(70,16)">
              <rect x="0" y="2" width="20" height="20" rx="2" fill="#e7e5e4" stroke="#0a0917" strokeWidth="0.5" />
              <text x="10" y="11" textAnchor="middle" fontSize="2.6" fill="#0a0917" fontWeight="800">CEMENT</text>
              <text x="10" y="26" textAnchor="middle" fontSize="2.4" fill="#e5e7eb" fontWeight="600">Limestone-based</text>
            </g>
            {/* Blast furnace */}
            <g transform="translate(10,48)">
              <polygon points="0,18 24,18 18,2 6,2" fill="#1c1917" stroke="#475569" strokeWidth="0.5" />
              <rect x="9" y="18" width="6" height="6" fill="#dc2626" />
              <path d="M 12,2 Q 12,-3 14,0 Q 16,-2 14,2" fill="#f97316" />
              <text x="12" y="30" textAnchor="middle" fontSize="2.4" fill="#e5e7eb" fontWeight="600">Blast furnace</text>
              <text x="12" y="34" textAnchor="middle" fontSize="2" fill="#a89880">Durgapur · Bokaro</text>
            </g>
            {/* Machinery gear */}
            <g transform="translate(48,48)">
              <circle cx="10" cy="12" r="8" fill="#475569" stroke="#0a0917" strokeWidth="0.5" />
              <circle cx="10" cy="12" r="3" fill="#0a0917" />
              <rect x="9" y="2" width="2" height="3" fill="#475569" />
              <rect x="9" y="20" width="2" height="3" fill="#475569" />
              <rect x="0" y="11" width="3" height="2" fill="#475569" />
              <rect x="17" y="11" width="3" height="2" fill="#475569" />
              <text x="10" y="30" textAnchor="middle" fontSize="2.4" fill="#e5e7eb" fontWeight="600">Heavy machines</text>
              <text x="10" y="34" textAnchor="middle" fontSize="2" fill="#a89880">Haridwar · Hyderabad</text>
            </g>
            {/* Copper */}
            <g transform="translate(76,48)">
              <polygon points="0,-3 3,1 -3,1" fill="#ea580c" stroke="#0a0917" strokeWidth="0.4" />
              <polygon points="0,4 3,8 -3,8" fill="#ea580c" stroke="#0a0917" strokeWidth="0.4" />
              <polygon points="-3,0 1,3 -3,3" fill="#ea580c" stroke="#0a0917" strokeWidth="0.4" />
              <polygon points="3,0 -1,3 3,3" fill="#ea580c" stroke="#0a0917" strokeWidth="0.4" />
              <text x="0" y="22" textAnchor="middle" fontSize="2.4" fill="#e5e7eb" fontWeight="600">Cu · Hindustan Copper</text>
            </g>
            <text x="50" y="92" textAnchor="middle" fontSize="2.6" fill="#a89880">Steel · Al · Cement · Machines · Cu</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={84} y={14} accent={ACCENT} selected={is("mineral-based")} preview={preview} onClick={sel("mineral-based")} />

        {/* Industrial clusters (small, bottom-center) */}
        <Hotspot id="clusters" selected={is("clusters")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "82%", width: "40%", height: "14%" }}
          label="Clusters">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,20,0.65)" rx="4" />
            <text x="50" y="14" textAnchor="middle" fontSize="4.4" fill={ACCENT} fontWeight="700">Industrial Clusters</text>
            {/* Pin markers */}
            <g>
              <path d="M 16,32 C 16,22 24,22 24,32 C 24,40 20,46 20,46 C 20,46 16,40 16,32 Z" fill={ACCENT} />
              <circle cx="20" cy="32" r="2.4" fill="#0a0917" />
              <text x="20" y="56" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">Mum-Pune</text>
            </g>
            <g>
              <path d="M 36,32 C 36,22 44,22 44,32 C 44,40 40,46 40,46 C 40,46 36,40 36,32 Z" fill={ACCENT} />
              <circle cx="40" cy="32" r="2.4" fill="#0a0917" />
              <text x="40" y="56" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">Delhi-NCR</text>
            </g>
            <g>
              <path d="M 56,32 C 56,22 64,22 64,32 C 64,40 60,46 60,46 C 60,46 56,40 56,32 Z" fill={ACCENT} />
              <circle cx="60" cy="32" r="2.4" fill="#0a0917" />
              <text x="60" y="56" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">Blr-Chen</text>
            </g>
            <g>
              <path d="M 76,32 C 76,22 84,22 84,32 C 84,40 80,46 80,46 C 80,46 76,40 76,32 Z" fill={ACCENT} />
              <circle cx="80" cy="32" r="2.4" fill="#0a0917" />
              <text x="80" y="56" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">Vapi-Vadodara</text>
            </g>
            <text x="50" y="74" textAnchor="middle" fontSize="3" fill={ACCENT} fontWeight="700">Agglomeration Economies</text>
            <text x="50" y="84" textAnchor="middle" fontSize="2.6" fill="#a89880">Many industries benefit by locating together</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.6" fill="#a89880">Shared infrastructure · labor · market</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={50} y={80} accent={ACCENT} selected={is("clusters")} preview={preview} onClick={sel("clusters")} />

        {/* Pollution control (small, bottom-left) */}
        <Hotspot id="pollution-control" selected={is("pollution-control")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "82%", width: "22%", height: "14%" }}
          label="Pollution Control">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,20,0.65)" rx="4" />
            <text x="50" y="12" textAnchor="middle" fontSize="4" fill={ACCENT} fontWeight="700">Pollution Control</text>
            {/* Smoke with red slash */}
            <g transform="translate(20,18)">
              <path d="M 0,30 Q 0,16 8,16 Q 8,8 16,8 Q 24,4 22,16 Q 30,16 28,30 Z" fill="#475569" opacity="0.85" />
              {/* Red slash */}
              <line x1="-4" y1="36" x2="34" y2="-2" stroke="#ef4444" strokeWidth="3" />
            </g>
            <text x="50" y="74" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">NTPC · electrostatic</text>
            <text x="50" y="82" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">precipitators · PM2.5</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.6" fill="#e5e7eb">Noise Act · water treat</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={16} y={80} accent={ACCENT} selected={is("pollution-control")} preview={preview} onClick={sel("pollution-control")} />

        <Plaque title="Manufacturing Industries" caption="Location · Agro · Mineral · Clusters · NCERT Geo Ch 10" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoManufacturingExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-manufacturing",
  chapterId: 10,
  track: "ssc",
  title: "Manufacturing Industries",
  subtitle: "SSC Geo · Ch 10",
  description:
    "A factory complex on an India-map backdrop, with agro-based and mineral-based industry icons, industrial cluster markers and a pollution-control symbol. Click each region to explore CBSE Class 10 Geography Chapter 10.",
  accent: "#0891b2",
  icon: "🏭",
  parts: [
    {
      id: "industrial-location",
      name: "Factors of Industrial Location",
      info: "Eight key factors: (1) Raw material (2) Market (3) Labour (4) Power (5) Capital (6) Transport (7) Land (8) Government policy. Example: Tata Steel at Jamshedpur (Sakchi) was sited near iron-ore (Noamundi), coal (Jharia), limestone, water (Subarnarekha & Kharkai rivers) and the Kolkata rail link — minimizing transport costs of bulky raw materials.",
    },
    {
      id: "agro-based",
      name: "Agro-based Industries",
      info: "Cotton textiles — Mumbai-Ahmedabad belt (humid climate, port, raw cotton, market). Jute textiles — Hooghly basin near Kolkata (raw jute, water, labour, port). Sugar industry — UP & Maharashtra near cane fields (sucrose loss after harvest). Silk — Bangalore (Karnataka, mulberry). Tea processing — Assam & West Bengal near gardens. Coir — Kerala.",
    },
    {
      id: "mineral-based",
      name: "Mineral-based Industries",
      info: "Iron & steel — TISCO at Jamshedpur (1912, India's first modern steel plant); public-sector Bhilai (Chhattisgarh), Durgapur (WB), Rourkela (Odisha), Bokaro (Jharkhand) set up with Soviet/British/German help. Aluminium — NALCO (Odisha), BALCO, Hindalco at Renukoot (UP). Cement — limestone-based plants in MP, Rajasthan, Andhra. Copper — Hindustan Copper Ltd.",
    },
    {
      id: "clusters",
      name: "Industrial Clusters in India",
      info: "Major clusters: Mumbai-Pune, Delhi-Ludhiana, Bangalore-Chennai, Vapi-Vadodara, Ahmedabad-Vadodara, Chotanagpur (mineral-based). Agglomeration economies — many industries gain by locating together: shared infrastructure, labour pool, suppliers, market access. SEZs (Special Economic Zones) post-2000 promote export-oriented clusters with tax benefits.",
    },
    {
      id: "pollution-control",
      name: "Industrial Pollution & Control",
      info: "Industries pollute air (particulate matter PM2.5/PM10, SO2, NOx), water (toxic effluents) and soil (sludge). NTPC — India's largest power producer — uses electrostatic precipitators to capture fly-ash. The Water (Prevention & Control of Pollution) Act 1974 and Air Act 1981 regulate discharges. The Noise Pollution (Regulation & Control) Rules 2000 cover noise. Remedies: treat waste at source, recycle, relocate units, use cleaner technology.",
    },
  ],
  Panel: GeoManufacturingPanel,
};
