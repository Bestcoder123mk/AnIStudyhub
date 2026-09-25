"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#84cc16";

const INDIA_PATH =
  "M 18,20 L 30,9 L 46,5 L 58,6 L 70,9 L 82,18 L 80,30 L 72,42 L 64,56 L 56,72 L 51,86 L 49,86 L 44,72 L 36,56 L 28,42 L 22,32 Z";

function GeoAgriculturePanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
          🌾 AGRICULTURE
        </div>

        {/* CENTER — India map with Kharif / Rabi / Zaid zones */}
        <Hotspot id="cropping-seasons" selected={is("cropping-seasons")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "20%", width: "40%", height: "56%" }}
          label="Cropping Seasons">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#1a1f0c" />
            {/* Land base */}
            <path d={INDIA_PATH} fill="#3a3a1f" stroke="#0a0917" strokeWidth="0.7" />
            {/* Kharif (monsoon) — most of the country, green */}
            <path d="M 22,30 L 30,42 L 36,56 L 32,52 L 24,42 L 20,32 Z" fill="#65a30d" opacity="0.88" />
            <path d="M 70,42 L 80,40 L 78,52 L 70,52 Z" fill="#65a30d" opacity="0.88" />
            <path d="M 38,60 L 50,72 L 44,72 L 38,66 Z" fill="#65a30d" opacity="0.88" />
            {/* Rabi (winter) — northern plains, amber */}
            <path d="M 30,11 L 46,7 L 58,8 L 70,11 L 72,22 L 58,26 L 42,26 L 28,22 Z" fill="#f59e0b" opacity="0.9" />
            {/* Zaid (summer) — small patches, orange */}
            <path d="M 48,28 L 60,28 L 58,38 L 50,38 Z" fill="#ea580c" opacity="0.92" />
            <path d="M 32,32 L 40,32 L 38,40 L 30,40 Z" fill="#ea580c" opacity="0.92" />
            {/* Labels */}
            <text x="50" y="16" textAnchor="middle" fontSize="3.4" fill="#1a1f0c" fontWeight="800">RABI</text>
            <text x="54" y="33" textAnchor="middle" fontSize="3.2" fill="#fff" fontWeight="800">ZAID</text>
            <text x="26" y="46" textAnchor="middle" fontSize="3" fill="#1a1f0c" fontWeight="700">KH</text>
            <text x="74" y="48" textAnchor="middle" fontSize="3" fill="#1a1f0c" fontWeight="700">KH</text>
            {/* Legend */}
            <g fontSize="3">
              <rect x="2" y="92" width="4" height="3" fill="#65a30d" /><text x="7" y="95" fill="#e5e7eb">Kharif</text>
              <rect x="22" y="92" width="4" height="3" fill="#f59e0b" /><text x="27" y="95" fill="#e5e7eb">Rabi</text>
              <rect x="40" y="92" width="4" height="3" fill="#ea580c" /><text x="45" y="95" fill="#e5e7eb">Zaid</text>
            </g>
            <text x="70" y="95" fontSize="3" fill="#94a3b8">Jun-Oct / Nov-Apr / Mar-Jun</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={50} y={16} accent={ACCENT} selected={is("cropping-seasons")} preview={preview} onClick={sel("cropping-seasons")} />

        {/* LEFT — Major crops icons */}
        <Hotspot id="major-crops" selected={is("major-crops")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "16%", width: "22%", height: "62%" }}
          label="Major Crops">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(14,22,8,0.65)" />
            <text x="50" y="8" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Major Crops</text>
            {/* Rice — stalk with grain */}
            <g transform="translate(8,12)">
              <line x1="6" y1="22" x2="6" y2="2" stroke="#84cc16" strokeWidth="1" />
              <ellipse cx="4" cy="4" rx="1.4" ry="2" fill="#facc15" />
              <ellipse cx="8" cy="5" rx="1.4" ry="2" fill="#facc15" />
              <ellipse cx="4" cy="9" rx="1.4" ry="2" fill="#facc15" />
              <ellipse cx="8" cy="10" rx="1.4" ry="2" fill="#facc15" />
              <ellipse cx="4" cy="14" rx="1.4" ry="2" fill="#facc15" />
              <ellipse cx="8" cy="15" rx="1.4" ry="2" fill="#facc15" />
            </g>
            <text x="14" y="38" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Rice · WB, AP</text>
            {/* Wheat — ear */}
            <g transform="translate(50,12)">
              <line x1="6" y1="22" x2="6" y2="2" stroke="#facc15" strokeWidth="1" />
              <ellipse cx="4" cy="4" rx="1.4" ry="2" fill="#fbbf24" />
              <ellipse cx="8" cy="5" rx="1.4" ry="2" fill="#fbbf24" />
              <ellipse cx="4" cy="9" rx="1.4" ry="2" fill="#fbbf24" />
              <ellipse cx="8" cy="10" rx="1.4" ry="2" fill="#fbbf24" />
              <ellipse cx="4" cy="14" rx="1.4" ry="2" fill="#fbbf24" />
              <ellipse cx="8" cy="15" rx="1.4" ry="2" fill="#fbbf24" />
            </g>
            <text x="56" y="38" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Wheat · UP, Pb</text>
            {/* Cotton — boll */}
            <g transform="translate(8,42)">
              <line x1="8" y1="22" x2="8" y2="6" stroke="#65a30d" strokeWidth="1" />
              <circle cx="5" cy="4" r="2.5" fill="#fff" />
              <circle cx="11" cy="6" r="2.5" fill="#fff" />
              <ellipse cx="8" cy="11" rx="4" ry="3" fill="#fff" />
              <path d="M 5,4 L 4,2 L 6,3 Z M 11,6 L 10,4 L 12,5 Z" fill="#65a30d" />
            </g>
            <text x="14" y="68" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Cotton · GJ, MH</text>
            {/* Jute — long fibers */}
            <g transform="translate(50,42)">
              <line x1="3" y1="2" x2="3" y2="22" stroke="#a16207" strokeWidth="0.7" />
              <line x1="6" y1="2" x2="6" y2="22" stroke="#a16207" strokeWidth="0.7" />
              <line x1="9" y1="2" x2="9" y2="22" stroke="#a16207" strokeWidth="0.7" />
              <line x1="12" y1="2" x2="12" y2="22" stroke="#a16207" strokeWidth="0.7" />
            </g>
            <text x="56" y="68" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Jute · WB</text>
            {/* Sugarcane — tall stalk */}
            <g transform="translate(8,72)">
              <rect x="3" y="0" width="3" height="22" fill="#65a30d" />
              <rect x="7" y="2" width="3" height="20" fill="#65a30d" />
              <rect x="11" y="0" width="3" height="22" fill="#65a30d" />
              <line x1="4.5" y1="4" x2="6" y2="6" stroke="#1a1f0c" strokeWidth="0.5" />
              <line x1="4.5" y1="10" x2="6" y2="12" stroke="#1a1f0c" strokeWidth="0.5" />
              <line x1="4.5" y1="16" x2="6" y2="18" stroke="#1a1f0c" strokeWidth="0.5" />
              <line x1="12.5" y1="4" x2="14" y2="6" stroke="#1a1f0c" strokeWidth="0.5" />
            </g>
            <text x="14" y="98" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Sugarcane · UP</text>
            {/* Tea — bush + leaf */}
            <g transform="translate(50,74)">
              <path d="M 0,22 Q 7,6 14,22 Z" fill="#166534" />
              <ellipse cx="7" cy="14" rx="3" ry="2" fill="#22c55e" />
              <ellipse cx="5" cy="10" rx="2" ry="1.5" fill="#22c55e" />
              <ellipse cx="9" cy="11" rx="2" ry="1.5" fill="#22c55e" />
            </g>
            <text x="56" y="98" fontSize="3.4" fill="#e5e7eb" fontWeight="600">Tea · Assam</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={16} y={14} accent={ACCENT} selected={is("major-crops")} preview={preview} onClick={sel("major-crops")} />

        {/* RIGHT — Types of farming */}
        <Hotspot id="farming-types" selected={is("farming-types")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "16%", width: "22%", height: "44%" }}
          label="Types of Farming">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(14,22,8,0.65)" />
            <text x="50" y="8" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">Types of Farming</text>
            {/* Primitive subsistence — small clearing */}
            <g transform="translate(4,12)">
              <rect x="0" y="0" width="30" height="22" fill="#3a3a1f" />
              {/* slashed tree stumps */}
              <rect x="3" y="14" width="3" height="6" fill="#3b2410" />
              <rect x="22" y="14" width="3" height="6" fill="#3b2410" />
              {/* small crop */}
              <line x1="13" y1="20" x2="13" y2="14" stroke="#84cc16" strokeWidth="1" />
              <line x1="16" y1="20" x2="16" y2="14" stroke="#84cc16" strokeWidth="1" />
              {/* smoke from burning */}
              <path d="M 8,4 Q 10,1 12,4 Q 14,1 16,4" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
            </g>
            <text x="19" y="38" textAnchor="middle" fontSize="3" fill="#e5e7eb">Primitive</text>
            <text x="19" y="42" textAnchor="middle" fontSize="2.6" fill="#a89880">Shifting · NE India</text>
            {/* Intensive subsistence — dense small plots */}
            <g transform="translate(36,12)">
              <rect x="0" y="0" width="30" height="22" fill="#3a3a1f" />
              {[0, 6, 12, 18, 24].map((x) =>
                [0, 5, 10, 15].map((y) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="5" height="4" fill="#84cc16" opacity="0.85" />
                ))
              )}
            </g>
            <text x="51" y="38" textAnchor="middle" fontSize="3" fill="#e5e7eb">Intensive</text>
            <text x="51" y="42" textAnchor="middle" fontSize="2.6" fill="#a89880">High inputs small land</text>
            {/* Commercial — large plantation */}
            <g transform="translate(68,12)">
              <rect x="0" y="0" width="30" height="22" fill="#3a3a1f" />
              {[6, 14, 22].map((x) => (
                <g key={x}>
                  <line x1={x} y1="20" x2={x} y2="8" stroke="#15803d" strokeWidth="1.4" />
                  <ellipse cx={x} cy="6" rx="4" ry="3" fill="#166534" />
                </g>
              ))}
            </g>
            <text x="83" y="38" textAnchor="middle" fontSize="3" fill="#e5e7eb">Commercial</text>
            <text x="83" y="42" textAnchor="middle" fontSize="2.6" fill="#a89880">Plantations</text>
            {/* Bottom note */}
            <text x="50" y="92" textAnchor="middle" fontSize="3" fill="#facc15">Subsistence vs Commercial</text>
            <text x="50" y="97" textAnchor="middle" fontSize="2.8" fill="#a89880">High inputs · small vs large land</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={84} y={14} accent={ACCENT} selected={is("farming-types")} preview={preview} onClick={sel("farming-types")} />

        {/* Green revolution — small, right-bottom */}
        <Hotspot id="green-revolution" selected={is("green-revolution")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "62%", width: "22%", height: "16%" }}
          label="Green Revolution">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(14,22,8,0.65)" rx="4" />
            {/* Wheat stalk + tag */}
            <g transform="translate(8,12)">
              <line x1="6" y1="40" x2="6" y2="4" stroke="#facc15" strokeWidth="1.4" />
              <ellipse cx="4" cy="6" rx="1.8" ry="3" fill="#fbbf24" />
              <ellipse cx="8" cy="8" rx="1.8" ry="3" fill="#fbbf24" />
              <ellipse cx="4" cy="14" rx="1.8" ry="3" fill="#fbbf24" />
              <ellipse cx="8" cy="16" rx="1.8" ry="3" fill="#fbbf24" />
              <ellipse cx="4" cy="22" rx="1.8" ry="3" fill="#fbbf24" />
            </g>
            <rect x="38" y="10" width="56" height="20" rx="2" fill="#1a1f0c" stroke={ACCENT} strokeWidth="0.8" />
            <text x="66" y="20" textAnchor="middle" fontSize="6" fill={ACCENT} fontWeight="800">1960s</text>
            <text x="66" y="27" textAnchor="middle" fontSize="3.2" fill="#e5e7eb">HYV · M.S. Swaminathan</text>
            <text x="50" y="42" textAnchor="middle" fontSize="3" fill="#facc15">Punjab · Haryana</text>
            <text x="50" y="48" textAnchor="middle" fontSize="2.8" fill="#a89880">Food self-sufficiency</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={84} y={60} accent={ACCENT} selected={is("green-revolution")} preview={preview} onClick={sel("green-revolution")} />

        {/* Land reforms scroll — small, bottom-left */}
        <Hotspot id="land-reforms" selected={is("land-reforms")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "80%", width: "22%", height: "16%" }}
          label="Land Reforms">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(14,22,8,0.65)" rx="4" />
            {/* Scroll */}
            <rect x="14" y="28" width="72" height="34" rx="2" fill="#fde68a" stroke={ACCENT} strokeWidth="1.2" />
            <ellipse cx="14" cy="45" rx="6" ry="17" fill="#fbbf24" stroke={ACCENT} strokeWidth="1" />
            <ellipse cx="86" cy="45" rx="6" ry="17" fill="#fbbf24" stroke={ACCENT} strokeWidth="1" />
            <line x1="26" y1="36" x2="74" y2="36" stroke={ACCENT} strokeWidth="0.6" />
            <line x1="26" y1="44" x2="74" y2="44" stroke={ACCENT} strokeWidth="0.6" />
            <line x1="26" y1="52" x2="74" y2="52" stroke={ACCENT} strokeWidth="0.6" />
            <text x="50" y="18" textAnchor="middle" fontSize="5.5" fill={ACCENT} fontWeight="700">Land Reforms</text>
            <text x="50" y="74" textAnchor="middle" fontSize="3" fill="#e5e7eb">Abolish zamindari · ceilings</text>
            <text x="50" y="80" textAnchor="middle" fontSize="3" fill="#e5e7eb">Tenancy · co-operative farming</text>
            <text x="50" y="92" textAnchor="middle" fontSize="2.8" fill="#a89880">Post-Independence</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={16} y={78} accent={ACCENT} selected={is("land-reforms")} preview={preview} onClick={sel("land-reforms")} />

        <Plaque title="Agriculture" caption="Cropping seasons · crops · farming types · NCERT Geo Ch 8" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoAgricultureExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-agriculture",
  chapterId: 8,
  track: "ssc",
  title: "Agriculture",
  subtitle: "SSC Geo · Ch 8",
  description:
    "A stylized India map with Kharif/Rabi/Zaid cropping zones, major crops, farming types, Green Revolution icon and Land Reforms scroll. Click each region to explore CBSE Class 10 Geography Chapter 8.",
  accent: "#84cc16",
  icon: "🌾",
  parts: [
    {
      id: "cropping-seasons",
      name: "Cropping Seasons",
      info: "India has three cropping seasons. Kharif (June–October, monsoon): rice, maize, pigeon pea (tur), groundnut, soyabean. Rabi (November–April, winter): wheat, barley, gram, mustard, peas. Zaid (March–June, summer): watermelon, muskmelon, cucumber, fodder — grown on irrigated land between Rabi and Kharif.",
    },
    {
      id: "major-crops",
      name: "Major Crops of India",
      info: "Rice — West Bengal, Andhra Pradesh, Uttar Pradesh (staple of 60% Indians). Wheat — UP, Punjab, Haryana (winter crop, 2nd staple). Cotton — Gujarat, Maharashtra, Telangana (kharif, fibre). Jute — West Bengal, Bihar, Assam (golden fibre). Tea — Assam, West Bengal (Hills), leading producer & exporter. Sugarcane — UP, Maharashtra (cash crop).",
    },
    {
      id: "farming-types",
      name: "Types of Farming",
      info: "Primitive subsistence — shifting cultivation ('Bewar'/'Podu'/'Jhum' in NE, 'Krish' in MP), small clearings, low yield. Intensive subsistence — high inputs (labour, fertilizer) on small landholdings (Ganga plains, Kerala). Commercial farming — large-scale plantations using capital, high-yielding varieties and modern inputs (tea, coffee, sugarcane, cotton).",
    },
    {
      id: "green-revolution",
      name: "Green Revolution",
      info: "Introduced in the late 1960s by M.S. Swaminathan & Norman Borlaug. Used High-Yielding Variety (HYV) seeds, chemical fertilizers and pesticides, particularly for wheat in Punjab, Haryana and western UP. India achieved food self-sufficiency by the 1970s but concerns include soil degradation, water depletion and socio-economic inequality.",
    },
    {
      id: "land-reforms",
      name: "Land Reforms",
      info: "Post-Independence measures: (1) Abolition of intermediaries — zamindari, jagirdari systems (2) Tenancy reforms — regulation of rent, security of tenure, ownership rights (3) Ceilings on landholdings — surplus land redistributed (4) Consolidation of fragmented holdings (5) Cooperative & collective farming. Implementation was uneven across states.",
    },
  ],
  Panel: GeoAgriculturePanel,
};
