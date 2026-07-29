"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#10b981";

function EcoSectorsPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
              <marker id="emerald-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill={accent} />
              </marker>
              <radialGradient id="flow-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="node-pri" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="node-sec" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="node-ter" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* Title */}
            <text x="50" y="5" textAnchor="middle" fontSize="2.6" fill={accent} fontWeight="800" fontFamily="Georgia, serif">
              Sectors of the Indian Economy — Circular Flow
            </text>
            <line x1="22" y1="7" x2="78" y2="7" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />

            {/* ===== LEFT: Sector by Ownership ===== */}
            <rect x="3" y="12" width="22" height="50" rx="1" fill="rgba(16,185,129,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="14" y="16" textAnchor="middle" fontSize="1.55" fill={accent} fontWeight="700" fontFamily="Georgia, serif">By Ownership</text>
            <line x1="3" y1="18" x2="25" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* Public sector — government building with columns + flag */}
            <polygon points="6,24 14,21 22,24" fill="#fbbf24" />
            <rect x="6" y="24" width="16" height="6" fill="none" stroke="#fbbf24" strokeWidth="0.3" />
            <rect x="7" y="25" width="1.2" height="5" fill="#fbbf24" />
            <rect x="9.5" y="25" width="1.2" height="5" fill="#fbbf24" />
            <rect x="12" y="25" width="1.2" height="5" fill="#fbbf24" />
            <rect x="14.5" y="25" width="1.2" height="5" fill="#fbbf24" />
            <rect x="17" y="25" width="1.2" height="5" fill="#fbbf24" />
            <rect x="19.5" y="25" width="1.2" height="5" fill="#fbbf24" />
            <line x1="14" y1="21" x2="14" y2="19.5" stroke="#fbbf24" strokeWidth="0.25" />
            <rect x="14" y="19.5" width="2.5" height="1" fill="#dc2626" />
            <text x="14" y="33" textAnchor="middle" fontSize="1.4" fill="#fde68a" fontWeight="700">PUBLIC</text>
            <text x="14" y="35.5" textAnchor="middle" fontSize="1.2" fill="#fcd34d" fontStyle="italic">govt-owned · Railways</text>
            <text x="14" y="37.6" textAnchor="middle" fontSize="1.2" fill="#fcd34d" fontStyle="italic">· SAIL · ONGC</text>
            {/* Private sector — factory */}
            <rect x="6" y="42" width="16" height="6" fill="none" stroke="#7dd3fc" strokeWidth="0.3" />
            <polygon points="6,42 10,39 14,42 18,39 22,42" fill="#7dd3fc" opacity="0.45" />
            <rect x="8" y="39.5" width="1" height="2.5" fill="#7dd3fc" />
            <rect x="13" y="39.5" width="1" height="2.5" fill="#7dd3fc" />
            <text x="14" y="51" textAnchor="middle" fontSize="1.4" fill="#bae6fd" fontWeight="700">PRIVATE</text>
            <text x="14" y="53.5" textAnchor="middle" fontSize="1.2" fill="#7dd3fc" fontStyle="italic">Tata · Reliance</text>
            <text x="14" y="55.6" textAnchor="middle" fontSize="1.2" fill="#7dd3fc" fontStyle="italic">· Bajaj · Wipro</text>
            <text x="14" y="59.5" textAnchor="middle" fontSize="1.25" fill={accent} fontStyle="italic">mixed economy</text>

            {/* ===== CENTER: Circular flow of 3 sectors ===== */}
            <ellipse cx="50" cy="42" rx="26" ry="22" fill="url(#flow-glow)" />

            {/* Curved arrows forming a cycle: Primary(top) → Secondary(bottom-right) → Tertiary(bottom-left) → Primary */}
            <path d="M 56,26 Q 70,30 66,50" fill="none" stroke={accent} strokeWidth="0.45" markerEnd="url(#emerald-arrow)" />
            <path d="M 60,56 Q 50,62 42,56" fill="none" stroke={accent} strokeWidth="0.45" markerEnd="url(#emerald-arrow)" />
            <path d="M 34,50 Q 30,30 44,26" fill="none" stroke={accent} strokeWidth="0.45" markerEnd="url(#emerald-arrow)" />

            {/* Primary node — top (agriculture / tractor) */}
            <rect x="38" y="18" width="24" height="9" rx="1.2" fill="url(#node-pri)" stroke="#059669" strokeWidth="0.25" />
            <text x="50" y="22.5" textAnchor="middle" fontSize="1.6" fill="#0a0917" fontWeight="800">PRIMARY</text>
            <text x="50" y="25" textAnchor="middle" fontSize="1.25" fill="#064e3b" fontWeight="700">Agriculture · 17% GDP</text>
            {/* tractor icon (tiny) */}
            <circle cx="42" cy="20" r="1" fill="#0a0917" />
            <circle cx="45" cy="20" r="1.3" fill="#0a0917" />

            {/* Secondary node — bottom-right (factory) */}
            <rect x="55" y="52" width="24" height="9" rx="1.2" fill="url(#node-sec)" stroke="#b45309" strokeWidth="0.25" />
            <text x="67" y="56.5" textAnchor="middle" fontSize="1.6" fill="#0a0917" fontWeight="800">SECONDARY</text>
            <text x="67" y="59" textAnchor="middle" fontSize="1.25" fill="#451a03" fontWeight="700">Manufacturing · 28% GDP</text>
            {/* factory icon (tiny) */}
            <polygon points="59,53 61,51 63,53 65,51 67,53" fill="#0a0917" opacity="0.55" />

            {/* Tertiary node — bottom-left (building) */}
            <rect x="21" y="52" width="24" height="9" rx="1.2" fill="url(#node-ter)" stroke="#0369a1" strokeWidth="0.25" />
            <text x="33" y="56.5" textAnchor="middle" fontSize="1.6" fill="#0a0917" fontWeight="800">TERTIARY</text>
            <text x="33" y="59" textAnchor="middle" fontSize="1.25" fill="#082f49" fontWeight="700">Services · 55% GDP</text>
            {/* building icon */}
            <rect x="26" y="53" width="1.2" height="2" fill="#0a0917" opacity="0.55" />
            <rect x="28" y="53" width="1.2" height="2" fill="#0a0917" opacity="0.55" />
            <rect x="30" y="53" width="1.2" height="2" fill="#0a0917" opacity="0.55" />

            {/* GDP share badges near nodes */}
            <text x="50" y="42" textAnchor="middle" fontSize="1.6" fill={accent} fontWeight="700" fontStyle="italic">circular flow</text>
            <text x="50" y="44.5" textAnchor="middle" fontSize="1.3" fill="#fde68a" fontStyle="italic">each feeds the next</text>

            {/* ===== TOP-RIGHT: Organised vs Unorganised ===== */}
            <rect x="73" y="12" width="25" height="32" rx="1" fill="rgba(16,185,129,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="85.5" y="16" textAnchor="middle" fontSize="1.55" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Organised vs Unorganised</text>
            <line x1="73" y1="18" x2="98" y2="18" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />
            {/* Organised column */}
            <rect x="74.5" y="20" width="11" height="22" rx="0.6" fill="rgba(125,211,252,0.08)" stroke="#7dd3fc" strokeWidth="0.25" />
            <text x="80" y="23.5" textAnchor="middle" fontSize="1.35" fill="#bae6fd" fontWeight="700">ORGANISED</text>
            {/* tie icon */}
            <polygon points="80,25 79,26 79,30 80,31 81,30 81,26" fill="#7dd3fc" />
            <text x="80" y="35" textAnchor="middle" fontSize="1.15" fill="#7dd3fc">salaried</text>
            <text x="80" y="37" textAnchor="middle" fontSize="1.15" fill="#7dd3fc">PF · pension</text>
            <text x="80" y="39" textAnchor="middle" fontSize="1.15" fill="#7dd3fc">paid leave</text>
            <text x="80" y="41.5" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">~7%</text>
            {/* Unorganised column */}
            <rect x="86" y="20" width="11" height="22" rx="0.6" fill="rgba(248,113,113,0.08)" stroke="#f87171" strokeWidth="0.25" />
            <text x="91.5" y="23.5" textAnchor="middle" fontSize="1.35" fill="#fecaca" fontWeight="700">UNORG.</text>
            {/* person with shovel */}
            <circle cx="91.5" cy="26" r="0.9" fill="#f87171" />
            <line x1="91.5" y1="27" x2="91.5" y2="30" stroke="#f87171" strokeWidth="0.3" />
            <line x1="91.5" y1="28.5" x2="93" y2="30" stroke="#f87171" strokeWidth="0.25" />
            <text x="91.5" y="35" textAnchor="middle" fontSize="1.15" fill="#fca5a5">daily wage</text>
            <text x="91.5" y="37" textAnchor="middle" fontSize="1.15" fill="#fca5a5">no benefits</text>
            <text x="91.5" y="39" textAnchor="middle" fontSize="1.15" fill="#fca5a5">insecure</text>
            <text x="91.5" y="41.5" textAnchor="middle" fontSize="1.15" fill="#fde68a" fontWeight="700">~93%</text>

            {/* ===== BOTTOM-RIGHT: MNREGA 2005 ===== */}
            <rect x="73" y="46" width="25" height="26" rx="1" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="0.25" strokeOpacity="0.7" />
            <text x="85.5" y="50" textAnchor="middle" fontSize="1.5" fill="#fbbf24" fontWeight="700" fontFamily="Georgia, serif">MNREGA · 2005</text>
            <line x1="73" y1="52" x2="98" y2="52" stroke="#f59e0b" strokeWidth="0.15" strokeOpacity="0.45" />
            {/* shovel icon */}
            <line x1="78" y1="58" x2="83" y2="65" stroke="#a8a29e" strokeWidth="0.6" />
            <polygon points="76,55 80,55 81,58 77,58" fill="#a8a29e" />
            {/* 100-days badge */}
            <circle cx="90" cy="60" r="4" fill="none" stroke="#fbbf24" strokeWidth="0.4" />
            <text x="90" y="60" textAnchor="middle" fontSize="2.2" fill="#fbbf24" fontWeight="800">100</text>
            <text x="90" y="63" textAnchor="middle" fontSize="1.15" fill="#fde68a">days</text>
            <text x="85.5" y="68" textAnchor="middle" fontSize="1.2" fill="#fcd34d" fontStyle="italic">rural · legal right · women ½</text>
            <text x="85.5" y="70.2" textAnchor="middle" fontSize="1.2" fill="#fcd34d" fontStyle="italic">reduces distress migration</text>
          </svg>

          {/* ===== Hotspots ===== */}
          <Hotspot id="primary-sector" selected={sel("primary-sector")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="① Primary · Agriculture"
            style={{ left: "42%", top: "18%", width: "16%", height: "13%" }}>
            <></>
          </Hotspot>
          <Hotspot id="secondary-sector" selected={sel("secondary-sector")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="② Secondary · Manufacturing"
            style={{ left: "55%", top: "52%", width: "17%", height: "13%" }}>
            <></>
          </Hotspot>
          <Hotspot id="tertiary-sector" selected={sel("tertiary-sector")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="③ Tertiary · Services"
            style={{ left: "21%", top: "52%", width: "17%", height: "13%" }}>
            <></>
          </Hotspot>
          <Hotspot id="ownership" selected={sel("ownership")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="④ Public vs Private"
            style={{ left: "3%", top: "12%", width: "22%", height: "50%" }}>
            <></>
          </Hotspot>
          <Hotspot id="organised-unorganised" selected={sel("organised-unorganised")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑤ Organised vs Unorganised"
            style={{ left: "73%", top: "12%", width: "25%", height: "32%" }}>
            <></>
          </Hotspot>
          <Hotspot id="mnrega" selected={sel("mnrega")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑥ MNREGA 2005"
            style={{ left: "73%", top: "46%", width: "25%", height: "26%" }}>
            <></>
          </Hotspot>

          {/* ===== Tags ===== */}
          <Tag n={1} x={44} y={16} accent={accent} selected={sel("primary-sector")} onClick={toggle("primary-sector")} preview={preview} />
          <Tag n={2} x={57} y={50} accent={accent} selected={sel("secondary-sector")} onClick={toggle("secondary-sector")} preview={preview} />
          <Tag n={3} x={23} y={50} accent={accent} selected={sel("tertiary-sector")} onClick={toggle("tertiary-sector")} preview={preview} />
          <Tag n={4} x={5} y={10} accent={accent} selected={sel("ownership")} onClick={toggle("ownership")} preview={preview} />
          <Tag n={5} x={75} y={10} accent={accent} selected={sel("organised-unorganised")} onClick={toggle("organised-unorganised")} preview={preview} />
          <Tag n={6} x={75} y={44} accent={accent} selected={sel("mnrega")} onClick={toggle("mnrega")} preview={preview} />

          {/* ===== Plaque ===== */}
          <Plaque title="Sectors of the Indian Economy" caption="Chapter 18 · Primary → Secondary → Tertiary" accent={accent} />
        </div>
      </PaintingFrame>
    </div>
  );
}

export const EcoSectorsExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "eco-sectors",
  chapterId: 18,
  track: "ssc",
  title: "Sectors of the Indian Economy",
  subtitle: "Primary, secondary, tertiary — and who works where",
  description:
    "Trace the circular flow from agriculture to manufacturing to services, and split the economy by ownership, formality and the MNREGA guarantee.",
  accent,
  icon: "🔄",
  parts: [
    {
      id: "primary-sector",
      name: "Primary Sector",
      info: "Produces goods by exploiting natural resources — agriculture, fishing, mining, forestry, dairy. In India ≈ 17% of GDP but employs ≈ 43% of the workforce, so disguised unemployment is common (more workers than needed on family farms). Output is mostly unprocessed: wheat, cotton, coal, fish.",
    },
    {
      id: "secondary-sector",
      name: "Secondary Sector",
      info: "Covers activities in which natural products are changed into other forms — manufacturing, construction, electricity, gas, water supply. Builds factories, makes cloth from cotton, steel from iron ore. India ≈ 28% of GDP and ≈ 25% of workforce. Industrialisation raises productivity and reduces dependence on farming.",
    },
    {
      id: "tertiary-sector",
      name: "Tertiary Sector",
      info: "Services that support primary and secondary — transport, storage, banking, insurance, IT, communication, health, education, tourism. India ≈ 55% of GDP and ≈ 32% of workforce — the largest sector today, driven by the IT/BPO boom. As income rises, demand for services (schools, hospitals, restaurants) rises faster than for basic goods.",
    },
    {
      id: "organised-unorganised",
      name: "Organised vs Unorganised",
      info: "Organised sector — registered with govt, formal rules, paid leave, PF, pension, job security. Only ≈ 7% of India's workforce. Unorganised sector — small scattered units, no job security, no benefits, daily wage. ≈ 93% of workforce: small farmers, hawkers, construction labour, domestic workers — highly vulnerable.",
    },
    {
      id: "ownership",
      name: "Public vs Private Ownership",
      info: "Public sector — government owns most assets and provides services (Railways, SAIL, ONGC, post office). Aim: public welfare, not just profit — supply electricity to remote villages even at a loss. Private sector — individuals or companies own assets (Tata, Reliance). Aim: profit. India is a mixed economy: both coexist.",
    },
    {
      id: "mnrega",
      name: "MNREGA 2005",
      info: "Mahatma Gandhi National Rural Employment Guarantee Act, 2005. Guarantees 100 days of wage employment per year to every rural household that wants unskilled work. It is a LEGAL right — if the govt fails to provide work, an unemployment allowance is paid. Reduces distress migration to cities; ⅓ (50%) of work reserved for women. One of the largest social-security programmes in the world.",
    },
  ],
  Panel: EcoSectorsPanel,
};
