"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { TriPanel, type TriRegion } from "./tri-panel";

// Sanskrit — culturally themed motif exhibits (12 chapters). Simple,
// symbolic iconography (tree, cow, lotus, mountain-river, scroll) rather
// than literal scenes — grammar/theme notes live in `parts[].info`,
// rendered by the surrounding overlay UI.

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

// Ch 1 — Environment (जीवनस्य मित्रे)
const environmentRegions: TriRegion[] = [
  { id: "trees-as-friends", label: "Trees as Friends", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#061a10")}
      <line x1="50" y1="85" x2="50" y2="45" stroke="#78350f" strokeWidth="2.4" />
      <circle cx="50" cy="32" r="20" fill="#4ade80" opacity="0.55" />
      <text x="50" y="15" textAnchor="middle" fontSize="4.4" fill="#bbf7d0">जीवनस्य मित्रे</text>
    </svg>
  )},
  { id: "pollution", label: "Pollution, Named", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <circle cx="50" cy="45" r="14" fill="#57534e" opacity="0.6" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#bbf7d0">दूषिताः — passive, unnamed blame</text>
    </svg>
  )},
  { id: "call-to-action", label: "Plant, Avoid Plastic", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <path d="M 40,70 L 40,50 M 30,55 L 40,50 L 50,55" stroke="#4ade80" strokeWidth="1.6" fill="none" />
      <text x="50" y="86" textAnchor="middle" fontSize="4" fill="#bbf7d0">कुरुत, वर्जयत — imperatives</text>
    </svg>
  )},
];

// Ch 2 — Cleanliness (स्पृशति पाणिना)
const cleanlinessRegions: TriRegion[] = [
  { id: "instrumental-case", label: "स्पृशति पाणिना", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1a1a")}
      <ellipse cx="50" cy="50" rx="16" ry="10" fill="#38bdf8" opacity="0.5" />
      <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#bae6fd">&quot;with the hand&quot; — instrumental</text>
    </svg>
  )},
  { id: "genitive-proverb", label: "आरोग्यस्य अर्धम्", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,26,26,0.7)")}
      <circle cx="35" cy="50" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
      <circle cx="65" cy="50" r="10" fill="#38bdf8" opacity="0.4" />
      <text x="50" y="80" textAnchor="middle" fontSize="3.8" fill="#bae6fd">cleanliness = half of health</text>
    </svg>
  )},
  { id: "daily-routine", label: "दिनचर्या", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,26,26,0.7)")}
      <circle cx="50" cy="50" r="20" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" />
      <text x="50" y="88" textAnchor="middle" fontSize="4" fill="#bae6fd">a daily discipline</text>
    </svg>
  )},
];

// Ch 3 — Cow-milking (गोदोहनम्)
const godohanamRegions: TriRegion[] = [
  { id: "gomata", label: "गोमाता", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <ellipse cx="50" cy="50" rx="24" ry="14" fill="#fbbf24" opacity="0.5" />
      <circle cx="74" cy="42" r="7" fill="#fbbf24" opacity="0.5" />
      <text x="50" y="18" textAnchor="middle" fontSize="4.4" fill="#fde68a">mother who sustains</text>
    </svg>
  )},
  { id: "compound-word", label: "गो + दोहनम्", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <rect x="15" y="42" width="30" height="16" fill="none" stroke="#fbbf24" strokeWidth="1" />
      <rect x="55" y="42" width="30" height="16" fill="none" stroke="#fde68a" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fde68a">a compound (समास)</text>
    </svg>
  )},
  { id: "dignity-of-labour", label: "Dignity of Labour", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <rect x="35" y="35" width="30" height="30" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fde68a">क्षीरम् · घृतम् · दधि</text>
    </svg>
  )},
];

// Ch 4 — Child nurturing (शिशुलालनम्)
const shishuLalanamRegions: TriRegion[] = [
  { id: "nurturing", label: "शिशुलालनम्", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a0a14")}
      <circle cx="40" cy="45" r="12" fill="#f472b6" opacity="0.5" />
      <circle cx="62" cy="52" r="7" fill="#f472b6" opacity="0.6" />
      <text x="50" y="18" textAnchor="middle" fontSize="4.2" fill="#fbcfe8">शिशु + लालनम्</text>
    </svg>
  )},
  { id: "play-instrumental", label: "क्रीडया शिक्षते", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <circle cx="50" cy="50" r="12" fill="none" stroke="#f472b6" strokeWidth="1.2" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fbcfe8">&quot;through play&quot; — instrumental again</text>
    </svg>
  )},
  { id: "lullaby", label: "लालन-गीतम्", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <path d="M 20,55 Q 35,35 50,55 T 80,55" stroke="#f472b6" strokeWidth="1.4" fill="none" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fbcfe8">a lullaby shapes character</text>
    </svg>
  )},
];

// Ch 5 — Mother as Guru (जननी तु गुरुः)
const jananiGuruhRegions: TriRegion[] = [
  { id: "tu-emphasis", label: "जननी तु गुरुः", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <circle cx="50" cy="45" r="16" fill="#fb923c" opacity="0.5" />
      <text x="50" y="18" textAnchor="middle" fontSize="4.4" fill="#fed7aa">तु — an emphatic argument</text>
    </svg>
  )},
  { id: "epic-examples", label: "युधिष्ठिर · राम · कृष्ण", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      {[30,50,70].map((x,i) => <circle key={i} cx={x} cy="50" r="7" fill="#fb923c" opacity="0.5" />)}
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#fed7aa">मातृभक्ताः</text>
    </svg>
  )},
  { id: "upanishad-quote", label: "मातृदेवो भव", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <rect x="30" y="35" width="40" height="26" fill="none" stroke="#fb923c" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="3.8" fill="#fed7aa">Taittiriya Upanishad</text>
    </svg>
  )},
];

// Ch 6 — Subhashita collection (सूक्तिस्तबकः)
const subhashitaRegions: TriRegion[] = [
  { id: "bouquet-metaphor", label: "स्तबकः — a Bouquet", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#160a1a")}
      {[35,50,65].map((x,i) => <circle key={i} cx={x} cy={50-(i%2)*8} r="8" fill="#a78bfa" opacity="0.5" />)}
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#ddd6fe">individual verses, gathered</text>
    </svg>
  )},
  { id: "compressed-verse", label: "Compressed Grammar", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(22,10,26,0.7)")}
      <rect x="25" y="42" width="50" height="16" fill="none" stroke="#a78bfa" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#ddd6fe">one line, one full idea</text>
    </svg>
  )},
  { id: "oral-tradition", label: "Meant to be Quoted", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(22,10,26,0.7)")}
      <path d="M 30,60 Q 50,30 70,60" stroke="#a78bfa" strokeWidth="1.2" fill="none" />
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#ddd6fe">portable moral education</text>
    </svg>
  )},
];

// Ch 7 — Glory of India (भारतमहिमा)
const bharatMahimaRegions: TriRegion[] = [
  { id: "sacred-rivers", label: "गङ्गा · यमुना · नर्मदा", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1420")}
      <path d="M 20,20 Q 40,50 30,80" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
      <path d="M 50,20 Q 60,50 55,80" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
      <path d="M 80,20 Q 70,50 78,80" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
      <text x="50" y="14" textAnchor="middle" fontSize="4.2" fill="#bae6fd">identity through geography</text>
    </svg>
  )},
  { id: "himalaya-simile", label: "मुकुटम् इव", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <polygon points="30,70 50,25 70,70" fill="none" stroke="#fb7185" strokeWidth="1.4" />
      <text x="50" y="86" textAnchor="middle" fontSize="4" fill="#fecdd3">इव — &quot;like&quot;, a simile marker</text>
    </svg>
  )},
  { id: "culture-as-soul", label: "संस्कृतिः राष्ट्रस्य आत्मा", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <circle cx="50" cy="50" r="16" fill="none" stroke="#fb7185" strokeWidth="1.2" />
      <text x="50" y="82" textAnchor="middle" fontSize="4" fill="#fecdd3">culture is the real argument</text>
    </svg>
  )},
];

// Ch 8 — Environment II (पर्यावरणम्)
const paryavaranamRegions: TriRegion[] = [
  { id: "pancha-mahabhutani", label: "पञ्चमहाभूतानि", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#061a10")}
      {[0,1,2,3,4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI/2;
        return <circle key={i} cx={50+28*Math.cos(a)} cy={50+22*Math.sin(a)} r="7" fill="#34d399" opacity="0.5" />;
      })}
      <text x="50" y="14" textAnchor="middle" fontSize="4" fill="#a7f3d0">earth · water · fire · air · space</text>
    </svg>
  )},
  { id: "pollution-compounds", label: "वायु/जल/भूमि-दूषणं", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <rect x="25" y="42" width="50" height="16" fill="none" stroke="#34d399" strokeWidth="1" />
      <text x="50" y="80" textAnchor="middle" fontSize="3.6" fill="#a7f3d0">shared suffix दूषणम्</text>
    </svg>
  )},
  { id: "balance", label: "प्रकृतिं रक्ष, मानवं रक्ष", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(6,26,16,0.7)")}
      <circle cx="35" cy="50" r="9" fill="none" stroke="#34d399" strokeWidth="1" />
      <circle cx="65" cy="50" r="9" fill="none" stroke="#a7f3d0" strokeWidth="1" />
      <text x="50" y="82" textAnchor="middle" fontSize="3.8" fill="#a7f3d0">nature and humanity, together</text>
    </svg>
  )},
];

// Ch 9 — Speech & Mind (वाङ्मनसोः)
const vakManasohRegions: TriRegion[] = [
  { id: "twin-rays", label: "मयूखौ — Twin Rays", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1420")}
      <circle cx="50" cy="55" r="6" fill="#facc15" />
      <line x1="50" y1="55" x2="25" y2="25" stroke="#facc15" strokeWidth="1.2" />
      <line x1="50" y1="55" x2="75" y2="25" stroke="#facc15" strokeWidth="1.2" />
      <text x="25" y="20" textAnchor="middle" fontSize="4" fill="#fde68a">वाक्</text>
      <text x="75" y="20" textAnchor="middle" fontSize="4" fill="#fde68a">मनस्</text>
    </svg>
  )},
  { id: "self-governance", label: "वाचं मनसा शास्ति", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <circle cx="50" cy="50" r="14" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
      <text x="50" y="80" textAnchor="middle" fontSize="3.8" fill="#93c5fd">मनसा — instrumental, again</text>
    </svg>
  )},
  { id: "integrity", label: "यद् वदसि तत् कुरु", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <path d="M 30,50 L 70,50" stroke="#60a5fa" strokeWidth="1.4" />
      <polygon points="66,46 74,50 66,54" fill="#60a5fa" />
      <text x="50" y="82" textAnchor="middle" fontSize="3.8" fill="#93c5fd">words matching actions</text>
    </svg>
  )},
];

// Ch 10 — Women's valour (का वा अनया अकृतम्)
const naariShaktiRegions: TriRegion[] = [
  { id: "rhetorical-question", label: "अनया अकृतम्?", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a0a14")}
      <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#e879f9">?</text>
      <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#f5d0fe">a question implying its answer</text>
    </svg>
  )},
  { id: "historical-women", label: "लक्ष्मीबाई · सरोजिनी", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      {[30,50,70].map((x,i) => <circle key={i} cx={x} cy="50" r="7" fill="#e879f9" opacity="0.5" />)}
      <text x="50" y="82" textAnchor="middle" fontSize="3.8" fill="#f5d0fe">breadth of example</text>
    </svg>
  )},
  { id: "leadership-thread", label: "Leadership & Courage", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,10,20,0.7)")}
      <polygon points="50,25 60,45 82,45 64,58 70,80 50,66 30,80 36,58 18,45 40,45" fill="#e879f9" opacity="0.5" />
    </svg>
  )},
];

// Ch 11 — Labour (परिश्रमः)
const parishramaRegions: TriRegion[] = [
  { id: "shram-eva-jayate", label: "श्रम एव जयते", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#1a1206")}
      <rect x="35" y="45" width="30" height="8" fill="#f59e0b" opacity="0.6" />
      <line x1="50" y1="45" x2="50" y2="25" stroke="#f59e0b" strokeWidth="1.6" />
      <text x="50" y="18" textAnchor="middle" fontSize="4.2" fill="#fde68a">एव — &quot;alone&quot;, no shortcuts</text>
    </svg>
  )},
  { id: "equal-dignity", label: "किसान · कारीगर · सैनिक", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      {[30,50,70].map((x,i) => <rect key={i} x={x-6} y="42" width="12" height="16" fill="#f59e0b" opacity="0.5" />)}
      <text x="50" y="80" textAnchor="middle" fontSize="3.6" fill="#fde68a">dignity from effort, not rank</text>
    </svg>
  )},
  { id: "laziness-enemy", label: "आलस्यं शत्रुः", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(26,18,6,0.7)")}
      <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#f59e0b">✕</text>
      <text x="50" y="80" textAnchor="middle" fontSize="3.8" fill="#fde68a">उद्यमेन सिद्ध्यन्ति कार्याणि</text>
    </svg>
  )},
];

// Ch 12 — One World (विश्वबन्धुत्वम्)
const vishwaBandhutvamRegions: TriRegion[] = [
  { id: "vasudhaiva", label: "वसुधैव कुटुम्बकम्", tagN: 1, tagX: 50, tagY: 11, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("#0a1420")}
      <circle cx="50" cy="50" r="24" fill="none" stroke="#facc15" strokeWidth="1.4" />
      <text x="50" y="14" textAnchor="middle" fontSize="4.2" fill="#fde68a">the whole earth, one family</text>
    </svg>
  )},
  { id: "division-as-ignorance", label: "भेदभावः अज्ञानम्", tagN: 2, tagX: 26, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <circle cx="38" cy="50" r="9" fill="#facc15" opacity="0.5" />
      <circle cx="62" cy="50" r="9" fill="#facc15" opacity="0.5" />
      <text x="50" y="80" textAnchor="middle" fontSize="3.8" fill="#fde68a">ignorance, not sin</text>
    </svg>
  )},
  { id: "tattvamasi", label: "अहं ब्रह्मास्मि", tagN: 3, tagX: 74, tagY: 60, children: (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>{bgSvg("rgba(10,20,32,0.7)")}
      <circle cx="50" cy="50" r="16" fill="none" stroke="#facc15" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="4" fill="#facc15" />
      <text x="50" y="82" textAnchor="middle" fontSize="3.8" fill="#fde68a">one Self, in every being</text>
    </svg>
  )},
];

export const SANSKRIT_EXHIBITS: ExhibitDefinition[] = [
  { kind: "panel", id: "skt-environment", chapterId: 1, track: "sanskrit",
    title: "पर्यावरणम् (Environment)", subtitle: "Sanskrit · Ch 1",
    description: "Trees called 'friends of life', passive-voice pollution, and imperative calls to action. Click each region to explore Chapter 1.",
    accent: "#4ade80", icon: "🌳",
    parts: [
      { id: "trees-as-friends", name: "जीवनस्य मित्रे", info: "Trees and rivers are called 'friends of life' rather than resources — a relationship of respect and reciprocity, not ownership, treating environmental care as a moral duty rather than a modern borrowed concern." },
      { id: "pollution", name: "The Passive Voice", info: "वायुः, जलम्, भूमिः च दूषिताः uses the passive (दूषिताः, 'have been polluted') to place the blame on human negligence as the implied agent, even without naming a specific culprit." },
      { id: "call-to-action", name: "Imperative Commands", info: "वृक्षारोपणम् कुरुत, प्लास्टिकं वर्जयत — imperative forms 'plant', 'avoid' — shift the lesson from description to direct, memorable instruction." },
    ], Panel: mkPanel("#4ade80", "🌳 पर्यावरणम्", "पर्यावरणम् (Environment)", "Trees as friends, and a call to protect them", environmentRegions) },

  { kind: "panel", id: "skt-cleanliness", chapterId: 2, track: "sanskrit",
    title: "स्वच्छता (Cleanliness)", subtitle: "Sanskrit · Ch 2",
    description: "The instrumental case in action, a genitive proverb about health, and cleanliness as daily discipline. Click each region to explore Chapter 2.",
    accent: "#38bdf8", icon: "🧼",
    parts: [
      { id: "instrumental-case", name: "स्पृशति पाणिना", info: "स्पृशति (touches) with पाणिना (with the hand, instrumental case) shows how Sanskrit expresses 'the means by which an action happens' through a case ending, not a preposition like English 'with'." },
      { id: "genitive-proverb", name: "स्वच्छता आरोग्यस्य अर्धम्", info: "'Cleanliness is half of health' uses the genitive case (आरोग्यस्य, 'of health') to state a general truth compactly — a construction that recurs throughout the syllabus's thematic chapters." },
      { id: "daily-routine", name: "दिनचर्या", info: "Hygiene vocabulary (स्नानं, दन्तधावनं, नखसंरक्षणं) is grouped as a daily regimen, reflecting the older Ayurvedic idea that hygiene is a structured, daily discipline rather than a one-time instruction." },
    ], Panel: mkPanel("#38bdf8", "🧼 स्वच्छता", "स्वच्छता (Cleanliness)", "Touch, health, and daily discipline", cleanlinessRegions) },

  { kind: "panel", id: "skt-godohanam", chapterId: 3, track: "sanskrit",
    title: "गोदोहनम् (Cow-Milking)", subtitle: "Sanskrit · Ch 3",
    description: "The cow honoured as गोमाता, a compound word built from two roots, and the dignity of everyday rural labour. Click each region to explore Chapter 3.",
    accent: "#fbbf24", icon: "🐄",
    parts: [
      { id: "gomata", name: "गोमाता", info: "Calling the cow 'mother-cow' reflects a cultural framing where the cow is honoured for sustaining human life (milk, ghee, curd) the way a mother sustains a child." },
      { id: "compound-word", name: "गो + दोहनम्", info: "गोदोहनम् combines गौः (cow) with दोहनम् (the act of milking) — recognising this compound structure makes vocabulary far easier to retain than memorising it as one opaque word." },
      { id: "dignity-of-labour", name: "Dignity of Labour", info: "The scene of milking is treated as one of reverence, not mere farm labour — a theme of respect for everyday physical work that reappears explicitly in परिश्रमः (Ch.11)." },
    ], Panel: mkPanel("#fbbf24", "🐄 गोदोहनम्", "गोदोहनम् (Cow-Milking)", "A compound word, and reverence for labour", godohanamRegions) },

  { kind: "panel", id: "skt-shishu-lalanam", chapterId: 4, track: "sanskrit",
    title: "शिशुलालनम् (Nurturing a Child)", subtitle: "Sanskrit · Ch 4",
    description: "A compound built from शिशु + लालनम्, the instrumental case again in 'learning through play', and a lullaby's lasting influence. Click each region to explore Chapter 4.",
    accent: "#f472b6", icon: "👶",
    parts: [
      { id: "nurturing", name: "शिशु + लालनम्", info: "शिशुलालनम् combines शिशुः (infant) with लालनम् (nurturing) — like गोदोहनम्, recognising it as a compound built from two familiar roots makes the vocabulary far easier to retain." },
      { id: "play-instrumental", name: "क्रीडया शिक्षते", info: "'The child learns through play' uses the instrumental case again (क्रीडया, 'by/through play') — a grammatical pattern worth watching for throughout the syllabus." },
      { id: "lullaby", name: "लालन-गीतम्", info: "The chapter's core idea — that early nurturing, especially a mother's lullaby, shapes a child's character — sets up जननी तु गुरुः (Ch.5) almost as a direct continuation." },
    ], Panel: mkPanel("#f472b6", "👶 शिशुलालनम्", "शिशुलालनम् (Nurturing a Child)", "How nurturing happens, in Sanskrit grammar", shishuLalanamRegions) },

  { kind: "panel", id: "skt-janani-guruh", chapterId: 5, track: "sanskrit",
    title: "जननी तु गुरुः (Mother, the First Guru)", subtitle: "Sanskrit · Ch 5",
    description: "An emphatic particle making an argument, epic figures devoted to their mothers, and a direct Upanishadic quotation. Click each region to explore Chapter 5.",
    accent: "#fb923c", icon: "🙏",
    parts: [
      { id: "tu-emphasis", name: "तु — An Emphatic Argument", info: "जननी तु गुरुः uses तु ('indeed') to assert the mother's role against an implicit assumption that 'guru' means a formal teacher — the line is making an argument, not just a statement." },
      { id: "epic-examples", name: "मातृभक्ताः", info: "Citing Yudhishthira, Rama, and Krishna as devoted to their mothers grounds an abstract moral claim in familiar epic figures, making the lesson feel proven by example rather than merely asserted." },
      { id: "upanishad-quote", name: "मातृदेवो भव", info: "This closing line is a direct quotation from the Taittiriya Upanishad — recognising quoted material explains why its phrasing feels more compressed than the surrounding descriptive Sanskrit." },
    ], Panel: mkPanel("#fb923c", "🙏 जननी तु गुरुः", "जननी तु गुरुः", "Why the mother is called the first guru", jananiGuruhRegions) },

  { kind: "panel", id: "skt-subhashita-stabakah", chapterId: 6, track: "sanskrit",
    title: "सूक्तिस्तबकः (A Bouquet of Sayings)", subtitle: "Sanskrit · Ch 6",
    description: "Short verses gathered like flowers into a bouquet, compressed grammar, and a tradition built for oral memory. Click each region to explore Chapter 6.",
    accent: "#a78bfa", icon: "💐",
    parts: [
      { id: "bouquet-metaphor", name: "स्तबकः — A Bouquet", info: "The title's metaphor tells you to expect a collection of unrelated one- or two-line verses gathered like flowers into one bunch, not one continuous narrative." },
      { id: "compressed-verse", name: "Compressed Grammar", info: "Each subhashita packs a complete moral idea into just one or two lines, dropping words an English sentence would need — the skill is inferring the full sense from a deliberately terse verse." },
      { id: "oral-tradition", name: "Portable Moral Education", info: "Subhashita literature historically functioned as portable, memorable moral education, meant to be quoted in daily life and passed down orally, which is why the verses are built to be short." },
    ], Panel: mkPanel("#a78bfa", "💐 सूक्तिस्तबकः", "सूक्तिस्तबकः (A Bouquet of Sayings)", "Short verses, gathered for memory", subhashitaRegions) },

  { kind: "panel", id: "skt-bharat-mahima", chapterId: 7, track: "sanskrit",
    title: "भारतमहिमा (The Glory of India)", subtitle: "Sanskrit · Ch 7",
    description: "National identity built through sacred rivers and mountains, a simile using इव, and culture as the real argument. Click each region to explore Chapter 7.",
    accent: "#fb7185", icon: "🏔️",
    parts: [
      { id: "sacred-rivers", name: "Geography as Identity", info: "The chapter builds its praise through sacred rivers and the Himalayas rather than kings or conquests, defining national identity through the land itself as something sacred." },
      { id: "himalaya-simile", name: "हिमालयः मुकुटम् इव", info: "'The Himalayas are like a crown of India' uses इव ('like/as') to build a simile — spotting इव quickly is one of the most useful grammatical markers for reading Sanskrit prose." },
      { id: "culture-as-soul", name: "संस्कृतिः राष्ट्रस्य आत्मा", info: "'Culture is the soul of a nation' makes the chapter's real argument explicit — geography matters here only because it shaped a culture, and it's that culture that earns the pride." },
    ], Panel: mkPanel("#fb7185", "🏔️ भारतमहिमा", "भारतमहिमा (The Glory of India)", "Rivers, mountains, and a nation's culture", bharatMahimaRegions) },

  { kind: "panel", id: "skt-paryavaranam-2", chapterId: 8, track: "sanskrit",
    title: "पर्यावरणम् (Environment, Revisited)", subtitle: "Sanskrit · Ch 8",
    description: "The five great elements as a cosmic framework, shared vocabulary suffixes for pollution, and nature and humanity treated as one system. Click each region to explore Chapter 8.",
    accent: "#34d399", icon: "🌍",
    parts: [
      { id: "pancha-mahabhutani", name: "पञ्चमहाभूतानि", info: "The five great elements (earth, water, fire, air, space) that classical Indian thought considered the building blocks of the physical world — pollution disturbs this five-part cosmic balance, not just 'nature' generically." },
      { id: "pollution-compounds", name: "वायु/जल/भूमि-दूषणं", info: "The three pollution terms all share दूषणम् (pollution/corruption) as their second half — recognising that shared piece lets you decode new pollution vocabulary without memorising each term separately." },
      { id: "balance", name: "प्रकृतिं रक्ष, मानवं रक्ष", info: "'Protect nature, protect humanity' places the two side by side rather than as separate goals — protecting nature is protecting humanity, since humans are embedded within, not separate from, the elemental system." },
    ], Panel: mkPanel("#34d399", "🌍 पर्यावरणम्", "पर्यावरणम् (Environment, Revisited)", "The five elements, and a shared balance", paryavaranamRegions) },

  { kind: "panel", id: "skt-vak-manasoh", chapterId: 9, track: "sanskrit",
    title: "वाङ्मनसोः संयमः (Speech & Mind)", subtitle: "Sanskrit · Ch 9",
    description: "Speech and mind as twin rays of one source, the instrumental case once more, and a practical standard of integrity. Click each region to explore Chapter 9.",
    accent: "#60a5fa", icon: "💭",
    parts: [
      { id: "twin-rays", name: "मयूखौ — Twin Rays", info: "वाक् (speech) and मनस् (mind) are called 'twin rays' of consciousness — two beams from the same source, which is why controlling words and controlling thoughts are treated as the same discipline." },
      { id: "self-governance", name: "वाचं मनसा शास्ति", info: "'One who governs speech with the mind is wise' uses the instrumental case (मनसा) again — the same pattern seen in क्रीडया (Ch.4) and पाणिना (Ch.2), reinforcing how central this case is throughout the syllabus." },
      { id: "integrity", name: "यद् वदसि तत् कुरु", info: "'Do what you say' closes the chapter with a practical ethical demand — moving from an abstract idea (twin forces) to a concrete standard: your actions should match your words." },
    ], Panel: mkPanel("#60a5fa", "💭 वाङ्मनसोः संयमः", "वाङ्मनसोः संयमः (Speech & Mind)", "Twin forces, governed as one discipline", vakManasohRegions) },

  { kind: "panel", id: "skt-naari-shakti", chapterId: 10, track: "sanskrit",
    title: "का वा अनया अकृतम् (Women's Valour)", subtitle: "Sanskrit · Ch 10",
    description: "A rhetorical question implying its own answer, women across different eras of achievement, and a thread of leadership and courage. Click each region to explore Chapter 10.",
    accent: "#e879f9", icon: "👑",
    parts: [
      { id: "rhetorical-question", name: "A Rhetorical Question", info: "'Has she not done it?' poses the claim as a question expecting an obvious 'yes, she certainly has' — a persuasive technique worth recognising when it appears elsewhere too." },
      { id: "historical-women", name: "Breadth of Example", info: "Naming Lakshmibai, Rani Chennamma, Ahalyabai, and Sarojini Naidu — spanning different eras and kinds of achievement — builds the case through breadth rather than resting on a single figure." },
      { id: "leadership-thread", name: "A Wider Thread", info: "This chapter widens the syllabus's earlier focus on motherhood (जननी तु गुरुः, Ch.5) into leadership, courage, and public achievement — two complementary ways the syllabus frames women's contributions." },
    ], Panel: mkPanel("#e879f9", "👑 का वा अनया अकृतम्", "का वा अनया अकृतम् (Women's Valour)", "A question that answers itself", naariShaktiRegions) },

  { kind: "panel", id: "skt-parishrama", chapterId: 11, track: "sanskrit",
    title: "परिश्रमः (Labour)", subtitle: "Sanskrit · Ch 11",
    description: "An emphatic maxim ruling out shortcuts, equal dignity across professions, and laziness named as prosperity's enemy. Click each region to explore Chapter 11.",
    accent: "#f59e0b", icon: "🔨",
    parts: [
      { id: "shram-eva-jayate", name: "श्रम एव जयते", info: "'Labour alone triumphs' uses एव ('alone/only') to rule out shortcuts explicitly — a stronger, more absolute claim than simply 'labour helps'." },
      { id: "equal-dignity", name: "Equal Dignity", info: "Listing the farmer, artisan, soldier, and scholar together as equally noble argues that dignity comes from effort itself, not from the prestige of the profession." },
      { id: "laziness-enemy", name: "आलस्यं हि श्रियः शत्रुः", info: "'Laziness is the enemy of prosperity' pairs with उद्यमेन हि सिद्ध्यन्ति कार्याणि ('tasks succeed only through effort') to frame effort and laziness as direct opposites, with no neutral middle ground." },
    ], Panel: mkPanel("#f59e0b", "🔨 परिश्रमः", "परिश्रमः (Labour)", "No shortcuts, and dignity in every trade", parishramaRegions) },

  { kind: "panel", id: "skt-vishwa-bandhutvam", chapterId: 12, track: "sanskrit",
    title: "विश्वबन्धुत्वम् (Universal Brotherhood)", subtitle: "Sanskrit · Ch 12",
    description: "The whole earth as one family, division reframed as ignorance, and a single Self said to dwell in every being. Click each region to explore Chapter 12.",
    accent: "#facc15", icon: "🕉️",
    parts: [
      { id: "vasudhaiva", name: "वसुधैव कुटुम्बकम्", info: "'The whole earth is one family', drawn from the Rig Veda tradition, is the grandest possible claim the chapter opens with, before narrowing to its practical social implication." },
      { id: "division-as-ignorance", name: "भेदभावः अज्ञानम्", info: "Calling division 'ignorance' rather than simply 'wrong' frames prejudice as a failure of understanding to correct, not a moral failing to punish." },
      { id: "tattvamasi", name: "अहं ब्रह्मास्मि, तत्त्वमसि", info: "These Upanishadic statements — 'I am Brahman', 'that thou art' — assert the same universal Self underlies every individual, grounding the chapter's ethics in a single metaphysical claim." },
    ], Panel: mkPanel("#facc15", "🕉️ विश्वबन्धुत्वम्", "विश्वबन्धुत्वम् (Universal Brotherhood)", "One family, one Self, in every being", vishwaBandhutvamRegions) },
];
