"use client";
import type { ExhibitDefinition, PanelSceneProps } from "./types";
import { TriPanel, type TriRegion } from "./tri-panel";

// Maths — abstract/geometric exhibits (13 chapters). Every region is a
// small self-contained SVG diagram; the factual "why" text lives in
// `parts[].info` and is rendered by the surrounding overlay UI, not drawn
// into the SVG itself, which keeps these diagrams clean and legible.

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

// ---------- Ch 1 — Real Numbers ----------
const realNumbersRegions: TriRegion[] = [
  {
    id: "prime-tree", label: "Prime Factor Tree", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#06131a" />
        <text x="50" y="16" textAnchor="middle" fontSize="6" fill="#22d3ee" fontWeight="700">360</text>
        <line x1="50" y1="18" x2="30" y2="34" stroke="#22d3ee" strokeWidth="1" />
        <line x1="50" y1="18" x2="70" y2="34" stroke="#22d3ee" strokeWidth="1" />
        <circle cx="30" cy="38" r="6" fill="none" stroke="#67e8f9" strokeWidth="1" /><text x="30" y="41" textAnchor="middle" fontSize="5.5" fill="#67e8f9">2</text>
        <circle cx="70" cy="38" r="6" fill="none" stroke="#67e8f9" strokeWidth="1" /><text x="70" y="41" textAnchor="middle" fontSize="5.5" fill="#67e8f9">180</text>
        <line x1="70" y1="44" x2="55" y2="60" stroke="#22d3ee" strokeWidth="1" />
        <line x1="70" y1="44" x2="85" y2="60" stroke="#22d3ee" strokeWidth="1" />
        <circle cx="55" cy="64" r="6" fill="none" stroke="#67e8f9" strokeWidth="1" /><text x="55" y="67" textAnchor="middle" fontSize="5.5" fill="#67e8f9">2</text>
        <circle cx="85" cy="64" r="6" fill="none" stroke="#67e8f9" strokeWidth="1" /><text x="85" y="67" textAnchor="middle" fontSize="5.5" fill="#67e8f9">90</text>
        <line x1="85" y1="70" x2="72" y2="86" stroke="#22d3ee" strokeWidth="1" />
        <line x1="85" y1="70" x2="98" y2="86" stroke="#22d3ee" strokeWidth="0.8" />
        <text x="72" y="92" textAnchor="middle" fontSize="5" fill="#a5f3fc">2×3²×5…</text>
        <text x="50" y="8" textAnchor="middle" fontSize="3.4" fill="#67e8f9" opacity="0.8">n = product of primes, uniquely</text>
      </svg>
    ),
  },
  {
    id: "euclid-algorithm", label: "Euclid's Algorithm", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,19,26,0.7)" />
        <text x="50" y="12" textAnchor="middle" fontSize="5.4" fill="#22d3ee" fontWeight="700">HCF(72,20)</text>
        <text x="10" y="30" fontSize="5" fill="#a5f3fc">72 = 20×3 + 12</text>
        <text x="10" y="46" fontSize="5" fill="#a5f3fc">20 = 12×1 + 8</text>
        <text x="10" y="62" fontSize="5" fill="#a5f3fc">12 = 8×1 + 4</text>
        <text x="10" y="78" fontSize="5" fill="#67e8f9" fontWeight="700">8 = 4×2 + 0</text>
        <path d="M 12,64 L 12,80 L 20,80" stroke="#22d3ee" strokeWidth="0.8" fill="none" />
        <text x="50" y="92" textAnchor="middle" fontSize="4.6" fill="#facc15" fontWeight="700">HCF = 4</text>
      </svg>
    ),
  },
  {
    id: "irrational", label: "√2 is Irrational", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,19,26,0.7)" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#334155" strokeWidth="1" />
        <circle cx="20" cy="50" r="1.4" fill="#67e8f9" /><text x="20" y="60" textAnchor="middle" fontSize="4.4" fill="#67e8f9">0</text>
        <circle cx="50" cy="50" r="1.4" fill="#67e8f9" /><text x="50" y="60" textAnchor="middle" fontSize="4.4" fill="#67e8f9">1</text>
        <circle cx="80" cy="50" r="1.8" fill="#facc15" />
        <text x="80" y="34" textAnchor="middle" fontSize="6" fill="#facc15" fontWeight="700">√2</text>
        <text x="50" y="20" textAnchor="middle" fontSize="4.6" fill="#e2e8f0">1.41421356…</text>
        <text x="50" y="80" textAnchor="middle" fontSize="4" fill="#94a3b8">never repeats, never ends</text>
      </svg>
    ),
  },
];

// ---------- Ch 2 — Polynomials ----------
const polynomialsRegions: TriRegion[] = [
  {
    id: "parabola-zeros", label: "Zeros = x-intercepts", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#0a1420" />
        <line x1="5" y1="70" x2="95" y2="70" stroke="#334155" strokeWidth="0.8" />
        <line x1="50" y1="10" x2="50" y2="95" stroke="#334155" strokeWidth="0.8" />
        <path d="M 15,20 Q 50,110 85,20" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
        <circle cx="30" cy="70" r="2" fill="#facc15" /><circle cx="70" cy="70" r="2" fill="#facc15" />
        <text x="30" y="82" textAnchor="middle" fontSize="4.6" fill="#facc15">α</text>
        <text x="70" y="82" textAnchor="middle" fontSize="4.6" fill="#facc15">β</text>
        <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#93c5fd">p(x) = a(x−α)(x−β)</text>
      </svg>
    ),
  },
  {
    id: "cubic", label: "Cubic — 3 zeros", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <line x1="5" y1="55" x2="95" y2="55" stroke="#334155" strokeWidth="0.8" />
        <path d="M 12,30 C 30,80 40,20 55,55 C 68,84 78,40 90,20" stroke="#818cf8" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="55" r="1.8" fill="#facc15" /><circle cx="52" cy="55" r="1.8" fill="#facc15" /><circle cx="80" cy="55" r="1.8" fill="#facc15" />
        <text x="50" y="14" textAnchor="middle" fontSize="4.6" fill="#a5b4fc">degree 3 → up to 3 zeros</text>
      </svg>
    ),
  },
  {
    id: "root-relations", label: "Sum & Product of Roots", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <text x="50" y="30" textAnchor="middle" fontSize="5.6" fill="#e2e8f0" fontWeight="700">ax²+bx+c</text>
        <line x1="15" y1="42" x2="85" y2="42" stroke="#475569" strokeWidth="0.6" />
        <text x="50" y="58" textAnchor="middle" fontSize="5" fill="#93c5fd">α+β = −b/a</text>
        <text x="50" y="76" textAnchor="middle" fontSize="5" fill="#67e8f9">αβ = c/a</text>
      </svg>
    ),
  },
];

// ---------- Ch 3 — Pair of Linear Equations ----------
function twoLinesGraphic(kind: "cross" | "parallel" | "same") {
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="100" fill="#0a1420" />
      <line x1="5" y1="80" x2="95" y2="80" stroke="#334155" strokeWidth="0.8" />
      <line x1="15" y1="10" x2="15" y2="95" stroke="#334155" strokeWidth="0.8" />
      {kind === "cross" && (<>
        <line x1="15" y1="20" x2="90" y2="80" stroke="#60a5fa" strokeWidth="1.6" />
        <line x1="15" y1="80" x2="90" y2="20" stroke="#f472b6" strokeWidth="1.6" />
        <circle cx="52" cy="50" r="2.4" fill="#facc15" />
        <text x="52" y="42" textAnchor="middle" fontSize="4.6" fill="#facc15">unique solution</text>
      </>)}
      {kind === "parallel" && (<>
        <line x1="15" y1="30" x2="90" y2="60" stroke="#60a5fa" strokeWidth="1.6" />
        <line x1="15" y1="55" x2="90" y2="85" stroke="#60a5fa" strokeWidth="1.6" />
        <text x="52" y="20" textAnchor="middle" fontSize="4.6" fill="#93c5fd">no solution</text>
      </>)}
      {kind === "same" && (<>
        <line x1="15" y1="70" x2="90" y2="30" stroke="#60a5fa" strokeWidth="2.2" />
        <line x1="15" y1="70" x2="90" y2="30" stroke="#facc15" strokeWidth="0.8" strokeDasharray="3,2" />
        <text x="52" y="20" textAnchor="middle" fontSize="4.6" fill="#fde68a">infinite solutions</text>
      </>)}
    </svg>
  );
}
const linearEquationsRegions: TriRegion[] = [
  { id: "unique", label: "Intersecting Lines", tagN: 1, tagX: 50, tagY: 11, children: twoLinesGraphic("cross") },
  { id: "parallel", label: "Parallel Lines", tagN: 2, tagX: 26, tagY: 60, children: twoLinesGraphic("parallel") },
  { id: "coincident", label: "Coincident Lines", tagN: 3, tagX: 74, tagY: 60, children: twoLinesGraphic("same") },
];

// ---------- Ch 4 — Quadratic Equations ----------
function discriminantGraphic(kind: "two" | "one" | "none") {
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <rect width="100" height="100" fill="#0a1420" />
      <line x1="5" y1="65" x2="95" y2="65" stroke="#334155" strokeWidth="0.8" />
      {kind === "two" && (<>
        <path d="M 15,15 Q 50,100 85,15" stroke="#818cf8" strokeWidth="1.6" fill="none" />
        <circle cx="32" cy="65" r="2" fill="#facc15" /><circle cx="68" cy="65" r="2" fill="#facc15" />
        <text x="50" y="14" textAnchor="middle" fontSize="4.6" fill="#a5b4fc">D &gt; 0 — two real roots</text>
      </>)}
      {kind === "one" && (<>
        <path d="M 15,25 Q 50,65 85,25" stroke="#818cf8" strokeWidth="1.6" fill="none" />
        <circle cx="50" cy="65" r="2.2" fill="#facc15" />
        <text x="50" y="14" textAnchor="middle" fontSize="4.6" fill="#a5b4fc">D = 0 — one repeated root</text>
      </>)}
      {kind === "none" && (<>
        <path d="M 15,40 Q 50,5 85,40" stroke="#818cf8" strokeWidth="1.6" fill="none" />
        <text x="50" y="60" textAnchor="middle" fontSize="4.6" fill="#a5b4fc">D &lt; 0 — no real roots</text>
      </>)}
    </svg>
  );
}
const quadraticRegions: TriRegion[] = [
  { id: "two-roots", label: "Two Real Roots", tagN: 1, tagX: 50, tagY: 11, children: discriminantGraphic("two") },
  { id: "one-root", label: "One Repeated Root", tagN: 2, tagX: 26, tagY: 60, children: discriminantGraphic("one") },
  { id: "no-roots", label: "No Real Roots", tagN: 3, tagX: 74, tagY: 60, children: discriminantGraphic("none") },
];

// ---------- Ch 5 — Arithmetic Progressions ----------
const apRegions: TriRegion[] = [
  {
    id: "nth-term", label: "Constant Difference", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#0a1420" />
        {[0,1,2,3,4].map((i) => (
          <g key={i}>
            <circle cx={14 + i*18} cy="55" r="3.2" fill="#a78bfa" />
            <text x={14 + i*18} y="70" textAnchor="middle" fontSize="4.4" fill="#c4b5fd">{i===0?"a":`a+${i}d`}</text>
          </g>
        ))}
        <line x1="14" y1="55" x2="86" y2="55" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
        <text x="50" y="20" textAnchor="middle" fontSize="4.6" fill="#ddd6fe">each step: + d</text>
      </svg>
    ),
  },
  {
    id: "gauss-pairing", label: "Gauss's Pairing Trick", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <text x="10" y="30" fontSize="5" fill="#c4b5fd">1 2 3 … 8 9 10</text>
        <path d="M 14,34 Q 50,50 84,34" stroke="#facc15" strokeWidth="1" fill="none" />
        <path d="M 26,34 Q 50,46 72,34" stroke="#facc15" strokeWidth="1" fill="none" opacity="0.7" />
        <text x="50" y="66" textAnchor="middle" fontSize="4.6" fill="#facc15">each pair = 11</text>
        <text x="50" y="82" textAnchor="middle" fontSize="4.6" fill="#e2e8f0">5 pairs × 11 = 55</text>
      </svg>
    ),
  },
  {
    id: "ap-application", label: "Rows of a Stadium", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={20} y={80 - i*13} width={12 + i*10} height="8" fill="#a78bfa" opacity={0.4 + i*0.12} />
        ))}
        <text x="50" y="16" textAnchor="middle" fontSize="4.4" fill="#ddd6fe">seats increase steadily</text>
      </svg>
    ),
  },
];

// ---------- Ch 6 — Triangles ----------
const trianglesRegions: TriRegion[] = [
  {
    id: "similarity-bpt", label: "Basic Proportionality", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#06140f" />
        <polygon points="50,12 15,85 85,85" fill="none" stroke="#34d399" strokeWidth="1.4" />
        <line x1="32" y1="47" x2="68" y2="47" stroke="#facc15" strokeWidth="1.2" strokeDasharray="3,2" />
        <text x="50" y="43" textAnchor="middle" fontSize="4.4" fill="#facc15">DE ∥ BC</text>
        <text x="15" y="93" fontSize="4.4" fill="#6ee7b7">B</text>
        <text x="82" y="93" fontSize="4.4" fill="#6ee7b7">C</text>
        <text x="50" y="9" textAnchor="middle" fontSize="4.4" fill="#6ee7b7">A</text>
      </svg>
    ),
  },
  {
    id: "similar-shapes", label: "Similar Triangles", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,20,15,0.7)" />
        <polygon points="20,85 55,85 20,30" fill="none" stroke="#34d399" strokeWidth="1.4" />
        <polygon points="60,85 92,85 60,55" fill="none" stroke="#6ee7b7" strokeWidth="1" />
        <text x="50" y="16" textAnchor="middle" fontSize="4.2" fill="#a7f3d0">same shape, scaled size</text>
      </svg>
    ),
  },
  {
    id: "area-ratio", label: "Area Ratio = k²", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,20,15,0.7)" />
        <rect x="10" y="55" width="18" height="18" fill="none" stroke="#34d399" strokeWidth="1" />
        <rect x="45" y="20" width="45" height="45" fill="none" stroke="#6ee7b7" strokeWidth="1.4" />
        <text x="19" y="80" textAnchor="middle" fontSize="4" fill="#a7f3d0">side k</text>
        <text x="67" y="72" textAnchor="middle" fontSize="4" fill="#a7f3d0">side 2.5k</text>
        <text x="50" y="90" textAnchor="middle" fontSize="4.4" fill="#facc15">area × 6.25 (=2.5²)</text>
      </svg>
    ),
  },
];

// ---------- Ch 7 — Coordinate Geometry ----------
const coordGeoRegions: TriRegion[] = [
  {
    id: "distance-formula", label: "Distance = Pythagoras", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#0a1420" />
        <line x1="10" y1="90" x2="95" y2="90" stroke="#334155" strokeWidth="0.7" />
        <line x1="10" y1="15" x2="10" y2="95" stroke="#334155" strokeWidth="0.7" />
        <circle cx="22" cy="75" r="2" fill="#2dd4bf" /><text x="22" y="85" textAnchor="middle" fontSize="4" fill="#5eead4">P(x₁,y₁)</text>
        <circle cx="72" cy="30" r="2" fill="#2dd4bf" /><text x="80" y="27" fontSize="4" fill="#5eead4">Q(x₂,y₂)</text>
        <line x1="22" y1="75" x2="72" y2="30" stroke="#2dd4bf" strokeWidth="1.4" />
        <line x1="22" y1="75" x2="72" y2="75" stroke="#facc15" strokeWidth="0.9" strokeDasharray="2,2" />
        <line x1="72" y1="75" x2="72" y2="30" stroke="#facc15" strokeWidth="0.9" strokeDasharray="2,2" />
        <text x="50" y="12" textAnchor="middle" fontSize="4.4" fill="#99f6e4">PQ² = Δx² + Δy²</text>
      </svg>
    ),
  },
  {
    id: "section-formula", label: "Section Formula", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="#2dd4bf" strokeWidth="1.2" />
        <circle cx="12" cy="50" r="2" fill="#5eead4" /><circle cx="88" cy="50" r="2" fill="#5eead4" />
        <circle cx="42" cy="50" r="2.2" fill="#facc15" />
        <text x="42" y="42" textAnchor="middle" fontSize="4.4" fill="#facc15">P</text>
        <text x="27" y="62" textAnchor="middle" fontSize="4" fill="#99f6e4">m</text>
        <text x="65" y="62" textAnchor="middle" fontSize="4" fill="#99f6e4">n</text>
        <text x="50" y="20" textAnchor="middle" fontSize="4.4" fill="#99f6e4">divides in ratio m:n</text>
      </svg>
    ),
  },
  {
    id: "collinearity", label: "Area → Collinearity", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <polygon points="20,80 60,25 85,80" fill="#2dd4bf" opacity="0.25" stroke="#2dd4bf" strokeWidth="1" />
        <text x="50" y="16" textAnchor="middle" fontSize="4.4" fill="#99f6e4">area = 0 → points are collinear</text>
      </svg>
    ),
  },
];

// ---------- Ch 8 — Trigonometry Applications ----------
const trigAppRegions: TriRegion[] = [
  {
    id: "elevation", label: "Angle of Elevation", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#0a1420" />
        <line x1="10" y1="88" x2="90" y2="88" stroke="#334155" strokeWidth="0.8" />
        <line x1="70" y1="15" x2="70" y2="88" stroke="#fbbf24" strokeWidth="1.6" />
        <line x1="15" y1="88" x2="70" y2="15" stroke="#fde68a" strokeWidth="1" strokeDasharray="2,2" />
        <path d="M 30,88 A 15,15 0 0 0 25,74" stroke="#facc15" strokeWidth="1" fill="none" />
        <text x="34" y="80" fontSize="4.4" fill="#facc15">θ</text>
        <text x="72" y="12" fontSize="4" fill="#fde68a">tower, height h</text>
      </svg>
    ),
  },
  {
    id: "ladder", label: "Ladder on a Wall", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <line x1="15" y1="88" x2="15" y2="20" stroke="#94a3b8" strokeWidth="1.4" />
        <line x1="15" y1="88" x2="80" y2="88" stroke="#334155" strokeWidth="0.8" />
        <line x1="15" y1="20" x2="80" y2="88" stroke="#fbbf24" strokeWidth="1.6" />
        <text x="50" y="16" textAnchor="middle" fontSize="4.4" fill="#fde68a">hypotenuse involved → sin/cos</text>
      </svg>
    ),
  },
  {
    id: "two-towers", label: "Two Observers", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(10,20,32,0.7)" />
        <line x1="20" y1="90" x2="20" y2="20" stroke="#fbbf24" strokeWidth="1.4" />
        <line x1="80" y1="90" x2="80" y2="45" stroke="#fbbf24" strokeWidth="1.4" />
        <line x1="10" y1="90" x2="90" y2="90" stroke="#334155" strokeWidth="0.8" />
        <line x1="50" y1="90" x2="20" y2="20" stroke="#fde68a" strokeWidth="0.8" strokeDasharray="2,2" />
        <line x1="50" y1="90" x2="80" y2="45" stroke="#fde68a" strokeWidth="0.8" strokeDasharray="2,2" />
        <text x="50" y="16" textAnchor="middle" fontSize="4.2" fill="#fde68a">two triangles, one baseline</text>
      </svg>
    ),
  },
];

// ---------- Ch 9 — Circles ----------
const circlesRegions: TriRegion[] = [
  {
    id: "tangent-perp", label: "Tangent ⊥ Radius", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#170a1a" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#f472b6" strokeWidth="1.4" />
        <line x1="50" y1="50" x2="50" y2="20" stroke="#fbcfe8" strokeWidth="1" />
        <line x1="15" y1="20" x2="85" y2="20" stroke="#f472b6" strokeWidth="1.6" />
        <rect x="46" y="16" width="8" height="8" fill="none" stroke="#facc15" strokeWidth="0.8" />
        <text x="50" y="35" textAnchor="middle" fontSize="4" fill="#fbcfe8">r</text>
        <text x="50" y="14" textAnchor="middle" fontSize="4.2" fill="#fce7f3">tangent touches once</text>
      </svg>
    ),
  },
  {
    id: "equal-tangents", label: "Equal Tangent Lengths", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(23,10,26,0.7)" />
        <circle cx="55" cy="55" r="22" fill="none" stroke="#f472b6" strokeWidth="1.2" />
        <circle cx="15" cy="25" r="1.8" fill="#facc15" />
        <line x1="15" y1="25" x2="38" y2="42" stroke="#fbcfe8" strokeWidth="1.2" />
        <line x1="15" y1="25" x2="34" y2="66" stroke="#fbcfe8" strokeWidth="1.2" />
        <text x="15" y="18" textAnchor="middle" fontSize="4.2" fill="#facc15">P</text>
        <text x="50" y="90" textAnchor="middle" fontSize="4.2" fill="#fce7f3">PA = PB</text>
      </svg>
    ),
  },
  {
    id: "cyclic-quad", label: "Cyclic Quadrilateral", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(23,10,26,0.7)" />
        <polygon points="50,20 25,55 50,80 82,45" fill="none" stroke="#f472b6" strokeWidth="1.2" />
        <text x="50" y="14" textAnchor="middle" fontSize="4.2" fill="#fce7f3">O,A,P,B — two right angles</text>
      </svg>
    ),
  },
];

// ---------- Ch 10 — Areas Related to Circles ----------
const areasCirclesRegions: TriRegion[] = [
  {
    id: "sector", label: "Sector = Slice of θ/360", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#1a1206" />
        <circle cx="50" cy="55" r="30" fill="none" stroke="#fb923c" strokeWidth="1" opacity="0.5" />
        <path d="M 50,55 L 50,25 A 30,30 0 0 1 76,70 Z" fill="#fb923c" opacity="0.55" stroke="#fb923c" strokeWidth="1" />
        <text x="60" y="42" fontSize="4.4" fill="#fed7aa">θ</text>
      </svg>
    ),
  },
  {
    id: "segment", label: "Segment = Sector − Triangle", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(26,18,6,0.7)" />
        <circle cx="50" cy="42" r="26" fill="none" stroke="#fb923c" strokeWidth="0.9" opacity="0.5" />
        <path d="M 30,55 A 26,26 0 0 0 70,55 Z" fill="#fbbf24" opacity="0.6" />
        <line x1="30" y1="55" x2="70" y2="55" stroke="#fde68a" strokeWidth="0.8" />
        <text x="50" y="90" textAnchor="middle" fontSize="4.2" fill="#fed7aa">the leftover sliver</text>
      </svg>
    ),
  },
  {
    id: "combined-figure", label: "Combined Figures", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(26,18,6,0.7)" />
        <rect x="20" y="30" width="45" height="45" fill="none" stroke="#fb923c" strokeWidth="1.2" />
        <path d="M 65,30 A 22.5,22.5 0 0 1 65,75" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <text x="50" y="18" textAnchor="middle" fontSize="4.2" fill="#fed7aa">square + semicircle</text>
      </svg>
    ),
  },
];

// ---------- Ch 11 — Surface Areas and Volumes ----------
const solidsRegions: TriRegion[] = [
  {
    id: "combined-solid", label: "Cone on Cylinder", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#061a10" />
        <ellipse cx="50" cy="78" rx="22" ry="6" fill="none" stroke="#4ade80" strokeWidth="1" />
        <line x1="28" y1="78" x2="28" y2="50" stroke="#4ade80" strokeWidth="1" />
        <line x1="72" y1="78" x2="72" y2="50" stroke="#4ade80" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="22" ry="6" fill="none" stroke="#4ade80" strokeWidth="1" />
        <path d="M 28,50 L 50,15 L 72,50" fill="none" stroke="#86efac" strokeWidth="1.4" />
        <text x="50" y="92" textAnchor="middle" fontSize="4.2" fill="#bbf7d0">shared circle isn't double-counted</text>
      </svg>
    ),
  },
  {
    id: "volume-conserved", label: "Melt & Recast", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,26,16,0.7)" />
        <circle cx="24" cy="50" r="16" fill="#4ade80" opacity="0.5" />
        <path d="M 46,50 L 60,50" stroke="#86efac" strokeWidth="1.2" />
        <polygon points="58,45 68,50 58,55" fill="#86efac" />
        {[0,1,2].map((i) => <rect key={i} x={76+i*7} y={44} width="6" height="6" fill="#4ade80" opacity="0.6" />)}
        <text x="50" y="80" textAnchor="middle" fontSize="4.2" fill="#bbf7d0">same volume, new shape</text>
      </svg>
    ),
  },
  {
    id: "slant-height", label: "Slant Height = Pythagoras", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(6,26,16,0.7)" />
        <polygon points="50,15 25,80 75,80" fill="none" stroke="#4ade80" strokeWidth="1.2" />
        <line x1="50" y1="15" x2="50" y2="80" stroke="#86efac" strokeWidth="0.8" strokeDasharray="2,2" />
        <text x="53" y="50" fontSize="4" fill="#86efac">h</text>
        <text x="62" y="45" fontSize="4" fill="#fde68a">l</text>
        <text x="37" y="84" fontSize="4" fill="#bbf7d0">r</text>
      </svg>
    ),
  },
];

// ---------- Ch 12 — Statistics ----------
const statsRegions: TriRegion[] = [
  {
    id: "histogram", label: "Histogram", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#160a1a" />
        {[18,34,50,66,82].map((x,i) => <rect key={i} x={x-7} y={85-[20,45,60,38,22][i]} width="14" height={[20,45,60,38,22][i]} fill="#c084fc" opacity="0.65" />)}
        <line x1="8" y1="85" x2="92" y2="85" stroke="#475569" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: "ogive", label: "Ogive → Median", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(22,10,26,0.7)" />
        <path d="M 10,85 Q 40,80 50,50 T 90,15" stroke="#c084fc" strokeWidth="1.4" fill="none" />
        <path d="M 10,15 Q 40,20 50,50 T 90,85" stroke="#e9d5ff" strokeWidth="1.4" fill="none" />
        <circle cx="50" cy="50" r="2.2" fill="#facc15" />
        <text x="50" y="42" textAnchor="middle" fontSize="4.2" fill="#facc15">median</text>
      </svg>
    ),
  },
  {
    id: "central-tendency", label: "Mean, Median, Mode", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(22,10,26,0.7)" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="0.8" />
        <circle cx="30" cy="50" r="2.4" fill="#c084fc" /><text x="30" y="64" textAnchor="middle" fontSize="4" fill="#e9d5ff">Mode</text>
        <circle cx="55" cy="50" r="2.4" fill="#facc15" /><text x="55" y="64" textAnchor="middle" fontSize="4" fill="#fde68a">Median</text>
        <circle cx="70" cy="50" r="2.4" fill="#f472b6" /><text x="70" y="64" textAnchor="middle" fontSize="4" fill="#fbcfe8">Mean</text>
        <text x="50" y="30" textAnchor="middle" fontSize="4" fill="#e9d5ff">3·Median = Mode + 2·Mean</text>
      </svg>
    ),
  },
];

// ---------- Ch 13 — Probability ----------
const probabilityRegions: TriRegion[] = [
  {
    id: "dice-grid", label: "Two-Dice Sample Space", tagN: 1, tagX: 50, tagY: 11,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="#1a0a0a" />
        {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 6 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={10 + c*13.3} y={10 + r*13.3} width="12" height="12" fill={(r+c)===5?"#facc15":"#f87171"} opacity={(r+c)===5?0.9:0.35} />
        )))}
        <text x="50" y="98" textAnchor="middle" fontSize="4" fill="#fecaca">36 outcomes, equally likely</text>
      </svg>
    ),
  },
  {
    id: "cards", label: "Deck of Cards", tagN: 2, tagX: 26, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(26,10,10,0.7)" />
        {[0,1,2,3].map((i) => (
          <rect key={i} x={20+i*14} y={30} width="24" height="34" rx="2" fill="#fff" opacity="0.9" transform={`rotate(${-15+i*10} ${32+i*14} 47)`} />
        ))}
        <text x="50" y="86" textAnchor="middle" fontSize="4.2" fill="#fecaca">52 cards · 4 suits · 13 each</text>
      </svg>
    ),
  },
  {
    id: "complement", label: "Complement Rule", tagN: 3, tagX: 74, tagY: 60,
    children: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <rect width="100" height="100" fill="rgba(26,10,10,0.7)" />
        <circle cx="50" cy="50" r="30" fill="#f87171" opacity="0.3" stroke="#f87171" strokeWidth="1" />
        <path d="M 50,20 A 30,30 0 0 1 50,80 Z" fill="#facc15" opacity="0.6" />
        <text x="50" y="94" textAnchor="middle" fontSize="4.4" fill="#fed7aa">P(E) + P(not E) = 1</text>
      </svg>
    ),
  },
];

export const MATHS_EXHIBITS: ExhibitDefinition[] = [
  {
    kind: "panel", id: "maths-real-numbers", chapterId: 1, track: "maths",
    title: "Real Numbers", subtitle: "Maths · Ch 1",
    description: "Prime factorisation as a tree, Euclid's division algorithm as a staircase, and why √2 refuses to terminate. Click each region to explore CBSE Class 10 Maths Chapter 1.",
    accent: "#22d3ee", icon: "🔢",
    parts: [
      { id: "prime-tree", name: "Fundamental Theorem of Arithmetic", info: "Every composite number factors into primes in exactly one way (order aside) — which is why HCF × LCM = product of the two numbers: every prime is accounted for either in the shared HCF or spread across the LCM." },
      { id: "euclid-algorithm", name: "Euclid's Division Algorithm", info: "Repeatedly apply a = bq + r and replace (a,b) with (b,r) — the HCF never changes because any common factor of a and b must also divide r. Keep going until the remainder hits 0; the last non-zero remainder is the HCF." },
      { id: "irrational", name: "Proving √2 is Irrational", info: "Assume √2 = a/b in lowest terms. Squaring forces 2 to divide a², hence a, hence (working through the algebra) b too — contradicting 'lowest terms'. The same three-line argument proves √3, √5, √7 irrational too." },
    ],
    Panel: mkPanel("#22d3ee", "🔢 REAL NUMBERS", "Real Numbers", "Prime factors · Euclid's algorithm · irrational proofs", realNumbersRegions),
  },
  {
    kind: "panel", id: "maths-polynomials", chapterId: 2, track: "maths",
    title: "Polynomials", subtitle: "Maths · Ch 2",
    description: "Zeros as x-intercepts, a cubic's three crossings, and where the sum/product-of-roots formulas actually come from. Click each region to explore Chapter 2.",
    accent: "#38bdf8", icon: "📈",
    parts: [
      { id: "parabola-zeros", name: "Zeros = x-intercepts", info: "A zero of p(x) is algebraically where p(x)=0 and geometrically where the graph crosses the x-axis — the same fact told two ways, which is why you can count zeros just by reading the graph." },
      { id: "cubic", name: "Degree Bounds the Zero Count", info: "A polynomial of degree n has at most n real zeros — a cubic can cross the x-axis up to 3 times, a quadratic up to 2, matching the shape of the curve." },
      { id: "root-relations", name: "Sum & Product of Zeros", info: "For ax²+bx+c, sum of zeros = −b/a and product = c/a. These aren't arbitrary — expand k(x−α)(x−β) and match coefficients to ax²+bx+c and the formulas fall straight out." },
    ],
    Panel: mkPanel("#38bdf8", "📈 POLYNOMIALS", "Polynomials", "Zeros, graphs, and coefficient relationships", polynomialsRegions),
  },
  {
    kind: "panel", id: "maths-linear-equations", chapterId: 3, track: "maths",
    title: "Pair of Linear Equations in Two Variables", subtitle: "Maths · Ch 3",
    description: "Every pair of linear equations is two lines — and the three ways two lines can relate are the three possible outcomes. Click each region to explore Chapter 3.",
    accent: "#60a5fa", icon: "📐",
    parts: [
      { id: "unique", name: "Intersecting Lines — Unique Solution", info: "When a₁/a₂ ≠ b₁/b₂, the two lines cross at exactly one point — that single (x,y) is the unique solution to the system." },
      { id: "parallel", name: "Parallel Lines — No Solution", info: "When a₁/a₂ = b₁/b₂ ≠ c₁/c₂, the lines run side-by-side forever without meeting — no (x,y) satisfies both equations at once." },
      { id: "coincident", name: "Coincident Lines — Infinite Solutions", info: "When a₁/a₂ = b₁/b₂ = c₁/c₂, both equations describe the exact same line — every point on it satisfies both, giving infinitely many solutions." },
    ],
    Panel: mkPanel("#60a5fa", "📐 LINEAR EQUATIONS", "Pair of Linear Equations", "Intersecting, parallel & coincident lines", linearEquationsRegions),
  },
  {
    kind: "panel", id: "maths-quadratic-equations", chapterId: 4, track: "maths",
    title: "Quadratic Equations", subtitle: "Maths · Ch 4",
    description: "The discriminant's sign directly decides how many times the parabola touches the x-axis. Click each region to explore Chapter 4.",
    accent: "#818cf8", icon: "√",
    parts: [
      { id: "two-roots", name: "D > 0 — Two Real Roots", info: "A positive discriminant means the square root in the quadratic formula is a real number, giving two distinct roots — the parabola crosses the x-axis twice." },
      { id: "one-root", name: "D = 0 — One Repeated Root", info: "A zero discriminant means the square root vanishes entirely — the parabola just touches the x-axis at a single point, its vertex." },
      { id: "no-roots", name: "D < 0 — No Real Roots", info: "A negative discriminant means the square root of a negative number, which isn't a real number — the parabola never reaches the x-axis at all." },
    ],
    Panel: mkPanel("#818cf8", "√ QUADRATIC EQUATIONS", "Quadratic Equations", "The discriminant decides the shape", quadraticRegions),
  },
  {
    kind: "panel", id: "maths-arithmetic-progressions", chapterId: 5, track: "maths",
    title: "Arithmetic Progressions", subtitle: "Maths · Ch 5",
    description: "Constant difference, Gauss's pairing trick for the sum formula, and a real-world staircase pattern. Click each region to explore Chapter 5.",
    accent: "#a78bfa", icon: "➕",
    parts: [
      { id: "nth-term", name: "The nth Term Formula", info: "An AP is defined by one property: constant difference d between consecutive terms. The nth term aₙ = a + (n−1)d is just 'start at a and add d, n−1 times' — nothing more to memorise." },
      { id: "gauss-pairing", name: "The Sum Formula's Shortcut", info: "Pairing the first and last term, the second and second-last, and so on — each pair sums to (a+l), and there are n/2 such pairs. That's the trick young Gauss reportedly used to sum 1 to 100 instantly." },
      { id: "ap-application", name: "Real-World APs", info: "Any situation with a constant increase or decrease — rows of stadium seats growing by a fixed amount, savings growing by a fixed instalment — is an AP in disguise once you spot the constant difference." },
    ],
    Panel: mkPanel("#a78bfa", "➕ ARITHMETIC PROGRESSIONS", "Arithmetic Progressions", "Constant difference, sum formula, applications", apRegions),
  },
  {
    kind: "panel", id: "maths-triangles", chapterId: 6, track: "maths",
    title: "Triangles", subtitle: "Maths · Ch 6",
    description: "Similarity as congruence's flexible cousin, the Basic Proportionality Theorem, and why area scales by the square of the side ratio. Click each region to explore Chapter 6.",
    accent: "#34d399", icon: "🔺",
    parts: [
      { id: "similarity-bpt", name: "Basic Proportionality Theorem", info: "A line parallel to one side of a triangle divides the other two sides proportionally — because the small triangle cut off is similar to the whole triangle (same angles, since the line is parallel)." },
      { id: "similar-shapes", name: "Similar Triangles", info: "Similarity loosens congruence's 'exactly the same size' to 'exactly the same shape' — same angles, proportional sides. SSS/SAS/AA congruence criteria reappear here with 'equal sides' relaxed to 'proportional sides'." },
      { id: "area-ratio", name: "Area Ratio = (Side Ratio)²", info: "If every linear dimension scales by k, area scales by k×k = k² — the same reason doubling a photo's width and height quadruples its area, not doubles it." },
    ],
    Panel: mkPanel("#34d399", "🔺 TRIANGLES", "Triangles", "Similarity, BPT, and area scaling", trianglesRegions),
  },
  {
    kind: "panel", id: "maths-coordinate-geometry", chapterId: 7, track: "maths",
    title: "Coordinate Geometry", subtitle: "Maths · Ch 7",
    description: "The distance formula as Pythagoras in disguise, the section formula, and using area to test collinearity. Click each region to explore Chapter 7.",
    accent: "#2dd4bf", icon: "📍",
    parts: [
      { id: "distance-formula", name: "The Distance Formula", info: "Nothing more than the Pythagorean theorem applied to the horizontal and vertical gap between two points — draw the right triangle they make and the formula falls straight out." },
      { id: "section-formula", name: "The Section Formula", info: "Gives the coordinates of a point dividing a segment in a given ratio m:n. The midpoint formula is just this with the ratio locked at 1:1 — a special case, not a separate formula." },
      { id: "collinearity", name: "Area Test for Collinearity", info: "If three points are exactly on a line, the 'triangle' they form has zero area — setting the area formula to zero and solving is a fast way to test collinearity without computing slopes." },
    ],
    Panel: mkPanel("#2dd4bf", "📍 COORDINATE GEOMETRY", "Coordinate Geometry", "Distance, section formula, collinearity", coordGeoRegions),
  },
  {
    kind: "panel", id: "maths-trig-applications", chapterId: 8, track: "maths",
    title: "Some Applications of Trigonometry", subtitle: "Maths · Ch 8",
    description: "Turning heights-and-distances word problems into right triangles — elevation, a ladder, and a two-tower scenario. Click each region to explore Chapter 8.",
    accent: "#fbbf24", icon: "📏",
    parts: [
      { id: "elevation", name: "Angle of Elevation", info: "The angle between the horizontal line of sight and the line up to an object. Angle of elevation equals angle of depression by alternate interior angles — not a new rule, just parallel-line geometry." },
      { id: "ladder", name: "When the Hypotenuse Is Involved", info: "A slanted object like a ladder puts the hypotenuse in play, which usually means sin or cos rather than tan — drawing the triangle first shows you which ratio actually connects what's known to what's asked." },
      { id: "two-towers", name: "Two-Triangle Problems", info: "Two-observer or two-tower problems just mean two right triangles instead of one — set up a tan equation for each and combine by elimination, the same technique from the Linear Equations chapter." },
    ],
    Panel: mkPanel("#fbbf24", "📏 TRIGONOMETRY APPLICATIONS", "Applications of Trigonometry", "Elevation, depression, heights & distances", trigAppRegions),
  },
  {
    kind: "panel", id: "maths-circles", chapterId: 9, track: "maths",
    title: "Circles", subtitle: "Maths · Ch 9",
    description: "Why a tangent must be perpendicular to the radius, equal tangent lengths from an external point, and the cyclic quadrilateral hiding in the diagram. Click each region to explore Chapter 9.",
    accent: "#f472b6", icon: "⭕",
    parts: [
      { id: "tangent-perp", name: "Tangent ⊥ Radius", info: "If the tangent weren't perpendicular to the radius, it would necessarily cross the circle a second time nearby, making it a secant, not a tangent — perpendicularity is what 'touches at exactly one point' requires." },
      { id: "equal-tangents", name: "Two Tangents, Equal Length", info: "Both triangles formed by the centre, external point, and each contact point share the same hypotenuse and equal legs (both radii) — RHS congruence forces the two tangent lengths to be equal." },
      { id: "cyclic-quad", name: "The Hidden Cyclic Quadrilateral", info: "OAPB (centre, two contact points, external point) has two right angles, which automatically makes it cyclic — that's what connects the angle between the tangents to the angle at the centre." },
    ],
    Panel: mkPanel("#f472b6", "⭕ CIRCLES", "Circles", "Tangents, equal lengths, cyclic quadrilaterals", circlesRegions),
  },
  {
    kind: "panel", id: "maths-areas-related-to-circles", chapterId: 10, track: "maths",
    title: "Areas Related to Circles", subtitle: "Maths · Ch 10",
    description: "A sector as a fraction of the whole circle, a segment as sector-minus-triangle, and combined figures. Click each region to explore Chapter 10.",
    accent: "#fb923c", icon: "🥧",
    parts: [
      { id: "sector", name: "Sector = θ/360 of the Circle", info: "Every sector formula is the full-circle formula scaled by θ/360 — arc length and sector area share that exact factor because both ask 'what fraction of the whole circle is this?'" },
      { id: "segment", name: "Segment = Sector − Triangle", info: "A segment is what's left once you cut the triangle out of a sector, which is why segment problems always require computing both pieces separately before subtracting." },
      { id: "combined-figure", name: "Combined Figures", info: "Problems combining a sector with a rectangle or square aren't harder maths — they're testing whether you can decompose a complex shape into simple pieces you already know how to handle." },
    ],
    Panel: mkPanel("#fb923c", "🥧 AREAS RELATED TO CIRCLES", "Areas Related to Circles", "Sectors, segments, combined figures", areasCirclesRegions),
  },
  {
    kind: "panel", id: "maths-surface-areas-volumes", chapterId: 11, track: "maths",
    title: "Surface Areas and Volumes", subtitle: "Maths · Ch 11",
    description: "A cone-on-cylinder combined solid, why volume is conserved when recasting, and the Pythagorean origin of slant height. Click each region to explore Chapter 11.",
    accent: "#4ade80", icon: "🧊",
    parts: [
      { id: "combined-solid", name: "Combined Solids", info: "When two solids join (like a cone on a cylinder), the shared surface where they meet becomes internal and shouldn't be counted twice — surface area of a combination isn't just adding each solid's full surface area." },
      { id: "volume-conserved", name: "Volume Is Conserved on Recasting", info: "Melting a solid and recasting it into a new shape loses nothing — 'volume before = volume after' is the only equation recasting problems ever need, regardless of how different the two shapes look." },
      { id: "slant-height", name: "Slant Height = Pythagoras", info: "A cone's slant height l = √(r²+h²) is Pythagoras in disguise — unroll the cone's vertical cross-section and the radius, height, and slant height form a right triangle." },
    ],
    Panel: mkPanel("#4ade80", "🧊 SURFACE AREAS & VOLUMES", "Surface Areas and Volumes", "Combined solids, recasting, slant height", solidsRegions),
  },
  {
    kind: "panel", id: "maths-statistics", chapterId: 12, track: "maths",
    title: "Statistics", subtitle: "Maths · Ch 12",
    description: "A histogram, the ogive curve that reveals the median visually, and the empirical relation linking mean, median and mode. Click each region to explore Chapter 12.",
    accent: "#c084fc", icon: "📊",
    parts: [
      { id: "histogram", name: "Grouped Frequency Data", info: "Mean, median and mode for grouped data each make a different simplifying assumption to cope with data bucketed into class intervals rather than known exactly — the assumed-mean and step-deviation methods are algebra shortcuts on the same mean formula." },
      { id: "ogive", name: "Ogives and the Median", info: "The 'less than' and 'more than' cumulative frequency curves cross exactly where half the data lies on each side — which is, by definition, the median. It turns an abstract number into something you can see." },
      { id: "central-tendency", name: "The Empirical Relation", info: "3·Median = Mode + 2·Mean holds approximately for moderately skewed distributions — a useful cross-check: if the implied mode is wildly different from what you calculated directly, look for an arithmetic error." },
    ],
    Panel: mkPanel("#c084fc", "📊 STATISTICS", "Statistics", "Grouped data, ogives, central tendency", statsRegions),
  },
  {
    kind: "panel", id: "maths-probability", chapterId: 13, track: "maths",
    title: "Probability", subtitle: "Maths · Ch 13",
    description: "The two-dice sample space grid, a deck of cards, and why the complement rule is often the fastest route to an answer. Click each region to explore Chapter 13.",
    accent: "#f87171", icon: "🎲",
    parts: [
      { id: "dice-grid", name: "Classical Probability", info: "Favourable ÷ total only works because every outcome is assumed equally likely — a fair die's 36-outcome two-dice grid is the standard 'controlled sample space' precisely because it's easy to list exhaustively and provably fair." },
      { id: "cards", name: "The Standard Deck", info: "52 cards, 4 suits of 13, 12 face cards, 4 aces — once this structure is second nature, most exam questions become correctly identifying favourable outcomes within a sample space you already know cold." },
      { id: "complement", name: "The Complement Rule", info: "P(E) + P(not E) = 1 is often the fastest path to an answer because some events are far easier to count the opposite of — 'no heads in three tosses' is one case; 'at least one head' is several." },
    ],
    Panel: mkPanel("#f87171", "🎲 PROBABILITY", "Probability", "Sample spaces, cards, the complement rule", probabilityRegions),
  },
];
