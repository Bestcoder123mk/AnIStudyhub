// Mathematics track content — CBSE Class 10 (NCERT 2026-27 rationalised syllabus)
// 13 chapters · 40 MCQs · 20 short-answer QA · 10 long-answer QA · structured formula sheet
// All questions are ORIGINAL, written in the CBSE board-PATTERN style/difficulty.

export type MATHSDiff = "easy" | "medium" | "hard";

export interface MATHSChapter {
  id: number;
  num: string;
  title: string;
  subj: "maths";
  oneshot: string[];
  keypts: string[];
  formulas: string;
  exam: string[];
}

export interface MATHSMCQ {
  id: number;
  ch: number;
  subj: "maths";
  diff: MATHSDiff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface MATHSQA {
  id: number;
  ch: number;
  subj: "maths";
  marks: 2 | 3 | 4 | 5;
  q: string;
  a: string;
}

export interface MATHSFormulaItem {
  title: string;
  text: string;
  note: string;
}
export interface MATHSFormulaCat {
  cat: string;
  icon: string;
  formulas: MATHSFormulaItem[];
}
export interface MATHSFormulaData {
  cats: MATHSFormulaCat[];
}

// =================== CHAPTERS ===================
export const MATHS_CHAPTERS: MATHSChapter[] = [
  {
    id: 1,
    num: "Ch 1",
    title: "Real Numbers",
    subj: "maths",
    oneshot: [
      "Euclid's division lemma: a = bq + r, 0 ≤ r < b — basis for HCF & divisibility proofs.",
      "Fundamental Theorem of Arithmetic: every composite number is a unique product of primes (order aside).",
      "HCF(a,b) × LCM(a,b) = a × b — fastest two-number route.",
      "A rational p/q has a terminating decimal iff q's prime factors are only 2 and/or 5.",
    ],
    keypts: [
      "If p is prime and p | ab, then p | a or p | b (Euclid's lemma) — used to prove √2, √3, √5 irrational.",
      "To prove √p irrational: assume √p = a/b in lowest terms, then p | a ⇒ a = pk ⇒ b² = pk² ⇒ p | b, contradicting lowest terms.",
      "HCF by Euclid's algorithm: divide larger by smaller, repeat with remainder until remainder is 0; last divisor is HCF.",
      "LCM by prime factorisation: take the highest power of every prime appearing.",
      "Decimal expansion terminates for q = 2^m · 5^n; otherwise it is non-terminating recurring.",
      "Non-terminating recurring decimals arise from rationals whose denominator has a prime factor other than 2 or 5.",
    ],
    formulas:
      "Euclid's division lemma: a = b·q + r, 0 ≤ r < b\nHCF × LCM = a × b  (two numbers only)\nHCF(a,b) = last non-zero remainder in Euclid's algorithm\nLCM(a,b) = (a × b) / HCF(a,b)\nTerminating decimal ⟺ q = 2^m · 5^n (after simplifying p/q)\nNumber of trailing decimals = max(m, n)",
    exam: [
      "HCF & LCM word problems (bells tolling, tile dimensions) appear almost every year — always simplify to HCF for 'largest' and LCM for 'smallest/least'.",
      "Prove √2, √3, √5 irrational — memorise the contradiction template: assume a/b in lowest form, derive p divides both.",
      "Mnemonic 'T-wof-five' → Terminating when factors are Two or Five.",
    ],
  },
  {
    id: 2,
    num: "Ch 2",
    title: "Polynomials",
    subj: "maths",
    oneshot: [
      "Degree = highest power of the variable; quadratic = degree 2, cubic = degree 3.",
      "Geometric meaning of zeros: the x-intercepts of the graph y = p(x).",
      "For quadratic ax² + bx + c: sum of zeros = −b/a, product = c/a.",
      "If α, β are zeros of ax² + bx + c, then p(x) = k·(x − α)(x − β) = x² − (α+β)x + αβ.",
    ],
    keypts: [
      "Factor theorem: x − a is a factor of p(x) ⟺ p(a) = 0.",
      "Remainder theorem: dividing p(x) by (x − a) leaves remainder p(a).",
      "A polynomial of degree n has at most n zeros (counting multiplicity).",
      "Relation between zeros & coefficients extends to cubics: for ax³+bx²+cx+d with zeros α,β,γ: α+β+γ = −b/a, αβ+βγ+γα = c/a, αβγ = −d/a.",
      "Graph of a quadratic is a parabola; it crosses the x-axis at its real zeros (0, 1 or 2 of them).",
      "For division: dividend = divisor × quotient + remainder; degree of remainder < degree of divisor.",
    ],
    formulas:
      "Quadratic: ax² + bx + c,  a ≠ 0\nSum of zeros: α + β = −b/a\nProduct of zeros: αβ = c/a\nReconstructed polynomial: k[x² − (α+β)x + αβ]\nCubic ax³+bx²+cx+d, zeros α,β,γ:\n  α+β+γ = −b/a\n  αβ + βγ + γα = c/a\n  αβγ = −d/a\nRemainder: p(x) ÷ (x − a) ⟹ remainder = p(a)",
    exam: [
      "Board favourite: 'find zeros & verify relation between zeros and coefficients' — show α+β and αβ match the formula.",
      "If given zeros α, β, form polynomial as k(x−α)(x−β) and pick k=1 unless asked otherwise.",
      "Graph question: 'how many zeros?' — count the x-axis crossings only.",
    ],
  },
  {
    id: 3,
    num: "Ch 3",
    title: "Pair of Linear Equations in Two Variables",
    subj: "maths",
    oneshot: [
      "Standard form: a₁x + b₁y = c₁; a₂x + b₂y = c₂.",
      "Graphically: two lines — intersect (unique), parallel (no solution), coincident (infinite).",
      "Substitution: solve one for y, plug into the other.",
      "Elimination: multiply to match coefficients, then add/subtract to remove a variable.",
    ],
    keypts: [
      "Consistent & unique solution ⟺ a₁/a₂ ≠ b₁/b₂.",
      "Inconsistent (no solution) ⟺ a₁/a₂ = b₁/b₂ ≠ c₁/c₂.",
      "Dependent (infinitely many) ⟺ a₁/a₂ = b₁/b₂ = c₁/c₂.",
      "Cross-multiplication: x = (b₁c₂ − b₂c₁)/(a₁b₂ − a₂b₁), y = (c₁a₂ − c₂a₁)/(a₁b₂ − a₂b₁).",
      "Word problems: let variables = unknowns, form 2 equations from conditions, solve.",
      "Substitution works best when one coefficient is 1; elimination when coefficients are easy to match.",
    ],
    formulas:
      "System: a₁x + b₁y = c₁ ; a₂x + b₂y = c₂\nRatio test:\n  a₁/a₂ ≠ b₁/b₂  ⟹ unique solution (consistent)\n  a₁/a₂ = b₁/b₂ ≠ c₁/c₂  ⟹ no solution (inconsistent)\n  a₁/a₂ = b₁/b₂ = c₁/c₂  ⟹ infinitely many (dependent)\nCross-multiplication:\n  x = (b₁c₂ − b₂c₁) / (a₁b₂ − a₂b₁)\n  y = (c₁a₂ − c₂a₁) / (a₁b₂ − a₂b₁)",
    exam: [
      "Word problems: ages, two-digit numbers, fractions, speed-current — always define x & y explicitly before equations.",
      "For upstream/downstream: upstream speed = b − s, downstream = b + s (b = boat, s = stream).",
      "Decide 'consistent or not' just by ratio test — saves time over full solving.",
    ],
  },
  {
    id: 4,
    num: "Ch 4",
    title: "Quadratic Equations",
    subj: "maths",
    oneshot: [
      "Standard form: ax² + bx + c = 0, a ≠ 0.",
      "Roots: x = (−b ± √(b² − 4ac)) / 2a.",
      "Discriminant D = b² − 4ac decides nature: D>0 two distinct real, D=0 one repeated, D<0 no real roots.",
      "Factorisation: split middle term so product = ac and sum = b.",
    ],
    keypts: [
      "A quadratic has at most 2 roots; if D < 0 the parabola never touches the x-axis.",
      "Sum of roots = −b/a; product = c/a (same as polynomial zeros — it's the same idea).",
      "Factorisation method: find two numbers p, q with p+q = b and pq = ac; rewrite bx as px + qx.",
      "Completing the square: x² + bx → (x + b/2)² − (b/2)² — root of the quadratic formula.",
      "Word problem setup: 'k years ago/older/older than' → translate each clause into an equation in k or x.",
      "Always check roots back in the original equation; reject roots that don't fit the physical scenario (e.g. negative age).",
    ],
    formulas:
      "Standard form: ax² + bx + c = 0,  a ≠ 0\nQuadratic formula: x = (−b ± √D) / 2a\nDiscriminant: D = b² − 4ac\n  D > 0 ⟹ two distinct real roots\n  D = 0 ⟹ two equal real roots (x = −b/2a)\n  D < 0 ⟹ no real roots\nSum of roots: α + β = −b/a\nProduct of roots: αβ = c/a\nForming equation from roots: x² − (α+β)x + αβ = 0",
    exam: [
      "'Find k for equal roots' — set D = 0, solve for k (gives one value). For two distinct real roots set D > 0.",
      "Word problems: time/speed, area, product of consecutive integers — set up, solve, REJECT non-physical (negative/zero time).",
      "Mnemonic: 'B² minus 4-A-C' = Discriminant — chant it; missing the 4 is the #1 careless slip.",
    ],
  },
  {
    id: 5,
    num: "Ch 5",
    title: "Arithmetic Progressions",
    subj: "maths",
    oneshot: [
      "An AP has constant difference d between consecutive terms: a, a+d, a+2d, …",
      "nth term: aₙ = a + (n − 1)d.",
      "Sum of first n terms: Sₙ = (n/2)[2a + (n − 1)d] = (n/2)(a + l).",
      "If a, b, c are in AP then 2b = a + c.",
    ],
    keypts: [
      "First term a, common difference d, last term l = a + (n−1)d.",
      "aₙ − aₙ₋₁ = d for every n — the defining property.",
      "Three convenient forms of Sₙ: (n/2)[2a+(n−1)d] when a & d known; (n/2)(a+l) when first & last known.",
      "Three terms in AP: a−d, a, a+d (sum is 3a). Four terms: a−3d, a−d, a+d, a+3d.",
      "If Sₙ is given, the nth term = Sₙ − Sₙ₋₁.",
      "Word problems: instalments, ladders' rungs, rows of seats — translate 'increases by' as d, 'first' as a.",
    ],
    formulas:
      "nth term: aₙ = a + (n − 1)d\nCommon difference: d = aₙ − aₙ₋₁\nSum of n terms: Sₙ = (n/2)[2a + (n − 1)d]\n  alt: Sₙ = (n/2)(a + l)   [l = last term]\nLast term: l = a + (n − 1)d\nMean condition: a, b, c in AP ⟺ 2b = a + c\nnth term from S: aₙ = Sₙ − Sₙ₋₁",
    exam: [
      "When asked 'which term equals X', set a + (n−1)d = X and solve for n — must be a positive integer.",
      "For sum problems, decide whether you need Sₙ (sum) or aₙ (term); reading the question twice avoids 50% of slips.",
      "3-terms AP trick: assume (a−d, a, a+d) to keep the algebra clean — this alone saves minutes per question.",
    ],
  },
  {
    id: 6,
    num: "Ch 6",
    title: "Triangles",
    subj: "maths",
    oneshot: [
      "Similar triangles have equal corresponding angles and proportional sides (same shape, maybe different size).",
      "AA criterion: two pairs of equal angles ⟹ similar.",
      "Basic Proportionality Theorem (Thales): a line parallel to one side divides the other two sides proportionally.",
      "Areas of similar triangles ratio = square of ratio of corresponding sides.",
    ],
    keypts: [
      "Congruent ⟹ similar, but similar ⇏ congruent (unless ratio = 1).",
      "Criteria: AA, SSS (sides proportional), SAS (two sides proportional & included angle equal).",
      "BPT: in ΔABC, if DE ∥ BC then AD/DB = AE/EC (and AD/AB = AE/AC).",
      "Converse of BPT: if a line divides two sides proportionally, it is parallel to the third side.",
      "If ΔABC ~ ΔPQR with ratio k, then (perimeter ratio) = k, (area ratio) = k².",
      "Pythagoras is a special case of similarity — derived from the altitude-on-hypotenuse construction.",
    ],
    formulas:
      "Similarity ratio k = AB/PQ = BC/QR = CA/RP\nPerimeter ratio = k\nArea ratio = k²\nAltitude ratio = k   (similar figures)\nBPT (DE ∥ BC in ΔABC): AD/DB = AE/EC ; AD/AB = AE/AC\nPythagoras: AC² = AB² + BC²\nPythagorean triple (example): 3, 4, 5  →  6, 8, 10  →  9, 12, 15",
    exam: [
      "When a diagram has DE ∥ BC, immediately write the BPT proportion — that's 1 mark in the bag.",
      "Area-ratio questions: square the side ratio FIRST, then plug numbers — students forget to square 80% of the time.",
      "For 'prove similar' questions: state angle equality → AA → similar; then write the side ratio.",
    ],
  },
  {
    id: 7,
    num: "Ch 7",
    title: "Coordinate Geometry",
    subj: "maths",
    oneshot: [
      "Distance between (x₁,y₁) and (x₂,y₂): √[(x₂−x₁)² + (y₂−y₁)²].",
      "Section formula (m:n): ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)).",
      "Midpoint = section formula with m = n = 1.",
      "Area of triangle with vertices (x₁,y₁),(x₂,y₂),(x₃,y₃): ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|.",
    ],
    keypts: [
      "Points on the x-axis have y=0; points on the y-axis have x=0.",
      "Three points are collinear ⟺ area of triangle formed by them is 0.",
      "Internal division uses +; external division uses − in the section formula.",
      "To check collinearity: either area = 0, or slope(PQ) = slope(QR).",
      "Centroid of a triangle = average of vertices: ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3).",
      "Distance from a point to the x-axis = |y|; to the y-axis = |x|.",
    ],
    formulas:
      "Distance: d = √[(x₂ − x₁)² + (y₂ − y₁)²]\nSection (m:n internal): P = ((m·x₂ + n·x₁)/(m+n), (m·y₂ + n·y₁)/(m+n))\nMidpoint: M = ((x₁+x₂)/2, (y₁+y₂)/2)\nCentroid: G = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3)\nArea of Δ: A = ½ |x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|\nCollinearity: A = 0",
    exam: [
      "For 'find k so the points are collinear', set the area determinant = 0 and solve for k — quick and clean.",
      "Section-formula word problems: ratio given → use m:n. Midpoint → use m=n=1.",
      "When checking 'type of triangle' (isoceles/equilateral/right), compute all 3 sides first, then compare.",
    ],
  },
  {
    id: 8,
    num: "Ch 8",
    title: "Some Applications of Trigonometry",
    subj: "maths",
    oneshot: [
      "Line of sight: from eye to viewed object. Angle of elevation: above horizontal. Angle of depression: below horizontal.",
      "Heights & distances: pick a right triangle, label sides (opp/adj/hyp), use the right trig ratio.",
      "Angle of depression from top = angle of elevation from ground (alternate interior angles).",
      "Mostly tan θ (height/distance), sin θ (height/hypotenuse like a ladder/slant).",
    ],
    keypts: [
      "Always draw the diagram: vertical object, horizontal ground, line of sight, marked angle.",
      "tan θ = (opposite)/(adjacent) — the workhorse for 'height at a distance'.",
      "If a ladder/slant is involved, sin or cos often appears (hypotenuse = ladder length).",
      "Two-observer problems: each observer forms a separate triangle; the object's height is shared.",
      "Square-root answers must be simplified: √3 ≈ 1.732, √2 ≈ 1.414, √5 ≈ 2.236.",
      "Bank/river problems: width = distance along the ground; towers/banks on opposite sides use two right triangles sharing the same width.",
    ],
    formulas:
      "Ratios (right Δ, θ at base):\n  sin θ = opp/hyp\n  cos θ = adj/hyp\n  tan θ = opp/adj = height/base\nStandard values:\n  sin 30° = 1/2 ;  cos 30° = √3/2 ;  tan 30° = 1/√3\n  sin 45° = 1/√2 ; cos 45° = 1/√2 ; tan 45° = 1\n  sin 60° = √3/2 ; cos 60° = 1/2 ;  tan 60° = √3\nAngle of elevation ∠ = angle of depression (alternate interior)\nheight = base · tan θ ; base = height / tan θ",
    exam: [
      "Always start heights-distances by drawing & labelling — examiners award a mark for the correct diagram alone.",
      "Two triangles (e.g. tower observed from two points): set up tan for each, subtract to eliminate the unknown.",
      "Rationalise 1/√3 = √3/3 to avoid messy fractions; final answers usually want √3 form, not decimals.",
    ],
  },
  {
    id: 9,
    num: "Ch 9",
    title: "Circles",
    subj: "maths",
    oneshot: [
      "Tangent touches the circle at exactly one point; the radius to the point of contact is ⟂ to the tangent.",
      "Lengths of two tangents drawn from an external point are equal.",
      "A tangent is the limiting case of a secant whose two intersection points coincide.",
      "Number of tangents: 0 (interior point), 1 (on circle), 2 (exterior point).",
    ],
    keypts: [
      "Theorem 10.1: the tangent at any point is perpendicular to the radius through that point (proof by contradiction: if not ⟂, the line would meet the circle twice, contradicting 'tangent').",
      "Theorem 10.2: lengths of tangents from an external point P are equal — proof uses congruent right triangles (radii equal + common hypotenuse OP).",
      "Parallel tangents to a circle can be at most 2; their points of contact are diametrically opposite.",
      "Angle between two tangents from P and the angle subtended at the centre O: ∠APB + ∠AOB = 180°.",
      "If PA and PB are tangents and O is the centre, then OP bisects ∠APB and ∠AOB.",
      "Sector/segment: not part of Ch 9 (those are Ch 11 'Areas Related to Circles').",
    ],
    formulas:
      "Tangent ⟂ radius:  OT ⟂ PT  (T = point of contact)\nEqual tangents:  PA = PB  (P external, A & B on circle)\nIn quadrilateral OAPB: ∠OAP = ∠OBP = 90°, so OAPB is cyclic\n∠APB + ∠AOB = 180°\nOP bisects ∠APB and ∠AOB\nDistance d from centre to external point P:\n  tangent length = √(d² − r²)",
    exam: [
      "Repeated theorem: 'Prove lengths of tangents from an external point are equal' — quote both right triangles OAP and OBP (hypotenuse OP common, OA = OB radii ⇒ RHS).",
      "Quadrilateral OAPB has two right angles ⇒ cyclic ⇒ use ∠APB + ∠AOB = 180° for angle problems.",
      "If given ∠APB, find ∠AOB = 180° − ∠APB, then half it to get the angle at the centre from one radius.",
    ],
  },
  {
    id: 10,
    num: "Ch 10",
    title: "Area Related to Circles",
    subj: "maths",
    oneshot: [
      "Circumference = 2πr; area of circle = πr².",
      "Length of arc (angle θ°) = (θ/360) · 2πr.",
      "Area of sector = (θ/360) · πr² = ½·r·l where l = arc length.",
      "Area of segment = area of sector − area of triangle (½·r²·sin θ).",
    ],
    keypts: [
      "Use π = 22/7 unless told otherwise; switch to 3.14 only if the question asks for decimals.",
      "Minor segment area = sector area − Δ area; major segment = πr² − minor segment.",
      "For sector with central angle θ, area fraction = θ/360 (a full circle is 360°).",
      "Area of the triangle inside a sector with radii r and angle θ: ½·r²·sin θ (or use ½·base·height if θ is a standard angle).",
      "When θ = 90°, Δ area = ½r² (right-angled isosceles). When θ = 60°, Δ is equilateral: ½·r·(r sin60) = (√3/4)·(side)² only if both radii equal r — actually Δ = ½·r·(r sin 60°).",
      "Combined shapes: total area = sum of sectors + triangles — break into pieces and label each.",
    ],
    formulas:
      "Circumference: C = 2πr\nArea: A = πr²\nArc length (θ°): l = (θ/360)·2πr\nSector area: A_sector = (θ/360)·πr² = ½·r·l\nSegment area: A_seg = A_sector − A_triangle\nTriangle in sector: A_Δ = ½·r²·sin θ\nPerimeter of sector: P = 2r + l\nAnnulus (ring): A = π(R² − r²)",
    exam: [
      "Watch the wording: 'area of segment' vs 'area of sector' — students mix these up under exam pressure.",
      "Perimeter of a sector = arc length + TWO radii (the 2r is forgotten 60% of the time).",
      "Combined figures (sector + rectangle, etc.): compute each part separately, then add or subtract as the question asks.",
    ],
  },
  {
    id: 11,
    num: "Ch 11",
    title: "Surface Areas and Volumes",
    subj: "maths",
    oneshot: [
      "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h.",
      "Cone: CSA = πrl, TSA = πr(l+r), V = (1/3)πr²h, l = √(r²+h²).",
      "Sphere: SA = 4πr², V = (4/3)πr³.",
      "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³.",
    ],
    keypts: [
      "Slant height of cone l = √(r² + h²) — connect it to Pythagoras.",
      "Volume ratio when shapes are combined/melted: volume is conserved — set V₁ = V₂.",
      "Conversion: 1 litre = 1000 cm³ = 1000 mL. Watch units carefully.",
      "Hollow cylinder (pipe): V = πh(R² − r²); CSA = 2πh(R + r) — outer + inner curved surface.",
      "Frustum (NOT in 2026-27 syllabus — skip frustum problems).",
      "When a solid is recast (melted & poured): the new shape's volume EQUALS the old shape's volume.",
    ],
    formulas:
      "Cylinder (r, h):  CSA = 2πrh ;  TSA = 2πr(r+h) ;  V = πr²h\nCone (r, h, l):  l = √(r²+h²) ;  CSA = πrl ;  TSA = πr(l+r) ;  V = (1/3)πr²h\nSphere (r):  SA = 4πr² ;  V = (4/3)πr³\nHemisphere (r):  CSA = 2πr² ;  TSA = 3πr² ;  V = (2/3)πr³\nHollow cylinder: V = πh(R² − r²)\nConversion: 1 L = 1000 cm³ = 1000 mL",
    exam: [
      "'Recast/melted' problems: equate volumes; don't try to compare surface areas (they change non-trivially).",
      "For a cone, ALWAYS verify l = √(r²+h²) before using πrl — a missing slant height is the most common error.",
      "Surface-area-of-combination: don't double-count the hidden base. Subtract the common circle's area from each piece.",
    ],
  },
  {
    id: 12,
    num: "Ch 12",
    title: "Statistics",
    subj: "maths",
    oneshot: [
      "Mean: direct, assumed-mean (σfd/a + a), step-deviation (σfu·h/a + a) for grouped data.",
      "Mode of grouped data: l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] · h.",
      "Median of grouped data: l + [(n/2 − cf)/f] · h.",
      "Cumulative frequency table is needed for median; 'more than' / 'less than' ogives meet at the median.",
    ],
    keypts: [
      "Choose the right method: small class size & few classes → direct; large values → assumed-mean; equal widths → step-deviation.",
      "h = class width = upper limit − lower limit. fᵢ = frequency of the modal/median class.",
      "Modal class = class with the highest frequency; median class = class where cumulative frequency first crosses n/2.",
      "For ungrouped data, median = middle value of the sorted list (avg of two middle values if n is even).",
      "Empirical relation: 3·Median = Mode + 2·Mean — gives one if two are known.",
      "Ogive: cumulative-frequency curve; 'less than' type rises, 'more than' type falls; their intersection is the median.",
    ],
    formulas:
      "Mean (direct): x̄ = Σfᵢxᵢ / Σfᵢ\nMean (assumed mean a): x̄ = a + (Σfᵢdᵢ / Σfᵢ),  dᵢ = xᵢ − a\nMean (step-deviation): x̄ = a + (Σfᵢuᵢ / Σfᵢ) · h,  uᵢ = (xᵢ − a)/h\nMode: Mode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] · h\nMedian: Median = l + [ (n/2 − cf) / f ] · h\nEmpirical: 3·Median = Mode + 2·Mean\nh = class size, l = lower limit of modal/median class",
    exam: [
      "Statistics questions are LONG — keep your working in a tidy table; a clean table is worth 2 marks on its own.",
      "If mode and mean are both asked, compute mean first (additive work), then use 3 Median = Mode + 2 Mean as a cross-check.",
      "For median of grouped data, ALWAYS write the cumulative frequency column first — you can't proceed without it.",
    ],
  },
  {
    id: 13,
    num: "Ch 13",
    title: "Probability",
    subj: "maths",
    oneshot: [
      "P(E) = (favourable outcomes) / (total outcomes), with 0 ≤ P ≤ 1.",
      "P(E) + P(not E) = 1 — complement rule.",
      "Sample space = all possible outcomes; an event = a subset of the sample space.",
      "Classical probability assumes equally likely outcomes — the basis of every Class 10 problem.",
    ],
    keypts: [
      "Sure event has P = 1; impossible event has P = 0; an event with P = 0.5 is as likely as not.",
      "Sum of probabilities of all elementary events = 1.",
      "Impossible vs sure: 'sun rises tomorrow' (≈1) vs 'a 7 on a standard die' (=0).",
      "Deck of cards: 52 total, 4 suits × 13 each; face cards = 12 (J, Q, K of each suit); aces = 4.",
      "Two-die sample space has 36 outcomes; pairs (a, b) with 1 ≤ a, b ≤ 6.",
      "Tossing 3 coins: 8 outcomes (HHH, HHT, HTH, HTT, THH, THT, TTH, TTT).",
    ],
    formulas:
      "P(E) = n(E) / n(S)\nP(E) + P(É) = 1  (É = complement)\nRange: 0 ≤ P(E) ≤ 1\nSum of all elementary P = 1\nDeck of 52: 4 suits × 13 cards; 12 face cards; 4 aces; 26 red; 26 black\nTwo dice: 36 ordered pairs\nThree coins: 8 outcomes\nClassical assumption: outcomes equally likely",
    exam: [
      "Always state n(S) and n(E) explicitly before writing the fraction — the step earns method marks even with arithmetic slips.",
      "For deck-of-cards questions, recall the 4-13-12-4 split; 'a face card or an ace' = (12+4)/52 = 4/13.",
      "Two-die problems: list a few sample pairs OR use the 6×6 grid — never assume symmetric patterns without listing.",
    ],
  },
];

// =================== MCQs ===================
// 40 board-style MCQs across 13 chapters (3-4 per chapter)
export const MATHS_MCQS: MATHSMCQ[] = [
  // Ch 1 — Real Numbers
  {
    id: 1, ch: 1, subj: "maths", diff: "easy",
    q: "The decimal expansion of 17/8 is:",
    opts: ["non-terminating recurring", "terminating after 3 places", "terminating after 2 places", "non-terminating non-recurring"],
    ans: 1,
    exp: "8 = 2³. Denominator's only prime factor is 2 ⇒ terminating. 17/8 = 2.125 ⇒ exactly 3 decimal places.",
  },
  {
    id: 2, ch: 1, subj: "maths", diff: "medium",
    q: "If HCF(96, 404) = 4, then LCM(96, 404) is:",
    opts: ["9696", "9896", "9796", "9640"],
    ans: 0,
    exp: "HCF × LCM = a × b ⇒ 4 × LCM = 96 × 404 = 38784 ⇒ LCM = 9696.",
  },
  {
    id: 3, ch: 1, subj: "maths", diff: "medium",
    q: "Assertion (A): √5 is an irrational number. Reason (R): The square root of any prime is irrational.",
    opts: ["Both A and R true, R is the correct explanation of A", "Both A and R true, R is NOT the correct explanation", "A true, R false", "A false, R true"],
    ans: 0,
    exp: "R is a true general theorem and directly implies A; both hold with R explaining A.",
  },
  {
    id: 4, ch: 1, subj: "maths", diff: "easy",
    q: "The prime factorisation of 140 is:",
    opts: ["2² × 5 × 7", "2 × 5 × 7", "2² × 7", "2 × 5² × 7"],
    ans: 0,
    exp: "140 = 4 × 35 = 2² × 5 × 7. Verified: 4·5·7 = 140.",
  },

  // Ch 2 — Polynomials
  {
    id: 5, ch: 2, subj: "maths", diff: "easy",
    q: "If α and β are the zeros of p(x) = x² − 5x + 6, then α + β equals:",
    opts: ["5", "6", "−5", "−6"],
    ans: 0,
    exp: "Sum of zeros = −b/a = −(−5)/1 = 5.",
  },
  {
    id: 6, ch: 2, subj: "maths", diff: "medium",
    q: "The zeros of p(x) = x² − 7x + 12 are:",
    opts: ["3 and 4", "−3 and −4", "3 and −4", "−3 and 4"],
    ans: 0,
    exp: "Factor: x² − 7x + 12 = (x − 3)(x − 4). Zeros are 3 and 4.",
  },
  {
    id: 7, ch: 2, subj: "maths", diff: "medium",
    q: "If x − 2 is a factor of x³ − 3x² + kx + 10, then k =",
    opts: ["−3", "3", "−10", "10"],
    ans: 0,
    exp: "By factor theorem p(2) = 0: 8 − 12 + 2k + 10 = 0 ⇒ 6 + 2k = 0 ⇒ k = −3.",
  },

  // Ch 3 — Pair of Linear Equations
  {
    id: 8, ch: 3, subj: "maths", diff: "easy",
    q: "The pair 2x + 3y = 8 and 4x + 6y = 16 has:",
    opts: ["unique solution", "no solution", "infinitely many solutions", "exactly two solutions"],
    ans: 2,
    exp: "Ratios: 2/4 = 3/6 = 8/16 = 1/2 ⇒ coincident lines ⇒ infinitely many solutions.",
  },
  {
    id: 9, ch: 3, subj: "maths", diff: "medium",
    q: "The solution of x + y = 7 and x − y = 3 is:",
    opts: ["(5, 2)", "(2, 5)", "(4, 3)", "(3, 4)"],
    ans: 0,
    exp: "Adding: 2x = 10 ⇒ x = 5. Then y = 7 − 5 = 2. Solution (5, 2).",
  },
  {
    id: 10, ch: 3, subj: "maths", diff: "hard",
    q: "For what value of k does the pair kx + 3y = k − 3 and 12x + ky = k have no solution?",
    opts: ["k = 6", "k = −6", "k = 0", "k = 3"],
    ans: 1,
    exp: "No solution needs k/12 = 3/k ≠ (k−3)/k. From k/12 = 3/k ⇒ k² = 36 ⇒ k = ±6. Test k = 6: all three ratios equal (coincident). Test k = −6: −6/12 = 3/−6 = −1/2 but (k−3)/k = −9/−6 = 3/2 ≠ −1/2 ⇒ no solution ⇒ k = −6.",
  },

  // Ch 4 — Quadratic Equations
  {
    id: 11, ch: 4, subj: "maths", diff: "easy",
    q: "The roots of x² − 6x + 8 = 0 are:",
    opts: ["2 and 4", "−2 and −4", "1 and 8", "−1 and −8"],
    ans: 0,
    exp: "(x−2)(x−4) = 0 ⇒ x = 2 or 4.",
  },
  {
    id: 12, ch: 4, subj: "maths", diff: "medium",
    q: "The discriminant of 2x² − 4x + 3 = 0 is:",
    opts: ["−8", "8", "16", "−16"],
    ans: 0,
    exp: "D = b² − 4ac = (−4)² − 4·2·3 = 16 − 24 = −8.",
  },
  {
    id: 13, ch: 4, subj: "maths", diff: "medium",
    q: "For what value of k does kx² − 6x + 1 = 0 have equal roots?",
    opts: ["9", "6", "3", "12"],
    ans: 0,
    exp: "Equal roots ⟺ D = 0 ⇒ 36 − 4k = 0 ⇒ k = 9.",
  },
  {
    id: 14, ch: 4, subj: "maths", diff: "hard",
    q: "Assertion (A): The equation x² + 1 = 0 has no real roots. Reason (R): The discriminant is negative.",
    opts: ["Both A and R true, R is the correct explanation of A", "Both A and R true, R is NOT the correct explanation", "A true, R false", "A false, R true"],
    ans: 0,
    exp: "D = 0 − 4·1·1 = −4 < 0 ⇒ no real roots. R explains A.",
  },

  // Ch 5 — AP
  {
    id: 15, ch: 5, subj: "maths", diff: "easy",
    q: "The 10th term of the AP 3, 7, 11, 15, … is:",
    opts: ["39", "43", "40", "37"],
    ans: 0,
    exp: "a = 3, d = 4. a₁₀ = 3 + 9·4 = 39.",
  },
  {
    id: 16, ch: 5, subj: "maths", diff: "medium",
    q: "The sum of the first 20 terms of the AP 5, 8, 11, … is:",
    opts: ["670", "770", "570", "870"],
    ans: 0,
    exp: "Sₙ = (n/2)[2a + (n−1)d] = 10·[10 + 19·3] = 10·67 = 670.",
  },
  {
    id: 17, ch: 5, subj: "maths", diff: "medium",
    q: "Which term of the AP 2, 7, 12, … is 92?",
    opts: ["19th", "20th", "21st", "18th"],
    ans: 0,
    exp: "a + (n−1)d = 92 ⇒ 2 + 5(n−1) = 92 ⇒ 5(n−1) = 90 ⇒ n = 19.",
  },

  // Ch 6 — Triangles
  {
    id: 18, ch: 6, subj: "maths", diff: "easy",
    q: "In ΔABC, if DE ∥ BC and AD/DB = 1/2, then AE/EC equals:",
    opts: ["1/2", "2/1", "3/2", "1/3"],
    ans: 0,
    exp: "By BPT, AD/DB = AE/EC. So AE/EC = 1/2.",
  },
  {
    id: 19, ch: 6, subj: "maths", diff: "medium",
    q: "If two similar triangles have sides in the ratio 3:5, the ratio of their areas is:",
    opts: ["3:5", "9:25", "9:15", "27:125"],
    ans: 1,
    exp: "Area ratio = (side ratio)² = 3²:5² = 9:25.",
  },
  {
    id: 20, ch: 6, subj: "maths", diff: "hard",
    q: "Assertion (A): All equilateral triangles are similar. Reason (R): All equilateral triangles have all angles equal to 60°.",
    opts: ["Both A and R true, R is the correct explanation of A", "Both A and R true, R is NOT the correct explanation", "A true, R false", "A false, R true"],
    ans: 0,
    exp: "All equilateral triangles have angles 60° each ⇒ AA criterion ⇒ similar. R explains A.",
  },

  // Ch 7 — Coordinate Geometry
  {
    id: 21, ch: 7, subj: "maths", diff: "easy",
    q: "The distance between the points (3, 4) and (0, 0) is:",
    opts: ["5", "7", "25", "1"],
    ans: 0,
    exp: "d = √(3² + 4²) = √25 = 5.",
  },
  {
    id: 22, ch: 7, subj: "maths", diff: "medium",
    q: "The midpoint of the segment joining (−2, 3) and (4, 5) is:",
    opts: ["(1, 4)", "(2, 8)", "(3, 1)", "(1, 1)"],
    ans: 0,
    exp: "Midpoint = ((−2+4)/2, (3+5)/2) = (1, 4).",
  },
  {
    id: 23, ch: 7, subj: "maths", diff: "hard",
    q: "If the points A(2, 3), B(4, k), C(6, 7) are collinear, then k =",
    opts: ["5", "4", "6", "3"],
    ans: 0,
    exp: "Area = 0: |2(k−7) + 4(7−3) + 6(3−k)| = 0 ⇒ 2k − 14 + 16 + 18 − 6k = 0 ⇒ −4k + 20 = 0 ⇒ k = 5.",
  },

  // Ch 8 — Trig Applications
  {
    id: 24, ch: 8, subj: "maths", diff: "easy",
    q: "If the angle of elevation of the top of a 10 m tower from a point on the ground is 45°, the distance of the point from the foot of the tower is:",
    opts: ["10 m", "10√2 m", "10/√2 m", "5 m"],
    ans: 0,
    exp: "tan 45° = h/d = 1 ⇒ d = h = 10 m.",
  },
  {
    id: 25, ch: 8, subj: "maths", diff: "medium",
    q: "A ladder 10 m long leans against a wall making 60° with the ground. The height reached on the wall is:",
    opts: ["5 m", "5√3 m", "10 m", "10√3 m"],
    ans: 1,
    exp: "sin 60° = h/10 ⇒ h = 10·(√3/2) = 5√3 m.",
  },
  {
    id: 26, ch: 8, subj: "maths", diff: "hard",
    q: "From the top of a 30 m tall tower, the angle of depression of an object on the ground is 60°. The object's distance from the foot of the tower is:",
    opts: ["10 m", "10√3 m", "30 m", "30√3 m"],
    ans: 1,
    exp: "tan 60° = 30/d ⇒ d = 30/√3 = 10√3 m.",
  },

  // Ch 9 — Circles
  {
    id: 27, ch: 9, subj: "maths", diff: "easy",
    q: "The number of tangents that can be drawn from a point lying inside a circle is:",
    opts: ["0", "1", "2", "infinite"],
    ans: 0,
    exp: "A point inside a circle has no tangent to it (a tangent requires the line to touch the circle from outside).",
  },
  {
    id: 28, ch: 9, subj: "maths", diff: "medium",
    q: "The length of the tangent from a point 13 cm away from the centre of a circle of radius 5 cm is:",
    opts: ["12 cm", "8 cm", "18 cm", "10 cm"],
    ans: 0,
    exp: "t = √(d² − r²) = √(169 − 25) = √144 = 12 cm.",
  },
  {
    id: 29, ch: 9, subj: "maths", diff: "medium",
    q: "If two tangents from an external point P make an angle of 60° between them, the angle subtended by them at the centre O is:",
    opts: ["120°", "60°", "90°", "150°"],
    ans: 0,
    exp: "∠APB + ∠AOB = 180° ⇒ ∠AOB = 180° − 60° = 120°.",
  },

  // Ch 10 — Area Related to Circles
  {
    id: 30, ch: 10, subj: "maths", diff: "easy",
    q: "The area of a sector of a circle of radius 7 cm with central angle 90° (π = 22/7) is:",
    opts: ["38.5 cm²", "77 cm²", "49 cm²", "154 cm²"],
    ans: 0,
    exp: "A = (90/360)·(22/7)·49 = (1/4)·154 = 38.5 cm².",
  },
  {
    id: 31, ch: 10, subj: "maths", diff: "medium",
    q: "The length of an arc of a circle of radius 14 cm subtending 60° at the centre (π = 22/7) is:",
    opts: ["14.67 cm", "29.33 cm", "44 cm", "7.33 cm"],
    ans: 0,
    exp: "l = (60/360)·2·(22/7)·14 = (1/6)·88 = 14.67 cm.",
  },
  {
    id: 32, ch: 10, subj: "maths", diff: "hard",
    q: "The area of the minor segment of a circle of radius 14 cm when the central angle is 90° (π = 22/7) is:",
    opts: ["56 cm²", "28 cm²", "112 cm²", "154 cm²"],
    ans: 0,
    exp: "Sector = (1/4)·(22/7)·196 = 154 cm². Triangle = (1/2)·14·14 = 98 cm². Segment = 154 − 98 = 56 cm².",
  },

  // Ch 11 — Surface Areas and Volumes
  {
    id: 33, ch: 11, subj: "maths", diff: "easy",
    q: "The volume of a cylinder of radius 7 cm and height 10 cm (π = 22/7) is:",
    opts: ["1540 cm³", "770 cm³", "440 cm³", "220 cm³"],
    ans: 0,
    exp: "V = πr²h = (22/7)·49·10 = 1540 cm³.",
  },
  {
    id: 34, ch: 11, subj: "maths", diff: "medium",
    q: "The slant height of a cone with radius 3 cm and height 4 cm is:",
    opts: ["5 cm", "7 cm", "1 cm", "12 cm"],
    ans: 0,
    exp: "l = √(r² + h²) = √(9 + 16) = √25 = 5 cm.",
  },
  {
    id: 35, ch: 11, subj: "maths", diff: "hard",
    q: "A sphere of radius r is melted and recast into 8 identical small spheres. The radius of each small sphere is:",
    opts: ["r/2", "r/4", "r/8", "2r"],
    ans: 0,
    exp: "Volume conserved: 8·(4/3)πR³ = (4/3)πr³ ⇒ 8R³ = r³ ⇒ R = r/2.",
  },

  // Ch 12 — Statistics
  {
    id: 36, ch: 12, subj: "maths", diff: "easy",
    q: "The mean of 5, 10, 15, 20, 25 is:",
    opts: ["15", "10", "20", "12.5"],
    ans: 0,
    exp: "(5+10+15+20+25)/5 = 75/5 = 15.",
  },
  {
    id: 37, ch: 12, subj: "maths", diff: "medium",
    q: "For a distribution with mean = 27 and mode = 21, the median (using the empirical relation) is:",
    opts: ["25", "24", "23", "26"],
    ans: 0,
    exp: "3·Median = Mode + 2·Mean = 21 + 54 = 75 ⇒ Median = 75/3 = 25.",
  },
  {
    id: 38, ch: 12, subj: "maths", diff: "hard",
    q: "In a frequency distribution, the modal class is the class with the:",
    opts: ["highest frequency", "highest cumulative frequency", "median cumulative frequency", "lowest frequency"],
    ans: 0,
    exp: "Modal class = class interval with the highest frequency (most observations).",
  },

  // Ch 13 — Probability
  {
    id: 39, ch: 13, subj: "maths", diff: "easy",
    q: "A die is thrown once. The probability of getting an even number is:",
    opts: ["1/2", "1/3", "1/6", "2/3"],
    ans: 0,
    exp: "Even outcomes: {2,4,6} of 6 ⇒ 3/6 = 1/2.",
  },
  {
    id: 40, ch: 13, subj: "maths", diff: "medium",
    q: "One card is drawn from a well-shuffled deck of 52. The probability of getting a face card is:",
    opts: ["3/13", "1/4", "1/13", "4/13"],
    ans: 0,
    exp: "Face cards = 12 (J, Q, K in 4 suits) ⇒ P = 12/52 = 3/13.",
  },
];

// =================== SHORT QA (2-3 marks) ===================
export const MATHS_SHORT_QA: MATHSQA[] = [
  {
    id: 101, ch: 1, subj: "maths", marks: 2,
    q: "Use Euclid's division algorithm to find the HCF of 135 and 225.",
    a: "Step 1: 225 = 135 × 1 + 90\nStep 2: 135 = 90 × 1 + 45\nStep 3: 90 = 45 × 2 + 0\nThe last non-zero remainder is 45.\n∴ HCF(135, 225) = 45.",
  },
  {
    id: 102, ch: 1, subj: "maths", marks: 2,
    q: "Show that any positive odd integer is of the form 6q+1, 6q+3 or 6q+5, where q is some integer.",
    a: "By Euclid's lemma, let a = 6q + r with 0 ≤ r < 6. So r ∈ {0,1,2,3,4,5}.\nEven forms: 6q (r=0), 6q+2 (r=2), 6q+4 (r=4) — all divisible by 2.\nOdd forms: 6q+1, 6q+3, 6q+5 — none divisible by 2.\nHence every positive odd integer is of the form 6q+1, 6q+3, or 6q+5.",
  },
  {
    id: 103, ch: 2, subj: "maths", marks: 2,
    q: "Find the zeros of the quadratic polynomial p(x) = x² − 2x − 8 and verify the relation between zeros and coefficients.",
    a: "p(x) = x² − 2x − 8 = (x − 4)(x + 2)\nZeros: α = 4, β = −2.\nVerification:\nSum: α + β = 4 + (−2) = 2 = −b/a = −(−2)/1 = 2 ✓\nProduct: αβ = 4·(−2) = −8 = c/a = −8/1 = −8 ✓",
  },
  {
    id: 104, ch: 2, subj: "maths", marks: 3,
    q: "Find a quadratic polynomial whose zeros are 2 + √3 and 2 − √3.",
    a: "Sum: α + β = (2+√3) + (2−√3) = 4\nProduct: αβ = (2+√3)(2−√3) = 4 − 3 = 1\nThe required polynomial is\nx² − (α+β)x + αβ = x² − 4x + 1.\n(Any non-zero multiple is acceptable; k=1 is the standard answer.)",
  },
  {
    id: 105, ch: 3, subj: "maths", marks: 3,
    q: "Solve the pair of equations 2x + 3y = 11 and 2x − 4y = −24, and hence find the value of m for which y = mx + 3.",
    a: "Subtract: (2x+3y) − (2x−4y) = 11 − (−24) ⇒ 7y = 35 ⇒ y = 5.\nSubstitute: 2x + 15 = 11 ⇒ 2x = −4 ⇒ x = −2.\nSolution: (−2, 5).\nNow y = mx + 3 with (−2, 5): 5 = m·(−2) + 3 ⇒ −2m = 2 ⇒ m = −1.",
  },
  {
    id: 106, ch: 3, subj: "maths", marks: 2,
    q: "For what value of k will the pair 2x + ky = 3 and 4x + 6y = 7 have infinitely many solutions?",
    a: "Infinitely many ⟺ 2/4 = k/6 = 3/7.\nBut 2/4 = 1/2 ≠ 3/7. The conditions cannot be simultaneously satisfied — there is NO value of k for which the system has infinitely many solutions (the constant-term ratio already disagrees).",
  },
  {
    id: 107, ch: 4, subj: "maths", marks: 2,
    q: "Find the roots of 2x² − 7x + 3 = 0 by factorisation.",
    a: "2x² − 7x + 3 = 2x² − 6x − x + 3\n= 2x(x − 3) − 1(x − 3)\n= (2x − 1)(x − 3)\nRoots: x = 1/2 and x = 3.",
  },
  {
    id: 108, ch: 4, subj: "maths", marks: 3,
    q: "Find the values of k for which the quadratic kx² + 6x + 1 = 0 has two distinct real roots.",
    a: "Two distinct real roots ⟺ D > 0.\nD = 6² − 4·k·1 = 36 − 4k > 0 ⇒ 4k < 36 ⇒ k < 9.\nAlso k ≠ 0 (else not quadratic).\n∴ k ∈ (−∞, 0) ∪ (0, 9).",
  },
  {
    id: 109, ch: 5, subj: "maths", marks: 2,
    q: "The 4th term of an AP is 11 and the 7th term is 20. Find the AP.",
    a: "a₄ = a + 3d = 11  ... (i)\na₇ = a + 6d = 20  ... (ii)\nSubtract (i) from (ii): 3d = 9 ⇒ d = 3.\nThen a = 11 − 9 = 2.\nThe AP is 2, 5, 8, 11, 14, 17, 20, …",
  },
  {
    id: 110, ch: 5, subj: "maths", marks: 3,
    q: "Find the sum of the first 25 terms of the AP whose nth term is given by aₙ = 7 − 4n.",
    a: "a₁ = 7 − 4 = 3, a₂ = 7 − 8 = −1 ⇒ d = −4.\nS₂₅ = (25/2)[2a + (n−1)d] = (25/2)[6 + 24·(−4)]\n= (25/2)[6 − 96] = (25/2)·(−90) = 25·(−45) = −1125.",
  },
  {
    id: 111, ch: 6, subj: "maths", marks: 2,
    q: "In ΔABC, DE ∥ BC where D is on AB and E is on AC. If AD = 2 cm, DB = 3 cm and AE = 4 cm, find EC.",
    a: "By BPT, AD/DB = AE/EC.\n2/3 = 4/EC ⇒ EC = (3·4)/2 = 6 cm.",
  },
  {
    id: 112, ch: 6, subj: "maths", marks: 3,
    q: "Two triangles are similar. The ratio of their corresponding medians is 3:5. Find the ratio of their perimeters and the ratio of their areas.",
    a: "For similar figures, all corresponding linear measurements are in the same ratio.\nPerimeter ratio = median ratio = 3 : 5.\nArea ratio = (linear ratio)² = 3² : 5² = 9 : 25.",
  },
  {
    id: 113, ch: 7, subj: "maths", marks: 2,
    q: "Find a point on the x-axis which is equidistant from the points (2, −5) and (−2, 9).",
    a: "Let P(x, 0) on the x-axis.\nDistance to (2, −5): √((x−2)² + 25)\nDistance to (−2, 9): √((x+2)² + 81)\nEquating squares: (x−2)² + 25 = (x+2)² + 81\nx² − 4x + 4 + 25 = x² + 4x + 4 + 81\n−4x + 29 = 4x + 85 ⇒ −8x = 56 ⇒ x = −7.\nRequired point: (−7, 0).",
  },
  {
    id: 114, ch: 7, subj: "maths", marks: 3,
    q: "Find the coordinates of the point which divides the segment joining (4, −3) and (8, 5) in the ratio 3:1 internally.",
    a: "Section formula (m:n = 3:1):\nx = (3·8 + 1·4)/(3+1) = (24 + 4)/4 = 7\ny = (3·5 + 1·(−3))/(3+1) = (15 − 3)/4 = 3\nRequired point: (7, 3).",
  },
  {
    id: 115, ch: 8, subj: "maths", marks: 2,
    q: "A kite is flying at a height of 60 m above the ground. The string is taut and makes an angle of 60° with the ground. Find the length of the string (√3 = 1.73).",
    a: "sin 60° = height / string = 60/L\nL = 60 / (√3/2) = 120/√3 = 40√3 m ≈ 40·1.73 ≈ 69.2 m.",
  },
  {
    id: 116, ch: 8, subj: "maths", marks: 3,
    q: "From a point on the ground, the angles of elevation of the bottom and top of a transmission tower fixed on top of a 20 m tall building are 45° and 60° respectively. Find the height of the tower.",
    a: "Let the tower height = h. Total height = 20 + h.\nDistance from foot: tan 45° = 20/d ⇒ d = 20 m.\nThen tan 60° = (20 + h)/d ⇒ √3 = (20 + h)/20\n⇒ 20 + h = 20√3 ⇒ h = 20(√3 − 1) ≈ 20·0.732 ≈ 14.64 m.",
  },
  {
    id: 117, ch: 9, subj: "maths", marks: 2,
    q: "Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.",
    a: "Let PT be a tangent at point T on a circle with centre O.\nAssume, for contradiction, that PT is NOT perpendicular to OT.\nThen there is some other point Q on PT (Q ≠ T) such that OQ is perpendicular to PT (the shortest distance from O to line PT).\nSince OT is a radius and Q is outside the circle (the tangent meets the circle only at T), OQ < OT (perpendicular is shortest). But T is on the circle, so OT = radius. Hence OQ < radius ⇒ Q is inside the circle. But a tangent meets the circle at exactly one point — Q cannot lie on the circle. Yet if Q is inside the circle, the line PT meets the circle at two points (since it passes through T on the circle and Q inside), contradicting PT being a tangent.\n∴ OT ⟂ PT.",
  },
  {
    id: 118, ch: 9, subj: "maths", marks: 3,
    q: "Two tangents PA and PB are drawn from an external point P to a circle with centre O. If ∠APB = 50°, find ∠OAB.",
    a: "Join OA, OB, OP. ∠OAP = ∠OBP = 90° (radius ⟂ tangent).\nIn quadrilateral OAPB: ∠AOB = 360° − 90° − 90° − 50° = 130°.\nIn ΔOAB, OA = OB (radii) ⇒ Δ isosceles ⇒ ∠OAB = ∠OBA.\n∠OAB + ∠OBA + ∠AOB = 180° ⇒ 2∠OAB + 130° = 180° ⇒ ∠OAB = 25°.",
  },
  {
    id: 119, ch: 10, subj: "maths", marks: 2,
    q: "Find the area of a sector of a circle of radius 21 cm with central angle 60° (π = 22/7).",
    a: "A = (θ/360)·πr² = (60/360)·(22/7)·21²\n= (1/6)·(22/7)·441 = (1/6)·1386 = 231 cm².",
  },
  {
    id: 120, ch: 11, subj: "maths", marks: 2,
    q: "Find the volume and total surface area of a hemisphere of radius 7 cm (π = 22/7).",
    a: "Volume: V = (2/3)πr³ = (2/3)·(22/7)·343 = (2/3)·1078 = 718.67 cm³.\nTotal surface area: TSA = 3πr² = 3·(22/7)·49 = 3·154 = 462 cm².",
  },
];

// =================== LONG QA (4-5 marks) ===================
export const MATHS_LONG_QA: MATHSQA[] = [
  {
    id: 201, ch: 1, subj: "maths", marks: 5,
    q: "Prove that √5 is irrational. Hence show that 3 + 2√5 is irrational.",
    a: "Part 1: Prove √5 irrational.\nAssume √5 = a/b, where a, b are coprime positive integers.\nThen 5 = a²/b² ⇒ a² = 5b² ⇒ 5 | a² ⇒ 5 | a (since 5 is prime).\nSo a = 5k for some integer k. Then (5k)² = 5b² ⇒ 25k² = 5b² ⇒ b² = 5k² ⇒ 5 | b² ⇒ 5 | b.\nBut this means both a and b are divisible by 5, contradicting a, b coprime.\n∴ √5 is irrational.\n\nPart 2: Show 3 + 2√5 is irrational.\nAssume 3 + 2√5 = p/q with p, q integers (q ≠ 0).\nThen 2√5 = p/q − 3 = (p − 3q)/q ⇒ √5 = (p − 3q)/(2q).\nSince p, q are integers, (p − 3q)/(2q) is rational — contradiction (we proved √5 irrational).\n∴ 3 + 2√5 is irrational.",
  },
  {
    id: 202, ch: 4, subj: "maths", marks: 5,
    q: "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.",
    a: "Let the speed of the train be x km/h (x > 0).\nTime taken = 360/x hours.\nWith speed (x + 5), time = 360/(x + 5).\nGiven: 360/x − 360/(x + 5) = 1\n⇒ 360[(x + 5) − x] / [x(x + 5)] = 1\n⇒ 360·5 = x(x + 5)\n⇒ x² + 5x − 1800 = 0\n⇒ x = [−5 ± √(25 + 7200)] / 2 = [−5 ± √7225]/2 = [−5 ± 85]/2.\nDiscarding the negative root: x = 80/2 = 40.\n∴ Speed of the train = 40 km/h.",
  },
  {
    id: 203, ch: 5, subj: "maths", marks: 5,
    q: "The ratio of the sums of the first m and first n terms of an AP is m² : n². Show that the ratio of its mth and nth terms is (2m − 1) : (2n − 1).",
    a: "Let the AP have first term a and common difference d.\nSₘ = (m/2)[2a + (m−1)d]   ;   Sₙ = (n/2)[2a + (n−1)d]\nGiven Sₘ/Sₙ = m²/n²:\n[m·(2a + (m−1)d)] / [n·(2a + (n−1)d)] = m²/n²\nCross-multiplying: n·(2a + (m−1)d) = m·(2a + (n−1)d)\n⇒ 2an + n(m−1)d = 2am + m(n−1)d\n⇒ 2a(n − m) + d[nm − n − mn + m] = 0\n⇒ 2a(n − m) + d(m − n) = 0\n⇒ (n − m)(2a − d) = 0\nEither n = m (trivial) or 2a = d. The substantive case is 2a = d, i.e. a = d/2.\n\nNow mth term: aₘ = a + (m − 1)d = d/2 + (m − 1)d = d·[1/2 + m − 1] = d(2m − 1)/2.\nSimilarly aₙ = d(2n − 1)/2.\nRatio: aₘ/aₙ = (2m − 1)/(2n − 1).\n∴ aₘ : aₙ = (2m − 1) : (2n − 1).  Hence proved.",
  },
  {
    id: 204, ch: 6, subj: "maths", marks: 5,
    q: "State and prove the Basic Proportionality Theorem (Thales' theorem).",
    a: "Statement: If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then the other two sides are divided in the same ratio.\n\nGiven: ΔABC with DE ∥ BC, where D lies on AB and E lies on AC.\nTo prove: AD/DB = AE/EC.\n\nConstruction: Join BE and CD. Draw EM ⟂ AB and DN ⟂ AC.\n\nProof:\nArea(ADE) = (1/2)·AD·EM      [base AD, height EM]\nArea(BDE) = (1/2)·DB·EM      [same height EM from E]\n∴ Area(ADE)/Area(BDE) = AD/DB        ... (i)\n\nArea(ADE) = (1/2)·AE·DN      [base AE, height DN]\nArea(DCE) = (1/2)·EC·DN      [same height DN from D]\n∴ Area(ADE)/Area(DCE) = AE/EC        ... (ii)\n\nNow ΔBDE and ΔDCE share the same base DE and lie between the same parallels DE ∥ BC, so they have equal areas.\n∴ Area(BDE) = Area(DCE).\nFrom (i) and (ii): Area(ADE)/Area(BDE) = Area(ADE)/Area(DCE).\n∴ AD/DB = AE/EC.  Hence proved.",
  },
  {
    id: 205, ch: 8, subj: "maths", marks: 5,
    q: "From a point P on the ground, the angle of elevation of the top of a 10 m tall building is 30°. A flag is hosted on top of the building and from P, the angle of elevation of the top of the flag is 45°. Find the length of the flag.",
    a: "Let the height of the flag = h metres. Total height of (building + flag) = (10 + h) m.\nLet the distance from P to the foot of the building = d.\n\nFrom the building alone:\n  tan 30° = 10/d  ⇒  1/√3 = 10/d  ⇒  d = 10√3 m.\n\nFrom the building + flag:\n  tan 45° = (10 + h)/d  ⇒  1 = (10 + h)/(10√3)\n  ⇒ 10 + h = 10√3\n  ⇒ h = 10√3 − 10 = 10(√3 − 1) m\n  ≈ 10 × (1.732 − 1) = 10 × 0.732 ≈ 7.32 m.\n\n∴ Length of the flag ≈ 7.32 m.",
  },
  {
    id: 206, ch: 9, subj: "maths", marks: 4,
    q: "Prove that the lengths of two tangents drawn from an external point to a circle are equal.",
    a: "Given: A circle with centre O. P is an external point. PA and PB are tangents to the circle at points A and B respectively.\nTo prove: PA = PB.\n\nConstruction: Join OA, OB, OP.\n\nProof:\n• OA ⟂ PA and OB ⟂ PB (the radius to the point of contact is perpendicular to the tangent).\n  So ∠OAP = ∠OBP = 90°.\n• In right triangles ΔOAP and ΔOBP:\n  – OA = OB  (radii of the same circle)\n  – OP = OP  (common hypotenuse)\n  – ∠OAP = ∠OBP = 90°\n  ∴ ΔOAP ≅ ΔOBP  (RHS congruence)\n• Hence PA = PB  (CPCT).\n\n∴ The lengths of the two tangents drawn from an external point to a circle are equal.",
  },
  {
    id: 207, ch: 10, subj: "maths", marks: 5,
    q: "In a circle of radius 21 cm, an arc subtends an angle of 60° at the centre. Find (i) the length of the arc, (ii) the area of the sector, and (iii) the area of the corresponding major segment (π = 22/7).",
    a: "Given r = 21 cm, θ = 60°.\n\n(i) Arc length l = (θ/360)·2πr = (60/360)·2·(22/7)·21\n   = (1/6)·132 = 22 cm.\n\n(ii) Sector area = (θ/360)·πr² = (1/6)·(22/7)·441\n   = (1/6)·1386 = 231 cm².\n\n(iii) Minor segment area = sector − triangle.\n   Triangle area = (1/2)·r²·sin θ = (1/2)·441·sin 60° = (1/2)·441·(√3/2) = 441√3/4 cm².\n   Using √3 ≈ 1.732: ≈ 1102.5·0.433 ≈ 190.96 cm².\n   Minor segment ≈ 231 − 190.96 = 40.04 cm².\n   Total circle area = πr² = (22/7)·441 = 1386 cm².\n   Major segment area = 1386 − 40.04 ≈ 1345.96 cm².\n\n(Exact form: major segment = 1155 + 441√3/4 cm².)",
  },
  {
    id: 208, ch: 11, subj: "maths", marks: 5,
    q: "A metallic sphere of radius 10.5 cm is melted and recast into a cylinder of radius 7 cm. Find the height of the cylinder (π = 22/7).",
    a: "Volume is conserved (melting & recasting).\n\nVolume of sphere = (4/3)πR³ = (4/3)·(22/7)·(10.5)³\n10.5³ = 1157.625\nVolume = (4/3)·(22/7)·1157.625 = (4/3)·22·165.375 = (4/3)·3638.25 = 4851 cm³.\n\nLet the height of the cylinder be h.\nVolume of cylinder = πr²h = (22/7)·49·h = 22·7·h = 154h cm³.\n\nEquating: 154h = 4851 ⇒ h = 4851/154 = 31.5 cm.\n\n∴ Height of the cylinder = 31.5 cm.",
  },
  {
    id: 209, ch: 12, subj: "maths", marks: 5,
    q: "The following frequency distribution gives the monthly consumption of electricity of 68 consumers of a locality. Find the median, mean and mode of the data.\n\nMonthly consumption (in units): 65–85, 85–105, 105–125, 125–145, 145–165, 165–185, 185–205\nNumber of consumers: 4, 5, 13, 20, 14, 7, 5",
    a: "Total n = 68, so n/2 = 34.\nCumulative frequencies: 4, 9, 22, 42, 56, 63, 68.\nThe cumulative frequency first ≥ 34 is 42, in class 125–145 ⇒ median class = 125–145.\nMedian = l + [(n/2 − cf)/f]·h = 125 + [(34 − 22)/20]·20 = 125 + 12 = 137 units.\n\nMean (by direct method):\nClass marks xᵢ: 75, 95, 115, 135, 155, 175, 195\nΣfᵢxᵢ = 4(75) + 5(95) + 13(115) + 20(135) + 14(155) + 7(175) + 5(195)\n      = 300 + 475 + 1495 + 2700 + 2170 + 1225 + 975 = 9340.\nMean = 9340/68 ≈ 137.35 units.\n\nMode: Highest frequency = 20 in 125–145 ⇒ modal class = 125–145.\nf₁ = 20, f₀ = 13, f₂ = 14, l = 125, h = 20.\nMode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)]·h = 125 + [(20 − 13)/(40 − 13 − 14)]·20 = 125 + [7/13]·20 ≈ 125 + 10.77 ≈ 135.77 units.\n\n∴ Median ≈ 137 units, Mean ≈ 137.35 units, Mode ≈ 135.77 units.",
  },
  {
    id: 210, ch: 13, subj: "maths", marks: 4,
    q: "A die is thrown once. Find the probability of getting (i) a prime number, (ii) a number lying between 2 and 6, (iii) an odd number.",
    a: "Sample space S = {1, 2, 3, 4, 5, 6}, n(S) = 6.\n\n(i) Prime numbers on a die: {2, 3, 5} ⇒ 3 favourable.\n    P(prime) = 3/6 = 1/2.\n\n(ii) Numbers lying between 2 and 6 (i.e. 3, 4, 5): {3, 4, 5} ⇒ 3 favourable.\n    P(between 2 and 6) = 3/6 = 1/2.\n\n(iii) Odd numbers: {1, 3, 5} ⇒ 3 favourable.\n    P(odd) = 3/6 = 1/2.\n\nInteresting coincidence: all three events have probability 1/2.",
  },
];

// =================== FORMULA SHEET ===================
export const MATHS_FORMULAS: MATHSFormulaData = {
  cats: [
    {
      cat: "Real Numbers & Number Theory",
      icon: "🔢",
      formulas: [
        { title: "Euclid's Division Lemma", text: "a = b·q + r,  0 ≤ r < b", note: "Foundation of HCF & divisibility proofs." },
        { title: "HCF × LCM (two numbers)", text: "HCF(a,b) × LCM(a,b) = a × b", note: "Works for two positive integers only." },
        { title: "LCM from HCF", text: "LCM(a,b) = (a × b) / HCF(a,b)", note: "Quick route once HCF is known." },
        { title: "Terminating Decimal Test", text: "p/q terminates ⟺ q = 2^m · 5^n", note: "After simplifying the fraction." },
      ],
    },
    {
      cat: "Polynomials",
      icon: "✏️",
      formulas: [
        { title: "Quadratic: Sum of Zeros", text: "α + β = −b / a", note: "For ax² + bx + c, a ≠ 0." },
        { title: "Quadratic: Product of Zeros", text: "αβ = c / a", note: "Constant term ÷ leading coefficient." },
        { title: "Cubic: Sums of Zeros", text: "α+β+γ = −b/a\nαβ + βγ + γα = c/a\nαβγ = −d/a", note: "For ax³ + bx² + cx + d." },
        { title: "Remainder Theorem", text: "p(x) ÷ (x − a) → remainder p(a)", note: "Substitute a into p(x)." },
        { title: "Factor Theorem", text: "(x − a) | p(x) ⟺ p(a) = 0", note: "Zero of p ⟺ linear factor." },
      ],
    },
    {
      cat: "Linear Equations",
      icon: "📈",
      formulas: [
        { title: "Consistency Test (ratios)", text: "a₁/a₂, b₁/b₂, c₁/c₂:\n≠ → unique; = = ≠ → none; = = = → infinite", note: "Apply before solving." },
        { title: "Cross-Multiplication", text: "x = (b₁c₂ − b₂c₁)/(a₁b₂ − a₂b₁)\ny = (c₁a₂ − c₂a₁)/(a₁b₂ − a₂b₁)", note: "Direct solution when consistent." },
      ],
    },
    {
      cat: "Quadratic Equations",
      icon: "🟦",
      formulas: [
        { title: "Quadratic Formula", text: "x = (−b ± √(b² − 4ac)) / 2a", note: "Universal — solves any quadratic." },
        { title: "Discriminant", text: "D = b² − 4ac", note: "D>0 two distinct real; D=0 equal; D<0 no real." },
        { title: "Sum & Product of Roots", text: "α + β = −b/a\nαβ = c/a", note: "Same as polynomial zeros (it's the same idea)." },
        { title: "Forming Equation from Roots", text: "x² − (α+β)x + αβ = 0", note: "Leading coefficient 1." },
      ],
    },
    {
      cat: "Arithmetic Progressions",
      icon: "➗",
      formulas: [
        { title: "nth Term", text: "aₙ = a + (n − 1)d", note: "a = first term, d = common difference." },
        { title: "Sum of n Terms", text: "Sₙ = (n/2)[2a + (n − 1)d]", note: "Alt: Sₙ = (n/2)(a + ℓ), ℓ = last term." },
        { title: "Common Difference", text: "d = aₙ − aₙ₋₁", note: "Defining property of an AP." },
        { title: "Three-in-AP Test", text: "a, b, c in AP ⟺ 2b = a + c", note: "Arithmetic mean property." },
      ],
    },
    {
      cat: "Triangles & Similarity",
      icon: "📐",
      formulas: [
        { title: "BPT (Thales)", text: "DE ∥ BC in ΔABC ⟹ AD/DB = AE/EC", note: "And AD/AB = AE/AC." },
        { title: "Similarity Ratio k", text: "sides : k · perimeter : k · areas : k²", note: "Area ratio is squared; do not forget." },
        { title: "Pythagoras", text: "AC² = AB² + BC²", note: "Right-angled triangles only." },
      ],
    },
    {
      cat: "Coordinate Geometry",
      icon: "🧭",
      formulas: [
        { title: "Distance Formula", text: "d = √[(x₂ − x₁)² + (y₂ − y₁)²]", note: "Length of a segment." },
        { title: "Section Formula (m:n)", text: "P = ( (m·x₂ + n·x₁)/(m+n), (m·y₂ + n·y₁)/(m+n) )", note: "Internal division. Midpoint: m = n = 1." },
        { title: "Centroid", text: "G = ( (x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3 )", note: "Average of three vertices." },
        { title: "Area of Triangle", text: "A = ½ |x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|", note: "A = 0 ⟺ three points collinear." },
      ],
    },
    {
      cat: "Trigonometry & Heights/Distances",
      icon: "📐",
      formulas: [
        { title: "Right-Triangle Ratios", text: "sin θ = opp/hyp\ncos θ = adj/hyp\ntan θ = opp/adj", note: "opp = opposite, adj = adjacent to θ." },
        { title: "Standard Angles", text: "tan 30° = 1/√3\ntan 45° = 1\ntan 60° = √3", note: "Most-used for heights & distances." },
        { title: "Heights & Distances Setup", text: "height = base · tan θ\nbase = height / tan θ", note: "Angle of depression = angle of elevation." },
      ],
    },
    {
      cat: "Circles — Tangents",
      icon: "⭕",
      formulas: [
        { title: "Tangent ⟂ Radius", text: "OT ⟂ PT", note: "T = point of contact, O = centre." },
        { title: "Equal Tangents from External Point", text: "PA = PB", note: "P external; A, B on circle." },
        { title: "Tangent–Centre Angle Relation", text: "∠APB + ∠AOB = 180°", note: "Quadrilateral OAPB has two right angles." },
        { title: "Tangent Length from Distance d", text: "t = √(d² − r²)", note: "d = distance from centre, r = radius." },
      ],
    },
    {
      cat: "Area Related to Circles",
      icon: "🌀",
      formulas: [
        { title: "Circumference & Area", text: "C = 2πr\nA = πr²", note: "Use π = 22/7 unless stated." },
        { title: "Arc Length", text: "l = (θ/360)·2πr", note: "θ in degrees." },
        { title: "Sector Area", text: "A_sector = (θ/360)·πr² = ½·r·l", note: "Two equivalent forms." },
        { title: "Segment Area", text: "A_segment = A_sector − A_triangle", note: "A_triangle = ½·r²·sin θ." },
        { title: "Perimeter of Sector", text: "P = 2r + l", note: "Arc + TWO radii." },
      ],
    },
    {
      cat: "Surface Areas & Volumes",
      icon: "🧊",
      formulas: [
        { title: "Cylinder", text: "CSA = 2πrh\nTSA = 2πr(r + h)\nV = πr²h", note: "r = radius, h = height." },
        { title: "Cone", text: "l = √(r² + h²)\nCSA = πrl\nTSA = πr(l + r)\nV = (1/3)πr²h", note: "l = slant height. Verify l first!" },
        { title: "Sphere", text: "SA = 4πr²\nV = (4/3)πr³", note: "Single radius." },
        { title: "Hemisphere", text: "CSA = 2πr²\nTSA = 3πr²\nV = (2/3)πr³", note: "TSA includes the flat circular face." },
        { title: "Hollow Cylinder (pipe)", text: "V = πh(R² − r²)\nCSA = 2πh(R + r)", note: "R outer, r inner radius." },
      ],
    },
    {
      cat: "Statistics",
      icon: "📊",
      formulas: [
        { title: "Mean (direct)", text: "x̄ = Σfᵢxᵢ / Σfᵢ", note: "Use class marks for grouped data." },
        { title: "Mean (assumed mean)", text: "x̄ = a + (Σfᵢdᵢ / Σfᵢ),  dᵢ = xᵢ − a", note: "a = assumed mean, large values." },
        { title: "Mean (step-deviation)", text: "x̄ = a + (Σfᵢuᵢ / Σfᵢ)·h,  uᵢ = (xᵢ − a)/h", note: "Equal class widths only." },
        { title: "Mode (grouped)", text: "Mode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)]·h", note: "l = lower limit of modal class." },
        { title: "Median (grouped)", text: "Median = l + [(n/2 − cf)/f]·h", note: "cf = cumulative freq before median class." },
        { title: "Empirical Relation", text: "3·Median = Mode + 2·Mean", note: "Cross-checks the three." },
      ],
    },
    {
      cat: "Probability",
      icon: "🎲",
      formulas: [
        { title: "Classical Probability", text: "P(E) = n(E) / n(S)", note: "Equally likely outcomes." },
        { title: "Complement Rule", text: "P(E) + P(not E) = 1", note: "Range 0 ≤ P ≤ 1." },
        { title: "Deck of Cards", text: "52 cards · 4 suits × 13 · 12 face · 4 aces", note: "26 red, 26 black." },
        { title: "Two Dice Sample Space", text: "n(S) = 36", note: "Ordered pairs (a, b), 1 ≤ a, b ≤ 6." },
        { title: "Three Coins Sample Space", text: "n(S) = 8", note: "HHH, HHT, HTH, HTT, THH, THT, TTH, TTT." },
      ],
    },
  ],
};

export const MATHS_DEEP_DIVE: Record<number, string[]> = {
  1: [
    "Euclid's division lemma (a = bq + r) looks like simple long division, but its real power is as a proof engine, not a calculation tool. The Euclidean algorithm for HCF works by repeatedly applying this lemma — divide, take the remainder, divide again — because any common factor of a and b must also divide the remainder r, so the HCF never changes as you shrink the numbers, only the numbers get smaller until you hit zero.",
    "The Fundamental Theorem of Arithmetic (every number factors into primes in exactly one way) is what makes 'HCF × LCM = a × b' true: since every prime factor in a and b is accounted for either in the HCF (shared primes) or spread across the LCM (all primes, highest powers), multiplying HCF and LCM together reconstructs exactly a × b, no more, no less.",
    "Proving √2 is irrational isn't really about square roots — it's a proof by contradiction that leans entirely on unique prime factorisation. Assuming √2 = a/b in lowest terms forces 2 to divide both a and b (via 'if p is prime and p divides a², then p divides a'), which contradicts 'lowest terms' by definition. The same three-line argument works for any prime p, which is why √3, √5, and √7 all get proved the identical way — once you see the template, you don't need to memorise three separate proofs.",
  ],
  2: [
    "A polynomial's zeros and its graph are the same information told two different ways: algebraically, a zero is a value of x where p(x) = 0; geometrically, that's exactly where the curve crosses the x-axis. This is why 'how many zeros does this graph have' is really just asking you to count x-intercepts — no algebra required, just reading the picture.",
    "The relationship between zeros and coefficients (sum = -b/a, product = c/a for a quadratic) isn't a coincidence to memorise — it drops straight out of expanding k(x-α)(x-β) and matching it to ax²+bx+c term by term. Once you see that expansion once, you can rebuild the sum/product formulas from scratch any time you forget them, rather than needing to recall them cold.",
    "The Remainder Theorem (dividing by x-a leaves remainder p(a)) and the Factor Theorem (x-a is a factor exactly when p(a)=0) are really the same idea at two different remainder values: the Factor Theorem is just the special case of the Remainder Theorem where the remainder happens to be zero. Seeing them as one idea, not two, halves what you need to remember.",
  ],
  3: [
    "Two linear equations in two variables are two lines, and every possible outcome (unique solution, no solution, infinite solutions) corresponds to exactly one way two lines can relate to each other in a plane: they cross once, they're parallel and never meet, or they're actually the same line stacked on itself. The ratio test (comparing a₁/a₂, b₁/b₂, c₁/c₂) is just a fast algebraic way to answer 'which of these three pictures am I looking at?' without having to draw anything.",
    "Substitution and elimination aren't two unrelated techniques — they're the same goal (reduce two unknowns to one) reached by different routes. Substitution isolates one variable and replaces it everywhere; elimination scales the equations so a variable's coefficients match and then cancels by adding or subtracting. Picking whichever one requires less arithmetic for a given problem is really just picking the shorter route to the same destination.",
    "Word problems in this chapter are hard mainly because of translation, not algebra — once 'a two-digit number' becomes 10x+y, or 'five years ago' becomes x-5, the rest is mechanical. The upstream/downstream framing (boat speed ± stream speed) is a good example: it looks like a new topic, but it's just 'define two unknowns, write two equations from two conditions', identical to every other word problem in the chapter.",
  ],
  4: [
    "The quadratic formula isn't handed down from nowhere — it comes directly from completing the square on ax²+bx+c=0. That connection matters because 'completing the square' as a technique reappears constantly in higher maths, and seeing the quadratic formula as its natural conclusion (rather than a formula to just memorise) makes both easier to retain.",
    "The discriminant (D = b²-4ac) is doing real geometric work, not just producing a number: it's literally what's inside the square root in the quadratic formula, so its sign directly determines whether that square root is a real number (two distinct roots), exactly zero (one repeated root, where the parabola just touches the x-axis), or negative (no real square root exists, so the parabola never crosses the x-axis at all). The three cases of D aren't rules to memorise — they're a direct consequence of what square roots of negative numbers mean.",
    "Word problems here (ages, consecutive integers, areas) generate quadratics naturally because 'product of two related unknowns' or 'unknown times itself' are inherently second-degree relationships. The step students most often skip — rejecting a root that doesn't make physical sense (negative age, negative length) — matters because the algebra doesn't know it's modelling a real situation; only you can filter the mathematically valid answer down to the physically valid one.",
  ],
  5: [
    "An arithmetic progression is defined by one property — constant difference between consecutive terms — and every formula in this chapter is a consequence of that single fact, not an independent rule. The nth term formula (a + (n-1)d) is just 'start at a and add d, n-1 times'; there's nothing more to memorise once that picture is clear.",
    "The sum formula Sₙ = (n/2)(a+l) has a beautiful shortcut hiding in it: pairing the first and last term, the second and second-last, and so on, each pair sums to exactly (a+l), and there are n/2 such pairs — this is the same trick young Gauss reportedly used to sum 1 to 100 instantly, and it's why the formula works even before you've derived it algebraically.",
    "Word problems (rows of seats increasing by a fixed amount, instalments growing steadily) are AP problems in disguise the moment you spot a constant increase or decrease — the skill isn't new algebra, it's recognising 'this situation has constant difference' and then mapping the situation's language onto a, d, and n.",
  ],
  6: [
    "Similar triangles generalise congruent triangles by relaxing 'exactly the same size' to 'exactly the same shape' — same angles, proportional sides. This is why congruence criteria (SSS, SAS, AA) reappear here almost unchanged, just with 'equal sides' loosened to 'proportional sides': similarity is congruence's more flexible cousin, not a separate topic.",
    "The Basic Proportionality Theorem (a line parallel to one side of a triangle divides the other two proportionally) is really about similar triangles hiding inside a single triangle: the small triangle cut off by the parallel line is similar to the whole triangle (same angles, since the line is parallel), and proportional sides is just what similarity means applied to this specific picture.",
    "That area ratio equals the *square* of the side ratio (not the ratio itself) is a fact worth sitting with rather than memorising: area scales with length × length, so if every linear dimension scales by k, area scales by k × k = k². This is the same reason doubling a photo's width and height quadruples its area, not doubles it — and it's why students who forget to square the ratio get answers off by exactly that factor.",
  ],
  7: [
    "Coordinate geometry's core move is translating geometric questions ('are these three points on a line?', 'what's the distance between two points?') into pure algebra, using the coordinate grid as the translator. The distance formula is nothing more than the Pythagorean theorem applied to the horizontal and vertical gap between two points — draw the right triangle those two points make with a third point, and the formula falls straight out.",
    "The section formula generalises the midpoint formula rather than replacing it: midpoint is just the section formula with the ratio locked at 1:1 (splitting the segment exactly in half). Once that's clear, the midpoint formula stops being a separate thing to memorise and becomes a special case you can derive on the spot.",
    "Using the area-of-a-triangle formula to test collinearity is a clever repurposing worth noticing: if three points are exactly on a line, the 'triangle' they form has literally zero area (zero height), so setting the area formula equal to zero and solving is just algebra doing geometric reasoning for you — no need to compute slopes separately, though that's an equally valid check.",
  ],
  8: [
    "This entire chapter is one recurring move: turn a real-world height-and-distance scenario into a right triangle, then pick whichever trig ratio connects the two quantities you know to the one you want. The 'angle of elevation equals angle of depression' fact isn't a new rule to learn — it's just alternate interior angles from parallel lines (the horizontal line of sight and the horizontal ground), a fact already known from geometry, applied in a new context.",
    "Choosing which ratio to use (sin, cos, or tan) is really about identifying what's known and unknown relative to the right angle: if the problem gives you height and distance-along-the-ground, you want tan (opposite/adjacent); if a ladder or slanted wire is involved, the hypotenuse is now in play, which usually means sin or cos instead. Drawing the triangle first — labelling opposite, adjacent, hypotenuse relative to the given angle — turns 'which formula do I use' from a guess into an obvious next step.",
    "Two-observer or two-tower problems look harder only because there are two triangles instead of one; the actual technique doesn't change. Setting up a tan equation for each triangle and then combining them (often by elimination, the same technique from the Linear Equations chapter) shows how these 'application' chapters keep reusing the same underlying algebra toolkit in new dress.",
  ],
  9: [
    "The tangent-perpendicular-to-radius theorem is the single fact this whole chapter builds from, and it's worth understanding *why* it's true, not just that it's true: if the tangent line weren't perpendicular to the radius, it would necessarily cross the circle a second time somewhere nearby, which would make it a secant, not a tangent, by definition. Perpendicularity isn't decoration — it's the geometric condition that makes 'touches at exactly one point' possible at all.",
    "'Two tangents from an external point are equal in length' is proved using nothing more exotic than congruent right triangles: both triangles (formed by the centre, the external point, and each point of contact) share the same hypotenuse (the line from centre to external point) and have equal legs (both radii), so RHS congruence forces the third sides — the two tangent lengths — to be equal too. This single congruence argument is the proof examiners ask for almost every year.",
    "The quadrilateral OAPB (centre, two points of contact, external point) having two right angles automatically makes it cyclic, and that fact is what lets you connect the angle between the tangents (∠APB) to the angle at the centre (∠AOB) via the 180° supplementary relationship — a genuinely useful shortcut once you recognise the cyclic quadrilateral hiding in what looks like an ordinary tangent diagram.",
  ],
  10: [
    "A sector is just a 'slice' of a circle, and every sector formula is the corresponding full-circle formula scaled down by the fraction of the circle that slice represents (θ/360). This is why the arc length formula and the sector area formula have the exact same θ/360 factor in front — they're both asking 'what fraction of the whole circle is this?' and then applying that fraction to circumference or area respectively.",
    "A segment is the leftover piece once you cut a triangle out of a sector — literally sector area minus triangle area — which is why segment problems always require you to compute both pieces separately before subtracting. Seeing a segment as 'sector minus triangle' rather than a shape with its own formula avoids a whole category of formula-mixing errors.",
    "Combined-figure problems (a sector attached to a rectangle, for instance) are testing whether you can decompose a complex shape into simple pieces you already know how to handle — the actual sector and circle formulas don't get harder, there are just more of them stacked together, so a clear diagram with each piece labelled is doing most of the real work.",
  ],
  11: [
    "Surface area and volume formulas for cones, cylinders, and spheres all trace back to the same idea: volume measures how much three-dimensional space a solid occupies, and it's conserved when a solid is melted and recast into a new shape — nothing is lost, so 'set volume before equals volume after' is the only equation you ever need for recasting problems, regardless of how different the two shapes look.",
    "A cone's slant height (l = √(r²+h²)) is nothing but the Pythagorean theorem in disguise: unroll the cone's vertical cross-section and you'll see a right triangle with the radius and height as legs and the slant height as hypotenuse. This is why forgetting to compute l before using πrl is such a common trap — the formula silently assumes you've already done a Pythagoras step that isn't written anywhere on the page.",
    "Surface area, unlike volume, is *not* automatically conserved when combining or recasting solids — melting a shape into another can change the total surface area drastically, and combined solids (like a cone sitting on a cylinder) require you to subtract the hidden shared circle where the two pieces join, since that surface is now internal and shouldn't be counted twice. This is precisely the distinction the chapter is testing when it separates 'volume of combination' from 'surface area of combination' problems.",
  ],
  12: [
    "Mean, median, and mode for grouped data all try to answer the same question — 'what's a typical value?' — but each makes a different simplifying assumption to cope with data being bucketed into class intervals rather than known exactly. The assumed-mean and step-deviation methods aren't different concepts from the direct method, they're the same mean formula with algebra shortcuts (subtracting a convenient reference value, then dividing by class width) to keep the arithmetic manageable when the raw numbers are large.",
    "The empirical relation (3·Median = Mode + 2·Mean) exists because these three measures of central tendency are related but not identical, and for moderately skewed distributions this relationship holds approximately — which is exactly why it's useful as a cross-check: if you compute mean and median independently and the implied mode is wildly different from what you calculated directly, you likely made an arithmetic error somewhere.",
    "Ogives (cumulative frequency curves) turn the abstract idea of 'median' into something you can literally see: the 'less than' ogive rises as you accumulate more data, the 'more than' ogive falls as you have less data left to include, and the point where they cross is, by definition, where exactly half the data lies on each side — which is precisely what a median means.",
  ],
  13: [
    "Classical probability (favourable outcomes ÷ total outcomes) only works because of one assumption worth stating explicitly: every outcome in the sample space is equally likely. That assumption is why a fair coin and a fair die are the standard examples in this chapter — the moment outcomes aren't equally likely (a loaded die, a biased coin), this formula stops applying and you'd need a different approach entirely.",
    "The complement rule (P(E) + P(not E) = 1) is often the fastest route to an answer precisely because some events are much easier to count the *opposite* of than to count directly — 'at least one head in three tosses' is fiddly to count directly (several cases), but 'no heads at all' (just TTT) is a single easy case, so computing 1 minus that is often the shortest path.",
    "The recurring props in this chapter — a deck of cards, two dice, three coins — aren't random choices, they're the standard 'controlled sample spaces' of probability because their outcomes are easy to list exhaustively and are provably equally likely by construction. Once the 52-card structure (4 suits × 13, 12 face cards, 4 aces) and the 36-outcome two-dice grid are second nature, most exam questions become a matter of correctly identifying n(E) within a sample space you already know cold.",
  ],
};
