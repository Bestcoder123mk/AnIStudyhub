"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const ACCENT = "#d946ef";

function GenderReligionCastePanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
  const sel = (id: string) => selectedPart === id;
  const tag = (id: string) => () => onSelectPart(sel(id) ? null : id);
  return (
    <div style={panelContainerStyle(ACCENT, preview)}>
      <PaintingFrame accent={ACCENT}>
        {/* Background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="grc-bg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#3a1a4a" />
              <stop offset="100%" stopColor="#0a0917" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#grc-bg)" />
          {/* faint triple-helix pattern */}
          <g stroke={ACCENT} strokeWidth="0.2" fill="none" opacity="0.12">
            <path d="M 20 10 Q 30 30 20 50 Q 10 70 20 90" />
            <path d="M 50 10 Q 60 30 50 50 Q 40 70 50 90" />
            <path d="M 80 10 Q 90 30 80 50 Q 70 70 80 90" />
          </g>
        </svg>

        {/* Title */}
        <div style={{ position: "absolute", top: "3%", left: "50%", transform: "translateX(-50%)", fontSize: 12, fontWeight: 800, color: ACCENT, fontFamily: "Georgia, serif", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>🌐 GENDER · RELIGION · CASTE</div>
        <div style={{ position: "absolute", top: "8.5%", left: "50%", transform: "translateX(-50%)", fontSize: 8, color: "#a89880", fontStyle: "italic", fontFamily: "Georgia, serif" }}>Three Social Dimensions in Indian Politics</div>

        {/* TOP-LEFT: Sex Ratio bar chart */}
        <Hotspot id="sex-ratio" selected={sel("sex-ratio")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "3%", top: "13%", width: "26%", height: "26%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>SEX RATIO · 2011</div>
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* baseline */}
            <line x1="8" y1="42" x2="92" y2="42" stroke="#fff" strokeWidth="0.5" />
            {/* bars: Haryana 879, India 943, Kerala 1084 (per 1000 males) */}
            <rect x="14" y="22" width="14" height="20" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.5" />
            <text x="21" y="48" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">Haryana</text>
            <text x="21" y="19" textAnchor="middle" fontSize="4" fill="#fb7185" fontWeight="700">879</text>
            <rect x="42" y="14" width="14" height="28" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" />
            <text x="49" y="48" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">India</text>
            <text x="49" y="11" textAnchor="middle" fontSize="4" fill="#fbbf24" fontWeight="700">943</text>
            <rect x="70" y="6" width="14" height="36" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.5" />
            <text x="77" y="48" textAnchor="middle" fontSize="4.5" fill="#fff" fontWeight="700">Kerala</text>
            <text x="77" y="3" textAnchor="middle" fontSize="4" fill="#34d399" fontWeight="700">1084</text>
          </svg>
        </Hotspot>
        <Tag n={4} x={4.5} y={12} accent={ACCENT} selected={sel("sex-ratio")} onClick={tag("sex-ratio")} preview={preview} />

        {/* TOP-RIGHT: Communalism */}
        <Hotspot id="communalism" selected={sel("communalism")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "71%", top: "13%", width: "26%", height: "26%", background: "rgba(20,15,30,0.55)", borderRadius: 8, padding: 4, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: ACCENT, textAlign: "center" }}>COMMUNALISM</div>
          <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* divided crowd — two groups on either side */}
            <g fill="#1a1a2a" stroke="#fff" strokeWidth="0.4">
              <circle cx="10" cy="22" r="3" /><rect x="7" y="24" width="6" height="14" />
              <circle cx="20" cy="22" r="3" /><rect x="17" y="24" width="6" height="14" />
              <circle cx="30" cy="22" r="3" /><rect x="27" y="24" width="6" height="14" />
            </g>
            <g fill="#1a1a2a" stroke="#fff" strokeWidth="0.4">
              <circle cx="70" cy="22" r="3" /><rect x="67" y="24" width="6" height="14" />
              <circle cx="80" cy="22" r="3" /><rect x="77" y="24" width="6" height="14" />
              <circle cx="90" cy="22" r="3" /><rect x="87" y="24" width="6" height="14" />
            </g>
            {/* lightning between groups */}
            <polygon points="50,4 44,22 50,22 46,44 56,20 50,20" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" />
            {/* ballot box */}
            <rect x="40" y="36" width="20" height="12" rx="1" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="0.5" />
            <line x1="50" y1="34" x2="50" y2="36" stroke="#fff" strokeWidth="1" />
            <text x="50" y="46" textAnchor="middle" fontSize="4" fill="#fff" fontWeight="700">VOTE</text>
          </svg>
        </Hotspot>
        <Tag n={5} x={95.5} y={12} accent={ACCENT} selected={sel("communalism")} onClick={tag("communalism")} preview={preview} />

        {/* CENTER: 3 columns */}
        <Hotspot id="gender-division" selected={sel("gender-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "30%", top: "42%", width: "12%", height: "30%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 6, fontWeight: 700, color: "#fb7185", textAlign: "center" }}>GENDER</div>
          <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* ♂ ♀ symbols */}
            <circle cx="35" cy="35" r="14" fill="#60a5fa" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
            <line x1="45" y1="45" x2="55" y2="55" stroke="#1a1a2a" strokeWidth="2" />
            <polygon points="55,55 50,55 55,50" fill="#1a1a2a" />
            <circle cx="68" cy="32" r="14" fill="#fb7185" stroke="#1a1a2a" strokeWidth="1" opacity="0.85" />
            <line x1="68" y1="46" x2="68" y2="64" stroke="#1a1a2a" strokeWidth="2" />
            <line x1="60" y1="56" x2="76" y2="56" stroke="#1a1a2a" strokeWidth="2" />
            <text x="50" y="76" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">♂ ♀</text>
          </svg>
        </Hotspot>
        <Tag n={1} x={31} y={41} accent={ACCENT} selected={sel("gender-division")} onClick={tag("gender-division")} preview={preview} />

        <Hotspot id="religion-division" selected={sel("religion-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "44%", top: "42%", width: "12%", height: "30%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 6, fontWeight: 700, color: "#fbbf24", textAlign: "center" }}>RELIGION</div>
          <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* multi-faith symbols: Om, Cross, Crescent */}
            <text x="22" y="36" textAnchor="middle" fontSize="18" fill="#fbbf24" fontWeight="700">ॐ</text>
            <text x="50" y="38" textAnchor="middle" fontSize="18" fill="#67e8f9" fontWeight="700">✚</text>
            <text x="78" y="38" textAnchor="middle" fontSize="16" fill="#fb7185" fontWeight="700">☪</text>
            <text x="50" y="68" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">Multi-faith</text>
          </svg>
        </Hotspot>
        <Tag n={2} x={45} y={41} accent={ACCENT} selected={sel("religion-division")} onClick={tag("religion-division")} preview={preview} />

        <Hotspot id="caste-division" selected={sel("caste-division")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "58%", top: "42%", width: "12%", height: "30%", background: "rgba(20,15,30,0.55)", borderRadius: 6, padding: 3, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 6, fontWeight: 700, color: "#34d399", textAlign: "center" }}>CASTE</div>
          <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" style={{ flex: 1, width: "100%" }}>
            {/* stacked caste blocks (hierarchy) */}
            <rect x="22" y="14" width="56" height="12" rx="2" fill="#a78bfa" stroke="#1a1a2a" strokeWidth="0.6" />
            <rect x="22" y="28" width="56" height="12" rx="2" fill="#67e8f9" stroke="#1a1a2a" strokeWidth="0.6" />
            <rect x="22" y="42" width="56" height="12" rx="2" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.6" />
            <rect x="22" y="56" width="56" height="12" rx="2" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.6" />
            <text x="50" y="76" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="700">Hierarchy</text>
          </svg>
        </Hotspot>
        <Tag n={3} x={59} y={41} accent={ACCENT} selected={sel("caste-division")} onClick={tag("caste-division")} preview={preview} />

        {/* BOTTOM: Caste Politics */}
        <Hotspot id="caste-politics" selected={sel("caste-politics")} onSelect={onSelectPart} accent={ACCENT} preview={preview}
          style={{ position: "absolute", left: "26%", top: "75%", width: "48%", height: "13%", background: "rgba(20,15,30,0.6)", borderRadius: 8, padding: 3, display: "flex", flexDirection: "row", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* vote-bank: stack of ballot slips */}
              <rect x="10" y="8" width="30" height="6" fill="#fbbf24" stroke="#1a1a2a" strokeWidth="0.5" />
              <rect x="8" y="16" width="30" height="6" fill="#fb7185" stroke="#1a1a2a" strokeWidth="0.5" />
              <rect x="12" y="24" width="30" height="6" fill="#67e8f9" stroke="#1a1a2a" strokeWidth="0.5" />
            </svg>
            <div style={{ fontSize: 6, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Vote-bank</div>
          </div>
          <div style={{ width: 1, height: "80%", background: `${ACCENT}40`, margin: "0 4px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 50 40" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "70%" }}>
              {/* reserved seat: chair with "R" */}
              <rect x="14" y="10" width="22" height="22" rx="2" fill="#34d399" stroke="#1a1a2a" strokeWidth="0.5" />
              <text x="25" y="26" textAnchor="middle" fontSize="14" fill="#1a1a2a" fontWeight="700">R</text>
            </svg>
            <div style={{ fontSize: 6, fontWeight: 700, color: ACCENT, textAlign: "center" }}>Reserved Seats</div>
          </div>
        </Hotspot>
        <Tag n={6} x={74} y={75} accent={ACCENT} selected={sel("caste-politics")} onClick={tag("caste-politics")} preview={preview} />

        <Plaque title="Gender, Religion and Caste" caption="Ch 14 · Democratic Politics — three pillars of social division" accent={ACCENT} />
      </PaintingFrame>
    </div>
  );
}

export const PolGenderReligionCasteExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "pol-gender-religion-caste",
  chapterId: 14,
  track: "ssc",
  title: "Gender, Religion and Caste",
  subtitle: "SSC Pol. Sci · Ch 14 — Gender, Religion and Caste",
  description:
    "Three social differences shape politics in India. Gender: patriarchy, division of labour (paid/unpaid), low female representation in legislatures (~14% in Lok Sabha), 73rd amendment reserves 1/3 local seats for women. Religion: communalism — political mobilisation on religious lines; the Indian state is secular (Articles 25-28 protect freedom of conscience). Caste: SC/ST/OBC categories, Mandal Commission (1979-90) reserved 27% OBC quota; Article 17 abolished untouchability.",
  accent: ACCENT,
  icon: "🌐",
  parts: [
    { id: "gender-division", name: "Gender Division", info: "Patriarchy — men dominate political, economic and social life. Division of labour: paid work (mostly men) vs unpaid care work (mostly women). Women's representation in legislatures is low: ~14% in Lok Sabha (2019). 73rd & 74th Amendments (1992) reserve 1/3 of local government seats for women (now 50% in many states). Women's Reservation Bill (Nari Shakti Vandan Adhiniyam, 106th Amendment, 2023) reserves 1/3 Lok Sabha & state assembly seats — to be implemented after delimitation." },
    { id: "religion-division", name: "Religion & Communalism", info: "Communalism = politics around religious identity; mobilising voters as Hindus/Muslims/etc. Gandhi: 'Religion is a private affair'. Indian state is secular — Articles 25-28 guarantee freedom of conscience, free profession & propagation of religion; no state religion; equality of all religions. Secularism differs from Western model: India 'principled distance' (equal respect for all) vs Western 'wall of separation'." },
    { id: "caste-division", name: "Caste Division", info: "Hereditary social hierarchy — Brahmin, Kshatriya, Vaishya, Shudra (varna) plus 'untouchables' (Dalits). Article 17 abolished untouchability (1950). SC (Scheduled Castes) + ST (Scheduled Tribes) recognised; OBC (Other Backward Classes) identified by Mandal Commission (1979). Mandal Commission recommended 27% OBC reservation — implemented by VP Singh govt 1990 → anti-Mandal agitation. Indra Sawhney case (1992, Supreme Court) upheld 27% OBC but excluded 'creamy layer'." },
    { id: "sex-ratio", name: "Sex Ratio", info: "Number of females per 1000 males. India 2011: 943 (improved from 933 in 2001 but still low). Causes: son preference, female foeticide (sex-selective abortions despite PCPNDT Act 1994 banning sex determination), dowry, neglect of girl child. State extremes: Kerala 1084 (highest, matrilineal traditions, high literacy) vs Haryana 879 (lowest). Child sex ratio (0-6 yrs) worse: 919 in 2011 — alarming sign of sex-selective abortion. 2023 estimates show recovery to ~1020 (NFHS-5 2019-21)." },
    { id: "communalism", name: "Communal Politics", info: "When religion is used as a political tool — mobilising voters along religious lines, parties presenting themselves as guardians of one faith. Negative consequences: communal violence (Partition 1947, anti-Sikh riots 1984, Gujarat 2002, Muzaffarnagar 2013), polarisation, erosion of trust. Constitutional safeguards: secular state, equality before law (Article 14), freedom of religion (Articles 25-28), ban on religious instruction in govt schools (Article 28)." },
    { id: "caste-politics", name: "Caste in Politics", info: "Caste as vote-bank: parties field candidates matching the caste demography of a constituency; caste-based appeals; parties like BSP (Dalit), PMK (Vanniyar), RJD (Yadav). Positive: OBC/Dalit political empowerment post-Mandal, representation in legislatures. Negative: division, violence (anti-Mandal 1990, caste-based massacres), corruption, diluted merit. Countered by universal franchise, secret ballot, reservation policies." },
  ],
  Panel: GenderReligionCastePanel,
};
