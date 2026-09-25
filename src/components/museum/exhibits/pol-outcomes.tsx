"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#7c3aed";

function OutcomesPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="out-bg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#1a2a5a" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#out-bg)" />
          {/* faint upward arrow */}
          <g stroke={ACCENT} strokeWidth="0.3" fill="none" opacity="0.13">
            <line x1="50" y1="80" x2="50" y2="20" />
            <polygon points="50,16 46,24 54,24" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>📈 OUTCOMES OF DEMOCRACY</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Accountability · Responsiveness · Welfare · Dignity</div>

        {/* LEFT: Dictatorship vs Democracy growth chart */}
        <Hotspot id="comparison" selected={sel("comparison")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3%", top: "14%", width: "24%", height: "60%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>DICT. vs DEMO. · GROWTH</div>
          <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* axes */}
            <line x1="10" y1="68" x2="92" y2="68" stroke="#fff" strokeWidth="0.5" />
            <line x1="10" y1="68" x2="10" y2="6" stroke="#fff" strokeWidth="0.5" />
            {/* Dictatorship line — rises fast then plateaus */}
            <polyline points="10,60 30,40 50,22 70,18 90,18" fill="none" stroke="#fb7185" strokeWidth="1.5" />
            <text x="70" y="14" textAnchor="middle" fontSize="4.5" fill="#fb7185" fontWeight="700">Dictatorship</text>
            {/* Democracy line — rises slower but steady */}
            <polyline points="10,62 30,54 50,42 70,30 90,22" fill="none" stroke="#34d399" strokeWidth="1.5" />
            <text x="80" y="28" textAnchor="middle" fontSize="4.5" fill="#34d399" fontWeight="700">Democracy</text>
            {/* axis labels */}
            <text x="50" y="76" textAnchor="middle" fontSize="4.5" fill="#a89880">Time (1950 → 2000)</text>
            <text x="6" y="40" textAnchor="middle" fontSize="4" fill="#a89880" transform="rotate(-90 6 40)">GDP</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={15.5} y={13} accent={ACCENT} selected={sel("comparison")} onClick={tag("comparison")} preview={preview} />

        {/* CENTER: 2x2 quadrant grid — 4 hotspots */}
        <div style={{ position: "absolute", left: "30%", top: "14%", width: "40%", height: "60%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px" }}>
          {/* Quadrant 1: Accountable */}
          <Hotspot id="accountable" selected={sel("accountable")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#60a5fa", textAlign: "center" }}>ACCOUNTABLE</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              {/* ballot box with question mark */}
              <rect x="30" y="14" width="40" height="30" rx="2" fill="#60a5fa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
              <line x1="50" y1="8" x2="50" y2="14" stroke="#fff" strokeWidth="1.5" />
              <text x="50" y="36" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="700">?</text>
              <text x="50" y="54" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">answerable to people</text>
            </svg>
          </Hotspot>
          {/* Quadrant 2: Responsive */}
          <Hotspot id="responsive" selected={sel("responsive")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#34d399", textAlign: "center" }}>RESPONSIVE</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              {/* ear + signal waves */}
              <path d="M 30 30 Q 30 18 42 18 Q 50 18 50 30 Q 50 42 42 50" fill="none" stroke="#34d399" strokeWidth="2" />
              <path d="M 56 18 Q 64 30 56 42" fill="none" stroke="#34d399" strokeWidth="1.5" />
              <path d="M 64 14 Q 76 30 64 46" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
              <text x="50" y="58" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">listens to needs</text>
            </svg>
          </Hotspot>
          {/* Quadrant 3: Economic Growth & Equality */}
          <Hotspot id="economic-growth" selected={sel("economic-growth")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#fbbf24", textAlign: "center" }}>ECON. GROWTH</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              {/* rising bars + upward arrow */}
              <rect x="14" y="40" width="10" height="14" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" opacity="0.85" />
              <rect x="32" y="30" width="10" height="24" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" opacity="0.85" />
              <rect x="50" y="22" width="10" height="32" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" opacity="0.85" />
              <rect x="68" y="12" width="10" height="42" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" opacity="0.85" />
              <polygon points="86,10 80,18 92,18" fill="#34d399" />
              <line x1="86" y1="18" x2="86" y2="50" stroke="#34d399" strokeWidth="1" />
            </svg>
          </Hotspot>
          {/* Quadrant 4: Equality & Dignity */}
          <Hotspot id="equality-dignity" selected={sel("equality-dignity")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
            style={{ position: "relative", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#fb7185", textAlign: "center" }}>EQUALITY · DIGNITY</div>
            <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
              {/* 3 equal figures holding hands */}
              <g fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.4">
                <circle cx="22" cy="18" r="4" /><rect x="18" y="22" width="8" height="14" />
                <circle cx="50" cy="18" r="4" /><rect x="46" y="22" width="8" height="14" />
                <circle cx="78" cy="18" r="4" /><rect x="74" y="22" width="8" height="14" />
              </g>
              <line x1="26" y1="28" x2="46" y2="28" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="54" y1="28" x2="74" y2="28" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="50" y="48" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">all equal</text>
            </svg>
          </Hotspot>
        </div>
        <Tag n={1} x={33} y={13} accent={ACCENT} selected={sel("accountable")} onClick={tag("accountable")} preview={preview} />
        <Tag n={2} x={67} y={13} accent={ACCENT} selected={sel("responsive")} onClick={tag("responsive")} preview={preview} />
        <Tag n={3} x={33} y={76} accent={ACCENT} selected={sel("economic-growth")} onClick={tag("economic-growth")} preview={preview} />
        <Tag n={4} x={67} y={76} accent={ACCENT} selected={sel("equality-dignity")} onClick={tag("equality-dignity")} preview={preview} />

        {/* RIGHT: Freedom & Dignity */}
        <Hotspot id="freedom-dignity" selected={sel("freedom-dignity")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "73%", top: "14%", width: "24%", height: "60%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>FREEDOM · DIGNITY</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* scales of justice */}
            <g stroke={ACCENT} strokeWidth="1" fill="none">
              <line x1="50" y1="14" x2="50" y2="60" />
              <line x1="26" y1="24" x2="74" y2="24" />
              <line x1="26" y1="24" x2="26" y2="34" />
              <line x1="74" y1="24" x2="74" y2="34" />
              <path d="M 18 34 L 34 34 L 30 44 L 22 44 Z" fill={ACCENT} opacity="0.4" />
              <path d="M 66 34 L 82 34 L 78 44 L 70 44 Z" fill={ACCENT} opacity="0.4" />
              <polygon points="44,60 56,60 50,68" fill={ACCENT} />
            </g>
            {/* vote box */}
            <rect x="32" y="74" width="36" height="18" rx="2" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.85" />
            <line x1="50" y1="70" x2="50" y2="74" stroke="#fff" strokeWidth="1.5" />
            <text x="50" y="86" textAnchor="middle" fontSize="6" fill="#1a1a2a" fontWeight="700">VOTE</text>
          </svg>
        </Hotspot>
        <Tag n={6} x={85.5} y={13} accent={ACCENT} selected={sel("freedom-dignity")} onClick={tag("freedom-dignity")} preview={preview} />

        <Plaque title="Outcomes of Democracy" caption="Ch 16 · Democratic Politics — accountability, welfare, dignity" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolOutcomesExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-outcomes",
  chapterId: 16,
  track: "ssc",
  title: "Outcomes of Democracy",
  subtitle: "SSC Pol. Sci · Ch 16 — Outcomes of Democracy",
  description:
    "Democracy is judged by its outcomes. (1) Accountable, responsive and legitimate government — regular elections, transparency (RTI Act 2005), answerable to people & legislature. (2) Economic growth & equality — democracies grew slightly slower than dictatorships 1950-2000 but distributed gains better; Kerala model = high welfare/low growth, Gujarat = high growth. (3) Reduction of inequality & dignity — reservations, NALSA 2014, anti-dowry laws, 73rd/74th amendments. (4) Freedom & dignity — political equality, freedom of speech (Article 19), dignity of citizens.",
  accent: ACCENT,
  icon: "📈",
  parts: [
    { id: "accountable", name: "Accountable Government", info: "Democracy produces a government that is accountable to citizens: regular elections (LS every 5 years), answerable to Parliament/Legislature via Question Hour, CAG audits, and an independent judiciary. RTI Act 2005 lets citizens demand information from public authorities. COST: decision-making is slower (consultation, debate, consensus). But accountability prevents arbitrary, corrupt rule and ensures legitimacy — a government people accept because they chose it." },
    { id: "responsive", name: "Responsive Government", info: "A democracy responds to citizens' needs — through public opinion, pressure groups, media, and opposition criticism. Slower than dictatorship but accommodative of diversity. Amartya Sen's classic example: famines do not occur in functioning democracies (free press exposes shortages, opposition pressures govt to act). Bengal famine 1943 (under colonial rule) vs no famines after independence. Responsive ≠ efficient, but it prevents catastrophic failures." },
    { id: "economic-growth", name: "Economic Growth & Equality", info: "Dictatorships grew slightly faster than democracies 1950-2000 in some cases (e.g. South Korea under Park, China post-1978), but democracies distribute gains better — lower infant mortality, higher literacy, longer life expectancy. India's Kerala model: low per-capita income but high literacy (94%), low infant mortality, high life expectancy — welfare over pure growth. Gujarat: high growth, mixed welfare outcomes. Democracy gives trade-offs the poor can negotiate." },
    { id: "equality-dignity", name: "Reduction of Inequality & Dignity", info: "Democracy reduces discrimination on caste, gender, race. Constitutional safeguards: Article 14 (equality), Article 15 (no discrimination), Article 17 (abolished untouchability), reservations for SC/ST/OBC. Dignity of women: 73rd/74th amendments (1/3 local reservation), Dowry Prohibition Act 1961, PCPNDT Act 1994, NALSA judgment 2014 recognised transgender as third gender with full constitutional rights. Democracy is the only system where the marginalized can claim dignity through law and vote." },
    { id: "comparison", name: "Democracy vs Dictatorship", info: "Democracy: political equality (one person, one vote), slower decision-making, accommodative of diversity, legitimacy through consent, better welfare outcomes (health, education, longevity). Dictatorship: faster decisions, less legitimacy, no rights/freedoms, gains captured by elites. Cross-country studies (Sen, Przeworski) show democracies better on welfare outcomes — fewer famines, lower child mortality, higher education. On pure GDP growth, mixed evidence. Overall: democracy delivers more freedom + dignity, slightly slower growth, much better welfare." },
    { id: "freedom-dignity", name: "Freedom & Dignity of Citizens", info: "Democracy is the only system that institutionalises freedom: Article 19 (speech, assembly, association, movement), Article 21 (life & personal liberty — expanded by Supreme Court to include privacy 2017 Puttaswamy, dignity, clean environment). Citizens can criticise the government, protest, form unions, change rulers peacefully. Dignity: every citizen has equal moral worth — no slavery, no forced labour (Article 23), no exploitation. Democracy passes the 'dignity test' that dictatorships fail — individuals are ends, not means." },
  ],
  Panel: OutcomesPanel,
};
