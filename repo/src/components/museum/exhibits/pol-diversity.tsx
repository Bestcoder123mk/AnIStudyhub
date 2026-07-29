"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#a855f7";

function DiversityPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="div-bg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#2a1a4a" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#div-bg)" />
          {/* faint figures in background */}
          <g stroke={ACCENT} strokeWidth="0.3" fill="none" opacity="0.12">
            <circle cx="20" cy="50" r="4" />
            <line x1="20" y1="54" x2="20" y2="68" />
            <line x1="20" y1="58" x2="14" y2="62" />
            <line x1="20" y1="58" x2="26" y2="62" />
            <circle cx="80" cy="50" r="4" />
            <line x1="80" y1="54" x2="80" y2="68" />
            <line x1="80" y1="58" x2="74" y2="62" />
            <line x1="80" y1="58" x2="86" y2="62" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>👥 DEMOCRACY &amp; DIVERSITY</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Social Divisions · Politics · USA 1954-68</div>

        {/* LEFT: Civil Rights Movement USA */}
        <Hotspot id="civil-rights-usa" selected={sel("civil-rights-usa")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3%", top: "14%", width: "23%", height: "60%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>CIVIL RIGHTS · USA</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* MLK silhouette + speech bubble */}
            <circle cx="32" cy="30" r="9" fill="#1a1a2a" stroke={ACCENT} strokeWidth="0.8" />
            <path d="M 23 38 L 41 38 L 44 64 L 20 64 Z" fill="#1a1a2a" stroke={ACCENT} strokeWidth="0.8" />
            {/* speech bubble */}
            <rect x="48" y="14" width="46" height="24" rx="3" fill="#fde68a" stroke="#1a1a2a" strokeWidth="0.8" />
            <polygon points="48,24 42,28 48,30" fill="#fde68a" stroke="#1a1a2a" strokeWidth="0.8" />
            <text x="71" y="24" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">"I HAVE A</text>
            <text x="71" y="31" textAnchor="middle" fontSize="5" fill="#1a1a2a" fontWeight="700">DREAM"</text>
            {/* marchers */}
            <g fill="#1a1a2a" stroke={ACCENT} strokeWidth="0.4">
              <circle cx="18" cy="78" r="3" /><rect x="15" y="80" width="6" height="14" />
              <circle cx="40" cy="78" r="3" /><rect x="37" y="80" width="6" height="14" />
              <circle cx="60" cy="78" r="3" /><rect x="57" y="80" width="6" height="14" />
              <circle cx="80" cy="78" r="3" /><rect x="77" y="80" width="6" height="14" />
            </g>
            <text x="50" y="98" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">1963 March · MLK Jr</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={14.5} y={11.5} accent={ACCENT} selected={sel("civil-rights-usa")} onClick={tag("civil-rights-usa")} preview={preview} />

        {/* CENTER: 3 overlapping circles (Venn) for racial/religious/linguistic */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", left: "29%", top: "13%", width: "42%", height: "60%" }}>
          {/* decorative overlapping translucent circles */}
          <circle cx="50" cy="28" r="22" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.35" />
          <circle cx="34" cy="58" r="22" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.35" />
          <circle cx="66" cy="58" r="22" fill="#67e8f9" stroke="#1a1a2a" strokeWidth="0.8" opacity="0.35" />
          <text x="50" y="30" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Racial</text>
          <text x="32" y="60" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Religious</text>
          <text x="68" y="60" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Linguistic</text>
        </svg>
        {/* 3 circular hotspots overlaying the circles */}
        <Hotspot id="racial-division" selected={sel("racial-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "42%", top: "16%", width: "16%", height: "16%", borderRadius: "50%", background: "transparent" }} />
        <Tag n={1} x={50} y={13} accent={ACCENT} selected={sel("racial-division")} onClick={tag("racial-division")} preview={preview} />

        <Hotspot id="religious-division" selected={sel("religious-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "31%", top: "44%", width: "16%", height: "16%", borderRadius: "50%", background: "transparent" }} />
        <Tag n={2} x={32} y={42} accent={ACCENT} selected={sel("religious-division")} onClick={tag("religious-division")} preview={preview} />

        <Hotspot id="linguistic-division" selected={sel("linguistic-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "53%", top: "44%", width: "16%", height: "16%", borderRadius: "50%", background: "transparent" }} />
        <Tag n={3} x={68} y={42} accent={ACCENT} selected={sel("linguistic-division")} onClick={tag("linguistic-division")} preview={preview} />

        {/* RIGHT: Black Power Movement */}
        <Hotspot id="black-power" selected={sel("black-power")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "74%", top: "14%", width: "23%", height: "60%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center", marginBottom: 2 }}>BLACK POWER</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* raised fist */}
            <g fill="#1a1a2a" stroke={ACCENT} strokeWidth="0.8">
              {/* forearm */}
              <rect x="40" y="62" width="20" height="28" rx="3" />
              {/* fist */}
              <rect x="34" y="22" width="32" height="42" rx="6" />
              {/* knuckle lines */}
              <line x1="34" y1="36" x2="66" y2="36" />
              <line x1="34" y1="46" x2="66" y2="46" />
            </g>
            <text x="50" y="14" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">✊ 1966</text>
            <text x="50" y="98" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">Black Panther Party</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={85.5} y={11.5} accent={ACCENT} selected={sel("black-power")} onClick={tag("black-power")} preview={preview} />

        {/* BOTTOM: Overlapping vs Cross-cutting */}
        <Hotspot id="overlap-vs-crosscut" selected={sel("overlap-vs-crosscut")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "26%", top: "76%", width: "48%", height: "12%", background: "rgba(20,15,30,0.6)", borderRadius: 8, padding: 3, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* Overlapping — one division stacks */}
              <circle cx="20" cy="20" r="14" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.6" opacity="0.7" />
              <circle cx="30" cy="20" r="14" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.6" opacity="0.7" />
            </svg>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#fb7185", textAlign: "center" }}>Overlapping</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* Cross-cutting — divisions cut across */}
              <circle cx="20" cy="20" r="14" fill="#67e8f9" stroke="#1a1a2a" strokeWidth="0.6" opacity="0.7" />
              <circle cx="30" cy="20" r="14" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.6" opacity="0.7" />
            </svg>
            <div style={{ fontSize: 6, fontWeight: 700, color: "#67e8f9", textAlign: "center" }}>Cross-cutting</div>
          </div>
        </Hotspot>
        <Tag n={6} x={74} y={76} accent={ACCENT} selected={sel("overlap-vs-crosscut")} onClick={tag("overlap-vs-crosscut")} preview={preview} />

        <Plaque title="Democracy and Diversity" caption="Ch 13 · Democratic Politics — three social divisions and politics" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolDiversityExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-diversity",
  chapterId: 13,
  track: "ssc",
  title: "Democracy and Diversity",
  subtitle: "SSC Pol. Sci · Ch 13 — Democracy and Diversity",
  description:
    "Social divisions — racial, religious, linguistic — shape politics. When one social difference overlaps with another, conflict deepens (Northern Ireland: Catholics = poor + Irish nationalists; Protestants = rich + UK unionists). When divisions cut across each other, accommodation is possible (Netherlands: Catholics & Protestants share class and political differences). The US Civil Rights Movement (1954-68, MLK Jr, non-violent) and Black Power Movement (1966, more militant) show how racial division became political.",
  accent: ACCENT,
  icon: "👥",
  parts: [
    { id: "racial-division", name: "Racial Division", info: "Division based on skin colour / physical traits. USA: Black vs White — slavery until 1865, segregation (Jim Crow) until 1960s. South Africa: Apartheid (1948-94) — official racial segregation. Rosa Parks (1955) refused to give up her bus seat → Montgomery Bus Boycott (381 days) → sparked the Civil Rights Movement. Race is a social construct, not biological." },
    { id: "religious-division", name: "Religious Division", info: "Division based on faith. Northern Ireland: Catholics (44%, Irish nationalists, want united Ireland) vs Protestants (53%, UK unionists) → 'The Troubles' 1968-1998, Good Friday Agreement. India: Hindu-Muslim tensions, occasionally communal violence. Yugoslavia: Orthodox Serbs, Catholic Croats, Bosniak Muslims → 1991-2001 wars after Tito." },
    { id: "linguistic-division", name: "Linguistic Division", info: "Division based on language. Belgium: Dutch-speaking Flemish (north) vs French-speaking Walloons (south); Brussels bilingual. Sri Lanka: Sinhala (74%) vs Tamil (18%) — 1956 'Sinhala Only Act' triggered the civil war. Canada: English-speaking majority vs French-speaking Quebec — Quiet Revolution, two referendums on Quebec independence (1980, 1995)." },
    { id: "civil-rights-usa", name: "Civil Rights Movement (USA, 1954-68)", info: "1954 Brown v. Board of Education ended school segregation. 1955 Montgomery Bus Boycott (Rosa Parks, MLK Jr). 1963 March on Washington — MLK's 'I Have a Dream' speech to 250,000. Civil Rights Act 1964 outlawed discrimination & segregation. Voting Rights Act 1965 ended literacy tests. MLK Jr assassinated 1968. Non-violent resistance inspired by Gandhi." },
    { id: "black-power", name: "Black Power Movement (1966-75)", info: "More militant strand. 1966: Stokely Carmichael coined 'Black Power'. Black Panther Party founded 1966 by Huey Newton & Bobby Seale — armed self-defence, free breakfast programs. Malcolm X (Nation of Islam, assassinated 1965) advocated separatism. Raised fist ✊ became the symbol. Demanded Black pride, economic self-sufficiency, and self-defence — diverging from MLK's integrationist, non-violent path." },
    { id: "overlap-vs-crosscut", name: "Overlapping vs Cross-cutting Differences", info: "Overlapping: one social difference reinforces another → deep conflict. Northern Ireland: Catholics are also poor & historically Irish nationalists; Protestants are also rich & unionists — class + religion + nationality all stack. Cross-cutting: differences cut across → accommodation easier. Netherlands: Catholics & Protestants are similar in class & politics; both cross-cut by ideological parties — so conflicts are milder and the country is stable." },
  ],
  Panel: DiversityPanel,
};
