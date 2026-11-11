"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#06b6d4";

function EcoGlobalisationPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const toggle = (id: string) => () => onSelectPart(sel(id) ? null : id);

  return (
    <div style={panelContainerStyle(accent, preview)}>
      <PaintingFrame accent={accent}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* ====== Background SVG scene ====== */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <marker id="cyan-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill={accent} />
              </marker>
              <marker id="cyan-arrow-back" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#67e8f9" />
              </marker>
              <radialGradient id="globe-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0e7490" stopOpacity="0.85" />
              </radialGradient>
              <radialGradient id="flow-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Title */}
            <text x="50" y="5" textAnchor="middle" fontSize="2.6" fill={accent} fontWeight="800" fontFamily="Georgia, serif">
              Globalisation &amp; the Indian Economy — 4 Border Flows
            </text>
            <line x1="18" y1="7" x2="82" y2="7" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />

            {/* ===== LEFT: MNCs ===== */}
            <rect x="3" y="12" width="27" height="60" rx="1" fill="rgba(6,182,212,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="16.5" y="16" textAnchor="middle" fontSize="1.6" fill={accent} fontWeight="700" fontFamily="Georgia, serif">MNCs</text>
            <line x1="3" y1="18" x2="30" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            <text x="16.5" y="20.5" textAnchor="middle" fontSize="1.15" fill="#bae6fd" fontStyle="italic">Multinational Corporations</text>

            {/* Globe */}
            <circle cx="16.5" cy="32" r="6.5" fill="url(#globe-grad)" stroke="#0e7490" strokeWidth="0.3" />
            <ellipse cx="16.5" cy="32" rx="6.5" ry="2.2" fill="none" stroke="#bae6fd" strokeWidth="0.18" strokeOpacity="0.7" />
            <ellipse cx="16.5" cy="32" rx="2.2" ry="6.5" fill="none" stroke="#bae6fd" strokeWidth="0.18" strokeOpacity="0.7" />
            <line x1="10" y1="32" x2="23" y2="32" stroke="#bae6fd" strokeWidth="0.18" strokeOpacity="0.7" />
            <line x1="16.5" y1="25.5" x2="16.5" y2="38.5" stroke="#bae6fd" strokeWidth="0.18" strokeOpacity="0.7" />

            {/* HQ factory on globe */}
            <rect x="13.5" y="31" width="3" height="2.5" fill="#fbbf24" stroke="#a16207" strokeWidth="0.15" />
            <polygon points="13.5,31 15,29.5 16.5,31" fill="#fbbf24" />
            <text x="15" y="29" textAnchor="middle" fontSize="1" fill="#fde68a">HQ</text>

            {/* Subsidiaries (small factories) on globe */}
            <rect x="19" y="29" width="2" height="1.6" fill="#a3e635" />
            <rect x="11" y="34" width="2" height="1.6" fill="#a3e635" />
            <rect x="20" y="34" width="2" height="1.6" fill="#a3e635" />
            <text x="20" y="28" textAnchor="middle" fontSize="0.95" fill="#bef264">sub</text>
            <text x="12" y="38" textAnchor="middle" fontSize="0.95" fill="#bef264">sub</text>

            {/* Caption + examples */}
            <text x="16.5" y="44" textAnchor="middle" fontSize="1.2" fill={accent} fontStyle="italic">set up plants in low-cost</text>
            <text x="16.5" y="46" textAnchor="middle" fontSize="1.2" fill={accent} fontStyle="italic">regions; profit → home</text>

            <line x1="5" y1="48.5" x2="28" y2="48.5" stroke={accent} strokeWidth="0.12" strokeOpacity="0.4" />
            <text x="16.5" y="52" textAnchor="middle" fontSize="1.25" fill="#fde68a" fontWeight="700">Indian MNCs</text>
            <text x="16.5" y="54.5" textAnchor="middle" fontSize="1.15" fill="#fcd34d">Tata · Reliance · Infosys</text>
            <text x="16.5" y="57" textAnchor="middle" fontSize="1.25" fill="#fde68a" fontWeight="700">Foreign MNCs</text>
            <text x="16.5" y="59.5" textAnchor="middle" fontSize="1.15" fill="#fcd34d">Ford · Coca-Cola · Samsung</text>
            <text x="16.5" y="63" textAnchor="middle" fontSize="1.15" fill="#7dd3fc" fontStyle="italic">technology transfer</text>
            <text x="16.5" y="65" textAnchor="middle" fontSize="1.15" fill="#7dd3fc" fontStyle="italic">low-cost production</text>
            <text x="16.5" y="68" textAnchor="middle" fontSize="1.15" fill="#7dd3fc" fontStyle="italic">FDI inflows</text>

            {/* ===== CENTER: 4 flows between two country blocks ===== */}
            <rect x="33" y="12" width="35" height="60" rx="1" fill="rgba(6,182,212,0.04)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.5" />
            <text x="50.5" y="16" textAnchor="middle" fontSize="1.6" fill={accent} fontWeight="700" fontFamily="Georgia, serif">4 Border Flows</text>
            <line x1="33" y1="18" x2="68" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            <ellipse cx="50.5" cy="44" rx="17" ry="20" fill="url(#flow-glow)" />

            {/* Country A block (left) */}
            <rect x="35" y="24" width="11" height="40" rx="0.8" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="0.3" />
            <text x="40.5" y="27.5" textAnchor="middle" fontSize="1.25" fill="#86efac" fontWeight="700">COUNTRY A</text>
            <line x1="36" y1="29" x2="45" y2="29" stroke="#22c55e" strokeWidth="0.15" strokeOpacity="0.5" />
            {/* tiny factory */}
            <rect x="37" y="32" width="3" height="2" fill="#22c55e" />
            <polygon points="37,32 38.5,30.8 40,32" fill="#22c55e" />
            {/* tiny people */}
            <circle cx="42" cy="33" r="0.6" fill="#86efac" />
            <circle cx="43.5" cy="33" r="0.6" fill="#86efac" />
            <text x="40.5" y="40" textAnchor="middle" fontSize="1.05" fill="#86efac" fontStyle="italic">produces</text>
            <text x="40.5" y="42" textAnchor="middle" fontSize="1.05" fill="#86efac" fontStyle="italic">saves</text>
            <text x="40.5" y="44" textAnchor="middle" fontSize="1.05" fill="#86efac" fontStyle="italic">workers</text>

            {/* Country B block (right) */}
            <rect x="55" y="24" width="11" height="40" rx="0.8" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="0.3" />
            <text x="60.5" y="27.5" textAnchor="middle" fontSize="1.25" fill="#d8b4fe" fontWeight="700">COUNTRY B</text>
            <line x1="56" y1="29" x2="65" y2="29" stroke="#a855f7" strokeWidth="0.15" strokeOpacity="0.5" />
            <rect x="57" y="32" width="3" height="2" fill="#a855f7" />
            <polygon points="57,32 58.5,30.8 60,32" fill="#a855f7" />
            <circle cx="62" cy="33" r="0.6" fill="#d8b4fe" />
            <circle cx="63.5" cy="33" r="0.6" fill="#d8b4fe" />
            <text x="60.5" y="40" textAnchor="middle" fontSize="1.05" fill="#d8b4fe" fontStyle="italic">produces</text>
            <text x="60.5" y="42" textAnchor="middle" fontSize="1.05" fill="#d8b4fe" fontStyle="italic">saves</text>
            <text x="60.5" y="44" textAnchor="middle" fontSize="1.05" fill="#d8b4fe" fontStyle="italic">workers</text>

            {/* 4 arrows between A and B */}
            {/* Goods */}
            <line x1="46.2" y1="30" x2="54.5" y2="30" stroke={accent} strokeWidth="0.4" markerEnd="url(#cyan-arrow)" />
            <line x1="54.5" y1="31.4" x2="46.2" y2="31.4" stroke="#67e8f9" strokeWidth="0.3" markerEnd="url(#cyan-arrow-back)" />
            <text x="50.5" y="28.8" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">Goods</text>

            {/* Services */}
            <line x1="46.2" y1="38" x2="54.5" y2="38" stroke={accent} strokeWidth="0.4" markerEnd="url(#cyan-arrow)" />
            <line x1="54.5" y1="39.4" x2="46.2" y2="39.4" stroke="#67e8f9" strokeWidth="0.3" markerEnd="url(#cyan-arrow-back)" />
            <text x="50.5" y="36.8" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">Services</text>

            {/* Capital */}
            <line x1="46.2" y1="46" x2="54.5" y2="46" stroke={accent} strokeWidth="0.4" markerEnd="url(#cyan-arrow)" />
            <line x1="54.5" y1="47.4" x2="46.2" y2="47.4" stroke="#67e8f9" strokeWidth="0.3" markerEnd="url(#cyan-arrow-back)" />
            <text x="50.5" y="44.8" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">Capital / FDI</text>

            {/* Labor */}
            <line x1="46.2" y1="54" x2="54.5" y2="54" stroke={accent} strokeWidth="0.4" markerEnd="url(#cyan-arrow)" />
            <line x1="54.5" y1="55.4" x2="46.2" y2="55.4" stroke="#67e8f9" strokeWidth="0.3" markerEnd="url(#cyan-arrow-back)" />
            <text x="50.5" y="52.8" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">Labor</text>

            {/* caption */}
            <text x="50.5" y="62" textAnchor="middle" fontSize="1.25" fill={accent} fontStyle="italic">integrating economies</text>
            <text x="50.5" y="64.5" textAnchor="middle" fontSize="1.15" fill="#fcd34d" fontStyle="italic">MNCs · FDI · trade · migration</text>
            <text x="50.5" y="67" textAnchor="middle" fontSize="1.15" fill="#fcd34d" fontStyle="italic">production where costs are low</text>
            <text x="50.5" y="69.5" textAnchor="middle" fontSize="1.15" fill="#fcd34d" fontStyle="italic">markets where demand is high</text>

            {/* ===== TOP-RIGHT: WTO ===== */}
            <rect x="72" y="12" width="25" height="32" rx="1" fill="rgba(6,182,212,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="84.5" y="16" textAnchor="middle" fontSize="1.5" fill={accent} fontWeight="700" fontFamily="Georgia, serif">WTO · 1995</text>
            <line x1="72" y1="18" x2="97" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* WTO building */}
            <polygon points="76,24 84,21 92,24" fill={accent} />
            <rect x="76" y="24" width="16" height="6" fill="none" stroke={accent} strokeWidth="0.3" />
            <rect x="77.5" y="25" width="1" height="5" fill={accent} />
            <rect x="79.5" y="25" width="1" height="5" fill={accent} />
            <rect x="81.5" y="25" width="1" height="5" fill={accent} />
            <rect x="83.5" y="25" width="1" height="5" fill={accent} />
            <rect x="85.5" y="25" width="1" height="5" fill={accent} />
            <rect x="87.5" y="25" width="1" height="5" fill={accent} />
            <rect x="89.5" y="25" width="1" height="5" fill={accent} />
            <text x="84" y="29" textAnchor="middle" fontSize="1.2" fill="#0a0917" fontWeight="800">WTO</text>
            {/* balanced scales */}
            <line x1="84.5" y1="32" x2="84.5" y2="36" stroke="#e5e7eb" strokeWidth="0.25" />
            <line x1="79" y1="33" x2="90" y2="33" stroke="#e5e7eb" strokeWidth="0.25" />
            <line x1="79" y1="33" x2="78" y2="35.5" stroke="#e5e7eb" strokeWidth="0.18" />
            <line x1="90" y1="33" x2="91" y2="35.5" stroke="#e5e7eb" strokeWidth="0.18" />
            <rect x="77" y="35.5" width="2" height="1.2" fill="#86efac" />
            <rect x="90" y="35.5" width="2" height="1.2" fill="#86efac" />
            <text x="84.5" y="40" textAnchor="middle" fontSize="1.1" fill="#bae6fd">successor to GATT</text>
            <text x="84.5" y="42" textAnchor="middle" fontSize="1.1" fill="#bae6fd">164 members · India ✓</text>

            {/* ===== BOTTOM-RIGHT: Impacts in India ===== */}
            <rect x="72" y="46" width="25" height="26" rx="1" fill="rgba(6,182,212,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="84.5" y="50" textAnchor="middle" fontSize="1.45" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Impacts in India</text>
            <line x1="72" y1="52" x2="97" y2="52" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* + IT jobs */}
            <circle cx="74.5" cy="55" r="1.1" fill="#22c55e" />
            <text x="74.5" y="55.7" textAnchor="middle" fontSize="1.4" fill="#0a0917" fontWeight="800">+</text>
            <text x="76.5" y="56" fontSize="1.15" fill="#86efac">IT / BPO jobs boom</text>
            {/* + consumer choice */}
            <circle cx="74.5" cy="59" r="1.1" fill="#22c55e" />
            <text x="74.5" y="59.7" textAnchor="middle" fontSize="1.4" fill="#0a0917" fontWeight="800">+</text>
            <text x="76.5" y="60" fontSize="1.15" fill="#86efac">choice · cheap electronics</text>
            {/* − farmer distress */}
            <circle cx="74.5" cy="63" r="1.1" fill="#ef4444" />
            <text x="74.5" y="63.6" textAnchor="middle" fontSize="1.5" fill="#fff" fontWeight="800">−</text>
            <text x="76.5" y="64" fontSize="1.15" fill="#fca5a5">farmer distress · imports</text>
            {/* − small industries */}
            <circle cx="74.5" cy="67" r="1.1" fill="#ef4444" />
            <text x="74.5" y="67.6" textAnchor="middle" fontSize="1.5" fill="#fff" fontWeight="800">−</text>
            <text x="76.5" y="68" fontSize="1.15" fill="#fca5a5">small industries close</text>
            <text x="84.5" y="71" textAnchor="middle" fontSize="1.05" fill="#fde68a" fontStyle="italic">top 1% gain most · wage gap ↑</text>

            {/* ===== BOTTOM-CENTER: Liberalisation 1991 ===== */}
            <rect x="36" y="74" width="29" height="11" rx="0.8" fill="rgba(6,182,212,0.1)" stroke={accent} strokeWidth="0.3" strokeOpacity="0.7" />
            {/* badge "1991" */}
            <circle cx="40" cy="79.5" r="3" fill={accent} stroke="#0e7490" strokeWidth="0.3" />
            <text x="40" y="80.8" textAnchor="middle" fontSize="2.2" fill="#0a0917" fontWeight="800">1991</text>
            <text x="50" y="78.5" textAnchor="middle" fontSize="1.45" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Liberalisation</text>
            <text x="50" y="80.8" textAnchor="middle" fontSize="1.1" fill="#fde68a" fontStyle="italic">PV Narasimha Rao · Manmohan Singh</text>
            <text x="50" y="82.6" textAnchor="middle" fontSize="1.05" fill="#bae6fd">end License Raj · tariffs 150%→10% · FDI · ₹ devalued</text>
            <text x="50" y="84.4" textAnchor="middle" fontSize="1.05" fill="#fcd34d" fontStyle="italic">→ 30 yrs of 6–7% growth</text>
          </svg>

          {/* ===== Hotspots ===== */}
          <Hotspot id="flows" selected={sel("flows")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="① 4 Border Flows"
            style={{ left: "33%", top: "12%", width: "35%", height: "60%" }}>
            <></>
          </Hotspot>
          <Hotspot id="mncs" selected={sel("mncs")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="② MNCs"
            style={{ left: "3%", top: "12%", width: "27%", height: "60%" }}>
            <></>
          </Hotspot>
          <Hotspot id="wto" selected={sel("wto")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="③ WTO 1995"
            style={{ left: "72%", top: "12%", width: "25%", height: "32%" }}>
            <></>
          </Hotspot>
          <Hotspot id="impacts-india" selected={sel("impacts-india")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="④ Impacts in India"
            style={{ left: "72%", top: "46%", width: "25%", height: "26%" }}>
            <></>
          </Hotspot>
          <Hotspot id="liberalisation-1991" selected={sel("liberalisation-1991")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑤ Liberalisation 1991"
            style={{ left: "36%", top: "73%", width: "29%", height: "13%" }}>
            <></>
          </Hotspot>

          {/* ===== Tags ===== */}
          <Tag n={1} x={35} y={10} accent={accent} selected={sel("flows")} onClick={toggle("flows")} preview={preview} />
          <Tag n={2} x={5} y={10} accent={accent} selected={sel("mncs")} onClick={toggle("mncs")} preview={preview} />
          <Tag n={3} x={74} y={10} accent={accent} selected={sel("wto")} onClick={toggle("wto")} preview={preview} />
          <Tag n={4} x={74} y={44} accent={accent} selected={sel("impacts-india")} onClick={toggle("impacts-india")} preview={preview} />
          <Tag n={5} x={38} y={71} accent={accent} selected={sel("liberalisation-1991")} onClick={toggle("liberalisation-1991")} preview={preview} />

          {/* ===== Plaque ===== */}
          <Plaque title="Globalisation and the Indian Economy" caption="Chapter 20 · 4 flows across borders — winners and losers" accent={accent} />
        </div>
      </PaintingFrame>
    </div>
  );
}

export const EcoGlobalisationExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "eco-globalisation",
  chapterId: 20,
  track: "ssc",
  title: "Globalisation and the Indian Economy",
  subtitle: "MNCs, WTO, the 1991 turn & mixed impacts",
  description:
    "Track the four interlinked flows that globalise an economy, see how MNCs and the WTO shape trade, and weigh India's gains and losses since 1991.",
  accent,
  icon: "🌐",
  parts: [
    {
      id: "flows",
      name: "4 Border Flows",
      info: "Globalisation is the integration of national economies through four interlinked flows: Goods (exports/imports), Services (IT, tourism, banking), Capital (FDI, FII, foreign loans) and Labor (migration, skilled and unskilled). MNCs set up production where costs are low and sell where demand is high. Faster transport, the internet and trade agreements have all accelerated these flows.",
    },
    {
      id: "mncs",
      name: "Multinational Corporations",
      info: "An MNC operates in many countries but controls its HQ in one. It sets up plants in low-cost regions — China, Vietnam, India — to cut wages, transport or taxes, then sells worldwide. Indian MNCs: Tata, Reliance, Infosys, Asian Paints. Foreign MNCs in India: Ford, Coca-Cola, Samsung, Unilever. MNCs bring technology, capital and jobs — but profits flow back to the home country.",
    },
    {
      id: "wto",
      name: "WTO 1995",
      info: "The World Trade Organization (1995) is the successor to GATT (1947). It has 164 members (India is a founder-member) and frames the rules of international trade — reduce tariffs, non-discrimination (MFN), and dispute settlement. Developing countries won some flexibilities like the Special Safeguard Mechanism (SSG) for farmers. Critics argue rich countries still protect their agriculture while pushing free trade on others.",
    },
    {
      id: "impacts-india",
      name: "Impacts in India",
      info: "Positive — IT / BPO boom, lakhs of service jobs, wider consumer choice, cheaper electronics and brands (Nike, Ford, Samsung). Negative — import competition hits farmers (cheap cotton, edible oil); small industries close; wage inequality rises as the top 1% gains most. The net effect since 1991: faster GDP growth but uneven benefits.",
    },
    {
      id: "liberalisation-1991",
      name: "Liberalisation 1991",
      info: "In 1991, under PM PV Narasimha Rao and Finance Minister Manmohan Singh — pushed by a balance-of-payments crisis and IMF conditions — India ended the License Raj. Trade barriers were removed, industrial licensing scrapped, tariffs cut from ~150% to ~10%, FDI allowed in many sectors, and the rupee devalued. This opened India to globalisation and triggered 30 years of 6–7% annual growth.",
    },
  ],
  Panel: EcoGlobalisationPanel,
};
