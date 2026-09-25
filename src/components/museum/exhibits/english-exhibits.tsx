"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { TriPanel, type TriRegion } from "./tri-panel";

// English — illustrated icon-scene exhibits (17 chapters). Simple, legible
// iconography evoking each story rather than full painterly scenes — the
// literary analysis lives in `parts[].info`, rendered by the overlay UI.

function mkPanel(accent: string, kicker: string, title: string, caption: string, regions: TriRegion[]) {
  function P({ selectedPart, onSelectPart, preview }: PanelSceneProps) {
    return (
      <TriPanel
        accent={accent} kicker={kicker} title={title} caption={caption} regions={regions}
        selectedPart={selectedPart} onSelectPart={onSelectPart} preview={preview}
      />
    );
  }
  return P;
}

function bgSvg(fill: string) {
  return <rect width="100" height="100" fill={fill} />;
}

// Ch 1 — A Letter to God
const letterToGodRegions: TriRegion[] = [
  { id: "letter", label: "The Letter to God", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <rect x="25" y="30" width="50" height="35" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.2" />
      <path d="M 25,30 L 50,52 L 75,30" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4.6" fill="#fde68a">&quot;To God&quot;</text>
    </svg>
  )},
  { id: "hailstorm", label: "The Hailstorm", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      {[20,35,50,65,80].map((x,i) => <circle key={i} cx={x} cy={30+ (i%2)*10} r="2.4" fill="#e0f2fe" />)}
      <path d="M 10,70 Q 50,60 90,70 L 90,85 L 10,85 Z" fill="#78350f" />
      <text x="50" y="94" textAnchor="middle" fontSize="4" fill="#fde68a">crop destroyed</text>
    </svg>
  )},
  { id: "postmaster", label: "The Postmaster's Kindness", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <circle cx="35" cy="45" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
      <text x="35" y="49" textAnchor="middle" fontSize="10" fill="#fbbf24">₹</text>
      <path d="M 50,45 L 68,45" stroke="#fde68a" strokeWidth="1" />
      <polygon points="66,42 74,45 66,48" fill="#fde68a" />
      <text x="50" y="80" textAnchor="middle" fontSize="4.2" fill="#fde68a">staff pool their own money</text>
    </svg>
  )},
];

// Ch 2 — Nelson Mandela: Long Walk to Freedom
const mandelaRegions: TriRegion[] = [
  { id: "inauguration", label: "The Inauguration", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1206")}
      <circle cx="50" cy="35" r="14" fill="none" stroke="#4ade80" strokeWidth="1.6" />
      <path d="M 30,70 Q 50,55 70,70" stroke="#86efac" strokeWidth="1.2" fill="none" />
      {[15,30,45,60,75,90].map((x,i) => <circle key={i} cx={x} cy="85" r="1.6" fill="#86efac" opacity="0.7" />)}
      <text x="50" y="16" textAnchor="middle" fontSize="4.2" fill="#bbf7d0">from &apos;I&apos; to &apos;we&apos;</text>
    </svg>
  )},
  { id: "twin-obligations", label: "Twin Obligations", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,18,6,0.7)")}
      <circle cx="30" cy="45" r="10" fill="none" stroke="#4ade80" strokeWidth="1.2" /><text x="30" y="49" textAnchor="middle" fontSize="4" fill="#bbf7d0">family</text>
      <circle cx="70" cy="45" r="10" fill="none" stroke="#4ade80" strokeWidth="1.2" /><text x="70" y="49" textAnchor="middle" fontSize="4" fill="#bbf7d0">nation</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#86efac">a cost, honestly named</text>
    </svg>
  )},
  { id: "twin-freedoms", label: "Freedom for Both Sides", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,18,6,0.7)")}
      <rect x="20" y="30" width="20" height="30" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <rect x="60" y="30" width="20" height="30" fill="none" stroke="#4ade80" strokeWidth="1" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#bbf7d0">oppressor is imprisoned too</text>
    </svg>
  )},
];

// Ch 3 — Two Stories about Flying
const flyingRegions: TriRegion[] = [
  { id: "first-flight", label: "His First Flight", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#061420")}
      <path d="M 30,60 Q 50,30 70,60" stroke="#7dd3fc" strokeWidth="1.6" fill="none" />
      <circle cx="50" cy="65" r="5" fill="#e2e8f0" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#bae6fd">hunger overrides fear</text>
    </svg>
  )},
  { id: "black-aeroplane", label: "The Black Aeroplane", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,20,32,0.7)")}
      <polygon points="20,50 60,44 60,56" fill="#334155" stroke="#7dd3fc" strokeWidth="0.8" />
      <path d="M 10,20 Q 50,10 90,25 Q 60,35 40,60" fill="#1e293b" opacity="0.7" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#bae6fd">a guide never explained</text>
    </svg>
  )},
  { id: "sky-as-space", label: "The Sky as Testing Ground", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,20,32,0.7)")}
      <circle cx="50" cy="45" r="20" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3,2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4.2" fill="#bae6fd">instinct or faith, alone</text>
    </svg>
  )},
];

// Ch 4 — From the Diary of Anne Frank
const anneFrankRegions: TriRegion[] = [
  { id: "kitty", label: "Dear Kitty", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a0a14")}
      <rect x="28" y="20" width="44" height="58" rx="3" fill="#fbcfe8" opacity="0.15" stroke="#f472b6" strokeWidth="1.4" />
      <line x1="35" y1="34" x2="65" y2="34" stroke="#f472b6" strokeWidth="0.7" />
      <line x1="35" y1="42" x2="65" y2="42" stroke="#f472b6" strokeWidth="0.7" />
      <line x1="35" y1="50" x2="55" y2="50" stroke="#f472b6" strokeWidth="0.7" />
      <text x="50" y="70" textAnchor="middle" fontSize="4.4" fill="#fbcfe8">Dear Kitty,</text>
    </svg>
  )},
  { id: "loneliness", label: "Loneliness Amid People", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <circle cx="50" cy="35" r="6" fill="#f472b6" />
      {[20,35,65,80].map((x,i) => <circle key={i} cx={x} cy="60" r="4" fill="#fbcfe8" opacity="0.4" />)}
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#fbcfe8">surrounded, still unseen</text>
    </svg>
  )},
  { id: "essay-wit", label: "The Duckling Essay", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <ellipse cx="50" cy="55" rx="18" ry="12" fill="#fde68a" opacity="0.7" />
      <circle cx="66" cy="46" r="6" fill="#fde68a" opacity="0.7" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#fbcfe8">wit turns punishment around</text>
    </svg>
  )},
];

// Ch 5 — Glimpses of India
const glimpsesRegions: TriRegion[] = [
  { id: "goan-baker", label: "The Goan Baker", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1306")}
      <ellipse cx="50" cy="55" rx="22" ry="10" fill="#d97706" opacity="0.7" />
      <ellipse cx="50" cy="50" rx="18" ry="8" fill="#fbbf24" opacity="0.7" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#fed7aa">a fading tradition</text>
    </svg>
  )},
  { id: "coorg", label: "Coorg", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,19,6,0.7)")}
      <polygon points="20,75 40,35 60,75" fill="#4ade80" opacity="0.5" />
      <polygon points="45,75 65,45 85,75" fill="#4ade80" opacity="0.4" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#bbf7d0">coffee & mist</text>
    </svg>
  )},
  { id: "assam-tea", label: "Tea from Assam", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,19,6,0.7)")}
      {[0,1,2].map((r) => Array.from({length:4}).map((_,c) => (
        <ellipse key={`${r}-${c}`} cx={22+c*18} cy={35+r*16} rx="7" ry="4" fill="#4ade80" opacity="0.5" />
      )))}
      <text x="50" y="90" textAnchor="middle" fontSize="4" fill="#bbf7d0">geography shapes culture</text>
    </svg>
  )},
];

// Ch 6 — Mijbil the Otter
const mijbilRegions: TriRegion[] = [
  { id: "otter-personality", label: "Mijbil's Personality", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#061620")}
      <ellipse cx="50" cy="55" rx="26" ry="12" fill="#60a5fa" opacity="0.6" />
      <circle cx="76" cy="50" r="7" fill="#60a5fa" opacity="0.6" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#bfdbfe">a character, not a pet</text>
    </svg>
  )},
  { id: "flight-scene", label: "The Flight to London", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,22,32,0.7)")}
      <rect x="15" y="40" width="70" height="24" rx="10" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bfdbfe">wild creature, confined cabin</text>
    </svg>
  )},
  { id: "london-reaction", label: "Curious Londoners", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,22,32,0.7)")}
      <text x="50" y="50" textAnchor="middle" fontSize="14" fill="#93c5fd">?</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bfdbfe">&quot;what kind of animal is that?&quot;</text>
    </svg>
  )},
];

// Ch 7 — Madam Rides the Bus
const madamBusRegions: TriRegion[] = [
  { id: "the-bus", label: "Valli's Bus Ride", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <rect x="20" y="35" width="60" height="26" rx="3" fill="#fbbf24" opacity="0.6" />
      <circle cx="32" cy="63" r="4" fill="#78350f" /><circle cx="68" cy="63" r="4" fill="#78350f" />
      <text x="50" y="80" textAnchor="middle" fontSize="4.4" fill="#fde68a">months of saved coins</text>
    </svg>
  )},
  { id: "dead-cow", label: "The Dead Cow", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <ellipse cx="50" cy="60" rx="22" ry="6" fill="#78716c" opacity="0.6" />
      <text x="50" y="30" textAnchor="middle" fontSize="4.2" fill="#fde68a">wonder meets reality</text>
    </svg>
  )},
  { id: "self-reliance", label: "A Private Adventure", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <circle cx="50" cy="50" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3,2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fde68a">kept entirely her own</text>
    </svg>
  )},
];

// Ch 8 — The Sermon at Benares
const sermonRegions: TriRegion[] = [
  { id: "mustard-seed", label: "The Mustard Seed", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#160a1a")}
      <circle cx="50" cy="50" r="4" fill="#c4b5fd" />
      {[20,35,65,80].map((x,i) => <rect key={i} x={x-6} y="60" width="12" height="14" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6" />)}
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#ddd6fe">a house untouched by death?</text>
    </svg>
  )},
  { id: "guided-insight", label: "Guided Discovery", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(22,10,26,0.7)")}
      <path d="M 20,70 Q 50,20 80,70" stroke="#c4b5fd" strokeWidth="1.2" fill="none" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#ddd6fe">insight, not instruction</text>
    </svg>
  )},
  { id: "universal-loss", label: "Suffering is Universal", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(22,10,26,0.7)")}
      <circle cx="50" cy="50" r="22" fill="none" stroke="#a78bfa" strokeWidth="1" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#ddd6fe">impermanence, accepted</text>
    </svg>
  )},
];

// Ch 9 — The Proposal
const proposalRegions: TriRegion[] = [
  { id: "land-dispute", label: "The Ox Meadows Dispute", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a0a0a")}
      <rect x="20" y="45" width="28" height="20" fill="#f87171" opacity="0.5" />
      <rect x="52" y="45" width="28" height="20" fill="#fca5a5" opacity="0.5" />
      <text x="50" y="30" textAnchor="middle" fontSize="4.4" fill="#fecaca">whose land is this strip?</text>
    </svg>
  )},
  { id: "dog-dispute", label: "Whose Dog is Faster", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,10,0.7)")}
      <ellipse cx="35" cy="55" rx="14" ry="7" fill="#fca5a5" opacity="0.6" />
      <ellipse cx="65" cy="55" rx="14" ry="7" fill="#f87171" opacity="0.6" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fecaca">Guess vs Squeezer</text>
    </svg>
  )},
  { id: "accidental-ending", label: "An Accidental Engagement", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,10,0.7)")}
      <circle cx="40" cy="50" r="8" fill="#fca5a5" opacity="0.6" />
      <circle cx="60" cy="50" r="8" fill="#f87171" opacity="0.6" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fecaca">mid-argument, engaged</text>
    </svg>
  )},
];

// Ch 10 — Poems (Dust of Snow, Fire and Ice, Tiger in the Zoo, How to Tell Wild Animals, The Ball Poem)
const poemsRegions: TriRegion[] = [
  { id: "dust-of-snow", label: "Dust of Snow", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1420")}
      <ellipse cx="50" cy="35" rx="10" ry="6" fill="#1e293b" />
      {[45,50,55].map((x,i) => <circle key={i} cx={x} cy={45+i*3} r="0.8" fill="#e2e8f0" />)}
      <text x="50" y="80" textAnchor="middle" fontSize="4.2" fill="#93c5fd">a crow, an unexpected gift</text>
    </svg>
  )},
  { id: "fire-and-ice", label: "Fire and Ice", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <path d="M 30,70 Q 25,40 35,20 Q 45,40 32,70" fill="#f87171" opacity="0.6" />
      <polygon points="65,20 75,50 55,50" fill="#7dd3fc" opacity="0.6" />
      <text x="50" y="88" textAnchor="middle" fontSize="3.8" fill="#93c5fd">desire & hatred, equally fatal</text>
    </svg>
  )},
  { id: "tiger-in-zoo", label: "A Tiger in the Zoo", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      {[30,40,50,60,70].map((x,i) => <line key={i} x1={x} y1="30" x2={x} y2="75" stroke="#94a3b8" strokeWidth="1.4" />)}
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#93c5fd">caged, contrasted with wild</text>
    </svg>
  )},
];

// Ch 11 — A Triumph of Surgery
const triumphSurgeryRegions: TriRegion[] = [
  { id: "over-pampering", label: "Over-Pampered Tricki", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1a0a")}
      <ellipse cx="50" cy="55" rx="24" ry="14" fill="#4ade80" opacity="0.55" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#bbf7d0">love, disguised as neglect</text>
    </svg>
  )},
  { id: "no-surgery", label: "No Surgery at All", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,26,10,0.7)")}
      <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#86efac">✕</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bbf7d0">an ironic title</text>
    </svg>
  )},
  { id: "hospital-dogs", label: "Cured by Community", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,26,10,0.7)")}
      {[30,50,70].map((x,i) => <circle key={i} cx={x} cy="55" r="6" fill="#4ade80" opacity="0.5" />)}
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bbf7d0">a normal, social diet</text>
    </svg>
  )},
];

// Ch 12 — The Thief's Story
const thiefsStoryRegions: TriRegion[] = [
  { id: "conscience", label: "An Unforced Conscience", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#141414")}
      <circle cx="50" cy="45" r="14" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#cbd5e1">no one was watching</text>
    </svg>
  )},
  { id: "skills-taught", label: "Skills, Not Charity", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(20,20,20,0.7)")}
      <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#e2e8f0">Aa</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#cbd5e1">reading, writing, cooking</text>
    </svg>
  )},
  { id: "quiet-trust", label: "Anil's Quiet Trust", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(20,20,20,0.7)")}
      <circle cx="35" cy="50" r="8" fill="none" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="65" cy="50" r="8" fill="none" stroke="#e2e8f0" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#cbd5e1">a second chance, not naivety</text>
    </svg>
  )},
];

// Ch 13 — The Midnight Visitor
const midnightVisitorRegions: TriRegion[] = [
  { id: "improvisation", label: "Ausable's Improvisation", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a0a1a")}
      <rect x="30" y="30" width="40" height="45" fill="none" stroke="#818cf8" strokeWidth="1.2" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#c7d2fe">a fictional balcony</text>
    </svg>
  )},
  { id: "unglamorous-agent", label: "An Unglamorous Spy", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,10,26,0.7)")}
      <circle cx="50" cy="45" r="10" fill="none" stroke="#818cf8" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#c7d2fe">quiet, not flashy</text>
    </svg>
  )},
  { id: "fatal-leap", label: "Max's Fatal Leap", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,10,26,0.7)")}
      <path d="M 20,60 Q 50,20 80,60" stroke="#818cf8" strokeWidth="1.2" fill="none" strokeDasharray="3,2" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#c7d2fe">no time to verify</text>
    </svg>
  )},
];

// Ch 14 — A Question of Trust
const questionOfTrustRegions: TriRegion[] = [
  { id: "gentle-thief", label: "A Disciplined Thief", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <rect x="35" y="30" width="30" height="38" rx="3" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="4" fill="#fde68a" />
      <text x="50" y="18" textAnchor="middle" fontSize="4.2" fill="#fde68a">one safe a year</text>
    </svg>
  )},
  { id: "double-trust", label: "Trust, Two Ways", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <circle cx="35" cy="50" r="9" fill="none" stroke="#fbbf24" strokeWidth="1" />
      <circle cx="65" cy="50" r="9" fill="none" stroke="#fde68a" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fde68a">locksmith, and locked-out</text>
    </svg>
  )},
  { id: "the-reveal", label: "The Real Thief", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#fbbf24">?</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fde68a">used as an unwitting tool</text>
    </svg>
  )},
];

// Ch 15 — Footprints without Feet (The Invisible Man extract)
const invisibleManRegions: TriRegion[] = [
  { id: "invisibility-curse", label: "A Curse, Not a Gift", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0f0f0f")}
      <path d="M 35,30 L 65,30 L 68,75 L 32,75 Z" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3,2" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#cbd5e1">clothed by nothing, warmed by nothing</text>
    </svg>
  )},
  { id: "escalating-chase", label: "An Escalating Chase", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(15,15,15,0.7)")}
      <path d="M 15,70 L 40,55 L 60,60 L 85,35" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#cbd5e1">sympathy turns to threat</text>
    </svg>
  )},
  { id: "the-dog", label: "Undone by a Dog", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(15,15,15,0.7)")}
      <ellipse cx="50" cy="55" rx="16" ry="9" fill="#64748b" opacity="0.5" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#cbd5e1">outsmarting sight, not smell</text>
    </svg>
  )},
];

// Ch 16 — The Making of a Scientist
const scientistRegions: TriRegion[] = [
  { id: "curiosity-to-inquiry", label: "Curiosity → Inquiry", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#061a10")}
      <path d="M 30,60 Q 40,30 50,50 Q 60,30 70,60" stroke="#4ade80" strokeWidth="1.4" fill="none" />
      <circle cx="30" cy="60" r="1.6" fill="#86efac" /><circle cx="70" cy="60" r="1.6" fill="#86efac" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#bbf7d0">butterflies, tagged & tracked</text>
    </svg>
  )},
  { id: "quiet-support", label: "A Mother's Quiet Support", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <rect x="35" y="35" width="30" height="22" fill="none" stroke="#4ade80" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bbf7d0">resources, not direction</text>
    </svg>
  )},
  { id: "highschool-research", label: "High-School Research", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <circle cx="50" cy="50" r="14" fill="none" stroke="#4ade80" strokeWidth="1.2" />
      <line x1="50" y1="50" x2="60" y2="60" stroke="#4ade80" strokeWidth="1.6" />
      <text x="50" y="82" textAnchor="middle" fontSize="4" fill="#bbf7d0">rigour needs no credential</text>
    </svg>
  )},
];

// Ch 17 — The Necklace
const necklaceRegions: TriRegion[] = [
  { id: "constant-comparison", label: "A Life of Comparison", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a0a14")}
      <path d="M 30,45 Q 50,60 70,45" stroke="#e879f9" strokeWidth="1.4" fill="none" />
      {[35,50,65].map((x,i) => <circle key={i} cx={x} cy={45+ (i===1?12:6)} r="1.6" fill="#f0abfc" />)}
      <text x="50" y="20" textAnchor="middle" fontSize="4.2" fill="#f5d0fe">self-inflicted unhappiness</text>
    </svg>
  )},
  { id: "borrowed-symbol", label: "The Borrowed Necklace", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <path d="M 30,45 Q 50,65 70,45" stroke="#e879f9" strokeWidth="1.6" fill="none" />
      <text x="50" y="82" textAnchor="middle" fontSize="4" fill="#f5d0fe">a symbol, borrowed for one night</text>
    </svg>
  )},
  { id: "the-twist", label: "Ten Years, For Nothing", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#e879f9">✕</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#f5d0fe">the original was fake</text>
    </svg>
  )},
];

export const ENGLISH_EXHIBITS: ExhibitDefinition[] = [
  { kind: "panel", id: "eng-letter-to-god", chapterId: 1, track: "english",
    title: "A Letter to God", subtitle: "English · Ch 1",
    description: "A letter addressed to God, the hailstorm that destroys the harvest, and the postmaster's quiet act of kindness. Click each region to explore Chapter 1.",
    accent: "#fbbf24", icon: "✉️",
    parts: [
      { id: "letter", name: "Dramatic Irony", info: "The reader knows the postmaster arranged the money, but Lencho never suspects it — this dramatic irony is what makes his angry second letter both funny and quietly tragic." },
      { id: "hailstorm", name: "Faith vs Trust in People", info: "Lencho's total faith in God, unshaken even after the hailstorm destroys everything, contrasts with his thin trust in real people — he assumes the humans who helped him must be thieves." },
      { id: "postmaster", name: "The Postmaster's Sacrifice", info: "The postmaster organises a collection, giving part of his own salary, moved by the purity of Lencho's belief — generosity meant to preserve, not shatter, a poor farmer's faith." },
    ], Panel: mkPanel("#fbbf24", "✉️ A LETTER TO GOD", "A Letter to God", "Faith, irony, and a postmaster's kindness", letterToGodRegions) },

  { kind: "panel", id: "eng-mandela", chapterId: 2, track: "english",
    title: "Nelson Mandela: Long Walk to Freedom", subtitle: "English · Ch 2",
    description: "The inauguration that widens from 'I' to 'we', the twin obligations of family and nation, and Mandela's layered idea of freedom. Click each region to explore Chapter 2.",
    accent: "#4ade80", icon: "🕊️",
    parts: [
      { id: "inauguration", name: "From 'I' to 'We'", info: "Mandela deliberately widens from his own inauguration to thousands of unnamed South Africans who never lived to see it — even his greatest personal triumph is framed as belonging to a movement." },
      { id: "twin-obligations", name: "Twin Obligations", info: "The tension between obligations to family and to one's people is left unresolved, not neatly settled — Mandela is honest that pursuing freedom for millions cost him closeness with his own family." },
      { id: "twin-freedoms", name: "Freedom for Both Sides", info: "Mandela argues the oppressor is also 'imprisoned' by the hatred and fear apartheid required — freedom, in his framing, has to liberate both sides, not just the oppressed." },
    ], Panel: mkPanel("#4ade80", "🕊️ LONG WALK TO FREEDOM", "Nelson Mandela: Long Walk to Freedom", "From personal triumph to collective freedom", mandelaRegions) },

  { kind: "panel", id: "eng-two-stories-flying", chapterId: 3, track: "english",
    title: "Two Stories about Flying", subtitle: "English · Ch 3",
    description: "A young seagull's fear of his first flight, and a mysterious guide through a storm in 'The Black Aeroplane'. Click each region to explore Chapter 3.",
    accent: "#38bdf8", icon: "🕊️",
    parts: [
      { id: "first-flight", name: "His First Flight", info: "The seagull's fear isn't really about flying — it's about risking failure. He only flies because hunger overrides fear, a quiet point about necessity pushing us past our limits." },
      { id: "black-aeroplane", name: "The Black Aeroplane", info: "The story deliberately never reveals who or what saved the pilot — the ambiguity is the point, about reaching for the inexplicable when facing mortal danger." },
      { id: "sky-as-space", name: "The Sky as Testing Ground", info: "Both stories use the sky as a space stripped of ordinary support, where a character has to rely on something within — instinct or faith — to get through." },
    ], Panel: mkPanel("#38bdf8", "🕊️ TWO STORIES ABOUT FLYING", "Two Stories about Flying", "A seagull's fear, and an unexplained guide", flyingRegions) },

  { kind: "panel", id: "eng-anne-frank", chapterId: 4, track: "english",
    title: "From the Diary of Anne Frank", subtitle: "English · Ch 4",
    description: "A diary addressed to 'Kitty', loneliness despite loving company, and an essay that turns punishment into wit. Click each region to explore Chapter 4.",
    accent: "#f472b6", icon: "📔",
    parts: [
      { id: "kitty", name: "Addressed to Kitty", info: "Framing the diary as a letter to a trusted friend lets Anne be far more honest than she could be with the people actually around her — the whole reason the extract feels so intimate." },
      { id: "loneliness", name: "Lonely Among People", info: "Anne draws a deliberate distinction: being surrounded by loving parents and a crowd of friends isn't the same as having someone she can be fully herself with." },
      { id: "essay-wit", name: "Turning Punishment into Wit", info: "Rather than being cowed by three essays assigned as punishment, Anne turns them into an opportunity — winning over her strict teacher with a clever essay from a duckling's point of view." },
    ], Panel: mkPanel("#f472b6", "📔 ANNE FRANK'S DIARY", "From the Diary of Anne Frank", "Dear Kitty — loneliness, wit, resilience", anneFrankRegions) },

  { kind: "panel", id: "eng-glimpses-of-india", chapterId: 5, track: "english",
    title: "Glimpses of India", subtitle: "English · Ch 5",
    description: "A Goan baker's fading tradition, the coffee-scented hills of Coorg, and Assam's tea gardens. Click each region to explore Chapter 5.",
    accent: "#fb923c", icon: "🍞",
    parts: [
      { id: "goan-baker", name: "A Baker from Goa", info: "The essay's nostalgic tone signals that the pader (traditional baker) and his way of life are fading even as the essay describes them — description carrying an undercurrent of loss." },
      { id: "coorg", name: "Coorg", info: "A description of the land's natural beauty paired with the people who live there — geography and human culture shown as inseparable, coffee and temperament both products of the same place." },
      { id: "assam-tea", name: "Tea from Assam", info: "Like Coorg, Assam's tea gardens are described through the lens of the people who tend them — India's diversity captured through small, local, lived traditions rather than grand history." },
    ], Panel: mkPanel("#fb923c", "🍞 GLIMPSES OF INDIA", "Glimpses of India", "A baker, a hill station, a tea garden", glimpsesRegions) },

  { kind: "panel", id: "eng-mijbil-otter", chapterId: 6, track: "english",
    title: "Mijbil the Otter", subtitle: "English · Ch 6",
    description: "An otter written almost as a human character, a tense flight to London, and the puzzled reactions of curious Londoners. Click each region to explore Chapter 6.",
    accent: "#60a5fa", icon: "🦦",
    parts: [
      { id: "otter-personality", name: "A Character, Not a Pet", info: "Maxwell writes about Mijbil almost as a human character with a distinct personality — that choice, not otters being inherently endearing, is what makes readers connect with him specifically." },
      { id: "flight-scene", name: "The Flight to London", info: "The narrative's real climax puts a wild, water-loving creature into an aeroplane cabin — about as far from his natural habitat as possible — for both tension and humour." },
      { id: "london-reaction", name: "Curious Londoners", info: "Londoners unable to identify what kind of animal Mijbil is highlights how exotic he is outside his natural context — indirectly emphasising the author's close bond with him." },
    ], Panel: mkPanel("#60a5fa", "🦦 MIJBIL THE OTTER", "Mijbil the Otter", "A wild character, an unlikely journey", mijbilRegions) },

  { kind: "panel", id: "eng-madam-rides-bus", chapterId: 7, track: "english",
    title: "Madam Rides the Bus", subtitle: "English · Ch 7",
    description: "Valli's months of saved coins, a sobering roadside sight, and a private adventure kept entirely to herself. Click each region to explore Chapter 7.",
    accent: "#fbbf24", icon: "🚌",
    parts: [
      { id: "the-bus", name: "A Small Adventure, Huge for Her", info: "Valli's secret saving for months is really about a child's yearning for independence in an otherwise very restricted small-village life — a small adventure in absolute terms, huge for an eight-year-old." },
      { id: "dead-cow", name: "The Dead Cow", info: "Seeing a dead cow by the roadside punctures the fantasy Valli had built around the journey — a reminder that the wider world contains loss and unpleasantness too." },
      { id: "self-reliance", name: "Kept Entirely Her Own", info: "Valli hides both her fear and her adventure from the adults afterward — self-reliance, once tasted, doesn't need an audience to validate it." },
    ], Panel: mkPanel("#fbbf24", "🚌 MADAM RIDES THE BUS", "Madam Rides the Bus", "Independence, wonder, and a hard lesson", madamBusRegions) },

  { kind: "panel", id: "eng-sermon-benares", chapterId: 8, track: "english",
    title: "The Sermon at Benares", subtitle: "English · Ch 8",
    description: "Kisa Gotami's search for a mustard seed, the Buddha's method of guided discovery, and the universal truth of loss. Click each region to explore Chapter 8.",
    accent: "#a78bfa", icon: "🪷",
    parts: [
      { id: "mustard-seed", name: "The Mustard Seed Quest", info: "The Buddha already knows Kisa Gotami will fail to find a house untouched by death — the quest is a teaching device, letting her discover through direct experience rather than being told." },
      { id: "guided-insight", name: "Guided Discovery", info: "This teaching method reflects a core Buddhist idea: understanding that comes from insight is more transformative than being simply told a fact — her grief transforms because she personally confirms it." },
      { id: "universal-loss", name: "Suffering is Universal", info: "Kisa Gotami's personal loss is connected to a universal teaching — that clinging to what's impermanent causes pain, and death singles no one out." },
    ], Panel: mkPanel("#a78bfa", "🪷 THE SERMON AT BENARES", "The Sermon at Benares", "A mustard seed, and a universal truth", sermonRegions) },

  { kind: "panel", id: "eng-the-proposal", chapterId: 9, track: "english",
    title: "The Proposal", subtitle: "English · Ch 9",
    description: "A marriage proposal derailed by a land dispute, then a quarrel over whose dog is faster, ending in an accidental engagement. Click each region to explore Chapter 9.",
    accent: "#f87171", icon: "🎭",
    parts: [
      { id: "land-dispute", name: "The Ox Meadows Dispute", info: "Chekhov builds pure farce: the most significant conversation two people can have is derailed by an absurdly petty dispute over a strip of land neither really needs." },
      { id: "dog-dispute", name: "Whose Dog is Faster", info: "All three characters are drawn as equally excitable and self-important — nobody is more 'reasonable', so the comedy is in watching thin-skinned people escalate over nothing." },
      { id: "accidental-ending", name: "An Accidental Engagement", info: "Chubukov forces the couple together mid-argument — even their 'happy ending' happens by accident, Chekhov's final joke that the proposal mattered far less than the surrounding chaos." },
    ], Panel: mkPanel("#f87171", "🎭 THE PROPOSAL", "The Proposal", "A farce disguised as a marriage proposal", proposalRegions) },

  { kind: "panel", id: "eng-poems", chapterId: 10, track: "english",
    title: "Poems — Dust of Snow, Fire and Ice & More", subtitle: "English · Ch 10",
    description: "A crow's small gift, fire and ice as equally fatal forces, and a caged tiger's contrast with the wild. Click each region to explore Chapter 10.",
    accent: "#c084fc", icon: "🖋️",
    parts: [
      { id: "dust-of-snow", name: "Dust of Snow", info: "A tiny, almost trivial event — snow falling off a branch — changes the speaker's mood entirely. A crow, often a symbol of ill omen, is recast as the bringer of a small unexpected gift." },
      { id: "fire-and-ice", name: "Fire and Ice", info: "Fire (desire) and ice (hatred) are opposite forces shown to be equally capable of ending the world — the poem's brevity itself reinforces how casually devastating either can be." },
      { id: "tiger-in-zoo", name: "A Tiger in the Zoo", info: "The poem builds its force through contrast alone — alternating the caged tiger's diminished present with imagined glimpses of wild power, letting the juxtaposition make the argument." },
    ], Panel: mkPanel("#c084fc", "🖋️ POEMS", "Poems: Dust of Snow, Fire and Ice & More", "Small gifts, fatal forces, caged power", poemsRegions) },

  { kind: "panel", id: "eng-triumph-of-surgery", chapterId: 11, track: "english",
    title: "A Triumph of Surgery", subtitle: "English · Ch 11",
    description: "Mrs Pumphrey's over-indulgence, an ironic title with no surgery in sight, and a cure found in ordinary community. Click each region to explore Chapter 11.",
    accent: "#4ade80", icon: "🐕",
    parts: [
      { id: "over-pampering", name: "Indulgence Disguised as Love", info: "Mrs Pumphrey's excessive indulgence of Tricki is exactly what makes him sick, while the vet's plain, disciplined regime — the opposite of indulgence — is what cures him." },
      { id: "no-surgery", name: "An Ironic Title", info: "No surgery happens at all in the story — the title pokes fun at assuming anything serious enough to worry about must require something as dramatic as an operation." },
      { id: "hospital-dogs", name: "Cured by Normal Life", info: "Tricki recovers by eating from a shared bowl and playing with other dogs — a quiet suggestion that too much individual attention can be its own kind of harm." },
    ], Panel: mkPanel("#4ade80", "🐕 A TRIUMPH OF SURGERY", "A Triumph of Surgery", "An ironic title, and an unglamorous cure", triumphSurgeryRegions) },

  { kind: "panel", id: "eng-thiefs-story", chapterId: 12, track: "english",
    title: "The Thief's Story", subtitle: "English · Ch 12",
    description: "A conscience that awakens with no one watching, real skills taught instead of charity, and a trust that may have been deliberate all along. Click each region to explore Chapter 12.",
    accent: "#94a3b8", icon: "🔑",
    parts: [
      { id: "conscience", name: "An Unforced Conscience", info: "Nothing external forces the thief to return the money — no one has caught him. His conscience alone, newly awakened by Anil's trust, makes him change course." },
      { id: "skills-taught", name: "Skills, Not Ordinary Charity", info: "The specific skills Anil teaches — cooking, writing his name, sums — give the thief lasting value and independence, which is why trust from Anil feels different from stealing from anyone else." },
      { id: "quiet-trust", name: "A Deliberate Second Chance", info: "Anil rewards the thief with money and the offer of regular pay rather than confronting him about the theft — his generosity reads less as naivety and more as a deliberate second chance." },
    ], Panel: mkPanel("#94a3b8", "🔑 THE THIEF'S STORY", "The Thief's Story", "Trust, taught skills, and quiet redemption", thiefsStoryRegions) },

  { kind: "panel", id: "eng-midnight-visitor", chapterId: 13, track: "english",
    title: "The Midnight Visitor", subtitle: "English · Ch 13",
    description: "A fictional balcony invented under real danger, an unglamorous secret agent, and a rival's fatal, unverifiable leap. Click each region to explore Chapter 13.",
    accent: "#818cf8", icon: "🕵️",
    parts: [
      { id: "improvisation", name: "Quick, Convincing Improvisation", info: "With an armed rival in the room, Ausable invents an entirely fictional balcony and secret-police caller — his real skill is quick improvisation, not gadgets or gunplay." },
      { id: "unglamorous-agent", name: "Subverting the Spy Trope", info: "Fowler is disappointed that Ausable seems ordinary, unglamorous, nothing like a spy in fiction — a deliberate subversion that pays off in the climax." },
      { id: "fatal-leap", name: "No Time to Verify", info: "Max's fatal leap onto a non-existent balcony only works because he has no way to check Ausable's claim in the moment — his own fear becomes the tool of his downfall." },
    ], Panel: mkPanel("#818cf8", "🕵️ THE MIDNIGHT VISITOR", "The Midnight Visitor", "A quiet kind of heroism: improvisation", midnightVisitorRegions) },

  { kind: "panel", id: "eng-question-of-trust", chapterId: 14, track: "english",
    title: "A Question of Trust", subtitle: "English · Ch 14",
    description: "A disciplined thief who robs exactly one house a year, a double meaning in the title, and a final reveal that flips the story. Click each region to explore Chapter 14.",
    accent: "#fbbf24", icon: "🔐",
    parts: [
      { id: "gentle-thief", name: "An Oddly Disciplined Crime", info: "Horace Danby's crime funds a harmless book-collecting hobby rather than any lavish need — oddly disciplined and almost genteel, which is exactly what makes him easy to sympathise with." },
      { id: "double-trust", name: "Trust, Two Ways", info: "The title cuts two ways: Horace has to trust the woman to get the safe combination, while his whole profession as a locksmith is built on being trusted with people's valuables." },
      { id: "the-reveal", name: "Undone by His Own Trick", info: "The woman was herself a thief, using Horace as an unwitting tool — a professional trust-breaker undone by trusting the wrong person, at exactly his own game." },
    ], Panel: mkPanel("#fbbf24", "🔐 A QUESTION OF TRUST", "A Question of Trust", "A locksmith undone by his own trade", questionOfTrustRegions) },

  { kind: "panel", id: "eng-invisible-man", chapterId: 15, track: "english",
    title: "Footprints without Feet", subtitle: "English · Ch 15",
    description: "Invisibility as a curse rather than a gift, an escalating chase, and an ordinary dog that succeeds where sight fails. Click each region to explore Chapter 15.",
    accent: "#64748b", icon: "👤",
    parts: [
      { id: "invisibility-curse", name: "A Curse, Not a Gift", info: "Everything invisibility should make easy instead isolates Griffin completely — he can't be clothed, warmed, or recognised by anyone; every human contact becomes a threat of discovery." },
      { id: "escalating-chase", name: "From Curiosity to Menace", info: "Griffin's actions escalate from petty theft to genuine menace over the narrative, shifting the reader's sympathy — what starts as scientific curiosity becomes something closer to a threat." },
      { id: "the-dog", name: "Undone by Smell, Not Sight", info: "That an ordinary dog can track Griffin despite his invisibility is the story's pointed irony — outsmarting one human sense doesn't make you undetectable to another." },
    ], Panel: mkPanel("#64748b", "👤 FOOTPRINTS WITHOUT FEET", "Footprints without Feet", "Invisible, but never truly undetectable", invisibleManRegions) },

  { kind: "panel", id: "eng-making-of-scientist", chapterId: 16, track: "english",
    title: "The Making of a Scientist", subtitle: "English · Ch 16",
    description: "Childhood curiosity becoming structured inquiry, a mother's quiet support, and a high-school project that won national recognition. Click each region to explore Chapter 16.",
    accent: "#4ade80", icon: "🔬",
    parts: [
      { id: "curiosity-to-inquiry", name: "Curiosity Becomes Inquiry", info: "Ebright's arc — collecting butterflies, then tagging them, then testing a real hypothesis — is a case study in how scientific habits of mind develop from ordinary childhood interest." },
      { id: "quiet-support", name: "A Mother's Quiet Support", info: "Rather than pushing him toward achievement, Ebright's mother supports his interests with resources at the right moments without directing the outcome — open-ended support, not pressure." },
      { id: "highschool-research", name: "Rigour Needs No Credential", info: "His high-school project on monarch butterfly pupae, not a university lab, won national recognition — undercutting the idea that serious science requires formal credentials to begin." },
    ], Panel: mkPanel("#4ade80", "🔬 THE MAKING OF A SCIENTIST", "The Making of a Scientist", "From butterfly nets to real research", scientistRegions) },

  { kind: "panel", id: "eng-the-necklace", chapterId: 17, track: "english",
    title: "The Necklace", subtitle: "English · Ch 17",
    description: "A life defined by comparison, a borrowed symbol of wealth, and a final twist that makes ten years of hardship pointless. Click each region to explore Chapter 17.",
    accent: "#e879f9", icon: "📿",
    parts: [
      { id: "constant-comparison", name: "Self-Inflicted Unhappiness", info: "Mathilde has a comfortable middle-class life but suffers from measuring herself against a wealth and status she doesn't have — a study in the corrosive effect of constant comparison." },
      { id: "borrowed-symbol", name: "A Symbol, Borrowed", info: "Mathilde borrows the symbol of wealth to feel wealthy for one night — the ten years of real poverty that follow are the exact opposite of what she was chasing." },
      { id: "the-twist", name: "Ten Years, For Nothing", info: "The original necklace was fake and worth almost nothing — a devastating twist that retroactively makes the Loisels' entire decade of suffering pointless." },
    ], Panel: mkPanel("#e879f9", "📿 THE NECKLACE", "The Necklace", "A borrowed symbol, a hollow value system", necklaceRegions) },
];
