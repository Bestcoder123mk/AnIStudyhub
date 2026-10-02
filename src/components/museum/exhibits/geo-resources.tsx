"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#22c55e";

// Stylized India-ish landmass silhouette (original art — not a precise NCERT trace)
const INDIA_PATH =
  "M 18,20 L 30,9 L 46,5 L 58,6 L 70,9 L 82,18 L 80,30 L 72,42 L 64,56 L 56,72 L 51,86 L 49,86 L 44,72 L 36,56 L 28,42 L 22,32 Z";

function GeoResourcesPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
          🗺️ RESOURCES &amp; DEVELOPMENT
        </div>

        {/* CENTER — Stylized land-use map */}
        <Hotspot id="land-use" selected={is("land-use")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "32%", top: "20%", width: "38%", height: "54%" }}
          label="Land Use">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            {/* Sea backdrop */}
            <rect x="0" y="0" width="100" height="100" fill="#0b1d2e" />
            {/* Landmass base */}
            <path d={INDIA_PATH} fill="#3a2f1f" stroke="#1a1208" strokeWidth="0.7" />
            {/* Forest (north band) — dark green */}
            <path d="M 30,11 L 46,7 L 58,8 L 70,11 L 72,22 L 58,26 L 42,26 L 28,22 Z" fill="#166534" opacity="0.92" />
            {/* Crops (central) — yellow */}
            <path d="M 28,22 L 42,26 L 58,26 L 72,22 L 74,32 L 64,42 L 50,46 L 36,42 L 26,32 Z" fill="#eab308" opacity="0.9" />
            {/* Pasture (west) — light green */}
            <path d="M 22,32 L 26,32 L 36,42 L 32,52 L 24,52 L 20,42 Z" fill="#86efac" opacity="0.88" />
            {/* Urban (east strip) — grey */}
            <path d="M 64,42 L 74,32 L 78,42 L 72,52 L 66,52 Z" fill="#6b7280" opacity="0.9" />
            {/* Wasteland (lower) — brown */}
            <path d="M 36,42 L 50,46 L 64,42 L 66,52 L 60,64 L 50,72 L 40,64 L 32,52 Z" fill="#92400e" opacity="0.88" />
            {/* Water (south tip) — blue */}
            <path d="M 40,64 L 50,72 L 49,86 L 51,86 L 60,64 L 50,72 Z" fill="#0ea5e9" opacity="0.85" />
            {/* Legend swatches */}
            <g fontSize="3" fill="#e5e7eb">
              <rect x="2" y="92" width="4" height="3" fill="#166534" /><text x="7" y="95">Forest</text>
              <rect x="18" y="92" width="4" height="3" fill="#eab308" /><text x="23" y="95">Crops</text>
              <rect x="34" y="92" width="4" height="3" fill="#86efac" /><text x="39" y="95">Pasture</text>
              <rect x="52" y="92" width="4" height="3" fill="#6b7280" /><text x="57" y="95">Urban</text>
              <rect x="68" y="92" width="4" height="3" fill="#92400e" /><text x="73" y="95">Waste</text>
              <rect x="84" y="92" width="4" height="3" fill="#0ea5e9" /><text x="89" y="95">Water</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={1} x={51} y={16} accent={ACCENT} selected={is("land-use")} preview={preview} onClick={sel("land-use")} />

        {/* LEFT — Resource classification tree */}
        <Hotspot id="classification" selected={is("classification")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "26%", width: "24%", height: "44%" }}
          label="Classification">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(8,20,12,0.55)" />
            {/* Root */}
            <rect x="32" y="5" width="36" height="9" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.9" />
            <text x="50" y="11" textAnchor="middle" fontSize="4.5" fill={ACCENT} fontWeight="700">Resources</text>
            {/* Branches */}
            <line x1="50" y1="14" x2="22" y2="26" stroke={ACCENT} strokeWidth="0.7" />
            <line x1="50" y1="14" x2="78" y2="26" stroke={ACCENT} strokeWidth="0.7" />
            <rect x="4" y="26" width="36" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.7" />
            <text x="22" y="31.5" textAnchor="middle" fontSize="4" fill={ACCENT}>Natural</text>
            <rect x="60" y="26" width="36" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.7" />
            <text x="78" y="31.5" textAnchor="middle" fontSize="4" fill={ACCENT}>Human-made</text>
            {/* Sub branches */}
            <line x1="22" y1="34" x2="12" y2="46" stroke={ACCENT} strokeWidth="0.5" />
            <line x1="22" y1="34" x2="32" y2="46" stroke={ACCENT} strokeWidth="0.5" />
            <line x1="78" y1="34" x2="68" y2="46" stroke={ACCENT} strokeWidth="0.5" />
            <line x1="78" y1="34" x2="88" y2="46" stroke={ACCENT} strokeWidth="0.5" />
            <rect x="0" y="46" width="24" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.5" />
            <text x="12" y="51.5" textAnchor="middle" fontSize="3.6" fill={ACCENT}>Renewable</text>
            <rect x="22" y="46" width="26" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.5" />
            <text x="35" y="51.5" textAnchor="middle" fontSize="3.6" fill={ACCENT}>Non-renewable</text>
            <rect x="54" y="46" width="26" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.5" />
            <text x="67" y="51.5" textAnchor="middle" fontSize="3.6" fill={ACCENT}>Biotic</text>
            <rect x="78" y="46" width="22" height="8" rx="2" fill="#1f2d22" stroke={ACCENT} strokeWidth="0.5" />
            <text x="89" y="51.5" textAnchor="middle" fontSize="3.6" fill={ACCENT}>Abiotic</text>
            <text x="12" y="59" textAnchor="middle" fontSize="3" fill="#a89880">solar, wind</text>
            <text x="35" y="59" textAnchor="middle" fontSize="3" fill="#a89880">coal, petrol</text>
            <text x="67" y="59" textAnchor="middle" fontSize="3" fill="#a89880">flora, fauna</text>
            <text x="89" y="59" textAnchor="middle" fontSize="3" fill="#a89880">rocks, metals</text>
            {/* Bottom note */}
            <rect x="6" y="70" width="88" height="22" rx="2" fill="rgba(0,0,0,0.35)" stroke={ACCENT} strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="50" y="78" textAnchor="middle" fontSize="3.4" fill="#e5e7eb" fontWeight="700">By Ownership</text>
            <text x="50" y="84" textAnchor="middle" fontSize="3" fill="#a89880">Individual · Community · National · International</text>
            <text x="50" y="89" textAnchor="middle" fontSize="3" fill="#a89880">(groundwater, village ponds, roads, oceanic)</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={17} y={24} accent={ACCENT} selected={is("classification")} preview={preview} onClick={sel("classification")} />

        {/* RIGHT — Sustainable development */}
        <Hotspot id="sustainable" selected={is("sustainable")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "26%", width: "22%", height: "34%" }}
          label="Sustainable">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(8,20,12,0.55)" />
            {/* Circular arrows */}
            <path d="M 50,15 A 35,35 0 0 1 85,50 L 79,46 L 91,50 L 84,58 L 85,50 A 29,29 0 0 0 56,21 L 52,15 Z"
              fill="none" stroke={ACCENT} strokeWidth="2.4" />
            <path d="M 50,85 A 35,35 0 0 1 15,50 L 21,54 L 9,50 L 16,42 L 15,50 A 29,29 0 0 0 44,79 L 48,85 Z"
              fill="none" stroke={ACCENT} strokeWidth="2.4" />
            {/* Leaf in center */}
            <path d="M 50,38 C 38,38 30,48 30,58 C 30,68 40,72 50,68 C 60,72 70,68 70,58 C 70,48 62,38 50,38 Z"
              fill={ACCENT} opacity="0.78" />
            <path d="M 50,42 L 50,68" stroke="#06210f" strokeWidth="1.4" />
            <path d="M 50,52 L 42,48 M 50,56 L 58,52" stroke="#06210f" strokeWidth="0.8" />
            <text x="50" y="96" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Brundtland · 1987</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={84} y={24} accent={ACCENT} selected={is("sustainable")} preview={preview} onClick={sel("sustainable")} />

        {/* BOTTOM — Soil types chip row */}
        <Hotspot id="soil-types" selected={is("soil-types")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "22%", top: "76%", width: "56%", height: "12%" }}
          label="Soil Types">
          <div style={{ display: "flex", gap: 6, height: "100%", alignItems: "center", justifyContent: "center", padding: "0 6px", background: "rgba(8,20,12,0.55)" }}>
            {[
              { c: "#d97706", t: "Alluvial" },
              { c: "#1c1917", t: "Black" },
              { c: "#dc2626", t: "Red" },
              { c: "#92400e", t: "Laterite" },
              { c: "#d4a373", t: "Arid" },
            ].map((s) => (
              <div key={s.t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{ width: 24, height: 14, background: s.c, borderRadius: 3, border: "1px solid #000" }} />
                <span style={{ fontSize: 8, color: "#e5e7eb", fontWeight: 600 }}>{s.t}</span>
              </div>
            ))}
          </div>
        </Hotspot>
        <Tag n={4} x={50} y={74} accent={ACCENT} selected={is("soil-types")} preview={preview} onClick={sel("soil-types")} />

        {/* Planning scroll (small, bottom-left) */}
        <Hotspot id="planning" selected={is("planning")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "74%", width: "14%", height: "16%" }}
          label="Planning">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(8,20,12,0.55)" />
            {/* Scroll */}
            <rect x="14" y="32" width="72" height="40" rx="2" fill="#fde68a" stroke={ACCENT} strokeWidth="1.4" />
            <ellipse cx="14" cy="52" rx="6" ry="20" fill="#fbbf24" stroke={ACCENT} strokeWidth="1" />
            <ellipse cx="86" cy="52" rx="6" ry="20" fill="#fbbf24" stroke={ACCENT} strokeWidth="1" />
            <line x1="26" y1="42" x2="74" y2="42" stroke={ACCENT} strokeWidth="0.8" />
            <line x1="26" y1="52" x2="74" y2="52" stroke={ACCENT} strokeWidth="0.8" />
            <line x1="26" y1="62" x2="74" y2="62" stroke={ACCENT} strokeWidth="0.8" />
            <text x="50" y="22" textAnchor="middle" fontSize="6" fill={ACCENT} fontWeight="700">5-Yr Plans</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={12} y={73} accent={ACCENT} selected={is("planning")} preview={preview} onClick={sel("planning")} />

        <Plaque title="Resources and Development" caption="Land use · classification · soil · planning · NCERT Geo Ch 5" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoResourcesExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-resources",
  chapterId: 5,
  track: "ssc",
  title: "Resources & Development",
  subtitle: "SSC Geo · Ch 5",
  description:
    "A stylized land-use map of India with resource classification, sustainable development, soil types and resource planning. Click each region to explore CBSE Class 10 Geography Chapter 5.",
  accent: "#22c55e",
  icon: "🗺️",
  parts: [
    {
      id: "land-use",
      name: "Land Utilization",
      info: "India's land-use categories: Net Sown Area ~46%, Forest ~22%, Barren & Wasteland ~8%, Fallow lands ~8%, Pasture & Grazing ~4%, Non-agricultural uses ~5%, Tree Crops ~1%. The National Forest Policy targets 33% forest cover in plains and 67% in hills. Land-use data is reported by the Ministry of Agriculture.",
    },
    {
      id: "classification",
      name: "Resource Classification",
      info: "Resources are classified by: origin (Biotic = flora/fauna/human; Abiotic = rocks/metals/land), exhaustibility (Renewable = solar/wind/water; Non-renewable = coal/petroleum/minerals), development (Potential/Developed/Stock/Reserves), and ownership (Individual/Community/National/International).",
    },
    {
      id: "sustainable",
      name: "Sustainable Development",
      info: "The Brundtland Commission (1987) defined sustainable development as 'development that meets the needs of the present without compromising the ability of future generations to meet their own needs.' The Rio Earth Summit (1992) adopted Agenda 21 — a global programme for sustainable resource use and conservation.",
    },
    {
      id: "soil-types",
      name: "Soil Types of India",
      info: "Alluvial (43% — Indo-Gangetic plains, rice/wheat), Black/Regur (15% — Maharashtra-Gujarat, cotton), Red (18.5% — iron-rich, eastern Deccan), Laterite (leached, Western Ghats — cashew, plantation crops), Arid/Desert (Rajasthan), Mountain (Himalayan belts). ICAR-NBSS&LUP classifies and maps Indian soils; NMCG covers land in Ganga basin.",
    },
    {
      id: "planning",
      name: "Resource Planning in India",
      info: "Resource planning is essential for balanced development. India's Five-Year Plans since 1951 prioritized resource survey, identification and balanced use. Jharkhand example: rich in minerals & forests but lacks water & infrastructure — needed balanced planning combining mining, irrigation (Damodar Valley) and conservation. Resource conservation at individual & community level (e.g., water harvesting) is equally important.",
    },
  ],
  Panel: GeoResourcesPanel,
};
