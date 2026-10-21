"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#8b5cf6";

function FederalismPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="fed-bg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#1e2a4a" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#fed-bg)" />
          {/* faint classical columns */}
          <g stroke={ACCENT} strokeWidth="0.3" fill="none" opacity="0.15">
            <rect x="14" y="22" width="4" height="50" />
            <rect x="82" y="22" width="4" height="50" />
            <line x1="10" y1="22" x2="22" y2="22" />
            <line x1="78" y1="22" x2="90" y2="22" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>🏛️ FEDERALISM</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Three Tiers · Three Lists · Two Routes</div>

        {/* LEFT: Three Lists */}
        <Hotspot id="three-lists" selected={sel("three-lists")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3%", top: "14%", width: "23%", height: "58%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 8, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>THREE LISTS</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <g>
              <rect x="14" y="10" width="72" height="20" rx="3" fill="#60a5fa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="50" y="22" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Union List · 97</text>
              <text x="50" y="27" textAnchor="middle" fontSize="4.5" fill="#fff">Defense · Foreign</text>
            </g>
            <g>
              <rect x="14" y="40" width="72" height="20" rx="3" fill="#34d399" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="50" y="52" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">State List · 66</text>
              <text x="50" y="57" textAnchor="middle" fontSize="4.5" fill="#1a1a2a">Police · Health</text>
            </g>
            <g>
              <rect x="14" y="70" width="72" height="20" rx="3" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="50" y="82" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">Concurrent · 47</text>
              <text x="50" y="87" textAnchor="middle" fontSize="4.5" fill="#1a1a2a">Education · Marriage</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={4} x={14.5} y={11.5} accent={ACCENT} selected={sel("three-lists")} onClick={tag("three-lists")} preview={preview} />

        {/* CENTER: 3-tier pyramid — 3 hotspots */}
        <Hotspot id="union-tier" selected={sel("union-tier")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "34%", top: "15%", width: "32%", height: "14%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#60a5fa", textAlign: "center" }}>UNION (Centre)</div>
          <svg viewBox="0 0 100 30" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <polygon points="30,4 70,4 80,26 20,26" fill="#60a5fa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
            <text x="50" y="20" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">Parliament · PM · SC</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={33} y={14} accent={ACCENT} selected={sel("union-tier")} onClick={tag("union-tier")} preview={preview} />

        <Hotspot id="state-tier" selected={sel("state-tier")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "32%", width: "40%", height: "14%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#34d399", textAlign: "center" }}>STATE (28 + 8 UTs)</div>
          <svg viewBox="0 0 100 30" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <polygon points="20,4 80,4 88,26 12,26" fill="#34d399" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
            <text x="50" y="20" textAnchor="middle" fontSize="7" fill="#1a1a2a" fontWeight="700">Vidhan Sabha · CM · HC</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={29} y={31} accent={ACCENT} selected={sel("state-tier")} onClick={tag("state-tier")} preview={preview} />

        <Hotspot id="local-tier" selected={sel("local-tier")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "26%", top: "49%", width: "48%", height: "20%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#fbbf24", textAlign: "center" }}>LOCAL (Panchayat · Municipality)</div>
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <polygon points="14,4 86,4 94,46 6,46" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
            <text x="50" y="22" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">Gram Panchayat</text>
            <text x="50" y="30" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">Block / District</text>
            <text x="50" y="40" textAnchor="middle" fontSize="5.5" fill="#1a1a2a">Municipalities</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={25} y={48} accent={ACCENT} selected={sel("local-tier")} onClick={tag("local-tier")} preview={preview} />

        {/* RIGHT: Coming Together vs Holding Together */}
        <Hotspot id="federation-types" selected={sel("federation-types")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "74%", top: "14%", width: "23%", height: "58%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>FEDERATION ROUTES</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <text x="50" y="10" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Coming Together</text>
            <g>
              <circle cx="20" cy="22" r="6" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.8" />
              <circle cx="40" cy="22" r="6" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.8" />
              <circle cx="30" cy="32" r="6" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.8" />
              <polygon points="60,27 75,18 75,36" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
              <text x="68" y="30" textAnchor="middle" fontSize="4" fill="#fff" fontWeight="700">USA · CH</text>
            </g>
            <line x1="10" y1="48" x2="90" y2="48" stroke={ACCENT} strokeWidth="0.4" strokeDasharray="2 2" />
            <text x="50" y="58" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Holding Together</text>
            <g>
              <rect x="40" y="65" width="20" height="14" rx="2" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
              <text x="50" y="74" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">IND</text>
              <rect x="14" y="78" width="18" height="10" rx="2" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.8" />
              <rect x="68" y="78" width="18" height="10" rx="2" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.8" />
              <text x="23" y="85" textAnchor="middle" fontSize="4" fill="#1a1a2a" fontWeight="700">State</text>
              <text x="77" y="85" textAnchor="middle" fontSize="4" fill="#1a1a2a" fontWeight="700">State</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={5} x={85.5} y={11.5} accent={ACCENT} selected={sel("federation-types")} onClick={tag("federation-types")} preview={preview} />

        {/* Decentralisation 1992 badge */}
        <Hotspot id="decentralisation-1992" selected={sel("decentralisation-1992")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "35%", top: "72%", width: "30%", height: "10%", background: "rgba(20,15,30,0.7)", borderRadius: 20, padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: ACCENT, textAlign: "center" }}>📜 Decentralisation 1992</span>
        </Hotspot>
        <Tag n={6} x={66} y={72} accent={ACCENT} selected={sel("decentralisation-1992")} onClick={tag("decentralisation-1992")} preview={preview} />

        <Plaque title="Federalism" caption="Ch 12 · Democratic Politics — Union · State · Local sharing power" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolFederalismExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-federalism",
  chapterId: 12,
  track: "ssc",
  title: "Federalism",
  subtitle: "SSC Pol. Sci · Ch 12 — Federalism",
  description:
    "Federalism is a system of government in which power is divided between a central authority and its constituent units (states). India is a 'holding together' federation with 3 tiers — Union, State, Local. The 73rd & 74th Amendments (1992) constitutionalised local self-government. Three lists divide legislative subjects: Union List (97), State List (66), Concurrent List (47), with residuary powers vested in the Centre.",
  accent: ACCENT,
  icon: "🏛️",
  parts: [
    { id: "union-tier", name: "Union Government", info: "The central tier — Parliament (Lok Sabha + Rajya Sabha), Prime Minister & Council of Ministers, Supreme Court. Holds the Union List (97 subjects including defence, foreign affairs, banking, atomic energy, citizenship). Residuary powers (subjects not in any list) vest with the Centre (Article 248)." },
    { id: "state-tier", name: "State Government", info: "28 States + 8 Union Territories. Each state has a Vidhan Sabha (Legislative Assembly), Chief Minister & Council of Ministers, and a High Court (some states share). Holds the State List (66 subjects: police, public health, agriculture, local government, public order). Article 356 (President's Rule) limits state autonomy in emergencies." },
    { id: "local-tier", name: "Local Government", info: "Decentralised self-government — the foundation of grassroots democracy. Panchayati Raj (rural): 3-tier — Gram Panchayat (village) → Block/Panchayat Samiti (block) → Zilla Parishad (district). Municipalities (urban): Municipal Corporation, Municipal Council, Nagar Panchayat. Powers devolved: civic services, local planning, welfare." },
    { id: "three-lists", name: "Three Lists", info: "Constitution divides legislative subjects: Union List (97 — defence, foreign affairs, banking, communications), State List (66 — police, public health, agriculture, local govt), Concurrent List (47 — education, marriage, bankruptcy, forests, trade unions — both can make law but Centre prevails in conflict). Residuary powers (e.g. cyber law) vest with the Centre." },
    { id: "federation-types", name: "Coming Together vs Holding Together", info: "Coming Together federations (USA 1789, Switzerland, Australia) — independent states voluntarily pool sovereignty to form a strong union; states have significant powers. Holding Together federations (India, Spain, Belgium) — a pre-existing central government decides to decentralise and create states; the Centre tends to be more powerful; allows asymmetry (e.g. Article 370 for J&K, special provisions for Nagaland, Assam under Article 371)." },
    { id: "decentralisation-1992", name: "Decentralisation 1992 (73rd & 74th Amendments)", info: "The 73rd & 74th Constitutional Amendments (1992), in force from 1993, gave constitutional status to Panchayati Raj (rural) and Municipalities (urban). Mandatory: regular elections (State Election Commission), 5-year term, reservation of seats for SC/ST, and 1/3 reservation for women (now 50% in many states). Optional: devolution of funds, functions and functionaries (the 3 Fs). Three-tier Panchayati Raj became compulsory in states with >20 lakh population." },
  ],
  Panel: FederalismPanel,
};
