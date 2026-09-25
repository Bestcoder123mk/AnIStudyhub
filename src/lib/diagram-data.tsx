import type { Track } from "@/store/use-study-store";

// Curated diagram-drawing practice prompts. Each one is a "draw it, then
// compare" exercise, not auto-graded pixel matching — that's a call, not an
// oversight: automated drawing recognition is unreliable enough to be
// actively misleading for a study tool, where a false "wrong" or false
// "right" is worse than no grade at all. Instead every prompt has a
// checklist of the concepts the diagram needs to show, and a small
// original reference sketch to compare against — the same self-assessment
// pattern the app already uses for short/long-answer questions
// (draw → reveal → rate yourself honestly).
//
// The reference sketches are deliberately simple, schematic drawings
// (lines, circles, boxes) rather than an attempt at textbook-accurate
// illustration — several diagrams (the ray diagram, the digestive system)
// say so explicitly in their caption. The checklist, not pixel-matching
// the sketch, is what the exercise is actually checking.

export interface DiagramPrompt {
  id: string;
  track: Track;
  subject: string;
  title: string;
  instructions: string;
  checklist: string[];
  xp: number;
  Reference: () => React.JSX.Element;
  caption?: string;
}

const strokeProps = { stroke: "#111", strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const labelProps = { fill: "#111", fontSize: 10, fontFamily: "system-ui, sans-serif" };

export const DIAGRAM_PROMPTS: DiagramPrompt[] = [
  {
    id: "physics-lens",
    track: "science",
    subject: "Physics",
    title: "Ray diagram — convex lens, object beyond 2F",
    instructions: "Draw the principal axis, a convex lens, mark F and 2F on both sides, place an object beyond 2F, and trace two rays to locate the image.",
    checklist: [
      "Principal axis drawn through the lens centre",
      "Lens symbol shown (biconvex, arrows at top/bottom)",
      "F and 2F marked on both sides of the lens",
      "Object drawn as an upright arrow beyond 2F",
      "Ray through the optical centre (goes straight)",
      "Ray parallel to the axis (bends through F after the lens)",
      "Image marked where the rays meet — inverted and smaller",
    ],
    xp: 20,
    caption: "Simplified sketch — check your diagram against the checklist, not exact ray angles.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <line x1="10" y1="100" x2="305" y2="100" {...strokeProps} />
        <polygon points="305,100 297,96 297,104" fill="#111" />
        <path d="M160 30 C 172 30 172 170 160 170" {...strokeProps} />
        <path d="M160 30 C 148 30 148 170 160 170" {...strokeProps} />
        {[70, 115, 205, 250].map((x) => (
          <circle key={x} cx={x} cy={100} r={2.5} fill="#111" />
        ))}
        <text x={64} y={116} {...labelProps}>2F</text>
        <text x={110} y={116} {...labelProps}>F</text>
        <text x={202} y={116} {...labelProps}>F</text>
        <text x={244} y={116} {...labelProps}>2F</text>
        <line x1="45" y1="100" x2="45" y2="55" {...strokeProps} stroke="#2563eb" />
        <polygon points="45,55 41,63 49,63" fill="#2563eb" />
        <text x={30} y={50} {...labelProps} fill="#2563eb">Object</text>
        <line x1="45" y1="55" x2="225" y2="122" {...strokeProps} stroke="#16a34a" strokeDasharray="4 3" />
        <line x1="45" y1="55" x2="160" y2="55" {...strokeProps} stroke="#dc2626" strokeDasharray="4 3" />
        <line x1="160" y1="55" x2="225" y2="122" {...strokeProps} stroke="#dc2626" strokeDasharray="4 3" />
        <line x1="225" y1="100" x2="225" y2="122" {...strokeProps} stroke="#111" />
        <polygon points="225,122 221,114 229,114" fill="#111" />
        <text x={196} y={140} {...labelProps}>Image (real, inverted)</text>
      </svg>
    ),
  },
  {
    id: "physics-circuit",
    track: "science",
    subject: "Physics",
    title: "Simple electric circuit — cell, switch, bulb, ammeter",
    instructions: "Draw a single closed loop containing a cell, an open/closed switch, a bulb, and an ammeter, all in series, using standard circuit symbols.",
    checklist: [
      "One single closed loop (series circuit)",
      "Cell symbol — long + short parallel lines",
      "Switch symbol shown in the loop",
      "Bulb symbol (circle with a cross) shown",
      "Ammeter symbol (circle marked A) in series",
      "Connecting wires drawn as straight lines",
    ],
    xp: 18,
    Reference: () => (
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <rect x="40" y="40" width="220" height="120" {...strokeProps} />
        <g transform="translate(40,100)">
          <line x1="0" y1="-18" x2="0" y2="-4" {...strokeProps} />
          <line x1="-8" y1="-4" x2="8" y2="-4" strokeWidth={4} stroke="#111" />
          <line x1="-4" y1="4" x2="4" y2="4" strokeWidth={2} stroke="#111" />
          <line x1="0" y1="4" x2="0" y2="18" {...strokeProps} />
        </g>
        <text x={8} y={104} {...labelProps}>Cell</text>
        <g transform="translate(120,40)">
          <line x1="-20" y1="0" x2="-6" y2="0" {...strokeProps} />
          <line x1="-6" y1="0" x2="14" y2="-12" {...strokeProps} />
          <circle cx="-6" cy="0" r="2" fill="#111" />
          <circle cx="14" cy="0" r="2" fill="#111" />
          <line x1="14" y1="0" x2="30" y2="0" {...strokeProps} />
        </g>
        <text x={95} y={28} {...labelProps}>Switch</text>
        <circle cx="260" cy="100" r="20" {...strokeProps} />
        <line x1="246" y1="86" x2="274" y2="114" {...strokeProps} />
        <line x1="274" y1="86" x2="246" y2="114" {...strokeProps} />
        <text x={238} y={135} {...labelProps}>Bulb</text>
        <circle cx="150" cy="160" r="16" {...strokeProps} fill="#fff" />
        <text x={146} y={164} fontSize={12} fontFamily="system-ui" fill="#111">A</text>
        <text x={126} y={185} {...labelProps}>Ammeter</text>
      </svg>
    ),
  },
  {
    id: "bio-neuron",
    track: "science",
    subject: "Biology",
    title: "Structure of a neuron",
    instructions: "Draw a neuron and label its dendrites, cell body (with nucleus), axon, myelin sheath, and axon terminals.",
    checklist: [
      "Cell body (soma) drawn, roughly oval",
      "Nucleus marked inside the cell body",
      "Dendrites — branching lines on one side",
      "A long axon extending from the cell body",
      "Myelin sheath segments shown along the axon",
      "Axon terminals — branching at the far end",
    ],
    xp: 18,
    Reference: () => (
      <svg viewBox="0 0 320 160" className="w-full h-full">
        <ellipse cx="70" cy="80" rx="28" ry="22" {...strokeProps} />
        <circle cx="70" cy="80" r="7" {...strokeProps} />
        {[[-25, -8], [-30, 5], [-22, 18], [-10, -22]].map(([dx, dy], i) => (
          <line key={i} x1={70 + dx * 0.6} y1={80 + dy * 0.6} x2={70 + dx * 1.7} y2={80 + dy * 1.7} {...strokeProps} />
        ))}
        <text x={12} y={30} {...labelProps}>Dendrites</text>
        <text x={45} y={118} {...labelProps}>Cell body</text>
        <line x1="96" y1="80" x2="260" y2="80" {...strokeProps} strokeWidth={3} />
        {[120, 145, 170, 195, 220].map((x) => (
          <ellipse key={x} cx={x} cy={80} rx="9" ry="7" {...strokeProps} />
        ))}
        <text x={140} y={62} {...labelProps}>Myelin sheath</text>
        {[[-15, -18], [10, -20], [-20, 10], [15, 20]].map(([dx, dy], i) => (
          <line key={i} x1={260} y1={80} x2={260 + dx} y2={80 + dy} {...strokeProps} />
        ))}
        <text x={250} y={30} {...labelProps}>Axon terminals</text>
        <text x={165} y={100} {...labelProps}>Axon</text>
      </svg>
    ),
  },
  {
    id: "bio-digestive",
    track: "science",
    subject: "Biology",
    title: "Human digestive system — pathway of food",
    instructions: "Draw the pathway food takes through the body and label each organ, in order: mouth, oesophagus, stomach, small intestine, large intestine.",
    checklist: [
      "Mouth shown at the start of the pathway",
      "Oesophagus connecting mouth to stomach",
      "Stomach drawn as a distinct wider sac",
      "Small intestine shown after the stomach",
      "Large intestine shown after the small intestine",
      "All five parts labelled in the correct order",
    ],
    xp: 18,
    caption: "Simplified as a straight pathway, not an anatomically accurate layout — the order and labels are what matter here.",
    Reference: () => (
      <svg viewBox="0 0 320 170" className="w-full h-full">
        <circle cx="30" cy="30" r="14" {...strokeProps} />
        <text x={10} y={16} {...labelProps}>Mouth</text>
        <path d="M30 44 L30 70 L60 90" {...strokeProps} />
        <text x={4} y={62} {...labelProps}>Oesophagus</text>
        <path d="M60 90 Q90 70 110 95 Q120 115 90 120 Q65 122 60 100 Z" {...strokeProps} />
        <text x={68} y={140} {...labelProps}>Stomach</text>
        <path d="M110 105 L150 105 L150 130 L190 130 L190 105 L230 105" {...strokeProps} />
        <text x={130} y={148} {...labelProps}>Small intestine</text>
        <path d="M230 105 Q260 105 260 75 Q260 45 300 45" {...strokeProps} strokeWidth={5} />
        <text x={235} y={35} {...labelProps}>Large intestine</text>
      </svg>
    ),
  },
  {
    id: "chem-bohr",
    track: "science",
    subject: "Chemistry",
    title: "Bohr model — Carbon atom (2, 4)",
    instructions: "Draw the Bohr model of a Carbon atom: a nucleus with 6 protons and 6 neutrons, a K-shell with 2 electrons, and an L-shell with 4 electrons.",
    checklist: [
      "Nucleus drawn at the centre, labelled 6p⁺ / 6n",
      "K-shell (first orbit) drawn around the nucleus",
      "2 electrons marked on the K-shell",
      "L-shell (second orbit) drawn outside the K-shell",
      "4 electrons marked on the L-shell",
    ],
    xp: 15,
    Reference: () => (
      <svg viewBox="0 0 220 220" className="w-full h-full">
        <circle cx="110" cy="110" r="95" {...strokeProps} strokeDasharray="2 5" />
        <circle cx="110" cy="110" r="55" {...strokeProps} strokeDasharray="2 5" />
        <circle cx="110" cy="110" r="24" {...strokeProps} fill="#fff" />
        <text x={88} y={106} fontSize={10} fontFamily="system-ui" fill="#111">6p⁺</text>
        <text x={88} y={118} fontSize={10} fontFamily="system-ui" fill="#111">6n</text>
        {[0, 180].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return <circle key={deg} cx={110 + 55 * Math.cos(r)} cy={110 + 55 * Math.sin(r)} r={4} fill="#2563eb" />;
        })}
        {[30, 120, 210, 300].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return <circle key={deg} cx={110 + 95 * Math.cos(r)} cy={110 + 95 * Math.sin(r)} r={4} fill="#16a34a" />;
        })}
        <text x={150} y={60} {...labelProps}>L-shell (4e⁻)</text>
        <text x={130} y={172} {...labelProps}>K-shell (2e⁻)</text>
      </svg>
    ),
  },
  {
    id: "geo-watercycle",
    track: "ssc",
    subject: "Geography",
    title: "The water cycle",
    instructions: "Draw the water cycle showing evaporation from a water body, condensation into clouds, precipitation, and collection/runoff back to the water body.",
    checklist: [
      "A water body (ocean/river) drawn at the base",
      "Sun drawn, providing heat for evaporation",
      "Arrows showing evaporation rising upward",
      "A cloud drawn, showing condensation",
      "Arrows showing precipitation falling down",
      "An arrow showing collection/runoff back to the water body",
      "All four stages labelled",
    ],
    xp: 16,
    Reference: () => (
      <svg viewBox="0 0 300 180" className="w-full h-full">
        <circle cx="40" cy="30" r="16" {...strokeProps} stroke="#f59e0b" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={40 + 18 * Math.cos(r)} y1={30 + 18 * Math.sin(r)} x2={40 + 25 * Math.cos(r)} y2={30 + 25 * Math.sin(r)} stroke="#f59e0b" strokeWidth={2} />;
        })}
        <ellipse cx="180" cy="45" rx="45" ry="20" {...strokeProps} fill="#fff" />
        <ellipse cx="150" cy="35" rx="28" ry="16" {...strokeProps} fill="#fff" />
        <text x={155} y={20} {...labelProps}>Condensation</text>
        <path d="M10 150 Q80 130 150 150 T300 150 L300 180 L10 180 Z" {...strokeProps} fill="#dbeafe" stroke="#2563eb" />
        <text x={20} y={168} {...labelProps} fill="#2563eb">Ocean / river</text>
        {[80, 100].map((x) => (
          <line key={x} x1={x} y1={140} x2={x - 15} y2={70} {...strokeProps} stroke="#2563eb" strokeDasharray="3 3" />
        ))}
        <text x={20} y={110} {...labelProps} fill="#2563eb">Evaporation</text>
        {[160, 185, 210].map((x) => (
          <line key={x} x1={x} y1={65} x2={x} y2={140} {...strokeProps} stroke="#111" strokeDasharray="3 3" />
        ))}
        <text x={200} y={105} {...labelProps}>Precipitation</text>
        <path d="M240 145 Q270 130 260 100" {...strokeProps} strokeDasharray="2 4" />
        <text x={230} y={95} {...labelProps}>Collection / runoff</text>
      </svg>
    ),
  },
  {
    id: "bio-foodchain",
    track: "science",
    subject: "Biology",
    title: "Food chain — grassland ecosystem",
    instructions: "Draw a food chain with five labelled boxes connected by arrows showing the flow of energy: producer, then three levels of consumers, then a top predator.",
    checklist: [
      "Grass drawn/labelled as the producer",
      "Grasshopper labelled as the primary consumer",
      "Frog labelled as the secondary consumer",
      "Snake labelled as the tertiary consumer",
      "Eagle labelled as the top predator",
      "Arrows drawn pointing in the direction of energy flow",
    ],
    xp: 14,
    Reference: () => (
      <svg viewBox="0 0 320 100" className="w-full h-full">
        {["Grass", "Grasshopper", "Frog", "Snake", "Eagle"].map((label, i) => (
          <g key={label}>
            <rect x={10 + i * 62} y={35} width={50} height={30} rx={6} {...strokeProps} />
            <text x={14 + i * 62} y={54} fontSize={8.5} fontFamily="system-ui" fill="#111">{label}</text>
            {i < 4 && (
              <>
                <line x1={60 + i * 62} y1={50} x2={72 + i * 62} y2={50} {...strokeProps} />
                <polygon points={`${72 + i * 62},50 ${66 + i * 62},46 ${66 + i * 62},54`} fill="#111" />
              </>
            )}
          </g>
        ))}
        <text x={90} y={20} {...labelProps}>Energy flow →</text>
      </svg>
    ),
  },
  {
    id: "civics-parliament",
    track: "ssc",
    subject: "Civics",
    title: "Structure of the Indian Parliament",
    instructions: "Draw a simple organisation chart of the Indian Parliament, showing the President, Lok Sabha, and Rajya Sabha, with one distinguishing fact under each house.",
    checklist: [
      "\"Parliament of India\" box at the top",
      "President shown as one part of Parliament",
      "Lok Sabha box, connected below",
      "Rajya Sabha box, connected below",
      "A note that Lok Sabha members are directly elected",
      "A note that Rajya Sabha represents the states",
    ],
    xp: 15,
    Reference: () => (
      <svg viewBox="0 0 320 170" className="w-full h-full">
        <rect x="90" y="10" width="140" height="34" rx="8" {...strokeProps} />
        <text x={104} y={31} fontSize={11} fontFamily="system-ui" fill="#111">Parliament of India</text>
        <line x1="160" y1="44" x2="160" y2="60" {...strokeProps} />
        <line x1="60" y1="60" x2="260" y2="60" {...strokeProps} />
        <line x1="60" y1="60" x2="60" y2="72" {...strokeProps} />
        <line x1="160" y1="60" x2="160" y2="72" {...strokeProps} />
        <line x1="260" y1="60" x2="260" y2="72" {...strokeProps} />
        <rect x="10" y="72" width="100" height="30" rx="6" {...strokeProps} />
        <text x={22} y={91} fontSize={10} fontFamily="system-ui" fill="#111">President</text>
        <rect x="115" y="72" width="105" height="30" rx="6" {...strokeProps} />
        <text x={122} y={91} fontSize={9.5} fontFamily="system-ui" fill="#111">Lok Sabha</text>
        <rect x="225" y="72" width="95" height="30" rx="6" {...strokeProps} />
        <text x={232} y={91} fontSize={9.5} fontFamily="system-ui" fill="#111">Rajya Sabha</text>
        <text x={112} y={118} fontSize={8} fontFamily="system-ui" fill="#444">Directly elected</text>
        <text x={112} y={130} fontSize={8} fontFamily="system-ui" fill="#444">by voters, 5-yr term</text>
        <text x={225} y={118} fontSize={8} fontFamily="system-ui" fill="#444">Represents states,</text>
        <text x={225} y={130} fontSize={8} fontFamily="system-ui" fill="#444">members rotate</text>
      </svg>
    ),
  },
  {
    id: "physics-eye",
    track: "science",
    subject: "Physics",
    title: "Structure of the human eye",
    instructions: "Draw a cross-section of the eyeball and label the cornea, iris, pupil, lens, retina, and optic nerve.",
    checklist: [
      "Rounded eyeball outline drawn",
      "Cornea — the clear bulge at the front",
      "Iris and pupil — the coloured ring and central opening",
      "Lens shown just behind the iris (convex, adjustable)",
      "Retina — lining the back of the eyeball",
      "Optic nerve — leaving the back of the eye toward the brain",
    ],
    xp: 18,
    caption: "Simplified cross-section — focus on relative position of parts, not exact eyeball geometry.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <path d="M40 100 C 40 40 280 40 300 100 C 280 160 40 160 40 100 Z" {...strokeProps} />
        <path d="M40 70 C 55 70 55 130 40 130" {...strokeProps} stroke="#2563eb" />
        <circle cx="58" cy="100" r="14" {...strokeProps} fill="#111" />
        <circle cx="58" cy="100" r="6" fill="#fff" stroke="none" />
        <ellipse cx="85" cy="100" rx="10" ry="26" {...strokeProps} stroke="#16a34a" />
        <path d="M270 55 C 295 70 295 130 270 145" {...strokeProps} stroke="#dc2626" />
        <line x1="270" y1="100" x2="310" y2="100" {...strokeProps} stroke="#dc2626" />
        <text x={22} y={168} {...labelProps} fill="#2563eb">Cornea</text>
        <text x={45} y={178} {...labelProps} fill="#111">Pupil / Iris</text>
        <text x={70} y={190} {...labelProps} fill="#16a34a">Lens</text>
        <text x={230} y={168} {...labelProps} fill="#dc2626">Retina</text>
        <text x={280} y={95} {...labelProps} fill="#dc2626">Optic nerve</text>
      </svg>
    ),
  },
  {
    id: "chem-electrolysis",
    track: "science",
    subject: "Chemistry",
    title: "Electrolysis of water — apparatus setup",
    instructions: "Draw a beaker of acidified water with two electrodes connected to a battery, and show gas collecting over each electrode in a 2:1 ratio (H₂:O₂).",
    checklist: [
      "Container/beaker with water drawn",
      "Two electrodes dipping into the water, connected by wires",
      "Battery (cell) shown in the circuit with correct +/− terminals",
      "Gas bubbles/collection tubes shown above each electrode",
      "Volume of gas at cathode (H₂) is double that at anode (O₂)",
      "Electrodes and gases correctly labelled",
    ],
    xp: 20,
    caption: "Schematic apparatus sketch — proportions simplified.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <path d="M60 60 L60 170 L260 170 L260 60" {...strokeProps} />
        <line x1="45" y1="60" x2="275" y2="60" {...strokeProps} strokeDasharray="3 3" />
        <rect x="105" y="70" width="20" height="90" {...strokeProps} fill="#eef" />
        <rect x="195" y="70" width="20" height="90" {...strokeProps} fill="#fee" />
        <circle cx="115" cy="85" r="3" fill="#2563eb" /><circle cx="115" cy="95" r="3" fill="#2563eb" /><circle cx="115" cy="105" r="3" fill="#2563eb" />
        <circle cx="205" cy="90" r="3" fill="#dc2626" />
        <line x1="115" y1="30" x2="115" y2="70" {...strokeProps} />
        <line x1="205" y1="30" x2="205" y2="70" {...strokeProps} />
        <rect x="140" y="15" width="40" height="20" rx="2" {...strokeProps} />
        <text x={146} y={29} fontSize={9} fontFamily="system-ui" fill="#111">Battery</text>
        <line x1="115" y1="30" x2="140" y2="25" {...strokeProps} />
        <line x1="205" y1="30" x2="180" y2="25" {...strokeProps} />
        <text x={90} y={185} {...labelProps} fill="#2563eb">Cathode: H₂ (more gas)</text>
        <text x={178} y={185} {...labelProps} fill="#dc2626">Anode: O₂ (less gas)</text>
      </svg>
    ),
  },
  {
    id: "bio-flower",
    track: "science",
    subject: "Biology",
    title: "Longitudinal section of a flower",
    instructions: "Draw a flower cut in half showing the male part (stamen: anther + filament) and female part (pistil: stigma, style, ovary with ovules), plus petals and sepals.",
    checklist: [
      "Petals and sepals drawn at the base",
      "Stamen — filament with anther on top (male part)",
      "Pistil — stigma, style, and ovary (female part)",
      "Ovary shown with ovule(s) inside",
      "Stigma at the top of the pistil, positioned to receive pollen",
      "All parts correctly labelled",
    ],
    xp: 20,
    caption: "Simplified schematic L.S. — not to scale.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <path d="M60 175 Q40 60 100 35 Q95 90 108 130 Z" {...strokeProps} fill="#fde68a" />
        <path d="M260 175 Q280 60 220 35 Q225 90 212 130 Z" {...strokeProps} fill="#fde68a" />
        <ellipse cx="160" cy="150" rx="35" ry="25" {...strokeProps} fill="#bbf7d0" />
        <line x1="160" y1="125" x2="160" y2="55" {...strokeProps} stroke="#16a34a" />
        <ellipse cx="160" cy="50" rx="10" ry="8" {...strokeProps} fill="#86efac" />
        <line x1="115" y1="150" x2="115" y2="70" {...strokeProps} stroke="#b45309" />
        <ellipse cx="115" cy="65" rx="9" ry="12" {...strokeProps} fill="#fbbf24" />
        <line x1="205" y1="150" x2="205" y2="70" {...strokeProps} stroke="#b45309" />
        <ellipse cx="205" cy="65" rx="9" ry="12" {...strokeProps} fill="#fbbf24" />
        <circle cx="150" cy="150" r="4" fill="#166534" /><circle cx="170" cy="155" r="4" fill="#166534" />
        <text x={95} y={30} {...labelProps} fill="#16a34a">Stigma</text>
        <text x={165} y={90} {...labelProps} fill="#16a34a">Style</text>
        <text x={172} y={165} {...labelProps} fill="#166534">Ovary + ovules</text>
        <text x={60} y={60} {...labelProps} fill="#b45309">Anther</text>
        <text x={228} y={60} {...labelProps} fill="#b45309">Filament</text>
        <text x={20} y={175} {...labelProps} fill="#92400e">Petal</text>
      </svg>
    ),
  },
  {
    id: "geo-rainwater",
    track: "ssc",
    subject: "Geography",
    title: "Rooftop rainwater harvesting system",
    instructions: "Draw a house with a sloped roof, a pipe carrying rainwater down from the roof through a filter into an underground storage tank.",
    checklist: [
      "House with a sloped/angled roof to collect rain",
      "Gutter along the roof edge collecting water",
      "Downpipe carrying water from the gutter downward",
      "Filter (mesh/sand-gravel layer) shown before storage",
      "Underground storage tank / recharge pit drawn below ground level",
      "Arrows showing the direction of water flow",
    ],
    xp: 16,
    caption: "One common design (rooftop → storage tank) — bamboo-drip and Guls/Kuls systems look different.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <polygon points="60,70 160,20 260,70" {...strokeProps} fill="#e0e7ef" />
        <rect x="75" y="70" width="170" height="70" {...strokeProps} fill="#fff" />
        <line x1="245" y1="70" x2="245" y2="140" {...strokeProps} stroke="#2563eb" strokeWidth={4} />
        <line x1="245" y1="140" x2="245" y2="175" {...strokeProps} stroke="#2563eb" strokeWidth={4} />
        <rect x="230" y="145" width="30" height="14" {...strokeProps} fill="#d1d5db" />
        <text x={195} y={155} fontSize={8} fontFamily="system-ui" fill="#444">Filter</text>
        <path d="M180 175 L310 175 L310 195 L180 195 Z" {...strokeProps} fill="#bfdbfe" />
        <text x={200} y={188} fontSize={9} fontFamily="system-ui" fill="#1e3a8a">Storage tank</text>
        <line x1="0" y1="175" x2="180" y2="175" {...strokeProps} strokeDasharray="3 3" />
        <text x={10} y={172} fontSize={8} fontFamily="system-ui" fill="#666">Ground level</text>
        <text x={60} y={40} {...labelProps}>Sloped roof</text>
        <text x={250} y={65} {...labelProps} fill="#2563eb">Downpipe</text>
      </svg>
    ),
  },
  {
    id: "civics-federalism",
    track: "ssc",
    subject: "Civics",
    title: "Three tiers of government (Federalism)",
    instructions: "Draw three levels of government as a hierarchy — Union (Central), State, and Local — with an arrow or note showing powers are divided, not just delegated top-down.",
    checklist: [
      "Union/Central Government box at the top",
      "State Government box below it",
      "Local Government (Panchayats/Municipalities) box at the bottom",
      "Lines connecting the three tiers",
      "A note that each tier has its own defined powers (not just top-down control)",
      "Labelled clearly",
    ],
    xp: 15,
    caption: "Simple hierarchy box-diagram, as commonly drawn for board answers.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <rect x="90" y="15" width="140" height="34" rx="6" {...strokeProps} fill="#dbeafe" />
        <text x={110} y={36} fontSize={11} fontFamily="system-ui" fill="#111">Union Government</text>
        <line x1="160" y1="49" x2="160" y2="75" {...strokeProps} />
        <rect x="90" y="75" width="140" height="34" rx="6" {...strokeProps} fill="#dcfce7" />
        <text x={112} y={96} fontSize={11} fontFamily="system-ui" fill="#111">State Government</text>
        <line x1="160" y1="109" x2="160" y2="135" {...strokeProps} />
        <rect x="70" y="135" width="180" height="34" rx="6" {...strokeProps} fill="#fef3c7" />
        <text x={80} y={156} fontSize={10.5} fontFamily="system-ui" fill="#111">Local Government (Panchayat/Municipality)</text>
        <text x={35} y={190} fontSize={9} fontFamily="system-ui" fill="#444">Each tier has its own powers, defined by the Constitution</text>
      </svg>
    ),
  },
  {
    id: "maths-tangent",
    track: "maths",
    subject: "Geometry",
    title: "Circle — tangent perpendicular to the radius",
    instructions: "Draw a circle with centre O, a radius OP to a point P on the circle, and the tangent line at P — mark the right angle between the radius and the tangent.",
    checklist: [
      "Circle drawn with centre O marked",
      "Point P marked on the circle",
      "Radius OP drawn from centre to P",
      "Tangent line drawn at P, touching the circle at exactly one point",
      "Right-angle mark shown between OP and the tangent at P",
    ],
    xp: 15,
    caption: "Core fact for the Circles chapter: the tangent at any point is perpendicular to the radius through that point.",
    Reference: () => (
      <svg viewBox="0 0 320 200" className="w-full h-full">
        <circle cx="160" cy="110" r="70" {...strokeProps} />
        <circle cx="160" cy="110" r="2.5" fill="#111" />
        <text x={148} y={104} {...labelProps}>O</text>
        <line x1="160" y1="110" x2="228" y2="72" {...strokeProps} stroke="#2563eb" />
        <circle cx="228" cy="72" r="2.5" fill="#2563eb" />
        <text x={234} y={68} {...labelProps} fill="#2563eb">P</text>
        <line x1="180" y1="35" x2="276" y2="108" {...strokeProps} stroke="#dc2626" />
        <path d="M215 80 L221 68 L233 74" {...strokeProps} strokeWidth={1.5} />
        <text x={190} y={130} {...labelProps}>radius OP</text>
        <text x={230} y={100} {...labelProps} fill="#dc2626">tangent</text>
      </svg>
    ),
  },
];
