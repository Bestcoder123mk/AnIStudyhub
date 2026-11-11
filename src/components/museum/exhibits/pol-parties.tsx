"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#9333ea";

function PartiesPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="part-bg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#2a1346" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#part-bg)" />
          {/* faint ticket/confetti */}
          <g stroke={ACCENT} strokeWidth="0.2" fill="none" opacity="0.13">
            <circle cx="18" cy="78" r="2" /><circle cx="82" cy="20" r="2" />
            <rect x="48" y="86" width="3" height="3" /><rect x="10" y="40" width="3" height="3" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>🎫 POLITICAL PARTIES</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Spectrum · National · Regional · Challenges</div>

        {/* LEFT: National Parties */}
        <Hotspot id="national-parties" selected={sel("national-parties")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3%", top: "14%", width: "24%", height: "58%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>NATIONAL PARTIES (6)</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* 6 chips stacked */}
            <g>
              <rect x="6" y="6" width="88" height="12" rx="3" fill="#f97316" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="15" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">BJP · Lotus</text>
            </g>
            <g>
              <rect x="6" y="22" width="88" height="12" rx="3" fill="#06b6d4" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="31" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">INC · Hand</text>
            </g>
            <g>
              <rect x="6" y="38" width="88" height="12" rx="3" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="47" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">CPI(M) · Hammer-Sickle</text>
            </g>
            <g>
              <rect x="6" y="54" width="88" height="12" rx="3" fill="#1e3a8a" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="63" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">BSP · Elephant</text>
            </g>
            <g>
              <rect x="6" y="70" width="88" height="12" rx="3" fill="#16a34a" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="79" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">NCP · Clock</text>
            </g>
            <g>
              <rect x="6" y="86" width="88" height="12" rx="3" fill="#7c3aed" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="95" textAnchor="middle" fontSize="6.5" fill="#fff" fontWeight="700">AITC · Flowers</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={2} x={4.5} y={13} accent={ACCENT} selected={sel("national-parties")} onClick={tag("national-parties")} preview={preview} />

        {/* CENTER: Party spectrum (left ↔ centre ↔ right) */}
        <Hotspot id="party-spectrum" selected={sel("party-spectrum")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "14%", width: "40%", height: "58%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>IDEOLOGICAL SPECTRUM</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* gradient bar */}
            <defs>
              <linearGradient id="spec-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <rect x="6" y="48" width="88" height="14" rx="3" fill="url(#spec-grad)" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
            {/* Left block */}
            <g>
              <polygon points="10,14 36,14 30,46 16,46" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
              <text x="23" y="28" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">LEFT</text>
              <text x="23" y="36" textAnchor="middle" fontSize="4.5" fill="#fff">CPI · CPI(M)</text>
              <text x="23" y="42" textAnchor="middle" fontSize="4" fill="#fff">pro-poor · public</text>
            </g>
            {/* Centre block */}
            <g>
              <polygon points="40,14 60,14 56,46 44,46" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
              <text x="50" y="28" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">CENTRE</text>
              <text x="50" y="36" textAnchor="middle" fontSize="4.5" fill="#1a1a2a">INC · BJP</text>
              <text x="50" y="42" textAnchor="middle" fontSize="4" fill="#1a1a2a">welfare / nationalist</text>
            </g>
            {/* Right block */}
            <g>
              <polygon points="64,14 90,14 84,46 70,46" fill="#1e3a8a" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
              <text x="77" y="28" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">RIGHT</text>
              <text x="77" y="36" textAnchor="middle" fontSize="4.5" fill="#fff">Shiv Sena</text>
              <text x="77" y="42" textAnchor="middle" fontSize="4" fill="#fff">regionalist</text>
            </g>
            {/* labels under bar */}
            <text x="10" y="74" textAnchor="middle" fontSize="4.5" fill="#fff">← State</text>
            <text x="50" y="74" textAnchor="middle" fontSize="4.5" fill="#fff">Mixed</text>
            <text x="90" y="74" textAnchor="middle" fontSize="4.5" fill="#fff">Market →</text>
            <text x="50" y="88" textAnchor="middle" fontSize="5" fill={ACCENT} fontWeight="700" fontStyle="italic">Left ↔ Centre ↔ Right</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={50} y={12} accent={ACCENT} selected={sel("party-spectrum")} onClick={tag("party-spectrum")} preview={preview} />

        {/* RIGHT: Regional/State Parties */}
        <Hotspot id="regional-parties" selected={sel("regional-parties")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "14%", width: "24%", height: "58%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>REGIONAL PARTIES</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            <g>
              <rect x="6" y="6" width="88" height="12" rx="3" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="15" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">DMK · Tamil Nadu</text>
            </g>
            <g>
              <rect x="6" y="22" width="88" height="12" rx="3" fill="#16a34a" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="31" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">AIADMK · Tamil Nadu</text>
            </g>
            <g>
              <rect x="6" y="38" width="88" height="12" rx="3" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="47" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">TDP · Andhra Pradesh</text>
            </g>
            <g>
              <rect x="6" y="54" width="88" height="12" rx="3" fill="#f97316" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="63" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Shiv Sena · MH</text>
            </g>
            <g>
              <rect x="6" y="70" width="88" height="12" rx="3" fill="#1e3a8a" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="79" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">SAD · Punjab</text>
            </g>
            <g>
              <rect x="6" y="86" width="88" height="12" rx="3" fill="#7c3aed" stroke="#1a1a2a" strokeWidth="0.6" />
              <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">BJD · Odisha</text>
            </g>
          </svg>
        </Hotspot>
        <Tag n={3} x={95.5} y={13} accent={ACCENT} selected={sel("regional-parties")} onClick={tag("regional-parties")} preview={preview} />

        {/* BOTTOM-LEFT: One-party vs Multi-party */}
        <Hotspot id="party-systems" selected={sel("party-systems")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "5%", top: "75%", width: "42%", height: "13%", background: "rgba(20,15,30,0.6)", borderRadius: 8, padding: 3, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* one-party: single large block */}
              <rect x="14" y="6" width="22" height="30" rx="2" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.5" />
              <text x="25" y="24" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">1</text>
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>One-party (China)</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* two-party: two blocks */}
              <rect x="6" y="6" width="16" height="30" rx="2" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.5" />
              <rect x="28" y="6" width="16" height="30" rx="2" fill="#1e3a8a" stroke="#1a1a2a" strokeWidth="0.5" />
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Two-party (USA/UK)</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* multi-party: many small blocks */}
              <rect x="4" y="6" width="6" height="30" rx="1" fill="#dc2626" stroke="#1a1a2a" strokeWidth="0.3" />
              <rect x="12" y="10" width="6" height="26" rx="1" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.3" />
              <rect x="20" y="6" width="6" height="30" rx="1" fill="#16a34a" stroke="#1a1a2a" strokeWidth="0.3" />
              <rect x="28" y="12" width="6" height="24" rx="1" fill="#06b6d4" stroke="#1a1a2a" strokeWidth="0.3" />
              <rect x="36" y="6" width="6" height="30" rx="1" fill="#7c3aed" stroke="#1a1a2a" strokeWidth="0.3" />
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Multi-party (India)</div>
          </div>
        </Hotspot>
        <Tag n={4} x={6} y={75} accent={ACCENT} selected={sel("party-systems")} onClick={tag("party-systems")} preview={preview} />

        {/* BOTTOM-RIGHT: Challenges */}
        <Hotspot id="challenges" selected={sel("challenges")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "53%", top: "75%", width: "42%", height: "13%", background: "rgba(20,15,30,0.6)", borderRadius: 8, padding: 3, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* money bag */}
              <ellipse cx="25" cy="24" rx="14" ry="12" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" />
              <rect x="18" y="6" width="14" height="6" rx="1" fill="#1a1a2a" />
              <text x="25" y="28" textAnchor="middle" fontSize="10" fill="#1a1a2a" fontWeight="700">₹</text>
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Money power</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* dynasty: family tree crown */}
              <circle cx="25" cy="14" r="5" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.5" />
              <line x1="25" y1="19" x2="25" y2="28" stroke="#1a1a2a" strokeWidth="0.6" />
              <circle cx="14" cy="32" r="4" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.5" />
              <circle cx="36" cy="32" r="4" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.5" />
              <line x1="25" y1="28" x2="14" y2="32" stroke="#1a1a2a" strokeWidth="0.5" />
              <line x1="25" y1="28" x2="36" y2="32" stroke="#1a1a2a" strokeWidth="0.5" />
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Dynasty</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* no internal democracy: locked ballot */}
              <rect x="10" y="10" width="30" height="22" rx="2" fill="#1e3a8a" stroke="#1a1a2a" strokeWidth="0.5" />
              <circle cx="25" cy="20" r="4" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" />
              <rect x="23" y="20" width="4" height="6" fill="#1a1a2a" />
            </svg>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: ACCENT, textAlign: "center" }}>No inner democracy</div>
          </div>
        </Hotspot>
        <Tag n={5} x={94} y={75} accent={ACCENT} selected={sel("challenges")} onClick={tag("challenges")} preview={preview} />

        <Plaque title="Political Parties" caption="Ch 15 · Democratic Politics — the vehicles of democratic choice" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolPartiesExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-parties",
  chapterId: 15,
  track: "ssc",
  title: "Political Parties",
  subtitle: "SSC Pol. Sci · Ch 15 — Political Parties",
  description:
    "Political parties are essential to democracy — they contest elections, form governments, shape public opinion, and provide a choice to voters. India has a multi-party system with 6 recognised national parties (BJP, INC, CPI(M), BSP, NCP, AITC as of 2019) and ~50 state parties. Challenges include lack of internal democracy, dynastic succession, money/muscle power, and lack of meaningful ideological choice. Reforms: anti-defection law (52nd Amendment 1985), disclosure of criminal records, state funding debates.",
  accent: ACCENT,
  icon: "🎫",
  parts: [
    { id: "party-spectrum", name: "Ideological Spectrum (Left · Centre · Right)", info: "LEFT (CPI, CPI(M)): pro-poor, public sector, land redistribution, workers' rights. CENTRE-LEFT (Congress): secularism, welfare, mixed economy, inclusive nationalism. CENTRE-RIGHT (BJP): cultural nationalism (Hindutva), market-friendly reforms, strong state. RIGHT (Shiv Sena — historically): regionalist, Marathi identity. India lacks a hard free-market right; consensus on welfare since 1990s reforms." },
    { id: "national-parties", name: "National Parties", info: "ECI recognition criteria: a party must be recognised in ≥4 states AND win ≥2% of Lok Sabha seats (from any state(s)) OR win 4% of valid votes in 4 states in last LS election. 6 national parties (2019): BJP (lotus), INC (hand), CPI(M) (hammer-sickle), BSP (elephant), NCP (clock), AITC (two flowers & grass). Symbols reserved nationwide. National parties file audited returns with ECI and tax returns with IT." },
    { id: "regional-parties", name: "Regional / State Parties", info: "Recognised in only one state (or a few). Examples: DMK & AIADMK (Tamil Nadu, Dravidian politics), TDP & YSRCP (Andhra Pradesh), BJD (Odisha), Shiv Sena (Maharashtra, now split), SAD (Punjab), TRS/BRS (Telangana), JDU & RJD (Bihar), SP & BSP (UP). Protect regional culture, languages, and aspirations; often kingmakers in coalition governments at the Centre since 1989." },
    { id: "party-systems", name: "Party Systems", info: "One-party system: single party legally permitted to govern (China — Communist Party, Cuba, North Korea). No competition → not a democracy in the multi-party sense. Two-party system: two major parties alternate power (USA — Democrats & Republicans; UK — Labour & Conservatives). Multi-party system: several parties compete; coalition governments common (India — 750+ registered parties, 6 national + 50+ state, coalitions since 1989; France, Italy, Japan)." },
    { id: "challenges", name: "Challenges Facing Parties", info: "(1) Lack of internal democracy — power concentrated in top leaders, no regular elections within party, no membership registers. (2) Dynastic succession — Gandhi (Congress), Karunanidhi/Stalin (DMK), Thackeray (Shiv Sena), Yadav (SP) — family over merit. (3) Money & muscle power — candidates with criminal records (Association for Democratic Reforms reports ~43% LS 2019 MPs face serious criminal charges); parties favour rich candidates. (4) Lack of meaningful choice — parties converge on similar policies, ideological differences blur." },
  ],
  Panel: PartiesPanel,
};
