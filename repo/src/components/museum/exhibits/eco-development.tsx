"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { panelContainerStyle, Hotspot, Tag, PaintingFrame, Plaque } from "./panel-helpers";

const accent = "#f59e0b";

function EcoDevelopmentPanel({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
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
              <marker id="amber-arrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill={accent} />
              </marker>
              <radialGradient id="gauge-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bar-pci" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="bar-le" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="bar-lit" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            {/* Title */}
            <text x="50" y="5" textAnchor="middle" fontSize="2.6" fill={accent} fontWeight="800" fontFamily="Georgia, serif">
              Development Indicators — HDI Radar
            </text>
            <line x1="22" y1="7" x2="78" y2="7" stroke={accent} strokeWidth="0.15" strokeOpacity="0.45" />

            {/* ===== LEFT: Comparison table ===== */}
            <rect x="3" y="12" width="22" height="60" rx="1" fill="rgba(245,158,11,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="14" y="16.5" textAnchor="middle" fontSize="1.7" fill={accent} fontWeight="700" fontFamily="Georgia, serif">
              India · Sri Lanka · USA
            </text>
            <line x1="3" y1="18.5" x2="25" y2="18.5" stroke={accent} strokeWidth="0.18" strokeOpacity="0.55" />
            <text x="4.5" y="22" fontSize="1.35" fill="#fde68a" fontWeight="700">Country</text>
            <text x="15" y="22" fontSize="1.35" fill="#fde68a" fontWeight="700" textAnchor="middle">PCI</text>
            <text x="19.25" y="22" fontSize="1.35" fill="#fde68a" fontWeight="700" textAnchor="middle">LE</text>
            <text x="23.25" y="22" fontSize="1.35" fill="#fde68a" fontWeight="700" textAnchor="middle">Lit</text>
            {/* India — PCI low · LE 70 · Lit 74% */}
            <text x="4.5" y="28" fontSize="1.45" fill="#e5e7eb">India</text>
            <rect x="13" y="26.2" width="2" height="1.4" fill="url(#bar-pci)" />
            <rect x="17.5" y="26.2" width="2.4" height="1.4" fill="url(#bar-le)" />
            <rect x="21.5" y="26.2" width="2.5" height="1.4" fill="url(#bar-lit)" />
            {/* Sri Lanka — PCI slightly higher · LE 77 · Lit 92% */}
            <text x="4.5" y="34" fontSize="1.45" fill="#e5e7eb">Sri Lanka</text>
            <rect x="13" y="32.2" width="2.8" height="1.4" fill="url(#bar-pci)" />
            <rect x="17.5" y="32.2" width="3.2" height="1.4" fill="url(#bar-le)" />
            <rect x="21.5" y="32.2" width="3.2" height="1.4" fill="url(#bar-lit)" />
            {/* USA — PCI max · LE 76 · Lit 99% */}
            <text x="4.5" y="40" fontSize="1.45" fill="#e5e7eb">USA</text>
            <rect x="13" y="38.2" width="4" height="1.4" fill="url(#bar-pci)" />
            <rect x="17.5" y="38.2" width="3.1" height="1.4" fill="url(#bar-le)" />
            <rect x="21.5" y="38.2" width="3.5" height="1.4" fill="url(#bar-lit)" />
            {/* legend */}
            <line x1="3" y1="44" x2="25" y2="44" stroke={accent} strokeWidth="0.12" strokeOpacity="0.4" />
            <text x="4.5" y="48" fontSize="1.3" fill="#fde68a">PCI $ · LE yrs · Lit %</text>
            {/* notes */}
            <text x="14" y="53" textAnchor="middle" fontSize="1.4" fill="#fcd34d" fontStyle="italic">Sri Lanka &gt; India on</text>
            <text x="14" y="56" textAnchor="middle" fontSize="1.4" fill="#fcd34d" fontStyle="italic">life expectancy &amp; literacy</text>
            <text x="14" y="59" textAnchor="middle" fontSize="1.4" fill="#fcd34d" fontStyle="italic">despite lower PCI.</text>
            <text x="14" y="63" textAnchor="middle" fontSize="1.4" fill="#fcd34d" fontStyle="italic">Kerala &gt; Gujarat on HDI</text>
            <text x="14" y="66" textAnchor="middle" fontSize="1.4" fill="#fcd34d" fontStyle="italic">despite lower PCI.</text>
            <text x="14" y="70" textAnchor="middle" fontSize="1.45" fill={accent} fontWeight="700" fontStyle="italic">→ money alone ≠ dev.</text>

            {/* ===== CENTER: HDI radar (3 axes) ===== */}
            <ellipse cx="50" cy="42" rx="22" ry="20" fill="url(#gauge-glow)" />
            {/* concentric rings (ellipses to match stretch) */}
            <ellipse cx="50" cy="42" rx="15" ry="13" fill="none" stroke={accent} strokeWidth="0.18" strokeOpacity="0.3" />
            <ellipse cx="50" cy="42" rx="8" ry="7" fill="none" stroke={accent} strokeWidth="0.18" strokeOpacity="0.22" />
            {/* axes */}
            <line x1="50" y1="42" x2="50" y2="20" stroke={accent} strokeWidth="0.45" />
            <line x1="50" y1="42" x2="33" y2="56" stroke={accent} strokeWidth="0.45" />
            <line x1="50" y1="42" x2="67" y2="56" stroke={accent} strokeWidth="0.45" />
            {/* HDI triangle */}
            <polygon points="50,20 33,56 67,56" fill="rgba(245,158,11,0.14)" stroke={accent} strokeWidth="0.3" strokeOpacity="0.65" />
            {/* center hub */}
            <circle cx="50" cy="42" r="2.6" fill={accent} />
            <text x="50" y="43.2" textAnchor="middle" fontSize="1.9" fill="#0a0917" fontWeight="800">HDI</text>
            {/* axis tip dots */}
            <circle cx="50" cy="20" r="1.1" fill={accent} />
            <circle cx="33" cy="56" r="1.1" fill="#10b981" />
            <circle cx="67" cy="56" r="1.1" fill="#0ea5e9" />
            {/* axis labels */}
            <text x="50" y="17.5" textAnchor="middle" fontSize="1.7" fill={accent} fontWeight="700">Per Capita Income</text>
            <text x="50" y="15.2" textAnchor="middle" fontSize="1.3" fill="#fde68a">₹ / person · WB criterion</text>
            <text x="31" y="60" textAnchor="end" fontSize="1.7" fill="#34d399" fontWeight="700">Life Expectancy</text>
            <text x="31" y="62.4" textAnchor="end" fontSize="1.3" fill="#bbf7d0">years at birth · health</text>
            <text x="69" y="60" textAnchor="start" fontSize="1.7" fill="#7dd3fc" fontWeight="700">Literacy · Schooling</text>
            <text x="69" y="62.4" textAnchor="start" fontSize="1.3" fill="#bae6fd">% age 7+ · mean years</text>

            {/* ===== TOP-RIGHT: Sustainability ===== */}
            <rect x="73" y="12" width="24" height="28" rx="1" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="0.25" strokeOpacity="0.7" />
            <text x="85" y="16" textAnchor="middle" fontSize="1.6" fill="#34d399" fontWeight="700" fontFamily="Georgia, serif">Sustainability</text>
            {/* tree */}
            <circle cx="78" cy="24" r="2.8" fill="#16a34a" />
            <circle cx="76" cy="22.5" r="1.6" fill="#22c55e" />
            <circle cx="80" cy="22.5" r="1.6" fill="#22c55e" />
            <rect x="77.5" y="26" width="1" height="3" fill="#78350f" />
            <text x="78" y="33" textAnchor="middle" fontSize="1.25" fill="#86efac">renewable</text>
            {/* factory with red X */}
            <rect x="86" y="24" width="6" height="5" fill="#6b7280" />
            <rect x="87" y="21.2" width="1.1" height="3" fill="#6b7280" />
            <rect x="89.5" y="21.2" width="1.1" height="3" fill="#6b7280" />
            <circle cx="87.6" cy="20.2" r="0.7" fill="#9ca3af" opacity="0.65" />
            <circle cx="90" cy="19.4" r="0.7" fill="#9ca3af" opacity="0.65" />
            <line x1="86" y1="24" x2="92" y2="29" stroke="#ef4444" strokeWidth="0.55" />
            <line x1="92" y1="24" x2="86" y2="29" stroke="#ef4444" strokeWidth="0.55" />
            <text x="89" y="33" textAnchor="middle" fontSize="1.25" fill="#fca5a5">pollution</text>
            {/* caption */}
            <text x="85" y="38" textAnchor="middle" fontSize="1.35" fill="#fde68a" fontStyle="italic">"needs of future generations"</text>

            {/* ===== RIGHT-MIDDLE: Public Facilities & BMI ===== */}
            <rect x="73" y="42" width="24" height="24" rx="1" fill="rgba(245,158,11,0.06)" stroke={accent} strokeWidth="0.25" strokeOpacity="0.6" />
            <text x="85" y="46" textAnchor="middle" fontSize="1.55" fill={accent} fontWeight="700" fontFamily="Georgia, serif">Public Facilities · BMI</text>
            {/* BMI scale (balance) */}
            <line x1="80" y1="50" x2="80" y2="58.5" stroke="#e5e7eb" strokeWidth="0.3" />
            <line x1="76" y1="51" x2="84" y2="51" stroke="#e5e7eb" strokeWidth="0.3" />
            <line x1="76" y1="51" x2="74" y2="54.5" stroke="#e5e7eb" strokeWidth="0.18" />
            <line x1="84" y1="51" x2="86" y2="54.5" stroke="#e5e7eb" strokeWidth="0.18" />
            <rect x="72.6" y="54.5" width="3" height="1.8" fill="#fbbf24" />
            <rect x="84.4" y="54.5" width="3" height="1.8" fill="#fbbf24" />
            <text x="80" y="60" textAnchor="middle" fontSize="1.25" fill="#fde68a">BMI = kg/m²</text>
            {/* school icon */}
            <rect x="89" y="50" width="6" height="5" fill="none" stroke="#7dd3fc" strokeWidth="0.3" />
            <line x1="89" y1="52.5" x2="95" y2="52.5" stroke="#7dd3fc" strokeWidth="0.2" />
            <line x1="92" y1="50" x2="92" y2="55" stroke="#7dd3fc" strokeWidth="0.2" />
            <text x="92" y="58" textAnchor="middle" fontSize="1.15" fill="#7dd3fc">school</text>
            <text x="85" y="64.5" textAnchor="middle" fontSize="1.25" fill="#fde68a" fontStyle="italic">schools · hospitals · water</text>
          </svg>

          {/* ===== Hotspots ===== */}
          <Hotspot id="per-capita-income" selected={sel("per-capita-income")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="① Per Capita Income"
            style={{ left: "44%", top: "13%", width: "12%", height: "16%" }}>
            <></>
          </Hotspot>
          <Hotspot id="life-expectancy" selected={sel("life-expectancy")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="② Life Expectancy"
            style={{ left: "26%", top: "50%", width: "16%", height: "16%" }}>
            <></>
          </Hotspot>
          <Hotspot id="literacy-education" selected={sel("literacy-education")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="③ Literacy · Education"
            style={{ left: "58%", top: "50%", width: "16%", height: "16%" }}>
            <></>
          </Hotspot>
          <Hotspot id="comparison" selected={sel("comparison")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="④ Country Comparison"
            style={{ left: "3%", top: "12%", width: "22%", height: "60%" }}>
            <></>
          </Hotspot>
          <Hotspot id="sustainability" selected={sel("sustainability")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑤ Sustainability"
            style={{ left: "73%", top: "12%", width: "24%", height: "28%" }}>
            <></>
          </Hotspot>
          <Hotspot id="public-facilities" selected={sel("public-facilities")} onSelect={onSelectPart} accent={accent} preview={preview}
            label="⑥ Public Facilities · BMI"
            style={{ left: "73%", top: "42%", width: "24%", height: "24%" }}>
            <></>
          </Hotspot>

          {/* ===== Tags ===== */}
          <Tag n={1} x={46} y={11} accent={accent} selected={sel("per-capita-income")} onClick={toggle("per-capita-income")} preview={preview} />
          <Tag n={2} x={28} y={48} accent={accent} selected={sel("life-expectancy")} onClick={toggle("life-expectancy")} preview={preview} />
          <Tag n={3} x={60} y={48} accent={accent} selected={sel("literacy-education")} onClick={toggle("literacy-education")} preview={preview} />
          <Tag n={4} x={5} y={10} accent={accent} selected={sel("comparison")} onClick={toggle("comparison")} preview={preview} />
          <Tag n={5} x={75} y={10} accent={accent} selected={sel("sustainability")} onClick={toggle("sustainability")} preview={preview} />
          <Tag n={6} x={75} y={40} accent={accent} selected={sel("public-facilities")} onClick={toggle("public-facilities")} preview={preview} />

          {/* ===== Plaque ===== */}
          <Plaque title="Development" caption="Chapter 17 · What does development mean for different people?" accent={accent} />
        </div>
      </PaintingFrame>
    </div>
  );
}

export const EcoDevelopmentExhibit: ExhibitDefinition = {
  kind: "panel",
  id: "eco-development",
  chapterId: 17,
  track: "ssc",
  title: "Development",
  subtitle: "HDI, indicators & sustainability",
  description:
    "Compare development across countries using per capita income, life expectancy, and literacy — and weigh the needs of future generations.",
  accent,
  icon: "📊",
  parts: [
    {
      id: "per-capita-income",
      name: "Per Capita Income",
      info: "Average income = total income of a country ÷ its population. The World Bank uses PCI as a development criterion — but it ignores distribution (a few rich can raise the average) and non-market goods (unpaid work, subsistence farming). India ≈ US$2,100 (2021); USA ≈ US$63,000; Sri Lanka ≈ US$3,800. Useful, but incomplete.",
    },
    {
      id: "life-expectancy",
      name: "Life Expectancy",
      info: "Average years a newborn is expected to live — a key health indicator. India ≈ 70 yrs (2021); Japan ≈ 84; Sri Lanka ≈ 77; USA ≈ 76. Influenced by nutrition, sanitation, public health and access to healthcare. Sri Lanka beats India here despite a lower PCI — proof that income alone does not determine health.",
    },
    {
      id: "literacy-education",
      name: "Literacy & Education",
      info: "Measured by adult literacy rate, mean years of schooling and expected years of schooling. Kerala ≈ 94% literate, Bihar ≈ 62%. Education expands capabilities — choices, freedom, earnings. The UN Human Development Index (HDI) combines PCI, life expectancy and education into one 0–1 score (India ≈ 0.633 in 2022).",
    },
    {
      id: "comparison",
      name: "Country Comparison",
      info: "Sri Lanka beats India on life expectancy and literacy despite a lower per capita income — money alone ≠ development. Within India, Kerala outscores Gujarat on HDI despite a lower PCI. Different people also have different development goals: a farmer wants irrigation, a landless labourer wants fair wages, a girl wants safety and schooling.",
    },
    {
      id: "sustainability",
      name: "Sustainability",
      info: "Brundtland Commission (1987): 'Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.' Groundwater depletion, fossil-fuel burning, deforestation and air pollution rob our children. Renewable (solar, wind) vs non-renewable (coal, oil) resources. The UN SDGs (2015–2030) list 17 goals.",
    },
    {
      id: "public-facilities",
      name: "Public Facilities & BMI",
      info: "Income alone can't buy a school or clean water — public facilities matter. Body Mass Index (BMI) = weight (kg) ÷ height² (m²). Below 18.5 = undernourished; above 25 = overweight. In India, public provision of schools, hospitals, ration shops and piped water raises living standards independent of private income.",
    },
  ],
  Panel: EcoDevelopmentPanel,
};
