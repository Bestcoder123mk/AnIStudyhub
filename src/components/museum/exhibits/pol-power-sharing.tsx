"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#c084fc";

function PowerSharingPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="ps-bg" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#241346" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#ps-bg)" />
          {/* faint scales of justice */}
          <g stroke={ACCENT} strokeWidth="0.25" fill="none" opacity="0.18">
            <line x1="50" y1="22" x2="50" y2="58" />
            <line x1="33" y1="34" x2="67" y2="34" />
            <path d="M 28 34 Q 33 44 38 34" />
            <path d="M 62 34 Q 67 44 72 34" />
            <polygon points="46,58 54,58 50,63" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>⚖️ POWER SHARING</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Belgium · Sri Lanka · Four Forms</div>

        {/* LEFT: Belgium map */}
        <Hotspot id="belgium" selected={sel("belgium")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3.5%", top: "16%", width: "24%", height: "62%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>BELGIUM</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* stylized Belgium shape: top=Flemish, bottom=Wallonia, center dot=Brussels */}
            <path d="M 15 22 L 85 22 L 88 50 L 50 50 L 50 82 L 12 80 Z" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.9" />
            <path d="M 12 80 L 50 82 L 50 50 L 88 50 L 85 78 L 50 88 Z" fill="#fb7185" stroke="#1a1a2a" strokeWidth="1" opacity="0.9" />
            <circle cx="50" cy="50" r="6" fill="#86efac" stroke="#1a1a2a" strokeWidth="1" />
            <text x="50" y="38" textAnchor="middle" fontSize="7" fill="#1a1a2a" fontWeight="700">Flemish (Dutch)</text>
            <text x="35" y="74" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Wallonia (French)</text>
            <text x="50" y="52" textAnchor="middle" fontSize="3.5" fill="#1a1a2a" fontWeight="700">Brussels</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={15.5} y={13.5} accent={ACCENT} selected={sel("belgium")} onClick={tag("belgium")} preview={preview} />

        {/* CENTER: 2x2 grid */}
        <div style={{ position: "absolute", left: "31%", top: "16%", width: "38%", height: "62%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px" }}>
          {/* Horizontal */}
          <Hotspot id="horizontal" selected={sel("horizontal")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Horizontal</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              <rect x="6" y="14" width="26" height="36" rx="3" fill="#67e8f9" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <rect x="37" y="14" width="26" height="36" rx="3" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <rect x="68" y="14" width="26" height="36" rx="3" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="19" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Legis.</text>
              <text x="50" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Exec.</text>
              <text x="81" y="34" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">Judic.</text>
              <path d="M 32 28 L 37 28" stroke="#fff" strokeWidth="1" />
              <path d="M 63 28 L 68 28" stroke="#fff" strokeWidth="1" />
            </svg>
          </Hotspot>
          {/* Vertical */}
          <Hotspot id="vertical" selected={sel("vertical")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Vertical</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              <polygon points="50,8 70,22 30,22" fill="#60a5fa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <polygon points="30,24 70,24 75,40 25,40" fill="#34d399" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <polygon points="25,42 75,42 80,56 20,56" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="50" y="18" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Union</text>
              <text x="50" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">State</text>
              <text x="50" y="51" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Local</text>
            </svg>
          </Hotspot>
          {/* Social groups */}
          <Hotspot id="social-groups" selected={sel("social-groups")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Social Groups</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              <circle cx="22" cy="32" r="14" fill="#fb7185" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <circle cx="50" cy="32" r="14" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <circle cx="78" cy="32" r="14" fill="#86efac" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="22" y="34" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">FR</text>
              <text x="50" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">NL</text>
              <text x="78" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">DE</text>
            </svg>
          </Hotspot>
          {/* Political groups */}
          <Hotspot id="political-groups" selected={sel("political-groups")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Political Groups</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              <circle cx="30" cy="32" r="14" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <circle cx="30" cy="32" r="6" fill="#fff" opacity="0.9" />
              <text x="30" y="34" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Party</text>
              <rect x="56" y="20" width="32" height="24" rx="3" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <text x="72" y="32" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Pressure</text>
              <text x="72" y="40" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">Groups</text>
            </svg>
          </Hotspot>
        </div>
        <Tag n={1} x={36} y={14} accent={ACCENT} selected={sel("horizontal")} onClick={tag("horizontal")} preview={preview} />
        <Tag n={2} x={64} y={14} accent={ACCENT} selected={sel("vertical")} onClick={tag("vertical")} preview={preview} />
        <Tag n={3} x={36} y={80} accent={ACCENT} selected={sel("social-groups")} onClick={tag("social-groups")} preview={preview} />
        <Tag n={4} x={64} y={80} accent={ACCENT} selected={sel("political-groups")} onClick={tag("political-groups")} preview={preview} />

        {/* RIGHT: Sri Lanka map */}
        <Hotspot id="sri-lanka" selected={sel("sri-lanka")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "72.5%", top: "16%", width: "24%", height: "62%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>SRI LANKA</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* stylized teardrop: top=Tamil (minority), bottom=Sinhala (majority) */}
            <path d="M 45 18 Q 75 22 78 50 Q 75 82 42 86 Q 22 80 22 55 Q 22 28 45 18 Z" fill="#fb7185" stroke="#1a1a2a" strokeWidth="1" opacity="0.9" />
            <path d="M 45 18 Q 75 22 78 50 L 22 55 Q 22 28 45 18 Z" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="1" opacity="0.9" />
            <text x="50" y="38" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">Tamil</text>
            <text x="50" y="68" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">Sinhala</text>
          </svg>
        </Hotspot>
        <Tag n={6} x={84.5} y={13.5} accent={ACCENT} selected={sel("sri-lanka")} onClick={tag("sri-lanka")} preview={preview} />

        <Plaque title="Power Sharing" caption="Ch 11 · Democratic Politics — distribute power to accommodate diversity" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolPowerSharingExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-power-sharing",
  chapterId: 11,
  track: "ssc",
  title: "Power Sharing",
  subtitle: "SSC Pol. Sci · Ch 11 — Power Sharing",
  description:
    "Power sharing is the spirit of democracy. Explore Belgium's accommodation (59% Flemish, 40% French, 1% German; Brussels bilingual; 1992-93 constitutional amendments) versus Sri Lanka's majoritarian path (74% Sinhala, 18% Tamil; 1956 Sinhala Only Act; civil war 1983-2009). Four forms: horizontal (Legislature-Executive-Judiciary-Media), vertical (Union-State-Local), among social groups (community government), and among political parties & pressure groups.",
  accent: ACCENT,
  icon: "⚖️",
  parts: [
    { id: "horizontal", name: "Horizontal Power Sharing", info: "Power shared among organs of government at the SAME level — Legislature (makes laws), Executive (implements), Judiciary (interprets) and the Media/press. Each organ checks the others — a system of checks & balances that prevents any single organ from becoming all-powerful. Modeled on India's parliamentary system and Montesquieu's separation of powers." },
    { id: "vertical", name: "Vertical Power Sharing", info: "Power shared among governments at DIFFERENT levels — Union (central) → State → Local (Municipality/Panchayat). This is federal division / decentralisation: the Constitution defines the jurisdiction of each tier so that lower levels (state, local) are not mere agents of the centre but have their own powers. India's 73rd & 74th Amendments (1992) constitutionalised local government." },
    { id: "social-groups", name: "Among Social Groups", info: "Power shared among religious and linguistic groups. Belgium's 'Community Government' is the textbook example — elected by French, Dutch and German speakers, it handles cultural, educational and language-related matters. Such arrangements protect minority groups from majority domination and give them a stake in the system." },
    { id: "political-groups", name: "Political Parties & Pressure Groups", info: "Power shared when no single party wins a majority — coalitions of political parties share executive power (India since 1989). Pressure groups (trade unions, business associations like FICCI/CII, farmers' bodies, students' unions) also influence government decisions through lobbying, agitation and representation — sharing power informally without contesting elections." },
    { id: "belgium", name: "Belgium — Accommodation", info: "Belgium: 59% live in Flemish region (Dutch), 40% in Wallonia (French), 1% German speakers; Brussels is bilingual (80% French, 20% Dutch) but located in Flemish region. The Constitution was amended in 1992-93 to share power: (a) equal French & Dutch ministers in central govt, (b) state governments separate from central, (c) community govt for cultural matters, (d) equal representation in Brussels. Result: avoided division." },
    { id: "sri-lanka", name: "Sri Lanka — Majoritarianism", info: "Sri Lanka: 74% Sinhala, 18% Tamil (of which 13% Sri Lankan Tamil + 5% Indian Tamil), 7% Muslim. The 1956 'Sinhala Only Act' made Sinhala the sole official language; state favoured Sinhala applicants for jobs & education. Tamils felt alienated → demand for separate Eelam → Civil War 1983-2009; LTTE defeated in May 2009. A cautionary tale of majoritarianism." },
  ],
  Panel: PowerSharingPanel,
};
