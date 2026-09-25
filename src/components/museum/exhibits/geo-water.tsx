"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#0ea5e9";

function GeoWaterPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
          💧 WATER RESOURCES
        </div>

        {/* CENTER — Dam cross-section */}
        <Hotspot id="dam" selected={is("dam")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "28%", top: "18%", width: "44%", height: "52%" }}
          label="Multi-purpose Dam">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="#06141f" />
            {/* Sky */}
            <rect x="0" y="0" width="100" height="38" fill="#0b2538" opacity="0.6" />
            {/* Sun */}
            <circle cx="84" cy="14" r="5" fill="#fde68a" opacity="0.6" />
            {/* Reservoir water (behind dam, left) */}
            <path d="M 0,38 L 38,38 L 38,80 L 0,80 Z" fill="#0ea5e9" opacity="0.85" />
            {/* Water ripples */}
            <path d="M 0,40 Q 9,38 18,40 T 36,40" stroke="#bae6fd" strokeWidth="0.5" fill="none" />
            <path d="M 0,44 Q 9,42 18,44 T 36,44" stroke="#bae6fd" strokeWidth="0.4" fill="none" />
            <path d="M 0,48 Q 9,46 18,48 T 36,48" stroke="#bae6fd" strokeWidth="0.4" fill="none" />
            {/* Dam wall (trapezoid) */}
            <polygon points="38,20 46,20 50,90 42,90" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.6" />
            <line x1="40" y1="30" x2="44" y2="30" stroke="#1e293b" strokeWidth="0.4" />
            <line x1="40" y1="40" x2="44" y2="40" stroke="#1e293b" strokeWidth="0.4" />
            <line x1="41" y1="55" x2="45" y2="55" stroke="#1e293b" strokeWidth="0.4" />
            <line x1="42" y1="70" x2="46" y2="70" stroke="#1e293b" strokeWidth="0.4" />
            {/* Spillway (top of dam) */}
            <path d="M 38,20 Q 42,16 46,20" fill="none" stroke="#0ea5e9" strokeWidth="1.4" />
            {/* Water pouring over spillway */}
            <path d="M 46,20 L 56,40 L 56,60 L 50,60 L 50,40 Z" fill="#7dd3fc" opacity="0.85" />
            {/* Turbines at base (downstream side) */}
            <rect x="50" y="64" width="8" height="14" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
            <rect x="62" y="64" width="8" height="14" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
            <circle cx="54" cy="71" r="3" fill="#facc15" />
            <circle cx="66" cy="71" r="3" fill="#facc15" />
            {/* Downstream water (right) */}
            <path d="M 50,78 L 100,78 L 100,90 L 50,90 Z" fill="#0ea5e9" opacity="0.78" />
            <path d="M 50,80 Q 65,78 80,80 T 100,80" stroke="#bae6fd" strokeWidth="0.4" fill="none" />
            {/* Power lines */}
            <line x1="62" y1="64" x2="62" y2="46" stroke="#1e293b" strokeWidth="0.5" />
            <line x1="74" y1="64" x2="74" y2="46" stroke="#1e293b" strokeWidth="0.5" />
            <line x1="56" y1="46" x2="80" y2="46" stroke="#1e293b" strokeWidth="0.5" />
            <path d="M 56,46 L 60,42 L 64,46 L 68,42 L 72,46 L 76,42 L 80,46" stroke="#1e293b" strokeWidth="0.4" fill="none" />
            {/* Labels */}
            <text x="18" y="36" textAnchor="middle" fontSize="3.4" fill="#bae6fd">Reservoir</text>
            <text x="44" y="14" textAnchor="middle" fontSize="3.4" fill="#e2e8f0" fontWeight="700">Dam wall</text>
            <text x="68" y="62" textAnchor="middle" fontSize="3.4" fill="#facc15">Turbines → Power</text>
            <text x="20" y="92" textAnchor="middle" fontSize="3" fill="#94a3b8">Bhakra · Hirakud · Damodar Valley</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={50} y={16} accent={ACCENT} selected={is("dam")} preview={preview} onClick={sel("dam")} />

        {/* LEFT — River system */}
        <Hotspot id="river-system" selected={is("river-system")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "16%", width: "22%", height: "60%" }}
          label="River System">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,24,0.65)" />
            <text x="50" y="9" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700">River System</text>
            {/* Mountains (source) */}
            <polygon points="0,18 12,6 24,18" fill="#475569" opacity="0.7" />
            <polygon points="14,18 26,8 38,18" fill="#475569" opacity="0.7" />
            <polygon points="28,18 40,6 52,18" fill="#475569" opacity="0.7" />
            {/* Main river */}
            <path d="M 26,18 Q 32,30 28,40 Q 24,52 32,60 Q 40,68 36,80 Q 32,88 40,94"
              stroke={ACCENT} strokeWidth="3" fill="none" />
            {/* Tributary 1 */}
            <path d="M 40,18 Q 36,28 32,40" stroke={ACCENT} strokeWidth="1.6" fill="none" />
            {/* Tributary 2 */}
            <path d="M 50,24 Q 42,40 34,52" stroke={ACCENT} strokeWidth="1.6" fill="none" />
            {/* Tributary 3 */}
            <path d="M 16,40 Q 22,50 30,58" stroke={ACCENT} strokeWidth="1.4" fill="none" />
            {/* Cities along banks */}
            <circle cx="32" cy="40" r="1.6" fill="#facc15" />
            <text x="36" y="42" fontSize="3" fill="#facc15">Haridwar</text>
            <circle cx="34" cy="60" r="1.6" fill="#facc15" />
            <text x="38" y="62" fontSize="3" fill="#facc15">Varanasi</text>
            <circle cx="38" cy="94" r="1.6" fill="#facc15" />
            <text x="42" y="97" fontSize="3" fill="#facc15">Delta</text>
            {/* Tributary labels */}
            <text x="50" y="22" fontSize="2.8" fill="#bae6fd" fontWeight="600">Yamuna</text>
            <text x="14" y="44" fontSize="2.8" fill="#bae6fd" fontWeight="600">Ghaghara</text>
            <text x="20" y="9" fontSize="2.8" fill="#e2e8f0">Ganga</text>
            <text x="50" y="92" textAnchor="middle" fontSize="3" fill="#94a3b8">Ganga-Brahmaputra basin</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={16} y={14} accent={ACCENT} selected={is("river-system")} preview={preview} onClick={sel("river-system")} />

        {/* TOP-RIGHT — Rainwater harvesting */}
        <Hotspot id="rainwater-harvesting" selected={is("rainwater-harvesting")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "16%", width: "22%", height: "34%" }}
          label="Rainwater Harvesting">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,24,0.65)" />
            <text x="50" y="9" textAnchor="middle" fontSize="4.6" fill={ACCENT} fontWeight="700">Rainwater Harvesting</text>
            {/* Rain drops */}
            <line x1="20" y1="14" x2="18" y2="20" stroke="#bae6fd" strokeWidth="0.6" />
            <line x1="34" y1="14" x2="32" y2="20" stroke="#bae6fd" strokeWidth="0.6" />
            <line x1="48" y1="14" x2="46" y2="20" stroke="#bae6fd" strokeWidth="0.6" />
            <line x1="62" y1="14" x2="60" y2="20" stroke="#bae6fd" strokeWidth="0.6" />
            <line x1="76" y1="14" x2="74" y2="20" stroke="#bae6fd" strokeWidth="0.6" />
            {/* House roof (slanted) */}
            <polygon points="14,32 50,22 86,32 50,28" fill="#7c2d12" stroke="#0a0917" strokeWidth="0.5" />
            {/* Gutter */}
            <rect x="14" y="32" width="72" height="3" fill="#475569" />
            {/* Downpipe */}
            <rect x="78" y="35" width="3" height="22" fill="#475569" />
            {/* Storage tank */}
            <rect x="62" y="58" width="26" height="20" rx="2" fill="#1e293b" stroke={ACCENT} strokeWidth="0.8" />
            <rect x="63" y="68" width="24" height="9" fill={ACCENT} opacity="0.8" />
            <text x="75" y="73" textAnchor="middle" fontSize="3" fill="#fff" fontWeight="700">Tanka</text>
            {/* Arrow to groundwater */}
            <path d="M 50,80 L 50,92 L 30,92" stroke={ACCENT} strokeWidth="1.4" fill="none" />
            <polygon points="32,90 26,92 32,94" fill={ACCENT} />
            {/* Ground layers */}
            <rect x="0" y="92" width="100" height="8" fill="#3b2410" opacity="0.5" />
            <text x="20" y="99" textAnchor="middle" fontSize="3" fill="#facc15">Groundwater recharge</text>
            <text x="50" y="40" textAnchor="middle" fontSize="3" fill="#e2e8f0">Roof → Gutter → Tank</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={84} y={14} accent={ACCENT} selected={is("rainwater-harvesting")} preview={preview} onClick={sel("rainwater-harvesting")} />

        {/* BOTTOM-RIGHT — Narmada Bachao Andolan */}
        <Hotspot id="narmada-movement" selected={is("narmada-movement")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "54%", width: "22%", height: "32%" }}
          label="Narmada Andolan">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,24,0.65)" />
            <text x="50" y="11" textAnchor="middle" fontSize="4.4" fill={ACCENT} fontWeight="700">Narmada Bachao</text>
            <text x="50" y="17" textAnchor="middle" fontSize="4.4" fill={ACCENT} fontWeight="700">Andolan</text>
            {/* Sun/banner */}
            <rect x="20" y="22" width="60" height="6" fill="#b45309" opacity="0.7" />
            {/* Protester silhouettes */}
            {/* Person 1 */}
            <g transform="translate(15,40)">
              <circle cx="6" cy="4" r="3" fill="#e5e7eb" />
              <rect x="3" y="8" width="6" height="14" fill="#e5e7eb" />
              <line x1="3" y1="11" x2="-2" y2="6" stroke="#e5e7eb" strokeWidth="1.4" />
              <rect x="-8" y="2" width="6" height="5" fill="#fde68a" />
              <text x="-5" y="6" textAnchor="middle" fontSize="2.4" fill="#0a0917" fontWeight="700">NO</text>
              <text x="-5" y="9" textAnchor="middle" fontSize="2.4" fill="#0a0917" fontWeight="700">DAM</text>
            </g>
            {/* Person 2 (front center) */}
            <g transform="translate(40,38)">
              <circle cx="8" cy="4" r="3.5" fill="#e5e7eb" />
              <rect x="5" y="9" width="6" height="18" fill="#e5e7eb" />
              <line x1="5" y1="13" x2="-1" y2="8" stroke="#e5e7eb" strokeWidth="1.6" />
              <rect x="-9" y="3" width="8" height="6" fill="#fecaca" />
              <text x="-5" y="7" textAnchor="middle" fontSize="2.6" fill="#0a0917" fontWeight="700">STOP</text>
              <text x="-5" y="10" textAnchor="middle" fontSize="2.2" fill="#0a0917" fontWeight="700">SARDAR</text>
            </g>
            {/* Person 3 */}
            <g transform="translate(70,40)">
              <circle cx="6" cy="4" r="3" fill="#e5e7eb" />
              <rect x="3" y="8" width="6" height="14" fill="#e5e7eb" />
              <line x1="3" y1="11" x2="-2" y2="6" stroke="#e5e7eb" strokeWidth="1.4" />
              <rect x="-8" y="2" width="6" height="5" fill="#fde68a" />
              <text x="-5" y="6" textAnchor="middle" fontSize="2.4" fill="#0a0917" fontWeight="700">REHAB</text>
            </g>
            <text x="50" y="84" textAnchor="middle" fontSize="3" fill="#facc15">Medha Patkar · 1985–</text>
            <text x="50" y="90" textAnchor="middle" fontSize="3" fill="#94a3b8">Anti-big-dam · displacement</text>
            <text x="50" y="95" textAnchor="middle" fontSize="3" fill="#94a3b8">Sardar Sarovar</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={84} y={52} accent={ACCENT} selected={is("narmada-movement")} preview={preview} onClick={sel("narmada-movement")} />

        {/* Scarcity drop (small, bottom-left) */}
        <Hotspot id="scarcity" selected={is("scarcity")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "78%", width: "22%", height: "16%" }}
          label="Water Scarcity">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <rect x="0" y="0" width="100" height="100" fill="rgba(4,16,24,0.65)" rx="4" />
            {/* Water drop */}
            <path d="M 30,12 C 30,30 12,46 24,58 C 30,68 40,68 44,58 C 50,46 36,30 30,12 Z" fill={ACCENT} opacity="0.85" />
            {/* Cracked ground */}
            <path d="M 52,40 L 70,30 L 80,42 L 92,32" stroke="#92400e" strokeWidth="1.4" fill="none" />
            <path d="M 70,30 L 72,18 M 80,42 L 86,54 M 80,42 L 74,56" stroke="#92400e" strokeWidth="1" fill="none" />
            <text x="60" y="78" textAnchor="middle" fontSize="4.5" fill="#facc15" fontWeight="700">3% freshwater</text>
            <text x="60" y="88" textAnchor="middle" fontSize="3.2" fill="#e5e7eb">accessible to humans</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={16} y={76} accent={ACCENT} selected={is("scarcity")} preview={preview} onClick={sel("scarcity")} />

        <Plaque title="Water Resources" caption="Dams · rivers · harvesting · scarcity · NCERT Geo Ch 7" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const GeoWaterExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "geo-water",
  chapterId: 7,
  track: "ssc",
  title: "Water Resources",
  subtitle: "SSC Geo · Ch 7",
  description:
    "A dam cross-section, river system, rainwater harvesting diagram, Narmada Bachao Andolan scene and water scarcity icon. Click each region to explore CBSE Class 10 Geography Chapter 7.",
  accent: "#0ea5e9",
  icon: "💧",
  parts: [
    {
      id: "dam",
      name: "Multi-purpose River Projects",
      info: "Multi-purpose dams serve irrigation, flood control, hydro-power, water supply, navigation and fish breeding. Examples: Bhakra-Nangal (Sutlej, Himachal-Punjab), Hirakud (Mahanadi, Odisha), Damodar Valley Corporation (1948 — modelled on TVA), Nagarjuna Sagar (Krishna). Critics cite displacement, ecological damage, sedimentation and inter-state disputes.",
    },
    {
      id: "river-system",
      name: "River Systems of India",
      info: "Major rivers: Ganga (2,525 km — Gangotri source, Bangladesh delta), Brahmaputra (Tsangpo source in Tibet), Narmada & Tapi (west-flowing rift valleys into the Arabian Sea), Godavari, Krishna, Kaveri (east-flowing into Bay of Bengal). Interlinking of Rivers programme proposes to transfer surplus water to deficit basins; critics cite ecological concerns.",
    },
    {
      id: "rainwater-harvesting",
      name: "Rainwater Harvesting",
      info: "Rooftop rainwater harvesting: roof → gutter → filter → storage tank or recharge pit. Traditional Indian systems: Khadins & Johads (Rajasthan — for agriculture & drinking), Tankas (Bikaner — large underground tanks), Surangams (Kerala), Eri (Tamil Nadu). Shillong (Meghalaya) uses rooftop harvesting meeting ~15-25% of water needs. Tamil Nadu made rooftop harvesting mandatory in 2003.",
    },
    {
      id: "narmada-movement",
      name: "Narmada Bachao Andolan",
      info: "A social movement (1985–) led by Medha Patkar and Baba Amte against the Sardar Sarovar Project on the Narmada river. Concerns: large-scale displacement of tribals & farmers, inadequate rehabilitation, environmental damage, and questioning the big-dam model. The movement went to the Supreme Court; construction resumed in 2000 with stricter rehab conditions. The dam was inaugurated in 2017.",
    },
    {
      id: "scarcity",
      name: "Water Scarcity",
      info: "Only ~2.5% of Earth's water is freshwater, and only ~1% (or ~3% of freshwater) is easily accessible to humans. Causes of scarcity: over-exploitation, population growth, unequal access, pollution, and climate change. India is water-stressed (~1,544 m³ per capita/year). Solutions: rainwater harvesting, drip irrigation, watershed management, recycling, and equitable distribution.",
    },
  ],
  Panel: GeoWaterPanel,
};
